import React from 'react'

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
    <div className="app-container">
      <div className="header">
        <h2>太虚商行</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>物品</th>
              <th>价格</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{`¥${item.price}`}</td>
                <td>{item.num}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
