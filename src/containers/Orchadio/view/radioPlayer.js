import React, { Component, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  Divider,
  // Button,
  Typography,
  useTheme
} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
} from '@material-ui/icons';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import categoryData from '../../discussionForum/discussion/categoryData';
// import AudioPlayerWrapper from './audioPlayerWrapper';
import Loading from '../../../components/loader/loader';
import orchidsRadioLogo from './orchidsRadioLogo.png';
import playerbg from './header@2x.png';

// const Timer = require('time-counter');

// const log = console.log.bind(console);
// const countDown = new Timer({
//   direction: 'down',
//   startValue: '1:00', // one minute
// });
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 'fit-content',
  },
  paperRoot: {
    width: 'fit-content',
    // border: `1px solid ${theme.palette.divider}`,
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
  iconsColorView: {
    color: 'yellow',
  },
  iconsColorLike: {
    color: 'red',
  },
}));

function RadioPlayer(props) {
  const classes = useStyles();
  const { data } = props;
  const [ExpandedPanel, setExpandedPanel] = React.useState(null);
  const [audioSrc, setAudioSrc] = React.useState('');
  const [RadioTitle, setRadioTitle] = React.useState('Orchadio');
  const [isLiked, setisLiked] = React.useState(false);
  const [orchadioId, setOrchadioId] = React.useState('');
  // const [status, setStatus] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [branchName, setBranchName] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  useEffect(() => {
    // console.log(props.data);
  }, []);

  const handleChange = (panel) => (event, expanded) => {
    setExpandedPanel(expanded ? panel : false);
    // this.setState({
    //   expanded: expanded ? panel : false,
    // });
  };
  const Expandpanel = (item) => {
    const branch = [];
    console.log(item.files[0]);
    setAudioSrc(item.files[0]);
    setRadioTitle(item.album_name);
    setOrchadioId(item.id);
    item.branch.map((i) => setBranchName([...branch, i.branch_name]));
    console.log(branchName);
    // setBranchName([])
  };
  const likeHandler = (status, categoryType) => {
    setisLiked(!status);
    console.log(orchadioId);
    const formData = new FormData();
    formData.append('radio_program_id', orchadioId);
    formData.append('category_type', categoryType === 'Like' ? 1 : 2);
    formData.append('is_like', status);
    axios
      .post(`${endpoints.orchadio.OrchadioLikes}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          setisLiked(!status);
          // setData(result.data.result);
          // setAudioLink(result.data.result);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {});
  };
  const radioList = (item) => {
    // countDown.on('change', log);

    // countDown.on('end', function () {
    //   console.log('Blastoff!');
    // });
    return (
      <>
        <div style={{ backgroundImage: `url(${playerbg})`, objectFit: 'cover' }}>
          {/* <img src={playerbg} style={{  }} alt='not available' /> */}
          <Grid container justify='flex-start' alignItems='center'>
            {item.map((i) => (
              <>
                {/* <div style={{ border: '1px solid red' }}> */}
                <Grid item xs={6}>
                  <img
                    src={orchidsRadioLogo}
                    alt='not Found'
                    width='95px'
                    style={{
                      float: 'left',
                      border: '1px solid yellow',
                      borderRadius: '60px',
                      padding: '10px',
                      backgroundColor: 'white',
                    }}
                  />
                  <div style={{ marginLeft: '20%', width: '100%' }}>
                    <Typography variant='h6' align='left'>
                      {i.radioTitle}
                    </Typography>
                    <Typography variant='body2' color='textprimary' align='left'>
                      by
                    </Typography>
                    {/* {branchName.map((item) => ( */}
                    <Typography variant='body2' color='textprimary' align='left'>
                      {i.branchName}
                    </Typography>
                    {/* ))} */}
                  </div>
                </Grid>
                <Grid item xs={1}>
                  {/* <Typography variant='caption'>{likesCount || 0}</Typography> */}
                  <Tooltip title='Views'>
                    <IconButton
                      className={classes.iconsColorView}
                      style={{ color: '#d8ff13' }}
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography style={{ marginTop: '-10px' }}>{i.views}</Typography>
                </Grid>
                <Grid item xs={1}>
                  {/* <Typography variant='caption'>{viewCount || 0}</Typography> */}
                  <Tooltip title='Likes'>
                    <IconButton
                      className={classes.iconsColorLike}
                      onClick={() => likeHandler(isLiked, 'like')}
                    >
                      {isLiked ? <LikeIcon /> : <UnlikeIcon />}
                    </IconButton>
                  </Tooltip>
                  <Typography style={{ marginTop: '-10px' }}>{i.likes}</Typography>
                </Grid>

                <AudioPlayer
                  style={{ marginTop: 40 }}
                  // autoPlay
                  src={`${endpoints.s3}/${i.audioSrc}`}
                  onPlay={(e) => console.log('onPlay')}
                />
                {/* </div> */}
              </>
            ))}
          </Grid>
        </div>
      </>
    );
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} style={{ height: 250 }}>
            {}
            {/* <div style={{ marginBottom: '20px' }} key={`${item.id} ${i + 1}`}> */}
            {/* <AudioPlayerWrapper
                albumName={item.program_name}
                // imageTxt='Orchids'
                albumComposers={item.program_made_by.split(', ')}
                src={item.audio_file}
                timeToStart={getFormattedHrsMnts(date[3], date[4])}
                timedStart
                dateToStart={selectedDate}
                duration={item.duration}
                completionPercentage={80}
                completionCallback={() => completionCallback(item.id)}
                completedOnPecentageLimit={(percentage) =>
                  completedOnPecentageLimit(item.id, percentage)}
                likeHandler={() => likeClickHandler(item.id)}
                likesCount={item.total_program_likes}
                viewCount={item.total_program_participants}
                imageSrc={orchadioImg}
                isLiked={item.is_liked === 'True'}
                radioProgramId={item.id}
              /> */}
            {/* </div> */}
            {/* <AudioPlayer
              autoPlay
              src='https://cdn12.pimpilikka.site/download/I1Ob2Lo4MdayKoo7tuhneQ/1613029417/t/2008/Vaaranam-Aayiram/320/Ava-Enna-Enna-MassTamilan.com.mp3'
              onPlay={(e) => console.log('onPlay')}
            /> */}
            {radioList(data)}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default RadioPlayer;
