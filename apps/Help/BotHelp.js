
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
                    fnc: 'Xiuxianhelp'
                },
                {
                    reg: "^#修仙管理$",
                    fnc: "adminsuper",
                },
                {
                    reg: "^#修仙扩展$",
                    fnc: "Xiuxianhelpcopy",
                }
            ]
        })
    }

    async Xiuxianhelpcopy(e) {
        let data = await Help.gethelpcopy(e);
        if (!data) return;
        let img = await this.cache(data);
        await e.reply(img);
    }



    /**
     * rule - 修仙帮助
     * @returns
     */
    async Xiuxianhelp(e) {
        let data = await Help.get(e);
        if (!data) return;
        let img = await this.cache(data);
        await e.reply(img);
    }


    async adminsuper(e) {
        let data = await Help.setup(e);
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