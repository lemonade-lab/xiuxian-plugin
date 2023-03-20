import path from 'path'
/**自定义全局插件名*/
export const AppName = 'xiuxian-plugin'
/**自定义全局插件绝对路径*/
export const __dirname = `${path.resolve().replace(/\\/g, '/')}/plugins/${AppName}`