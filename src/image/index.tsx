import React from 'react'
import { renderToString } from 'react-dom/server'
import { Puppeteer } from './puppeteer.ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../config.ts'
// component
import HelloComponent from '../component/hellox.tsx'
import MessageComponent from '../component/message.tsx'
import KillComponent from '../component/kill.tsx'
import EquipmentComponent from '../component/equiment.tsx'
import ShoppingComponent from '../component/shopping.tsx'
import BagComponent from '../component/bag.tsx'
import AuctionComponent from '../component/auction.tsx'

import { UserMessageType } from '../model/types.ts'

import Redis from '../model/redis.ts'
class Component {
  [x: string]: any
  puppeteer: typeof Puppeteer.prototype
  #dir = ''
  constructor(dir: string) {
    this.puppeteer = new Puppeteer()
    this.#dir = dir
    mkdirSync(this.#dir, {
      recursive: true
    })
  }
  /**
   * 渲染字符串
   * @param element
   * @param name
   * @returns
   */
  create(element: React.ReactNode, dirs: string, name: string) {
    const html = renderToString(element)
    const dir = join(this.#dir, dirs)
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
    return this.puppeteer.render(
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
    const state = await Redis.get('door', data.uid)
    const status = state?.type !== null ? true : false
    return this.puppeteer.render(
      this.create(
        <MessageComponent data={data} status={status} />,
        'message',
        `${uid}.html`
      )
    )
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async kill(data: UserMessageType, uid: number) {
    const state = await Redis.get('door', data.uid)
    const status = state?.type !== null ? true : false
    return this.puppeteer.render(
      this.create(
        <KillComponent data={data} status={status} />,
        'kill',
        `${uid}.html`
      )
    )
  }
  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async equipment(data: UserMessageType, uid: number) {
    const state = await Redis.get('door', data.uid)
    const status = state?.type !== null ? true : false
    return this.puppeteer.render(
      this.create(
        <EquipmentComponent data={data} status={status} />,
        'equipment',
        `${uid}.html`
      )
    )
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async shopping(data: UserMessageType, uid: number) {
    return this.puppeteer.render(
      this.create(<ShoppingComponent data={data} />, 'shopping', `${uid}.html`)
    )
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async bag(data: UserMessageType, uid: number) {
    return this.puppeteer.render(
      this.create(<BagComponent data={data} />, 'bag', `${uid}.html`)
    )
  }

  /**
   *
   */
  async auction(data: UserMessageType, uid: number) {
    return this.puppeteer.render(
      this.create(<AuctionComponent data={data} />, 'auction', `${uid}.html`)
    )
  }
}
export default new Component(join(cwd, 'resources', 'cache'))
