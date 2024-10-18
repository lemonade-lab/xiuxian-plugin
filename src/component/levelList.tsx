import React from 'react'
import { LevelNameMap } from '@src/model/base'
import { LinkStyleSheet } from 'jsxp'
import css_output from '@src/assets/css/input.css'
import img_28 from '@src/assets/img/28.jpg'
export type LeaderBoardDataType = {
  list: Array<any>
}
const App: React.FC<LeaderBoardDataType> = ({ list }) => {
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
          className="  bg-[100%_auto] w-full h-full max-w-[800px] mx-auto p-8 shadow-md rounded-[10px] overflow-hidden"
        >
          <header className="leaderBoard-header">
            <h1>练气境界</h1>
          </header>
          <section className="list-none p-0">
            {list.map((item, index) => (
              <article key={index} className="leaderBoard-item">
                <p className="text-3xl font-medium">
                  {LevelNameMap[item]}
                  {index == 0 && (
                    <span className="leaderBoard-badge text-2xl">
                      ——当前境界
                    </span>
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
