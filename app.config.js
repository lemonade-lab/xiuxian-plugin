import { dirname, basename } from 'node:path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
export const AppName = basename(__dirname)
export const DirPath = __dirname
