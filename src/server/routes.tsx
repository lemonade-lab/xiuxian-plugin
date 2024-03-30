import React from 'react'
import MessageComponent from '../component/message.tsx'
import HelloComponent from '../component/hellox.tsx'
import { UserMessageBase } from '../model/base.ts'
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
    data: UserMessageBase,
    element: <MessageComponent data={UserMessageBase} />
  }
]
