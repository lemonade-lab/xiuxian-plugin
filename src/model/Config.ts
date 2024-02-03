import { parse } from 'yaml'
import { readFileSync } from 'fs'
import { MyDirPath } from '../../config.js'
/** 配置文件 直接借鉴yunzai配置代码 */
class Config {
  /**
   * 获取用户自己配置的配置文件信息
   * @param app
   * @param name
   * @returns {{[p: string]: *}|*}
   */
  getConfig(app, name) {
    /*获得配置地址*/
    const file = `${MyDirPath}/config/${app}/${name}.yaml`
    /*读取配置*/
    const data = parse(readFileSync(file, 'utf8'))
    return data
  }
}
export default new Config()
