import plugin from "../../../../lib/plugins/plugin.js";
import Show from "../../model/show.js";
import puppeteer from "../../../../lib/puppeteer/puppeteer.js";
import data from '../../model/XiuxianData.js'
import { __PATH } from "../Xiuxian/xiuxian.js"
import { get_gongfa_img,get_danyao_img,get_wuqi_img,get_daoju_img,get_XianChong_img} from '../ShowImeg/showData.js'
/**
 * 生图模块
 */
export class Showningmeng extends plugin {
    constructor(e) {
        super({
            name: "Showningmeng",
            dsc: "修仙存档展示",
            event: "message",
            priority: 600,
            rule: [
                {
                    reg: "^#万宝楼$",
                    fnc: "show_valuables",
                },
                {
                    reg: "^#装备楼$",
                    fnc: "Show_WuQi",
                },
                {
                    reg: "^#丹药楼$",
                    fnc: "Show_DanYao",
                },
                {
                    reg: "^#功法楼$",
                    fnc: "Show_GongFa",
                },
                {
                    reg: "^#道具楼$",
                    fnc: "Show_DaoJu",
                },
                 {
                    reg: "^#仙宠楼$",
                    fnc: "Show_XianChong",
                },

                {
                    reg: "^#柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$",
                    fnc: "show_ningmenghome",
                }
            ]
        });
        this.path = __PATH.player_path;
    }
    //柠檬堂
    async show_ningmenghome(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
		let thing_type = e.msg.replace("#柠檬堂","");
        let img = await get_ningmenghome_img(e,thing_type);
        e.reply(img);
        return;
    }
    //斩首堂
    async yuansu(e) {
        //不开放私聊功能
        if (!e.isGroup) {
           return;
       }
       let img = await get_zhanshou_img(e);
       e.reply(img);
       return;
   }
    //万宝楼
    async show_valuables(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_img(e);
        e.reply(img);
        return;
    }
     //仙宠楼
     async Show_XianChong(e) {

        if (!e.isGroup) {
          return;
        }
        let img = await get_XianChong_img(e);
        e.reply(img);
        return;
    }

    //武器楼
    async Show_WuQi(e) {

        if (!e.isGroup) {
          return;
        }
        let img = await get_wuqi_img(e);
        e.reply(img);
        return;
    }

    //丹药楼
    async Show_DanYao(e) {

        if (!e.isGroup) {
          return;
        }
        let img = await get_danyao_img(e);
        e.reply(img);
        return;
    }
    //功法楼
    async Show_GongFa(e) {

        if (!e.isGroup) {
          return;
        }
        let img = await get_gongfa_img(e);
        e.reply(img);
        return;
    }

    //道具楼
    async Show_DaoJu(e) {

        if (!e.isGroup) {
          return;
        }
        let img = await get_daoju_img(e);
        e.reply(img);
        return;
    }
}
/**
 * 返回柠檬堂
 * @return image
 */
export async function get_ningmenghome_img(e,thing_type) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let commodities_list = data.commodities_list;
	if (thing_type!=""){
		if(thing_type=="装备"||thing_type=="丹药"||thing_type=="功法"||thing_type=="道具"||thing_type=="草药"){
			commodities_list = commodities_list.filter(item => item.class == thing_type);
		}
		else if(thing_type=="武器"||thing_type=="护具"||thing_type=="法宝"||thing_type=="修为"||thing_type=="血量"||thing_type=="血气"||thing_type=="天赋"){
			
			commodities_list = commodities_list.filter(item => item.type == thing_type);
		}
	}
    let ningmenghome_data = {
        user_id: usr_qq,
        commodities_list: commodities_list
    }
    const data1 = await new Show(e).get_ningmenghomeData(ningmenghome_data);
    let img = await puppeteer.screenshot("ningmenghome", {
        ...data1,
    });
    return img;

}
/**
 * 返回斩首堂
 * @return image
 */
 export async function get_zhanshou_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let commodities_list = data.yuansuwuqi_list;
    let ningmenghome_data = {
        user_id: usr_qq,
        commodities_list: commodities_list
    }
    const data1 = await new Show(e).get_yuansu(ningmenghome_data);
    let img = await puppeteer.screenshot("tujian", {
        ...data1,
    });
    return img;

}

/**
 * 返回万宝楼
 * @return image
 */
export async function get_valuables_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let valuables_data = {
        user_id: usr_qq
    }
    const data1 = await new Show(e).get_valuablesData(valuables_data);
    let img = await puppeteer.screenshot("valuables", {
        ...data1,
    });
    return img;
}
