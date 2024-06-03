import { join } from 'path'
import { cwd } from '../config'
// 基础数据
export const ResourcesPath = {
  // 配置文件
  config: join(cwd, '/resources/config'),
  // 基础文件
  base: join(cwd, '/resources/base'),
  // 图片下文件
  img: join(cwd, '/resources/img'),
  // 样式下文件
  css: join(cwd, '/resources/css')
}
