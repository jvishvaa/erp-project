import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  // Button,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  PlayCircleOutlineOutlined as PlayIcon,
  PauseCircleOutlineOutlined as PauseIcon,
  Forward10 as ForwardIcon,
  Replay10 as ReplayIcon,
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
} from '@material-ui/icons';
// import moment from 'moment'
// import MusicImage from '../../assets/music.jpg';
import styles from './audioPlayer.styles';
import { secondsToTime } from '../utils/timeFunctions';

const FWD = 'forward';
const RPLY = 'replay';

const useStyles = makeStyles(styles);
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
  completedOnPecentageLimit,
  viewCount,
  likesCount,
  likeHandler,
  isLiked,
}) => {
  const [completedStatus, setCompletedStatus] = useState(false);
  const [isPlaying, setIsPlayig] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const currentTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:960px)');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  useEffect(() => {
    if (audioSrc) {
      playerRef.current.play();
    }
  }, [audioSrc]);

  useEffect(() => {
    if (forceStop && playerRef.current) {
      playerRef.current.pause();
    }
  }, [forceStop]);

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
    let value = 0;
    if (playerRef.current) {
      const { duration } = playerRef.current;
      const { currentTime } = playerRef.current;
      if (type === FWD) {
        value = currentTime + 10;
        if (value >= duration) {
          // progressBarRef.current.style.width = '100%'
          playerRef.current.currentTime = duration;
        } else {
          playerRef.current.currentTime = value;
        }
      } else {
        value = currentTime - 10;
        if (value <= 0) {
          playerRef.current.currentTime = 0;
        } else {
          playerRef.current.currentTime = value;
        }
      }
    }
  };

  const initProgressBar = (event) => {
    const { currentTime, duration } = event.target;
    const percentComplete = (currentTime / duration) * 100;
    if (percentComplete > completionPercentage && !completedStatus) {
      setCompletedStatus(true);
      completionCallback();
    }
    if (Math.round(percentComplete) === 30 || Math.round(percentComplete) === 1) {
      completedOnPecentageLimit(Math.round(percentComplete));
    }
    // progressBarRef.current.completed = percentComplete

    const value = (100 / event.target.duration) * event.target.currentTime;
    console.log(value);
    progressBarRef.current.style.width = `${value}%`;

    const totalLength = secondsToTime(parseInt(isNaN(duration) ? 0 : duration));
    endTimeRef.current.innerHTML = totalLength;

    const currentTimer = secondsToTime(parseInt(event.target.currentTime));
    currentTimeRef.current.innerHTML = currentTimer;
  };

  const togglePlay = () => {
    if (isPlaying && playerRef.current) {
      playerRef.current.pause();
      pauseCallback();
    } else if (!audioSrc) {
      setAudioSrc(src);
    } else {
      playerRef.current.play();
      playCallback();
    }
    setIsPlayig((c) => !c);
  };

  return (
    <>
      <div className={classes.audioContainer} style={{ border: 'none' }}>
        <Grid
          container
          spacing={matches ? 0 : 2}
          justify='center'
          alignItems='center'
          className={classes.audioPlayer}
        >
          {/* <Grid item style={{ width: 10 }}> */}
          {isMobile ? (
            ''
          ) : (
            <div className={classes.albumImage}>
              <img src={imageSrc} alt='Album' width='100%' />
              {imageTxt ? (
                <div className={classes.albumDetailsOverlay}>{imageTxt}</div>
              ) : null}
              {/* {getLikeCountView()} */}
            </div>
          )}
          {/* </Grid> */}
          <Grid item md={1} style={{ align: 'center' }}>
            <IconButton onClick={togglePlay} style={{ marginTop: 85 }}>
              {isPlaying ? (
                <PauseIcon
                  style={{ fontSize: 70, fontWeight: 'lighter', color: '#ffd83a' }}
                  className={classes.icons}
                />
              ) : (
                <PlayIcon
                  style={{ fontSize: 70, fontWeight: 'lighter', color: '#ffd83a' }}
                  className={classes.icons}
                />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={12} md={7}>
            <div>
              {audioSrc ? (
                <audio
                  id='player'
                  onTimeUpdate={initProgressBar}
                  ref={playerRef}
                  preload='metadata'
                >
                  <source src={audioSrc} type='audio/mp3' />
                  <source src={audioSrc} type='audio/ogg' />
                  <source src={audioSrc} type='audio/wav' />
                </audio>
              ) : null}
            </div>
            <Grid container alignItems='center' justify='center'>
              <Grid item xs={6}>
                <p
                  className={classes.albumDetails}
                  style={{ color: 'white', fontWeight: 'normal' }}
                >
                  {albumName}
                </p>
                <p className={classes.albumDetails} style={{ color: 'white' }}>
                  <small>by</small> {albumComposers.join(', ')}
                </p>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title='Views'>
                  <IconButton style={{ color: '#95a81a' }}>
                    <Typography variant='body2' style={{ color: 'white', padding: 10 }}>
                      {viewCount || 0}
                    </Typography>
                    <PersonIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title='Like'>
                  <IconButton style={{ color: 'red' }} onClick={likeHandler}>
                    <Typography variant='body2' style={{ color: 'white', padding: 10 }}>
                      {likesCount || 0}
                    </Typography>
                    {isLiked ? <LikeIcon color='secondary' /> : <UnlikeIcon />}
                  </IconButton>
                </Tooltip>
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
                        fontSize: '0.8rem',
                        color: 'yellow',
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
                        fontSize: '0.8rem',
                        color: 'yellow',
                      }}
                    >
                      00:00
                    </small>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={isMobile ? 2 : 1}>
                <Tooltip title='Replay'>
                  <IconButton
                    classes={{ root: classes.iconButton }}
                    onClick={() => forwardReplayHandler(RPLY)}
                  >
                    <ReplayIcon style={{ fontSize: '35px', color: 'yellow' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={isMobile ? 2 : 1}>
                <Tooltip title='Forward'>
                  <IconButton
                    classes={{ root: classes.iconButton }}
                    onClick={() => forwardReplayHandler(FWD)}
                  >
                    <ForwardIcon style={{ fontSize: '35px', color: 'yellow' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Typography style={{ bottom: '8px', right: '16px' }}>
          More info - radio@orchids.edu.in
        </Typography> */}
      </div>
    </>
  );
};

AudioPlayer.defaultProps = {
  completionCallback: () => {},
  // imageSrc: MusicImage,
  playCallback: () => {},
  pauseCallback: () => {},
  likeClickHandler: () => {},
};

export default AudioPlayer;
