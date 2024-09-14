import React from 'react'
import { createRequire, render } from 'react-puppeteer'
import { dirname } from 'node:path'
import {
  Bag as BagComponent,
  Equipment as EquipmentComponent,
  Hello as HelloComponent,
  Message as MessageComponent,
  LeaderBoard as LeaderBoardComponent,
  LevelList as LevelListComponent,
  Shopping as ShoppingComponent,
  Exchange as ExchangeComponent,
  Skill as KillComponent,
  MsgList as MsgListComponent,
  Association as AssociationComponent
} from '../component/index.ts'
import Redis from '@/model/redis.ts'
import { UserMessageType } from '@/model/types.ts'
import { LeaderBoardDataType } from '../component/leaderboard.tsx'
import { ExchangeDataType } from '../component/exchange.tsx'
import { AssociationType } from '@/model/association.ts'
import { DB } from '@/model/db-system.ts'

//
const require = createRequire(import.meta.url)
//
const Paths = {
  '@xiuxian': dirname(require('../../README.md'))
}
//
const RootLink = () => {
  // 引入解析后的 css
  return <link rel="stylesheet" href={require('../../public/output.css')} />
}

class Image {
  /**
   *  hello
   * @param _
   * @param name
   * @returns
   */
  hello() {
    return render({
      join_dir: 'hello',
      html_name: 'help.html',
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
    return render({
      join_dir: 'message',
      html_name: `${uid}.html`,
      html_head: <RootLink />,
      html_body: <MessageComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root.css`)]
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
    return render({
      join_dir: 'kill',
      html_name: `${uid}.html`,
      html_head: <RootLink />,
      html_body: <KillComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root.css`)]
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
    return render({
      join_dir: 'equipment',
      html_name: `${uid}.html`,
      html_head: <RootLink />,
      html_body: <EquipmentComponent data={data} status={status} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root.css`)]
    })
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async shopping(data: UserMessageType, uid: number) {
    return render({
      join_dir: 'shopping',
      html_name: `${uid}.html`,
      html_head: <RootLink />,
      html_body: <ShoppingComponent data={data} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root.css`)]
    })
  }

  /**
   *
   * @param data
   * @param uid
   * @returns
   */
  async bag(data: UserMessageType, uid: number) {
    return render({
      join_dir: 'bag',
      html_name: `${uid}.html`,
      html_head: <RootLink />,
      html_body: <BagComponent data={data} />,
      file_paths: Paths,
      html_files: [require(`../../resources/css/root.css`)]
    })
  }

  async leaderBoard(data: LeaderBoardDataType) {
    return render({
      join_dir: 'leaderBoard',
      html_name: `leaderBoard.html`,
      html_head: <RootLink />,
      html_body: <LeaderBoardComponent {...data} />,
      file_paths: Paths
    })
  }

  async exchange(data: ExchangeDataType) {
    return render({
      join_dir: 'exchange',
      html_name: `exchange.html`,
      html_head: <RootLink />,
      html_body: <ExchangeComponent {...data} />,
      file_paths: Paths
    })
  }

  async levelList(data: Array<number>) {
    return render({
      join_dir: 'levelList',
      html_name: `levelList.html`,
      html_head: <RootLink />,
      html_body: <LevelListComponent list={data} />
    })
  }

  async msgList(
    data: { group: number; msg: string; uid: number | string }[] | string[]
  ) {
    return render({
      join_dir: 'msgList',
      html_name: `msgList.html`,
      html_head: <RootLink />,
      html_body: <MsgListComponent list={data} />
    })
  }

  async association(data: AssociationType) {
    const master = await DB.findOne(data.master)
    return render({
      join_dir: 'association',
      html_name: `association.html`,
      html_head: <RootLink />,
      html_body: <AssociationComponent data={data} master={master} />
    })
  }
}

/**
 *
 */
export default new Image()
