import { parse } from 'yaml'
import { readFileSync } from 'fs'
import { MyDirPath } from '../../config.js'
/**
 *
 * @param app
 * @param name
 * @returns
 */
export function getConfig(app: string, name: string) {
  return parse(readFileSync(`${MyDirPath}/config/${app}/${name}.yaml`, 'utf8'))
}
