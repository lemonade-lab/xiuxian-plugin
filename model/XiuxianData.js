import fs from "node:fs";
import path from "path";
let all = [];
let dropsItem = [];
let commodities = [];
class XiuxianData {
    constructor() {
        const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin";
        this.__PATH = {
            "player": path.join(__dirname, "/resources/data/birth/xiuxian/player"),
            "equipment": path.join(__dirname, "/resources/data/birth/xiuxian/equipment"),
            "najie": path.join(__dirname, "/resources/data/birth/xiuxian/najie"),
            "birthassociation": path.join(__dirname, "/resources/data/birth/association"),

            "all": path.join(__dirname, "/resources/data/birth/all"),

            "fixedposition": path.join(__dirname, "/resources/data/fixed/position"),
            "fixedequipment": path.join(__dirname, "/resources/data/fixed/equipment"),
            "fixedgoods": path.join(__dirname, "/resources/data/fixed/goods"),
            "fixedLevel": path.join(__dirname, "/resources/data/fixed/Level"),
            "fixedoccupation": path.join(__dirname, "/resources/data/fixed/occupation"),
            "fixedtalent": path.join(__dirname, "/resources/data/fixed/talent")
        };
        this.association = this.__PATH.birthassociation;
        this.all = this.__PATH.all;

        this.position = this.__PATH.fixedposition;
        this.fixedequipment = this.__PATH.fixedequipment;
        this.goods = this.__PATH.fixedgoods;
        this.Level = this.__PATH.fixedLevel;
        this.occupation = this.__PATH.fixedoccupation;
        this.talent = this.__PATH.fixedtalent;

        this.Level_list = JSON.parse(fs.readFileSync(`${this.Level}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.Level}/LevelMax_list.json`));
        this.position_list = JSON.parse(fs.readFileSync(`${this.position}/position.json`));
        this.talent_list = JSON.parse(fs.readFileSync(`${this.talent}/talent.json`));

        this.deletelist('all');
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/daoju_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/ring_list.json`)), all, 99);
        this.add(all, 'all');

        this.deletelist('commodities');
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)), commodities, 10);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)), commodities, 10);
        this.add(commodities, 'commodities');

        //怪物掉落
        this.deletelist('dropsItem');
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)), dropsItem, 19);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)), dropsItem, 19);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)), dropsItem, 19);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)).slice(11, 19), commodities, 19);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)).slice(11, 19), commodities, 19);
        this.add(dropsItem, 'dropsItem');

        //动态生成点坐标表

        //动态生成区域坐标表

    }
    //删除
    deletelist(name) {
        let sum = [];
        let dir = path.join(this.all, `${name}.json`);
        let new_ARR = JSON.stringify(sum, "", "\t");
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    //存临时数组
    list(add, sum, acount) {
        add.forEach((item, index) => {
            if (index < acount) {
                sum.push(item);
            };
        });
    };
    //添加临时数组
    add(sum, name) {
        let dir = path.join(this.all, `${name}.json`);
        let new_ARR = JSON.stringify(sum, "", "\t");
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    //新增信息
    addlist(sum, add, name, acount) {
        add.forEach((item, index) => {
            if (index < acount) {
                sum.push(item);
            };
        });
        let dir = path.join(this.all, `${name}.json`);
        let new_ARR = JSON.stringify(sum, "", "\t");
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
};
export default new XiuxianData();