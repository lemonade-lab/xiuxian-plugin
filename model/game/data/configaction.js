import YAML from 'yaml'
import fs from 'node:fs'
import { appname } from '../../main.js'
/**
 * 配置读取行为
 */
class ConfigAction {
    constructor() {
        //动态配置地址
        this.configPath = `./plugins/${appname}/config`
    }
    //动态生成配置读取
    getconfig = (app, name) => {
        //获得配置地址
        let file = `${this.configPath}/${app}/${name}.yaml`
        //读取配置
        const data = YAML.parse(fs.readFileSync(file, 'utf8'))
        return data
    }
}
module.exports = new ConfigAction()