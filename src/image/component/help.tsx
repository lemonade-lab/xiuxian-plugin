import React from 'react'
export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/help.css"></link>
      </head>
      <body>
        <div id="root">
          <h1>{data} Hello, world!</h1>
        </div>
      </body>
    </html>
  )
}
