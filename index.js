import index from './model/robot/index.js';
import schedule from './model/game/data/schedule.js';
schedule.scheduleJobflie({ name: 'xiuxian', time: '0 0 */1 * * ?' });
const apps = await index.toindex({ indexName: 'apps' });
logger.info(`Xiuxian-Plugin-Box[2023-1-20]`);
export { apps }; 