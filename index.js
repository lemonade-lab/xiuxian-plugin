import index from './model/robot/index.js';
import { appname } from './model/main.js';
import schedule from './model/game/data/schedule.js';
schedule.scheduleJobflie({ time: '0 0 */1 * * ?' });
const apps = await index.toindex({ indexName: 'apps' });
logger.info(`${appname}[2023-1-20]`);
export { apps }; 