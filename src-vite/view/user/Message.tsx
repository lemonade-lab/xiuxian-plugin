import React, { useState } from 'react'
import './styles.css'

export default function App({ data }) {
  const [name, setName] = useState(data.name)
  const [autograph, setAutograph] = useState(data.autograph)
  const onSaveClick = () => {
    console.log('保存当前的', data.uid)
  }
  const onNameChange = (event) => {
    setName(event.target.value)
  }
  const onAutographChange = (event) => {
    setAutograph(event.target.value)
  }
  return (
    <div className="message">
      <div>
        <button onClick={onSaveClick}>保存</button>
      </div>
      <div>账号: {data.uid}</div>
      <div>
        昵称: <input value={name} onChange={onNameChange} />
      </div>
      <div>
        签名: <input value={autograph} onChange={onAutographChange} />
      </div>
    </div>
  )
}
