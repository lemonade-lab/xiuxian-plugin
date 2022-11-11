
import plugin from '../../../../lib/plugins/plugin.js'
import { __PATH,At , Numbers,Add_lingshi , Read_wealth,search_thing_name,
    Read_najie,Add_najie_thing,Write_najie } from '../Xiuxian/Xiuxian.js'
export class AdminMoney extends plugin {
    constructor() {
        super({
            name: "AdminMoney",
            dsc: "AdminMoney",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#扣除.*$',
                    fnc: 'Deduction'
                },
                {
                    reg: '^#补偿.*$',
                    fnc: 'Fuli'
                },
                {
                    reg: '^#馈赠.*$',
                    fnc: 'gifts'
                }
            ],
        });
    }

    async gifts(e){
        if (!e.isMaster) {
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        let thing_name = e.msg.replace("#馈赠", "");
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(usr_qq, najie);
        e.reply(B+"获得馈赠：" + thing_name);
        return;
    }

    
    async Deduction(e) {
        if (!e.isMaster) {
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        let lingshi = e.msg.replace("#扣除", "");
        lingshi = await Numbers(lingshi);
        let player = await Read_wealth(B);
        if (player.lingshi < lingshi) {
            e.reply("他好穷的");
            return;
        }
        if (player.lingshi == lingshi) {
            lingshi = lingshi - 1;
        }
        await Add_lingshi(B, -lingshi);
        e.reply("已扣除灵石" + lingshi);
        return;
    }



    //发补偿
    async Fuli(e) {
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#补偿", "");
        lingshi =await Numbers(lingshi);
        if(lingshi<1000){
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        await Add_lingshi(B, lingshi);
        e.reply(`${B}获得${lingshi}灵石的补偿`);
        return;
    }


}


