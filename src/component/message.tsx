import React from 'react'
import { UserMessageType } from '../model/types'
import { LevelNameMap } from '../model/level'
export default function App({ data }: { data: UserMessageType }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../../css/message.css"></link>
      </head>
      <body>
        <div id="root">
          <div className="nav">
            <div className="nav-box">
              <div>{data.uid}</div>
              <div>昵称：{data.name}</div>
              <div>境界: {LevelNameMap[data.level_id]}</div>
              <div>灵石: {data.money}</div>
            </div>
          </div>
          <div className="autograph">
            <div className="autograph-box">道宣：{data.autograph}</div>
          </div>
          <div className="level">
            <div className="level-box">
              <div>攻击: {data.level.attack}</div>
              <div>防御: {data.level.defense}</div>
              <div>血量: {data.level.blood}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
