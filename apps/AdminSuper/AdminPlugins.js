import robotapi from "../../model/robotapi.js";
import { createRequire } from 'module';
import { ForwardMsg } from '../../model/public.js';
import filecp from '../../model/filecp.js';
import { superIndex } from "../../model/robotapi.js";
const require = createRequire(import.meta.url);
const { exec } = require('child_process');
const _path = process.cwd();
const the = {
    'timer': ''
};
export class AdminPlugins extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙安装.*',
                fnc: 'xiuxianSystem',
            },
            {
                reg: '^#修仙卸载.*',
                fnc: 'xiuxianDeleteSystem',
            }
        ]));
        this.key = 'xiuxian:restart';
    };
    xiuxianSystem = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const msg = ['————[安装消息]————'];
        const name = e.msg.replace('#修仙安装', '');
        const MAP = {
            '宗门': 'git clone  https://gitee.com/mg1105194437/xiuxian-association-pluging.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '家园': 'git clone  https://gitee.com/mmmmmddddd/xiuxian-home-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-plugin/',
            '黑市': 'git clone  https://gitee.com/waterfeet/xiuxian-dark-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-plugin/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        const that = this;
        exec(MAP[name], { cwd: `${_path}` },
            (error, stdout, stderr) => {
                if (error) {
                    e.reply(`安装失败\nError code: ${error.code}\n${error.stack}\n`)
                    return;
                };
                msg.push('安装成功,正在重启更新...');
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
                        } else {
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
    xiuxianDeleteSystem = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const name = e.msg.replace('#修仙卸载', '');
        const msg = ['————[卸载消息]————'];
        const MAP = {
            '宗门': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '家园': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-pluging/',
            '黑市': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-pluging/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        const that = this;
        exec(MAP[name], { cwd: `${_path}` },
            (error, stdout, stderr) => {
                if (error) {
                    msg.push(`卸载失败\nError code: ${error.code}\n${error.stack}\n`);
                    ForwardMsg(e, msg);
                    return;
                };
                msg.push('卸载成功,正在重启更新...');
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
                        } else {
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
};