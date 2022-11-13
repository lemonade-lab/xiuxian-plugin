import fs from "node:fs";
import path from "path";
let all = [];
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
            "fixedequipment": path.join(__dirname, "/resources/data/fixed/equipment"),
            "fixedgoods": path.join(__dirname, "/resources/data/fixed/goods"),
            "fixedlib": path.join(__dirname, "/resources/data/fixed/item"),
            "fixedLevel": path.join(__dirname, "/resources/data/fixed/Level"),
            "fixedoccupation": path.join(__dirname, "/resources/data/fixed/occupation"),
            "fixedtalent": path.join(__dirname, "/resources/data/fixed/talent"),
            "sorcery": path.join(__dirname, "/resources/data/fixed/sorcery"),
            "position": path.join(__dirname, "/resources/data/fixed/position"),
        };
        this.association = this.__PATH.birthassociation;
        this.fixedequipment = this.__PATH.fixedequipment;
        this.goods = this.__PATH.fixedgoods;
        this.lib = this.__PATH.fixedlib;
        this.Level = this.__PATH.fixedLevel;
        this.occupation = this.__PATH.fixedoccupation;
        this.talent = this.__PATH.fixedtalent;
        this.all = this.__PATH.all;
        this.sorcery = this.__PATH.sorcery;
        this.position = this.__PATH.position;

        this.Level_list = JSON.parse(fs.readFileSync(`${this.Level}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.Level}/LevelMax_list.json`));
        this.position_list = JSON.parse(fs.readFileSync(`${this.position}/position.json`));
        this.talent_list = JSON.parse(fs.readFileSync(`${this.talent}/talent.json`));

        this.monster_list = JSON.parse(fs.readFileSync(`${this.lib}/monster_list.json`));

        this.attack_list = JSON.parse(fs.readFileSync(`${this.sorcery}/attack_list.json`));
        this.defense_list = JSON.parse(fs.readFileSync(`${this.sorcery}/defense_list.json`));
        this.blood_list = JSON.parse(fs.readFileSync(`${this.sorcery}/blood_list.json`));
        this.burst_list = JSON.parse(fs.readFileSync(`${this.sorcery}/burst_list.json`));
        this.burstmax_list = JSON.parse(fs.readFileSync(`${this.sorcery}/burstmax_list.json`));
        this.speed_list = JSON.parse(fs.readFileSync(`${this.sorcery}/speed_list.json`));

        this.deletelist('all');

        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/daoju_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)), all, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/ring_list.json`)), all, 99);

        /**
         * 不用的，暂时先清空，无关紧要的数组需要清掉
         */
        this.monster_list = [];
        this.attack_list = [];
        this.defense_list = [];
        this.blood_list = [];
        this.burst_list = [];
        this.burstmax_list = [];
        this.speed_list = [];

        this.add(all, 'all');

        this.deletelist('commodities');

        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`)), commodities, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`)), commodities, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`)), commodities, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`)), commodities, 99);
        this.list(JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`)), commodities, 99);

        this.add(commodities, 'commodities');

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

    existData(file_path_type, file_name) {
        let file_path;
        file_path = this.__PATH[file_path_type];
        let dir = path.join(file_path + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        };
        return false;
    };

    getData(file_name, user_qq) {
        let file_path;
        let dir;
        let data;
        if (user_qq) {//带user_qq的查询数据文件
            file_path = this.__PATH[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {//不带参数的查询item下文件
            file_path = this.__PATH.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        try {
            data = fs.readFileSync(dir, 'utf8');
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return "error";
        }
        data = JSON.parse(data);
        return data;
    }

    setData(file_name, user_qq, data) {
        let file_path;
        let dir;
        if (user_qq) {
            file_path = this.__PATH[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        } else {
            file_path = this.__PATH.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        };
        let new_ARR = JSON.stringify(data, "", "\t");
        if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
            });
        };
        return;
    };

}

export default new XiuxianData();

