import base from "./base.js";
export default class Valuablesall extends base {
  constructor(e) {
    super(e);
    this.model0 = "Valuablesall";
    this.model = "Valuablesall";
  }
  
  async get_base(data1,data2,myData){
    this.model0 = data1;
    this.model = data2;
    return {
      ...this.screenData,
      saveId: data2,
      ...myData,
    };
  }

  async get_Data(data1,data2,myData) {
    let valuablesall = new Valuablesall();
    return await valuablesall.get_base(data1, data2, myData);
  }
  
}
