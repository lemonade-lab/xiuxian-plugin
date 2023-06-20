import Listdata from '../data/listdata.js'
class Talent {
  /**
   * 更新面板
   * @param {*} UID
   */
  updatePanel(UID) {
    const equipment = Listdata.controlAction({
      CHOICE: 'playerEquipment',
      NAME: UID
    })
    const LevelData = Listdata.controlAction({
      CHOICE: 'playerLevel',
      NAME: UID
    })
    const LevelList = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    const levelmini = LevelList[LevelData.gaspractice.realm]
    const levelmax = LevelMaxList[LevelData.bodypractice.realm]
    const UserBattle = Listdata.controlAction({
      CHOICE: 'playerBattle',
      NAME: UID
    })
    let extend = Listdata.controlActionInitial({
      NAME: UID,
      CHOICE: 'playerExtend',
      INITIAL: {}
    })
    const panel = {
      attack: levelmini.attack + levelmax.attack,
      defense: levelmini.defense + levelmax.defense,
      blood: levelmini.blood + levelmax.blood,
      burst: levelmini.burst + levelmax.burst,
      burstmax: levelmini.burstmax + levelmax.burstmax,
      speed: levelmini.speed + levelmax.speed,
      power: 0
    }
    const equ = {
      attack: 0,
      defense: 0,
      blood: 0,
      burst: 0,
      burstmax: 0,
      speed: 0
    }
    equipment.forEach((item) => {
      equ.attack = equ.attack + item.attack
      equ.defense = equ.defense + item.defense
      equ.blood = equ.blood + item.blood
      equ.burst = equ.burst + item.burst
      equ.burstmax = equ.burstmax + item.burstmax
      equ.speed = equ.speed + item.speed
    })
    /* 计算插件临时属性及永久属性 */
    if (extend != {}) {
      extend = Object.values(extend)
      extend.forEach((item) => {
        /* 永久属性计算 */
        equ.attack = equ.attack + item.perpetual.attack
        equ.defense = equ.defense + item.perpetual.defense
        equ.blood = equ.blood + item.perpetual.blood
        equ.burst = equ.burst + item.perpetual.burst
        equ.burstmax = equ.burstmax + item.perpetual.burstmax
        equ.speed = equ.speed + item.perpetual.speed
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
    const bloodLimit = levelmini.blood + levelmax.blood + equ.blood
    /* 双境界面板之和 */
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
    Listdata.controlAction({
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
      const talent = Listdata.controlAction({
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
      let promise = Listdata.controlAction({
        NAME: UID,
        CHOICE: 'playerExtend'
      })
      promise = Object.values(promise)
      let extend = 0
      for (let i in promise) {
        extend += promise[i].perpetual.efficiency * 100
      }
      talent.talentsize = talentSise.talent + talentSise.gonfa + extend
      Listdata.controlAction({
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
  getTalentName(data) {
    const nameArr = []
    data.talent.forEach((talentitem) => {
      const talentList = Listdata.controlAction({
        NAME: 'talent_list',
        CHOICE: 'fixed_talent'
      })
      const name = talentList.find((item) => item.id == talentitem).name
      nameArr.push(name)
    })
    return nameArr
  }

  /**
   * @param { NAME, FLAG, TYPE, VALUE } param0
   * @returns
   */
  addExtendPerpetual({ NAME, FLAG, TYPE, VALUE }) {
    const extend = Listdata.controlActionInitial({
      NAME,
      CHOICE: 'playerExtend',
      INITIAL: {}
    })
    if (!extend[FLAG]) {
      extend[FLAG] = {
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
    extend[FLAG].perpetual[TYPE] = VALUE
    Listdata.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
    this.updatePanel(NAME)
  }
}

export default new Talent()
