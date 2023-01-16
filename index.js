import index from './model/index.js';
import schedule from './model/game/data/schedule.js';
schedule.scheduleJobflie('xiuxian','0 0 */1 * * ?');
const xiuxain = await index.toindex('apps');
const plugin = await index.toindex('plugins');
const apps = { ...xiuxain, ...plugin };
logger.info(`Xiuxian-Plugin-Box[2023-1-16]`);
export { apps }; 