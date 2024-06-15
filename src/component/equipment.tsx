import React from 'react'
import { UserMessageType } from '../model/types.js'
import NavMessage from './nav.js'
import { getLevelById } from '../model/level.js'
import { getEquipmentById } from '../model/equipment.js'
import { createRequire } from 'yunzai/utils'
const require = createRequire(import.meta.url)

type ComponentType = {
  data: UserMessageType
  status?: null | boolean
}

type DatasType = {
  id: number | string
  name: string
  attack: number
  defense: number
  blood: number
  agile: number
  critical_hit_rate: number
  critical_damage: number
  price: number
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

  const datas: DatasType[] = []

  for (const KEY in data.equipments) {
    // 这个key 没有 标记
    if (data.equipments[KEY] === null) continue
    // 有标记
    const db = getEquipmentById(Number(data.equipments[KEY]))
    datas.push(db)
    for (const key in db) {
      equipment[key] = db[key]
    }
  }

  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  const power = attack + Math.floor(defense / 2) + Math.floor(blood / 3)

  return (
    <div id="root">
    <NavMessage
      data={data}
      power={power}
      now={data.blood}
      blood={blood}
      status={status}
    />
    {datas.length > 0 && (
      <div className="equiment">
        <div className="equiment-box">
          <span className="menu-button-flat">#功法信息</span>
          {datas.map((item, index) => {
            return (
              <div key={index} className="equiment-box-item">
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/equitment.svg')}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/attack.svg')}
                  />
                  <span>{item.attack}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/defense.svg')}
                  />
                  <span>{item.defense}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/blood.svg')}
                  />
                  <span>{item.blood}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/agile.svg')}
                  />
                  <span className="nav-box-item-img">{item.agile}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/critical_hit_rate.svg')}
                  />
                  <span>{item.critical_hit_rate}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/critical_damage.svg')}
                  />
                  <span>{item.critical_damage}</span>
                </div>
                <div className="equiment-box-item-j">
                  <img
                    className="nav-box-item-img"
                    src={require('../../resources/svg/money.svg')}
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
        <span className="menu-button">#装备武器+武器名</span>
        <span className="menu-button">#卸下武器+武器名</span>
      </div>
    </div>
  </div>
  )
}
