const alldata = {}
const addall = {}
const full = [
  '蜥',
  '狮',
  '鹏',
  '雕',
  '雀',
  '豹',
  '虎',
  '龟',
  '猫',
  '龙',
  '鲲',
  '鸡',
  '蛇',
  '狼',
  '鼠',
  '鹿',
  '貂',
  '猴',
  '狗',
  '熊',
  '羊',
  '牛',
  '象',
  '兔',
  '猪'
]
const name = {
  1: '兵',
  2: '将',
  3: '兽',
  4: '魔',
  5: '妖',
  6: '爵',
  7: '王',
  8: '皇',
  9: '帝',
  10: '神'
}
const map = {
  1: '1.3',
  2: '1.3',
  3: '1.4',
  4: '2.5',
  5: '3.6',
  6: '4.7',
  7: '1.3',
  8: '5.8',
  9: '5.8',
  10: '5.8',
  11: '6.9',
  12: '2.5',
  13: '7.10'
}
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
