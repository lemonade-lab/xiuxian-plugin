import { readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 *
 * @param directoryPath
 * @returns
 */
export function readFilesInDirectory(directoryPath: string): string[] {
  let fileNames: string[] = []
  const files = readdirSync(directoryPath)
  files.forEach(file => {
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
