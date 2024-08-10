import React from 'react'
import { LevelNameMap } from '../model/base'
import { createRequire } from 'react-puppeteer'

const require = createRequire(import.meta.url)
export type LeaderBoardDataType = {
  type: string
  list: Array<any>
}

const App: React.FC<LeaderBoardDataType> = ({ type, list }) => {
  return (
    <div
      id="root"
      style={{
        backgroundImage: 'url(' + require('../../resources/img/28.jpg') + ')'
      }}
      className="bg-[100%_auto]  w-full h-full max-w-[800px] mx-auto p-8 shadow-md rounded-[10px] overflow-hidden"
    >
      <header className="leaderBoard-header">
        <h1>{type}</h1>
      </header>
      <section className="list-none p-0">
        {list.map((item, index) => (
          <article
            key={index}
            className="leaderBoard-item text-3xl font-medium"
          >
            <h2>{`第${index + 1}名：${item.name}`}</h2>
            <p className="text-lg font-light">
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
