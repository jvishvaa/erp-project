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
import VideoModule from '../../components/VideoModule/videoViewer';

import Loading from '../../../../components/loader/loader';
import endpoints from 'config/endpoints';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DocumentViewer from '../../components/DocumentViewer/document-viewer';
import '../../induction-training/induction-training.scss';

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

const InductionUnit = () => {
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [activeStep, setActiveStep] = useState(0);
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const course = sessionStorage.getItem('induction_training');
  const courseType = sessionStorage.getItem('is_induction_training');
  const document = JSON.parse(sessionStorage.getItem('Doc'));
  const Vid = JSON.parse(sessionStorage.getItem('Vid'));
  const Download = JSON.parse(sessionStorage.getItem('Download'));
  // const deocmentDetails = JSON.parse(sessionStorage.getItem('document-details'));
  const mcqQueList = [];

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Assigned_by_Principal_CoOrdinator') {
          setModuleId(item.module);
          console.log(item.module);
        }
      });
    }
  }, []);
  const handleBack = () => {
    // history.push('/allchapterContentSubject');
    history.goBack();
  };

  const handleDownload = (download) => {
    window.open(download.file);
  };
  console.log(course, 'history?.location?');
  const handleComplete = (item=history?.location?.state) => {
    // if(item.length===item[item.length-1]){
    //   console.log('is_finish', true)
    // }else{
    //   console.log('is_finish', false)
    // }
    let finish = JSON.parse(sessionStorage.getItem('is_finish'));
    
    if (courseType === 'is_self_driven') {
      let courseFinish;
      if (history.location.courseType === 'self_driven') {
       console.log(finish , "is-finish");
        courseFinish = {
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,
          // is_finish: finish === true ? true : false,
          is_self_driven: true,
        };
      } else {
        courseFinish = {
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,
          // is_finish:finish === true ? true : false,
          is_induction_training: true,
        };
      }

      setLoading(true);
      let URL = ''
      if(sessionStorage.getItem('trainer') === true){
        URL = `${endpoints.sureLearning.FinishChapterApi}?trainer=true`
      }else{
        URL =`${endpoints.sureLearning.FinishChapterApi}?${course}=true`
      }
      axios
        .post(
          URL,
          JSON.stringify(courseFinish),
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          if (res.status === 404) {
            setLoading(false);
            setAlert('warning', 'something went wrong');
          }
          if (res.status === 500) {
            setLoading(false);
            setAlert('warning', 'Internal server error');
          }
          if (res.status === 201) {
            setLoading(false);
            setAlert('success', 'You have successfully completed this lesson');
          }
          if (res.status !== 201 && res.status !== 404) {
            setLoading(false);
            setAlert('warning', 'somthing went wrong please try again ');
          }
          return 0;
        });
    }
    if (courseType === 'is_induction_training') {
      let courseFinish;
      console.log(history?.location?.state?.course_content, 'courseFinish1');
      if (history.location.courseType === 'self_driven') {
        courseFinish = {
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,

          is_self_driven: true,
          // is_finish:finish === true ? true : false,
        };
      } else if (history.location.courseType === 'is_induction_training') {
        courseFinish = {
          content_id: history?.location?.state?.id,
          course_content_id: history?.location?.state?.course_content,
          is_induction_training: true,
          // is_finish:finish === true ? true : false,
        };
      }
      console.log(course, 'history?.location?');
      let URL = ''
      if(sessionStorage.getItem('trainer') === 'true'){
        URL = `${endpoints.sureLearning.FinishChapterApi}?trainer=true`
      }else{
        URL =`${endpoints.sureLearning.FinishChapterApi}?${course}=true`
      }
      setLoading(true);
      axios
        .post(
          URL,
          JSON.stringify(courseFinish),
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          if (res.status === 404) {
            setLoading(false);
            setAlert('warning', 'something went wrong');
          }
          if (res.status === 500) {
            setLoading(false);
            setAlert('warning', 'Internal server error');
          }
          if (res.status === 200) {
            setLoading(false);
            setAlert('warning', 'data fetched successfully');
          }
          if (res.status === 201) {
            setLoading(false);
            setAlert('success', 'You have successfully completed this lesson');
          }
          if (res.status !== 201 && res.status !== 404 && res.status !== 200) {
            setLoading(false);
            setAlert('error', 'somthing went wrong please try again ');
          }
          return 0;
        });
    }
    sessionStorage.setItem('complete', 'true');
    // history.goBack();
    if(finish === true) {
    sessionStorage.setItem('is_finish','false')
    }
   sessionStorage.setItem('reload','true')
  };
  const BreadCrumb = sessionStorage.getItem('BreadCrumb');
  return (
    <Layout className='contentContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName={BreadCrumb}
          isAcademicYearVisible={true}
        />
        <div id='docContainer'>
          <div id='buttonArea'>
            <Button
              variant='contained'
              className='canceButton labelColor'
              size='medium'
              style={{ margin: '0 10px', width: '10%' }}
              onClick={handleBack}
            >
              Back ff
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleComplete}
            >
              Complete
            </Button>
          </div>
          <Grid item md={1} xs={12}></Grid>
          <Box>
            {sessionStorage.getItem('chapter-content-type') === 'Video' ? (
              <Box>
                {Vid &&
                  Vid.map((video, index) => (
                    <Grid item md={12} xs={12} key={index}>
                      <VideoModule file={video.file} title={video.title} />
                    </Grid>
                  ))}
              </Box>
            ) : null}

            {sessionStorage.getItem('chapter-content-type') === 'Assessment' ? (
              <Grid
                item
                md={12}
                xs={12}
                style={{ marginTop: '40px' }}
                className='pdfContain'
              >
                {document &&
                  document.map((document, index) => (
                    <Grid item md={12} xs={12} key={index}>
                      <DocumentViewer pdfUrl={document.file} />
                    </Grid>
                  ))}
              </Grid>
            ) : null}

            {sessionStorage.getItem('chapter-content-type') === 'Download' ? (
              <Grid
                item
                md={12}
                xs={12}
                style={{ marginTop: '40px' }}
                className='pdfContain'
              >
                {Download &&
                  Download.map((Download, index) => (
                    <Grid item md={12} xs={12} key={index} id='each-download'>
                      <div className='download-section'>
                        <p> {index + 1} . </p>
                        <p>{Download.title}</p>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => handleDownload(Download)}
                        >
                          Download
                        </Button>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            ) : null}
          </Box>
        </div>
      </div>
    </Layout>
  );
};

export default InductionUnit;
