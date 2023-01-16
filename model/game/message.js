import { talentname, Read_battle, Read_player, Read_wealth, Read_talent, Read_equipment, Read_level, Read_najie, Read_Life, existplayer } from '../public.js'
import { showPuppeteer } from '../robot/show.js'
class Message {
    get_player_img = async (uid) => {
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const player = await Read_player(uid)
        const wealt = await Read_wealth(uid)
        const equipment = await Read_equipment(uid)
        const talent = await Read_talent(uid)
        const level = await Read_level(uid)
        const battle = await Read_battle(uid)
        const linggenname = await talentname(talent)
        let life = await Read_Life()
        life = life.find(item => item.qq == uid)
        let name = ''
        for (var i = 0; i < linggenname.length; i++) {
            name = name + linggenname[i]
        }
        let size = Math.trunc(talent.talentsize)
        if (await talent.talentshow != 0) {
            size = '未知'
            name = '未知'
        } else {
            size = `+${size}%`
        }
        const myData = {
            user_id: uid,
            life: life,
            player: player,
            level: level,
            linggenname: name,
            battle: battle,
            equipment: equipment,
            lingshi: Math.trunc(wealt.lingshi),
            xianshi: Math.trunc(wealt.xianshi),
            talent: talent,
            talentsize: size
        }
        return await showPuppeteer('user/information', 'information', myData)
    }
    get_equipment_img = async (uid) => {
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const battle = await Read_battle(uid)
        const equipment = await Read_equipment(uid)
        let life = await Read_Life()
        life = life.find(item => item.qq == uid)
        const myData = {
            user_id: uid,
            battle: battle,
            life: life,
            equipment: equipment
        }
        return await showPuppeteer('user/equipment', 'equipment', myData)
    }
    get_najie_img = async (uid) => {
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        let life = await Read_Life()
        life = life.find(item => item.qq == uid)
        const player = await Read_player(uid)
        const battle = await Read_battle(uid)
        const najie = await Read_najie(uid)
        const thing = najie.thing
        const thing_list = []
        const danyao_list = []
        const daoju_list = []
        thing.forEach((item) => {
            let id = item.id.split('-')
            switch (id[0]) {
                case '4': {
                    danyao_list.push(item)
                    break
                }
                case '6': {
                    daoju_list.push(item)
                    break
                }
                default: {
                    thing_list.push(item)
                    break
                }
            }
        })
        const myData = {
            user_id: uid,
            player: player,
            life: life,
            battle: battle,
            najie: najie,
            thing: thing_list,
            daoju_list: daoju_list,
            danyao_list: danyao_list
        }
        return await showPuppeteer('user/bag', 'bag', myData)
    }
}
module.exports = new Message()