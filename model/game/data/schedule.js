import fs from 'node:fs'
import algorithm from './algorithm.js'
import schedule from 'node-schedule'
import { ThePath } from '../../../app.config.js'

/**数据备份*/
class Schedule {
  constructor() {
    /*机器人根目录下统一叫做xiuxiandata */
    this.BACKUPS_PATH = `${ThePath}/xiuxiandata/boxdata`
    /*存档数值位置 */
    this.DATA_PATH = `${ThePath}/xiuxianfile`
  }
  /**
   * @param {  time } param0
   */
  scheduleJobflie = ({ time }) => {
    schedule.scheduleJob(time, () => {
      const myDate = new Date()
      const Y = myDate.getFullYear()
      const M = myDate.getMonth() + 1
      const D = myDate.getDate()
      const h = myDate.getHours()
      const m = myDate.getMinutes()
      const s = myDate.getSeconds()
      fs.cp(
        this.DATA_PATH,
        `${this.BACKUPS_PATH}/${Y}-${M}-${D}-${h}-${m}-${s}`,
        { recursive: true },
        (err) => {}
      )
    })
  }
  /**
   * @param { name } param0
   * @returns
   */
  backuprecovery = ({ name }) => {
    /*查看自己的地址在不在？我的叫做boxdata*/
    if (!fs.existsSync(this.BACKUPS_PATH)) {
      return ['无备份数据']
    }
    /*查看这个备份名字在不在*/
    console.log(`${this.BACKUPS_PATH}/${name}`)
    if (!fs.existsSync(`${this.BACKUPS_PATH}/${name}`)) {
      return ['无此备份']
    }
    /*得到存档的json文件地址*/
    const newsum = algorithm.returnfilepath(this.DATA_PATH, '.json')
    newsum.forEach((item) => {
      /*/循环删除数据*/
      fs.unlink(item, (err) => {})
    })
    /**获得这个备份下的所有子目录 */
    const namefile_subdirectory = algorithm.returnMenu(`${this.BACKUPS_PATH}/${name}`)
    /**获得备份目录下的所有json的文件名*/
    namefile_subdirectory.forEach((itemname) => {
      /*得到所有json名*/
      const jsonName = []
      const files = fs
        .readdirSync(`${this.BACKUPS_PATH}/${name}/${itemname}`)
        .filter((file) => file.endsWith('.json'))
      for (let file of files) {
        file = file.replace('.json', '')
        jsonName.push(file)
      }
      jsonName.forEach((item) => {
        /**原理是？这个文件地址，复制到那个文件地址*/
        let y = `${this.BACKUPS_PATH}/${name}/${itemname}/${item}.json`
        let x = `${this.DATA_PATH}/${itemname}/${item}.json`
        /*不存在就复制*/
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {})
        }
      })
    })
    return ['恢复成功']
  }
}
export default new Schedule()
