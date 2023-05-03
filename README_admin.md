# xiuxian-plugin<a  href='https://gitee.com/three-point-of-water/xiuxian-plugin/stargazers'><img src='https://gitee.com/three-point-of-water/xiuxian-plugin/badge/star.svg?theme=dark'  alt='star'></img></a>

#### 启动游戏

文件名`xiuxian-plugin`需改`xiuxian@2.0.0`

或改`xiuxian@1.3.0`或改`xiuxian@1.2.1`

运行后，运行后，运行后！再进行配置

> config/parameter/namelist.yaml

所有版本都不可私聊游玩~

@2.0.0 存档与备份存档皆不在插件内

更新后若无反应可使用`#日志`

查看是否提示配置重置说明

#### 指令说明

| 版本   | 指令        | 说明           |
| ------ | ----------- | -------------- |
| @1.2.1 | `#修仙帮助` | 正常游玩指令   |
| @1.3.0 | `#修仙帮助` | 正常游玩指令   |
| @2.0.0 | `#修仙帮助` | 正常游玩指令   |
| @2.0.0 | `#修仙管理` | 查看管理类指令 |
| @2.0.0 | `#修仙配置` | 插件相关配置   |

#### 问题反馈

| 群名   | 群号      | 说明     |
| ------ | --------- | -------- |
| 文游社 | 685979617 | 问题反馈 |
| @2.0.0 | 759055676 | 在线体验 |
| @1.3.0 | 767253997 | 在线体验 |
| @1.2.1 | 426618276 | 在线体验 |

#### 修改存档

> Yunzai-Bot/xiuxianfile

windows 建议使用 VScode 软件进行编辑,以免带来破坏性影响

linux 建议需要学习一些命令行等的基础知识

#### 数据备份

> Yunzai-Bot/xiuxiandata

linux 系统建议使用 windows 的 Termius 软件进行双系统间的无间隔编辑

#### 配置地址

> Yunzai-Bot/plugins/xiuxian@2.0.0/config

#### 自定义物品

> Yunzai-Bot\xiuxiangoods

文件名字随意,最好自己分类，如武器 danyao.json

写入下方的测试代码

```
[
  {
    "id": "4-2-99",
    "name": "九九金丹",
    "attack": 0,
    "defense": 0,
    "blood": 0,
    "burst": 0,
    "burstmax": 0,
    "size": 0,
    "experience": 9999,
    "experiencemax": 0,
    "speed": 0,
    "acount": 1,
    "price": 4676
  }
]
```

保存后重启机器方能生效

酱紫玩家就可以在怪物身上有一定概率打落该物品了

##### 如何让玩家购买?

`万宝楼`原则上只卖丹药

> mygoods0.json

万宝楼会识别 0.json 为可购买物品

我们只需要把名字 mygoods 后面加个 0 即可

例如 wuqi0.json 或者 daoyao0.json
