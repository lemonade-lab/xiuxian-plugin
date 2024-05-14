import React, { useEffect } from 'react'
import classNames from 'classnames'
import SVG from './assets/react.svg'
import { gsap } from 'gsap'
export default function App() {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true })
    tl.to('.box1', { rotation: 360 })
    tl.to('.box2', { rotation: 360 })
    tl.to('.box3', { rotation: 360 })
    tl.to('.box4', { rotation: 360 })
    tl.to('.box5', { rotation: 360 })
  })
  return (
    <div
      className={classNames(
        'text-5xl  grid w-full h-full justify-center content-center',
        'animate__animated animate__fadeIn'
      )}
      style={{
        color: '#015de7'
      }}
    >
      <div className="flex">
        <img className={classNames('box box1 w-48')} src={SVG} />
        <img className={classNames('box box2 w-48')} src={SVG} />
        <img className={classNames('box box3 w-48')} src={SVG} />
        <img className={classNames('box box4 w-48')} src={SVG} />
        <img className={classNames('box box5 w-48')} src={SVG} />
      </div>
    </div>
  )
}
