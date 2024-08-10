import React from 'react'
import { LevelNameMap } from '../model/base'

export type LeaderBoardDataType = {
  type: string
  list: Array<any>
}

const App: React.FC<LeaderBoardDataType> = ({ type, list }) => {
  return (
    <div
      id="root"
      style={{
        backgroundImage: 'var(--background-image)'
      }}
      className="bg-[100%_auto] w-full h-full max-w-[800px] mx-auto my-16 p-8 shadow-md rounded-[10px] overflow-hidden"
    >
      <header className="leaderBoard-header">
        <h1>{type}</h1>
      </header>
      <section className="list-none p-0">
        {list.map((item, index) => (
          <article key={index} className="leaderBoard-item">
            <h2>{`第${index + 1}名：${item.name}`}</h2>
            <p className="ltext-lg font-medium">
              {type === '灵榜' ? (
                <span>灵石: {item.money}</span>
              ) : (
                <span>等级: {LevelNameMap[item.level_id]}</span>
              )}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default App
