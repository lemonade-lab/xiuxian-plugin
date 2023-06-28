#### 安装机器人

Yunzai-Bot 喵喵版[`☞维护`](https://gitee.com/yoimiya-kokomi/Yunzai-Bot)

alemon-Bot 频道版[`☞维护`](http://ningmengchongshui.gitee.io/lemonade)

#### 根目录执行

```
git clone --depth=1 -b dev https://gitee.com/ningmengchongshui/xiuxian-plugin.git ./plugins/xiuxian-plugin/
```

#### 关于启动

alemon-bot 可支持启动该插件并游玩

Yunzai 安装该插件不能直接游玩

Yunzai 游玩需要更改一下信息

在 lib/plugins/loader.js 的 270 行

```js
let res = plugin[v.fnc] && plugin[v.fnc](e)
```

更改为

```js
if (e.msg) {
  e.cmd_msg = e.msg
}
let res = plugin[v.fnc] && plugin[v.fnc](e)
```

如此即可在 Yunzai 中完美游玩修仙

#### 开源协议

GNU GPL 是使用最广泛的自由软件许可证,并有强烈的版权要求

分发衍生作品时,作品的源代码必须在同一许可证下可用

GNUGPL 有多种变体,每个变体都有不同的要求

#### 免责声明

请勿用于任何以盈利为目的的场景

任何商业目的皆要授权许可证
