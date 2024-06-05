import React from 'react'
import MessageComponent from '../src/component/message.tsx'
import SkillComponent from '../src/component/skill.tsx'
import HelloComponent from '../src/component/hello.tsx'
import EquipmentComponent from '../src/component/equipment.tsx'
import ShoppingComponent from '../src/component/shopping.tsx'
import BagComponent from '../src/component/bag.tsx'
import { UserMessageBase } from '../src/model/base.ts'

UserMessageBase.kills = {
  0: '0'
}

export const routes = [
  {
    url: '/',
    element: <HelloComponent />
  },
  {
    url: '/message',
    element: <MessageComponent data={UserMessageBase} status={null} />
  },
  {
    url: '/skill',
    element: <SkillComponent data={UserMessageBase} status={null} />
  },
  {
    url: '/equipment',
    element: <EquipmentComponent data={UserMessageBase} status={null} />
  },
  {
    url: '/shopping',
    element: <ShoppingComponent data={UserMessageBase} />
  },
  {
    url: '/bag',
    element: <BagComponent data={UserMessageBase} />
  }
]
