import React from 'react'
import css_output from '@src/assets/css/input.css'
import { LinkStyleSheet } from 'jsxp'

interface DataType {
  id: string
  name: string
  price: number
  num: number
  updater: string
}

export interface ExchangeDataType {
  data: DataType[]
}

export default function App({ data }: ExchangeDataType) {
  return (
    <html>
      <html>
        <LinkStyleSheet src={css_output} />
      </html>
      <body>
        <div className="mx-2 my-5 text-center w-[400px]">
          <div className="header">
            <h2>太虚商行</h2>
          </div>
          <div className="table-container">
            <table className="border border-gray-300 border-collapse text-center w-full mt-[10px]">
              <thead>
                <tr>
                  {['编号', '物品', '价格', '数量'].map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr className="border border-gray-300 p-[8px]" key={item.id}>
                    <td className="border border-gray-300 p-[8px]">
                      {item.id}
                    </td>
                    <td className="border border-gray-300 p-[8px]">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 p-[8px]">{`¥${item.price}`}</td>
                    <td className=" border border-gray-300 p-[8px]">
                      {item.num}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  )
}
