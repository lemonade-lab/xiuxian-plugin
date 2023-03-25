import { appsOut } from './robot/index.js'
const apps = await appsOut({ AppsName: 'apps' }).then((req) => {
    logger.info(`修仙修插件初始化~`);
    return req
});
export { apps };