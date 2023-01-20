import fs from 'node:fs'
import YAML from 'yaml'
import { __dirname } from '../../../main.js'
/**
 * 自定义配置地址
 */
const __diryaml = `${__dirname}/config/parameter/cooling.yaml`
class DefsetUpdata {
    //动态生成配置读取
    getConfig = (parameter) => {
        const { app, name } = parameter
        //获得配置地址
        const file = `${__dirname}/config/${app}/${name}.yaml`
        //读取配置
        const data = YAML.parse(fs.readFileSync(file, 'utf8'))
        return data
    }
    updataConfig = (parameter) => {
        const { name, size, path, tomap } = parameter
        const map = {
            '突破冷却': 'CD.Level_up',
            '破体冷却': 'CD.LevelMax_up',
            '道宣冷却': 'CD.Autograph',
            '改名冷却': 'CD.Name',
            '重生冷却': 'CD.Reborn',
            '赠送冷却': 'CD.Transfer',
            '攻击冷却': 'CD.Attack',
            '击杀冷却': 'CD.Kill',
            '年龄每小时增加': 'Age.size',
            '最多功法持有数': 'myconfig.gongfa',
            '最多装备持有数': 'myconfig.equipment',
            '闭关倍率': 'biguan.size',
            '闭关时间': 'biguan.time',
            '降妖倍率': 'work.size',
            '降妖时间': 'work.time',
        }
        if (map.hasOwnProperty(name)) {
            const [name0, name1] = map[name].split('.')
            const data = YAML.parse(fs.readFileSync(`${__diryaml}`, 'utf8'))
            // const data = NodeJS.returnyamljs().load(`${__diryaml}`)
            data[name0][name1] = Number(size)
            // const yamlStr = NodeJS.returnjsyaml().dump(data)
            const yamlStr = YAML.stringify(data)
            fs.writeFileSync(`${__diryaml}`, yamlStr, 'utf8')
            return `修改${name}为${size}`
        } else {
            return '无次项配置信息'
        }
    }
}
export default new DefsetUpdata()