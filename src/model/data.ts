import { mkdirSync, readFileSync, writeFile } from 'fs'
import { dirname, join } from 'path'
import { ArchivePath, ResourcesPath } from './path'
import { ArchiveType, DataType, ResourcesType } from './types'
/**
 * 读取玩家数据
 * @param key
 * @param uid
 * @returns
 */
export function readArchiveData(key: keyof ArchiveType, uid: number) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  // steing
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
export function writeArchiveData(
  key: keyof ArchiveType,
  uid: number,
  data: Object
) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  writeFile(dir, JSON.stringify(data), 'utf-8', (err) => {
    if(err) console.error(err)
  })
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
  // steing
  try {
    const data = readFileSync(dir, 'utf-8')
    return JSON.parse(data)
  } catch {
    return false
  }
}
