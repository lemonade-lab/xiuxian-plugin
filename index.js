import { BotApi, GameApi } from "./model/api/api.js";
import { appname } from "./app.config.js";
GameApi.Schedule.scheduleJobflie({ time: "0 0 */1 * * ?" });
const apps = await BotApi.toIndex("apps")
    .then((res) => {
        logger.info(`${appname} start ~`);
        return res
    }).catch((err) => {
        logger.info(err);
    });
export { apps };
