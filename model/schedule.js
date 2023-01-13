import fs from 'node:fs'
import path from 'path'
import { createRequire } from 'module'
import { appname } from './main.js'
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
            const NEW_PATH = `${plugins__dirname}${path.sep}boxdada${path.sep}${name}${Y}${M}${D}${h}${m}${s}`
            fs.cp(PATH, NEW_PATH, { recursive: true }, (err) => {
                if (err) { }
            })
        })
    }
    //查看备份目录,并以转发的形式丢出
    viewbackups = (name) => {
        const msg = []
        /**
         * 判断目录是否存在,不存就是不存在备份
         */
        const NEW_PATH = `${plugins__dirname}${path.sep}boxdada`
        if (!fs.existsSync(NEW_PATH)) {
            msg.push('无备份数据')
            return msg
        }
        /**
         * 返回该目录下子目录名
         */
        const readdirectory = (dir) => {
            let files = fs.readdirSync(dir)
            files.forEach(async item => {
                let filepath1 = `${dir}/${item}`
                let stat = fs.statSync(filepath1)
                if (!stat.isFile()) {
                    let file = filepath1.replace(`${NEW_PATH}/`, '')
                    msg.push(file)
                }
            })
        }
        readdirectory(NEW_PATH)
        //检索
        console.log(name)
        return msg
    }
    backuprecovery = (name) => {
        const msg = []
        /**
         * 判断目录是否存在,不存就是不存在备份
         */
        const NEW_PATH = `${plugins__dirname}${path.sep}boxdada`
        if (!fs.existsSync(NEW_PATH)) {
            msg.push('无备份数据')
            return msg
        }
        const namefile = `${NEW_PATH}${path.sep}${name}`
        if (!fs.existsSync(namefile)) {
            msg.push('无此备份')
            return msg
        }

        /*

        //循环拿到子目录名
        const sum=[]
        const readdirectory = (dir) => {
            let files = fs.readdirSync(dir)
            files.forEach(async item => {
                let filepath1 = `${dir}/${item}`
                let stat = fs.statSync(filepath1)
                if (!stat.isFile()) {
                    let file = filepath1.replace(`${NEW_PATH}/`, '')
                    sum.push(file)
                }
            })
        }
        readdirectory(NEW_PATH)
        sum.forEach((item)=>{
            const newfile=`${namefile}${path.sep}${item}`
        })

        let y=''
        let x=''
        fs.cp(y, x, (err) => {
            if (err) { }
          })

           */


        return msg
    }
}
export default new Schedule()