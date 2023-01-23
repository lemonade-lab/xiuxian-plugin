import gamePublic from '../game/public/public.js'
import gameUser from '../game/user/user.js'
import defsetUpdata from '../game/data/defset/updata.js'
import schedule from '../game/data/schedule.js'
import algorithm from '../game/data/algorithm.js'
import createdata from '../game/data/createdata.js'
import userAction from '../game/user/action.js'
import userData from '../game/data/listaction.js'
import gameMap from '../game/public/map.js'
import gameMonster from '../game/monster/monster.js'
import gameBattle from '../game/public/battel.js'
import information from '../game/user/information.js'
import dataIndex from '../game/data/index.js'
class GameApi {
    /**
     * 用户类
     */
    startLife = async () => {
        return await gameUser.startLife()
    }
    getUserUID = async () => {
        return await gameUser.getUserUID()
    }
    userMsgAction = async (parameter) => {
        return await gameUser.userMsgAction(parameter)
    }
    userBag = async (parameter) => {
        return await gameUser.userBag(parameter)
    }
    userBagSearch = async (parameter) => {
        return await gameUser.userBagSearch(parameter)
    }
    existUserSatus = async (parameter) => {
        return await gameUser.existUserSatus(parameter)
    }
    createBoxPlayer = async (parameter) => {
        return await gameUser.createBoxPlayer(parameter)
    }
    updataUserEfficiency = async (parameter) => {
        return await gameUser.updataUserEfficiency(parameter)
    }
    randomThing = async () => {
        return await gameUser.randomThing()
    }
    updataUser = async (parameter) => {
        return await gameUser.updataUser(parameter)
    }
    updataUserBlood = async (parameter) => {
        return await gameUser.updataUserBlood(parameter)
    }
    readPanel = async (parameter) => {
        return await gameUser.readPanel(parameter)
    }
    /**
     * 查表行为
     */
    listAction = async (parameter) => {
        return await userData.listAction(parameter)
    }
    listActionArr = async (parameter) => {
        return await userData.listActionArr(parameter)
    }

    /**
     * 数据合集
     */

    userBagShow = async (parameter) => {
        return await information.userBagShow(parameter)
    }

    userEquipmentShow = async (parameter) => {
        return await information.userEquipmentShow(parameter)
    }

    userDataShow = async (parameter) => {
        return await information.userDataShow(parameter)
    }


    /**
     * 地图
     */
    interactive = async (parameter) => {
        return await gameMap.interactive(parameter)
    }

    mapDistance = async (parameter) => {
        return await gameMap.mapDistance(parameter)
    }

    mapExistence = async (parameter) => {
        return await gameMap.mapExistence(parameter)
    }


    /**
     * 怪物
     */

    add = async (parameter) => {
        return await gameMonster.add(parameter)
    }
    monsterscache = async (parameter) => {
        return await gameMonster.monsterscache(parameter)
    }

    /**
     * 战斗模型
     */

    monsterbattle = async (parameter) => {
        return await gameBattle.monsterbattle(parameter)
    }
    battle = async (parameter) => {
        return await gameBattle.battle(parameter)
    }


    /**
     * 得到灵根
     * @returns 
     */
    getTalent = async () => {
        return await gameUser.getTalent()
    }
    /**
     * 行为类
     */
    userLevelUp = async (parameter) => {
        return await userAction.userLevelUp(parameter)
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
    sortBy = (parameter) => {
        return gamePublic.sortBy()
    }
    sleep = async (parameter) => {
        return await gamePublic.sleep(parameter)
    }
    cooling = async (parameter) => {
        return await gamePublic.cooling(parameter)
    }
    Go = async (parameter) => {
        return await gamePublic.Go(parameter)
    }
    GoMini = async (parameter) => {
        return await gamePublic.GoMini(parameter)
    }
    offAction = async (parameter) => {
        return await gamePublic.offAction(parameter)
    }


    Anyarray = async (parameter) => {
        return await gamePublic.Anyarray(parameter)
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
        return schedule.backuprecovery(parameter)
    }
    scheduleJobflie = (parameter) => {
        return schedule.scheduleJobflie(parameter)
    }

    /**
     * 算法类
     */
    returnMenu = (parameter) => {
        return algorithm.returnMenu(parameter)
    }

    existsSync = (parameter) => {
        return algorithm.existsSync(parameter)
    }

    /**
     * 数据
     */
    moveConfig = (parameter) => {
        return createdata.moveConfig(parameter)
    }

    /**
     * 你的地址,要选择的box地址,操作表名
     * @param {PATH, CHOICE, NAME} parameter 
     * @returns 
     */
    addListArr = async (parameter) => {
        return await dataIndex.addListArr(parameter)
    }


}
export default new GameApi()