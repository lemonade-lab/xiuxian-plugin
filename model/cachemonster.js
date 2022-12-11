const alldata = [];
const addall = [];
const name1 = ['蜥', '狮', '鹏', '雕', '雀', '豹', '虎', '龟', '猫', '龙','鲲','鸡','蛇','狼','鼠','鹿','貂','猴','狗','熊','羊','牛','象','兔','猪'];
const name2 = ['兵', '将', '兽', '魔', '妖', '大妖', '王', '皇', '帝', '神'];
class Cachemonster {
    constructor() { }; monsterscache = async (i) => {
        while (true) {
            if (alldata.length <= i) {
                alldata.push({
                    label: 24,
                    data: [],
                });
            }
            else {
                break;
            };
        };
        const time = new Date();
        if (time.getHours() != alldata[i].label) {
            const map={
                '1':'1.1',
                '2':'1.1',
                '3':'1.1',
                '4':'1.1',
                '5':'1.1',
                '6':'2.6',
                '7':'2.6',
                '8':'2.6',
                '9':'2.6',
                '10':'8.10',
                '11':'8.10',
                '12':'1.3',
                '13':'1.3',
                '14':'1.3',
                '15':'1.3',
                '16':'1.3',
                '17':'5.8',
                '18':'5.8',
                '19':'5.8',
                '20':'5.8',
            };
            const [mini,max]=map[i].split('.');
            alldata[i].label = time.getHours();
            //清空前一个怪物数据
            alldata[i].data=[];
            for (var j = 0; j < max; j++) {
                let y = Math.floor(Math.random() * (max - mini+1) + mini);
                await alldata[i].data.push({
                    name: name1[Math.floor(Math.random() * 25)] + name2[y-1],
                    killNum: 1,
                    level: y
                });
            };
            return alldata[i].data;
        }
        else {
            return alldata[i].data;
        };
    };
    add = async (i, num) => {
        while (true) {
            if (addall.length <= i) {
                addall.push({
                    acount: 0,
                });
            }
            else {
                break;
            };
        };
        addall[i].acount += num;
        const p = Math.floor((Math.random() * (50 - 30))) + Number(30);
        if (addall[i].acount > p) {
            addall[i].acount = 0;
            return 1;
        };
        return 0;
    };
};
export default new Cachemonster();