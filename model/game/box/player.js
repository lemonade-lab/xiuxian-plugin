import Listdata from '../data/listdata.js'
import Wrap from '../wrap/index.js'
import Config from '../data/defset.js'
import Method from '../wrap/method.js'
import Talent from './talent.js'
class Player {
  /** 更新寿命信息 */
  startLife() {
    const LifeData = Listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    // 记录死亡
    const die = []
    const cf = Config.getConfig({ name: 'cooling' })
    for (let UID in LifeData) {
      LifeData[UID].Age += cf.Age.size ? cf.Age.size : 1
      if (LifeData[UID].Age >= LifeData[UID].life) {
        LifeData[UID].status = 0
        die.push(LifeData[UID].qq)
      }
    }
    Listdata.controlAction({
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
  createPlayer(UID) {
    const NowTime = new Date().getTime()
    const LevelList = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle',
      DATA: {
        nowblood: LevelList[0].blood + LevelMaxList[0].blood // 血量
      }
    })
    Listdata.controlAction({
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
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_wealth',
      DATA: {
        lingshi: 0,
        xianshi: 0
      }
    })
    const PosirionList = Listdata.controlAction({
      CHOICE: 'generate_position',
      NAME: 'position'
    })
    const position = PosirionList.find((item) => item.name == '极西')
    const positionID = position.id.split('-')
    const coordinate = {
      mx: Math.floor((position.x2 - position.x1) * Math.random()) + position.x1,
      my: Math.floor((position.y2 - position.y1) * Math.random()) + position.y1
    }
    Listdata.controlAction({
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
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: {
        grade: 1,
        lingshimax: 50000, // 废弃
        lingshi: 0, // 废弃
        thing: []
      }
    })
    const newtalent = Talent.getTalent()
    Listdata.controlAction({
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
    const LifeData = Listdata.controlActionInitial({
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
    Listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      DATA: LifeData,
      INITIAL: {}
    })
    // 签到
    const SignData = Listdata.controlActionInitial({
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
    Listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      DATA: SignData,
      INITIAL: {}
    })
    // 天赋
    Listdata.controlAction({ NAME: UID, CHOICE: 'user_extend', DATA: {} })
    /** 更新装备 */
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: []
    })
    /** 更新天赋面板 */
    Talent.updataEfficiency(UID)
    /** 更新战斗面板 */
    Talent.updatePanel(UID)
    return true
  }

  /**
   * 得到用户寿命
   * @param UID  UID
   * @returns 不存在则undifind
   */
  getUserLife(UID) {
    const LifeData = Listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      INITIAL: {}
    })
    return LifeData[UID]
  }

  /**
   * 得到用户寿命状态
   * @param UID  UID
   * @returns
   */
  getUserLifeSatus(UID) {
    let find = this.getUserLife(UID)
    if (find) {
      if (find.status == 0) {
        return false
      }
      return true
    }
    // 创建新人
    const CreateGO = this.createPlayer(UID)
    if (!CreateGO) {
      return false
    }
    return true
  }

  isUser(UID) {
    let find = this.getUserLife(UID)
    if (find) {
      return true
    }
    return false
  }

  /**
   * @returns 返回所有用户UID
   */
  getAllUser() {
    const GPList = []
    const life = Listdata.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'life',
      INITIAL: {}
    })
    for (let UID in life) {
      GPList.push(UID)
    }
    return GPList
  }

  /**
   * 更新用户血量
   * @param {*} param0
   */
  updataUserBlood({ UID, SIZE }) {
    const battle = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    battle.nowblood += Math.floor(battle.blood * SIZE * 0.01)
    if (battle.nowblood > battle.blood) {
      battle.nowblood = battle.blood
    }
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle',
      DATA: battle
    })
  }
}
export default new Player()
