import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import { segment } from 'oicq'
import {
    Write_player,
    GenerateCD,
    get_talent,
    Write_najie,
    Write_talent,
    Write_battle,
    Write_level,
    Write_wealth,
    player_efficiency,
    Write_action,
    Write_equipment,
    Write_Life,
    Read_Life,
    offaction,
    Anyarray,
    exist,
    returnPosirion,
    returnLevel,
    returnLevelMax
} from '../../model/public.js'
import { get_player_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
export class boxuserstart extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#降临世界$',
                fnc: 'Create_player'
            },
            {
                reg: '^#再入仙途$',
                fnc: 'reCreate_player'
            }
        ]))
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian')
    }
    Create_player = async (e) => {
        const group = this.xiuxianConfigData.group.white
        if (group != 0) {
            if (e.group_id != group) {
                return
            }
        }
        if (!e.isGroup || e.user_id == 80000000) {
            return
        }
        const usr_qq = e.user_id
        const ifexistplay = await exist(usr_qq)
        if (!ifexistplay) {
            const img = await get_player_img(e.user_id)
            if (img == undefined) {
                e.reply('已死亡')
            } else {
                e.reply(img)
            }
            return
        }
        this.player(e)
        return
    }

    reCreate_player = async (e) => {
        const usr_qq = e.user_id
        const CDTime = this.xiuxianConfigData.CD.Reborn
        const CDid = '8'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(usr_qq, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await offaction(usr_qq)
        let life = await Read_Life()
        life = await life.filter(item => item.qq != usr_qq)
        await Write_Life(life)
        e.reply([segment.at(usr_qq), '岁月悠悠\n世间终会出现两朵相同的花\n千百年的回眸\n一花凋零\n一花绽\n是否为同一朵\n任后人去评断'])
        this.player(e)
        await redis.set(`xiuxian:player:${usr_qq}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${usr_qq}:${CDid}`, CDTime * 60)
        return
    }

    player = async (e) => {
        const usr_qq = e.user_id
        const new_player = {
            'autograph': '无',//道宣
            'days': 0//签到
        }
        const Levellist = await returnLevel()
        const Level = Levellist.find(item => item.id == 1)
        const Levelmaxlist = await returnLevelMax()
        const LevelMax = Levelmaxlist.find(item => item.id == 1)
        const new_battle = {
            'nowblood': Level.blood + await LevelMax.blood,//血量
        }
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
        }
        const new_wealth = {
            'lingshi': 0,
            'xianshi': 0
        }
        const Posirion = await returnPosirion()
        const position = Posirion.find(item => item.name == '极西')
        const positionID = position.id.split('-')
        const the = {
            mx: Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1),
            my: Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1)
        }
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
        }
        const new_najie = {
            'grade': 1,
            'lingshimax': 50000,  //废弃
            'lingshi': 0,  //废弃
            'thing': []
        }
        const newtalent = await get_talent()
        const new_talent = {
            'talent': newtalent,//灵根
            'talentshow': 1,//显示0,隐藏1
            'talentsize': 0,//天赋
            'AllSorcery': []//功法
        }
        const thename = {
            name1: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            name2: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        }
        const name = await Anyarray(thename.name1) + await Anyarray(thename.name2)
        const life = await Read_Life()
        const time = new Date()
        life.push({
            'qq': usr_qq,
            'name': `${name}`,
            'Age': 1,//年龄
            'life': Math.floor((Math.random() * (100 - 50) + 50)), //寿命
            'createTime': time.getTime(),
            'status': 1
        })
        await Write_player(usr_qq, new_player)
        await Write_talent(usr_qq, new_talent)
        await player_efficiency(usr_qq)
        await Write_battle(usr_qq, new_battle)
        await Write_level(usr_qq, new_level)
        await Write_wealth(usr_qq, new_wealth)
        await Write_action(usr_qq, new_action)
        await Write_equipment(usr_qq, [])
        await Write_najie(usr_qq, new_najie)
        await Write_Life(life)
        e.reply(`成功降临修仙世界\n你可以#前往极西联盟\n进行#联盟报到\n会得到[修仙联盟]的帮助\n也可以使用#位置信息\n查看城市信息\n若想了解自己的身世\n可以#基础信息`)
        return
    }
}