import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { appname } from "../../model/main.js"
import gameApi from '../../model/api/api.js'
import botApi from "../../model/robot/api/botapi.js"
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
        const filepath = `./plugins/${appname}/plugins/`
        const cmd = 'git  pull'
        const sum = gameApi.returnMenu(filepath)
        await botApi.execStart({
            cmd,
            cwd: `${process.cwd()}/plugins/${appname}/`,
            name: appname,
            e
        })
        sum.forEach(async (item) => {
            await botApi.execStart({
                cmd,
                cwd: `${process.cwd()}/plugins/${appname}/plugins/${item}`,
                name: item,
                e
            })
        })
        gameApi.moveConfig('updata')
        const data = {
            version: await gameApi.getConfig({
                app: 'version',
                name: 'version'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'updata', name: 'updata', data })
        e.reply(img)
        return
    }

    xiuxianSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#修仙安装', '')
        const NAME = {
            '宗门': 'xiuxian-association-pluging',
            '家园': 'xiuxian-home-plugin',
            '黑市': 'xiuxian-dark-plugin'
        }
        const MAP = {
            '宗门': `git clone  https://gitee.com/mg1105194437/xiuxian-association-pluging.git ./plugins/${appname}/plugins/xiuxian-association-pluging/`,
            '黑市': `git clone  https://gitee.com/waterfeet/xiuxian-dark-plugin.git ./plugins/${appname}/plugins/xiuxian-dark-plugin/`,
            '家园': `git clone  https://gitee.com/mmmmmddddd/xiuxian-home-plugin.git ./plugins/${appname}/plugins/xiuxian-home-plugin/`
        }
        if (!NAME.hasOwnProperty(name)) {
            e.reply('扩展名错误或暂时下架')
            return
        }
        if (gameApi.existsSync({ PATH: `${process.cwd()}/plugins/${appname}/plugins/${NAME[name]}/apps` })) {
            e.reply(`${NAME[name]}已安装`)
            return
        }
        await botApi.execStart({
            cmd: MAP[name],
            cwd: `${process.cwd()}`,
            name: NAME[name],
            e
        })
        gameApi.moveConfig('updata')
        const data = {
            version: await gameApi.getConfig({
                app: 'version',
                name: 'version'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'updata', name: 'updata', data })
        e.reply(img)
        return true
    }

    xiuxianDeleteSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#修仙卸载', '')
        const NAME = {
            '宗门': 'xiuxian-association-pluging',
            '家园': 'xiuxian-home-plugin',
            '黑市': 'xiuxian-dark-plugin'
        }
        const install = (name) => {
            return `rm -rf plugins/${appname}/plugins/${name}/`
        }
        const MAP = {
            '宗门': install(NAME['宗门']),
            '家园': install(NAME['家园']),
            '黑市': install(NAME['黑市'])
        }
        if (!NAME.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        await botApi.execStart({
            cmd: MAP[name],
            cwd: `${process.cwd()}`,
            name: NAME[name],
            e
        })
        gameApi.moveConfig('updata')
        const data = {
            version: await gameApi.getConfig({
                app: 'version',
                name: 'version'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'updata', name: 'updata', data })
        e.reply(img)
        return true
    }
}