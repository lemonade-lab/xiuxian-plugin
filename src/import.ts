const plugin = (await import('' + '../../lib/plugins/plugin.js')).default
// const common = (await import('' + '../../lib/common/common.js')).default.default
export { plugin }
import { type GroupMessage } from 'icqq'

// Yunzai-event
export interface Event extends GroupMessage {
  isMaster: boolean
  group: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recallMsg: (...arg) => any
  }
  msg: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reply: (...arg) => Promise<any>
}

//
export const define = {
  name: 'xiuxian',
  dsc: 'xiuxian',
  event: 'message',
  priority: 999
}

//
type MessageFunction = (e: Event) => Promise<boolean | undefined | void>

//
export class Messages {
  count = 0
  rule: {
    reg: RegExp
    fnc: string
  }[] = []
  response(reg: RegExp, fnc: MessageFunction) {
    this.count++
    const propName = `prop_${this.count}`
    this[propName] = fnc
    this.rule.push({
      reg,
      fnc: propName
    })
  }
  get ok() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const App = this
    class Children extends plugin {
      constructor() {
        super({
          ...define,
          rule: App.rule
        })
        for (const key of App.rule) {
          if (App[key.fnc] instanceof Function) {
            this[key.fnc] = App[key.fnc].bind(App)
          }
        }
      }
    }
    return Children
  }
}

export class Events {
  count = 0
  data: {
    [key: string]: typeof plugin
  } = {}
  use(val: typeof plugin) {
    this.count++
    this.data[this.count] = val
  }
  get ok() {
    return this.data
  }
}
