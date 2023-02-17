import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
export const getConfig = ({ app, name }) => {
    /*获得配置地址*/
    const file = `${path.resolve().replace(/\\/g, '/')}/resources/defset/${app}/${name}.yaml`
    /*读取配置*/
    return YAML.parse(fs.readFileSync(file, 'utf8'))
}