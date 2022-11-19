const alldata = [];
const name1 = ['麒麟', '狮', '鹏', '雕', '雀', '豹', '虎', '龟', '猫', '龙'];
//妖兽的等级
const name2 = ['兵', '将', '兽', '妖', '王兽', '大妖', '王', '皇', '帝', '神'];
class Cachemonster {
    constructor() {}
    async monsterscache(i) {
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
            alldata[i].label = time.getHours();
            for (var j = 0; j < 5; j++) {
                let y =  Math.trunc(Math.random() * ((i+2) * 2));
                y=y>9?9:y;
                await alldata[i].data.push({
                    name: name1[Math.trunc(Math.random() * 9)] + name2[y],
                    killNum : 1,
                    level: y + 1
                });
            };
            return alldata[i].data;
        }
        else{
            return alldata[i].data;
        };
    };
    /**
     * 提前加载
     * (7,6)   (7,3)  (3,0)   (4,4)  (1,6)   (2,3)
     * 极光0  朝阳1  兽台2  仙府3    灭仙4   雷鸣5
     */
    async monsters(a, b, c) {
        const x = Math.floor(a / 100);
        const y = Math.floor(b / 100);
        const z = Math.floor(c / 100);
        if (x == 7 && y == 6 && z == 0) {
            return 0;
        }
        else if (x == 1 && y == 6 && z == 0) {
            return 4;
        }
        else if (x == 4 && y == 4 && z == 0) {
            return 3;
        }
        else if (x == 7 && y == 3 && z == 0) {
            return 1;
        }
        else if (x == 2 && y == 3 && z == 0) {
            return 5;
        }
        else if (x == 3 && y == 0 && z == 0) {
            return 2;
        };
        return -1;
    };

    async addKillNum(i,name,num){
        let monList = [];
        if(num == 1){
            monList = alldata[i].data.map(item => {
                if(item.name == name){
                    item.killNum+=1;
                }
                return item;
            });
        }else {
            monList = alldata[i].data.map(item => {
                if(item.name == name){
                    item.killNum=1;
                }
                return item;
            });
        }
        alldata[i].data = monList;
        console.log(alldata[i].data);
        return ;
    };

};
export default new Cachemonster();