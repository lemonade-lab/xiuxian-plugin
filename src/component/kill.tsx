import React from 'react'
import { UserMessageType } from '../model/types.js'
import NavMessage from './nav.js'
import { getLevelById } from '../model/level.js'
import { getKillById } from '../model/kills.js'
import { getEuipmentById } from '../model/equipment.js'

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

  const equipments = Object.keys(data.equipments)
  for (const ID of equipments) {
    const data = getEuipmentById(Number(ID))
    for (const key in data) {
      equipment[key] = data[key]
    }
  }

  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  const power = attack + Math.floor(defense / 2) + Math.floor(blood / 3)

  const kills: string[] = Object.keys(data.kills)

  return (
    <html>
      <head>
        <link rel="stylesheet" href="../../css/root.css"></link>
        <link rel="stylesheet" href={`../../css/root-${data.theme}.css`}></link>
        <link rel="stylesheet" href="../../css/nav.css"></link>
        <link rel="stylesheet" href="../../css/kill.css"></link>
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
                  const data = getKillById(Number(item))
                  return (
                    <div key={index} className="kills-box-item">
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/kills.svg"
                        />
                        <span>{data.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/efficiency.svg"
                        />
                        <span>{data.efficiency}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/money.svg"
                        />
                        <span>{data.price}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  )
}
