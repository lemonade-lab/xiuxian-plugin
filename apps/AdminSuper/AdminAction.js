
import plugin from '../../../../lib/plugins/plugin.js';
import { createRequire } from "module";
import { ForwardMsg } from '../Xiuxian/Xiuxian.js';
const require = createRequire(import.meta.url);
const { exec } = require("child_process");
const _path = process.cwd();
let timer
export class AdminAction extends plugin {
    constructor() {
        super({
            name: "admin",
            dsc: "admin",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: "^#修仙更新",
                    fnc: "checkout",
                },
                {
                    reg: "^#修仙强制更新",
                    fnc: "forcecheckout",
                }
            ],
        });
        this.key = "xiuxian:restart";
    }

    async forcecheckout(e){
        if (!e.isMaster) {
            return;
        }
        let msg = ["————[更新消息]————"];
        let command = "git fetch --all && git reset --hard main && git  pull";
        msg.push("正在更新...");
        const that = this;
        exec(
            command,
            { cwd: `${_path}/plugins/xiuxian-emulator-plugin/` },
            function (error, stdout, stderr) {
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push("最新版修仙插件了~");
                    ForwardMsg(e, msg);
                    return;
                }
                if (error) {
                    msg.push(
                        "更新失败！\nError code: " +
                        error.code +
                        "\n" +
                        error.stack +
                        "\n 请稍后重试..."
                    );
                    ForwardMsg(e, msg);
                    return;
                }
                msg.push("更新成功，正在重启更新...");
                timer && clearTimeout(timer);
                timer = setTimeout(async () => {
                    try {
                        let data = JSON.stringify({
                            isGroup: !!e.isGroup,
                            id: e.isGroup ? e.group_id : e.user_id,
                        });
                        await redis.set(that.key, data, { EX: 120 });
                        let cm = "npm run start";
                        if (process.argv[1].includes("pm2")) {
                            cm = "npm run restart";
                        } else {
                            msg.push("正在转为后台运行...");
                        }
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key);
                                msg.push(
                                    "重启失败了\nError code: " +
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
                    } 
                    catch (error) {
                        redis.del(that.key);
                        let e = error.stack ?? error;
                        msg.push("重启失败了\n" + e);
                    }
                }, 1000);
                ForwardMsg(e, msg);
            }
        );
        return true;
    }

    async checkout(e) {
        if (!e.isMaster) {
            return;
        }
        let msg = ["————[更新消息]————"];
        let command = "git  pull";
        msg.push("正在更新...");
        const that = this;
        exec(
            command,
            { cwd: `${_path}/plugins/xiuxian-emulator-plugin/` },
            function (error, stdout, stderr) {
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push("最新版修仙插件了~");
                    ForwardMsg(e, msg);
                    return;
                }
                if (error) {
                    msg.push(
                        "更新失败！\nError code: " +
                        error.code +
                        "\n" +
                        error.stack +
                        "\n 请稍后重试..."
                    );
                    ForwardMsg(e, msg);
                    return;
                }
                msg.push("更新成功，正在重启更新...");
                timer && clearTimeout(timer);
                timer = setTimeout(async () => {
                    try {
                        let data = JSON.stringify({
                            isGroup: !!e.isGroup,
                            id: e.isGroup ? e.group_id : e.user_id,
                        });
                        await redis.set(that.key, data, { EX: 120 });
                        let cm = "npm run start";
                        if (process.argv[1].includes("pm2")) {
                            cm = "npm run restart";
                        } else {
                            msg.push("正在转为后台运行...");
                        }
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key);
                                msg.push(
                                    "重启失败了\nError code: " +
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
                    } 
                    catch (error) {
                        redis.del(that.key);
                        let e = error.stack ?? error;
                        msg.push("重启失败了\n" + e);
                    }
                }, 1000);
                ForwardMsg(e, msg);
            }
        );
        return true;
    }
    async init() {
        let restart = await redis.get(this.key);
        if (restart) {
            restart = JSON.parse(restart);
            if (restart.isGroup) {
                Bot.pickGroup(restart.id).sendMsg("重启成功！\n【#同步信息】\n【#重置配置】\n以确保正常使用。");
            } else {
                Bot.pickUser(restart.id).sendMsg("重启成功！\n【#同步信息】\n【#重置配置】\n以确保正常使用。");
            }
            redis.del(this.key);
        }
    }
}


