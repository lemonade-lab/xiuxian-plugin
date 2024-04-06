import React, { useEffect } from 'react'
import { useState } from 'react'
import UserMessage from './user/Message'
import Client from '../../api/axios'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  const [list, setList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [data, setData] = useState({
    uid: 0
  })

  const get = () => {
    Client.list().then((res) => {
      if (res.code == 200) {
        setCount(res.data.count)
        setList(res.data.list)
      }
    })
  }

  useEffect(() => {
    get()
  }, [])

  const onClick = (uid: number) => {
    Client.message({ uid }).then((res) => {
      if (res.code == 200) {
        setData(res.data)
      }
    })
  }

  /**
   * 进行分页
   */
  const pageSize = 8 // 每页显示条目数
  const totalPages = Math.ceil(list.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentList = list.slice(startIndex, endIndex)
  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <div
        className="user-message"
        onClick={() => {
          console.log('点击刷新')
          get()
        }}
      >
        玩家人数： {count}
      </div>

      <div className="search">
        <div className="search-title">搜索玩家</div>
        <input className="search-input" placeholder="请输入账号"></input>
        <button className="list-button" onClick={() => onClick(0)}>
          查看信息
        </button>
      </div>

      <div className="look">
        <div className="look-select">
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => onPageChange(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
          <div className="table">
            <div className="table-title">玩家列表</div>
            {currentList.map((item) => (
              <div key={item} className="list">
                <div className="list-font"> 账号： {item}</div>
                <button className="list-button" onClick={() => onClick(item)}>
                  查看信息
                </button>
              </div>
            ))}
          </div>
        </div>

        {data.uid !== 0 && <UserMessage data={data} />}
      </div>
    </div>
  )
}
