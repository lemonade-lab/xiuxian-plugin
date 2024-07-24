import React from 'react'
import { createRequire } from 'module'
import { Picture } from 'react-puppeteer'
import { UserMessageType } from '../model/types.ts'
import Redis from '../model/redis.ts'
import HelloComponent from '../component/hello.tsx'
import MessageComponent from '../component/message.tsx'
import KillComponent from '../component/skill.tsx'
import EquipmentComponent from '../component/equipment.tsx'
import ShoppingComponent from '../component/shopping.tsx'
import BagComponent from '../component/bag.tsx'
import LeaderboardComponent, {
  LeaderboardDataType
} from '../component/leaderboard.tsx'
import { dirname } from 'node:path'
//
const require = createRequire(import.meta.url)
//
const Paths = {
  '@xiuxian': dirname(require('../../README.md'))
}
//
const RootLink = () => {
  return (
    <>
      <link 
      rel="stylesheet" 
      href={require('../../resources/output.css')}></link>
      <link
        rel="stylesheet"
        href={require('../../resources/css/root.css')}
      ></link>
      <link
        rel="stylesheet"
        href={require(`../../resources/css/nav.css`)}
      ></link>
    </>
  )
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
    return this.screenshot({
      join_dir: 'hello',
      html_name: 'help.html',
      html_head: (
        <>
          <link
            rel="stylesheet"
            href={require('../../resources/css/hello.css')}
          ></link>
        </>
      ),
      html_body: <HelloComponent />
    })
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
    return this.screenshot({
      join_dir: 'message',
      html_name: `${uid}.html`,
      html_head: (
        <>
        <RootLink />
          <link
            rel="stylesheet"
            href={require(`../../resources/css/message.css`)}
          ></link>
        </>
      ),
      html_body: <MessageComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root-${data.theme}.css`)]
    })
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
    return this.screenshot({
      join_dir: 'kill',
      html_name: `${uid}.html`,
      html_head: (
        <>
         <RootLink />
          <link
            rel="stylesheet"
            href={require(`../../resources/css/skill.css`)}
          ></link>
        </>
      ),
      html_body: <KillComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root-${data.theme}.css`)]
    })
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
    return this.screenshot({
      join_dir: 'equipment',
      html_name: `${uid}.html`,
      html_head: (
        <>
         <RootLink />
          <link
            rel="stylesheet"
            href={require(`../../resources/css/equiment.css`)}
          ></link>
        </>
      ),
      html_body: <EquipmentComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root-${data.theme}.css`)]
    })
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async shopping(data: UserMessageType, uid: number) {
    return this.screenshot({
      join_dir: 'shopping',
      html_name: `${uid}.html`,
      html_head: (
        <>
          <RootLink />
          <link
            rel="stylesheet"
            href={require(`../../resources/css/shoppping.css`)}
          ></link>
        </>
      ),
      html_body: <ShoppingComponent data={data} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root-${data.theme}.css`)]
    })
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async bag(data: UserMessageType, uid: number) {
    return this.screenshot({
      join_dir: 'bag',
      html_name: `${uid}.html`,
      html_head: (
        <>
         <RootLink />
          <link
            rel="stylesheet"
            href={require(`../../resources/css/bag.css`)}
          ></link>
        </>
      ),
      html_body: <BagComponent data={data} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root-${data.theme}.css`)]
    })
  }

  async leaderboard(data: LeaderboardDataType) {
    return this.screenshot({
      join_dir: 'leaderboard',
      html_name: `leaderboard.html`,
      html_head: <><RootLink /></>,
      html_body: <LeaderboardComponent {...data} />,
      file_paths: Paths
    })
  }
}

/**
 *
 */
export default new Image()
