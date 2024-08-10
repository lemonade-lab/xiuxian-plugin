import React from 'react'
import { createRequire } from 'react-puppeteer'
import { UserMessageType } from '../model/types.js'
import { getEquipmentById } from '../model/equipment.js'
import { EquipmentNameMap, SkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
const require = createRequire(import.meta.url)

import HeaderComponent from './header.js'
import Help from './Help.js'
import Box from './Box.js'

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
    <div
      id="root"
      data-theme={data.theme}
      style={{
        backgroundImage: 'var(--background-image)'
      }}
      className="  bg-[100%_auto] w-full h-full"
    >
      <div className="p-4">
        <HeaderComponent />
      </div>

      {
        <Help
          list={['#购买武器+武器名', '#购买功法+功法名']}
          title="万宝楼"
        ></Help>
      }

      {kills.length > 0 && (
        <Box title={'功法'}>
          {kills.map((item, index) => {
            const data = getSkillById(Number(item))
            return (
              <div key={index} className="flex">
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/skills.svg')}
                  />
                  <span className="mx-auto">{data.name}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/efficiency.svg')}
                  />
                  <span className="mx-auto">{data.efficiency}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/money.svg')}
                  />
                  <span className="mx-auto">{data.price}</span>
                </div>
              </div>
            )
          })}
        </Box>
      )}

      {datas.length > 0 && (
        <Box title={'武器'}>
          {datas.map((item, index) => {
            return (
              <div key={index}>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/equitment.svg')}
                    />
                    <span className="mx-auto">{item.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/attack.svg')}
                    />
                    <span className="mx-auto">{item.attack}</span>
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
                    <span className="mx-auto">{item.blood}</span>
                  </div>
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/agile.svg')}
                    />
                    <span className="mx-auto">{item.agile}</span>
                  </div>
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/critical_hit_rate.svg')}
                    />
                    <span className="mx-auto">{item.critical_hit_rate}</span>
                  </div>
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/critical_damage.svg')}
                    />
                    <span className="mx-auto">{item.critical_damage}</span>
                  </div>
                  <div className="flex flex-wrap mr-4">
                    <img
                      className="mr-2"
                      src={require('../../resources/svg/money.svg')}
                    />
                    <span className="mx-auto">{item.price}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </Box>
      )}
    </div>
  )
}
