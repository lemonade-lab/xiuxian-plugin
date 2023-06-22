import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
export function getConfig(name) {
  /* 获得配置地址 */
  const file = `${resolve().replace(/\\/g, '/')}/resources/defset/${name}.yaml`
  /* 读取配置 */
  return parse(readFileSync(file, 'utf8'))
}
