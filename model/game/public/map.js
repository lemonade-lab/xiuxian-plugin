import userData from '../user/data.js'
class GameMap {
    //输入：模糊搜索名字并判断是否在此地
    mapExistence = async (paramater) => {
        const { action, addressName } = paramater
        const point = await userData.listAction({ NAME: 'point', CHOICE: 'generate_position' })
        for (let item of point) {
            if (item.name.includes(addressName)) {
                if (action.x == item.x && action.y == item.y) {
                    return true
                }
            }
        }
        return false
    }

    //两者距离
    mapDistance = async (A, B) => {
        const h = Math.pow(Math.pow((A.x - B.x1), 2) + Math.pow((A.y - B.y1), 2), 1 / 2)
        return h
    }

    //判断两者是否可以交互
    interactive = async (a, b) => {
        //198=1.98=1
        a.x = Math.floor(a.x / 100)
        a.y = Math.floor(a.y / 100)
        //145/100=1.45=1
        b.x = Math.floor(b.x / 100)
        b.y = Math.floor(b.y / 100)
        if (a.x == b.x && b.y == b.y) {
            return true
        }
        return false
    }


}
export default new GameMap()