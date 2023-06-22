import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { DirPath } from '../../app.config.js'
export function getConfig({ name }) {
  /* 获得配置地址 */
  const file = `${DirPath}/config/${name}.yaml`
  /* 读取配置 */
  const data = parse(readFileSync(file, 'utf8'))
  return data
}
