## 该文件不可改动
>Yunzai-Bot\plugins\Xiuxian-Plugin-Box\resources\goods
### 定义新物品

>新建文件名为mygoods.json的文件   

名字随意,最好自己分类,免得记不起来    

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

`凡仙堂`原则上只卖丹药,也只显示丹药属性

但是也是可以新增其他物品,一样可以购买

只是这个自定义物品,有点类似于未知属性的物品了

>新建文件名为mygoods0.json的文件 

凡仙堂会识别0.json为可购买物品

我们只需要把名字mygoods后面加个0即可

例如wuqi0.json或者daoyao0.json