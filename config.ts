import { dirname, basename } from 'node:path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
// 插件名
export const AppName = basename(__dirname)
// 插件路径
export const cwd = __dirname.replace(/\\/g, '/')
// 插件版本
export const version = '1.4.0'
