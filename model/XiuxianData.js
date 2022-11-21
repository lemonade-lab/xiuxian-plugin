import fs from 'node:fs';
import path from 'path';
class XiuxianData {
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
        this.Level_list = JSON.parse(fs.readFileSync(`${this.Level}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.Level}/LevelMax_list.json`));
        this.position_list = JSON.parse(fs.readFileSync(`${this.position}/position.json`));
        this.talent_list = JSON.parse(fs.readFileSync(`${this.talent}/talent.json`));
        this.fixedequipment = this.__PATH.fixedequipment;
        this.goods = this.__PATH.fixedgoods;
        this.deletelist('all');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.goods}/daoju_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)),
            ...JSON.parse(fs.readFileSync(`${this.goods}/ring_list.json`))
        ], 'all');
        this.deletelist('commodities');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)).slice(0, 11),
            ...JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)).slice(0, 11)
        ], 'commodities');
        this.deletelist('dropsItem');
        this.addlist([
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)).slice(0, 19),
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)).slice(0, 19),
            ...JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)).slice(0, 19),
            ...JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)).slice(11, 19),
            ...JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)).slice(11, 19),
            ...JSON.parse(fs.readFileSync(`${this.goods}/daoju_list.json`))
        ], 'dropsItem');
    };
    deletelist = (name) => {
        const dir = path.join(this.all, `${name}.json`);
        const new_ARR = JSON.stringify([], '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
    addlist = (sum, name) => {
        const dir = path.join(this.all, `${name}.json`);
        const new_ARR = JSON.stringify(sum, '', '\t');
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        });
    };
};
export default new XiuxianData();