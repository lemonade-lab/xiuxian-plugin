import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 战斗类
 */
export class Battle extends plugin {
    constructor() {
        super({
            name: 'Battle',
            dsc: 'Battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#打劫$',
                    fnc: 'Dajie'
                },
                {
                    reg: '^#切磋$',
                    fnc: 'biwu'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //打劫
    async Dajie(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;
        let B = await Xiuxian.At(e);
        if(B==0||B==A){
            return;
        }
        let ClassCD = ":Dajie";
        let now_time = new Date().getTime();
        let CDTime = 15;
        let CD = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time);
        let Data_battle = await Xiuxian.battle(A,B);
        let msg = Data_battle.msg;

        if (msg.length > 30) {
            e.reply("战斗过程略...");
        } else {
            await Xiuxian.ForwardMsg(e, msg);
        }

        if(Data_battle.victory==A){
            let player = await Xiuxian.Read_player(B);
            let msg="你击败了对方";
            if(player.lingshi>=100){
                let lingshi=player.lingshi*0.5;
                lingshi=await Xiuxian.Numbers(lingshi);
                await Xiuxian.Add_lingshi(A,lingshi);
                await Xiuxian.Add_lingshi(B,-lingshi);
                msg=msg+"并夺走了他的"+lingshi+"灵石"
            }
            e.reply(msg+",魔力+2");
            await Xiuxian.Add_prestige(A, 2);
            await Xiuxian.Add_experiencemax(B, 500);
        }else{
            e.reply("你被对方打败了");
            await Xiuxian.Add_experiencemax(A, 500);
        }
        
        return;
    }


    //切磋
    async biwu(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;
        let B = await Xiuxian.At(e);
        if(B==0||B==A){
            return;
        }

        let ClassCD = ":biwu";
        let now_time = new Date().getTime();
        let CDTime = 5;
        let CD = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time);

        let Data_battle = await Xiuxian.battle(A,B);
        let msg = Data_battle.msg;
        if (msg.length >= 30) {
            e.reply("战斗过程略...");
        } 
        else {
            await Xiuxian.ForwardMsg(e, msg);
        }
        
        if(Data_battle.victory==A){
            e.reply("你击败了对手，对手增加了100气血");
            await Xiuxian.Add_experiencemax(B, 100);
        }else{
            e.reply("你被对方打败了，你增加了100气血！");
            await Xiuxian.Add_experiencemax(A, 100);
        }
        return;
    }

}




