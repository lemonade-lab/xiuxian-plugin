import fs from 'node:fs'
import path from 'path'
import algorithm from './algorithm.js'
import { __dirname } from '../../main.js'
import schedule from 'node-schedule'
/**
 * 数据备份
 */
class Schedule {
    constructor() {
        this.NEW_PATH = `${path.resolve()}/plugins/boxdata`
    }
    scheduleJobflie = (parameter) => {
        const { name, time, newpath } = parameter
        schedule.scheduleJob(time, () => {
            const myDate = new Date()
            const Y = myDate.getFullYear()
            const M = myDate.getMonth() + 1
            const D = myDate.getDate()
            const h = myDate.getHours()
            const m = myDate.getMinutes()
            const s = myDate.getSeconds()
            //数据位置
            let PATH = `${__dirname}/resources/data/birth/${name}`
            if (newpath != undefined) {
                //新数据位置
                PATH = newpath
            }
            //备份位置不变
            const THE_PATH = `${this.NEW_PATH}/${name}.${Y}-${M}-${D}-${h}-${m}-${s}`
            fs.cp(PATH, THE_PATH, { recursive: true }, (err) => {
                if (err) { }
            })
        })
    }
    //查看备份目录,并以转发的形式丢出
    viewbackups = () => {
        if (!fs.existsSync(this.NEW_PATH)) {
            return ['无备份数据']
        }
        const msg = algorithm.returnMenu(this.NEW_PATH)
        if (msg.length > 50) {
            return ['当前备份数大于50\n请自行查看备份名称', this.NEW_PATH]
        }
        return msg
    }
    backuprecovery = (parameter) => {
        const { name } = parameter
        if (!fs.existsSync(this.NEW_PATH)) {
            return ['无备份数据']
        }
        const namefile = `${this.NEW_PATH}/${name}`
        if (!fs.existsSync(namefile)) {
            return ['无此备份']
        }
        const [pluginname, time] = name.split('.');
        const ThePath = {
            'xiuxian': `${__dirname}/resources/data/birth/${pluginname}`,
        }
        //得到底下所有的json文件地址
        const newsum = algorithm.returnfilepath(ThePath[pluginname], '.json')
        newsum.forEach((item) => {
            //循环删除数据
            fs.unlink(item, (err) => {
                console.log(err)
            })
        })
        /**
         * 获得备份下的所有子目录
         */
        const namefile_subdirectory = algorithm.returnMenu(namefile)
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
            jsonName.forEach((item) => {
                /**
                 * 原理是？这个文件地址，复制到那个文件地址
                 */
                let y = `${namefile}/${itempath}/${item}.json`
                let x = `${ThePath[pluginname]}/${itempath}/${item}.json`
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