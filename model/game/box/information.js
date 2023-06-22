import Data from '../data/index.js'
import Talent from './talent.js'
import Equipment from './equipment.js'
import Levels from './levels.js'
import Special from './special.js'
import Battel from './battle.js'
import Life from './life.js'
import Bag from './bag.js'
class Information {
  /**
   * 个人信息
   * @param UID  param0
   * @returns
   */
  showUserPlayer(UID) {
    const equipment = Equipment.read(UID)
    const TalentData = Talent.read(UID)
    const LevelData = Levels.read(UID)
    const SpecialData = Special.read(UID)
    const battle = Battel.read(UID)
    let linggenName = Talent.getTalentName(TalentData.talent)
    let LifeData = Life.read('life')
    let name = linggenName
    let size = Math.trunc(TalentData.talentsize)
    if (TalentData.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    // 固定数据读取
    const GaspracticeData = Data.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const BodypracticeData = Data.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    const SoulData = Data.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'soul'
    })
    //
    return {
      path: 'user/information',
      name: 'information',
      data: {
        UID,
        life: LifeData[UID],
        GP: {},
        special: SpecialData,
        level: {
          gaspracticeName: GaspracticeData[LevelData.gaspractice.realm].name,
          gaspracticeExperience: LevelData.gaspractice.experience,
          bodypracticeName: BodypracticeData[LevelData.bodypractice.realm].name,
          bodypracticeExperience: LevelData.bodypractice.experience,
          soulName: SoulData[LevelData.soul.realm].name,
          soulExperience: LevelData.soul.experience
        },
        linggenName: name,
        battle,
        equipment,
        talent: TalentData,
        talentsize: size,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 装备信息
   * @param {*} param0
   * @returns
   */
  showUserEquipment(UID) {
    const battle = Battel.read(UID)
    const equipment = Equipment.read(UID)
    const LifeData = Life.read('life')
    return {
      path: 'user/equipment',
      name: 'equipment',
      data: {
        UID,
        battle,
        life: LifeData[UID],
        equipment,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 功法信息
   */
  showUserTalent(UID) {
    const TalentData = Talent.read(UID)
    let linggenName = Talent.getTalentName(TalentData.talent)
    let LifeData = Life.read('life')
    let name = linggenName
    let size = Math.trunc(TalentData.talentsize)
    if (TalentData.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    return {
      path: 'user/skills',
      name: 'skills',
      data: {
        UID,
        skills: TalentData.AllSorcery,
        linggenName: name,
        talentsize: size,
        life: LifeData[UID],
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 背包
   * @returns
   */
  showUserBag(UID) {
    let LifeData = Life.read('life')
    const battle = Battel.read(UID)
    const najie = Bag.read(UID)
    const thing = najie.thing
    const thingList = []
    const danyaoList = []
    const daojuList = []
    thing.forEach((item) => {
      let id = item.id.split('-')
      switch (id[0]) {
        case '4': {
          danyaoList.push(item)
          break
        }
        case '6': {
          daojuList.push(item)
          break
        }
        default: {
          thingList.push(item)
          break
        }
      }
    })
    return {
      path: 'user/bag',
      name: 'bag',
      data: {
        UID,
        GP: {},
        life: LifeData[UID],
        battle,
        najie,
        thing: thingList,
        daojuList,
        danyaoList,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 战斗信息
   */

  showUserBattle({ UID, msgLeft, msgRight }) {
    return {
      path: 'battle',
      name: 'battle',
      data: {
        UID,
        msgLeft,
        msgRight,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }
}
export default new Information()
