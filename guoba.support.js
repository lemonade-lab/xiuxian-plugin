import path from "path";
import Config from "./model/Config.js";
import { AppName } from './app.config.js'
const _path = `${process.cwd()}/plugins/${AppName}`
const link = `https://gitee.com/ningmengchongshui/${AppName}/`
const versionData = Config.getdefSet("version", "version");
export function supportGuoba() {
    return {
        pluginInfo: {
            name: AppName,
            title: "修仙模拟器",
            author: "",
            authorLink: "",
            link,
            isV3: true,
            isV2: false,
            description: `修仙模拟器${versionData[0].version}]`,
            icon: "mdi:stove",
            iconColor: "#d19f56",
            iconPath: path.join(_path, "resources/img/xiuxian.png"),
        }
    }
}
