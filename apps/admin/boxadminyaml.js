import robotapi from "../../model/robotapi.js"
import configyaml from '../../model/configyaml.js'
import { superIndex } from "../../model/robotapi.js"
import boxexec from '../../model/boxexec.js'
import { appname } from "../../model/main.js"
export class boxadminyaml extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙配置更改.*',
                fnc: 'configupdata',
            },
            {
                reg: '^#修仙加载依赖.*',
                fnc: 'loadDependencies',
            }
        ]))
    }
    configupdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        const config = e.msg.replace('#修仙配置更改', '')
        const code = config.split('\*')
        const [name, size] = code
        e.reply(configyaml.config(name, size))
        return
    }
    loadDependencies = async (e) => {
        if (!e.isMaster) {
            return
        }
        const NPM = e.msg.replace('#修仙加载依赖', '')
        const npm = [`${NPM} install yamljs -w`, `${NPM} install  js-yaml -w`]
        npm.forEach(async (item) => {
            await boxexec.start(item, process.cwd(), appname, e)
        })
        return
    }
}