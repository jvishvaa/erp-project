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
import Feedback from './feedback/SubmitRating';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './subject-traning.scss';

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

const AllSubjectChapters = () => {
  const classes = useStyles({});
  const [openFeedback, setOpenFeedback] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const [chapterList, setChapterList] = useState('');
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;
  const [courseId, setCourseId] = useState('');
  const userId = udaanDetails.personal_info.user_id;
  const [certificateBtn, setCertificateBtn] = useState(true);
  const [bottomHRef, setBottomHRef] = useState('');
  const ratingStatus = sessionStorage.getItem('ratingStatus');
  // const modelName = sessionStorage.getItem('moduleName');
  const [opendialogue, setOpendialogue] = useState(false);

  useEffect(() => {
    setBottomHRef([
      {
        pdf: `${
          endpoints.sureLearning.getCourseCertificateUrl
        }?course_id=${courseId}&user_id=${userId}&Authorization=${`Bearer ${udaanToken}`}&module=${moduleId}`,
      },
    ]);
  }, [setBottomHRef, moduleId, courseId, userId]);

  useEffect(() => {
    const isAllComplete = chapterList
      ? !chapterList.some((element) => element.is_completed === false)
      : false;
    if (isAllComplete === true) {
      setCertificateBtn(false);

      if (ratingStatus === 'false') {
        setOpendialogue(true);
      } else {
        setOpendialogue(false);
      }
    }
  }, [chapterList, ratingStatus]);

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Subject_Training') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  const history = useHistory();

  const handleBack = () => {
    // history.push('/subjectTrain');
    history.goBack();
  };

  useEffect(() => {
    if (history?.location?.state?.id) {
      console.log(history, 'hisroey subject');
      handleChapters(history?.location?.state?.id);
      setCourseId(history?.location?.state?.id);
    }
  }, [moduleId]);

  const handleChapters = (id) => {
    if (moduleId !== null) {
      axios
        .get(
          `${endpoints.sureLearning.filterSubject}?course_id=${id}&subject_training=true`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((response) => {
          setChapterList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChaplerDetails = (eachChapter) => {
    history.push({
      pathname: '/allchapterContentSubject',
      state: eachChapter,
      type: 'subject',
    });
    sessionStorage.setItem('content_id', eachChapter.id);
    sessionStorage.setItem('BreadCrumb', 'Subject Training');
  };

  const getCardColor = (index) => {
    const colors = ['#54688c', '#f47a62', '#4a66da', '#75cba8'];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName={'Subject Training'}
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
          <Grid item md={3} xs={12}>
            <Button
              disabled={certificateBtn}
              color='primary'
              variant='contained'
              style={{ marginLeft: '10px' }}
              // onClick={() => handleDownloadCertificate()}
              href={bottomHRef && bottomHRef[0].pdf}
            >
              Download Certificate
            </Button>
          </Grid>
        </Grid>
        <div
          style={{
            display: 'flex',
            // flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {chapterList &&
            chapterList.map((eachChapter, index) => {
              return (
                <Card
                  style={{
                    backgroundColor: getCardColor(index),
                    marginLeft: '20px',
                    marginTop: '20px',
                    maxWidth: '200px',
                  }}
                  className={classes.cards}
                >
                  <CardContent>
                    <Typography
                      style={{
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      {' '}
                      {eachChapter.title}
                    </Typography>
                  </CardContent>

                  <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography
                      onClick={() => handleChaplerDetails(eachChapter)}
                      color='primary'
                      style={{ fontWeight: 'bold', color: 'Black', cursor: 'pointer' }}
                    >
                      Click Here
                    </Typography>
                    {/* <StyledButton  size='small'>Click here</StyledButton> */}
                  </CardActions>
                  {eachChapter.is_completed ? (
                    <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography style={{ color: 'white' }}>Completed</Typography>
                    </CardContent>
                  ) : (
                    <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography style={{ color: 'white' }}>Not Completed</Typography>
                    </CardContent>
                  )}
                </Card>
              );
            })}
        </div>
      </div>
      {openFeedback && <Feedback open={openFeedback} onDialogClose={setOpenFeedback} />}
    </Layout>
  );
};

export default AllSubjectChapters;
