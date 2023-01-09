import index from './model/index.js';
import Xiuxianschedule from './model/XiuxianSchedule.js';
Xiuxianschedule.scheduleJobflie('0 0 */1 * * ?');
const xiuxain = await index.toindex('apps');
const plugin = await index.toindex('plugins');
const apps = { ...xiuxain, ...plugin };
logger.info(`Xiuxian-Plugin-Box[2022-12-01]`);
export { apps }; 