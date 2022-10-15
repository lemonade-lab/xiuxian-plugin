//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 秘境模块
 */
export class SecretPlace extends plugin {
    constructor() {
        super({
            name: 'SecretPlace',
            dsc: 'SecretPlace',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙状态$',
                    fnc: 'Xiuxianstate'
                },
                {
                    reg: '^#秘境$',
                    fnc: 'Secretplace'
                },
                {
                    reg: '^#降临秘境.*$',
                    fnc: 'Gosecretplace'
                },
                {
                    reg: '^#禁地$',
                    fnc: 'Forbiddenarea'
                },
                {
                    reg: '^#前往禁地.*$',
                    fnc: 'Goforbiddenarea'
                },
                {
                    reg: '^#仙府$',
                    fnc: 'Timeplace'
                },
                {
                    reg: '^#探索仙府$',
                    fnc: 'GoTimeplace'
                },
                {
                    reg: '^#仙境$',
                    fnc: 'Fairyrealm'
                },
                {
                    reg: '^#镇守仙境.*$',
                    fnc: 'Gofairyrealm'
                },
                {
                    reg: '^#逃离',
                    fnc: 'Giveup'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async Xiuxianstate(e) {
        await Xiuxian.Go(e);
        return;
    }

    //秘境地点
    async Secretplace(e) {
        if (!e.isGroup) {
            return;
        }
        let addres = "秘境";
        let weizhi = data.didian_list;  
        await Goweizhi(e, weizhi, addres);
    }

    async Gosecretplace(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        var didian = await e.msg.replace("#降临秘境", '');
        didian = didian.trim();
        let weizhi = await data.didian_list.find(item => item.name == didian);
        let level_id=3;
        let name="秘境";
        let time=5;
        await practice(e,weizhi,level_id,name,time);
        return;
    }


    //禁地
    async Forbiddenarea(e) {
        if (!e.isGroup) {
            return;
        }
        let addres = "禁地";
        let weizhi = data.forbiddenarea_list;
        await Goweizhi(e, weizhi, addres);
    }

    async Goforbiddenarea(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        var didian = await e.msg.replace("#前往禁地", '');
        didian = didian.trim();
        let weizhi = await data.forbiddenarea_list.find(item => item.name == didian);
        let level_id=21;
        let name="禁地";
        let time=8;
        await practice(e,weizhi,level_id,name,time);
        return;
    }


    //限定仙府
    async Timeplace(e) {
        if (!e.isGroup) {
            return;
        }
        let addres = "仙府";
        let weizhi = data.timeplace_list;
        await Goweizhi(e, weizhi, addres);
    }

    async GoTimeplace(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let weizhi = "无欲天仙"
        let level_id=21;
        let name="仙府";
        let time=6;
        await practice(e,weizhi,level_id,name,time);
        return;
    }

    //仙境
    async Fairyrealm(e) {
        if (!e.isGroup) {
            return;
        }
        let addres = "仙境";
        let weizhi = data.Fairyrealm_list;
        await Goweizhi(e, weizhi, addres);
    }


    async Gofairyrealm(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        var didian = await e.msg.replace("#镇守仙境", '');
        didian = didian.trim();
        let weizhi = await data.Fairyrealm_list.find(item => item.name == didian);
        let level_id=42;
        let name="仙境";
        let time=5;
        await practice(e,weizhi,level_id,name,time);
        return;
    }


    async Giveup(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            e.reply("没存档你逃个锤子!");
            return;
        }
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("修仙：游戏进行中...");
            return;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        if (action != null) {
            if (action.Place_action == "0") {
                let arr = action;
                arr.is_jiesuan = 1;//结算状态
                arr.shutup = 1;//闭关状态
                arr.working = 1;//降妖状态
                arr.power_up = 1;//渡劫状态
                arr.Place_action = 1;//秘境
                arr.Place_actionplus = 1;//沉迷状态
                arr.end_time = new Date().getTime();//结束的时间也修改为当前时间
                delete arr.group_id;//结算完去除group_id
                await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
                e.reply("你已逃离！");
                return;
            }
        }
        return;
    }

}

/**
     * 地点查询
 */
export async function Goweizhi(e, weizhi, addres) {
    let adr = addres;
    let msg = [
        "***" + adr + "***"
    ];
    for (var i = 0; i < weizhi.length; i++) {
        msg.push(weizhi[i].name + "\n" + "类型：" + weizhi[i].Grade + "\n" + "极品：" + weizhi[i].Best[0] + "\n" + "修为：" + weizhi[i].experience + "\n" +"灵石：" + weizhi[i].Price)
    }
    await Xiuxian.ForwardMsg(e, msg);
}


/**
 * 历练
 */
 export async function practice(e,weizhi,level_id,name,time) {

    let usr_qq = e.user_id;

    let player = await Xiuxian.Read_player(usr_qq);

    let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;

    if (now_level_id <= level_id) {
        e.reply("境界不足");
        return ;
    }

    if (!Xiuxian.isNotNull(weizhi)) {
        return ;
    }

    if (player.lingshi < weizhi.Price) {
        e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
        return ;
    }

    if (player.lingshi < weizhi.experience) {
        e.reply("你需要积累" + weizhi.experience + "修为才能抵御世界之力");
        return ;
    }

    let Price = weizhi.Price;
    await Xiuxian.Add_lingshi(usr_qq, -Price);
    await Xiuxian.Add_experience(usr_qq, -weizhi.experience);
    let action_time = 60000 * time;//持续时间，单位毫秒
    let arr = {
        //动作
        "action": name,
        //结束时间
        "end_time": new Date().getTime() + action_time,
        //持续时间
        "time": action_time,
        //闭关
        "shutup": "1",
        //降妖
        "working": "1",
        //秘境状态---开启
        "Place_action": "0",
        //渡劫状态--关闭
        "power_up": "1",
        //地点
        "Place_address": weizhi,
    };

    if (e.isGroup) {
        arr.group_id = e.group_id
    }

    await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));

    e.reply(name + "..." + time + "分钟后归来!");

    return 0; 
}


