import React from 'react'
import MessageComponent from '../component/message.tsx'
import HelloComponent from '../component/hellox.tsx'
import { getUserMessageByUid } from '../model/message.ts'
export const routes = [
  {
    url: '/',
    key: '',
    data: '',
    element: <HelloComponent />
  },
  {
    url: '/message',
    key: 'message',
    data: getUserMessageByUid(794161769),
    element: <MessageComponent data={getUserMessageByUid(794161769)} />
  }
]
