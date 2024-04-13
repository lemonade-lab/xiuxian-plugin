import { mkdirSync, readFileSync, writeFile } from 'fs'
import { dirname, join } from 'path'
import { ArchivePath } from './path'
import { ArchiveType } from './types'

/**
 * 读取数据
 * @param key
 * @param uid
 * @returns
 */
export function readArchiveData(key: keyof ArchiveType, uid: number | string) {
  const dir = join(ArchivePath[key], `${uid}.json`)
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

/**
 * 写入数据
 * @param key
 * @param uid
 * @param data
 */
export function writeArchiveData(
  key: keyof ArchiveType,
  uid: number | string,
  data: object
) {
  const dir = join(ArchivePath[key], `${uid}.json`)
  mkdirSync(dirname(dir), {
    recursive: true
  })
  writeFile(dir, JSON.stringify(data), 'utf-8', (err) => {
    if (err) console.error(err)
  })
}
