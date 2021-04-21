import React, { useState, useRef, useEffect } from 'react'
import {
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@material-ui/core'
import {
  PlayCircleOutlineOutlined as PlayIcon,
  PauseCircleOutlineOutlined as PauseIcon,
  Forward10 as ForwardIcon,
  Replay10 as ReplayIcon
} from '@material-ui/icons'
// import moment from 'moment'
import MusicImage from '../../assets/music.jpg'
import styles from './audioPlayer.styles'
import { secondsToTime } from '../../utils'

const FWD = 'forward'
const RPLY = 'replay'

const useStyles = makeStyles(styles)
const AudioPlayer = ({
  src,
  albumName,
  albumComposers = [],
  imageSrc,
  imageTxt,
  completionCallback,
  completionPercentage = 99,
  playCallback,
  pauseCallback,
  forceStop,
  radioProgramId,
  completedOnPecentageLimit
}) => {
  const [completedStatus, setCompletedStatus] = useState(false)
  const [isPlaying, setIsPlayig] = useState(false)
  const [audioSrc, setAudioSrc] = useState('')
  const playerRef = useRef(null)
  const progressBarRef = useRef(null)
  const currentTimeRef = useRef(null)
  const endTimeRef = useRef(null)
  const classes = useStyles()
  const matches = useMediaQuery('(max-width:960px)')

  useEffect(() => {
    if (audioSrc) {
      playerRef.current.play()
    }
  }, [audioSrc])

  useEffect(() => {
    if (forceStop && playerRef.current) {
      playerRef.current.pause()
    }
  }, [forceStop])

  // function calculateTotalValue (length) {
  //   const minutes = Math.floor(length / 60)
  //   const minutesStr = minutes < 10 ? '0' + minutes : String(minutes)
  //   const secondsInt = length - minutes * 60
  //   const secondsStr = secondsInt < 10
  //     ? '0' + String(secondsInt).substr(0, 1)
  //     : String(secondsInt).substr(0, 2)
  //   const time = minutesStr + ':' + secondsStr
  //   return time
  // }

  // function calculateCurrentValue (currentTime) {
  //   const currentMinute = parseInt(currentTime / 60) % 60
  //   const currentSecondsLong = currentTime % 60
  //   const currentSeconds = currentSecondsLong.toFixed()
  //   const currentFinalTime = (currentMinute < 10
  //     ? '0' + currentMinute : currentMinute) + ':' + (currentSeconds < 10 ? '0' + currentSeconds
  //     : currentSeconds)
  //   return currentFinalTime
  // }

  const forwardReplayHandler = (type) => {
    let value = 0
    if (playerRef.current) {
      const duration = playerRef.current.duration
      const currentTime = playerRef.current.currentTime
      if (type === FWD) {
        value = currentTime + 10
        if (value >= duration) {
          // progressBarRef.current.style.width = '100%'
          playerRef.current.currentTime = duration
        } else {
          playerRef.current.currentTime = value
        }
      } else {
        value = currentTime - 10
        if (value <= 0) {
          playerRef.current.currentTime = 0
        } else {
          playerRef.current.currentTime = value
        }
      }
    }
  }

  const initProgressBar = (event) => {
    const { currentTime, duration } = event.target
    const percentComplete = (currentTime / duration) * 100
    if (percentComplete > completionPercentage && !completedStatus) {
      setCompletedStatus(true)
      completionCallback()
    }
    if (Math.round(percentComplete) === 30 || Math.round(percentComplete) === 1) {
      completedOnPecentageLimit(Math.round(percentComplete))
    }
    // progressBarRef.current.completed = percentComplete

    const value = (100 / event.target.duration) * event.target.currentTime
    progressBarRef.current.style.width = value + '%'

    const totalLength = secondsToTime(parseInt(isNaN(duration) ? 0 : duration))
    endTimeRef.current.innerHTML = totalLength

    const currentTimer = secondsToTime(parseInt(event.target.currentTime))
    currentTimeRef.current.innerHTML = currentTimer
  }

  const togglePlay = () => {
    if (isPlaying && playerRef.current) {
      playerRef.current.pause()
      pauseCallback()
    } else {
      if (!audioSrc) {
        setAudioSrc(src)
      } else {
        playerRef.current.play()
        playCallback()
      }
    }
    setIsPlayig(c => !c)
  }

  return (
    <div className={classes.audioContainer}>
      <Grid
        container
        spacing={matches ? 0 : 2}
        justify='center'
        alignItems='center'
        className={classes.audioPlayer}
      >
        <Grid item md={2}>
          <IconButton onClick={togglePlay}>
            {isPlaying
              ? <PauseIcon
                style={{ fontSize: 100, fontWeight: 'lighter', color: '#85adad' }}
                className={classes.icons}
              />
              : <PlayIcon
                style={{ fontSize: 100, fontWeight: 'lighter', color: '#85adad' }}
                className={classes.icons}
              />}
          </IconButton>
        </Grid>
        <Grid item xs={12} md={7}>
          <div>
            { audioSrc ? (<audio id='player' onTimeUpdate={initProgressBar} ref={playerRef} preload='metadata'>
              <source src={audioSrc} type='audio/mp3' />
              <source src={audioSrc} type='audio/ogg' />
              <source src={audioSrc} type='audio/wav' />
            </audio>) : null }
          </div>
          <Grid container alignItems='center' justify='center'>
            <Grid item xs={12}>
              <p
                className={classes.albumDetails}
              >
                {albumName} <small>by</small> {albumComposers.join(', ')}
              </p>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.meter}>
                <span className={classes.progressBar} ref={progressBarRef} />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify='space-between'>
                <Grid item xs={1}>
                  <small
                    ref={currentTimeRef}
                    style={{
                      textAlign: 'start',
                      width: '100%',
                      display: 'inline-block',
                      fontSize: '0.8rem'
                    }}
                  >
                    00:00
                  </small>
                </Grid>
                <Grid item xs={1}>
                  <small
                    ref={endTimeRef}
                    style={{
                      textAlign: 'end',
                      width: '100%',
                      display: 'inline-block',
                      fontSize: '0.8rem'
                    }}
                  >
                      00:00
                  </small>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title='Replay'>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() => forwardReplayHandler(RPLY)}
                >
                  <ReplayIcon style={{ fontSize: '35px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title='Forward'>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() => forwardReplayHandler(FWD)}
                >
                  <ForwardIcon style={{ fontSize: '35px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <div className={classes.albumImage} >
            <img src={imageSrc} alt='Album' width='100%' style={{
              border: '0.5px solid black',
              borderBottom: '0.5px solid white'
            }} />
            {
              imageTxt ? (
                <div className={classes.albumDetailsOverlay}>
                  {imageTxt}
                </div>
              ) : null
            }
            {
              // getLikeCountView()
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

AudioPlayer.defaultProps = {
  completionCallback: () => {},
  imageSrc: MusicImage,
  playCallback: () => {},
  pauseCallback: () => {},
  likeClickHandler: () => {}
}

export default AudioPlayer
