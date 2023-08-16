import { appsOut } from "./robot/index.js";
const apps = await appsOut().then((req) => {
  logger.info(`xiuxian@1.2.1 start ~`);
  return req;
});
export { apps };
