import path from "path";
/**插件名*/
export const appname = "xiuxian@2.0.0";
export const isPath = `${path.resolve().replace(/\\/g, "/")}`;
/*插件绝对路径 */
export const __dirname = `${path
  .resolve()
  .replace(/\\/g, "/")}/plugins/${appname}`;
/* 打印插件名 */
logger.info(`xiuxian@2.0.0 start ~`);