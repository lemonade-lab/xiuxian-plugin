import React from 'react'
import { LevelNameMap } from '../model/base'

export type LeaderBoardDataType = {
  list: Array<any>
}

const App: React.FC<LeaderBoardDataType> = ({ list }) => {
  return (
    <div
      id="root"
      style={{
        backgroundImage: 'var(--background-image)'
      }}
      className="  bg-[100%_auto] w-full h-full max-w-[800px] mx-auto my-16 p-8 shadow-md rounded-[10px] overflow-hidden"
    >
      <header className="leaderBoard-header">
        <h1>练气境界</h1>
      </header>
      <section className="list-none p-0">
        {list.map((item, index) => (
          <article key={index} className="leaderBoard-item">
            <p className="text-lg font-medium">
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
