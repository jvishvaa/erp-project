import React, { useState, useEffect,useContext} from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './images.css';
// import cakeImg from './Images/newcakeimage.jpg';
import ReactHtmlParser from 'react-html-parser';


import {
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Breadcrumbs,
  Typography,
  Button,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MessageIcon from '@material-ui/icons/Message';
import { setDate } from 'date-fns/esm';
import endpoints from '../../config/endpoints';


import './styles.scss';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  card: {
    marginLeft: '20rem',
    width: '38rem',
    backgroundColor: '#FFFFFF',
  },
  tinymceHeight: {
    height:"298px !important"
  },
  box: {
    width: '38rem',
    height: '20rem',
    backgroundColor: '#EBEEF3',
  },
  internalCard: {
    width: '30rem',
    height: '14rem',
  },
}));

const StudentBlog = () => {
  const [value, setValue] = useState();
  const history = useHistory();
    const User_id  = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
const todayDate = moment();

  const { setAlert } = useContext(AlertNotificationContext);


  const [desc, setDesc] = useState('');

  const classes = useStyles();
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
  const changeHandle=(e) => {
    setDesc(e.target.value);

  }
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [activityId,setActivityId]=useState("");
  const [submission,setSubmission] = useState("");
  const [imageData, setImageData] = useState("");
  
  const goBack=()=>{
    history.push('/blog/studentview');
  }

  console.log(history, 'history');
  const [previewData, setPreviewData] = useState();

  useEffect(() => {
    if (history?.location?.pathname === '/blog/activityedit') {
      setTitle(history?.location?.state?.response);
      setDescription(history?.location?.state?.response?.description);
      setSubmission(history?.location?.state?.response?.submission_date);
      setActivityId(history?.location?.state?.response?.id)
    }
    showdata();
  }, [history]);

  const showdata=()=>{
    axios
    .get(
      `${endpoints.newBlog.previewDetails}${history?.location?.state?.response?.id}/`,
      {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      }
    )
    .then((response) => {
      // setAssignPreview(response);
      setImageData(JSON.parse(response?.data?.result?.template?.html_file))
      setPreviewData(response?.data?.result);

    });

  }
 
  

  const handleSubmit=()=>{
    if(desc.length === 0) {
      setAlert('error', 'Please Enter Text in Template')
      return
    }
    const dummyData= JSON.parse(previewData?.template?.html_file)
    dummyData[0].placeholder = desc
    // const formData = new FormData();
    // formData.append('activity_detail_id', activityId);
    // formData.append('user_id', User_id?.id);
    // formData.append('submitted_on', submission);
    // formData.append('created_at', submission);
    // formData.append('is_submitted', true);
    let body ={
      "booking_detail":{
        activity_detail_id:activityId,
        user_id:User_id?.id, 
        submitted_on:todayDate.format().slice(0,19),
        created_at:todayDate.format().slice(0,19),
        is_submitted:true,



      },
      "content": {
        html_text:desc,
        // image_data:previewData?.template?.html_file,
      }
    }

      axios
        .post(
          `${endpoints.newBlog.studentSideWriteApi}`,
          body,
          {
            headers: {
              // Authorization: `${token}`,
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          setAlert('success', 'Activity Successfully Created');
          history.push('/blog/studentview');

        })

  }
  return (
    <Layout>
      <Grid
        container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '22px',
          paddingRight: '15px',
          paddingBottom: '15px',
        }}
      >
        <Grid item xs={4} md={4}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' variant='h6'>
              <strong>Student Blog</strong>
            </Typography>
            <Typography color='Primary'>Write Blog</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <div
        style={{
          height: 'auto',
          width: '90%',
          border: '1px solid lightgray',
          marginLeft: '36px',
        }}
      >
        <div style={{ margin: '18px' }}>
          <div style={{ color: 'gray', fontSize: '14px' }}>{title?.activity_type_name}</div>
          <div style={{ fontSize: '20px' }}>{title?.title}</div>
          <div style={{ fontSize: '10px', color: 'gray' }}>
            Assinged -{submission?.slice(8, 10)} &nbsp;
            {new Date(submission)?.toLocaleString('en-us', {
              month: 'short',
            })}
            &nbsp;{submission?.slice(0, 4)}
          </div>
          {/* <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                Branch -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.branches.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Grade -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.grades.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Section -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.sections.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div> */}

          

          <div style={{ color: 'gray', marginTop: '12px' }}>Instructions: </div>
          <div>{title?.description}</div>
          

          <div style={{ marginTop: '20px', color: 'gray' }}>Write Your Blog</div>
          <div style={{justifyContent:"center"}}>
          <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    height: '683px',
                    marginTop: '12px',
                    marginBottom: '29px',
                  }}
                >
                  <div >
          <div
        style={{
          background: `url(${previewData?.template?.template_path})`,
          
        }}
        className="background-image-write"
      >
        <div className="certificate-text-center certificate-input-box">
          <textarea 
          className="certificate-box" 
          style={{width: `${imageData[0]?.width}px`,
    height: `${imageData[0]?.height}px`, top: `${imageData[0]?.x_cordinate}px`, left: `${imageData[0]?.y_cordinate}px`}} 
    onChange={changeHandle} placeholder="type text here..." />
         
        </div>
      </div>
      </div>

            {/* <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="background-image">
              <Grid item>
                <textarea>hhhh</textarea>
              </Grid>
            </Grid> */}
            {/* <MyTinyEditor
              handleEditorChange={handleEditorChange}
              placeholder='Description...'
              // style={{ height: '400px' }}
              className="tox-tinymce"
              // content='<img src="https://st.depositphotos.com/1015682/1248/i/600/depositphotos_12483210-stock-photo-elephant-with-large-tusks.jpg" />'
            /> */}
          </div>

          </div>
          {/* <div>{ReactHtmlParser(previewData?.template?.html_file)}</div> */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Button
              variant='outlined'
              color='primary'
              size='medium'
              style={{ backgroundColor: 'white' }}
              onClick={goBack}
            >
              Back
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;
            <Button variant='contained' color='primary' size='medium' onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentBlog;
