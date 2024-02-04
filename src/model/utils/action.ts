import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../../config'

class action {
  /**
   * 读取数
   * @param dirname
   * @returns
   */
  read(dirname: string) {
    const dir = join(cwd, dirname)
    if (!existsSync(dir)) {
      return readFileSync(dir, 'utf8')
    }
    return undefined
  }

  /**
   * 写入数据
   * @param dirname
   * @param data
   */
  write(dirname: string, data: any) {
    const dir = join(cwd, dirname)
    if (!existsSync(dir)) {
      writeFileSync(join(dir), data, 'utf8')
    }
  }

  /**
   * 读取数
   * @param dirname
   * @returns
   */
  readJSON(dirname: string) {
    const dir = join(cwd, dirname)
    if (!existsSync(dir)) {
      return JSON.parse(readFileSync(dir, 'utf8'))
    }
    return undefined
  }

  /**
   * 写入数据
   * @param dirname
   * @param data
   */
  writeJSON(dirname: string, data: any) {
    const dir = join(cwd, dirname)
    if (!existsSync(dir)) {
      writeFileSync(join(dir), JSON.stringify(data), 'utf8')
    }
  }
}
/**
 * 以插件目录作为跟目录来操作数据
 */
export const Action = new action()
