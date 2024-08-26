import React from 'react'
import { createRequire } from 'react-puppeteer'

const require = createRequire(import.meta.url)

export default function App({ data, master }) {
  return (
    <div
      className="relative bg-cover bg-center text-center"
      style={{
        backgroundImage: `url(${require('../../resources/img/24.jpg')})`,
        color: 'black'
      }}
    >
      <div className="max-w-sm mx-auto rounded-lg shadow-md p-8 z-10">
        <img
          className="rounded-full w-24 h-24 mx-auto mb-4"
          src={`https://q2.qlogo.cn/headimg_dl?dst_uin=${data.master}&spec=160`}
          alt={data.name}
        />
        <h1 className="text-4xl font-bold mb-4 text-cyan-800">
          宗门： {data.name}
        </h1>
        <p className="font-bold">宗主：{master.name}</p>
        <p>宗门宣言：{data.notice || '无'}</p>
        <p>宗门人数：{data.members.length}</p>
        <p>宗门等级：{data.level}</p>
        <p>宗门灵石：{data.money}</p>
      </div>
    </div>
  )
}
