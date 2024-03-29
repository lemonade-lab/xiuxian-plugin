import { readFileSync, writeFile } from 'fs'
import { join } from 'path'
import { cwd } from '../../config'

// 基础数据
const resources = {
  // 配置文件
  config: join(cwd, '/resources/config'),
  // 基础文件
  base: join(cwd, '/resources/base'),
  // 图片下文件
  img: join(cwd, '/resources/img'),
  // 样式下文件
  css: join(cwd, '/resources/css')
}

// 存档
const archive = {
  // 玩家数
  player: join(cwd, '/data/player')
}

/**
 * 读取数据
 * @param url
 */
export function readData(key: keyof typeof resources, name: string) {
  // steing
  const data = readFileSync(join(resources[key], `${name}.json`), 'utf-8')
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
 * 读取玩家数据
 * @param key
 * @param uid
 * @returns
 */
export function readArchiveData(key: keyof typeof archive, uid: string) {
  // steing
  const data = readFileSync(join(archive[key], `${uid}.json`), 'utf-8')
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
 * 写入玩家数据
 * @param key
 * @param uid
 * @param data
 */
export function writeArchiveData(
  key: keyof typeof archive,
  uid: string,
  data: Object
) {
  writeFile(
    join(archive[key], `${uid}.json`),
    JSON.stringify(data),
    'utf-8',
    (err) => {
      console.error(err)
    }
  )
}
