import algorithm from '../data/algorithm.js'
import listdata from '../data/listaction.js'
import gamepublic from '../public/public.js'
import { __PATH } from '../data/index.js'
import NodeJs from '../../node/node.js'
import config from '../data/defset/updata.js'
class GameUser {
    constructor() {
        /**
         * 寿命机制
         */
        NodeJs.returnSchedele().scheduleJob(config.getConfig({ app: 'task', name: 'task' }).LifeTask, async () => {
            const life = await listdata.listActionArr({ NAME: 'life', CHOICE: 'user_life' })
            const die = []
            life.forEach((item) => {
                item.Age = item.Age + config.getConfig({ app: 'parameter', name: 'cooling' }).Age.size
                if (item.Age >= item.life) {
                    item.status = 0
                    die.push(item.qq)
                }
            })
            await gameApi.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: life })
            for (let item of die) {
                await gamepublic.offAction({ UID: item })
            }
        })
    }
    /**
    * @param {UID} UID 
    * @returns 初始化数据，不成功则false
    */
    createBoxPlayer = async (parameter) => {
        const { UID } = parameter
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_player', DATA: {
                'autograph': '无',//道宣
                'days': 0//签到
            }
        })
        const LevelList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'Level_list' })
        const LevelMaxList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'LevelMax_list' })
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_battle', DATA: {
                'nowblood': LevelList.find(item => item.id == 1).blood + LevelMaxList.find(item => item.id == 1).blood,//血量
            }
        })
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_level', DATA: {
                'prestige': 0,//魔力
                'level_id': 1,//练气境界
                'levelname': LevelList.find(item => item.id == 1).name,//练气名
                'experience': 1,//练气经验
                'levelmax_id': 1,//练体境界
                'levelnamemax': LevelMaxList.find(item => item.id == 1).name,//练体名
                'experiencemax': 1,//练体经验
                'rank_id': 0,//数组位置
                'rankmax_id': 0//数组位置
            }
        })
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_wealth', DATA: {
                'lingshi': 0,
                'xianshi': 0
            }
        })
        const PosirionList = await listdata.listAction({ CHOICE: 'generate_position', NAME: 'position' })
        const position = PosirionList.find(item => item.name == '极西')
        const positionID = position.id.split('-')
        const coordinate = {
            mx: Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1),
            my: Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1)
        }
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_action', DATA: {
                'game': 1,//游戏状态
                'Couple': 1, //双修
                'newnoe': 1, //新人
                'x': coordinate.mx,
                'y': coordinate.my,
                'z': positionID[0],//位面 
                'region': positionID[1],//区域
                'address': positionID[2],//属性
                'Exchange': 0
            }
        })
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_bag', DATA: {
                'grade': 1,
                'lingshimax': 50000,  //废弃
                'lingshi': 0,  //废弃
                'thing': []
            }
        })
        const newtalent = await this.getTalent()
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_talent', DATA: {
                'talent': newtalent,//灵根
                'talentshow': 1,//显示0,隐藏1
                'talentsize': 0,//天赋
                'AllSorcery': []//功法
            }
        })
        const FullName = {
            'full': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            'name': ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        }
        const name = await gamepublic.Anyarray({ ARR: FullName['full'] }) + await gamepublic.Anyarray({ ARR: FullName['name'] })
        const life = await listdata.listActionArr({ CHOICE: 'user_life', NAME: 'life' })
        life.push({
            'qq': UID,
            'name': `${name}`,
            'Age': 1,//年龄
            'life': Math.floor((Math.random() * (84 - 60) + 60)), //寿命
            'createTime': new Date().getTime(),
            'status': 1
        })
        await this.userMsgAction({ NAME: UID, CHOICE: 'user_extend', DATA: {} })
        /**
         * 更新用户表
         */
        await listdata.listActionArr({ CHOICE: 'user_life', NAME: 'life', DATA: life })
        /**
         * 更新装备
         */
        await this.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: [] })
        /**
         * 更新天赋面板
         */
        await this.updataUserEfficiency({ UID })
        /**
         * 更新战斗面板
         */
        await this.readPanel({ UID })
        return true
    }

    /**
     * 给UID添加物品name的数量为account
     * @param {UID} UID 
     * @param {物品名} name 
     * @param {数量} ACOUNT  account
     * @returns 
     */
    userBag = async (parameter) => {
        const { UID, name, ACCOUNT } = parameter
        //搜索物品信息
        const thing = await listdata.searchThing({
            condition: 'name',
            name: name
        })
        if (thing) {
            let bag = await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID })
            bag = await this.userbagAction({
                BAG: bag, THING: thing, ACCOUNT
            })
            await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID, DATA: bag })
            return true
        }
        return false
    }

    /**
     * 给储物袋添加物品
     * @param {用户的背包} BAG 
     * @param {物品资料} THING 
     * @param {数量} ACCOUNT 
     * @returns 
     */
    userbagAction = async (parameter) => {
        const { BAG, THING, ACCOUNT } = parameter
        const thing = BAG.thing.find(item => item.id == THING.id)
        if (thing) {
            let acount = Number(thing.acount) + Number(ACCOUNT)
            if (Number(acount) < 1) {
                BAG.thing = BAG.thing.filter(item => item.id != THING.id)
            } else {
                BAG.thing.find(item => item.id == THING.id).acount = Number(acount)
            }
            return BAG
        } else {
            THING.acount = Number(ACCOUNT)
            BAG.thing.push(THING)
            return BAG
        }
    }


    /**
     * 搜索UID的背包有没有物品名为NAME
     * @param {UID} UID 
     * @param {物品名} name 
     * @returns 返回该物品
     */

    userBagSearch = async (parameter) => {
        const { UID, name } = parameter
        const bag = await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID })
        return bag.thing.find(item => item.name == name)
    }


    /**
     * @param {*} UID 
     * @returns 返回UID的面板
     */ readPanel = async (parameter) => {
        const { UID } = parameter
        const equipment = await this.userMsgAction({ CHOICE: 'user_equipment', NAME: UID })
        const level = await this.userMsgAction({ CHOICE: 'user_level', NAME: UID })
        const LevelList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'Level_list' })
        const LevelMaxList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'LevelMax_list' })
        const levelmini = LevelList.find(item => item.id == level.level_id)
        const levelmax = LevelMaxList.find(item => item.id == level.levelmax_id)
        const UserBattle = await this.userMsgAction({ CHOICE: 'user_battle', NAME: UID })
        let extend = await this.userMsgAction({ CHOICE: 'user_extend', NAME: UID })
        const panel = {
            attack: levelmini.attack + levelmax.attack,
            defense: levelmini.defense + levelmax.defense,
            blood: levelmini.blood + levelmax.blood,
            burst: levelmini.burst + levelmax.burst,
            burstmax: levelmini.burstmax + levelmax.burstmax,
            speed: levelmini.speed + levelmax.speed,
            power: 0
        }
        //计算装备倍化
        const equ = {
            attack: 0,
            defense: 0,
            blood: 0,
            burst: 0,
            burstmax: 0,
            speed: 0,
        }
        equipment.forEach((item) => {
            equ.attack = equ.attack + item.attack
            equ.defense = equ.defense + item.defense
            equ.blood = equ.blood + item.blood
            equ.burst = equ.burst + item.burst
            equ.burstmax = equ.burstmax + item.burstmax
            equ.speed = equ.speed + item.speed
        })
        //计算插件临时属性及永久属性
        extend = Object.values(extend)
        extend.forEach((item) => {
            //永久属性计算
            equ.attack = equ.attack + item["perpetual"].attack
            equ.defense = equ.defense + item["perpetual"].defense
            equ.blood = equ.blood + item["perpetual"].blood
            equ.burst = equ.burst + item["perpetual"].burst
            equ.burstmax = equ.burstmax + item["perpetual"].burstmax
            equ.speed = equ.speed + item["perpetual"].speed
            //临时属性计算
            item["times"].forEach((timesitem) => {
                if (item["times"][timesitem].timeLimit > new Date().getTime()) {
                    equ[item["times"][timesitem].type] += item["times"][timesitem].value
                }
            })
        })
        //血量上限 换装导致血量溢出时需要
        const bloodLimit = levelmini.blood + levelmax.blood + Math.floor((levelmini.blood + levelmax.blood) * equ.blood * 0.01)
        //双境界面板之和
        panel.attack = Math.floor(panel.attack * ((equ.attack * 0.01) + 1))
        panel.defense = Math.floor(panel.defense * ((equ.defense * 0.01) + 1))
        panel.blood = bloodLimit
        panel.nowblood = UserBattle.nowblood > bloodLimit ? bloodLimit : UserBattle.nowblood
        panel.burst += equ.burst
        panel.burstmax += equ.burstmax
        panel.speed += equ.speed
        panel.power = panel.attack + panel.defense + bloodLimit / 2 + panel.burst * 100 + panel.burstmax * 10 + panel.speed * 50
        //不是返回,而是直接写入
        await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle', DATA: panel })
        return
    }

    /**
     * 计算天赋
     * @param {} UID 
     * @returns 
     */
    updataUserEfficiency = async (parameter) => {
        const { UID } = parameter
        try {
            const talent = await this.userMsgAction({
                NAME: UID,
                CHOICE: 'user_talent'
            })
            const talent_sise = {
                'gonfa': 0,
                'talent': 0
            }
            talent.AllSorcery.forEach((item) => {
                talent_sise.gonfa += item.size
            })
            talent_sise.talent = await this.talentSize(talent)
            let promise = await this.userMsgAction({
                NAME: UID,
                CHOICE: 'user_extend'
            })
            promise = Object.values(promise)
            let extend = 0
            for (let i in promise) {
                extend += (promise[i].perpetual.efficiency * 100)
            }
            talent.talentsize = talent_sise.talent + talent_sise.gonfa + extend
            await this.userMsgAction({
                NAME: UID,
                CHOICE: 'user_talent',
                DATA: talent
            })
            return true
        } catch {
            return false
        }
    }


    /**
    * 
    * @param {灵根数据} data 
    * @returns 灵根天赋值
    */
    talentSize = async (data) => {
        let talent_size = 250
        //根据灵根数来判断
        for (let i = 0; i < data.length; i++) {
            //循环加效率
            if (data[i] <= 5) {
                talent_size -= 50
            }
            if (data[i] >= 6) {
                talent_size -= 40
            }
        }
        return talent_size
    }

    /**
     * 
     * @returns 随机生成灵根
     */
    getTalent = async () => {
        //存储灵根
        const newtalent = []
        //初始灵根数
        const talentacount = Math.round(Math.random() * (5 - 1)) + 1
        for (let i = 0; i < talentacount; i++) {
            const x = Math.round(Math.random() * (10 - 1)) + 1
            const y = newtalent.indexOf(x)
            //删减灵根
            if (y != -1) {
                continue
            }
            if (x <= 5) {
                const z = newtalent.indexOf(x + 5)
                if (z != -1) {
                    continue
                }
            } else {
                const z = newtalent.indexOf(x - 5)
                if (z != -1) {
                    continue
                }
            }
            newtalent.push(x)
        }
        return newtalent
    }

    getTalentName = async (parameter) => {
        const { data } = parameter
        const nameArr = []
        data.talent.forEach(async (talentitem) => {
            const talentList = await listdata.listAction({ NAME: 'talent_list', CHOICE: 'fixed_talent' })
            const name = talentList.find(item => item.id == talentitem).name
            nameArr.push(name)
        })
        return nameArr
    }





    /**
     * @param {UID} UID 
     * @param {物品名} name 
     * @returns 若背包存在即返回物品信息,若不存在则undifind
     */
    returnUserBagName = async (NAME, THING_NAME) => {
        const bag = await this.userMsgAction({
            NAME: NAME,
            CHOICE: 'user_bag'
        })
        return bag.thing.find(item => item.name == THING_NAME)
    }


    /**
     * @param {UID} UID 
     * @param {地址选择} CHOICE 
     * @param {数据} DATA 
     * @returns 若无数据输入则为读取操作，并返回数据
     */
    userMsgAction = async (parameter) => {
        const { NAME, CHOICE, DATA } = parameter
        if (DATA) {
            await algorithm.dataAction({
                NAME: NAME,
                PATH: __PATH[CHOICE],
                DATA: DATA
            })
            return
        }
        return await algorithm.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE]
        })
    }


    /**
     * 表名，地址，属性，大小
     * @param {UID, CHOICE, ATTRIBUTE, SIZE} parameter 
     * @returns 
     */
    updataUser = async (parameter) => {
        const { UID, CHOICE, ATTRIBUTE, SIZE } = parameter
        //读取原数据
        const data = await this.userMsgAction({ NAME: UID, CHOICE: CHOICE })
        data[ATTRIBUTE] += Math.trunc(SIZE)
        await this.userMsgAction({ NAME: UID, CHOICE: CHOICE, DATA: data })
        return
    }


    /**
     * 返回UID的寿命信息
     * @param {UID} UID 
     * @returns 不存在则undifind
     */
    existUser = async (UID) => {
        const LIFE = await listdata.listActionArr({ CHOICE: 'user_life', NAME: 'life' })
        return LIFE.find(item => item.qq == UID)
    }

    /**
     * 判断是否死亡
     * @param {UID} UID 
     * @returns 
     */
    existUserSatus = async (parameter) => {
        const { UID } = parameter
        let find = await this.existUser(UID)
        if (find) {
            if (find.status == 0) {
                return false
            }
            return true
        }
        const CreateGO = await this.createBoxPlayer({ UID })
        if (!CreateGO) {
            return false
        }
        return true
    }


    /**
     * 
     * @returns 返回所有用户UID
     */
    getUserUID = async () => {
        const playerList = []
        const life = await listdata.listActionArr({ CHOICE: 'user_life', NAME: 'life' })
        life.forEach((item) => {
            playerList.push(item.qq)
        })
        return playerList
    }

    randomThing = async () => {
        const dropsItemList = await listdata.listAction({ NAME: 'dropsItem', CHOICE: 'generate_all' })
        return dropsItemList[Math.floor(Math.random() * dropsItemList.length)]
    }

    updataUserBlood = async (parameter) => {
        const { UID, SIZE } = parameter
        const battle = await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        battle.nowblood = Math.floor(battle.blood * SIZE * 0.01)
        await await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle', DATA: battle })
        return
    }

}
export default new GameUser()