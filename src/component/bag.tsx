import React from 'react'
import { UserMessageType } from '../model/types.js'
import { getEuipmentById } from '../model/equipment.js'
import { getKillById } from '../model/kills.js'
import HeaderComponent from './header.js'

type ComponentType = {
  data: UserMessageType
}

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
    acount: number
  }[] = []

  for (const item in data.bags.equipments) {
    const db = getEuipmentById(Number(item))
    datas.push({
      ...db,
      acount: data.bags.equipments[item]
    })
  }

  const kills = Object.keys(data.bags.kills).map((item) => {
    const db = getKillById(Number(item))
    return {
      ...db,
      acount: data.bags.kills[item]
    }
  })

  return (
    <html>
      <head>
        <link rel="stylesheet" href="../../css/root.css"></link>
        <link rel="stylesheet" href={`../../css/root-${data.theme}.css`}></link>
        <link rel="stylesheet" href="../../css/nav.css"></link>
        <link rel="stylesheet" href="../../css/bag.css"></link>
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
                          src="../../svg/kills.svg"
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/efficiency.svg"
                        />
                        <span>{item.efficiency}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/money.svg"
                        />
                        <span>{item.price}</span>
                      </div>
                      <div className="kills-box-item-j">
                        <img
                          className="nav-box-item-img"
                          src="../../svg/acount.svg"
                        />
                        <span>{item.acount}</span>
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
                            src="../../svg/equitment.svg"
                          />
                          <span>{item.name}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/acount.svg"
                          />
                          <span>{item.acount}</span>
                        </div>
                      </div>
                      <div className="equiment-box-item">
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/attack.svg"
                          />
                          <span>{item.attack}</span>
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
                          <span>{item.blood}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/agile.svg"
                          />
                          <span>{item.agile}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/critical_hit_rate.svg"
                          />
                          <span>{item.critical_hit_rate}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/critical_damage.svg"
                          />
                          <span>{item.critical_damage}</span>
                        </div>
                        <div className="equiment-box-item-j">
                          <img
                            className="nav-box-item-img"
                            src="../../svg/money.svg"
                          />
                          <span>{item.price}</span>
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
