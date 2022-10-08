import base from "./base.js";

export default class Valuablesall extends base {
  constructor(e) {
    super(e);
    this.model0 = "Valuablesall";
    this.model = "Valuablesall";
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

  //柠檬堂
  async get_ningmenghomeData(myData) {
    this.model = "valuablesall/ningmenghome";
    this.model0 = "ningmenghome";
    return {
      ...this.screenData,
      saveId: "ningmenghome",
      ...myData,
    };
  }

}
