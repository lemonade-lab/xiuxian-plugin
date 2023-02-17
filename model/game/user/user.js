import algorithm from '../data/algorithm.js'
import listdata from '../data/listaction.js'
import gamepublic from '../public/public.js'
import { __PATH } from '../data/index.js'
import config from '../data/defset/updata.js'
class GameUser {
    startLife = async () => {
        const life = await listdata.listActionArr({ NAME: 'life', CHOICE: 'user_life' })
        const die = []
        life.forEach((item) => {
            const cf = config.getConfig({ app: 'parameter', name: 'cooling' })
            item.Age = Number(cf['Age']['size'] ? cf['Age']['size'] : 1) + item.Age
            if (item.Age >= item.life) {
                item.status = 0
                die.push(item.qq)
            }
        })
        await this.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: life })
        for (let item of die) {
            await gamepublic.offAction({ UID: item })
        }
    }
    /**
     * @param { UID } param0 
     * @returns 
     */
    createBoxPlayer = async ({ UID }) => {
        await this.userMsgAction({
            NAME: UID, CHOICE: 'user_player', DATA: {
                'autograph': '无',//道宣
                'days': 0//签到
            }
        })
        const LevelList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'gaspractice' })
        const LevelMaxList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'bodypractice' })
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
        /**更新用户表*/
        await listdata.listActionArr({ CHOICE: 'user_life', NAME: 'life', DATA: life })
        /**更新装备*/
        await this.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: [] })
        /**更新天赋面板*/
        await this.updataUserEfficiency({ UID })
        /**更新战斗面板 */
        await this.readPanel({ UID })
        return true
    }

    /**
     * 给UID添加物品name的数量为account
     * @param { UID, name, ACCOUNT } param0 
     * @returns 
     */
    userBag = async ({ UID, name, ACCOUNT }) => {
        //搜索物品信息
        const thing = await listdata.searchThing({
            condition: 'name',
            name
        })
        if (thing) {
            let bag = await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID })
            bag = await this.userbagAction({
                BAG: bag, THING: thing, ACCOUNT: Number(ACCOUNT)
            })
            await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID, DATA: bag })
            return true
        }
        return false
    }

    /**
     * 材料仓库物品增减
     * @param { UID, name, ACCOUNT } param0
     * @returns
     */
    userMaterial = async ({ UID, name, ACCOUNT }) => {
        //搜索物品信息
        const thing = await listdata.searchThing(
            { CHOICE: 'fixed_material', NAME: 'MaterialGuide', condition: 'name', name })
        if (thing) {
            let bag = await this.userMsgAction({ CHOICE: 'user_material', NAME: UID })
            bag = await this.userMaterialAction({
                BAG: bag, THING: thing, ACCOUNT: Number(ACCOUNT)
            })
            await this.userMsgAction({ CHOICE: 'user_material', NAME: UID, DATA: bag })
            return true
        }
        return false
    }

    userMaterialAction = async (parameter) => {
        let { BAG, THING, ACCOUNT } = parameter
        const thing = BAG.find(item => item.id == THING.id)
        if (thing) {
            let acount = Number(thing.acount) + Number(ACCOUNT)
            if (Number(acount) < 1) {
                BAG = BAG.filter(item => item.id != THING.id)
            } else {
                BAG.find(item => item.id == THING.id).acount = Number(acount)
            }
            return BAG
        } else {
            THING.acount = Number(ACCOUNT)
            BAG.thing.push(THING)
            return BAG
        }


    }
    /**
     * 给储物袋添加物品
     * @param { BAG, THING, ACCOUNT } param0 
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
     * @param { UID, name } param0 
     * @returns 返回该物品
     */

    userBagSearch = async ({ UID, name }) => {
        const bag = await this.userMsgAction({ CHOICE: 'user_bag', NAME: UID })
        return bag.thing.find(item => item.name == name)
    }

    userMaterialSearch = async ({ UID, name }) => {
        const bag = await this.userMsgAction({ CHOICE: 'user_material', NAME: UID })
        return bag.find(item => item.name == name)
    }


    /**
     * @param { UID } param0 
     * @returns 返回UID的面板
     */ readPanel = async ({ UID }) => {
        const equipment = await this.userMsgAction({ CHOICE: 'user_equipment', NAME: UID })
        const level = await this.userMsgAction({ CHOICE: 'user_level', NAME: UID })
        const LevelList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'gaspractice' })
        const LevelMaxList = await listdata.listAction({ CHOICE: 'generate_level', NAME: 'bodypractice' })
        const levelmini = LevelList.find(item => item.id == level.level_id)
        const levelmax = LevelMaxList.find(item => item.id == level.levelmax_id)
        const UserBattle = await this.userMsgAction({ CHOICE: 'user_battle', NAME: UID })
        let extend = await listdata.listActionInitial({ NAME: UID, CHOICE: 'user_extend', INITIAL: {} })
        const panel = {
            attack: levelmini.attack + levelmax.attack,
            defense: levelmini.defense + levelmax.defense,
            blood: levelmini.blood + levelmax.blood,
            burst: levelmini.burst + levelmax.burst,
            burstmax: levelmini.burstmax + levelmax.burstmax,
            speed: levelmini.speed + levelmax.speed,
            power: 0
        }
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
        /*计算插件临时属性及永久属性*/
        if (extend != {}) {
            extend = Object.values(extend)
            extend.forEach((item) => {
                /*永久属性计算*/
                equ.attack = equ.attack + item["perpetual"].attack
                equ.defense = equ.defense + item["perpetual"].defense
                equ.blood = equ.blood + item["perpetual"].blood
                equ.burst = equ.burst + item["perpetual"].burst
                equ.burstmax = equ.burstmax + item["perpetual"].burstmax
                equ.speed = equ.speed + item["perpetual"].speed
                /*临时属性计算*/
                if (item["times"].length != 0) {
                    item["times"].forEach((timesitem) => {
                        if (timesitem.timeLimit > new Date().getTime()) {
                            equ[timesitem.type] += timesitem.value
                        }
                    })
                }
            })
        }
        /*血量上限 换装导致血量溢出时需要----------------计算错误:不能增加血量上限*/
        const bloodLimit = levelmini.blood + levelmax.blood + equ.blood
        /*双境界面板之和*/
        panel.attack = Math.floor(panel.attack * ((equ.attack * 0.01) + 1))
        panel.defense = Math.floor(panel.defense * ((equ.defense * 0.01) + 1))
        panel.blood = bloodLimit
        panel.nowblood = UserBattle.nowblood > bloodLimit ? bloodLimit : UserBattle.nowblood
        panel.burst += equ.burst
        panel.burstmax += equ.burstmax
        panel.speed += equ.speed
        panel.power = panel.attack + panel.defense + bloodLimit / 2 + panel.burst * 100 + panel.burstmax * 10 + panel.speed * 50
        await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle', DATA: panel })
        return
    }

    /**
     * 计算天赋
     * @param { UID } param0 
     * @returns 
     */
    updataUserEfficiency = async ({ UID }) => {
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
    * @param {灵根数据} data 
    * @returns 灵根天赋值
    */
    talentSize = async (data) => {
        let talent_size = 250
        /*根据灵根数来判断*/
        for (let i = 0; i < data.length; i++) {
            /*循环加效率*/
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
     * @returns 随机生成灵根
     */
    getTalent = async () => {
        const newtalent = []
        const talentacount = Math.round(Math.random() * (5 - 1)) + 1
        for (let i = 0; i < talentacount; i++) {
            const x = Math.round(Math.random() * (10 - 1)) + 1
            const y = newtalent.indexOf(x)
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
    /**
     * @param { data } param0 
     * @returns 
     */
    getTalentName = async ({ data }) => {
        const nameArr = []
        data.talent.forEach(async (talentitem) => {
            const talentList = await listdata.listAction({ NAME: 'talent_list', CHOICE: 'fixed_talent' })
            const name = talentList.find(item => item.id == talentitem).name
            nameArr.push(name)
        })
        return nameArr
    }

    /**
     * @param { NAME, CHOICE, DATA } param0 
     * @returns 若无数据输入则为读取操作，并返回数据
     */
    userMsgAction = async ({ NAME, CHOICE, DATA }) => {
        if (DATA) {
            await algorithm.dataAction({
                NAME,
                PATH: __PATH[CHOICE],
                DATA
            })
            return
        }
        return await algorithm.dataAction({
            NAME,
            PATH: __PATH[CHOICE]
        })
    }


    /**
     * 表名，地址，属性，大小
     * @param {UID, CHOICE, ATTRIBUTE, SIZE} param0 
     * @returns 
     */
    updataUser = async ({ UID, CHOICE, ATTRIBUTE, SIZE }) => {
        //读取原数据
        const data = await this.userMsgAction({ NAME: UID, CHOICE })
        data[ATTRIBUTE] += Math.trunc(SIZE)
        await this.userMsgAction({ NAME: UID, CHOICE, DATA: data })
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
    existUserSatus = async ({ UID }) => {
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


    getUID = async ({ UID }) => {
        let find = await this.existUser(UID)
        console.log(find)
        if (find) {
            return true
        }
        return false
    }


    /**
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

    getTypeThing = async (position, type) => {
        const dropsItemList = await listdata.listAction({ NAME: 'all', CHOICE: 'generate_all' })
        const sum = []
        dropsItemList.forEach((item) => {
            const id = item.id.split('-')
            if (id[position] == type) {
                sum.push(item)
            }
        })
        return sum
    }

    randomTypeThing = async (position, type) => {
        const dropsItemList = await listdata.listAction({ NAME: 'all', CHOICE: 'generate_all' })
        const sum = []
        dropsItemList.forEach((item) => {
            const id = item.id.split('-')
            if (id[position] == type) {
                sum.push(item)
            }
        })
        return sum[Math.floor(Math.random() * sum.length)]
    }

    randomThing = async () => {
        const dropsItemList = await listdata.listAction({ NAME: 'dropsItem', CHOICE: 'generate_all' })
        return dropsItemList[Math.floor(Math.random() * dropsItemList.length)]
    }

    updataUserBlood = async ({ UID, SIZE }) => {
        const battle = await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        battle.nowblood = Math.floor(battle.blood * SIZE * 0.01)
        await await this.userMsgAction({ NAME: UID, CHOICE: 'user_battle', DATA: battle })
        return
    }

    /**
     * @param { NAME, FLAG, TYPE, VALUE } param0 
     * @returns 
     */
    addExtendPerpetual = async ({ NAME, FLAG, TYPE, VALUE }) => {
        const extend = await listdata.listActionInitial({ NAME, CHOICE: 'user_extend', INITIAL: {} })
        if (!extend[FLAG]) {
            extend[FLAG] = {
                "times": [],
                "perpetual": {
                    "attack": 0,
                    "defense": 0,
                    "blood": 0,
                    "burst": 0,
                    "burstmax": 0,
                    "speed": 0,
                    "efficiency": 0
                }
            }
        }
        extend[FLAG]['perpetual'][TYPE] = VALUE
        await this.userMsgAction({ NAME, CHOICE: 'user_extend', DATA: extend })
        await this.readPanel({ UID: NAME })
        return
    }
    /**
     * @param { NAME, FLAG, TYPE, VALUE, ENDTIME } param0 
     * @returns 
     */
    addExtendTimes = async ({ NAME, FLAG, TYPE, VALUE, ENDTIME }) => {
        const extend = await listdata.listActionInitial({ NAME, CHOICE: 'user_extend', INITIAL: {} })
        if (!extend[FLAG]) {
            extend[FLAG] = {
                "times": [],
                "perpetual": {
                    "attack": 0,
                    "defense": 0,
                    "blood": 0,
                    "burst": 0,
                    "burstmax": 0,
                    "speed": 0,
                    "efficiency": 0
                }
            }
        }
        const find = extend[FLAG]['times'].findIndex(item => item.type == TYPE)
        const time = new Date().getTime()
        if (find != -1 && extend[FLAG]['times'][find]['timeLimit'] > time && extend[FLAG]['times'][find]['value'] >= VALUE) {
            await this.userMsgAction({ NAME, CHOICE: 'user_extend', DATA: extend })
            await this.readPanel({ UID: NAME })
            return
        } else if (find != -1 && (extend[FLAG]['times'][find]['timeLimit'] <= time || extend[FLAG]['times'][find]['value'] < VALUE)) {
            extend[FLAG]['times'][find]['value'] = VALUE
            extend[FLAG]['times'][find]['timeLimit'] = ENDTIME
            await this.userMsgAction({ NAME, CHOICE: 'user_extend', DATA: extend })
            await this.readPanel({ UID: NAME })
            return
        } else {
            extend[FLAG]['times'].push({
                "type": TYPE,
                "value": VALUE,
                "timeLimit": ENDTIME
            })
            await this.userMsgAction({ NAME, CHOICE: 'user_extend', DATA: extend })
            await this.readPanel({ UID: NAME })
            return
        }
    }

    synthesisResult = async ({ ans, type }) => {
        //这里可以写成返回对象，物品+msg，来给炼制增加不同的过程反馈
        let drawingList = await listdata.listAction({ NAME: 'AllDrawing', CHOICE: 'fixed_material' });
        drawingList = drawingList.filter(item => item.type == type && item.gold <= ans.gold && item.wood <= ans.wood && item.water <= ans.water && item.fire <= ans.fire && item.earth <= ans.earth);

        if (drawingList.length == 0) {
            // 没有对应图纸
            const res = { name: "无用的残渣" };
            return res;
        } else if (drawingList.length > 3) {
            // 可能的结果过多，取三个最好的
            drawingList.sort(sortRule);
            const slice = drawingList.slice(0, 3);
            //随机取一个
            return randomArr(slice);
        } else {
            //直接随机取
            return randomArr(drawingList);
        }
    }


}

function sortRule(a, b) {
    return a.rank - b.rank; // 如果a>=b，返回自然数，不用交换位置
}

function randomArr(array) {
    const location = Math.floor(Math.random() * array.length);
    return array[location];
}
export default new GameUser()