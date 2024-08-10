import React from 'react'
export default function App() {
  const Title = '修仙之练气十万年'
  return (
    <div className="py-4">
      <span
        style={{
          textShadow: 'var(--title-text-shadow)'
        }}
        className="text-[var(--title-color)] text-3xl font-bold"
      >
        {Title}
      </span>
      {['#再入仙途', '#更换主题', '#改名+字符', '#签到'].map((item, index) => (
        <span
          key={index}
          className="bg-[#f9f2f2de] text-[#635b5bfa] rounded-md text-sm px-1 py-1 m-1"
        >
          {item}
        </span>
      ))}
    </div>
  )
}
