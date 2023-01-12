import robotapi from "../../model/robotapi.js"
import { createRequire } from 'module'
import { ForwardMsg } from '../../model/public.js'
import filecp from '../../model/filecp.js'
import fs from 'node:fs'
import { get_updata_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
const _path = process.cwd()
const the = {
    'timer': ''
}
export class boxadminaction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙更新',
                fnc: 'Allforcecheckout',
            }
        ]))
        this.key = 'xiuxian:restart'
    }
    Allforcecheckout = async (e) => {
        if (!e.isMaster) {
            return
        }
        const sum = []
        const that = this
        const filepath = './plugins/Xiuxian-Plugin-Box/plugins/'
        const files = fs.readdirSync(filepath)
        const command = 'git  pull'
        files.forEach((item) => {
            const newfilepath = filepath + '/' + item
            const stat = fs.statSync(newfilepath)
            if (!stat.isFile()) {
                const file = newfilepath.replace(filepath + '/', '')
                sum.push(`${file}`)
            }
        })
        exec(command, { cwd: `${_path}/plugins/Xiuxian-Plugin-Box/` },
            async (error, stdout, stderr) => {
                const msg = ['————[更新消息]————']
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push(`Xiuxian-Plugin-Box已是最新版`)
                } else if (error) {
                    msg.push(`更新失败\nError code: ${error.code}\n${error.stack}\n`)
                } else {
                    msg.push(`更新Xiuxian-Plugin-Box成功`)
                }
                await ForwardMsg(e, msg)
            }
        )
        sum.forEach(async (item) => {
            if (item != 'xiuxian-plugin') {
                exec(command, { cwd: `${_path}/plugins/Xiuxian-Plugin-Box/plugins/${item}` },
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
        the.timer && clearTimeout(the.timer)
        the.timer = setTimeout(async () => {
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
    init = async () => {
        const the = { restart: '' }
        the.restart = await redis.get(this.key)
        if (the.restart) {
            the.restart = JSON.parse(the.restart)
            const img = await get_updata_img()
            if (the.restart.isGroup) {
                Bot.pickGroup(the.restart.id).sendMsg(img)
            } else {
                Bot.pickGroup(the.restart.id).sendMsg(img)
            }
            redis.del(this.key)
        }
    }
}