import React from 'react'
import { LevelNameMap } from '../model/base'

export type LeaderBoardDataType = {
  type: string
  list: Array<any>
}

const App: React.FC<LeaderBoardDataType> = ({ type, list }) => {
  return (
    <div id="root" className="leaderBoard">
      <header className="leaderBoard-header">
        <h1>{type}</h1>
      </header>
      <section className="leaderBoard-list">
        {list.map((item, index) => (
          <article key={index} className="leaderBoard-item">
            <h2>{`第${index + 1}名：${item.name}`}</h2>
            <p className="leaderBoard-details">
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
