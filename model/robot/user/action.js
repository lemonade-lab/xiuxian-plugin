class UserAction {
    /**
 * 艾特并返回QQ
 */userAt = async (e) => {
        const isat = e.message.some((item) => item.type === 'at')
        if (!isat) {
            return false
        }
        const atItem = e.message.filter((item) => item.type === 'at')
        //艾特对方会为对方创建游戏信息
        const exist = await existUserSatus(atItem[0]['qq'])
        if (exist) {
            return atItem[0].qq
        }
        //如果对方死了,艾特失效
        return false
    }
}
module.exports = new UserAction()