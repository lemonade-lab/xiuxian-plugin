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
        'fixedposition': path.join(__dirname, '/resources/data/fixed/position')
    };
    this.association = this.__PATH.birthassociation;
    this.all = this.__PATH.all;
    this.position = this.__PATH.fixedposition;
  };
  mydata=()=>{
    //检测插件存档

    //插件的存档直接放入xiuxain-plugin/resources/data

    //把存档中的属性提取出来

    //对属性分类

    //检测本地有无存档，无存档先创建：必须先调用踏入仙途，不然存档无效！

    //开始插入新值

    //保存更新
    return 1;
  };
};
export default new dataup();