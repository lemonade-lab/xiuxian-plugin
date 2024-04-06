import React, { useEffect } from 'react'

import { useState } from 'react'

import Client from '../api/axios'

import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  const get = () => {
    Client.list().then((res) => {
      if (res.code == 200) {
        setCount(res.data.count)
      }
    })
  }

  useEffect(() => {
    get()
  }, [])

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
    </div>
  )
}
