import React, { useState } from 'react'
import '../styles.css'
import client from '../../api/axios'

export default function App() {
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')

  const handleLogn = () => {
    console.log('handleLogon')

    // 构建请求数据
    const tData = {
      username: userName,
      password: passWord
    }

    const uArr = tData.username.split('')
    if (uArr.length < 6 || uArr.length > 18) {
      alert('账号或密码非法长度！')
      return
    }
    const pArr = tData.password.split('')
    if (pArr.length < 6 || pArr.length > 18) {
      alert('账号或密码非法长度！')
      return
    }

    client
      .logon(tData)
      .then((res) => {
        console.log('res', res)
        if (res.code == 5000) {
          alert('服务器错误，请稍后重试。。。')
        } else if (res.code == 4000) {
          alert(res.msg)
        } else if (res.code == 2000) {
          alert('注册成功，请前往登录')
        } else {
          alert('未知错误')
        }
      })
      .catch(() => {
        alert('服务器繁忙，请稍后重试。。。')
      })
  }

  const handleKeyDown = (key) => {
    if (key === 'Enter') handleLogn()
  }

  return (
    <div className="com">
      <main className="comMain">
        {/* <img className="comMainLogo)} src={logoSvg} /> */}
        <div className="comMainLogin">
          <div className="header">
            <h1 className="title">正在注册 修仙 账户</h1>
          </div>
          <input
            type="text"
            className="input"
            placeholder="用户名"
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
          <input
            type="password"
            className="input"
            placeholder="密码"
            onChange={(e) => setPassWord(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
          <button className="loginButton" onClick={handleLogn}>
            注册
          </button>
          <div className="registerLink">
            已经拥有账户？
            <a href="/login">前往登录</a>
          </div>
        </div>
      </main>
    </div>
  )
}
