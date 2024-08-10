import React from 'react'
import { createRequire, defineConfig } from 'react-puppeteer'
import { DB } from './src/model/db-system'
import {
  Bag as BagComponent,
  Equipment as EquipmentComponent,
  Hello as HelloComponent,
  Message as MessageComponent,
  LeaderBoard as LeaderBoardComponent,
  LevelList as LevelListComponent,
  Shopping as ShoppingComponent,
  Exchange as ExchangeComponent,
  Skill as KillComponent
} from './src/component/index.js'
import { dirname } from 'path'
const require = createRequire(import.meta.url)
const Paths = {
  '@xiuxian': dirname(require('./README.md'))
}
const RootLink = () => {
  // 引入解析后的 css
  return <link rel="stylesheet" href={require('./public/output.css')} />
}
// test
const UID = 1715713638
export default defineConfig([
  {
    url: '/bag'
  },
  {
    url: '/equipment'
  },
  {
    url: '/exchange'
  },
  {
    url: '/exchange'
  },
  {
    url: '/leaderboard'
  },
  {
    url: '/levelList'
  },
  {
    url: '/message',
    options: {
      html_head: <RootLink />,
      html_body: (
        <MessageComponent
          data={(await DB.findOne(UID)) as any}
          status={false}
        />
      ),
      file_paths: Paths,
      html_files: [require('./resources/css/root.css')]
    }
  },
  {
    url: '/shopping'
  },
  {
    url: '/skill'
  }
])
