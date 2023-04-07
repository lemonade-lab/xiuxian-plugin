import fs from 'fs';
import Config from './Config.js';
import path from 'path';
import { AppName } from '../app.config.js';
/*
  数据封装
 */
class XiuxianData {
  constructor() {
    //获取配置文件参数
    this.configData = Config.getConfig('version', 'version');

    //文件路径参数
    //插件根目录
    const __dirname =
      path.resolve() + path.sep + 'plugins' + path.sep + AppName;
    this.filePathMap = {
      player: path.join(__dirname, '/resources/data/xiuxian_player'), //用户数据
      equipment: path.join(__dirname, '/resources/data/xiuxian_equipment'),
      najie: path.join(__dirname, '/resources/data/xiuxian_najie'),
      lib: path.join(__dirname, '/resources/data/item'),
      Timelimit: path.join(__dirname, '/resources/data/Timelimit'), //限定
      Level: path.join(__dirname, '/resources/data/Level'), //境界
      association: path.join(__dirname, '/resources/data/association'),
      occupation: path.join(__dirname, '/resources/data/occupation'),
    };
    this.lib_path = this.filePathMap.lib;
    this.Timelimit = this.filePathMap.Timelimit;
    this.Level = this.filePathMap.Level;
    this.Occupation = this.filePathMap.occupation;

    //加载灵根列表
    this.talent_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/灵根列表.json`)
    );
    //加载怪物列表
    this.monster_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/怪物列表.json`)
    );
    //加载商品列表
    this.commodities_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/商品列表.json`)
    );
    //练气境界
    this.Level_list = JSON.parse(
      fs.readFileSync(`${this.Level}/练气境界.json`)
    );
    //师徒积分
    this.shitujifen = JSON.parse(
      fs.readFileSync(`${this.lib_path}/积分商城.json`)
    );
    //练体境界
    this.LevelMax_list = JSON.parse(
      fs.readFileSync(`${this.Level}/炼体境界.json`)
    );
    //加载装备列表
    this.equipment_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/装备列表.json`)
    );
    //加载丹药列表
    this.danyao_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/丹药列表.json`)
    );
    //加载炼丹师丹药列表
    this.newdanyao_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/炼丹师丹药.json`)
    );
    //加载道具列表
    this.daoju_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/道具列表.json`)
    );
    //加载功法列表
    this.gongfa_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/功法列表.json`)
    );
    //加载草药列表
    this.caoyao_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/草药列表.json`)
    );

    //加载地点列表
    this.didian_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/地点列表.json`)
    );
    //加载洞天福地列表
    this.bless_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/洞天福地.json`)
    );
    //加载宗门秘境
    this.guildSecrets_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/宗门秘境.json`)
    );
    //加载禁地列表
    this.forbiddenarea_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/禁地列表.json`)
    );
    //加载仙域列表
    this.Fairyrealm_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/仙境列表.json`)
    );
    //加载限定仙府
    this.timeplace_list = JSON.parse(
      fs.readFileSync(`${this.Timelimit}/限定仙府.json`)
    );
    //加载限定功法
    this.timegongfa_list = JSON.parse(
      fs.readFileSync(`${this.Timelimit}/限定功法.json`)
    );
    //加载限定装备
    this.timeequipmen_list = JSON.parse(
      fs.readFileSync(`${this.Timelimit}/限定装备.json`)
    );
    //加载限定丹药
    this.timedanyao_list = JSON.parse(
      fs.readFileSync(`${this.Timelimit}/限定丹药.json`)
    );
    //加载职业列表
    this.occupation_list = JSON.parse(
      fs.readFileSync(`${this.Occupation}/职业列表.json`)
    );
    //加载职业经验列表
    this.occupation_exp_list = JSON.parse(
      fs.readFileSync(`${this.Occupation}/experience.json`)
    );
    //加载丹方列表
    this.danfang_list = JSON.parse(
      fs.readFileSync(`${this.Occupation}/炼丹配方.json`)
    );
    //加载图纸列表
    this.tuzhi_list = JSON.parse(
      fs.readFileSync(`${this.Occupation}/装备图纸.json`)
    );

    //加载八品功法列表
    this.bapin = JSON.parse(fs.readFileSync(`${this.lib_path}/八品.json`));
    //加载星阁列表
    this.xingge = JSON.parse(
      fs.readFileSync(`${this.lib_path}/星阁拍卖行列表.json`)
    );
    //天地
    this.tianditang = JSON.parse(
      fs.readFileSync(`${this.lib_path}/天地堂.json`)
    );
    //仙宠
    this.changzhuxianchon = JSON.parse(
      fs.readFileSync(`${this.lib_path}/常驻仙宠.json`)
    );
    this.xianchon = JSON.parse(
      fs.readFileSync(`${this.lib_path}/仙宠列表.json`)
    );
    this.xianchonkouliang = JSON.parse(
      fs.readFileSync(`${this.lib_path}/仙宠口粮列表.json`)
    );
    //npc
    this.npc_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/npc列表.json`)
    );
    //
    this.shop_list = JSON.parse(
      fs.readFileSync(`${this.lib_path}/shop列表.json`)
    );

    this.qinlong = JSON.parse(fs.readFileSync(`${this.Timelimit}/青龙.json`));
    this.qilin = JSON.parse(fs.readFileSync(`${this.Timelimit}/麒麟.json`));
    this.xuanwu = JSON.parse(
      fs.readFileSync(`${this.Timelimit}/玄武朱雀白虎.json`)
    );
    //魔界
    this.mojie = JSON.parse(fs.readFileSync(`${this.lib_path}/魔界列表.json`));
    //兑换码
    this.duihuan = JSON.parse(
      fs.readFileSync(`${this.lib_path}/兑换列表.json`)
    );
    //神界
    this.shenjie = JSON.parse(
      fs.readFileSync(`${this.lib_path}/神界列表.json`)
    );
    //加载技能列表
    this.jineng1 = JSON.parse(
      fs.readFileSync(`${this.lib_path}/技能列表1.json`)
    );
    this.jineng2 = JSON.parse(
      fs.readFileSync(`${this.lib_path}/技能列表2.json`)
    );
    //加载强化列表
    this.qianghua = JSON.parse(
      fs.readFileSync(`${this.lib_path}/强化列表.json`)
    );
    //锻造材料列表
    this.duanzhaocailiao = JSON.parse(
      fs.readFileSync(`${this.lib_path}/锻造材料.json`)
    );
    //锻造武器列表
    this.duanzhaowuqi = JSON.parse(
      fs.readFileSync(`${this.lib_path}/锻造武器.json`)
    );
    //锻造护具列表
    this.duanzhaohuju = JSON.parse(
      fs.readFileSync(`${this.lib_path}/锻造护具.json`)
    );
    //锻造宝物列表
    this.duanzhaobaowu = JSON.parse(
      fs.readFileSync(`${this.lib_path}/锻造宝物.json`)
    );
    //隐藏灵根列表
    this.yincang = JSON.parse(
      fs.readFileSync(`${this.lib_path}/隐藏灵根.json`)
    );
    //锻造杂类列表
    this.zalei = JSON.parse(fs.readFileSync(`${this.lib_path}/锻造杂类.json`));
    //加载技能列表
    this.jineng = JSON.parse(fs.readFileSync(`${this.lib_path}/技能列表.json`));
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
    if (user_qq) {
      //带user_qq的查询数据文件
      file_path = this.filePathMap[file_name];
      dir = path.join(file_path + '/' + user_qq + '.json');
    } else {
      //不带参数的查询item下文件
      file_path = this.filePathMap.lib;
      dir = path.join(file_path + '/' + file_name + '.json');
    }
    try {
      data = fs.readFileSync(dir, 'utf8');
    } catch (error) {
      logger.error('读取文件错误：' + error);
      return 'error';
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
    let new_ARR = JSON.stringify(data, '', '\t'); //json转string
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir, new_ARR, 'utf-8', err => {
        console.log('写入成功', err);
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
    dir = path.join(file_path + '/' + file_name + '.json');
    try {
      data = fs.readFileSync(dir, 'utf8');
    } catch (error) {
      logger.error('读取文件错误：' + error);
      return 'error';
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
    let new_ARR = JSON.stringify(data, '', '\t'); //json转string
    fs.writeFileSync(dir, new_ARR, 'utf-8', err => {
      console.log('写入成功', err);
    });
    return;
  }
}
export default new XiuxianData();
