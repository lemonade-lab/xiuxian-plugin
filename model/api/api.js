//公共类
import gamePublic from '../game/public/public.js'
//用户类
import userAction from '../game/user/user.js'
//配置类
import defsetUpdata from '../game/data/defset/updata.js'

import schedule from '../game/data/schedule.js'

import algorithm from '../game/data/algorithm.js'

import createdata from '../game/data/createdata.js'
class GameApi {
    /**
     * 用户类
     */
    userMsgAction = async (parameter) => {
        return await userAction.userMsgAction(parameter)
    }
    userBag = async (parameter) => {
        return await userAction.userBag(parameter)
    }
    userBagSearch = async (parameter) => {
        return await userAction.userBagSearch(parameter)
    }
    /**
     * 公共类
     * @returns 
     */

    deleteReids = async () => {
        return await gamePublic.deleteReids()
    }
    leastOne = async (parameter) => {
        return await gamePublic.leastOne(parameter)
    }
    /**
     * 配置类
     */
    getConfig = (parameter) => {
        return defsetUpdata.getConfig(parameter)
    }
    updateConfig = (parameter) => {
        return defsetUpdata.updataConfig(parameter)
    }
    /**
     * 备份类
     */
    viewbackups = () => {
        return schedule.viewbackups()
    }
    backuprecovery = (parameter) => {
        return schedule.viewbackups(parameter)
    }

    /**
     * 算法类
     */
    returnMenu = (parameter) => {
        return algorithm.returnMenu(parameter)
    }

    existsSync=(parameter)=>{
        return algorithm.existsSync(parameter)
    }

    /**
     * 数据
     */
    moveConfig = (parameter) => {
        return createdata.moveConfig(parameter)
    }

}
export default new GameApi()