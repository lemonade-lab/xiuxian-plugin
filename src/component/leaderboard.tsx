import React from 'react'
import { LevelNameMap } from '@src/model/base'
import { LinkStyleSheet } from 'jsxp'
import css_output from '@src/assets/css/input.css'
import img_28 from '@src/assets/img/28.jpg'
export type LeaderBoardDataType = {
  type: string
  list: Array<any>
}
const App: React.FC<LeaderBoardDataType> = ({ type, list }) => {
  return (
    <html>
      <html>
        <LinkStyleSheet src={css_output} />
      </html>
      <body>
        <div
          id="root"
          style={{
            backgroundImage: 'url(' + img_28 + ')'
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
      </body>
    </html>
  )
}

export default App
