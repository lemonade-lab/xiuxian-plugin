import { dirname, basename, resolve } from 'node:path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
// 插件名
export const AppName = basename(__dirname)
// 项目根目录
export const ThePath = `${resolve().replace(/\\/g, '/')}`
// 插件绝对路径
export const MyDirPath = __dirname.replace(/\\/g, '/')
