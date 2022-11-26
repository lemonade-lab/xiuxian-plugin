import plugin from '../../../../../lib/plugins/plugin.js';
import { ForwardMsg, point_map,Read_action,Read_Forum, existplayer, Write_Forum } from '../../../apps/Xiuxian/Xiuxian.js';
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

    /**
     * 此功能需要回 有间客栈
     */


    Searchforum = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='有间客栈';
        const map=await point_map(action,address_name);
        const Forum = await Read_Forum();
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        const msg = [
            '___[有间客栈]___'
        ];
        Forum.forEach((item) => {
            msg.push( `[${item.title}]\n${item.content}\nTime:${item.time}\nId:${item.number}\n`);
        });
        await ForwardMsg(e, msg);
        return;
    };
    Pushforum = async (e) => {
        const usr_qq = e.user_id;
        if (usr_qq == 80000000) {
            return;
        };
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const Forum = await Read_Forum();
        const title0 = e.msg.replace('#文章', '');
        const code = title0.split('\*');
        const [title,content] = code;//内容
        if (title.length == 0) {
            e.reply('未填写标题');
            return;
        };
        if (content == undefined) {
            e.reply('未填写内容');
            return;
        };
        if (title.length > 8) {
            e.reply('标题最多8个字');
            return;
        };
        if (content.length > 50) {
            e.reply('内容最多50个字');
            return;
        };
        const myDate = new Date();
        const year = myDate.getFullYear();
        const month = myDate.getMonth() + 1;
        const day = myDate.getDate();
        const newDay = year + '-' + month + '-' + day;
        const Mathrandom=Math.floor((Math.random() * (99 - 1) + 1));
        const wupin = {
            'title': title,//发布名
            'qq': usr_qq,//发布名
            'content': content,//发布内容
            'time': newDay,//发布时间
            'number': `${usr_qq}${Mathrandom}`//编号
        };
        Forum.push(wupin);
        await Write_Forum(Forum);
        e.reply('发布成功');
        return;
    };
};