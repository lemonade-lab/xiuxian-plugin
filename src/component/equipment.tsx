import React from 'react'
import { createRequire } from 'jsxp'
import { UserMessageType } from '@src/model/types.js'
import NavMessage from '@src/component/nav.js'
import { getLevelById } from '@src/model/level.js'
import { getEquipmentById } from '@src/model/equipment.js'
import Help from '@src/component/Help.js'
import Box from '@src/component/Box.js'
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
    <div
      id="root"
      data-theme={data.theme}
      style={{
        backgroundImage: 'var(--background-image)'
      }}
      className=" bg-[100%_auto] w-full h-full"
    >
      <NavMessage
        data={data}
        power={power}
        now={data.blood}
        blood={blood}
        status={status}
      />
      {datas.length > 0 && (
        <Box title={'#功法信息'}>
          {datas.map((item, index) => {
            return (
              <div key={index} className="flex flex-wrap">
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/equitment.svg')}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/attack.svg')}
                  />
                  <span>{item.attack}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/defense.svg')}
                  />
                  <span>{item.defense}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/blood.svg')}
                  />
                  <span>{item.blood}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/agile.svg')}
                  />
                  <span className="mr-2">{item.agile}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/critical_hit_rate.svg')}
                  />
                  <span>{item.critical_hit_rate}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/critical_damage.svg')}
                  />
                  <span>{item.critical_damage}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/money.svg')}
                  />
                  <span>{item.price}</span>
                </div>
              </div>
            )
          })}
        </Box>
      )}
      <Help list={['#装备武器+武器名', '#卸下武器+武器名']}></Help>
    </div>
  )
}
