/**
 * 存档刷新系统。用来发现存档内与当前版本不符合的字符。
 * 并做重新写入
 */

import { readdirSync, statSync } from 'fs'
import { ArchivePath } from '../model/path'
import { join } from 'path'
import { readArchiveData, writeArchiveData } from '../model/data'
import { UserMessageBase } from '../model/base'
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
const fileNames = readFilesInDirectory(ArchivePath['player'])
for (const fileName of fileNames) {
  const uid = Number(fileName.split('.')[0])
  const data = readArchiveData('player', uid)
  for (const key in UserMessageBase) {
    // 不存在的key。
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      data[key] = UserMessageBase[key]
    }
  }
  writeArchiveData('player', uid, data)
}
