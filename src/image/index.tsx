import React from 'react'
import { render } from 'jsxp'
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
} from '@src/component/index.ts'
import Redis from '@src/model/redis.ts'
import { UserMessageType } from '@src/model/types.ts'
import { LeaderBoardDataType } from '@src/component/leaderboard.tsx'
import { ExchangeDataType } from '@src/component/exchange.tsx'
import { AssociationType } from '@src/model/association.ts'
import { DB } from '@src/model/db-system.ts'

class Image {
  /**
   *  hello
   * @param _
   * @param name
   * @returns
   */
  hello() {
    return render({
      path: 'hello',
      name: 'help.html',
      component: <HelloComponent />
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
      path: 'message',
      name: `${uid}.html`,
      component: <MessageComponent data={data} status={status} />
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
      path: 'kill',
      name: `${uid}.html`,
      component: <KillComponent data={data} status={status} />
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
      path: 'equipment',
      name: `${uid}.html`,
      component: <EquipmentComponent data={data} status={status} />
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
      path: 'shopping',
      name: `${uid}.html`,
      component: <ShoppingComponent data={data} />
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
      path: 'bag',
      name: `${uid}.html`,
      component: <BagComponent data={data} />
    })
  }

  async leaderBoard(data: LeaderBoardDataType) {
    return render({
      path: 'leaderBoard',
      name: `leaderBoard.html`,
      component: <LeaderBoardComponent {...data} />
    })
  }

  async exchange(data: ExchangeDataType) {
    return render({
      path: 'exchange',
      name: `exchange.html`,
      component: <ExchangeComponent {...data} />
    })
  }

  async levelList(data: Array<number>) {
    return render({
      path: 'levelList',
      name: `levelList.html`,

      component: <LevelListComponent list={data} />
    })
  }

  async msgList(
    data: { group: number; msg: string; uid: number | string }[] | string[]
  ) {
    return render({
      path: 'msgList',
      name: `msgList.html`,

      component: <MsgListComponent list={data} />
    })
  }

  async association(data: AssociationType) {
    const master = await DB.findOne(data.master)
    return render({
      path: 'association',
      name: `association.html`,
      component: <AssociationComponent data={data} master={master} />
    })
  }
}

export default new Image()
