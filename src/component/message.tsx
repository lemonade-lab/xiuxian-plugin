import React from 'react'
import { UserMessageType } from '../model/types'
export default function App({ data }: { data: UserMessageType }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/message.css"></link>
      </head>
      <body>
        <div id="root">
          <div>昵称：{data.uid}</div>
          <div>昵称：{data.name}</div>
          <div>道宣：{data.autograph}</div>
          <div>攻击: {data.level.attack}</div>
          <div>防御: {data.level.defense}</div>
          <div>血量: {data.level.blood}</div>
        </div>
      </body>
    </html>
  )
}
