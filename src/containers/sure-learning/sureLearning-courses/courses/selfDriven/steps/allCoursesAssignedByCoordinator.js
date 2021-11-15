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
import CommonBreadcrumbs from '../../../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../../Layout/index';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';

import axiosInstance from '../../../../../../config/axios';
import endpoints from 'config/endpoints';
import Card from '@material-ui/core/Card';
import Feedback from '../.././../../subject-training/feedback/SubmitRating';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './allCoursesAssignedByCoordinator.scss';

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

const AllCoursesAssignedByCoordinator = () => {
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);

  const [openFeedback, setOpenFeedback] = useState(false);
  const [moduleId, setModuleId] = useState('');
  const [chapters, setChapters] = useState('');
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  console.log(moduleData, 'module');
  const [certificateBtn, setCertificateBtn] = useState(true);
  const [bottomHRef, setBottomHRef] = useState('');
  const ratingStatus = sessionStorage.getItem('ratingStatus');
  const [opendialogue, setOpendialogue] = useState(false);
  const [courseId, setCourseId] = useState('');
  const userId = udaanDetails.personal_info.user_id;

  useEffect(() => {
    setBottomHRef([
      {
        pdf: `${
          endpoints.sureLearning.getCourseCertificateUrl
        }?course_id=${sessionStorage.getItem(
          'course_id'
        )}&user_id=${userId}&Authorization=${`Bearer ${udaanToken}`}&module=${moduleId}`,
      },
    ]);
  }, [setBottomHRef, moduleId, courseId, userId]);

  useEffect(() => {
    const isAllComplete = chapters
      ? !chapters.some((element) => element.is_completed === false)
      : false;
    console.log(isAllComplete, 'isAllComplete');
    if (isAllComplete === true) {
      setCertificateBtn(false);

      if (ratingStatus === 'false') {
        setOpendialogue(true);
      } else {
        setOpendialogue(false);
      }
    }
  }, [chapters, ratingStatus]);

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
  const course = sessionStorage.getItem('course');
  useEffect(() => {
    setCourseId(sessionStorage.getItem('course_id'));
    console.log(history, 'history');
    if (moduleId && udaanToken) {
      axios
        .get(
          `${endpoints.sureLearning.filterSubject}?course_id=${sessionStorage.getItem(
            'course_id'
          )}&${course}=true`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res, 'course details');
          // setSubjectList(res.data.course_sub_type)
          setChapters(res.data);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

  const handleBack = () => {
    // history.push('/assignedCoursesByCordinator');
    history.goBack();
  };

  const handleChaplerDetails = (eachChapter) => {
    if (chapters && chapters.length) {
      chapters.forEach((con, index) => {
        if (con.id === eachChapter.id && index > 0) {
          console.log(index - 1, 'index');
          let int = index - 1;
          console.log(chapters[int], 'prev typ');
          console.log(int, 'prev');
          if (chapters[index - 1].is_completed) {
            history.push({
              pathname: '/allCoursesAssignedByCoordinatorContent',
              state: eachChapter,
              type: 'subject',
            });
            sessionStorage.setItem('course', course);
            sessionStorage.setItem('content_id', eachChapter.id);
          } else {
            setAlert('warning', 'please complete previous chapter');
          }
        }
        if (con.id === eachChapter.id && index < 1) {
          history.push({
            pathname: '/allCoursesAssignedByCoordinatorContent',
            state: eachChapter,
            type: 'subject',
          });
          sessionStorage.setItem('course', course);
          sessionStorage.setItem('content_id', eachChapter.id);
        }
      });
    }

    // history.push('/allchapterContent');
  };

  const getCardColor = (index) => {
    const colors = [
      '#54688c',
      '#f47a62',
      '#4a66da',
      '#75cba8',
      // "#f2bf5e"
    ];
    const diffColors = index % 4;
    return colors[diffColors];
  };
  const BreadCrumb = sessionStorage.getItem('BreadCrumb');
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName={BreadCrumb}
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
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {chapters &&
            chapters.map((eachChapter, index) => {
              return (
                <Card
                  style={{
                    backgroundColor: getCardColor(index),
                    marginLeft: '20px',
                    marginTop: '20px',
                  }}
                  className={classes.cards}
                >
                  <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ flexDirection: 'column' }}>
                      {console.log('sdfg', eachChapter)}
                      <Typography> {eachChapter.title} </Typography>
                    </div>
                  </CardContent>

                  <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography
                      onClick={() => handleChaplerDetails(eachChapter)}
                      color='primary'
                      style={{ fontWeight: 'bold', color: 'white', cursor: 'pointer' }}
                    >
                      Click me
                    </Typography>
                    {/* <StyledButton  size='small'>Click here</StyledButton> */}
                  </CardActions>
                  <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography>
                      {eachChapter.is_completed === true ? 'Completed' : 'Not Completed'}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
      {openFeedback && <Feedback open={openFeedback} onDialogClose={setOpenFeedback} />}
    </Layout>
  );
};

export default AllCoursesAssignedByCoordinator;
