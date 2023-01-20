import gameUer from '../user/user.js'
/**
 * 自定义冷却反馈
 */
const MYCD = {
    '0': '攻击',
    '1': '降妖',
    '2': '闭关',
    '3': '改名',
    '4': '道宣',
    '5': '赠送',
    '6': '突破',
    '7': '破体',
    '8': '转世',
    '9': '行为',
    '10': '击杀',
    '11': '决斗',
    '12': '修行'
}
/**
 * 自定义插件redis字段
 */
const ReadiName='xiuxian:player'
class GamePublic {
    /**
    * 
    * @param {数组} ARR 
    * @returns 随机一个元素
    */
    Anyarray = (parameter) => {
        const { ARR } = parameter
        const randindex = Math.trunc(Math.random() * ARR.length)
        return ARR[randindex]
    }
    /**
     * 强制修正至少为1
     * @param {*} value 
     * @returns 
     */
    leastOne = async (parameter) => {
        const { value } = parameter
        let size = value
        if (isNaN(parseFloat(size)) && !isFinite(size)) {
            size = 1
        }
        size = Number(Math.trunc(size))
        if (size == null || size == undefined || size < 1 || isNaN(size)) {
            size = 1
        }
        return Number(size)
    }
    /**
     * 删除所有数据
     * @returns 
     */
    deleteReids = async () => {
        const allkey = await redis.keys(`${ReadiName}:*`, (err, data) => { })
        if (allkey) {
            allkey.forEach(async (item) => {
                await redis.del(item)
            })
            return
        }
    }

    offAction = async (parameter) => {
        const { UID } = parameter
        const exists = await redis.exists(`${ReadiName}:${UID}:action`)
        if (exists == 1) {
            await redis.del(`${ReadiName}:${UID}:action`)
        }
        return
    }

    /**
     * 行为检测
     * @param {*} UID 
     * @returns 若存在对象MSG则为flase
     */
    Go = async (parameter) => {
        const { UID } = parameter
        let action = await redis.get(`${ReadiName}:${UID}:action`)
        if (action != undefined) {
            action = JSON.parse(action)
            if (action.actionName == undefined) {
                //根据判断msg存不存在来识别是否成功
                return {
                    'MSG': `旧版数据残留,请联系主人使用[#修仙删除数据]`
                }
            }
            return {
                'MSG': `${action.actionName}中...`
            }
        }
        const player = await gameUer.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        if (player.nowblood <= 1) {
            return {
                'MSG': `血量不足`
            }
        }
        return {}
    }

    GoMini = async (parameter) => {
        const { UID } = parameter
        let action = await redis.get(`${ReadiName}:${UID}:action`)
        if (action != undefined) {
            action = JSON.parse(action)
            if (action.actionName == undefined) {
                //根据判断msg存不存在来识别是否成功
                return {
                    'MSG': `旧版数据残留,请联系主人使用[#修仙删除数据]`
                }
            }
            return {
                'MSG': `${action.actionName}中...`
            }
        }
        return {}
    }

    /**
     * 检测CD
     * @param {*} uid 
     * @param {*} CDid 
     * @param {*} CDMAP 
     * @returns 
     */
    cooling = async (parameter) => {
        const { UID, CDID, CDMAP } = parameter
        const remainTime = await redis.ttl(`${ReadiName}:${UID}:${CDID}`)
        const time = {
            h: 0,
            m: 0,
            s: 0
        }
        if (remainTime != -1) {
            time.h = Math.floor(remainTime / 60 / 60)
            time.h = time.h < 0 ? 0 : time.h
            time.m = Math.floor((remainTime - time.h * 60 * 60) / 60)
            time.m = time.m < 0 ? 0 : time.m
            time.s = Math.floor((remainTime - time.h * 60 * 60 - time.m * 60))
            time.s = time.s < 0 ? 0 : time.s
            if (time.h == 0 && time.m == 0 && time.s == 0) {
                return 0
            }
            if (CDMAP) {
                return { CDMSG: `${CDMAP[CDID]}冷却${time.h}h${time.m}m${time.s}s` }
            }
            return { CDMSG: `${MYCD[CDID]}冷却${time.h}h${time.m}m${time.s}s` }
        }
        return {}
    }
    /**
     * 进程沉睡
     * @param {*} time 
     * @returns 
     */
    sleep = async (time) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    /**
    * 对象数组排序
    * 从大到小
    */
    sortBy = (field) => {
        return (b, a) => {
            return a[field] - b[field]
        }
    }



    /**
     * @param {消息内容} data 
     * @returns 
      */
    forwardMsg = async (data) => {
        const msgList = []
        data.forEach((item) => {
            msgList.push({
                message: item,
                nickname: Bot.nickname,
                user_id: Bot.uin,
            })
        })
        if (msgList.length == 1) {
            return msgList[0].message
        }
        return await Bot.makeForwardMsg(msgList)
    }

}
export default new GamePublic()