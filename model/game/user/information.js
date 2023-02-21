import gameUser from './index.js'
import listdata from '../data/listdata.js'
class information {
    /**
     * @param { UID } param0 
     * @returns 
     */
    userDataShow = async ({ UID }) => {
        const player = await listdata.listAction({ NAME: UID, CHOICE: 'user_player' })
        const equipment = await listdata.listAction({ NAME: UID, CHOICE: 'user_equipment' })
        const talent = await listdata.listAction({ NAME: UID, CHOICE: 'user_talent' })
        const level = await listdata.listAction({ NAME: UID, CHOICE: 'user_level' })
        const battle = await listdata.listAction({ NAME: UID, CHOICE: 'user_battle' })
        const linggenname = await gameUser.getTalentName({ data: talent })
        let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
        life = life.find(item => item.qq == UID)
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
        return {
            path: 'user/information',
            name: 'information',
            data: {
                user_id: UID,
                life: life,
                player: player,
                level: level,
                linggenname: name,
                battle: battle,
                equipment: equipment,
                talent: talent,
                talentsize: size
            }
        }
    }
    userEquipmentShow = async ({ UID }) => {
        const battle = await listdata.listAction({ NAME: UID, CHOICE: 'user_battle' })
        const equipment = await listdata.listAction({ NAME: UID, CHOICE: 'user_equipment' })
        //tudo
        let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
        life = life.find(item => item.qq == UID)
        return {
            path: 'user/equipment',
            name: 'equipment',
            data: {
                user_id: UID,
                battle: battle,
                life: life,
                equipment: equipment
            }
        }
    }
    userBagShow = async ({ UID }) => {
        let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
        life = life.find(item => item.qq == UID)
        const player = await listdata.listAction({ NAME: UID, CHOICE: 'user_player' })
        const battle = await listdata.listAction({ NAME: UID, CHOICE: 'user_battle' })
        const najie = await listdata.listAction({ NAME: UID, CHOICE: 'user_bag' })
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
        return {
            path: 'user/bag',
            name: 'bag',
            data: {
                user_id: UID,
                player: player,
                life: life,
                battle: battle,
                najie: najie,
                thing: thing_list,
                daoju_list: daoju_list,
                danyao_list: danyao_list
            }
        }
    }
}
export default new information()