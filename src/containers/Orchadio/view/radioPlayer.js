import React, { useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  // Button,
  Typography,
  useTheme
} from '@material-ui/core';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
} from '@material-ui/icons';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import orchidsRadioLogo from './orchidsRadioLogo.png';
import playerbg from './header@2x.png';

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
  const [loading, setLoading] = React.useState(false);
  const [branchName, setBranchName] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();

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
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {});
  };
  const radioList = (item) => {
    return (
      <>
        <div style={{ backgroundImage: `url(${playerbg})`, objectFit: 'cover' }}>
          <Grid container justify='flex-start' alignItems='center'>
            {item.map((i) => (
              <>
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
                    <Typography variant='body2' color='textprimary' align='left'>
                      {i.branchName}
                    </Typography>
                    {/* ))} */}
                  </div>
                </Grid>
                <Grid item xs={1}>
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
            {radioList(data)}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default RadioPlayer;
