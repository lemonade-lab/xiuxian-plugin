import fs from 'node:fs'
import path from 'path'
import { createRequire } from 'module'
import { appname } from './main.js'
const require = createRequire(import.meta.url)
const schedule = require('node-schedule')
const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}${appname}`
class XiuxianSchedule {
    scheduleJobflie = (name,time,newpath) => {
        schedule.scheduleJob(time, () => {
            const myDate = new Date()
            const Y = myDate.getFullYear()
            const M = myDate.getMonth()+1
            const D = myDate.getDate()
            const h = myDate.getHours()
            const m = myDate.getMinutes()
            const s = myDate.getSeconds()
            //数据位置
            let PATH = `${__dirname}${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${name}`
            if(newpath!=undefined){
                //新数据位置
                PATH=newpath
            }
            //备份位置不变
            const NEW_PATH = `${path.resolve()}${path.sep}plugins${path.sep}XiuxianData${path.sep}${name}${Y}${M}${D}${h}${m}${s}`
            fs.cp(PATH, NEW_PATH, { recursive: true }, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        })
    }
}
export default new XiuxianSchedule()