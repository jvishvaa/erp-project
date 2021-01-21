/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core/AppBar'
import { Close } from '@material-ui/icons'

const Duration = (props, callback) => {
  const [duration, setDuration] = useState(0)
  const handleClose = () => {
    props.closePdf()
  }
  useEffect(() => {
    setDuration(props.timeStore)
  }, [props.timeStore])

  useEffect(() => {
    const interval = setInterval(() => {
      props.callback(duration)
    }, 250)
    return () => clearInterval(interval)
  })

  function useInterval (callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    useEffect(() => {
      function tick () {
        savedCallback.current()
      }
      if (delay !== null) {
        const id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    }, [delay])
  }

  useInterval(() => {
    setDuration(t => t + 1)
  }, [1000])

  function countDown () {
    const time = duration
    const seconds = Math.floor((time) % 60)
    const minutes = Math.floor((time / 60) % 60)
    const hours = Math.floor((time / 3600) % 60)
    return (

      <h3 style={{ color: '#fff', margin: '0' }}>
    Time :
        {hours}
    :
        {minutes}
    :
        {seconds}
      </h3>
    )
  }

  return (
    // as of now we are hiding TIME SPENT so not showing up this page
    <AppBar style={{ position: 'fixed', width: '100%', bottom: 'auto', top: '0', display: 'none' }}>
      <Toolbar className='toolbar'>
        <IconButton color='inherit' aria-label='Close'>
          <Close onClick={handleClose} />
        </IconButton>
        <Typography variant='h6' color='inherit' style={{ flex: 1 }}>
            Close
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.name}
        </Typography>
        {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; */}
        {countDown()}
      </Toolbar>
    </AppBar>
  )
}
export default Duration
