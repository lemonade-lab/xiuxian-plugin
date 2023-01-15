import { __PATH } from './boxdada.js'
import boxfs from './boxfs.js'
/**
 * 
 * @param {UID} uid 
 * @returns 初始化玩家，不成功则false
 */
export const createBoxPlayer = async (uid) => {
    try {
        const new_player = {
            'autograph': '无',//道宣
            'days': 0//签到
        }
        const LevelList = await listAction('generate_level', 'Level_list')
        const LevelMaxList = await listAction('generate_level', 'LevelMax_list')
        const new_battle = {
            'nowblood': LevelList.find(item => item.id == 1).blood + await LevelMaxList.find(item => item.id == 1).blood,//血量
        }
        const new_level = {
            'prestige': 0,//魔力
            'level_id': 1,//练气境界
            'levelname': LevelList.find(item => item.id == 1).name,//练气名
            'experience': 1,//练气经验
            'levelmax_id': 1,//练体境界
            'levelnamemax': LevelMaxList.find(item => item.id == 1).name,//练体名
            'experiencemax': 1,//练体经验
            'rank_id': 0,//数组位置
            'rankmax_id': 0//数组位置
        }
        const new_wealth = {
            'lingshi': 0,
            'xianshi': 0
        }
        const PosirionList = await listAction('generate_position', 'position')
        const position = PosirionList.find(item => item.name == '极西')
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
        const newtalent = await getTalent()
        const new_talent = {
            'talent': newtalent,//灵根
            'talentshow': 1,//显示0,隐藏1
            'talentsize': 0,//天赋
            'AllSorcery': []//功法
        }
        const FullName = {
            'full': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            'name': ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        }
        const name = await Anyarray(FullName['name1']) + await Anyarray(FullName['name'])

        /**
         * 寿命生成
         */
        const life = await listActionArr('user_life', 'life')
        const time = new Date()
        life.push({
            'qq': uid,
            'name': `${name}`,
            'Age': 1,//年龄
            'life': Math.floor((Math.random() * (84 - 60) + 60)), //寿命
            'createTime': time.getTime(),
            'status': 1
        })
        await listActionArr('user_life', 'life', life)

        await userMsgAction(uid, 'user_playser', new_player)
        await userMsgAction(uid, 'user_talent', new_talent)
        await userMsgAction(uid, 'user_battle', new_battle)
        await userMsgAction(uid, 'user_level', new_level)
        await userMsgAction(uid, 'user_wealth', new_wealth)
        await userMsgAction(uid, 'user_action', new_action)
        await userMsgAction(uid, 'user_equipment', [])
        await userMsgAction(uid, 'user_bag', new_najie)
        /**
         * 更新天赋
         */
        await updataUserEfficiency(uid)
        return ture
    } catch {
        return false
    }
}
/**
 * 
 * @param {数组} ARR 
 * @returns 随机一个元素
 */
export const Anyarray = (ARR) => {
    const randindex = Math.trunc(Math.random() * ARR.length)
    return ARR[randindex]
}


/**
 * @param {UID} uid 
 * @returns 有存档则false
 */
export const exist = async (uid) => {
    const life = await readlife()  //todo
    const find = life.find(item => item.qq == uid)
    if (!find) {
        return true
    }
    return false
}



/**
 * @param {UID} uid 
 * @returns 若不存在则先初始化后通过
 */
export const existplayer = async (uid) => {
    let find = await existUser(uid)
    if (!find) {
        const Go = await createBoxPlayer(uid)
        if (!Go) {
            return false
        }
        life = await readlife()
        find = life.find(item => item.qq == uid)
    }
    if (find.status == 0) {
        return false
    }
    return true
}

/**
 * @param {UID} uid 
 * @returns 检测是否存在
 */
export const existUser = async (uid) => {
    const life = await readLife()
    return life.find(item => item.qq == uid)
}



/**
 * 
 * @param {地址选择} attribute 
 * @param {表名} listname 
 * @param {数据} data 
 * @returns 若无data则是读取操作，返回data
 */

