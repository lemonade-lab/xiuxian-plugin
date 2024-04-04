import { readdirSync, statSync } from 'fs'
import { ArchivePath } from '../model/path'
import { join } from 'path'
import { readArchiveData, writeArchiveData } from '../model/data'
import { UserMessageBase } from '../model/base'

/**
 *
 * @param directoryPath
 * @returns
 */
function readFilesInDirectory(directoryPath: string): string[] {
  let fileNames: string[] = []
  const files = readdirSync(directoryPath)
  files.forEach((file) => {
    const filePath = join(directoryPath, file)
    const stat = statSync(filePath)
    if (stat.isFile()) {
      fileNames.push(file)
    } else if (stat.isDirectory()) {
      const subDirectoryFiles = readFilesInDirectory(filePath)
      fileNames = fileNames.concat(subDirectoryFiles)
    }
  })
  return fileNames
}

/**
 *
 * @param target
 * @param source
 * @returns
 */
function mergeObjects(target, source) {
  for (const key in source) {
    // 不存在的 key
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = source[key]
    } else {
      // 如果是对象，则递归比较
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = mergeObjects(target[key], source[key])
      } else {
        // 基础类型不相等或者数组
        if (
          typeof target[key] !== typeof source[key] ||
          Array.isArray(target[key]) !== Array.isArray(source[key])
        ) {
          target[key] = source[key]
        }
      }
    }
  }
  return target
}

const fileNames = readFilesInDirectory(ArchivePath['player'])

for (const fileName of fileNames) {
  const split = fileName.split('.')
  if (split.length <= 0) continue
  const uid = split[0]
  if (!uid) continue
  const data = readArchiveData('player', uid)
  if (!data) continue
  // 清理key
  for (const key in data) {
    // base 不存在
    if (!Object.prototype.hasOwnProperty.call(UserMessageBase, key)) {
      delete data[key]
    }
  }
  const mergedData = mergeObjects(data, UserMessageBase)
  writeArchiveData('player', uid, mergedData)
}
