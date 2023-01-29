import gameUser from '../user/user.js'
class information {
    userDataShow = async ({ UID }) => {
        const player = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_player' })
        const equipment = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        const talent = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
        const level = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_level' })
        const battle = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        const linggenname = await gameUser.getTalentName({ data: talent })
        let life = await gameUser.userMsgAction({ NAME: 'life', CHOICE: 'user_life' })
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
        const battle = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        const equipment = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        //tudo
        let life = await gameUser.userMsgAction({ NAME: 'life', CHOICE: 'user_life' })
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
        let life = await gameUser.userMsgAction({ NAME: 'life', CHOICE: 'user_life' })
        life = life.find(item => item.qq == UID)
        const player = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_player' })
        const battle = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        const najie = await gameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
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