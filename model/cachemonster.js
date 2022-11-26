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
            let mini = 0;
            let max = 0;
            if (i > 6 &&i <= 9) {
                //是秘境 2-6：秘境是特殊的,有特殊奖励
                mini = 2;
                max = 6;
            }
            else if (i > 9 && i <= 11) {
                //禁地  8-10
                mini = 8;
                max = 10;
            }
            else if (i > 11 && i <= 16) {
                //荒地  1-3
                mini = 1;
                max = 3;
            } else if (i > 16 && i <= 20) {
                //海域  5-8
                mini = 5;
                max = 8;
            } else {
                //城里,分配一级怪
                mini = 1;
                max = 1;
            };
            alldata[i].label = time.getHours();
            //怪物数量
            alldata[i].data=[];
            for (var j = 0; j < max; j++) {
                let y = Math.floor(Math.random() * (max - mini+1) + mini);
                await alldata[i].data.push({
                    //怪名
                    name: name1[Math.floor(Math.random() * 25)] + name2[y-1],
                    //累计  
                    killNum: 1,
                    //境界
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