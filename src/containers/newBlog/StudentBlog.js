import React, { useState, useEffect,useContext} from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './images.css';
// import cakeImg from './Images/newcakeimage.jpg';


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
      console.log(response?.data?.result);
      // setAssignPreview(response);
      setPreviewData(response?.data?.result);

    });

  }
 
  

  const handleSubmit=()=>{
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
          <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
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
              </div>

          

          <div style={{ color: 'gray', marginTop: '12px' }}>Instructions: </div>
          <div>{title?.description}</div>
          

          <div style={{ marginTop: '20px', color: 'gray' }}>Write Your Blog</div>
          <div style={{ marginTop: '10px' }}>
          <div
        style={{
          background: `url(${"https://activities-k12.s3.amazonaws.com/dev/olvorchidnaigaon/activity_templates/7/newcakeimage.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQWJOGETZRNTK4YK6%2F20220912%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220912T102957Z&X-Amz-Expires=21600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAn9ksrCbz%2FOFZkFJe%2FX1pNfTFDC%2FvwngVSI2oRE8nQmACIQCq%2FZUSNlTsGerghxWnjnwcgyIvRcpIV8STLbmu8LAd6SrfBAiL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDA0Nzg3ODM4MjgzNSIM2bTWFILUiUd%2F8dTSKrMEVaoV1OyRDrmQ8kN1CO2thaXofbrRTMevFBYfQMWMZG1Ez4uXm%2Bv4zWt%2BBVx3DsV9YKXCdiMPSQ%2FpOmCpzC3p9wP5JOg1qMm40djbdha1zd9qggRkLfKTw5AzRFxXcKbyPScYaAZHNkPACGjhdOpORjDfp1ADLyFOY11vEiHCYUMiBq4%2F4Dca6R9mSAlyHXJ%2Bdwp3870GZ6YLgllA8szIrbHhj3x2a1d%2BYOVzJqpb4q%2BsgKgBLzNJCuUrXEBcSGtEajjA0X2jaKHK88fzM0eKHdXXKqKj9qTWYHp3Oq1VVqvCSZlcw5wPyXvkiOVVJXCe2s0QWZ91cNxX65j8gzl7%2FluszeU%2BQ9XRmrbx9oA%2BzENAPrKY4vwnD7kQFY%2F7Rl2%2Btgg565Qi0HhTq0bTvjKmjQP9MoD6ruXzBkdbEt6t3NHdpjCfQBryUjqp%2Fzk94x9YJ1MG9VoBxtlTGVT2ZLDWyXIgOZB7UDKNNtRzcGN0iLLLh15SNQxQ96QUkYwBqOIxPtFRjTsZx2p1YrH3GojlqxSbhM8LWnF3UIgX8i532M4r8bxOE1%2F6N6gilcOdUq58YI%2FQ0JFK0xIUqR0IKYf5Aqi9Fh7HdM1wEtvCsC4lMu27TpdS2ro96U2v%2FIWGcqTaVVwKpHRiB3%2FWfZ4mosX6bt61EiYvmW4xtDU7VOdTjcWKtjXyA7xMWrau1L0XyNOP6uLkSkzT1ybvwrjLhyCA5sh4Duerf%2FR4hre6MXlq91xu3xgwmI78mAY6qAHjU8jaQEK0GdIVFnLtXhb%2FQh3%2FC3Bgyn9WoCRpteyo0QsGe9od%2FkzXwahfpvJ%2FZcT1N4EqsvSLYH%2B73lLBmW4HcpVLqhqVtKU6pAX8Uu1idZDsBWCQ7qvdtZG69OnTb%2FAFVm6SB%2BjzE3ZAh5%2ByVQXuz1V%2BWTPQWb1Wf%2B8JMGgQa2CVXq3w%2BEOcVubvoozB0wM0GmisAqLv55dRgGoiDyf%2BHawnAzNQvAc%3D&X-Amz-Signature=19465bd2a27ed8fdc44bef3c024d5b113788fde6cd4ae21a710c7fc7a6faf79e"
        })`,
          backgroundSize: "contain",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(244 245 247 / 25%)",
    height: "1000px",
        }}
      >
        <div className="certificate-text-center certificate-input-box">
          <textarea className="certificate-box" style={{width: "503px",
    height: "483px"}} onChange={changeHandle}placeholder="type text here..." />
         
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
