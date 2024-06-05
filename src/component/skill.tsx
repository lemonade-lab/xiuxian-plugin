import React from 'react'
import { UserMessageType } from '../model/types.js'
import NavMessage from './nav.js'
import { getLevelById } from '../model/level.js'
import { getSkillById } from '../model/skills.js'
import { getEquipmentById } from '../model/equipment.js'
import _ from './url.js'

type ComponentType = {
  data: UserMessageType
  status?: null | boolean
}

export default function App({ data, status = false }: ComponentType) {
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

  const kills = Object.keys(data.kills).map((item) =>
    getSkillById(Number(item))
  )

  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/output.css')}></link>
        <link rel="stylesheet" href={_('css/root.css')}></link>
        <link rel="stylesheet" href={_(`css/root-${data.theme}.css`)}></link>
        <link rel="stylesheet" href={_(`css/nav.css`)}></link>
        <link rel="stylesheet" href={_(`css/skill.css`)}></link>
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
          {kills.length > 0 && (
            <div className="kills">
              <div className="kills-box">
                <span className="menu-button-flat">#功法信息</span>
                {kills.map((item, index) => {
                  return (
                    <div key={index} className="kills-box-item">
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/skills.svg')}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/efficiency.svg')}
                        />
                        <span>{item.efficiency}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/money.svg')}
                        />
                        <span>{item.price}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="box-help">
            <div className="box-help-box">
              <span className="menu-button-flat">修仙小助手</span>
              <span className="menu-button">#学习+功法名</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
