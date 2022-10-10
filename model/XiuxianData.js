import fs from "node:fs"
import Config from "./Config.js"
import path from "path"

/*
  数据封装
 */

class XiuxianData {
    constructor() {
        //默认配置
        this.configData = Config.getdefSet("version", "version")
        //文件路径参数
        //插件根目录
        const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin"
        //修仙配置
        this.filePathMap = {
            //用户数据表优化
            "player": path.join(__dirname, "/resources/data/birth/xiuxian/player"),
            "equipment": path.join(__dirname, "/resources/data/birth/xiuxian/equipment"),
            "najie": path.join(__dirname, "/resources/data/birth/xiuxian/najie"),
            //出生
            "birthassociation": path.join(__dirname, "/resources/data/birth/association"),
            //装备
            "fixedequipment": path.join(__dirname, "/resources/data/fixed/equipment"),
            //物品
            "fixedgoods": path.join(__dirname, "/resources/data/fixed/goods"),
            //其他
            "fixedlib": path.join(__dirname, "/resources/data/fixed/item"),
            //境界
            "fixedLevel": path.join(__dirname, "/resources/data/fixed/Level"),
            //职业
            "fixedoccupation": path.join(__dirname, "/resources/data/fixed/occupation"),
            //地点
            "fixedplace": path.join(__dirname, "/resources/data/fixed/place"),
            //灵根
            "fixedtalent": path.join(__dirname, "/resources/data/fixed/talent"),
            //限定
            "fixedTimelimit": path.join(__dirname, "/resources/data/fixed/Timelimit"),
        }

        this.association = this.filePathMap.birthassociation;
        //装备
        this.fixedequipment = this.filePathMap.fixedequipment;
        //物品
        this.goods = this.filePathMap.fixedgoods;
        //其他
        this.lib = this.filePathMap.fixedlib;
        //境界
        this.Level = this.filePathMap.fixedLevel;
        //职业
        this.occupation = this.filePathMap.fixedoccupation;
        //地点
        this.place = this.filePathMap.fixedplace;
        //灵根
        this.talent = this.filePathMap.fixedtalent;
        //限定
        this.Timelimit = this.filePathMap.fixedTimelimit;

        //商品
        this.commodities_list = JSON.parse(fs.readFileSync(`${this.lib}/commodities_list.json`));
        //怪物
        this.monster_list = JSON.parse(fs.readFileSync(`${this.lib}/monster_list.json`));
        //境界
        this.Level_list = JSON.parse(fs.readFileSync(`${this.Level}/Level_list.json`));
        this.LevelMax_list = JSON.parse(fs.readFileSync(`${this.Level}/LevelMax_list.json`));
        //装备
        this.fabao_list = JSON.parse(fs.readFileSync(`${this.fixedequipment}/fabao_list.json`));
        this.wuqi_list = JSON.parse(fs.readFileSync(`${this.fixedequipment}/wuqi_list.json`));
        this.huju_list = JSON.parse(fs.readFileSync(`${this.fixedequipment}/huju_list.json`));
        //物品
        this.danyao_list = JSON.parse(fs.readFileSync(`${this.goods}/danyao_list.json`));
        this.daoju_list = JSON.parse(fs.readFileSync(`${this.goods}/daoju_list.json`));
        this.gongfa_list = JSON.parse(fs.readFileSync(`${this.goods}/gongfa_list.json`));
        //地点
        this.didian_list = JSON.parse(fs.readFileSync(`${this.place}/didian_list.json`));
        //禁地
        this.forbiddenarea_list = JSON.parse(fs.readFileSync(`${this.place}/forbiddenarea_list.json`));
        //
        this.Fairyrealm_list = JSON.parse(fs.readFileSync(`${this.place}/Fairyrealm_list.json`));
        //灵根
        this.talent_list = JSON.parse(fs.readFileSync(`${this.talent}/talent.json`));
        //限定
        this.timeplace_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timeplace_list.json`));
        //限定物品
        this.timegongfa_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timegongfa_list.json`));
        this.timedanyao_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timedanyao_list.json`));
        //限定装备
        this.timefabao_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timefabao_list.json`));
        this.timewuqi_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timewuqi_list.json`));
        this.timehuju_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/timehuju_list.json`));
        //戒指
        this.ring_list = JSON.parse(fs.readFileSync(`${this.Timelimit}/ring_list.json`));
    }


    /**
      * 检测存档存在
      * @param file_path_type ["player" , "association" ]
      * @param file_name 
      */
    existData(file_path_type, file_name) {
        let file_path;
        file_path = this.filePathMap[file_path_type];
        let dir = path.join(file_path + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        }
        return false;
    }


    /**
     * 获取文件数据(user_qq为空查询item下的file_name文件)
     * @param file_name  [player,equipment,najie]
     * @param user_qq
     */
    getData(file_name, user_qq) {
        let file_path;
        let dir;
        let data;
        if (user_qq) {//带user_qq的查询数据文件
            file_path = this.filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {//不带参数的查询item下文件
            file_path = this.filePathMap.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        try {
            data = fs.readFileSync(dir, 'utf8')
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return "error";
        }
        //将字符串数据转变成json格式
        data = JSON.parse(data);
        return data;
    }


    /**
     * 写入数据
     * @param file_name [player,equipment,najie]
     * @param user_qq
     * @param data
     */
    setData(file_name, user_qq, data) {
        let file_path;
        let dir;
        if (user_qq) {
            file_path = this.filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        } else {
            file_path = this.filePathMap.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        let new_ARR = JSON.stringify(data, "", "\t");//json转string
        if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
                console.log('写入成功', err)
            })
        }
        return;
    }

}

export default new XiuxianData();