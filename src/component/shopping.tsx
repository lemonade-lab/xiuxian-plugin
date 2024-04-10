import React from 'react'
import { UserMessageType } from '../model/types.js'
import { getEuipmentById } from '../model/equipment.js'
import { EquipmentNameMap, KillNameMap } from '../model/base.js'
import { getKillById } from '../model/kills.js'

import HeaderComponent from './header.js'

type ComponentType = {
  data: UserMessageType
}

// 路径深度
const _ = (src: string) => `../../${src}`

export default function App({ data }: ComponentType) {
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

  let max = (data.level_id + 1) * 3
  let i = 0

  for (const item in EquipmentNameMap) {
    i++
    datas.push(getEuipmentById(Number(item)))
    if (i >= max) break
  }

  const kills: string[] = Object.keys(KillNameMap)

  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/root.css')}></link>
        <link rel="stylesheet" href={_(`css/root-${data.theme}.css`)}></link>
        <link rel="stylesheet" href={_(`css/nav.css`)}></link>
        <link rel="stylesheet" href={_(`css/shoppping.css`)}></link>
      </head>
      <body>
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
                  const data = getKillById(Number(item))
                  return (
                    <div key={index} className="kills-box-item">
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/kills.svg"
                        />
                        <span className="nav-box-item-font">{data.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/efficiency.svg"
                        />
                        <span className="nav-box-item-font">
                          {data.efficiency}
                        </span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/money.svg"
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
            <div className="equiment">
              <div className="equiment-box">
                <span className="menu-button-flat">武器</span>
                {datas.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="equiment-box-item">
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/equitment.svg"
                          />
                          <span className="nav-box-item-font">{item.name}</span>
                        </div>
                      </div>
                      <div className="equiment-box-item">
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/attack.svg"
                          />
                          <span className="nav-box-item-font">
                            {item.attack}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/defense.svg"
                          />
                          <span>{item.defense}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/blood.svg"
                          />
                          <span className="nav-box-item-font">
                            {item.blood}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/agile.svg"
                          />
                          <span className="nav-box-item-font">
                            {item.agile}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/critical_hit_rate.svg"
                          />
                          <span className="nav-box-item-font">
                            {item.critical_hit_rate}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/critical_damage.svg"
                          />
                          <span className="nav-box-item-font">
                            {item.critical_damage}
                          </span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/money.svg"
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
