import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxForum extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)虚空栈$/, fnc: 'searchForum' },
        { reg: /^(#|\/)喇叭.*$/, fnc: 'pushForum' }
      ]
    })
  }
  searchForum = async (e) => {
    if (!this.verify(e)) return false
    const msg = []
    const Forum = GameApi.UserData.controlActionInitial({
      NAME: 'forum',
      CHOICE: 'generate_forum',
      INITIAL: []
    })
    for (let item of Forum) {
      msg.push(`[${item.UID}]\n${item.content}`)
    }
    BotApi.User.forwardMsgSurveySet({ e, data: msg })
    return false
  }
  pushForum = async (e) => {
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const content = e.msg.replace(/^(#|\/)喇叭/, '')
    if (content == undefined || content == '' || content.length > 50) {
      e.reply('内容最多50个字!')
      return false
    }
    const TheDate = new Date()
    const Forum = GameApi.UserData.controlActionInitial({
      NAME: 'forum',
      CHOICE: 'generate_forum',
      INITIAL: []
    })
    Forum.unshift({
      UID,
      content,
      number: TheDate.getTime()
    })
    if (Forum.length >= 5) {
      Forum.pop()
    }
    GameApi.UserData.controlActionInitial({
      NAME: 'forum',
      CHOICE: 'generate_forum',
      DATA: Forum,
      INITIAL: []
    })
    this.searchForum(e)
    return false
  }
}
