const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const getConfig = ({ app, name }) => {
    /*获得配置地址*/
    const file = `${path.resolve().replace(/\\/g, '/')}/resources/defset/${app}/${name}.yaml`
    /*读取配置*/
    const data = YAML.parse(fs.readFileSync(file, 'utf8'))
    return data
}
module.exports = { getConfig }