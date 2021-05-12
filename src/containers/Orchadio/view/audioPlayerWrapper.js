import React, { useState, useEffect, useCallback } from 'react';
import {
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
  // useMediaQuery,
  Divider,
  // Button,
  Typography,
  CardHeader,
  Modal,
} from '@material-ui/core';
import CloseButton from '@material-ui/icons/Close';
// import { CardContent } from 'semantic-ui-react';
// import FileCopyIcon from '@material-ui/icons/FileCopy';

// import { Info } from '@material-ui/icons'
import Card from '@material-ui/core/Card';
// import {
//   PlayCircleOutlineOutlined as PlayIcon,
//   PauseCircleOutlineOutlined as PauseIcon,
//   Forward10 as ForwardIcon,
//   Replay10 as ReplayIcon
// } from '@material-ui/icons'
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
} from '@material-ui/icons';
// import {
//   FacebookShareButton,
//   FacebookIcon,

//   // // OKShareButton,
//   WhatsappIcon,
//   WhatsappShareButton,
//   // WorkplaceShareButton
// } from 'react-share';
// import axios from 'axios';
import { useSelector } from 'react-redux';
// import ShareIcon from '@material-ui/icons/Share'
import moment from 'moment';
// import { urls } from '../../../urls';
// import MusicImage from '../../../assets/music.jpg'
import styles from './orchadioListeners.styles.js';
import AudioOverlay from './audioOverlay';
import AudioPlayer from '../../../components/AudioPlayer';
import Timer from './timer';
import { getSparseDate, secondsToTime } from '../../../components/utils/timeFunctions';
import './orchadio_styles.css';
// import radiobg from '../../../assets/images/RadioBg.png';
// const FWD = 'forward'
// const RPLY = 'replay'

const useStyles = makeStyles(styles);
const AudioPlayerWrapper = ({
  src,
  albumName,
  albumComposers = [],
  imageSrc,
  imageTxt,
  completionCallback,
  completionPercentage = 99,
  playCallback,
  pauseCallback,
  dateToStart,
  timeToStart,
  timedStart,
  duration,
  likesCount,
  viewCount,
  likeHandler,
  isLiked,
  radioProgramId,
  completedOnPecentageLimit,
  isPublic,
}) => {
  const [currentDifference, setCurrentDifference] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completed, setComleted] = useState(false);
  const [isOverlay, setIsOverlay] = useState(true);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const user = useSelector((state) => state.authentication.user);
  // const [publicToken, setPublicToken] = useState('');
  // const userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id;

  useEffect(() => {
    let timer;
    if (timedStart && dateToStart && timeToStart) {
      //  Checking Difference in the date
      const [startYear, startMonth, startDate] = getSparseDate(dateToStart);
      const [currYear, currMonth, currDate] = getSparseDate();
      const checkDate = moment([startYear, startMonth, startDate], 'YYYY-MM-DD');
      const todayDate = moment([currYear, currMonth, currDate], 'YYYY-MM-DD');
      const diff = checkDate.diff(todayDate, 'days');
      setCurrentDifference(diff);
      console.log('Diff+++++', diff);
      if (diff <= -1) {
        setIsOverlay(false);
      }
      //  Calculating the time to start the audio
      if (diff === 0 && diff > -1) {
        const hm = timeToStart.split(':');
        const date = new Date();
        date.setHours(+hm[0]);
        date.setMinutes(+hm[1]);
        date.setSeconds(0);
        date.setMilliseconds(0);
        const date2 = new Date();
        const secondsLeft = parseInt((date - date2) / 1000, 10) + 1;
        setSecondsLeft(secondsLeft);

        //  Calculating the remaining play duration of audio
        const dateToActivate = moment([
          startYear,
          startMonth - 1,
          startDate,
          hm[0],
          hm[1],
        ]);
        const currentDate = moment(new Date());
        const remainingTime = duration - currentDate.diff(dateToActivate, 'seconds');
        if (remainingTime > 0) {
          if (secondsLeft <= 0) {
            setIsOverlay(false);
            setComleted(false);
          }
          timer = setTimeout(() => {
            setIsOverlay(true);
            setComleted(true);
          }, remainingTime * 1000);
        }
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [dateToStart, timedStart, timeToStart, duration]);

  // const generateToken = () => {
  //   const body = {
  //     user_id: userId,
  //   };
  //   axios
  //     .post(`${urls.GeneratePUblicToken}`, body, {
  //       headers: {
  //         Authorization: `Bearer ${user}`,
  //       },
  //     })
  //     .then((res) => {
  //       const { data: { data: { token } = {} } = {} } = res;
  //       console.log(token, 'token');
  //       console.log(res);
  //       setPublicToken(token);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // eslint-disable-next-line no-unused-vars
  const handleShareLink = () => {
    setOpen(true);
    // generateToken();
  };
  const handleClickClose = () => {
    setOpen(!open);
  };

  const convertIdToBase64 = (id) => {
    const str = String(id);
    return window.btoa(str);
  };

  // const handleCopyLink = () => {
  //   navigator.clipboard.writeText(
  //     `${window.location.origin}/public/orchadio/${convertIdToBase64(
  //       radioProgramId
  //     )}/${publicToken}`
  //   );
  // };

  const changeOverlayHandler = useCallback((value) => {
    setIsOverlay(!!value);
  }, []);

  const getOverlayView = () => {
    let view;
    const day = Math.abs(currentDifference);
    if (currentDifference === 0) {
      view = (
        <div className={classes.timer}>
          <Typography
            variant='h6'
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'lighter',
              marginTop: '30px',
            }}
          >
            {`Scheduled At ${timeToStart}`}
          </Typography>
          <Typography
            variant='h6'
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'lighter',
            }}
          >
            {`Duration ${secondsToTime(duration, true)}`}
          </Typography>
          <Timer
            seconds={secondsLeft}
            closeOverlay={changeOverlayHandler}
            isCompleted={completed}
          />
        </div>
      );
    } else if (currentDifference > 0) {
      view = (
        <Typography
          variant='h2'
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'lighter',
          }}
          className={classes.timer}
        >
          {day} {day > 1 ? 'Days' : 'Day'} Left
        </Typography>
      );
    } else {
      view = (
        <Typography
          variant='h2'
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'lighter',
          }}
          className={classes.timer}
        >
          {day} {day > 1 ? 'Days' : 'Day'}
          Ago
        </Typography>
      );
    }
    return view;
  };

  return (
    <div className={classes.audioContainer} style={{ border: 'none' }}>
      <AudioPlayer
      className="audioPlayerWrap"
        src={src}
        albumComposers={albumComposers}
        albumName={albumName}
        imageTxt={imageTxt}
        imageSrc={imageSrc}
        completionCallback={completionCallback}
        completionPercentage={completionPercentage}
        completedOnPecentageLimit={completedOnPecentageLimit}
        playCallback={playCallback}
        pauseCallback={pauseCallback}
        forceStop={completed}
        radioProgramId={radioProgramId}
        likesCount={likesCount}
        viewCount={viewCount}
        isLiked={isLiked}
        likeHandler={likeHandler}
      />
      {((isOverlay && timedStart) ||
        (timedStart && currentDifference !== 0 && currentDifference > -1)) && (
        <AudioOverlay>{getOverlayView()}</AudioOverlay>
      )}
    </div>
  );
};

AudioPlayerWrapper.defaultProps = {
  completionCallback: () => {},
  // imageSrc: MusicImage,
  playCallback: () => {},
  pauseCallback: () => {},
  timedStart: false,
  timeToStart: 0,
  likeClickHandler: () => {},
};

export default AudioPlayerWrapper;
