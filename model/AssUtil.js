import fs from "node:fs"
import Config from "./Config.js"
import path from "path"
import data from './XiuxianData.js'



/*
  数据封装
 */
let all = [];
class AssUtil {
    constructor() {
        //默认配置
        this.configData = Config.getdefSet("version", "version")
        //文件路径参数
        //插件根目录
        const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin"
        //修仙配置
        this.filePathMap = {
            //宗门数据
            "association": path.join(__dirname, "/resources/data/birth/Association/AssItem"),
            //用户的宗门数据
            "assPlayer": path.join(__dirname, "/resources/data/birth/Association/AssPlayer"),
            "assUncharted": path.join(__dirname, "/resources/data/birth/Association/AssUncharted"),
            "assRelation": path.join(__dirname, "/resources/data/birth/Association/AssRelation"),
            "assTreasureVault": path.join(__dirname, "/resources/data/birth/Association/AssTreasureVault"),
            "blessPlace": path.join(__dirname, "/resources/data/fixed/AssRelate"),
            "baseUncharted": path.join(__dirname, "/resources/data/fixed/AssRelate"),
            "baseTreasureVault": path.join(__dirname, "/resources/data/fixed/AssRelate"),
            "allAssProducts": path.join(__dirname, "/resources/data/fixed/AssRelate"),
            "all": path.join(__dirname, "/resources/data/birth/all")

        }

        //装备
        this.assPlayer = this.filePathMap.assPlayer;
        //物品
        this.association = this.filePathMap.association;
        this.assRelation = this.filePathMap.assRelation;
        this.assUncharted = this.filePathMap.assUncharted;
        this.assTreasureVault = this.filePathMap.assTreasureVault;
        this.blessPlace = this.filePathMap.blessPlace;
        this.baseUncharted = this.filePathMap.baseUncharted;
        this.baseTreasureVault = this.filePathMap.baseTreasureVault;
        this.allAssProducts = this.filePathMap.allAssProducts;
        this.all = this.filePathMap.all;
        this.blessPlaceList = JSON.parse(fs.readFileSync(`${this.blessPlace}/BlessPlace.json`));
        this.baseUnchartedList = JSON.parse(fs.readFileSync(`${this.baseUncharted}/BaseUncharted.json`));
        this.baseTreasureVaultList = JSON.parse(fs.readFileSync(`${this.baseTreasureVault}/BaseTreasureVault.json`));
        this.assRelationList = JSON.parse(fs.readFileSync(`${this.assRelation}/AssRelation.json`));
        this.allAssProductsList = JSON.parse(fs.readFileSync(`${this.allAssProducts}/AllAssProducts.json`));
        this.allList = JSON.parse(fs.readFileSync(`${this.all}/all.json`));

        data.list(this.allList, all, 99);
        data.list(this.allAssProductsList, all, 99);
        data.add(all, 'all');
    }


    /**
     * 检测宗门存档或用户宗门信息是否存在
     * @param file_path_type ["assPlayer" , "association" ]
     * @param file_name
     */
    existAss(file_path_type, file_name) {
        let file_path;
        file_path = this.filePathMap[file_path_type];
        let dir = path.join(file_path + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        }
        return false;
    }



    /**
     * 获取用户宗门信息或宗门存档
     * @param assName
     * @param user_qq
     */
    getAssOrPlayer(type,name) {
        let file_path;
        let dir;
        let data;
        if (type == 1) {
            file_path = this.filePathMap["assPlayer"];
            dir = path.join(file_path + '/' + name + '.json');
        } else if(type == 2){
            file_path = this.filePathMap["association"];
            dir = path.join(file_path + '/' + name + '.json');
        }else if (type == 3){
            file_path = this.filePathMap["assUncharted"];
            dir = path.join(file_path + '/' + name + '.json');
        }else {
            file_path = this.filePathMap["assTreasureVault"];
            dir = path.join(file_path + '/' + name + '.json');
        }

        try {
            data = fs.readFileSync(dir, 'utf8')
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return "error";
        }
        //将字符串数据转变成json格式
        data = JSON.parse(data);
        return data;
    }


    /**
     * 写入数据
     * @param file_name  ["assPlayer" , "association" ]
     * @param itemName
     * @param data
     */
    setAssOrPlayer(file_name, itemName, data) {
        let file_path;
        let dir;

        file_path = this.filePathMap[file_name];
        dir = path.join(file_path + '/' + itemName + '.json');

        let new_ARR = JSON.stringify(data, "", "\t");//json转string
        fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
            console.log('写入成功', err)
        })
        return;
    }

    assEffCount(assPlayer){
        let effective=0;
        if(assPlayer.assName == 0){
            assPlayer.effective=effective;
            this.setAssOrPlayer("assPlayer",assPlayer.qqNumber,assPlayer);
            return;
        }
        let ass = this.getAssOrPlayer(2,assPlayer.assName);

        if(ass.resident.id!=0){
            effective+=ass.resident.efficiency;
        }
        if(ass.facility[4].status!=0){
            effective+=ass.level * 0.05;
            effective+=ass.level * ass.resident.level * 0.01;
        }


        let coefficient = 0;
        let jobList=["宗主","长老","内门弟子","外门弟子","杂役"];
        let location = jobList.findIndex( item=> item == assPlayer.assJob);
        switch (location) {
            case 0:
                coefficient=1.5;
                break;
            case 1:
                coefficient=1.3;
                break;
            case 2:
                coefficient=1.1;
                break;
            case 3:
                coefficient=0.9;
                break;
            case 4:
                coefficient=0.7;
                break;
            default:
                coefficient=0.1;
                break;
        }

        effective=effective*coefficient;
        assPlayer.effective=effective.toFixed(2);
        this.setAssOrPlayer("assPlayer",assPlayer.qqNumber,assPlayer);
        return ;
    }

    async assRename(ass, type, association_name) {
        let assRelation = this.assRelationList;
        var find = assRelation.find(item => item.id == ass);
        var location = assRelation.findIndex(item => item.id == ass);
        if(type == 1){
            find.name = association_name;
        }else {
            find.unchartedName = association_name;
        }
        assRelation=assRelation.splice(location,1,find);


        let file_path = this.assRelation;
        let dir;

        dir = path.join(file_path + '/AssRelation.json');

        let new_ARR = JSON.stringify(assRelation, "", "\t");//json转string
        fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
            console.log('写入成功', err)
        })
        return;

    }


    async checkFacility(ass){
        if(ass.facility[0].buildNum > 100){
            ass.facility[0].status=1;
        }
        if(ass.facility[1].buildNum > 500){
            ass.facility[1].status=1;
        }

        if(ass.facility[2].buildNum > 500){
            ass.facility[2].status=1;
        }
        if(ass.facility[3].buildNum > 200){
            ass.facility[3].status=1;
        }

        if(ass.facility[4].buildNum > 200){
            ass.facility[4].status=1;
        }

        if(ass.facility[5].buildNum > 200){
            ass.facility[5].status=1;
        }
        if(ass.facility[6].buildNum > 300){
            ass.facility[6].status=1;
        }
        await this.setAssOrPlayer("association",ass.id,ass);
        return ;
    }

}

function isNotNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}

export default new AssUtil();
