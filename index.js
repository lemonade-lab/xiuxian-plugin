import index from './model/robot/index.js';
import schedule from './model/game/data/schedule.js';
schedule.scheduleJobflie('xiuxian', '0 0 */1 * * ?');
const xiuxain = await index.toindex({ indexName: 'apps', offArr: ['model', 'resources'] });
const plugin = await index.toindex({ indexName: 'plugins', offArr: ['model', 'resources'] });
const apps = { ...xiuxain, ...plugin };
logger.info(`Xiuxian-Plugin-Box[2023-1-16]`);
export { apps }; 