import { readFileSync, writeFileSync } from 'node:fs'
import { parse, stringify } from 'yaml'
import { DirPath } from '../../../app.config.js'
/** 自定义配置地址 */
const __diryaml = `${DirPath}/config/cooling.yaml`

class Defset {
  /**
   *
   * @param {*} name
   * @returns
   */
  getConfig(name) {
    /* 获得配置地址 */
    const file = `${DirPath}/config/${name}.yaml`
    /* 读取配置 */
    const data = parse(readFileSync(file, 'utf8'))
    return data
  }

  /**
   *
   * @param {*} name
   * @returns
   */
  getDefset = (name) => {
    /* 获得配置地址 */
    const file = `${DirPath}/resources/defset/${name}.yaml`
    /* 读取配置 */
    const data = parse(readFileSync(file, 'utf8'))
    return data
  }

  /**
   *
   * @param {*} name
   * @param {*} swich
   * @returns
   */
  updataSwich(name, swich) {
    const map = {
      戳一戳: 'switch.twist',
      自动降临: 'switch.come'
    }
    if (!Object.prototype.hasOwnProperty.call(map, name)) {
      return '无此开关选项'
    }
    const [name0, name1] = map[name].split('.')
    const data = parse(readFileSync(`${__diryaml}`, 'utf8'))
    data[name0][name1] = swich
    const yamlStr = stringify(data)
    writeFileSync(`${__diryaml}`, yamlStr, 'utf8')
    return `${name}${swich ? '开启' : '关闭'}`
  }

  /**
   *
   * @param {*} name
   * @param {*} size
   * @returns
   */
  updataConfig(name, size) {
    const map = {
      突破冷却: 'CD.Level_up',
      破体冷却: 'CD.LevelMax_up',
      道宣冷却: 'CD.Autograph',
      改名冷却: 'CD.Name',
      重生冷却: 'CD.Reborn',
      赠送冷却: 'CD.Transfer',
      攻击冷却: 'CD.Attack',
      击杀冷却: 'CD.Kill',
      修行冷却: 'CD.Practice',
      年龄每小时增加: 'Age.size',
      最多功法持有数: 'myconfig.gongfa',
      最多装备持有数: 'myconfig.equipment',
      闭关倍率: 'biguan.size',
      闭关时间: 'biguan.time',
      降妖倍率: 'work.size',
      降妖时间: 'work.time',
      撤回时间: 'timeout.size'
    }
    if (!Object.prototype.hasOwnProperty.call(map, name)) {
      return '无次项配置信息'
    }
    const [name0, name1] = map[name].split('.')
    const data = parse(readFileSync(`${__diryaml}`, 'utf8'))
    data[name0][name1] = Number(size)
    const yamlStr = stringify(data)
    writeFileSync(`${__diryaml}`, yamlStr, 'utf8')
    return `修改${name}为${size}`
  }
}
export default new Defset()
