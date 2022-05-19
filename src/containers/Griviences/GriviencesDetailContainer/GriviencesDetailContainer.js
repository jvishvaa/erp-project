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
import DNDFileUpload from 'components/dnd-file-upload';

const useStyles = makeStyles((theme) => ({
  text_color: {
    color: theme.palette.secondary.main,
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
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginTop: '25%'
  },
}));

const GriviencesDetailContainer = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [reply, setReply] = useState(false);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [loading, setLoading] = useState(false);
  const [studentView, setStudentView] = useState();
  const [replyDescription, setReplyDescription] = useState('');
  const reply_list = [props?.list_tickets?.reply];
  const [replyflag, setReplyFlag] = useState(false);
  const [replyList, setReplyList] = useState(
    Object.keys(props.list_tickets.reply).length === 0 ? false : true
  );
  const [openUpload, setOpenUpload] = useState(false);
  const date = moment(props.list_tickets.createdAt).format('dddd, MMMM D, YYYY');
  const time = moment(props.list_tickets.createdAt).format('LT');
  const [flag, setFlag] = useState(false);

  const openReplyTextEditor = () => {
    setReply(!reply);
  };

  const handleReply = async (event) => {
    await setReplyDescription(event.target.value);
  };
  const [image, setImage] = useState([]);
  const formData = new FormData();

  const fileChangedHandler = (event) => {
    const file = event.target.files[0];
    // formData.append('grievance_reply_attachment', file  )
    setImage(file);
  };

  const fileConf = {
    fileTypes: 'image/jpeg,image/png,.pdf,video/mp4,audio/mpeg',
    types: 'images,pdf,mp3,mp4',
    initialValue: '',
  };

  const handleSubmit = () => {
    console.log(image);
    if (image !== [] && image?.length != 0) {
      if (image?.type == 'image/jpeg' || image?.type == 'image/jpg' || image?.type == 'image/png') {
     
        setReply(!reply);
        setReplyFlag((prevCheck) => !prevCheck);
        if (image !== []) {
          formData.append('grievance_reply_attachment', image)
        }
        formData.append('body', replyDescription)
        formData.append('grievance_ticket', props.list_tickets.id)
        axiosInstance
          .post(
            endpoints.grievances.grievance_reply,
            // { body: replyDescription, grievance_ticket: props.list_tickets.id ,replyImage:image},
            // { body: replyDescription, grievance_ticket: props.list_tickets.id , grievance_reply_attachment : formData },
            formData,

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.status == 200) {
              setAlert('success', 'Reply sent');
              setImage([])
              props.handleRefresh()
            } else {
              if (response.data.message == 'Something went wrong,please try again later') {
                setAlert('error', 'Reply cannot be empty');
              }
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setImage([])
          });
      } else {
        setAlert('error', "Please upload only Image Files")
      }
    } 
    if(image?.length == 0) {
      setReply(!reply);
      setReplyFlag((prevCheck) => !prevCheck);
      if (image !== []) {
        formData.append('grievance_reply_attachment', image)
      }
      formData.append('body', replyDescription)
      formData.append('grievance_ticket', props.list_tickets.id)
      axiosInstance
        .post(
          endpoints.grievances.grievance_reply,
          // { body: replyDescription, grievance_ticket: props.list_tickets.id ,replyImage:image},
          // { body: replyDescription, grievance_ticket: props.list_tickets.id , grievance_reply_attachment : formData },
          formData,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            setAlert('success', 'Reply sent');
            setImage([])
            props.handleRefresh()
          } else {
            if (response.data.message == 'Something went wrong,please try again later') {
              setAlert('error', 'Reply cannot be empty');
            }
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };
  let path = window.location.pathname;
  useEffect(() => {
    if (Object.keys(props.list_tickets.reply).length === 0) {
    } else {
    }

    if (path === '/griviences/admin-view') {
      setStudentView(false);
      if (
        props.FilterData.year &&
        props.FilterData.branch &&
        props.FilterData.grade &&
        props.FilterData.section &&
        props.FilterData.types
      ) {
        props.handleFilterData(
          props.FilterData.year,
          props.FilterData.branch,
          props.FilterData.grade,
          props.FilterData.section,
          props.FilterData.types
        );
      }
    } else if (path === '/griviences/student-view') {
      setStudentView(true);
    }

  }, [flag, replyflag]);

  const style = useStyles();
  return (
    <div className='grevience-container' style={{ borderRadius: '10px' }}>
      <div style={{ margin: '5px' }}>
        {!setMobileView ? (
          <div>
            {' '}
            <label className={style.text_color}>{date}</label>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Paper className={style.container}>
        <div className='reply_para'>
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
                <span style={{ marginLeft: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '110%' }}>
                    <Typography className={style.titleText}>
                      {props?.list_tickets?.user?.name}
                    </Typography>
                    <Typography className={style.titleText} style={{ fontSize: '15px', display: 'flex', alignItems: 'center' }} >
                      {props?.list_tickets?.user?.erp_id}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '110%' }}>
                    <Typography className={style.titleText} style={{ fontSize: '15px', display: 'flex', alignItems: 'center' }} >
                      {props?.list_tickets?.user?.section_mapping?.grade[0]?.grade__grade_name}
                    </Typography>
                    <Typography className={style.titleText} style={{ fontSize: '15px', display: 'flex', alignItems: 'center' }} >
                      {props?.list_tickets?.user?.section_mapping?.section[0]?.section__section_name}
                    </Typography>
                  </div>
                  <Typography style={{ fontSize: '18px' }}>
                    {props?.list_tickets?.grievance_type?.grievance_name}
                  </Typography>
                </span>
              </div>

              <div style={{ textAlign: 'end' }}>
                {setMobileView ? (
                  <div>
                    {' '}
                    <label className={style.text_color}>{date}</label>
                  </div>
                ) : (
                  ''
                )}

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
                <div>
                  <a href={props?.list_tickets?.grievance_attachment} target="_blank" >
                    <img src={props?.list_tickets?.grievance_attachment} style={{ minWidth: '10%', height: '100px' }} />
                  </a>
                </div>
              </Grid>
            </Grid>


          </div>
          <Grid item sm />
          <Grid sm={4}></Grid>
        </div>


        <div>
          {reply_list.length > 0 ? (
            <>
              <Reply Replys={reply_list} setPostFlag={props?.setPostFlag} />
            </>
          ) : <></>}
        </div>
        <Grid container style={{ marginBottom: '10px' }}>
          <Grid item sm />
          <Grid item sm='1'>
            <h4 className={style.reply_button} onClick={openReplyTextEditor} >
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
                width: '100%',
                justifyContent: 'center',
                marginTop: '5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }} >
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
                    {userDetails?.first_name}
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
              </div>
              <Grid style={{ width: '100%' }} >
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
                <>
                  <Grid>
                    {' '}
                    <input type='file' onChange={(event) => fileChangedHandler(event)} />
                  </Grid>
                </>
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
