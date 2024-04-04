import React from 'react'
import { UserMessageType } from '../model/types'
import { LevelNameMap } from '../model/level'
export default function App({ data }: { data: UserMessageType }) {
  const max = data.level.blood + data.equipment.blood
  const now = data.blood
  const pro = Math.floor((now / max) * 100)
  const color = `linear-gradient(to right, #f3d109d9 ${pro}%, #ff0000d9 ${pro}%)`
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
              <span className="nav-menu-title">修仙之练气十万年</span>
              <span className="menu-button">#再入仙途</span>
              <span className="menu-button">#更换主题</span>
              <span className="menu-button">#突破</span>
              <span className="menu-button">#闭关</span>
              <span className="menu-button">#出关</span>
            </div>
            <div className="nav-box">
              <span className="menu-button-flat">#个人信息</span>
              <div>
                <div className="nav-box-item">
                  <img className="nav-box-item-img" src="../../svg/name.svg" />
                  <span>{data.name}</span>
                </div>

                <div className="nav-box-item">
                  <img className="nav-box-item-img" src="../../svg/level.svg" />
                  <span>{LevelNameMap[data.level_id]}</span>
                </div>
                <div className="nav-box-item">
                  <img
                    className="nav-box-item-img"
                    src="../../svg/experience.svg"
                  />
                  <span>{data.experience}</span>
                </div>
                <div className="nav-box-item">
                  <img className="nav-box-item-img" src="../../svg/money.svg" />
                  <span>{data.money}</span>{' '}
                </div>
              </div>
              <div className="nav-box-avatar">
                <img
                  className="nav-box-img"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.uid}`}
                />
                <div className="nav-box-uid">{data.uid}</div>
              </div>
              <div
                className="nav-box-blool"
                style={{
                  background: color
                }}
              >
                {`${now}/${max}-${pro}%`}
              </div>
            </div>
          </div>
          <div className="autograph">
            <div className="autograph-box">
              <span>{data.autograph}</span>
              <span className="menu-button-flat">#签名+字符</span>
            </div>
          </div>
          <div className="level">
            <div className="level-box">
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/attack.svg" />
                {data.level.attack}
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/defense.svg" />
                {data.level.defense}
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/blood.svg" />
                {data.level.blood}
              </div>
              <span className="menu-button-flat">#装备信息</span>
            </div>
          </div>
          <div className="box-help">
            <div className="box-help-box">
              <span className="menu-button-flat">*修仙帮助</span>
              <span className="menu-button">#改名+字符</span>
              <span className="menu-button">#商店</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
