import fs from 'node:fs';
import path from 'path';
class XiuxianData {
    constructor() {
        const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}Xiuxian-Plugin-Box`;
        this.__PATH = {
            //基础
            'fixepoint': path.join(__dirname, '/resources/data/fixed/point'),
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
        this.talent_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedtalent}/talent_list.json`));
        this.newlist(this.__PATH.Level, 'Level_list', []);
        this.newlist(this.__PATH.Level, 'Level_list', [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/Level_list.json`))
        ]);
        this.newlist(this.__PATH.Level, 'LevelMax_list', []);
        this.newlist(this.__PATH.Level, 'LevelMax_list', [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedLevel}/LevelMax_list.json`))
        ]);
        this.newlist(this.__PATH.all, 'all', []);
        this.newlist(this.__PATH.all, 'all', [
            ...this.getlist(this.__PATH.fixedequipment, 'json'),
            ...this.getlist(this.__PATH.fixedgoods, 'json')
        ]);
        this.newlist(this.__PATH.all, 'commodities', []);
        this.newlist(this.__PATH.all, 'commodities', [
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/danyao1.json`)),
            ...JSON.parse(fs.readFileSync(`${this.__PATH.fixedgoods}/gongfa1.json`))
        ]);
        this.newlist(this.__PATH.all, 'dropsItem', []);
        this.newlist(this.__PATH.all, 'dropsItem', [
            ...this.getlist(this.__PATH.fixedequipment, 'json'),
            ...this.getlist(this.__PATH.fixedgoods, 'json')
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
        this.newlist(this.__PATH.position, 'position', []);
        this.newlist(this.__PATH.position, 'position', [
            ...this.getlist(this.__PATH.fixedposition, 'json')
        ]);
        /**
         * id含义：位面-区域-属性-等级-编号
         * 编号：0区域、1中心、2传送阵、3联盟、凡仙堂4、弱水阁5、
         * 
         */
        this.newlist(this.__PATH.position, 'point', []);
        this.newlist(this.__PATH.position, 'point', [
            ...this.getlist(this.__PATH.fixepoint, 'json')
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
    /**
     * @param {地址} path 
     * @param {表名} name 
     * @param {数据} sum 
     */
    newlist = (PATH, name, sum) => {
        const dir = path.join(PATH, `${name}.json`);
        const new_ARR = JSON.stringify(sum, '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { });
    };
    /**
     * 
     * @param {地址} PATH 
     * @param {文件类型} type 
     */
    getlist = (PATH, type) => {
        const newsum = [];
        const travel = (dir, callback) => {
            fs.readdirSync(dir).forEach((file) => {
                var pathname = path.join(dir, file);
                if (fs.statSync(pathname).isDirectory()) {
                    travel(pathname, callback);
                }
                else {
                    callback(pathname);
                };
            });
        };
        travel(PATH, (pathname) => {
            let temporary = pathname.search(type);
            if (temporary != -1) {
                newsum.push(pathname);
            }
        });
        const data = [];
        newsum.forEach((file) => {
            data.push(...JSON.parse(fs.readFileSync(file)))
        })
        return data;
    }
};
export default new XiuxianData();