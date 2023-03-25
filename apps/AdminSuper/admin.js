import { plugin } from '../../api/api.js'
import { createRequire } from "module"
import { AppName } from '../../app.config.js'
const require = createRequire(import.meta.url)
const { exec } = require("child_process")
const _path = process.cwd()
let timer
export class admin extends plugin {
    constructor() {
        super({
            name: "管理|更新插件",
            dsc: "管理和更新代码",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: "^#修仙(插件)?(强制)?更新",
                    fnc: "checkout",
                },
            ],
        });
        this.key = "xiuxian:restart";
    }
    async checkout() {
        if (!this.e.isMaster) {
            return;
        }
        const isForce = this.e.msg.includes("强制");
        let command = "git  pull";
        if (isForce) {
            command = "git fetch --all && git reset --hard VersionTwo && git  pull";
            this.e.reply("正在执行强制更新操作，请稍等");
        } else {
            this.e.reply("正在执行更新操作，请稍等");
        }
        const that = this;
        exec(
            command,
            { cwd: `${_path}/plugins/${AppName}/` },
            function (error, stdout, stderr) {
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    that.e.reply("目前已经是最新版修仙插件了~");
                    return;
                }
                if (error) {
                    that.e.reply(
                        "修仙插件更新失败！\nError code: " +
                        error.code +
                        "\n" +
                        error.stack +
                        "\n 请稍后重试。"
                    );
                    return;
                }
                timer && clearTimeout(timer);
                timer = setTimeout(async () => {
                    try {
                        let data = JSON.stringify({
                            isGroup: !!that.e.isGroup,
                            id: that.e.isGroup ? that.e.group_id : that.e.user_id,
                        });
                        await redis.set(that.key, data, { EX: 120 });
                        let cm = "npm run start";
                        if (process.argv[1].includes("pm2")) {
                            cm = "npm run restart";
                        } else {
                            await that.e.reply("当前为前台运行，重启将转为后台...");
                        }
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key);
                                that.e.reply(
                                    "自动重启失败，请手动重启以应用新版修仙插件。\nError code: " +
                                    error.code +
                                    "\n" +
                                    error.stack +
                                    "\n"
                                );
                                logger.error(`重启失败\n${error.stack}`);
                            } else if (stdout) {
                                logger.mark("重启成功，运行已转为后台");
                                logger.mark("查看日志请用命令：npm run log");
                                logger.mark("停止后台运行命令：npm stop");
                                process.exit();
                            }
                        });
                    } catch (error) {
                        redis.del(this.key);
                        let e = error.stack ?? error;
                        that.e.reply(`重启云崽操作失败！\n${e}`);
                    }
                }, 1000);
            }
        );
        return true;
    }
}