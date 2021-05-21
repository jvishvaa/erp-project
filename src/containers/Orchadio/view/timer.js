import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  // makeStyles
} from '@material-ui/core';
import { secondsToTime } from '../../../components/utils/timeFunctions';
// import styles from './orchadioListeners.styles'

// const useStyles = makeStyles(styles)

const Timer = ({ seconds, closeOverlay, isCompleted }) => {
  const [time, setTime] = useState('00:00:00');
  const [secondsToShow, setSecondsToShow] = useState(0);
  const timer = useRef(null);
  // const classes = useStyles()

  useEffect(() => {
    if (isCompleted && timer.current) {
      setSecondsToShow(seconds);
      clearInterval(timer.current);
    }
    if (seconds > 0 && !isCompleted) {
      timer.current = setInterval(() => {
        setSecondsToShow((c) => c + 1);
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [seconds, setSecondsToShow, isCompleted]);

  useEffect(() => {
    if (seconds - secondsToShow >= 0) {
      if (seconds > 0 && secondsToShow === seconds && !isCompleted) {
        closeOverlay(false);
      }
      setTime(secondsToTime(seconds - secondsToShow));
    } else {
      clearInterval(timer.current);
    }
  }, [secondsToShow, seconds, closeOverlay, isCompleted]);

  return (
    <>
      <Typography
        variant='h2'
        style={{
          textAlign: 'center',
          color: 'white',
          fontWeight: 'lighter',
        }}
      >
        {time}
      </Typography>
    </>
  );
};

export default Timer;
