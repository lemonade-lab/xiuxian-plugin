import robotapi from "../../model/robotapi.js"
import { superIndex } from "../../model/robotapi.js"
import { get_updata_img } from '../../model/showdata.js'
import { appname } from "../../model/main.js"
import filecp from '../../model/filecp.js'
import boxfs from "../../model/boxfs.js"
import boxexec from "../../model/boxexec.js"
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
        const sum = boxfs.returnMenu(filepath)
        await boxexec.start(cmd, `${process.cwd()}/plugins/${appname}/`, appname, e)
        sum.forEach(async (item) => {
            await boxexec.start(cmd, `${process.cwd()}/plugins/${appname}/plugins/${item}`, item, e)
        })
        filecp.upfile()
        const img = await get_updata_img()
        e.reply(img)
        return
    }

    xiuxianSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#修仙安装', '')
        const install = (name) => {
            return `git clone  https://gitee.com/mmmmmddddd/${name}.git ./plugins/Xiuxian-Plugin-Box/plugins/${name}/`
        }
        const NAME = {
            '宗门': 'xiuxian-association-pluging',
            '黑市': 'xiuxian-dark-plugin',
            '家园': 'xiuxian-home-plugin'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误或暂时下架')
            return
        }
        if (boxfs.existsSync(`${process.cwd()}/plugins/${appname}/plugins/${NAME[name]}/apps`)) {
            e.reply(`${NAME[name]}已安装`)
            return
        }
        await boxexec.start(install(NAME['宗门']), `${process.cwd()}`, NAME[name], e)
        filecp.upfile()
        const img = await get_updata_img()
        e.reply(img)
        return true
    }

    xiuxianDeleteSystem = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#修仙卸载', '')
        const install = (name) => {
            return `rm -rf plugins/Xiuxian-Plugin-Box/plugins/${name}/`
        }
        const NAME = {
            '宗门': 'xiuxian-association-pluging',
            '黑市': 'xiuxian-dark-plugin',
            '家园': 'xiuxian-home-plugin'
        }
        const MAP = {
            '宗门': install('xiuxian-association-pluging'),
            '家园': install('xiuxian-home-plugin'),
            '黑市': install('xiuxian-dark-plugin')
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        await boxexec.start(MAP[name], `${process.cwd()}`, NAME[name], e)
        filecp.upfile()
        const img = await get_updata_img()
        e.reply(img)
        return true
    }
}