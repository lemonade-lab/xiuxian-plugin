import fs from "fs";
import { AppName } from "../app.config.js";
export const ctrateConfig = () => {
  let __path = `./plugins/${AppName}`;
  let xiuxianSetFile = `${__path}/config/xiuxian/xiuxian.yam`;
  let xiuxainDefset = `${__path}/defset/xiuxian/xiuxian.yaml`;
  if (!fs.existsSync(xiuxianSetFile)) {
    fs.copyFileSync(xiuxainDefset, xiuxianSetFile);
  }
};