export const listAction = async (attribute, listname, data) => {
    if (data) {
        await boxfs.dataAction({
            NAME: listname,
            PATH: __PATH[attribute],
            DATA: data
        })
        return
    }
    return await boxfs.dataAction({
        NAME: listname,
        PATH: __PATH[attribute]
    })
}
/**
 * 
 * @param {地址选择} attribute 
 * @param {表名} listname 
 * @param {数据} data 
 * @returns 若无data则是读取操作(若读取失败则初始化为[])
 */
export const listActionArr = async (attribute, listname, data) => {
    if (data) {
        await boxfs.dataAction({
            NAME: listname,
            PATH: __PATH[attribute],
            DATA: data
        })
        return
    }
    //读取的时候需要检查
    const DATA = await boxfs.dataAction({
        NAME: listname,
        PATH: __PATH[attribute]
    })
    if (!DATA) {
        await boxfs.dataAction({
            NAME: listname,
            PATH: [],
            DATA: data
        })
        return []
    }
    return DATA
}



/**
 * @param {UID} uid 
 * @param {物品名} name 
 * @returns 若背包存在即返回物品信息,若不存在则undifind
 */
export const returnUserBagName = async (parameter) => {
    const { NAME, ATTRIBUTE, THING } = parameter
    const najie = await userMsgAction({
        NAME: NAME,
        ATTRIBUTE: ATTRIBUTE
    })
    return najie.thing.find(item => item.name == THING)
}

/**
 * @param {属性选择} attribute 
 * @param {表名} listname 
 * @returns 随机返回该表的子元素
 */
export const randomListThing = async (parameter) => {
    const { NAME, ATTRIBUTE, DATA } = parameter
    const LIST = await boxfs.dataAction({
        NAME: NAME,
        PATH: __PATH[ATTRIBUTE]
    })
    return LIST[Math.floor(Math.random() * LIST.length)]
}

/**
 * @param {UID} UID 
 * @param {地址选择} ATTRIBUTE 
 * @param {数据} DATA 
 * @returns 若无数据输入则为读取操作，并返回数据
 */
export const userMsgAction = async (parameter) => {
    const { NAME, ATTRIBUTE, DATA } = parameter
    if (DATA) {
        await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[ATTRIBUTE],
            DATA: DATA
        })
        return
    }
    return await boxfs.dataAction({
        NAME: NAME,
        PATH: __PATH[ATTRIBUTE]
    })
}

/**
 * 天赋综合计算
 */
export const updataUserEfficiency = async (uid) => {
    const talent = await userMsgAction(uid, 'user_talent')
    const talent_sise = {
        'gonfa': 0,
        'talent': 0
    }
    talent.AllSorcery.forEach((item) => {
        talent_sise.gonfa += item.size
    })
    talent_sise.talent = await talentSize(talent)
    let promise = await userMsgAction(uid, 'user_extend')
    promise = Object.values(promise)
    let extend = 0
    for (let i in promise) {
        extend += (promise[i].perpetual.efficiency * 100)
    }
    talent.talentsize = talent_sise.talent + talent_sise.gonfa + extend
    await userMsgAction(uid, 'user_talent', talent)
    return
}

/**
 * 
 * @param {灵根数据} data 
 * @returns 灵根天赋值
 */
const talentSize = async (data) => {
    let talent_size = 250
    //根据灵根数来判断
    for (let i = 0; i < data.length; i++) {
        //循环加效率
        if (data[i] <= 5) {
            talent_size -= 50
        }
        if (data[i] >= 6) {
            talent_size -= 40
        }
    }
    return talent_size
}

/**
 * 
 * @returns 随机生成灵根
 */
export const getTalent = async () => {
    //存储灵根
    const newtalent = []
    //初始灵根数
    const talentacount = Math.round(Math.random() * (5 - 1)) + 1
    for (let i = 0; i < talentacount; i++) {
        const x = Math.round(Math.random() * (10 - 1)) + 1
        const y = newtalent.indexOf(x)
        //删减灵根
        if (y != -1) {
            continue
        }
        if (x <= 5) {
            const z = newtalent.indexOf(x + 5)
            if (z != -1) {
                continue
            }
        } else {
            const z = newtalent.indexOf(x - 5)
            if (z != -1) {
                continue
            }
        }
        newtalent.push(x)
    }
    return newtalent
}