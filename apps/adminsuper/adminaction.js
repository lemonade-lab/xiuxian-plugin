import { plugin } from '../../api/api.js'
import { exec } from 'child_process'
import { AppName } from '../../app.config.js'
import { ForwardMsg } from '../../model/xiuxian.js'
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
                Bot.pickGroup(restart.id).sendMsg("更新成功[#重启]后生效~");
            } else {
                Bot.pickGroup(restart.id).sendMsg("更新成功[#重启]后生效~");
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
                ForwardMsg(e, msg);
            }
        );
        return false;
    }
}