import Data from '../data/index.js'
class Extend {
  constructor() {
    this.equi = {
      attack: 0,
      defense: 0,
      blood: 0,
      burst: 0,
      burstmax: 0,
      speed: 0
    }
    this.extendData = {
      times: [],
      perpetual: {
        attack: 0,
        defense: 0,
        blood: 0,
        burst: 0,
        burstmax: 0,
        speed: 0,
        efficiency: 0
      }
    }
  }

  /**
   *
   * @param {*} UID
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.write(UID, 'playerExtend', DATA)
  }

  /**
   *
   * @param {*} UID
   * @param {*} Initial
   */
  readInitial(UID, Initial) {
    Data.readInitial(UID, 'playerExtend', Initial)
  }

  /**
   * 更新面板
   * @param {*} UID
   */
  updatePanel(UID) {
    const equipment = Data.controlAction({
      CHOICE: 'playerEquipment',
      NAME: UID
    })
    const LevelData = Data.controlAction({
      CHOICE: 'playerLevel',
      NAME: UID
    })

    const LevelList = Data.controlAction({ NAME: 'gaspractice', CHOICE: 'fixed_levels' })
    const LevelMaxList = Data.controlAction({ NAME: 'bodypractice', CHOICE: 'fixed_levels' })

    // 当前境界数据
    const gaspractice = LevelList[LevelData.gaspractice.realm]
    const bodypractice = LevelMaxList[LevelData.bodypractice.realm]
    const UserBattle = Data.controlAction({
      CHOICE: 'playerBattle',
      NAME: UID
    })

    let extend = this.readInitial(UID, {})
    const equ = this.equi
    equipment.forEach((item) => {
      equ.attack += item.attack
      equ.defense += item.defense
      equ.blood += item.blood
      equ.burst += item.burst
      equ.burstmax += item.burstmax
      equ.speed += item.speed
    })
    /* 计算插件临时属性及永久属性 */
    if (extend != {}) {
      extend = Object.values(extend)
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
    Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle',
      DATA: panel
    })
  }

  /**
   * 更新天赋
   * @param {*} UID
   * @returns
   */
  updataEfficiency(UID) {
    try {
      const talent = Data.controlAction({
        NAME: UID,
        CHOICE: 'playerTalent'
      })
      const talentSise = {
        gonfa: 0,
        talent: 0
      }
      talent.AllSorcery.forEach((item) => {
        talentSise.gonfa += item.size
      })
      talentSise.talent = this.talentSize(talent)
      let promise = this.readInitial(UID, {})
      promise = Object.values(promise)
      let extend = 0
      for (let i in promise) {
        extend += promise[i].perpetual.efficiency * 100
      }
      talent.talentsize = talentSise.talent + talentSise.gonfa + extend
      Data.controlAction({
        NAME: UID,
        CHOICE: 'playerTalent',
        DATA: talent
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * @param { NAME, FLAG, TYPE, VALUE } param0
   * @returns
   */
  addExtendPerpetual({ NAME: UID, FLAG, TYPE, VALUE }) {
    const extend = this.readInitial(UID, {})
    if (!extend[FLAG]) {
      extend[FLAG] = this.extendData
    }
    extend[FLAG].perpetual[TYPE] = VALUE
    this.write(UID, extend)
    this.updatePanel(UID)
  }
}

export default new Extend()
