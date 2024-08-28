import React from 'react'
import { createRequire } from 'react-puppeteer'

const require = createRequire(import.meta.url)

export default function App({ data, master }) {
  return (
    <div
      className="text-center"
      style={{
        backgroundImage: `url(${require('../../resources/img/24.jpg')})`,
        backgroundSize: '100% auto',
        color: 'black !important'
      }}
    >
      <div>
        <img
          className="w-1/2 h-1/2"
          style={{
            borderRadius: '50%',
            margin: '20px auto'
          }}
          src={`https://q2.qlogo.cn/headimg_dl?dst_uin=${data.master}&spec=160`}
          alt={data.name}
        />
        <h1 className="text-5xl">宗门： {data.name}</h1>
        <p className="text-3xl mt-8">宗主：{master.name}</p>
        <p className="text-3xl mt-8">宗门宣言：{data.notice || '无'}</p>
        <p className="text-3xl mt-8">宗门人数：{data.members.length}</p>
        <p className="text-3xl mt-8">宗门等级：{data.level}</p>
        <p className="text-3xl mt-8">宗门灵石：{data.money}</p>
      </div>
    </div>
  )
}
