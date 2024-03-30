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
  create(element: React.ReactNode, name: string) {
    const html = renderToString(element)
    const address = join(this.dir, name)
    writeFileSync(address, `<!DOCTYPE html>${html}`)
    return address
  }
  /**
   *  hello
   * @param _
   * @param name
   * @returns
   */
  hello(_ = '', name: string = 'help.html') {
    return this.pup.render(this.create(<HelloComponent />, name))
  }
  /**
   * 用户消息
   * @param data
   * @param name
   * @returns
   */
  message(data: UserMessageType, name: string = 'help.html') {
    return this.pup.render(this.create(<MessageComponent data={data} />, name))
  }
}
export default new Component(join(cwd, 'resources', 'cache'))
