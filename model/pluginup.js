import fs from 'node:fs';
import path from 'path';
import data from './XiuxianData.js';
import {
  existplayer, __PATH, Write_player, get_talent, Write_najie,
  Write_talent, Write_battle, Write_level, Write_wealth, player_efficiency,
  Write_action, Write_equipment, Write_Life, Read_Life, Anyarray,
  Read_level, Read_wealth, Numbers
} from '../apps/Xiuxian/Xiuxian.js';
const __dirname = `${path.resolve()}${path.sep}plugins`;
class pluginup {
  constructor() { };
  pluginupdata = (pluginname) => {
    try {
      const newpath = `${pluginname}${path.sep}resources${path.sep}data${path.sep}xiuxian_player`;
      const NEW__PATH = `${__dirname}${path.sep}${newpath}`;
      const data = this.getadress(NEW__PATH, 'json');
      data.forEach(async (item) => {
        const user_qq = item.replace(`${NEW__PATH}${path.sep}`, '').replace('.json', '');
        await this.Create_player(user_qq);
        const player = await this.Read(item);
        let level = await Read_level(user_qq);
        level.level_id = await Numbers(player.level_id / 5);
        level.levelmax_id = await Numbers(player.Physique_id / 5);
        level.experience = await Numbers(player.修为);
        level.experiencemax = await Numbers(player.血气);
        await Write_level(user_qq, level);
        let wealth = await Read_wealth(user_qq);
        wealth.lingshi = await Numbers(player.灵石);
        await Write_wealth(user_qq, wealth);
      });
      return `共${data.length}名获得前世记忆`;
    } catch {
      return '升级失败';
    };
  }
  /**
   * 
   * @param {地址} PATH 
   * @param {文件类型} type 
   * @returns 含有所有数据的路径
   */
  getadress = (PATH, type) => {
    const newsum = [];
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
    return newsum;
  };
  /**
   * 这里需要一个专门用来给升级写的初始化存档
   */
  Create_player = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (ifexistplay) {
      return;
    };
    const new_player = {
      'autograph': '无',//道宣
      'days': 0//签到
    };
    const new_battle = {
      'nowblood': JSON.parse(fs.readFileSync(`${data.__PATH.Level}/Level_list.json`)).find(item => item.id == 1).blood + JSON.parse(fs.readFileSync(`${data.__PATH.Level}/LevelMax_list.json`)).find(item => item.id == 1).blood,//血量
    };
    const new_level = {
      'prestige': 0,//魔力
      'level_id': 1,//练气境界
      'levelname': '凡人',//练气名
      'experience': 1,//练气经验
      'levelmax_id': 1,//练体境界
      'levelnamemax': '莽夫',//练体名
      'experiencemax': 1,//练体经验
      'rank_id': 0,//数组位置
      'rank_name': [
        '初期', '中期', '后期', '巅峰', '圆满'
      ],
      'rankmax_id': 0//数组位置
    };
    const new_wealth = {
      'lingshi': 0,
      'xianshi': 0
    };
    const position = JSON.parse(fs.readFileSync(`${data.__PATH.position}/position.json`)).find(item => item.name == '极西');
    const positionID = position.id.split('-');
    const the = {
      mx: Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1),
      my: Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1)
    };
    const new_action = {
      'game': 1,//游戏状态
      'Couple': 1, //双修
      'newnoe': 1, //新人
      'x': the.mx,
      'y': the.my,
      'z': positionID[0],//位面 
      'region': positionID[1],//区域
      'address': positionID[2],//属性
      'Exchange': 0
    };
    const new_najie = {
      'grade': 1,
      'lingshimax': 50000,
      'lingshi': 0,
      'thing': []
    };
    const newtalent = await get_talent();
    const new_talent = {
      'talent': newtalent,//灵根
      'talentshow': 1,//显示0,隐藏1
      'talentsize': 0,//天赋
      'AllSorcery': []//功法
    };
    const thename = {
      name1: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
      name2: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    };
    const name = await Anyarray(thename.name1) + await Anyarray(thename.name2);
    const life = await Read_Life();
    const time = new Date();
    life.push({
      'qq': usr_qq,
      'name': `${name}`,
      'Age': 1,//年龄
      'life': Math.floor((Math.random() * (100 - 50) + 50)), //寿命
      'createTime': time.getTime(),
      'status': 1
    });
    await Write_player(usr_qq, new_player);
    await Write_talent(usr_qq, new_talent);
    await player_efficiency(usr_qq);
    await Write_battle(usr_qq, new_battle);
    await Write_level(usr_qq, new_level);
    await Write_wealth(usr_qq, new_wealth);
    await Write_action(usr_qq, new_action);
    await Write_equipment(usr_qq, []);
    await Write_najie(usr_qq, new_najie);
    await Write_Life(life);
    return;
  };
  /**
   * 读取数据
   */
  Read = async (PATH) => {
    const dir = path.join(`${PATH}`);
    let player = fs.readFileSync(dir, 'utf8', (err, data) => {
      if (err) {
        return 'error';
      };
      return data;
    });
    player = JSON.parse(player);
    return player;
  };
};
export default new pluginup();