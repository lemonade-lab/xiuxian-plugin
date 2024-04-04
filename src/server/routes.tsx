import React from 'react'
import MessageComponent from '../component/message.tsx'
import HelloComponent from '../component/hellox.tsx'
import { getUserMessageByUid } from '../model/message.ts'
export const routes = [
  {
    url: '/',
    key: '',
    element: <HelloComponent />
  },
  {
    url: '/message',
    key: 'message',
    element: (
      <MessageComponent data={getUserMessageByUid(794161769)} status={null} />
    )
  }
]
