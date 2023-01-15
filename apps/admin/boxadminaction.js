import robotapi from "../../model/robotapi.js"
import { createRequire } from 'module'
import { ForwardMsg } from '../../model/public.js'
import { get_updata_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
import { appname } from "../../model/main.js"
import filecp from '../../model/filecp.js'
import boxfs from "../../model/boxfs.js"
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
const restart = {
    'timer': '',
    'restart': ''
}
export class boxadminaction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙更新',
                fnc: 'Allforcecheckout',
            },
            {
                reg: '^#修仙安装.*',
                fnc: 'xiuxianSystem',
            },
            {
                reg: '^#修仙卸载.*',
                fnc: 'xiuxianDeleteSystem',
            }
        ]))
        this.key = 'xiuxian:restart'
    }
    Allforcecheckout = async (e) => {
        if (!e.isMaster) {
            return
        }
        const that = this
        const filepath = `./plugins/${appname}/plugins/`
        const command = 'git  pull'
        const sum = boxfs.returnMenu(filepath)
        exec(command, { cwd: `${process.cwd()}/plugins/${appname}/` },
            async (error, stdout, stderr) => {
                const msg = ['————[更新消息]————']
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push(`${appname}已是最新版`)
                } else if (error) {
                    msg.push(`更新失败\nError code: ${error.code}\n${error.stack}\n`)
                } else {
                    msg.push(`更新${appname}成功`)
                }
                await ForwardMsg(e, msg)
            }
        )
        sum.forEach(async (item) => {
            if (item != 'xiuxian-plugin') {
                exec(command, { cwd: `${process.cwd()}/plugins/${appname}/plugins/${item}` },
                    async (error, stdout, stderr) => {
                        const newmsg = ['————[更新消息]————']
                        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                            newmsg.push(`${item}已是最新版`)
                        } else if (error) {
                            newmsg.push(`更新失败\nError code: ${error.code}\n${error.stack}\n`)
                        } else {
                            newmsg.push(`更新${item}成功`)
                        }
                        await ForwardMsg(e, newmsg)
                    }
                )
            }
        })
        restart.timer && clearTimeout(restart.timer)
        restart.timer = setTimeout(async () => {
            try {
                const data = JSON.stringify({
                    isGroup: !!e.isGroup,
                    id: e.isGroup ? e.group_id : e.user_id,
                })
                await redis.set(that.key, data, { EX: 120 })
                let cm = 'npm run start'
                if (process.argv[1].includes('pm2')) {
                    cm = 'npm run restart'
                }
                exec(cm, (error, stdout, stderr) => {
                    if (error) {
                        redis.del(that.key)
                        e.reply(`重启失败\nError code: ${error.code}\n${error.stack}\n`)
                        logger.error(`重启失败\n${error.stack}`)
                    } else if (stdout) {
                        logger.mark('重启成功,运行已转为后台')
                        logger.mark('查看日志请用命令:npm run log')
                        logger.mark('停止后台运行命令:npm stop')
                        process.exit()
                    }
                })
                filecp.upfile()
            }
            catch (error) {
                redis.del(that.key)
                const ise = error.stack ?? error
                e.reply(`重启失败了\n${ise}`)
            }
        }, 1000)
        return
    }


    xiuxianSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = ['————[安装消息]————']
        const name = e.msg.replace('#修仙安装', '')
        const MAP = {
            '宗门': 'git clone  https://gitee.com/mg1105194437/xiuxian-association-pluging.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '黑市': 'git clone  https://gitee.com/waterfeet/xiuxian-dark-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-plugin/',
            '家园': 'git clone  https://gitee.com/mmmmmddddd/xiuxian-home-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-plugin/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误或暂时下架')
            return
        }
        const that = this
        exec(MAP[name], { cwd: `${process.cwd()}` },
            (error, stdout, stderr) => {
                if (error) {
                    e.reply(`安装失败\nError code: ${error.code}\n${error.stack}\n`)
                    return
                }
                msg.push('安装成功,正在重启更新...')
                restart.timer && clearTimeout(restart.timer)
                restart.timer = setTimeout(async () => {
                    try {
                        const data = JSON.stringify({
                            isGroup: !!e.isGroup,
                            id: e.isGroup ? e.group_id : e.user_id,
                        })
                        await redis.set(that.key, data, { EX: 120 })
                        let cm = 'npm run start'
                        if (process.argv[1].includes('pm2')) {
                            cm = 'npm run restart'
                        } else {
                            msg.push('正在转为后台运行...')
                        }
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key)
                                msg.push(`重启失败\nError code: ${error.code}\n${error.stack}\n`)
                                logger.error(`重启失败\n${error.stack}`)
                            } else if (stdout) {
                                logger.mark('重启成功,运行已转为后台')
                                logger.mark('查看日志请用命令:npm run log')
                                logger.mark('停止后台运行命令:npm stop')
                                process.exit()
                            }
                        })
                    }
                    catch (error) {
                        redis.del(that.key)
                        const e = error.stack ?? error
                        msg.push('重启失败了\n' + e)
                    }
                }, 1000)
                filecp.upfile()
                ForwardMsg(e, msg)
            }
        )
        return true
    }
    xiuxianDeleteSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#修仙卸载', '')
        const msg = ['————[卸载消息]————']
        const MAP = {
            '宗门': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '家园': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-plugin/',
            '黑市': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-plugin/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        const that = this
        exec(MAP[name], { cwd: `${process.cwd()}` },
            (error, stdout, stderr) => {
                if (error) {
                    msg.push(`卸载失败\nError code: ${error.code}\n${error.stack}\n`)
                    ForwardMsg(e, msg)
                    return
                }
                msg.push('卸载成功,正在重启更新...')
                restart.timer && clearTimeout(restart.timer)
                restart.timer = setTimeout(async () => {
                    try {
                        const data = JSON.stringify({
                            isGroup: !!e.isGroup,
                            id: e.isGroup ? e.group_id : e.user_id,
                        })
                        await redis.set(that.key, data, { EX: 120 })
                        let cm = 'npm run start'
                        if (process.argv[1].includes('pm2')) {
                            cm = 'npm run restart'
                        } else {
                            msg.push('正在转为后台运行...')
                        }
                        exec(cm, (error, stdout, stderr) => {
                            if (error) {
                                redis.del(that.key)
                                msg.push(`重启失败\nError code: ${error.code}\n${error.stack}\n`)
                                logger.error(`重启失败\n${error.stack}`)
                            } else if (stdout) {
                                logger.mark('重启成功,运行已转为后台')
                                logger.mark('查看日志请用命令:npm run log')
                                logger.mark('停止后台运行命令:npm stop')
                                process.exit()
                            }
                        })
                    }
                    catch (error) {
                        redis.del(that.key)
                        const e = error.stack ?? error
                        msg.push('重启失败了\n' + e)
                    }
                }, 1000)
                filecp.upfile()
                ForwardMsg(e, msg)
            }
        )
        return true
    }








    init = async () => {
        restart.restart = await redis.get(this.key)
        if (restart.restart) {
            restart.restart = JSON.parse(restart.restart)
            const img = await get_updata_img()
            if (restart.restart.isGroup) {
                Bot.pickGroup(restart.restart.id).sendMsg(img)
            } else {
                Bot.pickGroup(restart.restart.id).sendMsg(img)
            }
            redis.del(this.key)
        }
    }
}