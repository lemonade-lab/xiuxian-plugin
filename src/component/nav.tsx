import React from 'react'
import { LevelNameMap, ThemesColor } from '@src/model/base'
import { UserMessageType } from '@src/model/types'
import HeaderComponent from '@src/component/header.js'
import classNames from 'classnames'
import img_name from '@src/assets/svg/name.svg'
import img_level from '@src/assets/svg/level.svg'
import img_power from '@src/assets/svg/power.svg'
import img_money from '@src/assets/svg/money.svg'
import img_efficiency from '@src/assets/svg/efficiency.svg'

type ComponentType = {
  data: UserMessageType
  power: number
  now: number
  blood: number
  status?: null | boolean
}

export default function App({
  data,
  power,
  now,
  blood,
  status = false
}: ComponentType) {
  //
  const pro = Math.floor((now / blood) * 100)
  //
  const color = `linear-gradient(to right, ${
    ThemesColor[data.theme].left
  } ${pro}%,${ThemesColor[data.theme].right}  ${pro}%)`
  //
  const List = [
    {
      title: '金',
      className: 'bg-yellow-500'
    },
    {
      title: '木',
      className: 'bg-green-500'
    },
    {
      title: '水',
      className: 'bg-blue-500'
    },
    {
      title: '火',
      className: 'bg-red-500'
    },
    {
      title: '土',
      className: 'bg-indigo-500'
    }
  ]
  //
  return (
    <div className="p-4">
      <HeaderComponent />
      <div className="flex justify-between relative nav-box bg-[var(--bg-color)] rounded-md mt-8 p-2">
        <span className="rounded-t-lg absolute top-[-40px] left-4 bg-[#f9f2f2de] text-[#635b5bfa] text-sm px-1 py-1 m-1">
          #个人信息
        </span>
        <span className="text-white rounded-t-lg text-lg absolute top-[-46px] flex right-0">
          {List.map((item, index) => (
            <span
              key={index}
              className={classNames(
                'rounded-full m-1 size-8 text-center shadow border-2 border-white ',
                item.className
              )}
            >
              {item.title}
            </span>
          ))}
        </span>
        <div className="flex-1 m-auto">
          <div className="flex justify-center">
            <img className="mr-2" src={img_name} />
            <span>{data.name}</span>
          </div>
          <div className="flex justify-center">
            <img className="mr-2" src={img_level} />
            <span>{LevelNameMap[data.level_id]}</span>
          </div>
        </div>
        <div className="flex-1 m-auto relative text-center">
          {
            // 头像
          }
          <img
            className=" bg-cover m-auto bg-center size-36 rounded-full border-2 border-white"
            src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.uid}`}
          />
          {
            // 状态
          }
          {status && (
            <span className="absolute top-0 right-0 z-10 px-2 rounded-md bg-[var(--nav-state-color)]  before:absolute  before:w-3  before:h-3  before:rounded-full  before:bottom-0  before:left-0">
              闭关
            </span>
          )}
          <div
            className="absolute bottom-0 text-center w-full left-0 text-white font-semibold bg-[var(--uid-background-color)] rounded-[20px]"
            style={{
              background: color
            }}
          >
            {data.uid}
          </div>
          {
            //
          }
          <span className="absolute w-full text-center left-0 text-white  text-sm ">{`${now}/${blood}-${pro}%`}</span>
        </div>
        <div className="flex-1 m-auto">
          <div className="flex justify-center">
            <img className="mr-2" src={img_power} />
            <span>{power}</span>
          </div>
          <div className="flex justify-center">
            <img className="mr-2" src={img_money} />
            <span>{data.money}</span>{' '}
          </div>
          <div className="flex justify-center">
            <img className="mr-2" src={img_efficiency} />
            <span>{data.efficiency}</span>{' '}
          </div>
        </div>
      </div>
    </div>
  )
}
