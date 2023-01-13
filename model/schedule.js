import fs from 'node:fs'
import path from 'path'
import { createRequire } from 'module'
import { appname } from './main.js'
import BoxFs from './boxfs.js'
const require = createRequire(import.meta.url)
const schedule = require('node-schedule')
const plugins__dirname = `${path.resolve()}${path.sep}plugins`
const __dirname = `${plugins__dirname}${path.sep}${appname}`
class Schedule {
    scheduleJobflie = (name, time, newpath) => {
        schedule.scheduleJob(time, () => {
            const myDate = new Date()
            const Y = myDate.getFullYear()
            const M = myDate.getMonth() + 1
            const D = myDate.getDate()
            const h = myDate.getHours()
            const m = myDate.getMinutes()
            const s = myDate.getSeconds()
            //数据位置
            let PATH = `${__dirname}${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${name}`
            if (newpath != undefined) {
                //新数据位置
                PATH = newpath
            }
            //备份位置不变
            const NEW_PATH = `${plugins__dirname}${path.sep}boxdada${path.sep}${name}.${Y}${M}${D}${h}${m}${s}`
            fs.cp(PATH, NEW_PATH, { recursive: true }, (err) => {
                if (err) { }
            })
        })
    }
    //查看备份目录,并以转发的形式丢出
    viewbackups = (name) => {
        const NEW_PATH = `${plugins__dirname}${path.sep}boxdada`
        if (!fs.existsSync(NEW_PATH)) {
            return ['无备份数据']
        }
        const msg = BoxFs.returnMenu(NEW_PATH)
        return msg
    }
    backuprecovery = (name) => {
        const NEW_PATH = `${plugins__dirname}${path.sep}boxdada`
        if (!fs.existsSync(NEW_PATH)) {
            return ['无备份数据']
        }
        const namefile = `${NEW_PATH}${path.sep}${name}`
        if (!fs.existsSync(namefile)) {
            return ['无此备份']
        }
        const msg = []
        const sum = BoxFs.returnMenu(NEW_PATH)
        /**
         * 切割名字,根据名字来分配,如果是dark
         */
        const [pluginname, time] = name.split('.');
        const ThePath = {
            'xiuxian': `${__dirname}${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'dark': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-plugin${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'home': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-plugin${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'association': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-plugin${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`
        }
        const newsum = BoxFs.returnfilepath(ThePath[pluginname],'.json')
        newsum.forEach((item)=>{
            //循环删除数据
        })
        /**
         * 获取备份地址的下的所有json
         */


        console.log(newsum)
        return msg
    }
}
export default new Schedule()