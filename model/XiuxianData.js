import fs from 'node:fs';
import path from 'path';
class XiuxianData {
    constructor() {
        const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}Xiuxian-Plugin-Box`;
        this.__PATH = {
            //基础
            'fixedposition': path.join(__dirname, '/resources/data/fixed/position'),
            'fixedequipment': path.join(__dirname, '/resources/data/fixed/equipment'),
            'fixedgoods': path.join(__dirname, '/resources/data/fixed/goods'),
            'fixedLevel': path.join(__dirname, '/resources/data/fixed/Level'),
            'fixedoccupation': path.join(__dirname, '/resources/data/fixed/occupation'),
            'fixedtalent': path.join(__dirname, '/resources/data/fixed/talent'),
            //生成
            'all': path.join(__dirname, '/resources/data/birth/all'),
            'position': path.join(__dirname, '/resources/data/birth/position')
        };
        //固定不变
        this.Level_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/LevelMax_list.json`));
        this.talent_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedtalent}/talent.json`));
        //动态生成
        this.deletelist('all');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa_list.json`))
        ], 'all');
        this.deletelist('commodities');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao_list.json`)).slice(0, 11),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa_list.json`)).slice(0, 11)
        ], 'commodities');
        this.deletelist('dropsItem');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa_list.json`)).slice(11, 19),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao_list.json`)).slice(11, 19),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju_list.json`))
        ], 'dropsItem');

        /**
         * id数据头规定
         * 1武器
         * 2护具
         * 3法宝
         * 4道具
         * 5功法
         * 6丹药
         * 
         * 1-19 为基础段
         * 20-29 为扩展段
         * 30-99  为预留段
         * 100以后为玩家可用段
         */

        /**
         * id数据尾规定：
         * 1-19为常用物品
         * 20-29为限定物品
         * 30-99为宗门物品
         * 100-199为药园物品
         * 200-399为职业物品
         * 400-999为三点水预留
         * 物品为玩家插件可用段:自行选择合适字段
         * 1000后  插件1
         * 2000后  插件2
         * 3000后  插件3
         */

        this.deleteposition('position');
        this.addposition([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position3.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position4.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position5.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position6.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position7.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position8.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position9.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position10.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position11.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position12.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position13.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position14.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position15.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position16.json`))
        ], 'position');

        this.deleteposition('point');
        this.addposition([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point3.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point4.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point5.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point6.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point7.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point8.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point9.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point10.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point11.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point12.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point13.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point14.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point15.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point16.json`))
        ], 'point');
    };
    deletelist = (name) => {
        const dir = path.join(this.__PATH.all, `${name}.json`);
        const new_ARR = JSON.stringify([], '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    addlist = (sum, name) => {
        const dir = path.join(this.__PATH.all, `${name}.json`);
        const new_ARR = JSON.stringify(sum, '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    deleteposition = (name) => {
        const dir = path.join(this.__PATH.position, `${name}.json`);
        const new_ARR = JSON.stringify([], '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    addposition = (sum, name) => {
        const dir = path.join(this.__PATH.position, `${name}.json`);
        const new_ARR = JSON.stringify(sum, '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
};
export default new XiuxianData();
