import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import { UserMessageType } from '@src/model/types'
import NavMessage from '@src/component/nav.jsx'
import { getLevelById } from '@src/model/level.js'
import { SkillNameMap } from '@src/model/base.js'
import { getEquipmentById } from '@src/model/equipment.js'
import Help from '@src/component/Help.js'
import Box from '@src/component/Box.js'
import css_output from '@src/assets/css/input.css'
import img_attack from '@src/assets/svg/attack.svg'
import img_defense from '@src/assets/svg/defense.svg'
import img_blood from '@src/assets/svg/blood.svg'
import img_agile from '@src/assets/svg/agile.svg'
import img_critical_hit_rate from '@src/assets/svg/critical_hit_rate.svg'
import img_critical_damage from '@src/assets/svg/critical_damage.svg'

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

  // 敏捷
  const agile = equipment.agile + level.agile + data.base.agile
  // 暴击率
  const critical_hit_rate =
    equipment.critical_hit_rate +
    level.critical_hit_rate +
    data.base.critical_hit_rate
  // 暴击伤害
  const critical_damage =
    equipment.critical_damage +
    level.critical_damage +
    data.base.critical_damage

  const kills: string[] = Object.keys(data.skill)

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
          {
            // 消息
          }
          <NavMessage
            data={data}
            power={power}
            now={data.blood}
            blood={blood}
            status={status}
          />
          {
            // 签名
          }

          <Box title={'#签名+字符'}>
            <span className="flex flex-wrap relative p-4 ">
              {data.autograph}
            </span>
          </Box>
          {
            // 装备信息
          }

          <Box title={' #装备信息'}>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_attack} />
              <span className="pr-1">攻击</span>
              <span>{attack}</span>
              <span className="text-[var(--font-color)]">{`(+${+data.base
                .attack})`}</span>
            </div>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_defense} />
              <span className="pr-1">防御</span>
              <span>{`${defense}`}</span>
              <span className="text-[var(--font-color)]">
                {`(+${data.base.defense})`}
              </span>
            </div>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_blood} />
              <span className="pr-1">血量</span>
              <span>{`${blood}`}</span>
              <span className="text-[var(--font-color)]">
                {`(+${data.base.blood})`}
              </span>
            </div>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_agile} />
              <span className="pr-1">敏捷</span>
              <span>{`${agile}`}</span>
            </div>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_critical_hit_rate} />
              <span className="pr-1">爆率</span>
              <span>{`${critical_hit_rate}`}</span>
            </div>
            <div className="flex flex-grow flex-shrink-0 w-1/2">
              <img className="mr-1" src={img_critical_damage} />
              <span className="pr-1">暴伤</span>
              <span>{`${critical_damage}`}</span>
            </div>
          </Box>

          {kills.length > 0 && (
            <Box title={'#功法信息'}>
              {kills.map((item, index) => (
                <span key={index}>《{SkillNameMap[item]}》 </span>
              ))}
            </Box>
          )}
          <Help
            list={[
              '#采矿',
              '#突破',
              '#闭关',
              '#出关',
              '#储物袋',
              '#万宝楼',
              '#打劫@道友'
            ]}
          ></Help>
        </div>
      </body>
    </html>
  )
}
