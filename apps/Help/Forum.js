import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 攻略论坛
 */
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
        })
    }

    async Searchforum(e) {
        let Forum = await Xiuxian.Read_Forum();
        let msg = [
            "___[有间客栈]___"
        ];
        for (var i = 0; i < Forum.length; i++) {
            msg.push(
                "   [" + Forum[i].title + "]" +
                "\n" + Forum[i].content +
                "\ntime:" + Forum[i].time +
                "\nID:" + Forum[i].number);
        }
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    async Pushforum(e) {
        let usr_qq = e.user_id;
        if (usr_qq == 80000000) {
            return;
        }
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let Forum = await Xiuxian.Read_Forum();
        let title0 = e.msg.replace("#", '');
        title0 = title0.replace("文章", '');
        let code = title0.split("\*");
        let title = code[0];//标题
        let content = code[1];//内容
        if (title.length == 0) {
            e.reply("未填写标题");
            return;
        }
        else if (content == undefined) {
            e.reply("未填写内容");
            return;
        }
        else if (title.length > 8) {
            e.reply("标题最多8个字");
            return;
        }
        else if (content.length > 50) {
            e.reply("内容最多50个字");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id;
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 9) {
            e.reply("境界过低");
            return;
        }
        let Mathrandom = Math.random();
        Mathrandom = usr_qq + Mathrandom
        Mathrandom = Mathrandom * 100000
        Mathrandom = Math.trunc(Mathrandom);
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1;  //获取当前月份(1-12)
        var day = myDate.getDate();  //获取当前日(1-31)
        var newDay = year + '-' + month + '-' + day;//获取完整年月日
        let wupin = {
            "title": title,//发布名
            "qq": usr_qq,//发布名
            "content": content,//发布内容
            "time": newDay,//发布时间
            "number": Mathrandom//编号
        };
        Forum.push(wupin);
        await Xiuxian.Write_Forum(Forum);
        e.reply("发布成功！");
        return;
    }

}


