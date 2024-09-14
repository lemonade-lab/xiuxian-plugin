import React from 'react'
import { createRequire } from 'react-puppeteer'
import { UserMessageType } from '@/model/types.js'
import NavMessage from './nav.js'
import { getLevelById } from '@/model/level.js'
import { getSkillById } from '@/model/skills.js'
import { getEquipmentById } from '@/model/equipment.js'
import Help from './Help.js'
import Box from './Box.js'
const require = createRequire(import.meta.url)

type ComponentType = {
  data: UserMessageType
  status?: null | boolean
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

  for (const KEY in data.equipments) {
    // 这个key 没有 标记
    if (data.equipments[KEY] === null) continue
    // 有标记
    const db = getEquipmentById(Number(data.equipments[KEY]))
    for (const key in db) {
      equipment[key] = db[key]
    }
  }

  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  const power = attack + Math.floor(defense / 2) + Math.floor(blood / 3)

  const kills = Object.keys(data.skill).map(item => getSkillById(Number(item)))

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
      {kills.length > 0 && (
        <Box title="#功法信息">
          {kills.map((item, index) => {
            return (
              <div key={index} className="flex">
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/skills.svg')}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex flex-wrap mr-4">
                  <img
                    className="mr-2"
                    src={require('../../resources/svg/efficiency.svg')}
                  />
                  <span>{item.efficiency}</span>
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
      <Help list={['#学习+功法名']}></Help>
    </div>
  )
}
