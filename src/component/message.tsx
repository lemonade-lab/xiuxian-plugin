import React from 'react'
import { UserMessageType } from '../model/types'
import NavMessage from './nav.jsx'

type ComponentType = {
  data: UserMessageType
}

export default function App({ data }: ComponentType) {
  // 修为 --- 战力指数
  const attack = data.level.attack + data.equipment.attack + data.base.attack
  const defense =
    data.level.defense + data.equipment.defense + data.base.defense
  const blood = data.level.blood + data.equipment.blood + data.base.blood
  const power = attack + Math.floor(defense / 2) + Math.floor(blood / 3)

  // 敏捷
  const agile = data.equipment.agile
  // 暴击率
  const critical_hit_rate = data.equipment.critical_hit_rate
  // 暴击伤害
  const critical_damage = data.equipment.critical_damage

  return (
    <html>
      <head>
        <link rel="stylesheet" href="../../css/root.css"></link>
        <link rel="stylesheet" href="../../css/nav.css"></link>
        <link rel="stylesheet" href={`../../css/root-${data.theme}.css`}></link>
        <link rel="stylesheet" href="../../css/message.css"></link>
      </head>
      <body>
        <div id="root">
          <NavMessage
            data={data}
            power={power}
            now={data.blood}
            blood={blood}
          />
          <div className="autograph">
            <div className="autograph-box">
              <span>{data.autograph}</span>
              <span className="menu-button-flat">#签名+字符</span>
            </div>
          </div>
          <div className="level">
            <div className="level-box">
              <span className="menu-button-flat">#装备信息</span>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/attack.svg" />
                <span>{attack}</span>
                <span className="level-box-item-font">{`(+${+data.base
                  .attack})`}</span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/defense.svg" />
                <span>{`${defense}`}</span>
                <span className="level-box-item-font">
                  {`(+${data.base.defense})`}
                </span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/blood.svg" />
                <span>{`${blood}`}</span>
                <span className="level-box-item-font">
                  {`(+${data.base.blood})`}
                </span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src="../../svg/agile.svg" />
                <span>{`${agile}`}</span>
              </div>
              <div className="level-box-item">
                <img
                  className="nav-box-item-img"
                  src="../../svg/critical_hit_rate.svg"
                />
                <span>{`${critical_hit_rate}`}</span>
              </div>
              <div className="level-box-item">
                <img
                  className="nav-box-item-img"
                  src="../../svg/critical_damage.svg"
                />
                <span>{`${critical_damage}`}</span>
              </div>
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
