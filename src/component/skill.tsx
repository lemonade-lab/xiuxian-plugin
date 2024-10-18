import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import { UserMessageType } from '@src/model/types.js'
import NavMessage from '@src/component/nav.js'
import { getLevelById } from '@src/model/level.js'
import { getSkillById } from '@src/model/skills.js'
import { getEquipmentById } from '@src/model/equipment.js'
import Help from '@src/component/Help.js'
import Box from '@src/component/Box.js'
import css_output from '@src/assets/css/input.css'
import img_skills from '@src/assets/svg/skills.svg'
import img_efficiency from '@src/assets/svg/efficiency.svg'
import img_money from '@src/assets/svg/money.svg'

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
                      <img className="mr-2" src={img_skills} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex flex-wrap mr-4">
                      <img className="mr-2" src={img_efficiency} />
                      <span>{item.efficiency}</span>
                    </div>
                    <div className="flex flex-wrap mr-4">
                      <img className="mr-2" src={img_money} />
                      <span>{item.price}</span>
                    </div>
                  </div>
                )
              })}
            </Box>
          )}
          <Help list={['#学习+功法名']}></Help>
        </div>
      </body>
    </html>
  )
}
