import fs from "node:fs"
import Config from "./model/Config.js"
import chalk from 'chalk'
import { AppName } from "./app.config.js"
const versionData = Config.getdefSet("version", "version")
let sum = [""]
let filepath = `./plugins/${AppName}/apps`
function readdirectory(dir) {
    let files = fs.readdirSync(dir)
    files.forEach(async item => {
        let filepath1 = dir + '/' + item
        let stat = fs.statSync(filepath1)
        if (stat.isFile()) {
        } else {
            let file = filepath1.replace(filepath, "")
            sum.push(file)
        }
    })
}
readdirectory(filepath)
let apps = {}
var bian = ""
for (var i = 0; i < sum.length; i++) {
    bian = sum[i]
    var files = fs
        .readdirSync(`./plugins/${AppName}/apps` + bian)
        .filter((file) => file.endsWith(".js"))
    for (let file of files) {
        let name = file.replace(".js", "")
        apps[name] = (await import('./apps' + bian + '/' + file))[name]
    }
}
logger.info(chalk.yellow(`修仙模拟器${versionData[0].version}初始化`))
export { apps }
