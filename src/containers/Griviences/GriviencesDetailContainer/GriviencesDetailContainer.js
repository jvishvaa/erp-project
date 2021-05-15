import React, { useContext, useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  InputBase,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import './GriviencesDetailContainer.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Reply from '../Reply/reply';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import moment from 'moment';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  text_color: {
    color: '#014B7E',
  },
  titleText: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  container: {
    // width: '90%',
    marginTop: '20px',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #E2E2E2',
    // border: '1px solid red',
  },

  purple: {
    backgroundColor: '#F3D1AB',
    // marginLeft: '20px',
  },
  flex_column: {
    display: 'flex',
    flexDirection: 'column',
  },
  blue: {
    background: '#78B5F3',

    width: '30px',
    height: '30px',
  },
  small: {
    width: '20px',
    height: '20px',
  },
  reply_button: {
    color: '#FF6B6B',
    cursor: 'pointer',
  },
}));

const GriviencesDetailContainer = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [reply, setReply] = useState(false);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [loading, setLoading] = useState(false);
  const [replyDescription, setReplyDescription] = useState('');
  const reply_list = props.list_tickets.reply;

  const [replyList, setReplyList] = useState(reply_list === {} ? false : true);
  const date = moment(props.list_tickets.createdAt).format('dddd, MMMM D, YYYY');
  const time = moment(props.list_tickets.createdAt).format('LT');
  const [flag, setFlag] = useState(false);

  console.log('reply_list', reply_list);

  const openReplyTextEditor = () => {
    setReply(!reply);
  };

  const handleReply = async (event) => {
    await setReplyDescription(event.target.value);
  };
  const [image, setImage] = useState([]);
  const fileChangedHandler = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = () => {
    setReply(!reply);
    axiosInstance
      .post(
        endpoints.grievances.grievance_reply,
        // { body: replyDescription, grievance_ticket: props.list_tickets.id ,replyImage:image},
        { body: replyDescription, grievance_ticket: props.list_tickets.id },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          setAlert('success', 'Reply sent');
        } else {
          if (response.data.message == 'Something went wrong,please try again later') {
            setAlert('error', 'Reply cannot be empty');
          }
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };
  useEffect(() => {
    console.log('testing');
  }, [flag]);

  const style = useStyles();
  return (
    <div className='grevience-container' style={{ borderRadius: '10px' }}>
      <Paper className={style.container}>
        <div>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  className={style.purple}
                  src={props?.list_tickets?.user?.profile}
                />
                <span style={{ marginLeft: '10px'}}>
                  <Typography className={style.titleText}>
                    {props?.list_tickets?.title}
                  </Typography>
                  <Typography style={{fontSize: '18px'}}>{props?.list_tickets?.ticket_type}</Typography>
                </span>
              </div>

              <div style={{ textAlign: 'end' }}>
                <label className={style.text_color}>{date}</label>
                <br />
                <label className={style.text_color}>{time}</label>
              </div>
            </div>

            <Grid container style={{ padding: '25px' }}>
              <Grid item sm={12}>
                <Typography className={style.titleText}>
                  {props?.list_tickets?.title}
                </Typography>
                <label className={style.text_color}>
                  {' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: props?.list_tickets?.description,
                    }}
                  />
                </label>
              </Grid>
            </Grid>

            <Grid sm={3}>
              <div className={style.flex_column}>
                <label className={style.text_color}>
                  {props?.list_tickets?.user?.name}
                </label>
                {props?.list_tickets?.user?.role != undefined ? (
                  <label className={style.text_color}>
                    {props?.list_tickets?.user?.role?.role_name}
                  </label>
                ) : null}
              </div>
            </Grid>
          </div>
          <Grid item sm />
          <Grid sm={4}></Grid>
        </div>

        {reply_list && reply_list?.body && (
          <div
            style={{
              margin: '10px',
              border: '1px solid #E2E2E2',
              borderRadius: '10px',
            }}
          >
            <Reply Replys={reply_list} />
          </div>
        )}

        {!replyList ? (
          <div>
            {!reply &&
              (reply_list != '' && reply_list != null
                ? reply_list &&
                  reply_list?.slice(0, 1)?.map((Replys) => (
                    <div
                      style={{
                        margin: '10px',
                        border: '1px solid red',
                        borderRadius: '10px',
                      }}
                    >
                      <Reply Replys={Replys} />
                    </div>
                  ))
                : null)}
            {reply &&
              (reply_list != '' && reply_list != null
                ? reply_list &&
                  reply_list?.map((Replys) => (
                    <div
                      style={{
                        margin: '10px',
                        border: '1px solid green',
                        borderRadius: '10px',
                      }}
                    >
                      <Reply Replys={Replys} />
                    </div>
                  ))
                : null)}
          </div>
        ) : null}

        <Grid container style={{ marginBottom: '10px' }}>
          <Grid item sm />
          <Grid item sm='1'>
            <h4 className={style.reply_button} onClick={openReplyTextEditor}>
              Reply
            </h4>
          </Grid>
        </Grid>

        {reply == true ? (
          <Grid
            // container
            // direction='row'
            // justifyContent='space-between'
            style={{
              //  border: '1px solid #78B5F3',
              border: '1px solid #78B5F3',
              display: 'flex',
              justifyContent: 'space-between',
              borderRadius: '10px',
              padding: '3px',
              width: '80%',
              margin: 'auto',
            }}
          >
            <Grid
              style={{
                display: 'flex',

                justifyContent: 'center',
                marginTop: '5px',
              }}
            >
              <Grid>
                <Avatar
                  size='small'
                  className={style.blue}
                  style={{
                    fontSize: '10px',
                    width: '20px',
                    height: '20px',
                    marginRight: '1px',
                  }}
                ></Avatar>
              </Grid>
              <Grid>
                {' '}
                <label className={style.text_color} style={{ marginRight: '1px' }}>
                  swaggy
                </label>
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                style={{
                  backgroundColor: 'blue',
                  margin: '3px',
                }}
              />

              <Grid>
                {' '}
                <ThemeProvider>
                  <InputBase
                    onChange={handleReply}
                    placeholder='Type your reply here...'
                    id='mui-theme-provider-standard-input'
                    style={{ fontSize: '12px', width: '100%' }}
                  />
                </ThemeProvider>
              </Grid>
            </Grid>
            {/* <Grid style={{ display: 'flex', justifyContent: 'center' }}> */}
            {/* <Grid></Grid> */}

            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              {setMobileView ? (
                <Grid>
                  {' '}
                  <input type='file' onChange={(event) => fileChangedHandler(event)} />
                </Grid>
              ) : (
                <></>
              )}
              <Grid>
                <Button
                  variant='contained'
                  size='small'
                  style={{
                    background: '#78B5F3',
                    color: 'white',
                    width: '30px',
                  }}
                  onClick={handleSubmit}
                >
                  Post
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : null}
      </Paper>
    </div>
  );
};

export default GriviencesDetailContainer;
