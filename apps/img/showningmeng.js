import { plugin } from '../../api/api.js'
import {
    get_ningmenghome_img, get_valuables_img, get_valuables_prop_img,
    get_valuables_huju_img, get_valuables_fabao_img, get_valuables_wuqi_img, get_valuables_drug_img, get_valuables_skill_img
} from '../../model/ningmeng.js'
import { __PATH } from "../../model/xiuxian.js"
export class showningmeng extends plugin {
    constructor() {
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
        this.path = __PATH.player_path;
    }
    //柠檬堂
    async show_ningmenghome(e) {
        if (!e.isGroup) return
        let img = await get_ningmenghome_img(e);
        e.reply(img);
        return;
    }
    //万宝楼
    async show_valuables(e) {
        if (!e.isGroup) return
        let img = await get_valuables_img(e);
        e.reply(img);
        return;
    }

    //法宝楼
    async show_valuables_fabao(e) {
        if (!e.isGroup) return
        let img = await get_valuables_fabao_img(e);
        e.reply(img);
        return;
    }

    //武器楼
    async show_valuables_wuqi(e) {
        if (!e.isGroup) return
        let img = await get_valuables_wuqi_img(e);
        e.reply(img);
        return;
    }

    //护具楼
    async show_valuables_huju(e) {
        if (!e.isGroup) return
        let img = await get_valuables_huju_img(e);
        e.reply(img);
        return;
    }

    //丹药楼
    async show_valuables_drug(e) {
        if (!e.isGroup) return
        let img = await get_valuables_drug_img(e);
        e.reply(img);
        return;
    }
    //功法楼
    async show_valuables_skill(e) {
        if (!e.isGroup) return
        let img = await get_valuables_skill_img(e);
        e.reply(img);
        return;
    }

    //道具楼
    async show_valuables_prop(e) {
        if (!e.isGroup) return
        let img = await get_valuables_prop_img(e);
        e.reply(img);
        return;
    }
}