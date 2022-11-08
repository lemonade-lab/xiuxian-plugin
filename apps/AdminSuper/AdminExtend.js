
import plugin from '../../../../lib/plugins/plugin.js';
import { ForwardMsg } from '../Xiuxian/Xiuxian.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { exec } = require("child_process");
const _path = process.cwd();
export class AdminExtend extends plugin {
    constructor() {
        super({
            name: "AdminExtend",
            dsc: "AdminExtend",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#加载修仙职业$',
                    fnc: 'Xiuxianloadoccupation'
                },
                {
                    reg: '^#卸载修仙职业$',
                    fnc: 'deleteloadoccupation'
                },
                {
                    reg: '^#加载修仙宗门$',
                    fnc: 'Xiuxianloadorganization'
                },
                {
                    reg: '^#卸载修仙宗门$',
                    fnc: 'deleteloadorganization'
                },
                {
                    reg: '^#修仙设置帮助$',
                    fnc: 'Xiuxianhelp'
                }
            ],
        });
    };

    async Xiuxianhelp(e){
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };

    async Xiuxianloadoccupation(e) {
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };

    async deleteloadoccupation(e) {
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };


    async Xiuxianloadorganization(e) {
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };

    async deleteloadorganization(e) {
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };
};

export async function updateshell(e,command){
    let msg = ["————[消息]————"];
    msg.push("正在执行...");
    exec(
        command,
        { cwd: `${_path}/plugins/xiuxian-emulator-plugin/plugins` },
        (error, stdout, stderr)=>{
            if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                msg.push("最新版了~");
                ForwardMsg(e, msg);
                return;
            };
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
            };
            msg.push("执行成功!");
            ForwardMsg(e, msg);
        }
    );
    return true;
}

