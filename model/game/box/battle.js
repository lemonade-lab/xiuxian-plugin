import Data from '../data/index.js'
import levels from './levels.js'
import Equipment from './equipment.js'
import Extend from './extend.js'
class Battle {
  constructor() {
    this.equi = {
      attack: 0,
      defense: 0,
      blood: 0,
      burst: 0,
      burstmax: 0,
      speed: 0
    }
  }

  /**
   * 写入
   * @param {*} UID
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.write(UID, 'playerBattle', DATA)
  }

  /**
   * 读取
   * @param {*} UID
   * @param {*} DATA
   */
  read(UID) {
    return Data.read(UID, 'playerBattle')
  }

  /**
   * 更新面板
   * @param {*} UID
   */
  updatePanel(UID) {
    // 数据读取
    const equipment = Equipment.read(UID)
    const LevelData = levels.read(UID)

    // 固定数据读取
    const LevelList = Data.controlAction({ NAME: 'gaspractice', CHOICE: 'fixed_levels' })
    const LevelMaxList = Data.controlAction({ NAME: 'bodypractice', CHOICE: 'fixed_levels' })

    // 当前境界数据
    const gaspractice = LevelList[LevelData.gaspractice.realm]
    const bodypractice = LevelMaxList[LevelData.bodypractice.realm]

    // 读取
    const UserBattle = this.read(UID)

    // 临时属性读取
    let extend = Extend.readInitial(UID, {})

    // 装备数据记录
    const equ = this.equi
    equipment.forEach((item) => {
      equ.attack += item.attack
      equ.defense += item.defense
      equ.blood += item.blood
      equ.burst += item.burst
      equ.burstmax += item.burstmax
      equ.speed += item.speed
    })

    console.log(extend)
    /* 计算插件临时属性及永久属性 */
    if (Object.keys(extend).length !== 0) {
      extend = Object.values(extend)
      console.log(extend)
      extend.forEach((item) => {
        /* 永久属性计算 */
        equ.attack += item.perpetual.attacks
        equ.defense += item.perpetual.defense
        equ.blood += item.perpetual.blood
        equ.burst += item.perpetual.burst
        equ.burstmax += item.perpetual.burstmax
        equ.speed += item.perpetual.speed
        /* 临时属性计算 */
        if (item.times.length != 0) {
          item.times.forEach((timesitem) => {
            if (timesitem.timeLimit > new Date().getTime()) {
              equ[timesitem.type] += timesitem.value
            }
          })
        }
      })
    }

    /* 血量上限 换装导致血量溢出时需要----------------计算错误:不能增加血量上限 */
    const bloodLimit = gaspractice.blood + bodypractice.blood + equ.blood
    /* 双境界面板之和 */

    // 统计基础数据
    const panel = {
      // 基础攻击
      attack: gaspractice.attack + bodypractice.attack,
      defense: gaspractice.defense + bodypractice.defense,
      blood: gaspractice.blood + bodypractice.blood,
      burst: gaspractice.burst + bodypractice.burst,
      burstmax: gaspractice.burstmax + bodypractice.burstmax,
      speed: gaspractice.speed + bodypractice.speed,
      power: 0
    }

    // 百分比效果
    panel.attack = Math.floor(panel.attack * (equ.attack * 0.01 + 1))
    panel.defense = Math.floor(panel.defense * (equ.defense * 0.01 + 1))
    panel.blood = bloodLimit
    panel.nowblood = UserBattle.nowblood > bloodLimit ? bloodLimit : UserBattle.nowblood
    panel.burst += equ.burst
    panel.burstmax += equ.burstmax
    panel.speed += equ.speed
    panel.power =
      panel.attack +
      panel.defense +
      bloodLimit / 2 +
      panel.burst * 100 +
      panel.burstmax * 10 +
      panel.speed * 50
    // 写入
    this.write(UID, panel)
  }
}

export default new Battle()
