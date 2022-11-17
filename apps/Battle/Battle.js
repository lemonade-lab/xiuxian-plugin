import plugin from '../../../../lib/plugins/plugin.js';
import { Go,GenerateCD,__PATH,At,battle,interactive,distance,Read_equipment,Anyarray,Write_equipment,Read_najie,Add_najie_thing, Write_najie } from '../Xiuxian/Xiuxian.js';
export class Battle extends plugin {
    constructor() {
        super({
            name: 'Battle',
            dsc: 'Battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#攻击.*$',
                    fnc: 'Attack'
                }
            ]
        });
    };
    async Attack(e) {
        const good=await Go(e);
        if (!good) {
            return;
        };
        let A = e.user_id;
        let B = await At(e);
        if(B==0||B==A){
            return;
        };
        const CDid = "0";
        const now_time = new Date().getTime();
        const CDTime = 5;
        const CD = await GenerateCD(A, CDid);
        if(CD != 0) {
            e.reply(CD);
        };
        let qq=0;
        if(await interactive(A,B)){
            qq=await battle(e,A, B);
        }
        if(qq==0){
            let h=await distance(A,B);
            e.reply("他离你"+Math.floor(h)+"千里！");
        }
        else{
            const p=Math.floor((Math.random() * (99-1)+1));
            if(p>80){
                if(qq!=A){
                    let C=A;
                    A=B;
                    B=C;
                }
                let equipment = await Read_equipment(B);
                if(equipment.length>0){
                let thing=await Anyarray(equipment);
                    equipment = equipment.filter(item => item.name != thing.name);
                await Write_equipment(B, equipment);
                let najie = await Read_najie(A);
                najie = await Add_najie_thing(najie, thing, 1);
                await Write_najie(A, najie);
                e.reply(A+"夺走了"+thing.name);
                }
            }
        }
        await redis.set("xiuxian:player:" + A + ':'+CDid, now_time);
        await redis.expire("xiuxian:player:" + A +':'+ CDid, CDTime*60);
        return;
    };
};