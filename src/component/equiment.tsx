import React from 'react'
import { UserMessageType } from '../model/types.js'
import NavMessage from './nav.js'
import { getLevelById } from '../model/level.js'
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

  const datas: {
    id: number
    name: any
    attack: number
    defense: number
    blood: number
    agile: number
    critical_hit_rate: number
    critical_damage: number
    price: number
  }[] = []

  for (const ID of equipments) {
    const data = getEuipmentById(Number(ID))
    datas.push(data)
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
        <link rel="stylesheet" href="../../css/equiment.css"></link>
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
          {datas.length > 0 && (
            <div className="kills">
              <div className="kills-box">
                <span className="menu-button-flat">#功法信息</span>
                {datas.map((item, index) => {
                  return (
                    <div key={index} className="kills-box-item">
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/equitment.svg"
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/attack.svg"
                        />
                        <span>{item.attack}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/defense.svg"
                        />
                        <span>{item.defense}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/blood.svg"
                        />
                        <span>{item.blood}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/agile.svg"
                        />
                        <span>{item.agile}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/critical_hit_rate.svg"
                        />
                        <span>{item.critical_hit_rate}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/critical_damage.svg"
                        />
                        <span>{item.critical_damage}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/money.svg"
                        />
                        <span>{item.price}</span>
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
