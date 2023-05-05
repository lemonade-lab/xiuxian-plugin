import base from './base.js'

export default class Game extends base {
  constructor(e) {
    super(e)
    this.model = 'show'
  }

  async get_playerData(myData) {
    this.model = 'player'
    return {
      ...this.screenData,
      saveId: 'player',
      ...myData
    }
  }
  //师徒商城
  async get_shitujifenData(myData) {
    this.model = 'shitujifen'
    return {
      ...this.screenData,
      saveId: 'shitujifen',
      ...myData
    }
  }
  //我的弟子
  async get_shituData(myData) {
    this.model = 'shitu'
    return {
      ...this.screenData,
      saveId: 'shitu',
      ...myData
    }
  }
  //我的师门
  async get_shifuData(myData) {
    this.model = 'shifu'
    return {
      ...this.screenData,
      saveId: 'shifu',
      ...myData
    }
  }
  async get_gongfaData(myData) {
    this.model = 'gongfa'
    return {
      ...this.screenData,
      saveId: 'gongfa',
      ...myData
    }
  }

  async get_danyaoData(myData) {
    this.model = 'danyao'
    return {
      ...this.screenData,
      saveId: 'danyao',
      ...myData
    }
  }

  async get_xianchong(myData) {
    this.model = 'xianchong'
    return {
      ...this.screenData,
      saveId: 'xianchong',
      ...myData
    }
  }

  async get_daojuData(myData) {
    this.model = 'daoju'
    return {
      ...this.screenData,
      saveId: 'daoju',
      ...myData
    }
  }

  async get_wuqiData(myData) {
    this.model = 'wuqi'
    return {
      ...this.screenData,
      saveId: 'wuqi',
      ...myData
    }
  }

  async get_playercopyData(myData) {
    this.model = 'playercopy'
    return {
      ...this.screenData,
      saveId: 'playercopy',
      ...myData
    }
  }

  async get_equipmnetData(myData) {
    this.model = 'equipment'
    return {
      ...this.screenData,
      saveId: 'equipment',
      ...myData
    }
  }
  async get_equipmnetData2(myData) {
    this.model = 'equipment2'
    return {
      ...this.screenData,
      saveId: 'equipment2',
      ...myData
    }
  }
  async get_najieData(myData) {
    this.model = 'najie'
    return {
      ...this.screenData,
      saveId: 'najie',
      ...myData
    }
  }

  async get_stateData(myData) {
    this.model = 'state'
    return {
      ...this.screenData,
      saveId: 'state',
      ...myData
    }
  }

  async get_stateDatazhiye(myData) {
    this.model = 'statezhiye'
    return {
      ...this.screenData,
      saveId: 'statezhiye',
      ...myData
    }
  }
  async get_statemaxData(myData) {
    this.model = 'statemax'
    return {
      ...this.screenData,
      saveId: 'statemax',
      ...myData
    }
  }
  //searchforum
  async get_searchforumData(myData) {
    this.model = 'searchforum'
    return {
      ...this.screenData,
      saveId: 'searchforum',
      ...myData
    }
  }
  //天地堂
  async get_tianditangData(myData) {
    this.model = 'tianditang'
    return {
      ...this.screenData,
      saveId: 'tianditang',
      ...myData
    }
  }
  //悬赏名单
  async get_msg(myData) {
    this.model = 'msg'
    return {
      ...this.screenData,
      saveId: 'msg',
      ...myData
    }
  }
  //我的宗门
  async get_associationData(myData) {
    this.model = 'association'
    return {
      ...this.screenData,
      saveId: 'association',
      ...myData
    }
  }

  //shop
  async get_didianData(myData) {
    this.model = 'shop'
    return {
      ...this.screenData,
      saveId: 'shop',
      ...myData
    }
  }

  //宗门
  async get_zongmeng_data(myData) {
    this.model = 'zongmeng'
    return {
      ...this.screenData,
      saveId: 'zongmeng',
      ...myData
    }
  }

  //temp
  async get_tempData(myData) {
    this.model = 'temp'
    return {
      ...this.screenData,
      saveId: 'temp',
      ...myData
    }
  }

  //log
  async get_logData(myData) {
    this.model = 'log'
    return {
      ...this.screenData,
      saveId: 'log',
      ...myData
    }
  }
  //柠檬堂
  async get_ningmenghomeData(myData) {
    this.model = 'ningmenghome'
    return {
      ...this.screenData,
      saveId: 'ningmenghome',
      ...myData
    }
  }

