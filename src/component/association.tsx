import React from 'react'
import { BackgroundImage, LinkStyleSheet } from 'jsxp'
import img_24 from '@src/assets/img/24.jpg'
import css_output from '@src/assets/css/input.css'
export default function App({ data, master }) {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <BackgroundImage url={img_24}>
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
        </BackgroundImage>
      </body>
    </html>
  )
}
