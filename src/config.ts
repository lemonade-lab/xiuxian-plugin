import { dirname, join } from 'node:path'
import { fileURLToPath } from 'url'
// 运行地址
const a = join(process.cwd())
// 指向当前文件目录
const b = join(dirname(fileURLToPath(import.meta.url)))
// 当前地址
const c = join(b, '..')
/**
 * 当yunzai运行时，地址在index.js，必然是 b
 * 当本地项目运行时，地址在src/，必然是 c
 * 当a和c相等时，必然是本地项目运行时
 */
export const cwd = a === c ? c : b
