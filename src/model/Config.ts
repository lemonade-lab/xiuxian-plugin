import { parse } from 'yaml'
import { readFileSync } from 'fs'
import { cwd } from '../../config.js'
/**
 *
 * @param app
 * @param name
 * @returns
 */
export function getConfig(app: string, name: string) {
  return parse(readFileSync(`${cwd}/config/${app}/${name}.yaml`, 'utf8'))
}
