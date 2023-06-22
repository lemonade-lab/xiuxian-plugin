import Data from '../data/index.js'
import Extend from './extend.js'
class Talent {
  /**
   * 写入
   * @param {*} name
   * @param {*} DATA
   */
  write(name, DATA) {
    Data.write(name, 'playerTalent', DATA)
  }

  /**
   * 读取
   * @param {*} name
   * @returns
   */
  read(name) {
    return Data.read(name, 'playerTalent')
  }

  /**
   * tudo
   * 计算天赋大小
   * @param {*} data
   * @returns
   */
  talentSize = (data) => {
    let talentSize = 250
    /* 根据灵根数来判断 */
    for (let i = 0; i < data.length; i++) {
      /* 循环加效率 */
      if (data[i] <= 5) {
        talentSize -= 50
      }
      if (data[i] >= 6) {
        talentSize -= 40
      }
    }
    return talentSize
  }

  /**
   * 随机生成灵根
   * @returns
   */
  getTalent() {
    const newtalent = []
    const talentacount = Math.round(Math.random() * (5 - 1)) + 1
    for (let i = 0; i < talentacount; i++) {
      const x = Math.round(Math.random() * (10 - 1)) + 1
      const y = newtalent.indexOf(x)
      if (y != -1) {
        continue
      }
      if (x <= 5) {
        const z = newtalent.indexOf(x + 5)
        if (z != -1) {
          continue
        }
      } else {
        const z = newtalent.indexOf(x - 5)
        if (z != -1) {
          continue
        }
      }
      newtalent.push(x)
    }
    return newtalent
  }

  /**
   * 更新天赋
   * @param {*} UID
   * @returns
   */
  updataEfficiency(UID) {
    try {
      const talent = this.read(UID)
      const talentSise = {
        gonfa: 0,
        talent: 0
      }
      talent.AllSorcery.forEach((item) => {
        talentSise.gonfa += item.size
      })
      talentSise.talent = this.talentSize(talent)
      let promise = Object.values(Extend.readInitial(UID, {}))
      let extend = 0
      for (let item in promise) {
        extend += promise[item].perpetual.efficiency * 100
      }
      talent.talentsize = talentSise.talent + talentSise.gonfa + extend
      this.write(UID, talent)
      return true
    } catch {
      return false
    }
  }

  /**
   * 得到灵根名称
   * @param {*} data
   * @returns
   */
  getTalentName(arr) {
    let name = ''
    const TalentName = Data.read('name', 'fixed_talent')
    for (let item of arr) {
      name += TalentName[item]
    }
    return name
  }
}
export default new Talent()
