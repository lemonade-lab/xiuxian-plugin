import fs from 'node:fs'
import YAML from 'yaml'
import { MyDirPath } from '../../app.config.js'
export function getConfig({ name }) {
  /* 获得配置地址 */
  const file = `${MyDirPath}/config/${name}.yaml`
  /* 读取配置 */
  const data = YAML.parse(fs.readFileSync(file, 'utf8'))
  return data
}
