import index from './model/index.js';
import schedule from './model/schedule.js';
schedule.scheduleJobflie('xiuxian','0 0 */1 * * ?');
const xiuxain = await index.toindex('apps');
const plugin = await index.toindex('plugins');
const apps = { ...xiuxain, ...plugin };
logger.info(`Xiuxian-Plugin-Box[2022-12-01]`);
export { apps }; 