import { appname } from './model/main.js';
import { BotApi, GameApi } from './model/api/api.js';
GameApi.Schedule.scheduleJobflie({ time: '0 0 */1 * * ?' });
logger.info(`${appname}[2023-2-1]`);
const apps = await BotApi.Index.toindex({ indexName: 'apps' });
export { apps }; 