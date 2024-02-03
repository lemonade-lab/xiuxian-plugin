import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
/**
 * 读取json文件
 * @param dirname 相对于根目录的路径
 * @returns
 */
export function readJSON<T>(dirname: string): T | undefined {
  const dir = join(process.cwd(), dirname)
  if (!existsSync(dir)) {
    return undefined
  }
  const data = readFileSync(dir, 'utf8')
  try {
    return JSON.parse(data)
  } catch {
    return undefined
  }
}
