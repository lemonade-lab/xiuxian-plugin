import React from 'react'
import { UserMessageType } from '../model/types'
import NavMessage from './nav.jsx'
import { getLevelById } from '../model/level.js'
import { SkillNameMap } from '../model/base.js'
import { getEquipmentById } from '../model/equipment.js'
import _ from './url.js'

type ComponentType = {
  data: UserMessageType
  status: null | boolean
}

export default function App({ data, status }: ComponentType) {
  const level = getLevelById(data.level_id)

  const equipment = {
    attack: 0,
    defense: 0,
    agile: 0,
    critical_hit_rate: 0,
    critical_damage: 0,
    blood: 0
  }

  for (const KEY in data.equipments) {
    // 这个key 没有 标记
    if (data.equipments[KEY] === null) continue
    // 有标记
    const db = getEquipmentById(Number(data.equipments[KEY]))
    for (const key in db) {
      equipment[key] = db[key]
    }
  }

  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  const power = attack + Math.floor(defense / 2) + Math.floor(blood / 3)

  // 敏捷
  const agile = equipment.agile
  // 暴击率
  const critical_hit_rate = equipment.critical_hit_rate
  // 暴击伤害
  const critical_damage = equipment.critical_damage

  const kills: string[] = Object.keys(data.kills)

  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/root.css')}></link>
        <link rel="stylesheet" href={_(`css/root-${data.theme}.css`)}></link>
        <link rel="stylesheet" href={_(`css/nav.css`)}></link>
        <link rel="stylesheet" href={_(`css/message.css`)}></link>
      </head>
      <body>
        <div id="root">
          <NavMessage
            data={data}
            power={power}
            now={data.blood}
            blood={blood}
            status={status}
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
                <img className="nav-box-item-img" src={_('svg/attack.svg')} />
                <span>{attack}</span>
                <span className="level-box-item-font">{`(+${+data.base
                  .attack})`}</span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src={_('svg/defense.svg')} />
                <span>{`${defense}`}</span>
                <span className="level-box-item-font">
                  {`(+${data.base.defense})`}
                </span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src={_('svg/blood.svg')} />
                <span>{`${blood}`}</span>
                <span className="level-box-item-font">
                  {`(+${data.base.blood})`}
                </span>
              </div>
              <div className="level-box-item">
                <img className="nav-box-item-img" src={_('svg/agile.svg')} />
                <span>{`${agile}`}</span>
              </div>
              <div className="level-box-item">
                <img
                  className="nav-box-item-img"
                  src={_('svg/critical_hit_rate.svg')}
                />
                <span>{`${critical_hit_rate}`}</span>
              </div>
              <div className="level-box-item">
                <img
                  className="nav-box-item-img"
                  src={_('svg/critical_damage.svg')}
                />
                <span>{`${critical_damage}`}</span>
              </div>
            </div>
          </div>
          {kills.length > 0 && (
            <div className="kills">
              <div className="kills-box">
                {kills.map((item, index) => (
                  <span key={index}>《{SkillNameMap[item]}》 </span>
                ))}
                <span className="menu-button-flat">#功法信息</span>
              </div>
            </div>
          )}
          <div className="box-help">
            <div className="box-help-box">
              <span className="menu-button-flat">修仙小助手</span>
              <span className="menu-button">#采矿</span>
              <span className="menu-button">#突破</span>
              <span className="menu-button">#闭关</span>
              <span className="menu-button">#出关</span>
              <span className="menu-button">#储物袋</span>
              <span className="menu-button">#万宝楼</span>
              <span className="menu-button">#打劫@道友</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
