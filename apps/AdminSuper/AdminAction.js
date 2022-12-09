import plugin from '../../../../lib/plugins/plugin.js';
import { createRequire } from 'module';
import { ForwardMsg } from '../Xiuxian/Xiuxian.js';
import filecp from '../../model/filecp.js';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { exec } = require('child_process');
const _path = process.cwd();
const the = {
    'timer': ''
};
export class AdminAction extends plugin {
    constructor() {
        super({
            name: 'admin',
            dsc: 'admin',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙更新',
                    fnc: 'checkout',
                },
                {
                    reg: '^#修仙全部更新',
                    fnc: 'Allforcecheckout',
                }
            ],
        });
        this.key = 'xiuxian:restart';
    };
    Allforcecheckout = async (e) => {
        if (!e.isMaster) {
            return;
        };
        let sum = [''];
        const filepath = './plugins/Xiuxian-Plugin-Box/plugins/'
        const files = fs.readdirSync(filepath);
        files.forEach(async (item) => {
            const newfilepath = filepath + '/' + item;
            const stat = fs.statSync(newfilepath);
            if (stat.isFile()) { }
            else {
                const file = newfilepath.replace(filepath + '/', '');
                sum.push(`plugins/${file}`);
            };
        });
        e.replace(sum);
        sum.forEach((item) => {
            if (item != 'plugins/xiuxain-plugin') {
                const msg = ['————[更新消息]————'];
                const command = 'git  pull';
                msg.push('正在更新...');
                exec(
                    command,
                    { cwd: `${_path}/plugins/Xiuxian-Plugin-Box/${item}` },
                    (error, stdout, stderr) => {
                        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                            msg.push(`${item}已是最新版`);
                            ForwardMsg(e, msg);
                        }
                        else if (error) {
                            msg.push(`更新失败\nError code: ${error.code}\n${error.stack}\n`);
                            ForwardMsg(e, msg);
                        }
                        else {
                            msg.push(`更新${item}成功`);
                        };
                        ForwardMsg(e, msg);
                    }
                );
            };
        });
        return;
    };
    checkout = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const msg = ['————[更新消息]————'];
        const command = 'git  pull';
        msg.push('正在更新...');
        const that = this;
        exec(
            command,
            { cwd: `${_path}/plugins/Xiuxian-Plugin-Box/` },
            (error, stdout, stderr) => {
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push('最新版修仙插件了~');
                    ForwardMsg(e, msg);
                    return;
                };
                if (error) {
                    msg.push(`安装失败!\nError code: ${error.code}\n${error.stack}\n`);
                    ForwardMsg(e, msg);
                    return;
                };
                msg.push('更新成功,正在重启更新...');
                the.timer && clearTimeout(the.timer);
                the.timer = setTimeout(async () => {
                    try {
                        const data = JSON.stringify({
                            isGroup: !!e.isGroup,
                            id: e.isGroup ? e.group_id : e.user_id,
                        });
                        await redis.set(that.key, data, { EX: 120 });
                        let cm = 'npm run start';
                        if (process.argv[1].includes('pm2')) {
                            cm = 'npm run restart';
                        }
                        else {
                            msg.push('正在转为后台运行...');
                        };
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key);
                                msg.push(`重启失败\nError code: ${error.code}\n${error.stack}\n`);
                                logger.error(`重启失败\n${error.stack}`);
                            } else if (stdout) {
                                logger.mark('重启成功,运行已转为后台');
                                logger.mark('查看日志请用命令:npm run log');
                                logger.mark('停止后台运行命令:npm stop');
                                process.exit();
                            }
                        });
                    }
                    catch (error) {
                        redis.del(that.key);
                        const e = error.stack ?? error;
                        msg.push('重启失败了\n' + e);
                    };
                }, 1000);
                filecp.upfile();
                ForwardMsg(e, msg);
            }
        );
        return true;
    };
    init = async () => {
        const the = { restart: '' };
        the.restart = await redis.get(this.key);
        if (the.restart) {
            the.restart = JSON.parse(the.restart);
            if (the.restart.isGroup) {
                Bot.pickGroup(the.restart.id).sendMsg('重启成功!\n【#修仙版本】\n以确保正常使用\n');
            } else {
                Bot.pickGroup(the.restart.id).sendMsg('重启成功!\n【#修仙版本】\n以确保正常使用\n');
            }
            redis.del(this.key);
        };
    };
};