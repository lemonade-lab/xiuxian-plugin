import React from 'react'
export default function App({ data }) {
  return (
    <html>
      <body>
        <div>
          <h1
            style={{
              color: '#cf8420',
              backgroundImage: `url("../resources/img/help/xiuxian.jpg")`
            }}
          >
            {data} Hello, world!
          </h1>
        </div>
      </body>
    </html>
  )
}
