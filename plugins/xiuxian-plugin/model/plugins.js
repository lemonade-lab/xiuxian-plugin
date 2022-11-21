import filecp from '../../../model/filecp.js';
class plugins {
  constructor() {
    filecp.Pluginfile('xiuxian-plugin',['Plugin']);
  };
  //start为必须的激活方法
  start = ()=>{
    return ;
  };
};
export default new plugins();