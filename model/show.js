import base from "./base.js";

export default class Game extends base {
  constructor(e) {
    super(e);
    this.model0 = "show";
    this.model = "show";
  }

  //练气存档
  async get_playerData(myData) {
    this.model0 = "player";
    this.model = "player";
    return {
      ...this.screenData,
      saveId: "player",
      ...myData,
    };
  }


  //炼体存档
  async get_playercopyData(myData) {
    this.model0 = "playercopy";
    this.model = "playercopy";
    return {
      ...this.screenData,
      saveId: "playercopy",
      ...myData,
    };
  }
  

  //装备
  async get_equipmnetData(myData) {
    this.model0 = "equipment";
    this.model = "equipment";
    return {
      ...this.screenData,
      saveId: "equipment",
      ...myData,
    };
  }


  //纳戒
  async get_najieData(myData) {
    this.model0 = "najie";
    this.model = "najie";
    return {
      ...this.screenData,
      saveId: "najie",
      ...myData,
    };
  }

  //练气

  async get_stateData(myData) {
    this.model0 = "state";
    this.model = "state";
    return {
      ...this.screenData,
      saveId: "state",
      ...myData,
    };
  }

  //炼体
  async get_statemaxData(myData) {
    this.model0 = "statemax";
    this.model = "statemax";
    return {
      ...this.screenData,
      saveId: "statemax",
      ...myData,
    };
  }



//柠檬堂
async get_ningmenghomeData(myData) {
  this.model = "ningmenghome";
  this.model0 = "ningmenghome";
  return {
    ...this.screenData,
    saveId: "ningmenghome",
    ...myData,
  };
}


  //万宝楼
  async get_valuablesData(myData) {
    this.model0 = "valuablesall/valuables";
    this.model = "valuables";
    return {
      ...this.screenData,
      saveId: "valuables",
      ...myData,
    };
  }

   //法宝楼
   async get_valuables_fabaoData(myData) {
    this.model0 = "valuablesall/valuables_fabao";
    this.model = "valuables_fabao";
    return {
      ...this.screenData,
      saveId: "valuables_fabao",
      ...myData,
    };
  }


  //武器楼
  async get_valuables_wuqiData(myData) {
    this.model0 = "valuablesall/valuables_wuqi";
    this.model = "valuables_wuqi";
    return {
      ...this.screenData,
      saveId: "valuables_wuqi",
      ...myData,
    };
  }

   //护具楼
   async get_valuables_hujuData(myData) {
    this.model0 = "valuablesall/valuables_huju";
    this.model = "valuables_huju";
    return {
      ...this.screenData,
      saveId: "valuables_huju",
      ...myData,
    };
  }


  //丹药楼
  async get_valuables_drugData(myData) {
    this.model0 = "valuablesall/valuables_drug";
    this.model = "valuables_drug";
    return {
      ...this.screenData,
      saveId: "valuables_drug",
      ...myData,
    };
  }

  //功法楼
  async get_valuables_skillData(myData) {
    this.model0 = "valuablesall/valuables_skill";
    this.model = "valuables_skill";
    return {
      ...this.screenData,
      saveId: "valuables_skill",
      ...myData,
    };
  }

  //道具楼
  async get_valuables_propData(myData) {
    this.model0 = "valuablesall/valuables_prop";
    this.model = "valuables_prop";
    return {
      ...this.screenData,
      saveId: "valuables_prop",
      ...myData,
    };
  }


  //修为榜
  async get_ranking_powerData(myData) {
    this.model0 = "ranking_power";
    this.model = "ranking_power";
    return {
      ...this.screenData,
      saveId: "ranking_power",
      ...myData,
    };
  }


  //灵石榜
  async get_ranking_moneyData(myData) {
    this.model0 = "ranking_money";
    this.model = "ranking_money";
    return {
      ...this.screenData,
      saveId: "ranking_money",
      ...myData,
    };
  }

    //修仙版本
    async get_updataData(myData) {
      this.model0 = "updata";
      this.model = "updata";
      return {
        ...this.screenData,
        saveId: "updata",
        ...myData,
      };
    }

    //修仙设置
    async get_adminsetData(myData) {
      this.model0 = "adminset";
      this.model = "adminset";
      return {
        ...this.screenData,
        saveId: "adminset",
        ...myData,
      };
    }


}
