import { join } from 'path'
import { cwd } from '../../../config.js'
export function getPath(name: string) {
  return join(cwd, '/resources/data', name)
}
