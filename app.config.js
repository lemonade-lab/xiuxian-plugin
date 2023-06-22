import { resolve } from 'node:path'
/** 插件名 */
export const AppName = 'xiuxian-plugin'
/* 插件绝对路径 */
export const DirPath = `${resolve().replace(/\\/g, '/')}/plugins/${AppName}`
