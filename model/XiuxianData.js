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
            //新增
            'newgoods':path.join(__dirname, '/resources/goods'),
            //生成
            'all': path.join(__dirname, '/resources/data/birth/all'),
            'position': path.join(__dirname, '/resources/data/birth/position'),
            'Level': path.join(__dirname, '/resources/data/birth/Level'),
        };
        this.talent_list = JSON.parse(fs.readFileSync(`${this.__PATH.fixedtalent}/talent_list.json`));
        this.newlist(this.__PATH.Level, 'Level_list', []);
        this.newlist(this.__PATH.Level, 'Level_list', [
            ...this.getlist(this.__PATH.fixedLevel, 'Level_list.json')
        ]);
        this.newlist(this.__PATH.Level, 'LevelMax_list', []);
        this.newlist(this.__PATH.Level, 'LevelMax_list', [
            ...this.getlist(this.__PATH.fixedLevel, 'LevelMax_list.json')
        ]);
        //全物品表
        this.newlist(this.__PATH.all, 'all', []);
        this.newlist(this.__PATH.all, 'all', [
            ...this.getlist(this.__PATH.fixedequipment, 'json'),
            ...this.getlist(this.__PATH.fixedgoods, 'json'),
            ...this.getlist(this.__PATH.newgoods, 'json')
        ]);
        //商品数据
        this.newlist(this.__PATH.all, 'commodities', []);
        this.newlist(this.__PATH.all, 'commodities', [
            ...this.getlist(this.__PATH.fixedgoods, '0.json'),
            ...this.getlist(this.__PATH.newgoods, '0.json')
        ]);
        //怪物掉落表
        this.newlist(this.__PATH.all, 'dropsItem', []);
        this.newlist(this.__PATH.all, 'dropsItem', [
            ...this.getlist(this.__PATH.fixedequipment, 'json'),
            ...this.getlist(this.__PATH.fixedgoods, 'json'),
            ...this.getlist(this.__PATH.newgoods, '.json')
        ]);
        //地图系统数据
        this.newlist(this.__PATH.position, 'position', []);
        this.newlist(this.__PATH.position, 'position', [
            ...this.getlist(this.__PATH.fixedposition, 'json')
        ]);
        this.newlist(this.__PATH.position, 'point', []);
        this.newlist(this.__PATH.position, 'point', [
            ...this.getlist(this.__PATH.fixepoint, 'json')
        ]);
    };
    /**
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
     * @param {地址} PATH 
     * @param {检索条件} type 
     */
    getlist = (PATH, type) => {
        const newsum = [];
        const data = [];
        const travel = (dir, callback) => {
            fs.readdirSync(dir).forEach((file) => {
                var pathname = path.join(dir, file);
                if (fs.statSync(pathname).isDirectory()) {
                    travel(pathname, callback);
                } else {
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
        newsum.forEach((file) => {
            data.push(...JSON.parse(fs.readFileSync(file)))
        })
        return data;
    };
};
export default new XiuxianData();