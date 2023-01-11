# 开发者文档
Time：2022-11-27 
## 一、编写plugins扩展功能
### 1.定义插件名并创建目录以文件
```
plugins/xiuxian-my-plugin/                                #插件名为xiuxian-my-plugin
                apss/myindex.js                     #功能文件夹
                defSet/help/myhelp.yaml           #配置文件夹
                model/mymain.js                  #封装js文件夹
                resources/                        #资源文件夹
                          html/html.md              #页面资源
                          img/img.md                #图片资源
                          data/                      #存档文件夹
                               birth/birth.md            #动态文件
                               fixed/fixed.md            #静态文件
```
### 2.简单的命令打印及其输出
>myindex.js
```
//js文件名字的前缀最好带上插件名,如黑市插件为darkindex.js或darkmain.js
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
##### 1.编辑myhelp.yaml文件
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
##### 2.编写js文件
>myhelp.js
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
        const data = await Help.getboxhelp( 'myhelp');
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
### （二）模板
>model/mymain.js
```
//引入盒子名与盒子数据位
import {appname,dirname} from '../../../model/main.js'
//定义自己的插件名
export const pluginname ='xiuxian-my-plugin'
//定义自己的数据位置
export const pluginresources=`plugins/${appname}/plugins/${pluginname}/resources`
```
>model/mypublic.js
```
//引入隔壁自己定义的插件名
import {pluginname} from './mymain.js'
```
### （三）数据推送
##### 1.编写地点数据文件
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