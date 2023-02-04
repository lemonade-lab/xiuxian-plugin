import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { GameApi } from '../../model/api/gameapi.js'
export class boxuserequipment extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#装备.*$',
                fnc: 'addEquipment'
            },
            {
                reg: '^#卸下.*$',
                fnc: 'deleteEquipment'
            }
            // ,
            // {
            //     reg: '^#炼制.*$',
            //     fnc: 'synthesis'
            // }
        ]))
    }

    synthesis = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        let msg = e.msg.replace('#炼制', '')
        msg = msg.trim();
        const materialList = msg.split("+");

        const materialA = await GameApi.GameUser.userMaterialSearch({ UID, name: materialList[0] })
        const materialB = await GameApi.GameUser.userMaterialSearch({ UID, name: materialList[1] })
        const materialC = await GameApi.GameUser.userMaterialSearch({ UID, name: materialList[2] })
        if (!materialA || !materialB || !materialC) {
            e.reply(`没有这种材料或者未指定材料品级`);
            return
        }
        //扣材料
        await GameApi.GameUser.userMaterial({ UID: UID, name: materialA.name, ACCOUNT: -1 })
        await GameApi.GameUser.userMaterial({ UID: UID, name: materialB.name, ACCOUNT: -1 })
        await GameApi.GameUser.userMaterial({ UID: UID, name: materialC.name, ACCOUNT: -1 })

        let ans ={
            "gold": 0,
            "wood": 0,
            "water": 0,
            "fire": 0,
            "earth": 0,
            "elixirPercent": 0,
            "equipPercent": 0,
        }
        ans.gold = materialA.gold+materialB.gold+materialC.gold;
        ans.wood = materialA.wood+materialB.wood+materialC.wood;
        ans.water = materialA.water+materialB.water+materialC.water;
        ans.fire = materialA.fire+materialB.fire+materialC.fire;
        ans.earth = materialA.earth+materialB.earth+materialC.earth;
        ans.elixirPercent = materialA.elixirPercent+materialB.elixirPercent+materialC.elixirPercent;
        ans.equipPercent = materialA.equipPercent+materialB.equipPercent+materialC.equipPercent;
        //成功率
        const quality = materialA.quality * materialB.quality * materialC.quality;
        const random = Math.random();
        if(random > quality){
            //失败
            e.reply(`boom!炼制失败,炸炉啦`)
            return ;
        }
        let resThing ;
        if(ans.elixirPercent >= 2*ans.equipPercent){
            //成丹
            resThing = await GameApi.GameUser.synthesisResult({ans : ans ,type :0})
        }else if(ans.equipPercent >= 2*ans.elixirPercent){
            //成器
            resThing = await GameApi.GameUser.synthesisResult({ans : ans ,type :1})
        }else {
            //烂
            e.reply(`材料的属性产生了冲突,不知道变成即无法成丹,也无法成器,你获得了无用的残渣`);
            await GameApi.GameUser.userBag({ UID: UID, name: '无用的残渣', ACCOUNT: 1 })
            return
        }
        e.reply(`炼制成功,你获得了${resThing.name}`);
        await GameApi.GameUser.userBag({ UID: UID, name: resThing.name, ACCOUNT: 1 })
        return
    }

    addEquipment = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#装备', '')
        const najie_thing = await GameApi.GameUser.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`没有${thing_name}`)
            return
        }
        const equipment = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        if (equipment.length >= GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' }).myconfig.equipment) {
            return
        }
        equipment.push(najie_thing)
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: -1 })
        await  GameApi.GameUser.readPanel({ UID })
        e.reply(`装备${thing_name}`)
        return
    }
    deleteEquipment = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#卸下', '')
        let equipment = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        const islearned = equipment.find(item => item.name == thing_name)
        if (!islearned) {
            return
        }
        const q = {
            "x": 0
        }
        equipment.forEach((item, index, arr) => {
            if (item.name == thing_name && q.x == 0) {
                q.x = 1
                arr.splice(index, 1)
            }
        })
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: 1 })
        await GameApi.GameUser.readPanel({ UID })
        e.reply(`已卸下${thing_name}`)
        return
    }
}