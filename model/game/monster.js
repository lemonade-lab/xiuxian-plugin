import listdata from './data/listdata.js'
const alldata = {}
const full = listdata.controlAction({ NAME: 'full', CHOICE: 'fixed_monster' })
const MonsterName = listdata.controlAction({ NAME: 'name', CHOICE: 'fixed_monster' })
const map = listdata.controlAction({ NAME: 'map', CHOICE: 'fixed_monster' })
/** 怪物生成 */
class GameMonster {
  /**
   *
   * @param {*} i   地域
   * @returns
   */
  monsterscache(i) {
    /** 根据地域位置返回怪物数据 */
    if (!Object.prototype.hasOwnProperty.call(alldata, i)) {
      alldata[i] = {
        label: 99,
        data: {}
      }
    }
    /* 时间变了 */
    if (new Date().getHours() != alldata[i].label) {
      alldata[i].data = this.generateMonster(i)
      return alldata[i].data
    } else {
      return alldata[i].data
    }
  }

  /**
   * @param {*} i  地域
   * @param {*} num 名字
   * @returns
   */
  add(i, name) {
    alldata[i].data[name].killNum += 1
    const p = Math.floor(Math.random() * (30 - 10)) + Number(10)
    if (alldata[i].data[name].killNum > p) {
      alldata[i].data[name].killNum = 0
      return true
    }
    return false
  }

  /**
   *
   * @param {*} i 地域
   * @returns
   */
  generateMonster(i) {
    const [mini, max] = map[i].split('.')
    alldata[i].label = new Date().getHours()
    alldata[i].data = {}
    for (let j = 0; j < max; j++) {
      const alevel = Math.floor(Math.random() * (max - mini + 1) + Number(mini))
      const name = full[Math.floor(Math.random() * full.length)] + MonsterName[alevel]
      alldata[i].data[name] = {
        killNum: 1,
        level: alevel
      }
    }
    return alldata[i].data
  }
}
export default new GameMonster()
