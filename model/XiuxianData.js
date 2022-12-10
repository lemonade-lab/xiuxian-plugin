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
            'position': path.join(__dirname, '/resources/data/birth/position'),
            'Level': path.join(__dirname, '/resources/data/birth/Level'),
        };
        //固定不变
        this.talent_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedtalent}/talent_list.json`));
        //动态生成境界
        this.Level_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/LevelMax_list.json`));
        this.list(this.__PATH.Level, 'Level_list', [], []);
        this.list(this.__PATH.Level, 'Level_list', [], [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/Level_list.json`))
        ]);
        this.list(this.__PATH.Level, 'LevelMax_list', [], []);
        this.list(this.__PATH.Level, 'LevelMax_list', [], [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/LevelMax_list.json`))
        ]);
        //删除操作
        this.list(this.__PATH.all, 'all', [], []);
        //动态生成
        this.list(this.__PATH.all, 'all', [], [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju1.json`))
        ]);

        this.list(this.__PATH.all, 'commodities', [], []);
        this.list(this.__PATH.all, 'commodities', [], [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa1.json`))
        ]);

        this.list(this.__PATH.all, 'dropsItem', [], [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju1.json`))
        ]);
        /**
         * id数据头规定
         * 1武器2护具3法宝4丹药5功法6道具
         * -----------------------------
         * 1-19   为基础段
         * 20-29  为扩展段
         * 30-99  为预留段
         * 100后  为玩家可用段
         * ------------------------------
         * id数据尾规定：
         * 1-19    为基础物品
         * 20-29   为限定物品
         * 30-99   为宗门物品
         * 100-199 为药园物品
         * 200-399 为职业物品
         * 400-999 为预留物品
         * -----------------------------
         * 物品为玩家插件可用段:自行选择合适字段
         * 1000后  插件1
         * 2000后  插件2
         */
        this.list(this.__PATH.position, 'position', [], []);
        this.list(this.__PATH.position, 'position', [], [
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
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position16.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position17.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position18.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position19.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/position20.json`))
        ]);
        /**
         * id含义：位面-区域-属性-等级-编号
         * 编号：0区域、1中心、2传送阵、3联盟、凡仙堂4、弱水阁5、
         * 
         */
        this.list(this.__PATH.position, 'point', [], []);
        this.list(this.__PATH.position, 'point', [], [
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
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point16.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point17.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point18.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point19.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedposition}/point20.json`))
        ]);
    };
    /**
     * 
     * @param {地址} path 
     * @param {表名} name 
     * @param {原数据} sum 
     * @param {新数据} newsum 
     */
    list = (PATH, name, sum, newsum) => {
        const dir = path.join(PATH, `${name}.json`);
        const new_ARR = JSON.stringify([...sum, ...newsum], '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { });
    };
};
export default new XiuxianData();