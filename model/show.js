import base from "./base.js";
export default class Game extends base {
  constructor(e) {
    super(e);
    this.model = "show";
  }

  async get_playerData(myData) {
    this.model = "player";
    return {
      ...this.screenData,
      saveId: "player",
      ...myData,
    };
  }

  async get_playercopyData(myData) {
    this.model = "playercopy";
    return {
      ...this.screenData,
      saveId: "playercopy",
      ...myData,
    };
  }


  async get_equipmnetData(myData) {
    this.model = "equipment";
    return {
      ...this.screenData,
      saveId: "equipment",
      ...myData,
    };
  }


  async get_najieData(myData) {
    this.model = "najie";
    return {
      ...this.screenData,
      saveId: "najie",
      ...myData,
    };
  }

  async get_stateData(myData) {
    this.model = "state";
    return {
      ...this.screenData,
      saveId: "state",
      ...myData,
    };
  }

  async get_statemaxData(myData) {
    this.model = "statemax";
    return {
      ...this.screenData,
      saveId: "statemax",
      ...myData,
    };
  }

  //我的宗门
  async get_associationData(myData) {
    this.model = "association";
    return {
      ...this.screenData,
      saveId: "association",
      ...myData,
    };
  }

  //柠檬堂
  async get_ningmenghomeData(myData) {
    this.model = "ningmenghome";
    return {
      ...this.screenData,
      saveId: "ningmenghome",
      ...myData,
    };
  }


  //万宝楼
  async get_valuablesData(myData) {
    this.model = "valuables";
    return {
      ...this.screenData,
      saveId: "valuables",
      ...myData,
    };
  }

  //法宝楼
  async get_valuables_fabaoData(myData) {
    this.model = "valuables_fabao";
    return {
      ...this.screenData,
      saveId: "valuables_fabao",
      ...myData,
    };
  }


  //武器楼
  async get_valuables_wuqiData(myData) {
    this.model = "valuables_wuqi";
    return {
      ...this.screenData,
      saveId: "valuables_wuqi",
      ...myData,
    };
  }

  //护具楼
  async get_valuables_hujuData(myData) {
    this.model = "valuables_huju";
    return {
      ...this.screenData,
      saveId: "valuables_huju",
      ...myData,
    };
  }


  //丹药楼
  async get_valuables_drugData(myData) {
    this.model = "valuables_drug";
    return {
      ...this.screenData,
      saveId: "valuables_drug",
      ...myData,
    };
  }

  //功法楼
  async get_valuables_skillData(myData) {
    this.model = "valuables_skill";
    return {
      ...this.screenData,
      saveId: "valuables_skill",
      ...myData,
    };
  }

  //道具楼
  async get_valuables_propData(myData) {
    this.model = "valuables_prop";
    return {
      ...this.screenData,
      saveId: "valuables_prop",
      ...myData,
    };
  }

  //数独
  async get_sudokuData(myData) {
    this.model = "sudoku";
    return {
      ...this.screenData,
      saveId: "sudoku",
      ...myData,
    };
  }

  //修为榜
  async get_ranking_powerData(myData) {
    this.model = "ranking_power";
    return {
      ...this.screenData,
      saveId: "ranking_power",
      ...myData,
    };
  }


  //灵石榜
  async get_ranking_moneyData(myData) {
    this.model = "ranking_money";
    return {
      ...this.screenData,
      saveId: "ranking_money",
      ...myData,
    };
  }

  //修仙版本
  async get_updataData(myData) {
    this.model = "updata";
    return {
      ...this.screenData,
      saveId: "updata",
      ...myData,
    };
  }

  //修仙设置
  async get_adminsetData(myData) {
    this.model = "adminset";
    return {
      ...this.screenData,
      saveId: "adminset",
      ...myData,
    };
  }


}
