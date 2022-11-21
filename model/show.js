import base from './base.js';
export default class Game extends base {
  constructor(e) {
    super(e);
    this.model0 = 'show';
    this.model = 'show';
  };
  get_base = async (mod1, mode2, myData) => {
    this.model0 = mod1;
    this.model = mode2;
    return {
      ...this.screenData,
      saveId: mode2,
      ...myData,
    };
  };
  get_Data = async (data1, data2, myData) => {
    let game = new Game();
    return await game.get_base(data1, data2, myData);
  };
};