import fs from 'node:fs';
import path from 'path';
import XiuxianData from "../../../model/XiuxianData.js";
import filecp from '../../../model/filecp.js';
class plugindata {
  constructor() {
    const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}Xiuxian-Plugin-Box${path.sep}plugins${path.sep}xiuxian-plugin`;
    this.NEW__PATH = {
      //基础
      'Level': path.join(__dirname, '/resources/data/fixed/Level'),
    };
    //新增境界
    XiuxianData.newlist(XiuxianData.__PATH.Level, 'Level_list', [
      ...JSON.parse(fs.readFileSync(`${XiuxianData.__PATH.Level}/Level_list.json`)),
      ...XiuxianData.getlist(this.NEW__PATH.Level,'Level_list.json')
    ]);
    XiuxianData.newlist(XiuxianData.__PATH.Level, 'LevelMax_list', [
      ...JSON.parse(fs.readFileSync(`${XiuxianData.__PATH.Level}/LevelMax_list.json`)),
      ...XiuxianData.getlist(this.NEW__PATH.Level,'LevelMax_list.json')
    ]);
  };
  start = () => {
    filecp.Pluginfile('xiuxian-plugin', ['Plugin', 'MyXiuxian']);
    return;
  };
};
export default new plugindata();