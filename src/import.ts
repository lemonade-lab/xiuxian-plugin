import { Plugin as plugin } from 'yunzai/core'
import { EventMap,type GroupMessage } from 'icqq'
// const common = (await import('' + '../../lib/common/common.js')).default.default
export { plugin }

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
export const define: {
  name?: string
  dsc?: string
  event?: keyof EventMap
  priority?: number
} = {
  name: 'xiuxian',
  dsc: 'xiuxian',
  event: 'message',
  priority: 9999
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
