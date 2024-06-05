import React from 'react'
import _ from './url.js'

export default function App() {
  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/output.css')}></link>
        <link rel="stylesheet" href={_('css/hello.css')}></link>
      </head>
      <body>
        <div id="root">
          <div className=" text-red-500 p-2 text-xl">Hello, world!</div>
        </div>
      </body>
    </html>
  )
}
