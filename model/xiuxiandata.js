import fs from "fs";
import config from "./config.js";
import path from "path";
import { AppName } from '../app.config.js'
class xiuxiandata {
    constructor() {
        //获取配置文件参数
        this.configData = config.getdefSet("version", "version");

        //文件路径参数
        //插件根目录
        const __dirname = path.resolve() + path.sep + "plugins" + path.sep + AppName;
        this.filePathMap = {
            "player": path.join(__dirname, "/resources/data/xiuxian_player"),//用户数据
            "equipment": path.join(__dirname, "/resources/data/xiuxian_equipment"),
            "najie": path.join(__dirname, "/resources/data/xiuxian_najie"),
            "lib": path.join(__dirname, "/resources/data/item"),
            "timelimit": path.join(__dirname, "/resources/data/timelimit"),//限定
            "level": path.join(__dirname, "/resources/data/level"),//境界
            "association": path.join(__dirname, "/resources/data/association"),
        }

        this.lib_path = this.filePathMap.lib;
        this.timelimit = this.filePathMap.timelimit;
        this.level = this.filePathMap.level;

        //加载灵根列表
        this.talent_list = JSON.parse(fs.readFileSync(`${this.lib_path}/灵根列表.json`));
        //加载怪物列表
        this.monster_list = JSON.parse(fs.readFileSync(`${this.lib_path}/怪物列表.json`));
        //加载商品列表
        this.commodities_list = JSON.parse(fs.readFileSync(`${this.lib_path}/商品列表.json`));

        //练气境界
        this.level_list = JSON.parse(fs.readFileSync(`${this.level}/练气境界.json`));
        //练体境界
        this.levelMax_list = JSON.parse(fs.readFileSync(`${this.level}/炼体境界.json`));


        //加载装备列表
        this.equipment_list = JSON.parse(fs.readFileSync(`${this.lib_path}/装备列表.json`));
        //法宝
        this.fabao_list = JSON.parse(fs.readFileSync(`${this.lib_path}/法宝列表.json`));
        //武器
        this.wuqi_list = JSON.parse(fs.readFileSync(`${this.lib_path}/武器列表.json`));
        //护具
        this.huju_list = JSON.parse(fs.readFileSync(`${this.lib_path}/护具列表.json`));


        //加载丹药列表
        this.danyao_list = JSON.parse(fs.readFileSync(`${this.lib_path}/丹药列表.json`));
        //加载道具列表
        this.daoju_list = JSON.parse(fs.readFileSync(`${this.lib_path}/道具列表.json`));
        //加载功法列表
        this.gongfa_list = JSON.parse(fs.readFileSync(`${this.lib_path}/功法列表.json`));
        //加载草药列表
        this.caoyao_list = JSON.parse(fs.readFileSync(`${this.lib_path}/药草列表.json`));


        //加载地点列表
        this.didian_list = JSON.parse(fs.readFileSync(`${this.lib_path}/地点列表.json`));
        //加载禁地列表
        this.forbiddenarea_list = JSON.parse(fs.readFileSync(`${this.lib_path}/禁地列表.json`));
        //加载仙域列表
        this.Fairyrealm_list = JSON.parse(fs.readFileSync(`${this.lib_path}/仙境列表.json`));

        //加载限定仙府
        this.timeplace_list = JSON.parse(fs.readFileSync(`${this.timelimit}/限定仙府.json`));
        //加载限定功法
        this.timegongfa_list = JSON.parse(fs.readFileSync(`${this.timelimit}/限定功法.json`));
        //加载限定装备
        this.timeequipmen_list = JSON.parse(fs.readFileSync(`${this.timelimit}/限定装备.json`));
        //加载限定丹药
        this.timedanyao_list = JSON.parse(fs.readFileSync(`${this.timelimit}/限定丹药.json`));
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
            logger.error('读取文件错误:' + error);
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



    /**
     * 获取宗门数据
     * @param file_name  宗门名称
     */
    getAssociation(file_name) {
        let file_path;
        let dir;
        let data;
        file_path = this.filePathMap.association;
        dir = path.join(file_path + '/' + file_name + '.json');
        try {
            data = fs.readFileSync(dir, 'utf8')
        } catch (error) {
            logger.error('读取文件错误:' + error);
            return "error";
        }
        //将字符串数据转变成json格式
        data = JSON.parse(data);
        return data;
    }


    /**
     * 写入宗门数据
    * @param file_name  宗门名称
    * @param data
    */
    setAssociation(file_name, data) {
        let file_path;
        let dir;
        file_path = this.filePathMap.association;
        dir = path.join(file_path + '/' + file_name + '.json');
        let new_ARR = JSON.stringify(data, "", "\t");//json转string
        fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
            console.log('写入成功', err)
        })

        return;
    }


}

export default new xiuxiandata();