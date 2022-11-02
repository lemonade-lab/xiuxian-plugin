
import plugin from '../../../../lib/plugins/plugin.js'
import puppeteer from "../../../../lib/puppeteer/puppeteer.js";
import Help from "../../model/help.js";
import md5 from "md5";
let helpData = {
    md5: "",
    img: "",
};
/**
 * 修仙帮助模块
 */
export class BotHelp extends plugin {
    constructor() {
        super({
            name: 'BotHelp',
            dsc: 'BotHelp',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙帮助$',
                    fnc: 'Xiuxianhelp1'
                },
                {
                    reg: "^#修仙扩展$",
                    fnc: "Xiuxianhelp2",
                },
                {
                    reg: "^#修仙管理$",
                    fnc: "adminsuper",
                }
            ]
        })
    }

    async Xiuxianhelp2(e) {
        let data = await Help.gethelp2(e);
        if (!data) return;
        let img = await this.cache(data);
        await e.reply(img);
    }

    async Xiuxianhelp1(e) {
        let data = await Help.gethelp1(e);
        if (!data) return;
        let img = await this.cache(data);
        await e.reply(img);
    }

    async adminsuper(e) {
        let data = await Help.getadmin(e);
        if (!data) return;
        let img = await this.cache(data);
        await e.reply(img);
    }

    async cache(data) {
        let tmp = md5(JSON.stringify(data));
        if (helpData.md5 == tmp) return helpData.img;
        helpData.img = await puppeteer.screenshot("help", data);
        helpData.md5 = tmp;
        return helpData.img;
    }

}