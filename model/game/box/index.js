import algorithm from '../data/algorithm.js'
import listdata from '../data/listdata.js'
import Wrap from '../wrap/index.js'
import { __PATH } from '../data/index.js'
import config from '../data/defset.js'
import Method from '../wrap/method.js'
class Player {
  startLife() {
    const LifeData = listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    // 记录死亡
    const die = []
    const cf = config.getConfig({ name: 'cooling' })
    for (let UID in LifeData) {
      LifeData[UID].Age += cf.Age.size ? cf.Age.size : 1
      if (LifeData[UID].Age >= LifeData[UID].life) {
        LifeData[UID].status = 0
        die.push(LifeData[UID].qq)
      }
    }
    listdata.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: LifeData
    })
    // 清除死亡uid
    for (let UID of die) {
      Wrap.deleteAction(UID)
    }
  }

  /**
   * @param UID  param0
   * @returns
   */
  createBoxPlayer(UID) {
    const NowTime = new Date().getTime()
    const LevelList = listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle',
      DATA: {
        nowblood:
          LevelList.find((item) => item.id == 1).blood +
          LevelMaxList.find((item) => item.id == 1).blood // 血量
      }
    })
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: {
        spiritual: 100, // 灵力
        spiritualUpper: 100, // 灵力上限
        prestige: 50, // 魔力
        reputation: 0, // 声望
        level: {
          gaspractice: {
            experience: 0, // 经验
            realm: 0 // 境界
          },
          bodypractice: {
            experience: 0,
            realm: 0
          },
          soul: {
            experience: 0,
            realm: 0
          }
        }
      }
    })
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_wealth',
      DATA: {
        lingshi: 0,
        xianshi: 0
      }
    })
    const PosirionList = listdata.controlAction({
      CHOICE: 'generate_position',
      NAME: 'position'
    })
    const position = PosirionList.find((item) => item.name == '极西')
    const positionID = position.id.split('-')
    const coordinate = {
      mx: Math.floor(Math.random() * (position.x2 - position.x1)) + Number(position.x1),
      my: Math.floor(Math.random() * (position.y2 - position.y1)) + Number(position.y1)
    }
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_action',
      DATA: {
        game: 1, // 游戏状态
        Couple: 1, // 双修
        newnoe: 1, // 新人
        x: coordinate.mx,
        y: coordinate.my,
        z: positionID[0], // 位面
        region: positionID[1], // 区域
        address: positionID[2], // 属性
        Exchange: 0
      }
    })
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: {
        grade: 1,
        lingshimax: 50000, // 废弃
        lingshi: 0, // 废弃
        thing: []
      }
    })
    const newtalent = this.getTalent()
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_talent',
      DATA: {
        talent: newtalent, // 灵根
        talentshow: 1, // 显示0,隐藏1
        talentsize: 0, // 天赋
        AllSorcery: [] // 功法
      }
    })
    const FullName = {
      full: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
      name: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    }
    const name = Method.Anyarray(FullName.full) + Method.Anyarray(FullName.name)
    const LifeData = listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      INITIAL: {}
    })
    LifeData[UID] = {
      name: `${name}`,
      autograph: '无', // 道宣
      Age: 1, // 年龄
      life: Math.floor(Math.random() * (84 - 60) + 60), // 寿命
      createTime: NowTime, // 创建时间
      status: 1 // 是否死亡
    }
    /** 更新用户表 */
    listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      DATA: LifeData,
      INITIAL: {}
    })
    // 签到
    const SignData = listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      INITIAL: {}
    })
    SignData[UID] = {
      signTine: NowTime, // 签到时间-超过24h,重置size
      signSize: 0, // 签到次数
      signDay: 0, // 签到日为 0
      sginMath: 0 // 签到的月份,不同月重置size
    }
    listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      DATA: SignData,
      INITIAL: {}
    })
    // 天赋
    listdata.controlAction({ NAME: UID, CHOICE: 'user_extend', DATA: {} })
    /** 更新装备 */
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: []
    })
    /** 更新天赋面板 */
    this.updataUserEfficiency(UID)
    /** 更新战斗面板 */
    this.readPanel(UID)
    return true
  }

  /**
   * 给UID添加物品name的数量为account
   * @param { UID, name, ACCOUNT } param0
   * @returns
   */
  userBag({ UID, name, ACCOUNT }) {
    // 搜索物品信息
    const thing = listdata.searchThing({
      condition: 'name',
      name
    })
    if (thing) {
      let bag = listdata.controlAction({ CHOICE: 'user_bag', NAME: UID })
      bag = this.userbagAction({
        BAG: bag,
        THING: thing,
        ACCOUNT: Number(ACCOUNT)
      })
      listdata.controlAction({ CHOICE: 'user_bag', NAME: UID, DATA: bag })
      return true
    }
    return false
  }

  /**
   * 材料仓库物品增减
   * @param { UID, name, ACCOUNT } param0
   * @returns
   */
  userMaterial({ UID, name, ACCOUNT }) {
    // 搜索物品信息
    const thing = listdata.searchThing({
      CHOICE: 'fixed_material',
      NAME: 'MaterialGUIDe',
      condition: 'name',
      name
    })
    if (thing) {
      let bag = listdata.controlAction({
        CHOICE: 'user_material',
        NAME: UID
      })
      bag = this.userMaterialAction({
        BAG: bag,
        THING: thing,
        ACCOUNT: Number(ACCOUNT)
      })
      listdata.controlAction({
        CHOICE: 'user_material',
        NAME: UID,
        DATA: bag
      })
      return true
    }
    return false
  }

  userMaterialAction(parameter) {
    let { BAG, THING, ACCOUNT } = parameter
    const thing = BAG.find((item) => item.id == THING.id)
    if (thing) {
      let acount = Number(thing.acount) + Number(ACCOUNT)
      if (Number(acount) < 1) {
        BAG = BAG.filter((item) => item.id != THING.id)
      } else {
        BAG.find((item) => item.id == THING.id).acount = Number(acount)
      }
      return BAG
    } else {
      THING.acount = Number(ACCOUNT)
      BAG.thing.push(THING)
      return BAG
    }
  }

  /**
   * 给储物袋添加物品
   * @param { BAG, THING, ACCOUNT } param0
   * @returns
   */
  userbagAction(parameter) {
    const { BAG, THING, ACCOUNT } = parameter
    const thing = BAG.thing.find((item) => item.id == THING.id)
    if (thing) {
      let acount = Number(thing.acount) + Number(ACCOUNT)
      if (Number(acount) < 1) {
        BAG.thing = BAG.thing.filter((item) => item.id != THING.id)
      } else {
        BAG.thing.find((item) => item.id == THING.id).acount = Number(acount)
      }
      return BAG
    } else {
      THING.acount = Number(ACCOUNT)
      BAG.thing.push(THING)
      return BAG
    }
  }

  /**
   * 搜索UID的背包有没有物品名为NAME
   * @param { UID, name } param0
   * @returns 返回该物品
   */

  userBagSearch({ UID, name }) {
    const bag = listdata.controlAction({ CHOICE: 'user_bag', NAME: UID })
    return bag.thing.find((item) => item.name == name)
  }

  userMaterialSearch = ({ UID, name }) => {
    const bag = listdata.controlAction({
      CHOICE: 'user_material',
      NAME: UID
    })
    return bag.find((item) => item.name == name)
  }

  /**
   * @param UID  param0
   * @returns 返回UID的面板
   */ readPanel(UID) {
    const equipment = listdata.controlAction({
      CHOICE: 'user_equipment',
      NAME: UID
    })
    const LevelData = listdata.controlAction({
      CHOICE: 'user_level',
      NAME: UID
    })
    const LevelList = listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    const levelmini = LevelList[LevelData.level.gaspractice.realm]
    const levelmax = LevelMaxList[LevelData.level.bodypractice.realm]
    const UserBattle = listdata.controlAction({
      CHOICE: 'user_battle',
      NAME: UID
    })
    let extend = listdata.controlActionInitial({
      NAME: UID,
      CHOICE: 'user_extend',
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
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle',
      DATA: panel
    })
  }

  /**
   * 计算天赋
   * @returns
   */
  updataUserEfficiency(UID) {
    try {
      const talent = listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_talent'
      })
      const talentSise = {
        gonfa: 0,
        talent: 0
      }
      talent.AllSorcery.forEach((item) => {
        talentSise.gonfa += item.size
      })
      talentSise.talent = this.talentSize(talent)
      let promise = listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_extend'
      })
      promise = Object.values(promise)
      let extend = 0
      for (let i in promise) {
        extend += promise[i].perpetual.efficiency * 100
      }
      talent.talentsize = talentSise.talent + talentSise.gonfa + extend
      listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_talent',
        DATA: talent
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * @param {灵根数据} data
   * @returns 灵根天赋值
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
   * @returns 随机生成灵根
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
   * @param { data } param0
   * @returns
   */
  getTalentName(data) {
    const nameArr = []
    data.talent.forEach((talentitem) => {
      const talentList = listdata.controlAction({
        NAME: 'talent_list',
        CHOICE: 'fixed_talent'
      })
      const name = talentList.find((item) => item.id == talentitem).name
      nameArr.push(name)
    })
    return nameArr
  }

  /**
   * 跟listdata.listactoin没有区别,已废除
   * @param { NAME, CHOICE, DATA } param0
   * @returns 若无数据输入则为读取操作，并返回数据
   */
  userMsgAction({ NAME, CHOICE, DATA }) {
    if (DATA) {
      algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA
      })
      return
    }
    return algorithm.dataAction({
      NAME,
      PATH: __PATH[CHOICE]
    })
  }

  /**
   * 表名，地址，属性，大小
   * @param {UID, CHOICE, ATTRIBUTE, SIZE} param0
   * @returns
   */
  updataUser({ UID, CHOICE, ATTRIBUTE, SIZE }) {
    // 读取原数据
    const data = listdata.controlAction({ NAME: UID, CHOICE })
    data[ATTRIBUTE] += Math.trunc(SIZE)
    listdata.controlAction({ NAME: UID, CHOICE, DATA: data })
  }

  /**
   * 返回UID的寿命信息
   * @param UID  UID
   * @returns 不存在则undifind
   */
  existUser(UID) {
    const LifeData = listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      INITIAL: {}
    })
    return LifeData[UID]
  }

  /**
   * 判断是否死亡
   * @param UID  UID
   * @returns
   */
  existUserSatus(UID) {
    let find = this.existUser(UID)
    if (find) {
      if (find.status == 0) {
        return false
      }
      return true
    }
    const CreateGO = this.createBoxPlayer(UID)
    if (!CreateGO) {
      return false
    }
    return true
  }

  getUID(UID) {
    let find = this.existUser(UID)
    if (find) {
      return true
    }
    return false
  }

  /**
   * @returns 返回所有用户UID
   */
  getUserUID() {
    const playerList = []
    const life = listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      INITIAL: {}
    })
    for (let UID in life) {
      playerList.push(UID)
    }
    return playerList
  }

  getTypeThing(position, type) {
    const dropsItemList = listdata.controlAction({
      NAME: 'all',
      CHOICE: 'generate_all'
    })
    const sum = []
    dropsItemList.forEach((item) => {
      const id = item.id.split('-')
      if (id[position] == type) {
        sum.push(item)
      }
    })
    return sum
  }

  randomTypeThing(position, type) {
    const dropsItemList = listdata.controlAction({
      NAME: 'all',
      CHOICE: 'generate_all'
    })
    const sum = []
    for (let item of dropsItemList) {
      const id = item.id.split('-')
      if (id[position] == type) {
        sum.push(item)
      }
    }
    return sum[Math.floor(Math.random() * sum.length)]
  }

  randomThing() {
    const dropsItemList = listdata.controlAction({
      NAME: 'dropsItem',
      CHOICE: 'generate_all'
    })
    return dropsItemList[Math.floor(Math.random() * dropsItemList.length)]
  }

  updataUserBlood({ UID, SIZE }) {
    const battle = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    battle.nowblood += Math.floor(battle.blood * SIZE * 0.01)
    if (battle.nowblood > battle.blood) {
      battle.nowblood = battle.blood
    }
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle',
      DATA: battle
    })
  }

  /**
   * @param { NAME, FLAG, TYPE, VALUE } param0
   * @returns
   */
  addExtendPerpetual({ NAME, FLAG, TYPE, VALUE }) {
    const extend = listdata.controlActionInitial({
      NAME,
      CHOICE: 'user_extend',
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
    listdata.controlAction({ NAME, CHOICE: 'user_extend', DATA: extend })
    this.readPanel(NAME)
  }

  /**
   * @param { NAME, FLAG, TYPE, VALUE, ENDTIME } param0
   * @returns
   */
  addExtendTimes({ NAME, FLAG, TYPE, VALUE, ENDTIME }) {
    const extend = listdata.controlActionInitial({
      NAME,
      CHOICE: 'user_extend',
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
    const find = extend[FLAG].times.findIndex((item) => item.type == TYPE)
    const time = new Date().getTime()
    if (
      find != -1 &&
      extend[FLAG].times[find].timeLimit > time &&
      extend[FLAG].times[find].value >= VALUE
    ) {
      listdata.controlAction({ NAME, CHOICE: 'user_extend', DATA: extend })
      this.readPanel(NAME)
    } else if (
      find != -1 &&
      (extend[FLAG].times[find].timeLimit <= time || extend[FLAG].times[find].value < VALUE)
    ) {
      extend[FLAG].times[find].value = VALUE
      extend[FLAG].times[find].timeLimit = ENDTIME
      listdata.controlAction({ NAME, CHOICE: 'user_extend', DATA: extend })
      this.readPanel(NAME)
    } else {
      extend[FLAG].times.push({
        type: TYPE,
        value: VALUE,
        timeLimit: ENDTIME
      })
      listdata.controlAction({ NAME, CHOICE: 'user_extend', DATA: extend })
      this.readPanel(NAME)
    }
  }

  synthesisResult({ ans, type }) {
    // 这里可以写成返回对象，物品+msg，来给炼制增加不同的过程反馈
    let drawingList = listdata.controlAction({
      NAME: 'AllDrawing',
      CHOICE: 'fixed_material'
    })
    drawingList = drawingList.filter(
      (item) =>
        item.type == type &&
        item.gold <= ans.gold &&
        item.wood <= ans.wood &&
        item.water <= ans.water &&
        item.fire <= ans.fire &&
        item.earth <= ans.earth
    )

    if (drawingList.length == 0) {
      // 没有对应图纸
      const res = { name: '无用的残渣' }
      return res
    } else if (drawingList.length > 3) {
      // 可能的结果过多，取三个最好的
      drawingList.sort(sortRule)
      const slice = drawingList.slice(0, 3)
      // 随机取一个
      return randomArr(slice)
    } else {
      // 直接随机取
      return randomArr(drawingList)
    }
  }
}

export default new Player()

function sortRule(a, b) {
  return a.rank - b.rank // 如果a>=b，返回自然数，不用交换位置
}

function randomArr(array) {
  const location = Math.floor(Math.random() * array.length)
  return array[location]
}
