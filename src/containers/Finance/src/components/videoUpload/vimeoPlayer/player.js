/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Player from '@vimeo/player'

const PlayerInstance = (props = {}) => {
  const [player, setPlayer] = useState(undefined)
  const [duration, setDuration] = useState(0)
  const [seconds, setSeconds] = useState(0)
  // `data` is an object containing properties specific to that event
  const onPlay = (data) => { updateVideoPBPosition() }

  const updateVideoPBPosition = () => {
    if (!player) return
    if (!duration) {
      player.getDuration().then(duration_ => {
        setDuration(duration_)
      })
    }
    player.getCurrentTime().then(seconds_ => {
      // eslint-disable-next-line no-debugger
      debugger
      setSeconds(seconds_)
    })
  }
  useEffect(() => {
    var iframe = document.getElementById(props.id)
    setPlayer(new Player(iframe))
  }, [props.id])
  useEffect(() => { if (player) { player.on('play', onPlay) } }, [player])
  useEffect(() => { updateVideoPBPosition() }, [player, updateVideoPBPosition, seconds, duration])

  return <div>
    <h1>{seconds}/{duration}</h1>
    <iframe
    // id={uri}
    // src={uri}
    // style={{ padding: 0, margin: 'auto' }}
    // frameBorder='0'
    // allowFullScreen
    // // {...isMobile ? {} : { width: '480', height: '360' }}
    // {...isMobile ? {} : { width: '100%', minWidth: '100%', height: '280' }}
    // webkitallowfullscreen
    // mozallowfullscreen
    // title={title || 'not foun'}
      {...props}
    />
  </div>
}
export default PlayerInstance
