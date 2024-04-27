import React from 'react'
import { UserMessageType } from '../model/types.js'
import { getEquipmentById } from '../model/equipment.js'
import { getSkillById } from '../model/skills.js'
import HeaderComponent from './header.js'
import _ from './url.js'

type ComponentType = {
  data: UserMessageType
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
  acount: number
}

// 路径深度

export default function App({ data }: ComponentType) {
  const datas: DatasType[] = []

  for (const item in data.bags.equipments) {
    const db = getEquipmentById(Number(item))
    datas.push({
      ...db,
      acount: data.bags.equipments[item]
    })
  }

  const kills = Object.keys(data.bags.kills).map((item) => {
    const db = getSkillById(Number(item))
    return {
      ...db,
      acount: data.bags.kills[item]
    }
  })

  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/root.css')}></link>
        <link rel="stylesheet" href={_(`css/root-${data.theme}.css`)}></link>
        <link rel="stylesheet" href={_(`css/nav.css`)}></link>
        <link rel="stylesheet" href={_(`css/bag.css`)}></link>
      </head>
      <body>
        <div id="root">
          <div className="nav">
            <HeaderComponent />
          </div>

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
                        <span className="nav-box-item-font">{item.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/efficiency.svg')}
                        />
                        <span className="nav-box-item-font">
                          {item.efficiency}
                        </span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/money.svg')}
                        />
                        <span className="nav-box-item-font">{item.price}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src={_('svg/acount.svg')}
                        />
                        <span className="nav-box-item-font">{item.acount}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {datas.length > 0 && (
            <div className="equiment">
              <div className="equiment-box">
                <span className="menu-button-flat">#装备信息</span>
                {datas.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="equiment-box-item">
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/equitment.svg')}
                          />
                          <span className="nav-box-item-font">{item.name}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/acount.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.acount}
                          </span>
                        </div>
                      </div>
                      <div className="equiment-box-item">
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/attack.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.attack}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/defense.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.defense}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/blood.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.blood}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/agile.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.agile}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/critical_hit_rate.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.critical_hit_rate}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/critical_damage.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.critical_damage}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src={_('svg/money.svg')}
                          />
                          <span className="nav-box-item-font">
                            {item.price}
                          </span>
                        </div>
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
