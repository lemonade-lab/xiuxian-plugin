import React from 'react'
import { createRequire } from 'react-puppeteer'

const require = createRequire(import.meta.url)
export default function MsgList({
  list
}: {
  list: Array<{ group: number; msg: string; uid: string | number } | string>
}) {
  if (typeof list[0] === 'string') {
    return (
      <div
        id="root"
        style={{
          backgroundImage: `url(${require('../../resources/img/28.jpg')})`
        }}
        className="w-full h-full bg-[100%_auto] text-white overflow-hidden"
      >
        <h2 className="text-center text-3xl p-4 ">宗门列表</h2>
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className="h-auto border-2 border-white text-3xl rounded-lg p-2 m-2"
            >
              <p>{item as string}</p>
            </div>
          )
        })}
      </div>
    )
  } else {
    return (
      <div
        id="root"
        style={{
          backgroundImage: `url(${require('../../resources/img/28.jpg')})`
        }}
        className="w-full h-full bg-[100%_auto] text-white overflow-hidden"
      >
        <h2 className="text-center text-3xl p-4 ">秘境结算列表</h2>
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className="h-auto border-2 border-white text-3xl rounded-lg p-2 m-2"
            >
              <p>{typeof item !== 'string' && item.msg}</p>
            </div>
          )
        })}
      </div>
    )
  }
}
