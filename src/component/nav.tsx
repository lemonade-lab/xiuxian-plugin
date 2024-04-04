import React from 'react'
import { LevelNameMap, ThemesColor } from '../model/base'
import { UserMessageType } from '../model/types'

type ComponentType = {
  data: UserMessageType
  power: number
  now: number
  blood: number
}

export default function App({ data, power, now, blood }: ComponentType) {
  const pro = Math.floor((now / blood) * 100)
  const color = `linear-gradient(to right, ${
    ThemesColor[data.theme].left
  } ${pro}%,${ThemesColor[data.theme].right}  ${pro}%)`
  return (
    <div className="nav">
      <div className="nav-menu">
        <span className="nav-menu-title">修仙之练气十万年</span>
        <span className="menu-button">#再入仙途</span>
        <span className="menu-button">#更换主题</span>
        <span className="menu-button">#突破</span>
        <span className="menu-button">#闭关</span>
        <span className="menu-button">#出关</span>
      </div>
      <div className="nav-box">
        <span className="menu-button-flat">#个人信息</span>
        <div className="nav-box-flex">
          <div className="nav-box-item">
            <img className="nav-box-item-img" src="../../svg/name.svg" />
            <span>{data.name}</span>
          </div>
          <div className="nav-box-item">
            <img className="nav-box-item-img" src="../../svg/level.svg" />
            <span>{LevelNameMap[data.level_id]}</span>
          </div>
        </div>
        <div className="nav-box-flex nav-box-avatar">
          <img
            className="nav-box-img"
            src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.uid}`}
          />
          <div
            className="nav-box-uid"
            style={{
              background: color
            }}
          >
            {data.uid}
            <span className="nav-box-blool">{`${now}/${blood}-${pro}%`}</span>
          </div>
        </div>
        <div className="nav-box-flex">
          <div className="nav-box-item">
            <img className="nav-box-item-img" src="../../svg/power.svg" />
            <span>{power}</span>
          </div>
          <div className="nav-box-item">
            <img className="nav-box-item-img" src="../../svg/money.svg" />
            <span>{data.money}</span>{' '}
          </div>
        </div>
      </div>
    </div>
  )
}
