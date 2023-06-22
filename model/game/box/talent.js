import Data from '../data/index.js'
class Talent {
  write(UID, DATA) {
    Data.write(UID, 'fixed_talent', DATA)
  }

  read(UID) {
    Data.readInitial(UID, 'fixed_talent')
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
   * 得到灵根名称
   * @param {*} data
   * @returns
   */
  getTalentName(arr) {
    let name = ''
    const TalentName = this.readInitial('name')
    for (let item of arr) {
      name += TalentName[item]
    }
    return name
  }
}
export default new Talent()
