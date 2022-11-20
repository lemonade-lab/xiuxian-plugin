import plugin from '../../../../../lib/plugins/plugin.js';
import { ForwardMsg, Read_Forum, existplayer, Write_Forum } from '../../../apps/Xiuxian/Xiuxian.js';
export class Forum extends plugin {
    constructor() {
        super({
            name: 'Forum',
            dsc: 'Forum',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#有间客栈$',
                    fnc: 'Searchforum'
                },
                {
                    reg: '^#文章.*$',
                    fnc: 'Pushforum'
                },
            ]
        });
    };
    Searchforum = async (e) => {
        const Forum = await Read_Forum();
        const msg = [
            "___[有间客栈]___"
        ];
        Forum.forEach((item) => {
            msg.push(
                "   [" + item.title + "]" +
                "\n" + item.content +
                "\nTime:" + item.time +
                "\nId:" + item.number);
        });
        await ForwardMsg(e, msg);
        return;
    };
    Pushforum = async (e) => {
        const usr_qq = e.user_id;
        if (usr_qq == 80000000) {
            return;
        }
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        const Forum = await Read_Forum();
        const title0 = e.msg.replace("#文章", '');
        const code = title0.split("\*");
        const title = code[0];//标题
        const content = code[1];//内容
        if (title.length == 0) {
            e.reply("未填写标题");
            return;
        };
        if (content == undefined) {
            e.reply("未填写内容");
            return;
        };
        if (title.length > 8) {
            e.reply("标题最多8个字");
            return;
        };
        if (content.length > 50) {
            e.reply("内容最多50个字");
            return;
        };
        const myDate = new Date();
        const year = myDate.getFullYear();
        const month = myDate.getMonth() + 1;
        const day = myDate.getDate();
        const newDay = year + '-' + month + '-' + day;
        let Mathrandom = Math.random();
        Mathrandom = usr_qq + Mathrandom
        Mathrandom = Mathrandom * 100000
        Mathrandom = Math.trunc(Mathrandom);
        const wupin = {
            "title": title,//发布名
            "qq": usr_qq,//发布名
            "content": content,//发布内容
            "time": newDay,//发布时间
            "number": Mathrandom//编号
        };
        Forum.push(wupin);
        await Write_Forum(Forum);
        e.reply("发布成功！");
        return;
    };
};