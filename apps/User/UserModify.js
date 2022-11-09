
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import {
     __PATH, Write_player, Go, GenerateCD,Read_player, 
    Read_wealth, Write_Life, Read_Life, Add_lingshi} from '../Xiuxian/Xiuxian.js'
export class UserModify extends plugin {
    constructor() {
        super({
            name: 'UserModify',
            dsc: 'UserModify',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#改名.*$',
                    fnc: 'Change_name'
                },
                {
                    reg: '^#设置道宣.*$',
                    fnc: 'Change_autograph'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //改名
    async Change_name(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let lingshi = 5;
        let new_name = e.msg.replace("#改名", '');
        if (new_name.length == 0) {
            e.reply("请输入正确名字");
            return;
        }
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼'];
        name.forEach((item)=>{
            new_name = new_name.replace(item, '');
        })
        if (new_name.length > 8) {
            e.reply("玩家名字最多八字");
            return;
        }
        let wealth = await Read_wealth(usr_qq);
        if (wealth.lingshi < lingshi) {
            e.reply("需" + lingshi + "灵石");
            return;
        }
        let CDid = "3";
        let now_time = new Date().getTime();
        let CDTime = 24*60;//单位：分
        let CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq +':'+ CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid, CDTime*60);
        await Add_lingshi(usr_qq,-lingshi);
        let life = await Read_Life();
        life.forEach((item)=>{
            if(item.qq==usr_qq){
                item.name=new_name;
            }
        });
        await Write_Life(life);
        this.Show_player(e);
        return;
    }


    //设置道宣
    async Change_autograph(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let new_msg = e.msg.replace("#设置道宣", '');
        new_msg = new_msg.replace(" ", '');
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼'];
        name.forEach((item)=>{
            new_msg = new_msg.replace(item, '');
        })
        if (new_msg.length == 0) {
            return;
        }
        else if (new_msg.length > 50) {
            e.reply("道宣最多50字符");
            return;
        }
        let CDid = "4";
        let now_time = new Date().getTime();
        let CDTime = this.xiuxianConfigData.CD.autograph;
        let CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ':'+CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid, CDTime*60);
        player.autograph = new_msg;
        await Write_player(usr_qq, player);
        this.Show_player(e);
        return;
    }
}