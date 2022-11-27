import XiuxianData from "../../../model/XiuxianData.js";
class pluginup {
  constructor() {
    //插件名
    const __pluginname = 'xiuxian-plugin';
    //直接使用
    this.__PATH = XiuxianData.__PATH;
  };
  pluginupdata = async () => {
    return 1;
  };
};
export default new pluginup();