## 修改存档

> Yunzai-Bot/plugins/xiuxian-plugin/resources/data/birth/xiuxian

windows 建议使用 VScode 软件进行编辑,以免带来破坏性影响

linux 建议需要学习一些命令行等的基础知识

## 数据备份

> Yunzai-Bot/xiuxiandadata

linux 系统建议使用 windows 的 Termius 软件进行双系统间的无间隔编辑

## 素材替换

> Yunzai-Bot/plugins/xiuxian-plugin/resources/img

图片支持全部替换

## 配置修改

> Yunzai-Bot/plugins/xiuxian-plugin/config/help

帮助内容支持替换

> Yunzai-Bot/plugins/xiuxian-plugin/config/xiuxian

支持参数配置手动设置,指令设置请发送`#修仙配置`

## 自定义物品

> Yunzai-Bot\plugins\xiuxian-plugin\resources\goods

> mygoods.json

名字随意,最好自己分类，如武器 danyao.json

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

### 如何让玩家购买?

`凡仙堂`原则上只卖丹药

> mygoods0.json

凡仙堂会识别 0.json 为可购买物品

我们只需要把名字 mygoods 后面加个 0 即可

例如 wuqi0.json 或者 daoyao0.json
