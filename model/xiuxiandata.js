import fs from "fs";
import path from "path";
import { getReq, getParse } from "../db/local/algorithm.js";
class xiuxiandata {
  constructor() {
    this.filePathMap = {
      /* 动态 */
      association: getReq("/resources/data/association"),
      exchange: getReq("/resources/data/exchange"),
      forum: getReq("/resources/data/forum"),
      player: getReq("/resources/data/xiuxian_player"),
      equipment: getReq("/resources/data/xiuxian_equipment"),
      najie: getReq("/resources/data/xiuxian_najie"),
      /* 固定 */
      lib: getReq("/resources/data/item"),
      timelimit: getReq("/resources/data/timelimit"),
      level: getReq("/resources/data/level"),
    };
    this.lib_path = this.filePathMap.lib;
    this.timelimit = this.filePathMap.timelimit;
    this.level = this.filePathMap.level;
    this.talent_list = getParse(`${this.lib_path}/灵根列表.json`);
    this.monster_list = getParse(`${this.lib_path}/怪物列表.json`);
    this.commodities_list = getParse(`${this.lib_path}/商品列表.json`);
    this.level_list = getParse(`${this.level}/练气境界.json`);
    this.levelMax_list = getParse(`${this.level}/炼体境界.json`);
    this.equipment_list = getParse(`${this.lib_path}/装备列表.json`);
    this.fabao_list = getParse(`${this.lib_path}/法宝列表.json`);
    this.wuqi_list = getParse(`${this.lib_path}/武器列表.json`);
    this.huju_list = getParse(`${this.lib_path}/护具列表.json`);
    this.danyao_list = getParse(`${this.lib_path}/丹药列表.json`);
    this.daoju_list = getParse(`${this.lib_path}/道具列表.json`);
    this.gongfa_list = getParse(`${this.lib_path}/功法列表.json`);
    this.caoyao_list = getParse(`${this.lib_path}/药草列表.json`);
    this.didian_list = getParse(`${this.lib_path}/地点列表.json`);
    this.forbiddenarea_list = getParse(`${this.lib_path}/禁地列表.json`);
    this.Fairyrealm_list = getParse(`${this.lib_path}/仙境列表.json`);
    this.timeplace_list = getParse(`${this.timelimit}/限定仙府.json`);
    this.timegongfa_list = getParse(`${this.timelimit}/限定功法.json`);
    this.timeequipmen_list = getParse(`${this.timelimit}/限定装备.json`);
    this.timedanyao_list = getParse(`${this.timelimit}/限定丹药.json`);
  }

  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type, file_name) {
    let file_path;
    file_path = this.filePathMap[file_path_type];
    let dir = path.join(file_path + "/" + file_name + ".json");
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
    if (user_qq) {
      //带user_qq的查询数据文件
      file_path = this.filePathMap[file_name];
      dir = path.join(file_path + "/" + user_qq + ".json");
    } else {
      //不带参数的查询item下文件
      file_path = this.filePathMap.lib;
      dir = path.join(file_path + "/" + file_name + ".json");
    }
    try {
      data = fs.readFileSync(dir, "utf8");
    } catch (error) {
      logger.error("读取文件错误:" + error);
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
      dir = path.join(file_path + "/" + user_qq + ".json");
    } else {
      file_path = this.filePathMap.lib;
      dir = path.join(file_path + "/" + file_name + ".json");
    }
    let new_ARR = JSON.stringify(data, "", "\t"); //json转string
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir, new_ARR, "utf-8", (err) => {
        console.log("写入成功", err);
      });
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
    dir = path.join(file_path + "/" + file_name + ".json");
    try {
      data = fs.readFileSync(dir, "utf8");
    } catch (error) {
      logger.error("读取文件错误:" + error);
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
    dir = path.join(file_path + "/" + file_name + ".json");
    let new_ARR = JSON.stringify(data, "", "\t"); //json转string
    fs.writeFileSync(dir, new_ARR, "utf-8", (err) => {
      console.log("写入成功", err);
    });
    return;
  }
}
export default new xiuxiandata();
