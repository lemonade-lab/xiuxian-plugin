import { readFileSync, writeFile } from 'fs'
import { join } from 'path'
import { ArchivePath, ResourcesPath } from './path'
import { ArchiveType, DataType, ResourcesType } from './types'
/**
 * 读取玩家数据
 * @param key
 * @param uid
 * @returns
 */
export function readArchiveData(key: keyof ArchiveType, uid: number) {
  // steing
  const data = readFileSync(join(ArchivePath[key], `${uid}.json`), 'utf-8')
  if (data) {
    try {
      return JSON.parse(data) as DataType[keyof ArchiveType]
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
  key: keyof ArchiveType,
  uid: number,
  data: Object
) {
  writeFile(
    join(ArchivePath[key], `${uid}.json`),
    JSON.stringify(data),
    'utf-8',
    (err) => {
      console.error(err)
    }
  )
}
/**
 * 读取数据
 * @param url
 */
export function readData(key: keyof ResourcesType, name: string) {
  // steing
  const data = readFileSync(join(ResourcesPath[key], `${name}.json`), 'utf-8')
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return false
    }
  }
  return false
}
