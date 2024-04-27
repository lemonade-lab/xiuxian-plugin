import { existsSync, mkdirSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { ArchivePath, ResourcesPath } from './path'
import { ArchiveType, DataType, ResourcesType } from './types'
import { JSONFilePreset } from 'lowdb/node'

/**
 * 是否存在用户存档
 * @param key
 * @param uid
 * @returns
 */
export function existsArchiveSync(
  key: keyof ArchiveType,
  uid: number | string
) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  return existsSync(dir)
}

/**
 * 读取玩家数据
 * @param key
 * @param uid
 * @returns
 */
export function readArchiveData(key: keyof ArchiveType, uid: number | string) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  // setting
  try {
    const data = readFileSync(dir, 'utf-8')
    return JSON.parse(data) as DataType[keyof ArchiveType]
  } catch {
    return false
  }
}

/**
 * 写入玩家数据
 * @param key
 * @param uid
 * @param data
 */
export async function writeArchiveData(
  key: keyof ArchiveType,
  uid: number | string,
  data: object
) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  // writeFile(dir, JSON.stringify(data), 'utf-8', (err) => {
  //   if (err) console.error(err)
  // })
  const db = await JSONFilePreset(dir, data)
  await db.write()
}

/**
 * 读取数据
 * @param url
 */
export function readData(key: keyof ResourcesType, name: string) {
  const dir = join(ResourcesPath[key], `${name}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  // setting
  try {
    const data = readFileSync(dir, 'utf-8')
    return JSON.parse(data)
  } catch {
    return false
  }
}
