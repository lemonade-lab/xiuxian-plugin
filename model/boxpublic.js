import { __PATH } from './boxdada.js'
import boxfs from './boxfs.js'
/**
 * @param {UID} UID 
 * @returns 初始化玩家，不成功则false
 */
export const createBoxPlayer = async (UID) => {
    try {
        await userMsgAction({
            NAME: UID, CHOICE: 'user_playser', DATA: {
                'autograph': '无',//道宣
                'days': 0//签到
            }
        })
        const LevelList = await listAction({ CHOICE: 'generate_level', NAME: 'Level_list' })
        const LevelMaxList = await listAction({ CHOICE: 'generate_level', NAME: 'LevelMax_list' })
        await userMsgAction({
            NAME: UID, CHOICE: 'user_battle', DATA: {
                'nowblood': LevelList.find(item => item.id == 1).blood + LevelMaxList.find(item => item.id == 1).blood,//血量
            }
        })
        await userMsgAction({
            NAME: UID, CHOICE: 'user_level', DATA: {
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
        })
        await userMsgAction({
            NAME: UID, CHOICE: 'user_wealth', DATA: {
                'lingshi': 0,
                'xianshi': 0
            }
        })
        const PosirionList = await listAction({ CHOICE: 'generate_position', NAME: 'position' })
        const position = PosirionList.find(item => item.name == '极西')
        const positionID = position.id.split('-')
        const coordinate = {
            mx: Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1),
            my: Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1)
        }
        await userMsgAction({
            NAME: UID, CHOICE: 'user_action', DATA: {
                'game': 1,//游戏状态
                'Couple': 1, //双修
                'newnoe': 1, //新人
                'x': coordinate.mx,
                'y': coordinate.my,
                'z': positionID[0],//位面 
                'region': positionID[1],//区域
                'address': positionID[2],//属性
                'Exchange': 0
            }
        })
        await userMsgAction({
            NAME: UID, CHOICE: 'user_bag', DATA: {
                'grade': 1,
                'lingshimax': 50000,  //废弃
                'lingshi': 0,  //废弃
                'thing': []
            }
        })
        const newtalent = await getTalent()
        await userMsgAction({
            NAME: UID, CHOICE: 'user_talent', DATA: {
                'talent': newtalent,//灵根
                'talentshow': 1,//显示0,隐藏1
                'talentsize': 0,//天赋
                'AllSorcery': []//功法
            }
        })
        const FullName = {
            'full': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            'name': ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        }
        const name = await Anyarray(FullName['name1']) + await Anyarray(FullName['name'])
        const life = await listActionArr({ CHOICE: 'user_life', NAME: 'life' })
        life.push({
            'qq': UID,
            'name': `${name}`,
            'Age': 1,//年龄
            'life': Math.floor((Math.random() * (84 - 60) + 60)), //寿命
            'createTime': new Date().getTime(),
            'status': 1
        })
        await listActionArr({ CHOICE: 'user_life', NAME: 'life', DATA: life })
        await userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: [] })
        await updataUserEfficiency(UID)
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
 * @param {UID} UID 
 * @returns 若不存在则先初始化后通过
 */
export const existplayer = async (UID) => {
    let find = await existUser(UID)
    if (!find) {
        const Go = await createBoxPlayer(UID)
        if (!Go) {
            return false
        }
        life = await readlife()
        find = life.find(item => item.qq == UID)
    }
    if (find.status == 0) {
        return false
    }
    return true
}

/**
 * @param {UID} UID 
 * @returns 检测是否存在
 */
export const existUser = async (UID) => {
    const life = await readLife()
    return life.find(item => item.qq == UID)
}

/**
 * 
 * @param {表名} NAME 
 * @param {地址选择} CHOICE 
 * @param {数据} DATA 
 * @returns 若无data则是读取操作，返回data
 */

export const listAction = async (parameter) => {
    const { NAME, CHOICE, DATA } = parameter
    if (DATA) {
        await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE],
            DATA: DATA
        })
        return
    }
    return await boxfs.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE]
    })
}
/**
 * 
 * @param {表名} NAME 
 * @param {地址选择} CHOICE 
 * @param {数据} DATA 
 * @returns 若无data则是读取操作(若读取失败则初始化为[])
 */
export const listActionArr = async (parameter) => {
    const { NAME, CHOICE, DATA } = parameter
    if (DATA) {
        await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE],
            DATA: DATA
        })
        return
    }
    //读取的时候需要检查
    const Data = await boxfs.dataActionNew({
        NAME: NAME,
        PATH: __PATH[CHOICE]
    })
    if (!Data) {
        await boxfs.dataAction({
            NAME: NAME,
            PATH: [],
            DATA: Data
        })
        return []
    }
    return DATA
}



/**
 * @param {UID} UID 
 * @param {物品名} name 
 * @returns 若背包存在即返回物品信息,若不存在则undifind
 */
export const returnUserBagName = async (parameter) => {
    const { NAME, CHOICE, THING } = parameter
    const bag = await userMsgAction({
        NAME: NAME,
        CHOICE: CHOICE
    })
    return bag.thing.find(item => item.name == THING)
}

/**
 * @param {属性选择} CHOICE 
 * @param {表名} NAME 
 * @returns 随机返回该表的子元素
 */
export const randomListThing = async (parameter) => {
    const { NAME, CHOICE } = parameter
    const LIST = await boxfs.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE]
    })
    return LIST[Math.floor(Math.random() * LIST.length)]
}

/**
 * @param {UID} UID 
 * @param {地址选择} CHOICE 
 * @param {数据} DATA 
 * @returns 若无数据输入则为读取操作，并返回数据
 */
export const userMsgAction = async (parameter) => {
    const { NAME, CHOICE, DATA } = parameter
    if (DATA) {
        await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE],
            DATA: DATA
        })
        return
    }
    return await boxfs.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE]
    })
}


/**
 * 天赋综合计算
 */
export const updataUserEfficiency = async (UID) => {
    const talent = await userMsgAction({
        NAME: UID,
        CHOICE: 'user_talent'
    })
    const talent_sise = {
        'gonfa': 0,
        'talent': 0
    }
    talent.AllSorcery.forEach((item) => {
        talent_sise.gonfa += item.size
    })
    talent_sise.talent = await talentSize(talent)
    let promise = await userMsgAction({
        NAME: UID,
        CHOICE: 'user_extend'
    })
    promise = Object.values(promise)
    let extend = 0
    for (let i in promise) {
        extend += (promise[i].perpetual.efficiency * 100)
    }
    talent.talentsize = talent_sise.talent + talent_sise.gonfa + extend
    await userMsgAction({
        NAME: UID,
        CHOICE: 'user_talent',
        DATA: talent
    })
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