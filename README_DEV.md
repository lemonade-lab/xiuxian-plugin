## 开发指南

### 开发

开发环境 https://lvyjs.dev/

开发文档 https://alemonjs.com/

```
xiuxian-plugin/
├── frontend/          # 前端React应用
│   ├── src/
│   │   ├── api/       # API接口
│   │   ├── components/ # 通用组件
│   │   ├── contexts/   # React Context
│   │   ├── pages/      # 页面组件
│   │   └── ...
│   └── ...
├── src/               # 后端源码
│   ├── model/         # 数据模型
│   ├── route/         # API路由
│   └── ...
└── ...
```

```sh
git clone --depth=10  https://github.com/xiuxianjs/xiuxian-plugin.git
```

```sh
yarn install
```

```sh
yarn dev
```

> 可在vscode中安装alemonjs扩展以支持沙河环境登录

> [ALemonTestOne](https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone)

- 启动图片开发工具

> 请先触发图片对应指令，生产mock数据后进行

```sh
yarn view
```

- 启动管理端

```sh
yarn bundle-dev
```

> http://127.0.0.1:17187/app/

默认账号密码 lemonade、123456

### 建立开发分支

github actoins > 开发分支 > run workflow

### 创建PR分支

```sh
git branch for/dev-XXX-XX dev-XXX-XXX/1  # 基于dev创建自己的待PR分支
git checkout for/dev-XXX-XX/1 # 切换到待PR分支
```

### 本地开发

```sh
npm install yarn@1.19.1 -g
yarn dev
```

### 提交PR

```sh
git add . # 选择所有更改
git commit -m "update: XXX"  # 提交信息
git push origin HEAD:for/dev-xxx-xxx/1 # 提交到待PR分支
```
