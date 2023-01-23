/**
 * 玩家战斗模型
 */
class UserBattle {
    /**
     * 开始战斗
     */
    start = async (parameter) => {
        /**
         * 得到用户的UID
         */
        const { A, B } = parameter
        const battleA = await gameUser.userMsgAction({ NAME: A, CHOICE: 'user_battle' })
        const battleB = await gameUser.userMsgAction({ NAME: B, CHOICE: 'user_battle' })
        

    }


}
export default new UserBattle()