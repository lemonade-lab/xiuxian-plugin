import React from 'react'

// 路径深度
const _ = (src: string) => `../../${src}`

export default function App() {
  return (
    <html>
      <head>
        <link rel="stylesheet" href={_(`css/hello.css`)}></link>
      </head>
      <body>
        <div id="root">
          <h1> Hello, world!</h1>
        </div>
      </body>
    </html>
  )
}
