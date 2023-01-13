# 开发者文档
Time：2022-11-27 
## 一、编写plugins扩展功能
### 1.定义插件名并创建目录以文件
```
plugins/xiuxian-my-plugin/                                #插件名为xiuxian-my-plugin
                apps/myindex.js                     #功能文件夹
                defSet/help/myhelp.yaml           #帮助
                    /task/mytask.yaml         #定时任务
                    /xiuxian/myconfig.yaml      #配置
                model/mymain.js                  #封装
                     /myfs.js                  
                    /mypublic.js                  
                resources/                        #资源文件夹
                    html/html.md              #页面资源
                    img/img.md                #图片资源
                    data/                      #存档文件夹
                        birth/birth.md            #动态文件
                        fixed/fixed.md            #静态文件
```
### 2.简单的命令打印及其输出
>apps/myindex.js
```
//js文件名字的前缀最好带上插件名,如黑市插件为myindex.js或mymain.js
//引入Yunzai插件功能(注意路径)
import roborapi from '../../../model/robotapi.js'
import { superIndex } from '../../../model/robotapi.js'
//导出  类  类名:与文件名一致 继承  插件类  
export class myindex extends roborapi {
    constructor() {
        super(superIndex([
                {
                    //正则
                    reg: '^#看看我$',
                    //函数
                    fnc: 'indeLlook'
                }
            ]));
    };
    //函数名  箭头函数，接受一个e消息
    indeLlook = async (e) => {
        //定义变量 并赋值
        const usr_qq = e.user_id;
        //前端输出消息
        e.reply(usr_qq);
        //后端打印消息
        console.log(user_qq);
        return;
    };
};
```
## 二、具体实现
### （一）扩展帮助图
##### 编辑myhelp.yaml文件
```
- group: 
  list:
    - icon: help-icon_44
      title: "#看看我"
      desc: "发出测试指令"
    - icon: help-icon_44
      title: "#我的插件帮助"
      desc: "调用我的插件帮助"
```
##### 发送我的帮助
>apps/myhelp.js
```
//注意路径（常识）
import roborapi from '../../../model/robotapi.js'
import { superIndex } from '../../../model/robotapi.js'
//导入帮助对象
import Help from '../../../model/help.js';
//导入缓存对象
import Cache from '../../../model/cache.js';
//调用文件复制对象，可以将yaml文件向xiuxain插件发送
import filecp from '../../../model/filecp.js';
//xiuxian-my-plugin发送了myhelp.yaml文件
filecp.Pluginfile('xiuxian-my-plugin', ['myhelp']);
export class myhelp extends roborapi {
    constructor() {
        super(superIndex([
                {
                    reg: '^#我的插件帮助$',
                    fnc: 'theMyHelp'
                }
            ]));
    };
    theMyHelp = async (e) => {
        //help对象的gerhelp方法，可以接收一个yaml文件进行配置
        const data = await Help.getboxhelp('myhelp');
        //判断存不存在
        if (!data) {
            return
        };
        //Cache对象将的来的数据进行缓存，缓存位置为10
        //缓存机制可以有效提高出图速度
        const img = await Cache.helpcache(data, 10);
        //发送消息
        await e.reply(img);
        return;
    };
};
```
##### 编辑myconfig.yaml文件
```
#操作cd,必须为整数,单位：分
CD: 
  Level_up: 5
  LevelMax_up: 5     
  Autograph: 60
  Name: 1240
  Reborn: 360    
  Transfer: 60  
  Attack: 5
  Kill: 3

group: 
  white: 0  
```
##### 动态读取配置
>apps/myconfig.js
```
import roborapi from '../../../model/robotapi.js'
import { superIndex } from '../../../model/robotapi.js'
//引用配置读取
import config from '../../../model/Config.js';
//xiuxian-my-plugin发送了myconfig.yaml文件
import filecp from '../../../model/filecp.js';
filecp.Pluginfile('xiuxian-my-plugin', ['myconfig']);
export class myhelp extends roborapi {
    constructor() {
        super(superIndex([
                {
                    reg: '^#我的配置$',
                    fnc: 'theMyConfig'
                }
            ]));
    };
    theMyHelp = async (e) => {
        /**
          读取配置
         */
         const myconfig= config.getConfig('xiuxian', 'myconfig')
         /**
           *   task配置同理  config.getConfig('task', 'mytask')
          */
        //发送消息
        e.reply(myconfig);
        return;
    };
};
```

