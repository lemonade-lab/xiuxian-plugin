import React from 'react'
import { UserMessageType } from '../model/types.js'
import { getEquipmentById } from '../model/equipment.js'
import { getSkillById } from '../model/skills.js'
import HeaderComponent from './header.js'
import { createRequire } from 'module'
import { MedicineList } from '../model/medicine.js'
const require = createRequire(import.meta.url)
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
  account: number
}
// 路径深度
export default function App({ data }: ComponentType) {
  const datas: DataType[] = []

  data.bags
    .filter(item => item.type === 'equipment')
    .map(item => {
      const db = getEquipmentById(Number(item.id))
      datas.push({
        ...db,
        account: item.count
      })
    })

  const medicines = data.bags
    .filter(item => item.type === 'medicine')
    .map(item => {
      const i = MedicineList.find(i => i.id === Number(item.id))
      return {
        ...i,
        account: item.count
      }
    })

  const kills = data.bags
    .filter(item => item.type === 'skill')
    .map(item => {
      const db = getSkillById(Number(item.id))
      return {
        ...db,
        account: item.count
      }
    })
  return (
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
                      src={require('../../resources/svg/name.svg')}
                    />
                    <span className="nav-box-item-font">{item.name}</span>
                  </div>
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/efficiency.svg')}
                    />
                    <span className="nav-box-item-font">{item.efficiency}</span>
                  </div>
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/money.svg')}
                    />
                    <span className="nav-box-item-font">{item.price}</span>
                  </div>
                  <div className="kills-box-item-j">
                    <img
                      className="nav-box-item-img"
                      src={require('../../resources/svg/acount.svg')}
                    />
                    <span className="nav-box-item-font">{item.account}</span>
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
            <span className="menu-button-flat">#装备信息</span>
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
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/acount.svg')}
                      />
                      <span className="nav-box-item-font">{item.account}</span>
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
                      <span className="nav-box-item-font">{item.defense}</span>
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

      {medicines.length > 0 && (
        <div className="equipment">
          <div className="equipment-box">
            <span className="menu-button-flat">丹药列表</span>
            {medicines.map((item, index) => {
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
                    <div className="equipment-box-item-j">
                      <img
                        className="nav-box-item-img"
                        src={require('../../resources/svg/acount.svg')}
                      />
                      <span className="nav-box-item-font">{item.account}</span>
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
