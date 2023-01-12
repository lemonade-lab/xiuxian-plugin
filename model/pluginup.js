import fs from 'node:fs'
import path from 'path'
import {
  existplayer,
  Write_level,
  Read,
  Read_level,
  Numbers,
  createBoxPlayer
} from './public.js'
const __dirname = `${path.resolve()}${path.sep}plugins`
class pluginup {
  constructor() { }
  pluginupdata = (pluginname) => {
    try {
      const newpath = `${pluginname}${path.sep}resources${path.sep}data${path.sep}xiuxian_player`
      const NEW__PATH = `${__dirname}${path.sep}${newpath}`
      const data = this.getadress(NEW__PATH, 'json')
      data.forEach(async (item) => {
        const user_qq = item.replace(`${NEW__PATH}${path.sep}`, '').replace('.json', '')
        await this.Create_player(user_qq)
        const player = await Read(item)
        let level = await Read_level(user_qq)
        level.level_id = await Numbers(player.level_id / 5)
        level.levelmax_id = await Numbers(player.Physique_id / 5)
        level.experience = await Numbers(player.修为)
        level.experiencemax = await Numbers(player.血气)
        await Write_level(user_qq, level)
      })
      return `共${data.length}名获得前世记忆`
    } catch {
      return '升级失败'
    }
  }
  /**
   * 
   * @param {地址} PATH 
   * @param {文件类型} type 
   * @returns 含有所有数据的路径
   */
  getadress = (PATH, type) => {
    const newsum = []
    const travel = (dir, callback) => {
      fs.readdirSync(dir).forEach((file) => {
        var pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback)
        } else {
          callback(pathname)
        }
      })
    }
    travel(PATH, (pathname) => {
      let temporary = pathname.search(type)
      if (temporary != -1) {
        newsum.push(pathname)
      }
    })
    return newsum
  }
  /**
   * 这里需要一个专门用来给升级写的初始化存档
   */
  Create_player = async (uid) => {
    const ifexistplay = await existplayer(uid)
    if (ifexistplay) {
      return
    }
    await createBoxPlayer(uid)
    return
  }
}
export default new pluginup()