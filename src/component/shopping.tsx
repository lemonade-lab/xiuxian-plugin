import React from 'react'
import { createRequire } from 'react-puppeteer'
import { UserMessageType } from '../model/types.js'
import { getEquipmentById } from '../model/equipment.js'
import { EquipmentNameMap, SkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
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

      <div className="bp-8">
        <div className="p-4 relative flex flex-wrap bg-[var(--inset-bg-color)] rounded-[var(--border-radius)] shadow-[var(--inset-box-shadow)]">
          <span className="bg-gray-300 text-gray-700 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-4">
            万宝楼
          </span>
          <span className="bg-[#f9f2f2de] text-[#635b5bfa] rounded-md text-[20px] px-[2px] py-[6px] m-[6px]">
            #购买武器+武器名
          </span>
          <span className="bg-[#f9f2f2de] text-[#635b5bfa] rounded-md text-[20px] px-[2px] py-[6px] m-[6px]">
            #购买功法+功法名
          </span>
        </div>
      </div>

      {kills.length > 0 && (
        <div className="p-8 text-lg">
          <div className="flex flex-wrap relative p-4 bg-[var(--bg-color)] rounded-[var(--border-radius)] shadow-[var(--box-shadow)]">
            <span className="bg-gray-300 text-gray-700 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-4">
              功法
            </span>
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
          </div>
        </div>
      )}

      {datas.length > 0 && (
        <div className="p-8 text-lg">
          <div className="flex flex-wrap relative flex-col p-4 bg-[var(--bg-color)] rounded-[var(--border-radius)] shadow-[var(--box-shadow)]">
            <span className="bg-gray-300 text-gray-700 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-4">
              武器
            </span>
            {datas.map((item, index) => {
              return (
                <div key={index}>
                  <div className="aflex flex-wrap">
                    <div className="flex flex-wrap mr-4">
                      <img
                        className="mr-2"
                        src={require('../../resources/svg/equitment.svg')}
                      />
                      <span className="mx-auto">{item.name}</span>
                    </div>
                  </div>
                  <div className="aflex flex-wrap">
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
          </div>
        </div>
      )}
    </div>
  )
}
