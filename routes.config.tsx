import React from 'react'
import { createRequire, defineConfig } from 'react-puppeteer'
import { DB } from './src/model/db-system'
import { associationDB } from './src/model/association'
import {
  Bag as BagComponent,
  Equipment as EquipmentComponent,
  Message as MessageComponent,
  // LeaderBoard as LeaderBoardComponent,
  // LevelList as LevelListComponent,
  Shopping as ShoppingComponent,
  Association as AssociationComponent,
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

const html_files = [require('./resources/css/root.css')]

// test
const UID = 1715713638
export default defineConfig([
  {
    url: '/bag',
    options: {
      html_head: <RootLink />,
      html_body: <BagComponent data={(await DB.findOne(UID)) as any} />,
      file_paths: Paths,
      html_files: html_files
    }
  },
  {
    url: '/equipment',
    options: {
      html_head: <RootLink />,
      html_body: (
        <EquipmentComponent
          data={(await DB.findOne(UID)) as any}
          status={false}
        />
      ),
      file_paths: Paths,
      html_files: html_files
    }
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
      html_files: html_files
    }
  },
  {
    url: '/shopping',
    options: {
      html_head: <RootLink />,
      html_body: <ShoppingComponent data={(await DB.findOne(UID)) as any} />,
      file_paths: Paths,
      html_files: html_files
    }
  },
  {
    url: '/skill',
    options: {
      html_head: <RootLink />,
      html_body: (
        <KillComponent data={(await DB.findOne(UID)) as any} status={false} />
      ),
      file_paths: Paths,
      html_files: html_files
    }
  },
  {
    url: '/association',
    options: {
      html_head: <RootLink />,
      html_body: (
        <AssociationComponent
          data={await associationDB.get(3)}
          master={{ name: '张三' }}
        />
      ),
      file_paths: Paths
    }
  }
])
