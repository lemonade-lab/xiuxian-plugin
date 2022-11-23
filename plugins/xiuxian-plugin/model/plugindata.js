import XiuxianData from "../../../model/XiuxianData.js";
class plugindata {
  constructor() {
    //插件名
    const __pluginname='xiuxian-plugin';
    //直接使用
    this.__PATH=XiuxianData.__PATH;
  };
  start = ()=>{
    return ;
  };
};
export default new plugindata();