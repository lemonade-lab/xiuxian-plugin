/**
 * 游戏内部算法
 */
class GamePublic {
    /**
     * 强制修正至少为1
     * @param {*} value 
     * @returns 
     */
    leastOne = async (value) => {
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
        const allkey = await redis.keys('xiuxian:*', (err, data) => { })
        if (allkey) {
            allkey.forEach(async (item) => {
                await redis.del(item)
            })
            return
        }
    }
    /**
     * 
     */



}
module.exports = new GamePublic()