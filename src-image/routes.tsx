import React from 'react'
import MessageComponent from '../src/component/message.tsx'
import SkillComponent from '../src/component/skill.tsx'
import HelloComponent from '../src/component/hello.tsx'
import EquipmentComponent from '../src/component/equipment.tsx'
import ShoppingComponent from '../src/component/shopping.tsx'
import BagComponent from '../src/component/bag.tsx'
import { getUserMessageByUid } from '../src/model/message.ts'

export const routes = [
  {
    url: '/',
    element: <HelloComponent />
  },
  {
    url: '/message',
    element: (
      <MessageComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  },
  {
    url: '/skill',
    element: (
      <SkillComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  },
  {
    url: '/equipment',
    element: (
      <EquipmentComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  },
  {
    url: '/shopping',
    element: <ShoppingComponent data={getUserMessageByUid(794161769)} />
  },
  {
    url: '/bag',
    element: <BagComponent data={getUserMessageByUid(794161769)} />
  }
]
