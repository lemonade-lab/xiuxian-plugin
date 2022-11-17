import plugin from '../../../../../lib/plugins/plugin.js';
import { segment } from "oicq";
import os from 'os';
import { ChildProcess, exec, execSync } from 'child_process';
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
        //非私聊拦截
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
        //cpu架构
        // const arch = os.arch();
        // console.log("cpu架构：" + arch);
        // //操作系统内核
        // const kernel = os.type();
        // console.log("操作系统内核：" + kernel);
        // //操作系统平台
        const pf = os.platform();
        msg.push("平台：" + pf + '\n');
        //系统开机时间
        const uptime = os.uptime();
        msg.push("开机时间：" + dealTime(uptime) + '\n');
        // //主机名
        // const hn = os.hostname();
        // console.log("主机名：" + hn);
        // //主目录
        // const hdir = os.homedir();
        // console.log("主目录：" + hdir);
        //内存
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        msg.push("内存大小：" + dealMem(totalMem) + "\n" + ' 空闲内存：' + dealMem(freeMem));
        // //cpu
        // const cpus = os.cpus();
        // console.log('*****cpu信息*******');
        // cpus.forEach((cpu, idx, arr) => {
        //     var times = cpu.times;
        //     console.log(`cpu${idx}：`);
        //     console.log(`型号：${cpu.model}`);
        //     console.log(`频率：${cpu.speed}MHz`);
        //     console.log(`使用率：${((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)) * 100).toFixed(2)}%`);
        // });
        //网卡
        // console.log('*****网卡信息*******');
        // const networksObj = os.networkInterfaces();
        // for (let nw in networksObj) {
        //     let objArr = networksObj[nw];
        //     console.log(`\r\n${nw}：`);
        //     objArr.forEach((obj, idx, arr) => {
        //         console.log(`地址：${obj.address}`);
        //         console.log(`掩码：${obj.netmask}`);
        //         console.log(`物理地址：${obj.mac}`);
        //         console.log(`协议族：${obj.family}`);
        //     });
        // }
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
            // console.log(sto);//sto才是真正的输出，要不要打印到控制台，由你自己啊
        })
        await e.reply("结束清理");
        await this.getCPUSTATE(e);
        return;
    };
};