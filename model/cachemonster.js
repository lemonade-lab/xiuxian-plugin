const alldata = {}
const addall = {}
const name1 = ['蜥', '狮', '鹏', '雕', '雀', '豹', '虎', '龟', '猫', '龙', '鲲', '鸡', '蛇', '狼', '鼠', '鹿', '貂', '猴', '狗', '熊', '羊', '牛', '象', '兔', '猪']
const name2 = ['兵', '将', '兽', '魔', '妖', '大妖', '王', '皇', '帝', '神']
class Cachemonster {
    constructor() { }
    monsterscache = async (i) => {
        if (!alldata.hasOwnProperty(i)) {
            console.log('不存在')
            alldata[i] = {
                'label': 99,
                'data': []
            }
        }
        //看看现在就时间
        const time = new Date()
        //不相等就需要委派怪物
        if (time.getHours() != alldata[i].label) {
            const data = await this.generateMonster(i)
            return data
        } else {
            //万一相等也没有怪物数据呢？
            if (alldata[i].data.length != 0) {
                return alldata[i].data
            }
            const data = await this.generateMonster(i)
            return data
        }
    }
    add = async (i, num) => {
        if (!addall.hasOwnProperty(i)) {
            addall[i] = {
                'acount': 0
            }
        }
        addall[i].acount += num
        const p = Math.floor((Math.random() * (50 - 30))) + Number(30)
        if (addall[i].acount > p) {
            addall[i].acount = 0
            return 1
        }
        return 0
    }
    generateMonster = async (i) => {
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
        //根据地图id来控制怪物范围
        const [mini, max] = map[i].split('.')
        alldata[i].label = time.getHours()
        //清空前一个怪物数据
        alldata[i].data = []
        for (var j = 0; j < max ;j++) {
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
export default new Cachemonster()