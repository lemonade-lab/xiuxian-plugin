import path from 'path';
/**自定义全局插件名*/
export const AppName = 'xiuxian@1.3.0';

export const ThePath = `${path.resolve().replace(/\\/g, '/')}`;

/**自定义全局插件绝对路径*/
export const MyDirPath = `${ThePath}/plugins/${AppName}`;

/*插件绝对路径 */
export const __dirname = `${path
  .resolve()
  .replace(/\\/g, '/')}/plugins/${AppName}`;