  //万宝楼
  async get_valuablesData(myData) {
    this.model = 'valuables'
    return {
      ...this.screenData,
      saveId: 'valuables',
      ...myData
    }
  }

  //法宝楼
  async get_valuables_fabaoData(myData) {
    this.model = 'valuables_fabao'
    return {
      ...this.screenData,
      saveId: 'valuables_fabao',
      ...myData
    }
  }

  //武器楼
  async get_valuables_wuqiData(myData) {
    this.model = 'valuables_wuqi'
    return {
      ...this.screenData,
      saveId: 'valuables_wuqi',
      ...myData
    }
  }

  //护具楼
  async get_valuables_hujuData(myData) {
    this.model = 'valuables_huju'
    return {
      ...this.screenData,
      saveId: 'valuables_huju',
      ...myData
    }
  }

  //丹药楼
  async get_valuables_drugData(myData) {
    this.model = 'valuables_drug'
    return {
      ...this.screenData,
      saveId: 'valuables_drug',
      ...myData
    }
  }

  //功法楼
  async get_valuables_skillData(myData) {
    this.model = 'valuables_skill'
    return {
      ...this.screenData,
      saveId: 'valuables_skill',
      ...myData
    }
  }

  //道具楼
  async get_valuables_propData(myData) {
    this.model = 'valuables_prop'
    return {
      ...this.screenData,
      saveId: 'valuables_prop',
      ...myData
    }
  }

  //数独
  async get_sudokuData(myData) {
    this.model = 'sudoku'
    return {
      ...this.screenData,
      saveId: 'sudoku',
      ...myData
    }
  }

  //修为榜
  async get_ranking_powerData(myData) {
    this.model = 'ranking_power'
    return {
      ...this.screenData,
      saveId: 'ranking_power',
      ...myData
    }
  }

  //灵石榜
  async get_ranking_moneyData(myData) {
    this.model = 'ranking_money'
    return {
      ...this.screenData,
      saveId: 'ranking_money',
      ...myData
    }
  }

  async get_updataData(myData) {
    this.model = 'updata'
    return {
      ...this.screenData,
      saveId: 'updata',
      ...myData
    }
  }

  //修仙设置
  async get_adminsetData(myData) {
    this.model = 'adminset'
    return {
      ...this.screenData,
      saveId: 'adminset',
      ...myData
    }
  }

  async get_secret_placeData(myData) {
    this.model = 'secret_place'
    return {
      ...this.screenData,
      saveId: 'secret_place',
      ...myData
    }
  }

  async get_forbidden_areaData(myData) {
    this.model = 'forbidden_area'
    return {
      ...this.screenData,
      saveId: 'forbidden_area',
      ...myData
    }
  }

  async get_time_placeData(myData) {
    this.model = 'time_place'
    return {
      ...this.screenData,
      saveId: 'time_place',
      ...myData
    }
  }

  async get_fairyrealmData(myData) {
    this.model = 'fairyrealm'
    return {
      ...this.screenData,
      saveId: 'fairyrealm',
      ...myData
    }
  }

  async get_supermarketData(myData) {
    this.model = 'supermarket'
    return {
      ...this.screenData,
      saveId: 'supermarket',
      ...myData
    }
  }

  async get_forumData(myData) {
    this.model = 'forum'
    return {
      ...this.screenData,
      saveId: 'forum',
      ...myData
    }
  }
  //斩首堂
  async get_yuansu(myData) {
    this.model = 'tujian'
    return {
      ...this.screenData,
      saveId: 'tujian',
      ...myData
    }
  }
  // 金银坊记录
  async get_jinyin(myData) {
    this.model = 'moneyCheck'
    return {
      ...this.screenData,
      saveId: 'moneyCheck',
      ...myData
    }
  }

  async get_talentData(myData) {
    this.model = 'talent'
    return {
      ...this.screenData,
      saveId: 'talent',
      ...myData
    }
  }

  async get_danfangData(myData) {
    this.model = 'danfang'
    return {
      ...this.screenData,
      saveId: 'danfang',
      ...myData
    }
  }

  async get_tuzhiData(myData) {
    this.model = 'tuzhi'
    return {
      ...this.screenData,
      saveId: 'tuzhi',
      ...myData
    }
  }
  async get_NIANGJIU(myData) {
    this.model = 'niangjiu'
    return {
      ...this.screenData,
      saveId: 'niangjiu',
      ...myData
    }
  }
  //神兵榜
  async get_shenbing(myData) {
    this.model = 'shenbing'
    return {
      ...this.screenData,
      saveId: 'shenbing',
      ...myData
    }
  }
}
