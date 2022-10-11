import fs from "node:fs";
import Config from "./model/Config.js";

/**
 * 遍历获取
 */
let sum = [""];
let filepath = "./plugins/xiuxian-emulator-plugin/apps"
function readdirectory(dir) {
  let files = fs.readdirSync(dir);
  files.forEach(async item => {
    let filepath1 = dir + '/' + item
    let stat = fs.statSync(filepath1)
    if (stat.isFile()) {
    } else {
      let file = filepath1.replace(filepath, "");
      sum.push(file);
    }
  })
}
readdirectory(filepath);
/**
 * import
 */
let apps = {};
var bian = "";
//循环写入
for (var i = 0; i < sum.length; i++) {
  bian = sum[i];
  var files = fs
    .readdirSync("./plugins/xiuxian-emulator-plugin/apps" + bian)
    .filter((file) => file.endsWith(".js"));
  for (let file of files) {
    let name = file.replace(".js", "");
    apps[name] = (await import('./apps' + bian + '/' + file))[name];
  }
}
//导出
export { apps };
const versionData = Config.getdefSet("version", "version");
logger.info(`__________________________`);
logger.info(`[修仙模拟器${versionData[0].version}]初始化！`);
logger.info(`答疑群：685979617`);
logger.info(`__________________________`);