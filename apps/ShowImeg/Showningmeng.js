import plugin from "../../../../lib/plugins/plugin.js";
import Valuablesall from "../../model/Valuablesall.js";
import puppeteer from "../../../../lib/puppeteer/puppeteer.js";
import data from '../../model/XiuxianData.js'
/**
 * 生图模块
 */
export class Showningmeng extends plugin {
    constructor(e) {
        super({
            name: "Showningmeng",
            dsc: "Showningmeng",
            event: "message",
            priority: 600,
            rule: [
                {
                    reg: "^#万宝楼$",
                    fnc: "show_valuables",
                },
                {
                    reg: "^#法宝楼$",
                    fnc: "show_valuables_fabao",
                },
                {
                    reg: "^#武器楼$",
                    fnc: "show_valuables_wuqi",
                },
                {
                    reg: "^#护具楼$",
                    fnc: "show_valuables_huju",
                },
                {
                    reg: "^#丹药楼$",
                    fnc: "show_valuables_drug",
                },
                {
                    reg: "^#功法楼$",
                    fnc: "show_valuables_skill",
                },
                {
                    reg: "^#道具楼$",
                    fnc: "show_valuables_prop",
                },
                {
                    reg: "^#柠檬堂$",
                    fnc: "show_ningmenghome",
                },
            ]
        });
    }
    //柠檬堂
    async show_ningmenghome(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_ningmenghome_img(e);
        e.reply(img);
        return;
    }
    //万宝楼
    async show_valuables(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_img(e);
        e.reply(img);
        return;
    }

    //法宝楼
    async show_valuables_fabao(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_fabao_img(e);
        e.reply(img);
        return;
    }

    //武器楼
    async show_valuables_wuqi(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_wuqi_img(e);
        e.reply(img);
        return;
    }

    //护具楼
    async show_valuables_huju(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_huju_img(e);
        e.reply(img);
        return;
    }

    //丹药楼
    async show_valuables_drug(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_drug_img(e);
        e.reply(img);
        return;
    }
    //功法楼
    async show_valuables_skill(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_skill_img(e);
        e.reply(img);
        return;
    }

    //道具楼
    async show_valuables_prop(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_valuables_prop_img(e);
        e.reply(img);
        return;
    }
}
/**
 * 返回柠檬堂
 * @return image
 */
export async function get_ningmenghome_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let commodities_list = data.commodities_list; 
    let ningmenghome_data = {
        user_id: usr_qq,
        commodities_list: commodities_list
    }
    const data1 = await new Valuablesall(e).get_ningmenghomeData(ningmenghome_data);
    let img = await puppeteer.screenshot("ningmenghome", {
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
    const data1 = await new Valuablesall(e).get_valuablesData(valuables_data);
    let img = await puppeteer.screenshot("valuables", {
        ...data1,
    });
    return img;
}


/**
 * 返回道具楼
 * @return image
 */
export async function get_valuables_prop_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let daoju_list = data.daoju_list;
    let valuables_prop = {
        user_id: usr_qq,
        daoju_list: daoju_list,
    }
    const data1 = await new Valuablesall(e).get_valuables_propData(valuables_prop);
    let img = await puppeteer.screenshot("valuables_prop", {
        ...data1,
    });
    return img;
}




/**
 * 法宝楼
 * @return image
 */
export async function get_valuables_fabao_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let fabao_list = data.fabao_list;
    let valuables_fabao = {
        user_id: usr_qq,
        fabao_list: fabao_list,
    }
    const data1 = await new Valuablesall(e).get_valuables_fabaoData(valuables_fabao);
    let img = await puppeteer.screenshot("valuables_fabao", {
        ...data1,
    });
    return img;
}

/**
 * 武器楼
 * @return image
 */
export async function get_valuables_wuqi_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let wuqi_list = data.wuqi_list;
    let valuables_wuqi = {
        user_id: usr_qq,
        wuqi_list: wuqi_list,
    }
    const data1 = await new Valuablesall(e).get_valuables_wuqiData(valuables_wuqi);
    let img = await puppeteer.screenshot("valuables_wuqi", {
        ...data1,
    });
    return img;
}
/**
 * 护具楼
 * @return image
 */
export async function get_valuables_huju_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let huju_list = data.huju_list;
    let valuables_huju = {
        user_id: usr_qq,
        huju_list: huju_list,
    }
    const data1 = await new Valuablesall(e).get_valuables_hujuData(valuables_huju);
    let img = await puppeteer.screenshot("valuables_huju", {
        ...data1,
    });
    return img;
}




/**
 * 返回丹药楼
 * @return image
 */
export async function get_valuables_drug_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let danyao_list = data.danyao_list;
    let valuables_data = {
        user_id: usr_qq,
        danyao_list: danyao_list
    }
    const data1 = await new Valuablesall(e).get_valuables_drugData(valuables_data);
    let img = await puppeteer.screenshot("valuables_drug", {
        ...data1,
    });
    return img;
}

/**
 * 返回功法楼
 * @return image
 */
export async function get_valuables_skill_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let gongfa_list = data.gongfa_list;
    let valuables_data = {
        user_id: usr_qq,
        gongfa_list: gongfa_list
    }
    const data1 = await new Valuablesall(e).get_valuables_skillData(valuables_data);
    let img = await puppeteer.screenshot("valuables_skill", {
        ...data1,
    });
    return img;
}




