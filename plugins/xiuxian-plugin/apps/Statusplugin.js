import plugin from '../../../../../lib/plugins/plugin.js';
import os from 'os';
import { execSync } from 'child_process';
import { __PATH, Read_Life } from '../../../apps/Xiuxian/Xiuxian.js';
export class Statusplugin extends plugin {
    constructor() {
        super({
            name: 'Statusplugin',
            dsc: 'Statusplugin',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '#修仙状态$',
                    fnc: 'getCPUSTATE'
                },
                {
                    reg: '#清理修仙缓存$',
                    fnc: 'cleancache'
                }
            ]
        });
    };
    getCPUSTATE = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const life = await Read_Life();
        const dealTime = (theseconds) => {
            let seconds = theseconds | 0;
            let day = (seconds / (3600 * 24)) | 0;
            let hours = ((seconds - day * 3600) / 3600) | 0;
            let minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
            let second = seconds % 60;
            (day < 10) && (day = '0' + day);
            (hours < 10) && (hours = '0' + hours);
            (minutes < 10) && (minutes = '0' + minutes);
            (second < 10) && (second = '0' + second);
            return [day, hours, minutes, second].join(':');
        };
        const dealMem = (mem) => {
            let G = 0,M = 0,KB = 0;
            (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
            (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
            (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
            return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B';
        };
        const msg = [];
        const pf = os.platform();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const uptime = os.uptime();
        msg.push('System:' + pf);
        msg.push('\nOpenTime:' + dealTime(uptime));
        msg.push('\n内存:' + dealMem(totalMem));
        msg.push('\n空闲:' + dealMem(freeMem));
        msg.push('\n人数:' + life.length);
        e.reply(msg);
        return;
    };
    cleancache = async (e) => {
        if (!e.isMaster) {
            return;
        };
        e.reply('开始清理');
        execSync('sh cleanCache.sh', function (err, sto) {
            if (err) {
                e.reply('执行清理脚本失败')
            };
        });
        await e.reply('结束清理');
        await this.getCPUSTATE(e);
        return;
    };
};