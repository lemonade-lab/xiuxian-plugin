import plugin from '../../../../../lib/plugins/plugin.js';
import os from 'os';
import { execSync } from 'child_process';
export class Statusplugin extends plugin {
    constructor() {
        super({
            name: 'Statusplugin',
            dsc: 'Statusplugin',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '#修仙运行状态$',
                    fnc: 'getCPUSTATE'
                },
                {
                    reg: '#清理系统缓存',
                    fnc: 'cleancache'
                }
            ]
        });
    };
    async getCPUSTATE(e) {
        if (!e.isGroup) {
            return;
        };
        var dealTime = (seconds) => {
            var seconds = seconds | 0;
            var day = (seconds / (3600 * 24)) | 0;
            var hours = ((seconds - day * 3600) / 3600) | 0;
            var minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
            var second = seconds % 60;
            (day < 10) && (day = '0' + day);
            (hours < 10) && (hours = '0' + hours);
            (minutes < 10) && (minutes = '0' + minutes);
            (second < 10) && (second = '0' + second);
            return [day, hours, minutes, second].join(':');
        };
        var dealMem = (mem) => {
            var G = 0,
                M = 0,
                KB = 0;
            (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
            (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
            (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
            return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B';
        };
        let msg = [];
        const pf = os.platform();
        msg.push("平台：" + pf + '\n');
        const uptime = os.uptime();
        msg.push("开机时间：" + dealTime(uptime) + '\n');
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        msg.push("内存大小：" + dealMem(totalMem) + "\n" + ' 空闲内存：' + dealMem(freeMem));
        e.reply(msg);
        return;
    };
    async cleancache(e) {
        if(!e.isMaster){
            e.reply("仅主人可操作")
            return;
        }
        e.reply("开始清理")
        execSync('sh cleanCache.sh', function (err, sto) {
            if(err){
                e.reply("error:执行清理脚本失败!")
            };
        })
        await e.reply("结束清理");
        await this.getCPUSTATE(e);
        return;
    };
};