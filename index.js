import { BotApi, GameApi } from "./model/api/api.js";
GameApi.Schedule.scheduleJobflie({ time: "0 0 */1 * * ?" });
const apps = await BotApi.toIndex("apps");
export { apps };
