import React from 'react'
import MessageComponent from '../component/message.tsx'
import HelloComponent from '../component/hellox.tsx'
import { UserMessageBase } from '../model/base.ts'
export const routes = [
  {
    url: '/',
    element: <HelloComponent />
  },
  {
    url: '/message',
    element: <MessageComponent data={UserMessageBase} />
  }
]
