import { createBoxPlayer, existUser, existUserSatus } from "../boxpublic.js"
/**
 * 引入多个对象行为
 */

/**
 * 统一开放接口
 */
class GameApi {
    /**
     * 创建用户
     * @param {*} UID 
     * @returns 
     */
    userCreare = async (UID) => {
        return await createBoxPlayer(UID)
    }
    /**
     * 用户是否存在
     * @param {*} UID 
     * @returns 
     */
    userFile = async (UID) => {
        return await existUser(UID)
    }
    /**
     * 用户是否死亡
     * @param {*} UID 
     * @returns 
     */
    userFileState = async (UID) => {
        return await existUserSatus(UID)
    }



}
module.exports = new GameApi()