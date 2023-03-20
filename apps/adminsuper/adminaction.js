import { plugin } from '../../api/api.js'
import { ForwardMsg } from '../../model/xiuxian.js'
import { exec } from 'child_process'
import { AppName } from '../../app.config.js'
let timer
export class adminaction extends plugin {
    constructor() {
        super({
            name: "adminaction",
            dsc: "adminaction",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: "^#修仙(插件)?(强制)?更新",
                    fnc: "checkout",
                }
            ],
        });
        this.key = "xiuxian:restart";
    }
    async init() {
        let restart = await redis.get(this.key);
        if (restart) {
            restart = JSON.parse(restart);
            if (restart.isGroup) {
                Bot.pickGroup(restart.id).sendMsg("重启成功，新版修仙插件已经生效\n每次更新后请主人【#同步信息】\n以确保正常使用");
            } else {
                Bot.pickUser(restart.id).sendMsg("重启成功，新版修仙插件已经生效\n每次更新后请主人【#同步信息】\n以确保正常使用");
            }
            redis.del(this.key);
        }
    }
    async checkout() {
        if (!this.e.isMaster) return
        const isForce = this.e.msg.includes("强制");
        let e = this.e;
        let msg = ["————[更新消息]————"];
        let command = "git  pull";
        if (isForce) {
            command = "git fetch --all && git reset --hard master && git  pull";
            msg.push("正在执行强制更新操作，请稍等");
        } else {
            msg.push("正在执行更新操作，请稍等");
        }
        const that = this;
        exec(
            command,
            { cwd: `${process.cwd()}/plugins/${AppName}/` },
            function (error, stdout, stderr) {
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push("目前已经是最新版修仙插件了~");
                    ForwardMsg(e, msg);
                    return;
                }
                if (error) {
                    msg.push(
                        "修仙插件更新失败！\nError code: " +
                        error.code +
                        "\n" +
                        error.stack +
                        "\n 请稍后重试。"
                    );
                    ForwardMsg(e, msg);
                    return;
                }
                msg.push("修仙插件更新成功,正在尝试重新启动以应用更新...");
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
                            msg.push("当前为前台运行，重启将转为后台...");
                        }

                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key);
                                msg.push(
                                    "自动重启失败，请手动重启以应用新版修仙插件。\nError code: " +
                                    error.code +
                                    "\n" +
                                    error.stack +
                                    "\n"
                                );
                                logger.error(`重启失败\n${error.stack}`);
                            } else if (stdout) {
                                logger.mark("重启成功，运行已转为后台");
                                logger.mark("查看日志请用命令:npm run log");
                                logger.mark("停止后台运行命令:npm stop");
                                process.exit();
                            }
                        });
                    } catch (error) {
                        redis.del(this.key);
                        let e = error.stack ?? error;
                        msg.push("重启云崽操作失败！\n" + e);
                    }
                }, 1000);
                ForwardMsg(e, msg);
            }
        );
        return true;
    }
}