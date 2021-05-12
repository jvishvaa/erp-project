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
import Reply from '../Reply/reply';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import moment from 'moment';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';

const useStyles = makeStyles((theme) => ({
  text_color: {
    color: '#014B7E',
  },
  container: {
    // width: '90%',
    marginTop: '20px',
    padding: '20px',
  },
  flex_row: {
    display: 'flex',
    flexDirection: 'row',
  },
  purple: {
    backgroundColor: '#F3D1AB',
    marginLeft: '20px',
  },
  flex_column: {
    display: 'flex',
    flexDirection: 'column',
  },
  blue: {
    backgroundColor: '#78B5F3',
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
  const [loading, setLoading] = useState(false);
  const [replyDescription, setReplyDescription] = useState('');
  const reply_list = props.list_tickets.reply;

  const [replyList, setReplyList] = useState(reply_list === {} ? false : true);
  const date = moment(props.list_tickets.createdAt).format('dddd, MMMM D, YYYY');
  const time = moment(props.list_tickets.createdAt).format('LT');
  const [flag, setFlag] = useState(false);

  console.log("reply_list", reply_list);

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
          setAlert('error', response.data.message);
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
    <div
      className='grevience-container'
      style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
    >
      <Paper className={style.container}>
        <div className={style.flex_row} style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Avatar className={style.purple} src={props?.list_tickets?.user?.profile} />
            </div>
            <div>
              <Grid container style={{ padding: '30px' }}>
                <Grid item sm={12}>
                  <h5 className={style.text_color} style={{ fontSize: '20px' }}>
                    {props?.list_tickets?.title}
                  </h5>
                </Grid>
                <Grid item sm={12}>
                  <label className={style.text_color}>
                    {' '}
                    <span dangerouslySetInnerHTML={{ __html: props?.list_tickets?.description }} />
                  </label>
                </Grid>
              </Grid>
            </div>

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
          <Grid sm={4}>
            <div className={style.flex_column}>
              <label className={style.text_color} style={{ alignSelf: 'flex-end' }}>
                {date}
              </label>
              <label className={style.text_color} style={{ alignSelf: 'flex-end' }}>
                {time}
              </label>
            </div>
          </Grid>
        </div>

        {reply_list && reply_list?.body && (
          <div
            style={{
              margin: '10px',
              border: '1px solid #e0e0e0',
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
                        border: '1px solid #e0e0e0',
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
                        border: '1px solid #e0e0e0',
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
          <div
            style={{
              width: '80%',
              alignItems: 'center',
              marginLeft: '10%',
              padding: '2px',
              height: '40px',
            }}
          >
            <Grid
              container
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #78B5F3',
                borderRadius: '10px',
              }}
            >
              <div style={{ marginLeft: '5px', marginRight: '5px' }}>
                <Avatar
                  size='small'
                  className={style.blue}
                  style={{
                    height: '30px',
                    width: '30px',
                    fontSize: '10px',
                  }}
                ></Avatar>
              </div>
              <div>
                <label className={style.text_color}>swaggy</label>
              </div>
              <Divider
                orientation='vertical'
                flexItem
                style={{ backgroundColor: 'blue', margin: '10px' }}
              />
              <Grid item sm={6}>
                <ThemeProvider>
                  <InputBase
                    onChange={handleReply}
                    placeholder='Type your reply here...'
                    id='mui-theme-provider-standard-input'
                    style={{ fontSize: '12px', width: '100%' }}
                  />
                </ThemeProvider>
              </Grid>
              <Grid item sm />
              <Grid>
                {/* <AttachFileIcon color='secondary' fontSize='small' clss /> */}
                <input type='file' onChange={(event) => fileChangedHandler(event)} />
              </Grid>
              <Button
                variant='contained'
                size='small'
                className={style.blue}
                style={{ color: '#fff' }}
                onClick={handleSubmit}
              >
                Post
              </Button>
            </Grid>
          </div>
        ) : null}
      </Paper>
    </div>
  );
};

export default GriviencesDetailContainer;
