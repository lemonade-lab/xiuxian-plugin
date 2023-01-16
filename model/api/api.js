//公共类
import gamePublic from '../game/public/public.js'
//用户类
import userAction from '../game/user/user.js'
//配置类
import defsetUpdata from '../game/data/defset/updata.js'
class GameApi {
    /**
     * 用户类
     */
    userMsgAction = async (parameter) => {
        return userAction.userMsgAction(parameter)
    }
    /**
     * 公共类
     * @returns 
     */

    deleteReids = async () => {
        return await gamePublic.deleteReids()
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

}
export default new GameApi()