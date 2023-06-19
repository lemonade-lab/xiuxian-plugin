import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
export function getConfig({ name }) {
  /* 获得配置地址 */
  const file = `${path.resolve().replace(/\\/g, '/')}/resources/defset/${name}.yaml`
  /* 读取配置 */
  return YAML.parse(fs.readFileSync(file, 'utf8'))
}
