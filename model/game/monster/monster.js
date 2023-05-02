import listdata from '../data/listdata.js'
const alldata = {}
const addall = {}
const full = await listdata.listAction({ NAME: 'full', CHOICE: 'fixed_monster' })
const name = await listdata.listAction({ NAME: 'name', CHOICE: 'fixed_monster' })
const map = await listdata.listAction({ NAME: 'map', CHOICE: 'fixed_monster' })
/**怪物生成*/
class GameMonster {
  /**
   * @param { i } param0
   * @returns
   */
  monsterscache = async ({ i }) => {
    if (!alldata.hasOwnProperty(i)) {
      alldata[i] = {
        label: 99,
        data: []
      }
    }
    /*时间变了*/
    if (new Date().getHours() != alldata[i].label) {
      alldata[i].data = await this.generateMonster({ i })
      return alldata[i].data
    } else {
      /* 时间没变 */
      if (alldata[i].data.length != 0) {
        return alldata[i].data
      }
      alldata[i].data = await this.generateMonster({ i })
      return alldata[i].data
    }
  }
  /**
   * @param { i, num } param0
   * @returns
   */
  add = async ({ i, num }) => {
    if (!addall.hasOwnProperty(i)) {
      addall[i] = {
        acount: 0
      }
    }
    addall[i].acount += num
    const p = Math.floor(Math.random() * (30 - 10)) + Number(10)
    if (addall[i].acount > p) {
      addall[i].acount = 0
      return 1
    }
    return 0
  }
  /**
   * @param { i } param0
   * @returns
   */
  generateMonster = async ({ i }) => {
    const [mini, max] = map[i].split('.')
    alldata[i].label = new Date().getHours()
    alldata[i].data = []
    for (let j = 0; j < max; j++) {
      const alevel = Math.floor(Math.random() * (max - mini + 1) + Number(mini))
      alldata[i].data.push({
        name: full[Math.floor(Math.random() * full.length)] + name[alevel],
        killNum: 1,
        level: alevel
      })
    }
    return alldata[i].data
  }
}
export default new GameMonster()