### （二）模板
###### 1.定义全局
>model/myfs.js
```
import fs from 'fs';
import path from 'path';
//新的写入
export const newRead = async (dir) => {
    try {
        const newdata = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return 'error';
            };
            return data;
        });
        return newdata;
    } catch {
        return 1;
    };
};
//写入数据
export const Write = async (usr_qq, data, PATH) => {
    const dir = path.join(PATH, `${usr_qq}.json`);
    const new_ARR = JSON.stringify(data, '', '\t');
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
    });
    return;
};
```
>model/mymain.js
```
//引入盒子名与盒子数据位
import path from 'path';
import {appname} from '../../../model/main.js'
//定义自己的插件名
export const pluginname ='xiuxian-my-plugin'
export const pluginDirname = `${path.resolve()}${path.sep}plugins${path.sep}${appname}${path.sep}plugins${path.sep}${pluginname}`;
//定义自己的数据位置
export const pluginResources=`plugins/${appname}/plugins/${pluginname}/resources`
```
##### 2.存档机制
>model/mypublic.js
```
import path from 'path';
//插件地址
import { pluginDirname } from './mymain.js';
//自定义的
import { Write, newRead } from './myfs.js';
//插件检测机制
import { existplayerplugins } from '../../../model/public.js'
//插件地址链
export const __PATH = {
    Exchange: path.join(pluginDirname, '/resources/data/birth/Exchange'),
    Forum: path.join(pluginDirname, '/resources/data/birth/Forum'),
    my: path.join(pluginDirname, '/resources/data/birth/my'),
    //存档位置
    my_user: path.join(pluginDirname, '/resources/data/birth/my/user'),
    //时间搓位置
    my_life: path.join(pluginDirname, '/resources/data/birth/my/life')
};
/**
*写入存档
 */
export const writemyPlayer = async (uid, data) => {
    await Write(uid, data, __PATH.my_user)
    return
}
/**
*写入life
 */
export const writemyLife = async (data) => {
    await Write(`mylife`, data, __PATH.my_life);
    return
}
/**
读取life
 */
export const readmyLife = async () => {
    const dir = path.join(`${__PATH.my_life}/mylife.json`)
    let life = await newRead(dir)
    if (life == 1) {
        //首次需要初始化
        await writemyLife([])
        return []
    }
    life = await JSON.parse(life)
    return life
}
/**
 * 创建存档
 */
export const myCreatePlayer = async (uid, time) => {
    try {
        /**
         * my存档需要什么？
         */
        const myUser = {
            'qq': uid
        }
        /**
         * 写入存档
         */
        await writemyPlayer(uid, myUser)
        /**
         * 初始化一个life
         */
        const newmy = {
            'uid': uid,
            'createTime': time  //时间搓
        }
        /**
         * 读取mylife.json
         */
        const myLife = await readmyLife()
        myLife.push(newmy)
        /**
         * 写入新数据
         */
        await writemyLife(myLife)
        return true
    } catch {
        return false
    }
}
/**
 * 检测my是否存档
 */
export const myExistPlayer = async (uid) => {
    /**
     * 就是找mylife里面有没有这个uid
     */
    const myLife = await readmyLife()
    const find = myLife.find(item => item.uid == uid);
    if (find == undefined) {
        return false;
    } else {
        return find;
    };
}
//这里要写一个存档检测机制
export const myGo = async (uid) => {
    //先检查box存档
    const box = await existplayerplugins(uid)
    if (!box) {
        /**
         * 不存在box存档就是undifined---false
         */
        console.log('不存在box存档')
        return false
    }
    let my = await myExistPlayer(uid)
    if (!my) {
        /**
         * 不存在my存档
         * 需要直接初始化my存档
         */
        console.log('不存在my存档')
        const myGo = await myCreatePlayer(uid, box.createTime)
        if (!myGo) {
            /**
             * 初始化my失败
             */
            console.log('初始化my失败')
            return false
        }
        //初始化成功要返回新数据
        my = await myExistPlayer(uid)
    }
    
    if (box.createTime != my.createTime) {
        console.log('不是同一个人')
        /**
         * 需要把life中的那个时间给干掉
         */
        let mylife = await readmyLife();
        mylife = await mylife.filter(item => item.uid != uid);
        await writemyLife(mylife);
        /**
         * 初始化
         */
        const myGo = await myCreatePlayer(uid, box.createTime)
        if (!myGo) {
            /**
             * 初始化my失败
             */
            console.log('初始化my失败')
            return false
        }
    }
    /**
     * 死没死不是my说了算，而是box说了算
     */
    if (box.status == 0) {
        /**
         * 死了,需要清除全局aciton状态
         */
        return false
    }
    return true;
}
```
##### 3.存档检测
>apps/myuser.js
```
import robotapi from '../../../model/robotapi.js'
import { superIndex } from '../../../model/robotapi.js'
//插件专用GO
import { pluginGo } from "../../../model/public.js";
//我的Go
import { myGo } from '../model/mypublic.js';
export class myuser extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#检测存档$',
                fnc: 'myUser'
            }
        ]));
    };
    myUser = async (e) => {
        const ifexistplay = await myGo(e.user_id);
        if (!ifexistplay) {
            return;
        }
        const good = await pluginGo(e.user_id);
        if (good.actoin == 1) {
            e.reply(good.msg)
            return;
        };
        e.reply('成功通过')
        return;
    }
}
```
### （三）数据推送
##### 激活数据备份
>myhelp.js
```
//放进myhelp.js以激活
import schedule from '../../../model/schedule.js';
import {__PATH} from '../model/mypublic.js';
/**
    插件名
    备份的时间点（整点备份一次）
    需要备份的数据数据地址
 */
schedule.scheduleJobflie('my','0 0 */1 * * ?',__PATH.my);
```
##### 生成物品数据
>resources/data/fixed
>mypoint.json
```
[
    {
        "id":"0-1-1-1-10",
        "name":"我的地点",
        "x":"66",
        "y":"666"
    }
]
```
>物品数据  
```
id数据头规定:1武器2护具3法宝4丹药5功法6道具   
1-19   为基础段    
20-29  为扩展段    
30-99  为预留段    
100后  为玩家可用段     
id数据尾规定:     
1-19    为基础物品    
20-29   为限定物品    
30-99   为宗门物品    
100-199 为药园物品    
200-399 为职业物品    
400-999 为预留物品    
1000-1999  插件1    
2000-2999  插件2  
3000...  插件...  
```
>位置数据 
```      
含义：位面-区域-属性-等级-编号   
位面：人界0、仙界1   
区域：唯一   
属性：城池1、荒地2、海洋3、秘境4、禁地5、岛屿6   
等级: 等级限制（1-10）   
编号：0区域、1中心、2传送阵、3联盟、凡仙堂4...     
```
##### 推送物品数据
>model/mydata.js
``` 
     
class MyData{


}     
```