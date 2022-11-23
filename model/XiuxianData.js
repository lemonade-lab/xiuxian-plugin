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
        this.talent_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedtalent}/talent_list.json`));
        //动态生成
        this.deletelist('all');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa2.json`))
        ], 'all');
        this.deletelist('commodities');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa1.json`))
        ], 'commodities');
        this.deletelist('dropsItem');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/wuqi2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/huju2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedequipment}/fabao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao2.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/daoju1.json`))
        ], 'dropsItem');
        /**
         * id数据头规定
         * 1武器2护具3法宝4道具5功法6丹药
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
    /**
     * 
     */
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
    allAddArr = (sum, name) => {
        const dir = path.join(this.__PATH.all, `${name}.json`);
        const new_ARR = JSON.stringify(
            [...JSON.parse(fs.readFileSync(`${this.__PATH.all}/${name}.json`)),...sum],
            '',
            '\t'
        );
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    /**
     * 
     */
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
    positionAddArr = (sum, name) => {
        const dir = path.join(this.__PATH.position, `${name}.json`);
        const new_ARR = JSON.stringify(
            [...JSON.parse(fs.readFileSync(`${this.__PATH.position}/${name}.json`)),...sum],
            '',
            '\t'
        );
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
};
export default new XiuxianData();
