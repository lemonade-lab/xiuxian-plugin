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
            const NEW_PATH = `${plugins__dirname}${path.sep}boxdada${path.sep}${name}.${Y}.${M}.${D}.${h}.${m}.${s}`
            fs.cp(PATH, NEW_PATH, { recursive: true }, (err) => {
                if (err) { }
            })
        })
    }
    //查看备份目录,并以转发的形式丢出
    viewbackups = () => {
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
        const returnpath=(pluginname)=>{
            return  
        }
        /**
         * 切割名字,根据名字来分配,如果是dark
         */
        const [pluginname, time] = name.split('.');
        const ThePath = {
            'xiuxian': `${__dirname}${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'dark': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-plugin${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'home': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-plugin${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`,
            'association': `${__dirname}${path.sep}plugins${path.sep}xiuxian-${pluginname}-pluging${path.sep}resources${path.sep}data${path.sep}birth${path.sep}${pluginname}`
        }
        //得到底下所有的json文件地址
        const newsum = BoxFs.returnfilepath(ThePath[pluginname], '.json')
        newsum.forEach((item) => {
            //循环删除数据
            fs.unlink(item, (err) => {
                console.log(err)
            })
        })
        /**
         * 获得备份下的所有子目录
         */
        const namefile_subdirectory = BoxFs.returnMenu(namefile)
        /**
         * 获得备份目录下的所有json的文件名
         */
        namefile_subdirectory.forEach((itempath) => {
            //当前目录下的json文件名
            const jsonName = [];
            const files = fs
                .readdirSync(`${namefile}/${itempath}`)
                .filter(file => file.endsWith('.json'));
            for (let file of files) {
                file = file.replace('.json', '');
                jsonName.push(file);
            }
            //这里是qq号？
            jsonName.forEach((uid) => {
                /**
                 * 原理是？这个文件地址，复制到那个文件地址
                 */
                let y = `${namefile}/${itempath}/${uid}.json`
                let x = `${ThePath[pluginname]}/${itempath}/${uid}.json`
                //不存在就复制
                if (!fs.existsSync(x)) {
                    //要复制
                    fs.cp(y, x, (err) => {
                        if (err) { }
                    })
                }
            })
        })
        return ['恢复成功']
    }
}
export default new Schedule()