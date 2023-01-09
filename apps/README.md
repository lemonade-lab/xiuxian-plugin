# 开发者文档
Time：2022-11-27 
## 一、编写plugins扩展功能
### 1.定义插件名并创建目录以文件
```
plugins/xiuxian-my-plugin/                                #插件名为xiuxian-my-plugin
                apss/index.js                     #功能文件夹
                defSet/help/myhelp.yaml           #配置文件夹
                model/mymodel.js                  #封装js文件夹
                resources/                        #资源文件夹
                          html/html.md              #页面资源
                          img/img.md                #图片资源
                          data/                      #存档文件夹
                               birth/birth.md            #动态文件
                               fixed/fixed.md            #静态文件
```
### 2.简单的命令打印及其输出
```
//index.js
//引入Yunzai插件功能
//注意路径（常识）
import plugin from '../../../../../lib/plugins/plugin.js
//导出  类  类名:与文件名一致 继承  插件类  
export class index extends plugin {
    constructor() {
        super({
            //后端信息
            name: 'index',
            dsc: 'index',
            event: 'message',
            //优先级：数值越低越悠闲
            priority: 600,
            rule: [
                {
                    //正则
                    reg: '^#看看我$',
                    //函数
                    fnc: 'indeLlook'
                }
            ]
        });
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
```
//apps目录下创建gethelp.js
//gethelp.js
//注意路径（常识）
import plugin from '../../../../../lib/plugins/plugin.js';
//导入帮助对象
import Help from '../../../model/help.js';
//导入缓存对象
import Cache from '../../../model/cache.js';
//调用文件复制对象，可以将yaml文件向xiuxain插件发送
import filecp from '../../../model/filecp.js';
//xiuxian-my-plugin发送了myhelp.yaml文件
filecp.Pluginfile('xiuxian-my-plugin', ['myhelp']);
export class gethelp extends plugin {
    constructor() {
        super({
            name: 'gethelp',
            dsc: 'gethelp',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#我的插件帮助$',
                    fnc: 'theMyHelp'
                }
            ]
        });
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
### （二）数据推送