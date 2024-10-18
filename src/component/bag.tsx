import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import { UserMessageType } from '@src/model/types.js'
import { getEquipmentById } from '@src/model/equipment.js'
import { getSkillById } from '@src/model/skills.js'
import HeaderComponent from '@src/component/header.js'
import { MedicineList } from '@src/model/medicine.js'
import Box from '@src/component/Box.js'
import css_output from '@src/assets/css/input.css'
import img_name from '@src/assets/svg/name.svg'
import img_efficiency from '@src/assets/svg/efficiency.svg'
import img_money from '@src/assets/svg/money.svg'
import img_acount from '@src/assets/svg/acount.svg'
import img_equitment from '@src/assets/svg/equitment.svg'
import img_attack from '@src/assets/svg/attack.svg'
import img_defense from '@src/assets/svg/defense.svg'
import img_blood from '@src/assets/svg/blood.svg'
import img_agile from '@src/assets/svg/agile.svg'
import img_critical_hit_rate from '@src/assets/svg/critical_hit_rate.svg'
import img_critical_damage from '@src/assets/svg/critical_damage.svg'

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
    <html>
      <html>
        <LinkStyleSheet src={css_output} />
      </html>
      <body>
        <div
          id="root"
          data-theme={data.theme}
          style={{
            backgroundImage: 'var(--background-image)'
          }}
          className="bg-[100%_auto] w-full h-full"
        >
          <div className="p-4">
            <HeaderComponent />
          </div>
          {kills.length > 0 && (
            <Box title={'#功法信息'}>
              {kills.map((item, index) => {
                return (
                  <div key={index} className="flex">
                    {[
                      {
                        data: item.name,
                        src: img_name
                      },
                      {
                        data: item.efficiency,
                        src: img_efficiency
                      },
                      {
                        data: item.price,
                        src: img_money
                      },
                      {
                        data: item.account,
                        src: img_acount
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-wrap mr-4">
                        <img className="mr-2" src={item.src} />
                        <span className="mx-auto">{item.data}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </Box>
          )}

          {datas.length > 0 && (
            <Box title={'#装备信息'}>
              {datas.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="flex flex-wrap">
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_equitment} />
                        <span className="mx-auto">{item.name}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_acount} />
                        <span className="mx-auto">{item.account}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_attack} />
                        <span className="mx-auto">{item.attack}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_defense} />
                        <span className="mx-auto">{item.defense}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_blood} />
                        <span className="mx-auto">{item.blood}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_agile} />
                        <span className="mx-auto">{item.agile}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_critical_hit_rate} />
                        <span className="mx-auto">
                          {item.critical_hit_rate}
                        </span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_critical_damage} />
                        <span className="mx-auto">{item.critical_damage}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_money} />
                        <span className="mx-auto">{item.price}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Box>
          )}

          {medicines.length > 0 && (
            <Box title={'丹药列表'}>
              {medicines.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="flex flex-wrap">
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_equitment} />
                        <span className="mx-auto">{item.name}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_acount} />
                        <span className="mx-auto">{item.account}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_attack} />
                        <span className="mx-auto">{item.attack}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_blood} />
                        <span className="mx-auto">{item.blood}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_agile} />
                        <span className="mx-auto">{item.agile}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img className="mr-2" src={img_money} />
                        <span className="mx-auto">{item.price}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Box>
          )}
        </div>
      </body>
    </html>
  )
}
