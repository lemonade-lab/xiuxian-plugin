# 喵仔修仙插件

> 这是一款为喵仔设计的修仙插件，使用 ts 和 tsx 进行编写。在使用前,需要进行编译后才能使用

![替代文本](./resources/demo/purple.jpg)

## 部署

- 安装项目

```sh
#  miao-yunzai 目录
git clone  --depth=1 https://gitee.com/ningmengchongshui/xiuxian-plugin.git ./plugins/xiuxian-plugin
# 进入xiuxian
cd ./plugins/xiuxian-plugin
```

```sh
# 或者 plugins 目录中执行
cd ./plugins
git clone  --depth=1 https://gitee.com/ningmengchongshui/xiuxian-plugin.git
# 进入xiuxian
cd ./xiuxian-plugin
```

- 安装依赖

```sh
npm install yarn -g
yarn
```

```sh
# 或者
npm install pnpm -g
pnpm install
```

```sh
# 或者
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

## 开发

- 启动 WEB 管理器

```sh
npm run koa:dev
npm run vite:dev
```

后端地址 `http://localhost:9090/api`

前端地址 `http://localhost:5173/`

- 启动图片热开发

```sh
npm run image:dev
```

访问地址 `http://localhost:8080/`

## 商用

> 该插件允许自由安装修改,插件内的素材部分来自网络,在商用前,请自行替换素材

> 该仓库有强烈的版权诉求,禁止除作者外,任意以仓库开发成员，团队名义或有损成员权益的行为作为商用噱头

## 联系

Bot Dev QQ-Group 806943302

Game Play QQ-Group 784310821
