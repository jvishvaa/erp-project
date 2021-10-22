import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import axiosInstance from '../../../config/axios';
import endpoints from 'config/endpoints';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ReactHtmlParser from 'react-html-parser';
import VideoModule from './videoforLearn';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import './learning.scss';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  cards: {
    minWidth: 275,
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button); 

const EachLearn = () => {
  const classes = useStyles({});
  const [moduleId, setModuleId] = useState(null);
  const [learnList, setLearnList] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const [ courseId , setCourseId ] = useState('');
  const userId = udaanDetails.personal_info.user_id;
  const [certificateBtn, setCertificateBtn] = useState(true);
  const [bottomHRef, setBottomHRef] = useState('');
  const ratingStatus = sessionStorage.getItem('ratingStatus');
    const [ eachLearn , setEachLearn  ] = useState('');
    const [ desc , setDesc ] = useState('');


    const { setAlert } = useContext(AlertNotificationContext);


  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Learning_Notes') {
          setModuleId(item.module);
        }
      });
    }
    if(history?.location?.state){
        setEachLearn(history?.location?.state)
        console.log(history?.location?.state , "his");
    }
  }, []);

  const history = useHistory();

  const handleBack = () => {
      // history.push('/subjectTrain');
      history.goBack();
  };

  const getCardColor = (index) => {
    const colors = ['#54688c', '#f47a62', '#4a66da', '#75cba8'];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  const handleEditorChange = (content, editor) => {
      console.log(content , "conte");
      setDesc(content);
    // setDescription(content);
    // setDescriptionDisplay(editor?.getContent({ format: 'text' }));
  };

  const submitNote = () => {
      let data = {
        learning_module: history?.location?.state?.id,
        notes: desc
      }

      axios
      .post(
        `${endpoints.sureLearning.SaveNotes}`,data,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
          console.log(response , "vid");
          setAlert('success', 'Notes Saved !')
          history.push('/learningVideos')
      })
      .catch((error) => {
        console.log(error);
      });
  }

//   useEffect(() => {
//       handleChapters()
//   }, [moduleId]);

//   const handleChapters = () => {
//       if(moduleId !== null){
//     axios
//       .get(
//         `${endpoints.sureLearning.LearningVideos}?page_size=5&page=2&type=1`,
//         {
//           headers: {
//             Authorization: `Bearer ${udaanToken}`,
//             module: moduleId,
//           },
//         }
//       )
//       .then((response) => {
//           console.log(response , "vid");
//         setLearnList(response.data.results);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     }
//   };

  
  return (
    <Layout >
      <div className={classes.parentDiv} id='eachLear'>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Learning Videos'
          isAcademicYearVisible={true}
        />
        <Grid container spacing={2} style={{ marginTop: '5px', marginLeft: '15px' }}>
          <Grid item md={2} xs={12}>
            <Button
              variant='contained'
              size='medium'
              style={{ width: '100%' }}
              className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
          <Grid item md={2} xs={12}>
            <Button
              variant='primary'
              size='medium'
              style={{ width: '100%' }}
            //   className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={submitNote}
            >
              Save
            </Button>
          </Grid>
        </Grid>
        <div className='titleLearn'  >
            <p>{eachLearn?.title}</p>
            </div>
        <div
          style={{
            display: 'flex',
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
          className="video-area"
        >
         <div className='video-box'>
             <VideoModule file={eachLearn?.video}  />
         </div>
          <div className='desc-area' >
          {ReactHtmlParser( eachLearn?.text)}
          </div>
        </div>
        <div className='tinyEditor'>
          <MyTinyEditor 
              handleEditorChange={handleEditorChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EachLearn;
