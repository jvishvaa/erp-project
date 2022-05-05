import React, { useContext, useState, useEffect } from 'react';
import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import axios from 'axios';
import './all_completed_courses.scss';

const useStyles = makeStyles((theme) => ({
  FeedbackFormDialog: {
    marginLeft: '6px',
  },
  filters: {
    marginLeft: '15px',
  },
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

const AllCompletedCourses = ({ history }) => {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'All_Completed_Courses') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(endpoints.sureLearning.branch, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'academic');
          setGradeList(res.data.course_type);
          // setSubjectList(res.data.course_sub_type)
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId !== null) {
      getStatusIformation();
    }
  }, [moduleId]);

  const getAllCoursesInformation = async () => {
    let tempInfo = [];
    axios
      .get(`${endpoints.sureLearning.getInstructureCourses}?course_type=trainer_driven`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        response.data.results.map((eachResult) => {
          tempInfo.push({
            course_category: eachResult.course.course_category,
            course_duration: eachResult.course.course_duration,
            course_image: eachResult.course.course_image,
            course_name: eachResult.course.course_name,
            id: eachResult.course.id,
          });
        });
        setAllCourses(tempInfo);
        setShowAllCourses(false);
        setShowCompletedCourses(true);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const getStatusIformation = async () => {
    axios
      .get(
        `${endpoints.sureLearning.principalAllViewCourse}?course_type=trainer_driven`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        setAllCourses(response.data.results);
        setShowAllCourses(true);
        setShowCompletedCourses(false);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const handlePrevCourse = (course_id) => {
    history.push('/sure_learning/courses_details');
    localStorage.setItem('viewID', course_id);
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='All Completed Courses'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent' style={{ marginLeft: '20px' }}>
            <Button
              disabled={showAllCourses}
              variant='contained'
              color='primary'
              size='medium'
              onClick={getStatusIformation}
            >
              All Courses
            </Button>

            <Button
              style={{ marginLeft: '20px' }}
              disabled={showCompletedCourses}
              onClick={() => getAllCoursesInformation()}
              variant='contained'
              color='primary'
              size='medium'
            >
              Completed Courses
            </Button>
          </div>

          <div className='listcontainer'>
            <div className='filterStudent' style={{ width: '100%' }}>
              <Typography
                color='primary'
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {showCompletedCourses ? 'Completed Courses' : 'All Courses'}
              </Typography>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}
          >
            {allCourses &&
              allCourses.map((eachCourse) => {
                return (
                  <div
                    id='cardAreaSubject'
                    style={{ width: '250px', marginLeft: '20PX', marginTop: '20PX' }}
                  >
                    <Paper>
                      <img
                        src={
                          eachCourse.course_image
                            ? eachCourse.course_image
                            : 'https://dev.udaansurelearning.com/static/media/course.63579270.jpg'
                        }
                        style={{ padding: '10px' }}
                        height={200}
                        width={230}
                      />
                      <Typography
                        color='primary'
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          width: '100%',
                          fontSize: '14px',
                        }}
                      >
                        {eachCourse.course_name}
                      </Typography>
                      <Typography
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          width: '100%',
                          fontSize: '14px',
                        }}
                      >
                        category: {eachCourse.course_category?.category_name}
                      </Typography>
                      <Typography
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          width: '100%',
                          fontSize: '14px',
                        }}
                      >
                        Course Duration: {eachCourse.course_duration}
                      </Typography>
                      <Button
                        onClick={() => handlePrevCourse(eachCourse.id)}
                        style={{ width: '80%', margin: '10%', marginTop: '20px' }}
                        className={classes.button}
                        color='primary'
                        variant='contained'
                      >
                        Preview
                      </Button>
                    </Paper>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllCompletedCourses;
