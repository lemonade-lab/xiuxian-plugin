import { ctrateConfig } from "./model/defset.js";
import { appsOut } from "./robot/index.js";
ctrateConfig();
const apps = await appsOut({ AppsName: "apps" }).then((req) => {
  logger.info(`xiuxian@1.2.1 start ~`);
  return req;
});
export { apps };
