import path from 'path';
import fs from 'node:fs';
class dataup {
  constructor() {
    const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}xiuxian-emulator-plugin`;
    this.__PATH = {
        'player': path.join(__dirname, '/resources/data/birth/xiuxian/player'),
        'equipment': path.join(__dirname, '/resources/data/birth/xiuxian/equipment'),
        'najie': path.join(__dirname, '/resources/data/birth/xiuxian/najie'),
        'birthassociation': path.join(__dirname, '/resources/data/birth/association'),
        'all': path.join(__dirname, '/resources/data/birth/all'),
        'fixedposition': path.join(__dirname, '/resources/data/fixed/position'),
        'fixedequipment': path.join(__dirname, '/resources/data/fixed/equipment'),
        'fixedgoods': path.join(__dirname, '/resources/data/fixed/goods'),
        'fixedLevel': path.join(__dirname, '/resources/data/fixed/Level'),
        'fixedoccupation': path.join(__dirname, '/resources/data/fixed/occupation'),
        'fixedtalent': path.join(__dirname, '/resources/data/fixed/talent')
    };
    this.association = this.__PATH.birthassociation;
    this.all = this.__PATH.all;
    this.occupation = this.__PATH.fixedoccupation;
    this.Level = this.__PATH.fixedLevel;
    this.position = this.__PATH.fixedposition;
    this.talent = this.__PATH.fixedtalent;
  };
  mydata=()=>{
    //检测存档

    //把存档中的属性提取出来

    //对属性分类

    //检测本地有无存档，无存档先创建

    //开始插入新值

    //保存更新
    return 1;
  };
};
export default new dataup();