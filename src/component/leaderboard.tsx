import React from 'react'

export type LeaderboardDataType = {
  type: string
  list: Array<any>
}

export default function App(data: LeaderboardDataType) {
  return (
    <div id="root">
      <h1>{data.type}</h1>
      {data.list.map((item: any, index: number) => {
        return (
          <p key={index}>
            {'第' + (index + 1) + '名：' + item.name}
            <span>{'灵石：' + item.money}</span>
          </p>
        )
      })}
    </div>
  )
}
