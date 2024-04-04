import React from 'react'
import { UserMessageType } from '../model/types'
import { LevelNameMap } from '../model/level'
export default function App({ data }: { data: UserMessageType }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../../css/root.css"></link>
        <link rel="stylesheet" href={`../../css/root-${data.theme}.css`}></link>
        <link rel="stylesheet" href="../../css/message.css"></link>
      </head>
      <body>
        <div id="root">
          <div className="nav">
            <div className="nav-menu">
              <span className="nav-menu-title">修仙之练气十万年</span>{' '}
              <span className="menu-button">#再入仙途</span>
              <span className="menu-button">#更换主题</span>
            </div>
            <div className="nav-box">
              <div>
                <div>UID：{data.uid}</div>
                <div>
                  <span>昵称：{data.name}</span>
                  <span className="menu-button">#更名+字符</span>
                </div>
                <div>
                  <span>境界：{LevelNameMap[data.level_id]}</span>
                  <span className="menu-button">#突破</span>
                </div>
                <div>
                  修为：{data.experience}{' '}
                  <span className="menu-button">#闭关</span>
                </div>
                <div>
                  灵石：{data.money} <span className="menu-button">#商店</span>
                </div>
              </div>
              <img
                className="nav-box-avatar"
                src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.uid}`}
              ></img>
            </div>
          </div>
          <div className="autograph">
            <div className="autograph-box">
              道宣：{data.autograph}{' '}
              <span className="menu-button">#签名+字符</span>
            </div>
          </div>
          <div className="level">
            <div className="level-box">
              <div>攻击：{data.level.attack}</div>
              <div>防御：{data.level.defense}</div>
              <div>血量：{data.level.blood}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
