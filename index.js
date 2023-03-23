import { ctrateConfig } from './model/defset.js'
import { appsOut } from './robot/index.js'
/* 检测配置 */
ctrateConfig()
const apps = await appsOut({ AppsName: 'apps' }).then((req) => {
    logger.info(`修仙修插件初始化~`);
    return req
});
export { apps };