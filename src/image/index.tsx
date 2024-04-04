import React from 'react'
import { renderToString } from 'react-dom/server'
import { Puppeteer } from './puppeteer.ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../config.ts'
// component
import HelloComponent from '../component/hellox.tsx'
import MessageComponent from '../component/message.tsx'
import { UserMessageType } from '../model/types.ts'
import Redis from '../model/redis.ts'
class Component {
  pup: typeof Puppeteer.prototype
  dir = ''
  constructor(dir: string) {
    this.pup = new Puppeteer()
    this.dir = dir
    mkdirSync(this.dir, {
      recursive: true
    })
  }
  /**
   * 渲染字符串
   * @param element
   * @param name
   * @returns
   */
  create(element: React.ReactNode, dirr: string, name: string) {
    const html = renderToString(element)
    const dir = join(this.dir, dirr)
    mkdirSync(dir, {
      recursive: true
    })
    const address = join(dir, name)
    writeFileSync(address, `<!DOCTYPE html>${html}`)
    return address
  }
  /**
   *  hello
   * @param _
   * @param name
   * @returns
   */
  hello() {
    return this.pup.render(
      this.create(<HelloComponent />, 'hello', 'help.html')
    )
  }
  /**
   * 用户消息
   * @param data
   * @param name
   * @returns
   */
  async message(data: UserMessageType, uid: number) {
    const state = await Redis.get('biguan', data.uid)
    const status = state?.type ? true : false
    return this.pup.render(
      this.create(
        <MessageComponent data={data} status={status} />,
        'message',
        `${uid}.html`
      )
    )
  }
}
export default new Component(join(cwd, 'resources', 'cache'))
