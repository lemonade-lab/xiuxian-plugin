import React from 'react'
import { createRequire, LinkStyleSheet } from 'jsxp'
import { UserMessageType } from '@src/model/types.js'
import { getEquipmentById } from '@src/model/equipment.js'
import { EquipmentNameMap, SkillNameMap } from '@src/model/base.js'
import { getSkillById } from '@src/model/skills.js'
const require = createRequire(import.meta.url)
import HeaderComponent from '@src/component/header.js'
import Help from '@src/component/Help.js'
import Box from '@src/component/Box.js'
import css_output from '@src/input.css'

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
                        src={require('@src/assets/svg/skills.svg')}
                      />
                      <span className="mx-auto">{data.name}</span>
                    </div>
                    <div className="flex flex-wrap mr-4">
                      <img
                        className="mr-2"
                        src={require('@src/assets/svg/efficiency.svg')}
                      />
                      <span className="mx-auto">{data.efficiency}</span>
                    </div>
                    <div className="flex flex-wrap mr-4">
                      <img
                        className="mr-2"
                        src={require('@src/assets/svg/money.svg')}
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
                          src={require('@src/assets/svg/equitment.svg')}
                        />
                        <span className="mx-auto">{item.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/attack.svg')}
                        />
                        <span className="mx-auto">{item.attack}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/defense.svg')}
                        />
                        <span>{item.defense}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/blood.svg')}
                        />
                        <span className="mx-auto">{item.blood}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/agile.svg')}
                        />
                        <span className="mx-auto">{item.agile}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/critical_hit_rate.svg')}
                        />
                        <span className="mx-auto">
                          {item.critical_hit_rate}
                        </span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/critical_damage.svg')}
                        />
                        <span className="mx-auto">{item.critical_damage}</span>
                      </div>
                      <div className="flex flex-wrap mr-4">
                        <img
                          className="mr-2"
                          src={require('@src/assets/svg/money.svg')}
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
      </body>
    </html>
  )
}
