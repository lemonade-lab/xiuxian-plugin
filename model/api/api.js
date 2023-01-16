import gamePublic from '../game/public/public.js'
import userAction from '../game/user/user.js'
class GameApi {
    /**
     * 用户类
     */
    userMsgAction=async()=>{
        return userAction.userMsgAction()
    }
    /**
     * 公共类
     * @returns 
     */

    deleteReids=async()=>{
        return await gamePublic.deleteReids()
    }

}
export default   new GameApi()