import React from 'react'
import MessageComponent from '../component/message.tsx'
import KillComponent from '../component/kill.tsx'
import HelloComponent from '../component/hellox.tsx'
import EquipmentComponent from '../component/equiment.tsx'

import { getUserMessageByUid } from '../model/message.ts'
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
    url: '/kill',
    element: (
      <KillComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  },
  {
    url: '/equipment',
    element: (
      <EquipmentComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  }
]
