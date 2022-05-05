/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  // Typography,
  // Divider,
  withStyles,
  // Tab,
  // Tabs,
  // AppBar,
  // Avatar,
  TablePagination,
  IconButton,
  Paper,
  TableRow,
  TableCell,
  Table,
  // Box,
  TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import CourseEnroleModle from '../../reusableComponents/courseEnroleModle/courseEnroleModle';
import CourseInfoModalView from '../../reusableComponents/courseInfoModal/courseInfoModal';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import styles from './CourseView.style';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';

function CoursesView({ classes }) {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [courseType] = useState(localStorage.getItem('coursesType'));
  const [viewData, setViewData] = useState(false);
  const [viewidno, setViewId] = useState('');
  const [fillForm, setFillForm] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [completedCourses, setCompletedCourses] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [completedCoursesInfo, setAllCompletedCourses] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [page, setPage] = useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loader, setLoader] = useState(false);
  const [permission, setPermission] = useState([]);
  const [enrollCourseId, setEnrollCourseId] = useState(null);
  const [selfCoursesModule, setSetCoursesModule] = useState(null);
  

  useEffect(() => {
    localStorage.setItem('completeCourseStatus', showAllCourses);
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'All_Completed_Courses') {

        setEnrollCourseId(item.module);
        getStatusInformation(item.module);
        getPermissonData(item.module);
        getCompletedInformation(item.module);
      }
      if (item.module_name === 'Self_Courses') {
        setSetCoursesModule(item.module);
      }
    })
  }, []);

  const getStatusInformation = async (id) => {
    setLoader(true);
    const response = await fetch(
      `${endpoints.sureLearning.principalAllViewCourse}?course_type=${'self_driven'}&page_size=${rowsPerPage}&page=${page + 1}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: id
        },
      },
    );
    const getDataInfo = await response.json();
    setLoader(false);
    setViewData(false);
    setFillForm(false);
    return getDataInfo;
  };



  const getCompletedInformation = async (id) => {
    setLoader(true);
    const response = await fetch(
      `${endpoints.sureLearning.principalCompletedViewCourse}?course_type=${'self_driven'}&page_size=${rowsPerPage}&page=${page + 1}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: id
        },
      },
    );
    const getDataInfo = await response.json();
    setLoader(false);
    setViewData(false);
    setFillForm(false);
    return getDataInfo;
  };

  const coursePrincipalCompleted = async (id) => {
    let data;
    if (courseType === 'self_driven') {
      data = {
        course: id,
        is_self_driven: true,
      };
    } else if (courseType === 'triner_driven') {
      data = {
        course: id,
        is_trainer_driven: true,
      };
    } else if (courseType === 'trainer') {
      data = {
        course: id,
        trainer: true,
      };
    } else {
      data = {
        course: id,
        is_induction_training: true,
      };
    }
    const response = await fetch(endpoints.sureLearning.principalCompletedViewCourse, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: localStorage.getItem('All_Completed_Courses') !== 'null' ? localStorage.getItem('All_Completed_Courses')
          : localStorage.getItem('Self_Courses')
      },
    });
    const getDataiNFO = await response.json();
    getStatusInformation(enrollCourseId)
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
    getCompletedInformation()
      .then(() => {
        setAlert('success', 'Course Completed Successfully');
        setLoader(false);
      })
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
    // alert.success('Course Completed Successfully');
    // setViewData(false);
    // setFillForm(false);
    // setBranchSubmit("");
    // setVideo("");
    return getDataiNFO;
  };

  useEffect(() => {
    if (!completedCourses && enrollCourseId) {
      getStatusInformation(enrollCourseId).then((data) => {
        setAllCourses(data);
        setLoader(false);
      })
        .then(() => setLoader(false))
        .catch(() => setLoader(false));
    }
    if (completedCourses) {
      // getCompletedInformation();
      completedCoursesShow();
    }
  }, [page, rowsPerPage,enrollCourseId]);

  // For Permissions
  function getPermissonData(id) {
    axios.get(endpoints.sureLearning.getPermissons, {
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: id ? id
          : selfCoursesModule
      },
    }).then(response => {
      setPermission(response.data.response)
    }).catch(error => {
      console.log(error);
    })
  }

  // useEffect(() => {
  //   getPermissonData(localStorage.getItem("Trainee_Courses"))
  // }, [])


  function setViewDataFunction(Indno) {
    // console.log(Indno);
    setViewData(true);
    setFillForm(false);
    setViewId(allCourses && allCourses[Indno]);
    // if (allCourses.count !== 0) {
    localStorage.setItem(
      'viewID',
      Indno,
      // allCourses && allCourses.results[Indno].id
    );
    // }
  }
  function setEnrollFunction() {
    setViewData(false);
  }

  function functionHandleBackinViewModal() {
    setViewData(false);
    setFillForm(false);
    getStatusInformation(enrollCourseId)
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
  }
  const allCoursesShow = () => {
    getStatusInformation(enrollCourseId).then(response => {
      setShowAllCourses(true);
      setCompletedCourses(false);
    })


  };
  const completedCoursesShow = () => {
    setShowAllCourses(false);
    localStorage.setItem('completeCourseStatus', false);
    setCompletedCourses(true);
    getCompletedInformation().then((data) => {
      setAllCompletedCourses(data);


    })
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
  };
  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(8);
    }
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  function firstPageChange() {
    setPage(0);
  }
  return (
     <Layout>
       
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Trainee Courses'
          isAcademicYearVisible={true}
        />
       <div style={{ margin: ' 5px 40px 5px 40px' }}>
      {loader === true && (
        <Backdrop className={classes.backdrop} style={{ zIndex: '100' }} open>
          <CircularProgress />
        </Backdrop>
      )}
      {!fillForm && !viewData && (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              //   margin: "0 auto",
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            &nbsp;&nbsp;
            <button
              key="1"
              onClick={allCoursesShow}
              type="submit"
              style={{
                marginRight: '1rem',
                padding: '0.6rem 1rem',
                border: '1px solid transparent',
                borderRadius: '1px',
                fontWeight: '700',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '1px 2px 5px rgba(47, 92, 192, 0.48)',
              }}
            >
              All Courses
            </button>
            <button
              type="submit"
              key="2"
              onClick={completedCoursesShow}
              style={{
                marginLeft: '1rem',
                padding: '0.6rem 1rem',
                border: '1px solid transparent',
                borderRadius: '1px',
                fontWeight: '700',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '1px 2px 5px rgba(47, 92, 192, 0.48)',
              }}
            >
              Completed Courses
            </button>
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {showAllCourses ? 'All Courses' : 'Completed Courses'}
          </h2>
        </>
      )}
      {showAllCourses && !fillForm && !viewData && (
        <Grid container spacing={2}>
          {allCourses
            && allCourses.length !== 0
            && allCourses.results.map((item, index) => (
              <CourseInfoModalView
                key={index}
                courseImg={item.course_image || ''}
                ratingdata={0}
                courseName={(item.course_name) || ''}
                courseDuration={item.course_duration || ''}
                button={2}
                viewData={setViewDataFunction || ''}
                viewid={index}
                courseId={item.id}
                courseCategory={(item.course_category && item.course_category.category_name) || ''}
              />
            ))}
        </Grid>
      )}

      {completedCourses && !fillForm && !viewData && (
        <Grid container spacing={2}>
          {completedCoursesInfo
            && completedCoursesInfo.length !== 0
            && completedCoursesInfo.results.map((item, index) => {
              // console.log(item);
              const {
                course_image: courseImage,
              } = item.course;
              return (
                <>
                  <CourseInfoModalView
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    courseImg={courseImage}
                    ratingdata={0}
                    courseName={item.course.course_name}
                    courseDuration={item.course.course_duration}
                    userCount=""
                    courseType={item.course.is_free}
                    button={2}
                    viewData={setViewDataFunction}
                    viewid={index}
                    //   editInfo={EditCourseInformation}
                    //   activeStatus={Status}
                    courseId={item.course.id}
                    courseCategory={(item.course.course_category && item.course.course_category.category_name) || ''}
                  //   activeFunc={toggleActive}
                  />
                </>
              );
            })}
        </Grid>
      )}
      {allCourses && !fillForm && !viewData && allCourses.length !== 0 && (
        <Grid item md={12} xs={12}>
          <Paper style={{ backgroundColor: 'white', marginTop: '10px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `Page ${page + 1} of ${completedCourses ? completedCoursesInfo.total_pages : +allCourses.total_pages}`}
                    rowsPerPageOptions={[8, 20, 30]}
                    count={completedCourses ? completedCoursesInfo.count : +allCourses.count}
                    rowsPerPage={rowsPerPage || 8}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' },
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  <TableCell style={{ marginTop: '13px' }}>
                    <IconButton
                      onClick={firstPageChange}
                      disabled={page === 0 || page === 1}
                    >
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => lastPageChange(allCourses.total_pages - 1)}
                      disabled={page === +allCourses.total_pages - 1}
                    >
                      <LastPageIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      )}
      {viewData && !fillForm && (
        <>
          <CourseEnroleModle
            resEnrolId={setEnrollFunction}
            showViewData={viewidno}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: '10px', marginLeft: '8%' }}
            onClick={() => functionHandleBackinViewModal()}
          >
            Back
          </Button>
          {permission.can_update ?
            <>
              {((localStorage.getItem('roleType') === 'Principal') || (localStorage.getItem('roleType') === 'LeadTeacher'))
                && !completedCourses && (
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    style={{ marginTop: '10px', marginLeft: '8%' }}
                    onClick={() => coursePrincipalCompleted(
                      localStorage.getItem('viewID'),
                      localStorage.getItem('principalCourseType'),
                    )}
                  >
                    Complete
                  </Button>
                )}
            </>
            : null}

        </>
      )}
      </div>
    </Layout>
  );
}
CoursesView.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CoursesView);
