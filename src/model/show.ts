import base from './image/base.js'

export class Show extends base {
  constructor() {
    super()
    this.model = 'show'
  }

  getData(myData, model) {
    this.model = model
    return {
      ...this.screenData,
      saveId: model,
      ...myData
    }
  }

  get_playerData(myData) {
    return this.getData(myData, 'player')
  }

  //师徒商城
  get_shitujifenData(myData) {
    return this.getData(myData, 'shitujifen')
  }
  //我the弟子
  get_shituData(myData) {
    return this.getData(myData, 'shitu')
  }
  //我the师门
  get_shifuData(myData) {
    return this.getData(myData, 'shifu')
  }
  get_gongfaData(myData) {
    return this.getData(myData, 'gongfa')
  }

  get_danyaoData(myData) {
    return this.getData(myData, 'danyao')
  }

  get_xianchong(myData) {
    return this.getData(myData, 'xianchong')
  }

  get_daojuData(myData) {
    return this.getData(myData, 'daoju')
  }

  get_wuqiData(myData) {
    return this.getData(myData, 'wuqi')
  }

  get_playercopyData(myData) {
    return this.getData(myData, 'playercopy')
  }

  get_equipmnetData(myData) {
    return this.getData(myData, 'equipment')
  }
  get_equipmnetData2(myData) {
    return this.getData(myData, 'equipment2')
  }
  get_najieData(myData) {
    return this.getData(myData, 'najie')
  }

  get_stateData(myData) {
    return this.getData(myData, 'state')
  }

  get_stateDatazhiye(myData) {
    return this.getData(myData, 'statezhiye')
  }
  get_statemaxData(myData) {
    return this.getData(myData, 'statemax')
  }
  //searchforum
  get_searchforumData(myData) {
    return this.getData(myData, 'searchforum')
  }
  //天地堂
  get_tianditangData(myData) {
    return this.getData(myData, 'tianditang')
  }
  //悬赏名单
  get_msg(myData) {
    return this.getData(myData, 'msg')
  }
  //我the宗门
  get_associationData(myData) {
    return this.getData(myData, 'association')
  }

  //shop
  get_didianData(myData) {
    return this.getData(myData, 'shop')
  }

  //宗门
  get_zongmeng_data(myData) {
    return this.getData(myData, 'zongmeng')
  }

  //temp
  get_tempData(myData) {
    return this.getData(myData, 'temp')
  }

  //log
  get_logData(myData) {
    return this.getData(myData, 'log')
  }
  //柠檬堂
  get_ningmenghomeData(myData) {
    return this.getData(myData, 'ningmenghome')
  }

  //万宝楼
  get_valuablesData(myData) {
    return this.getData(myData, 'valuables')
  }

  //magic_weapon楼
  get_valuables_fabaoData(myData) {
    return this.getData(myData, 'valuables_fabao')
    this.model = 'valuables_fabao'
  }

  //weapon楼
  get_valuables_wuqiData(myData) {
    return this.getData(myData, 'valuables_wuqi')
  }

  //protective_clothing楼
  get_valuables_hujuData(myData) {
    return this.getData(myData, 'valuables_huju')
  }

  //丹药楼
  get_valuables_drugData(myData) {
    return this.getData(myData, 'valuables_drug')
  }

  //skill楼
  get_valuables_skillData(myData) {
    return this.getData(myData, 'valuables_skill')
  }

  //道具楼
  get_valuables_propData(myData) {
    return this.getData(myData, 'valuables_prop')
  }

  //数独
  get_sudokuData(myData) {
    return this.getData(myData, 'sudoku')
  }

  //now_exp榜
  get_ranking_powerData(myData) {
    return this.getData(myData, 'ranking_power')
  }

  //money榜
  get_ranking_moneyData(myData) {
    return this.getData(myData, 'ranking_money')
  }

  get_updataData(myData) {
    return this.getData(myData, 'updata')
  }

  //修仙设置
  get_adminsetData(myData) {
    return this.getData(myData, 'adminset')
  }

  get_secret_placeData(myData) {
    return this.getData(myData, 'secret_place')
  }

  get_forbidden_areaData(myData) {
    return this.getData(myData, 'forbidden_area')
  }

  get_time_placeData(myData) {
    return this.getData(myData, 'time_place')
  }

  get_fairyrealmData(myData) {
    return this.getData(myData, 'fairyrealm')
  }

  get_supermarketData(myData) {
    return this.getData(myData, 'supermarket')
  }

  get_forumData(myData) {
    return this.getData(myData, 'forum')
  }
  //斩首堂
  get_yuansu(myData) {
    return this.getData(myData, 'tujian')
  }
  // 金银坊记录
  get_jinyin(myData) {
    return this.getData(myData, 'moneyCheck')
  }

  get_talentData(myData) {
    return this.getData(myData, 'talent')
  }

  get_danfangData(myData) {
    return this.getData(myData, 'danfang')
  }

  get_tuzhiData(myData) {
    return this.getData(myData, 'tuzhi')
  }
  get_NIANGJIU(myData) {
    return this.getData(myData, 'niangjiu')
  }
  //神兵榜
  get_shenbing(myData) {
    return this.getData(myData, 'shenbing')
  }
}
