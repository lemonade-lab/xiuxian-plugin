import React from 'react'
import { createRequire } from 'module'
import { Picture } from 'yunzai/utils'
import { UserMessageType } from '../model/types.ts'
import Redis from '../model/redis.ts'
import HelloComponent from '../component/hello.tsx'
import MessageComponent from '../component/message.tsx'
import KillComponent from '../component/skill.tsx'
import EquipmentComponent from '../component/equipment.tsx'
import ShoppingComponent from '../component/shopping.tsx'
import BagComponent from '../component/bag.tsx'
import { dirname } from 'node:path'
const require = createRequire(import.meta.url)
const Paths = {
  "@xiuxian": dirname(require('../../README.md')),
}

class Image extends Picture {
  constructor() {
    super()
    // start
    this.Pup.start()
  }

  /**
   *  hello
   * @param _
   * @param name
   * @returns
   */
  hello() {
    const Address = this.Com.create(<HelloComponent />, {
      join_dir: 'hello',
      html_name: 'help.html',
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/hello.css')}></link>
        </>
      ),
    })
    return this.Pup.render(Address)
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
    const Address = this.Com.create(<MessageComponent data={data} status={status} />, {
      join_dir: 'message',
      html_name: `${uid}.html`,
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/root.css')}></link>
          <link rel="stylesheet" href={require(`../../resources/css/nav.css`)}></link>
          <link rel="stylesheet" href={require(`../../resources/css/message.css`)}></link>
        </>
      ),
      file_paths: Paths,
      'html_files': [require(`../../resources/css/root-${data.theme}.css`)]
    })
    return this.Pup.render(Address)
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
    const Address = this.Com.create(<KillComponent data={data} status={status} />, {
      join_dir: 'kill',
      html_name: `${uid}.html`,
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/root.css')}></link>
          <link rel="stylesheet" href={require(`../../resources/css/nav.css`)}></link>
          <link rel="stylesheet" href={require(`../../resources/css/skill.css`)}></link>
        </>
      ),
      file_paths: Paths,
      'html_files': [require(`../../resources/css/root-${data.theme}.css`)]
    })
    return this.Pup.render(Address)
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
    const Address = this.Com.create(<EquipmentComponent data={data} status={status} />, {
      join_dir: 'equipment',
      html_name: `${uid}.html`,
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/root.css')}></link>
          <link rel="stylesheet" href={require(`../../resources/css/nav.css`)}></link>
          <link rel="stylesheet" href={require(`../../resources/css/equiment.css`)}></link>
        </>
      ),
      file_paths: Paths,
      'html_files': [require(`../../resources/css/root-${data.theme}.css`)]
    })
    return this.Pup.render(Address)
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async shopping(data: UserMessageType, uid: number) {
    const Address = this.Com.create(<ShoppingComponent data={data} />, {
      join_dir: 'shopping',
      html_name: `${uid}.html`,
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/root.css')}></link>
          <link rel="stylesheet" href={require(`../../resources/css/nav.css`)}></link>
          <link rel="stylesheet" href={require(`../../resources/css/shoppping.css`)}></link>
        </>
      ),
      file_paths: Paths,
      'html_files': [require(`../../resources/css/root-${data.theme}.css`)]
    })
    return this.Pup.render(Address)
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async bag(data: UserMessageType, uid: number) {
    const Address = this.Com.create(<BagComponent data={data} />, {
      join_dir: 'bag',
      html_name: `${uid}.html`,
      html_head: this.Com.render(
        <>
          <link rel="stylesheet" href={require('../../resources/css/root.css')}></link>
          <link rel="stylesheet" href={require(`../../resources/css/nav.css`)}></link>
          <link rel="stylesheet" href={require(`../../resources/css/bag.css`)}></link>
        </>
      ),
      file_paths: Paths,
      'html_files': [require(`../../resources/css/root-${data.theme}.css`)]
    })
    return this.Pup.render(Address)
  }

}

/**
 * 
 */
export default new Image()
