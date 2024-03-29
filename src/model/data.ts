/**
 * 规定。
 * 所有固定数据都存在resources
 * 所有的生产数据都存在data
 * 如何解决更改导致的数据表不一致？
 * 那就需要写一个深度遍历的方法
 * 版本更新直接执行方法，
 * 检查所有玩家符合当前版本数据
 * 不符合的都做修改
 */

import { readFileSync, writeFile } from 'fs'
import { join } from 'path'
import { cwd } from '../../config'

const urls = {
  // 读取配置
  config: join(cwd, '/resources/config'),
  base: join(cwd, '/resources/base'),
  img: join(cwd, '/resources/img'),
  css: join(cwd, '/resources/css')
}

/**
 * 读取数据
 * @param url
 */
export function readData(key: keyof typeof urls) {
  // steing
  const data = readFileSync(urls[key], 'utf-8')
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return false
    }
  }
  return false
}

/**
 * 写入数据
 * @param key
 * @param data
 */
export function writeData(key: keyof typeof urls, data) {
  writeFile(urls[key], JSON.stringify(data), 'utf-8', (err) => {
    console.error(err)
  })
}
