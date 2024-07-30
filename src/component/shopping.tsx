import React from 'react'
import { UserMessageType } from '../model/types.js'
import { getEquipmentById } from '../model/equipment.js'
import { EquipmentNameMap, SkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import HeaderComponent from './header.js'

type ComponentType = {
  data: UserMessageType
}

type DataType = {
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

export default function App({ data }: ComponentType) {
  const datas: DataType[] = []

  const max = (data.level_id + 1) * 3
  let i = 0

  for (const item in EquipmentNameMap) {
    i++
    datas.push(getEquipmentById(Number(item)))
    if (i >= max) break
  }

  const kills: string[] = Object.keys(SkillNameMap)

  return (
    <div id="root">
      <div className="nav">
        <HeaderComponent />
      </div>

      <div className="box-help">
        <div className="box-help-box">
          <span className="menu-button-flat">万宝楼</span>
          <span className="menu-button">#购买武器+武器名</span>
          <span className="menu-button">#购买功法+功法名</span>
        </div>
      </div>

      {kills.length > 0 && (
        <div className="kills">
          <div className="kills-box">
            <span className="menu-button-flat">功法</span>
            {kills.map((item, index) => {
              const data = getSkillById(Number(item))
              return (
                <div key={index} className="kills-box-item">
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/skills.svg')}
                    />
                    <span className="nav-box-item-font">{data.name}</span>
                  </div>
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/efficiency.svg')}
                    />
                    <span className="nav-box-item-font">{data.efficiency}</span>
                  </div>
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/money.svg')}
                    />
                    <span className="nav-box-item-font">{data.price}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {datas.length > 0 && (
        <div className="equipment">
          <div className="equipment-box">
            <span className="menu-button-flat">武器</span>
            {datas.map((item, index) => {
              return (
                <div key={index}>
                  <div className="equipment-box-item">
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/equitment.svg')}
                      />
                      <span className="nav-box-item-font">{item.name}</span>
                    </div>
                  </div>
                  <div className="equipment-box-item">
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/attack.svg')}
                      />
                      <span className="nav-box-item-font">{item.attack}</span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/defense.svg')}
                      />
                      <span>{item.defense}</span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/blood.svg')}
                      />
                      <span className="nav-box-item-font">{item.blood}</span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/agile.svg')}
                      />
                      <span className="nav-box-item-font">{item.agile}</span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/critical_hit_rate.svg')}
                      />
                      <span className="nav-box-item-font">
                        {item.critical_hit_rate}
                      </span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/critical_damage.svg')}
                      />
                      <span className="nav-box-item-font">
                        {item.critical_damage}
                      </span>
                    </div>
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/money.svg')}
                      />
                      <span className="nav-box-item-font">{item.price}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
