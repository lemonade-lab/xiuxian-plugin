import fs from 'node:fs'
import YAML from 'yaml'
import { __dirname } from '../../../main.js'
class DefsetUpdata {
    /*动态生成配置读取*/
    getConfig = (parameter) => {
        const { app, name } = parameter
        /*获得配置地址*/
        const file = `${__dirname}/config/${app}/${name}.yaml`
        /*读取配置*/
        const data = YAML.parse(fs.readFileSync(file, 'utf8'))
        return data
    }
}
export default new DefsetUpdata()