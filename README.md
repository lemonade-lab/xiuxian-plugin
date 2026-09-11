# 修仙机器人

必要环境 `nodejs` 、`redis` 、`chrome`

## 使用

> 安装后使用 `/修仙帮助` 唤醒

主人专用指令 `/修仙扩展`

### 修仙管理

[http://localhost:17187/apps/alemonjs-xiuxian/ 🔗](http://localhost:17187/apps/alemonjs-xiuxian/)

默认账号密码 lemonade、123456

> 需配置 serverPort: 17187

### 核心配置

```yaml
# 若需要访问管理面板
serverPort: 17187
# 应用配置
alemonjs-xiuxian:
  # --- 验证码 ---
  # 检查是否是人机行为
  # 默认开启，若关闭可如下配置
  close_captcha: true
  # --- 定时任务 ---
  # 默认开启，若关闭如下配置
  open_task: false
  # --- 多机器人部署 ---
  # 如果同时启动多个机器人，
  # 请务必填写机器人账号 !!!
  botId: ''
  # ---- 主动消息 ---
  # 关闭主动消息（用于主动消息被限制的平台）
  # 当配置关闭时，
  # 玩家都可以使用 #我的消息 查看
  # 玩家可发送 #清理消息 来减少消息记录
  # 默认开启，若关闭可如下配置
  close_proactive_message: true
  # --- 赠送 ---
  # 开启赠送功能（包括普通赠送和一键赠送）
  # 默认关闭，如开启可如下配置
  open_give: true
```

## 其他版本

| Project          | Description            |
| ---------------- | ---------------------- |
| [yunzaijs/1.2]🔗 | yunzaijs 版 修仙v1.2   |
| [version/1.2]🔗  | yunzai-bot 版 修仙v1.2 |
| [version/1.3]🔗  | yunzai-bot 版 修仙v1.3 |

[yunzaijs/1.2]: https://github.com/xiuxianjs/xiuxian-plugin/tree/yunzaijs/1.2
[version/1.2]: https://github.com/xiuxianjs/xiuxian-plugin/tree/version/1.2
[version/1.3]: https://github.com/xiuxianjs/xiuxian-plugin/tree/version/1.3

## 贡献

<a href="https://github.com/xiuxianjs/xiuxian-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xiuxianjs/xiuxian-plugin" />
</a>
