import fs from 'node:fs'
import YAML from 'yaml'
import { MyDirPath } from '../../app.config.js'
export function getConfig(parameter) {
  const { app, name } = parameter
  /* 获得配置地址 */
  const file = `${MyDirPath}/config/${app}/${name}.yaml`
  /* 读取配置 */
  const data = YAML.parse(fs.readFileSync(file, 'utf8'))
  return data
}
