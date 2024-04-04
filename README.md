# 喵仔修仙插件

> 这是一款为喵仔设计的修仙插件，使用 ts 和 tsx 进行编写。在使用前,需要进行编译后才能使用

4 月初重新设计的，重头写过。全新架构设计！

## 新版的改动

### 全新截图

- 拓展性高，可控制页面和任意主题
- 可局部图片(组件)复用
- 热更新开发等比例图片，所视即所得

### 全新数据结构

- 数值公式生成，不再担心复杂的文件难以修改
- 带更新脚本可同步最新版存档 3.高性能且零 BUG
- 采用 ts 编写，快速定位错误代码
- 采用先编译后运行，可查找隐藏 bug
- 编译成单文件，插件解析快
- 所有数值一表修改,不必再翻所有代码文件

### 更规范的仓库管理

- 推送即自动格式化全部代码
- 限制每条更新必然要说明更新主题 ###全新

### 新 UI 和玩法设计

- 两年文字修仙研究经验，快速入手！
- 更清晰的 UI 设计，萌新不再迷路。

![替代文本](./resources/demo/purple.jpg)

## 部署

- plugins 目录中执行

```sh
git clone  --depth=1 https://gitee.com/ningmengchongshui/xiuxian-plugin.git
```

- 进入 xiuxian-plugin 目录

```sh
cd ./xiuxian-plugin
```

- 安装依赖

```sh
npm install yarn -g
yarn
```

or

```sh
npm install pnpm -g
pnpm install
```

or

```sh
npm install cnpm -g
cnpm install
```

- 执行打包

```sh
npm run build
```

打包后生产 `index.js`

## 更新

- xiuxian-plugin 目录中执行

```sh
git pull
```

- 加载更新脚本

```sh
npm run update
```

- 执行打包

```sh
npm run build
```

## 功能演示

> 2024-4-4 更新

![替代文本](./resources/demo/dark.jpg)

![替代文本](./resources/demo/blue.jpg)

![替代文本](./resources/demo/red.jpg)

## 联系

QQ-Group 806943302
