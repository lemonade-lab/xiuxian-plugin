import fs from 'node:fs'
import { createRequire } from 'module'
import { __dirname } from './main.js'
const require = createRequire(import.meta.url)
const __diryaml = `${__dirname}/config/xiuxian/xiuxian.yaml`
class configyaml {
  constructor() {
    try {
      this.YAML = require('yamljs')
    } catch { }
    try {
      this.yaml = require('js-yaml')
    } catch { }
  }
  config = (name, size) => {
    const map = {
      '突破冷却': 'CD.Level_up',
      '破体冷却': 'CD.LevelMax_up',
      '道宣冷却': 'CD.Autograph',
      '改名冷却': 'CD.Name',
      '重生冷却': 'CD.Reborn',
      '赠送冷却': 'CD.Transfer',
      '攻击冷却': 'CD.Attack',
      '击杀冷却': 'CD.Kill',
      '白名单群': 'group.white',
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
      try {
        const data = this.YAML.load(`${__diryaml}`)
        data[name0][name1] = Number(size)
        const yamlStr = this.yaml.dump(data)
        fs.writeFileSync(`${__diryaml}`, yamlStr, 'utf8')
        return `修改${name}为${size}`
      } catch {
        return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
      }
    } else {
      return '无次项配置信息'
    }
  }
}
export default new configyaml()