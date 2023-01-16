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
    }
    /**
     * 用户是否存在
     * @param {*} UID 
     * @returns 
     */
    userFile = async (UID) => {
    }
    /**
     * 用户是否死亡
     * @param {*} UID 
     * @returns 
     */
    userFileState = async (UID) => {
    }
}
module.exports = new GameApi()