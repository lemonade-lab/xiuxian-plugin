import { appsOut } from "./robot/index.js";
const apps = await appsOut("apps").then((req) => {
  logger.info(`xiuxian@1.3.0 start ~`);
  return req;
});
export { apps };
