import robotapi from "../../model/robotapi.js"
import { superIndex } from "../../model/robotapi.js"
import { get_updata_img } from '../../model/showdata.js'
import { appname } from "../../model/main.js"
import filecp from '../../model/filecp.js'
import boxfs from "../../model/boxfs.js"
import boxexec from "../../model/boxexec.js"
import { forwardMsg } from '../../model/boxpublic.js'
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
        const command = 'git  pull'
        const sum = boxfs.returnMenu(filepath)
        const msg = await boxexec.start(command, `${process.cwd()}/plugins/${appname}/`, appname)
        e.reply(await forwardMsg(msg))
        sum.forEach(async (item) => {
            const msg = await boxexec.start(command, `${process.cwd()}/plugins/${appname}/plugins/${item}`, item)
            e.reply(await forwardMsg(msg))
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
        const MAP = {
            '宗门': 'git clone  https://gitee.com/mg1105194437/xiuxian-association-pluging.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '黑市': 'git clone  https://gitee.com/waterfeet/xiuxian-dark-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-plugin/',
            '家园': 'git clone  https://gitee.com/mmmmmddddd/xiuxian-home-plugin.git ./plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-plugin/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误或暂时下架')
            return
        }
        const msg = await boxexec.start(command, `${process.cwd()}`, MAP[name])
        e.reply(await forwardMsg(msg))
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
        const MAP = {
            '宗门': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-association-pluging/',
            '家园': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-home-plugin/',
            '黑市': 'rm -rf plugins/Xiuxian-Plugin-Box/plugins/xiuxian-dark-plugin/'
        }
        if (!MAP.hasOwnProperty(name)) {
            e.reply('扩展名错误')
            return
        }
        const msg = await boxexec.start(command, `${process.cwd()}`, MAP[name])
        e.reply(await forwardMsg(msg))
        filecp.upfile()
        const img = await get_updata_img()
        e.reply(img)
        return true
    }
}