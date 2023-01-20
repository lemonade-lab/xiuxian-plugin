const alldata = {}
const addall = {}
const name1 = ['蜥', '狮', '鹏', '雕', '雀', '豹', '虎', '龟', '猫', '龙', '鲲', '鸡', '蛇', '狼', '鼠', '鹿', '貂', '猴', '狗', '熊', '羊', '牛', '象', '兔', '猪']
const name2 = ['兵', '将', '兽', '魔', '妖', '大妖', '王', '皇', '帝', '神']
/**
 * 怪物生成
 */
class GameMonster {
    monsterscache = async (parameter) => {
        const { i } = parameter
        if (!alldata.hasOwnProperty(i)) {
            alldata[i] = {
                'label': 99,
                'data': []
            }
        }
        const time = new Date()
        if (time.getHours() != alldata[i].label) {
            const data = await this.generateMonster({ i })
            return data
        } else {
            if (alldata[i].data.length != 0) {
                return alldata[i].data
            }
            const data = await this.generateMonster({ i })
            return data
        }
    }
    add = async (parameter) => {
        const { i, num } = parameter
        if (!addall.hasOwnProperty(i)) {
            addall[i] = {
                'acount': 0
            }
        }
        addall[i].acount += num
        const p = Math.floor((Math.random() * (30 - 10))) + Number(10)
        if (addall[i].acount > p) {
            addall[i].acount = 0
            return 1
        }
        return 0
    }
    generateMonster = async (parameter) => {
        const { i } = parameter
        const time = new Date()
        const map = {
            '1': '1.3',
            '2': '1.4',
            '3': '2.5',
            '4': '3.6',
            '5': '4.6',
            '6': '5.7',
            '7': '1.3',
            '8': '5.8',
            '9': '5.8',
            '10': '5.8',
            '11': '5.9',
            '12': '2.5',
            '13': '7.10'
        }
        const [mini, max] = map[i].split('.')
        alldata[i].label = time.getHours()
        alldata[i].data = []
        for (var j = 0; j < max; j++) {
            let y = Math.floor(Math.random() * (max - mini + 1) + Number(mini))
            await alldata[i].data.push({
                name: name1[Math.floor(Math.random() * name1.length)] + name2[y - 1],
                killNum: 1,
                level: y
            })
        }
        return alldata[i].data
    }
}
export default new GameMonster()