import React from 'react'
import { LevelNameMap } from '../model/base'

export type LeaderBoardDataType = {
  list: Array<any>
}

const App: React.FC<LeaderBoardDataType> = ({ list }) => {
  return (
    <div id="root" className="leaderBoard">
      <header className="leaderBoard-header">
        <h1>练气境界</h1>
      </header>
      <section className="leaderBoard-list">
        {list.map((item, index) => (
          <article key={index} className="leaderBoard-item">
            <p className="leaderBoard-details">
              {index == 0 && (
                <span className="leaderBoard-badge">当前境界: </span>
              )}
              {LevelNameMap[item]}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default App
