/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Divider,
  Grid,
  withStyles,
  TablePagination,
  IconButton,
  Paper,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import CourseInfoModalView from '../../reusableComponents/courseInfoModal/courseInfoModal';
import endpoints from 'config/endpoints';
import styles from './enrollCourse.style';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axios from 'axios';


function EnrollCourse({ classes }) {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const { setAlert } = useContext(AlertNotificationContext);
  const [allCourses, setAllCourses] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [page, setPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const [permission, setPermission] = useState([]);
  const [enrollCourseId, setEnrollCourseId] = useState(null);

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Enroll_Self_Courses' && item.module_type === 'Self_Driven') {
        getPermissonData(item.module);
        setEnrollCourseId(item.module);
      }
    })
  }, [])


  const getStatusInformation = async () => {
    setLoader(true);
    const response = await fetch(`${endpoints.sureLearning.enrollCouresListApi}?course_type=${'self_driven'}&page_size=${rowsPerPage || 9}&page=${page + 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: enrollCourseId
      },
    });
    const getDataInfo = await response.json();
    setLoader(false);
    return getDataInfo;
  };

  useEffect(() => {
    getStatusInformation().then((data) => {
      setLoader(false);
      setAllCourses(data);
    })
      .then(() => setLoader(false))
      .catch(() => setLoader(false));
  }, [page, rowsPerPage, enrollCourseId]);

  // For Permissions
  function getPermissonData(id) {
    axios.get(endpoints.sureLearning.getPermissons, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: id
      },
    }).then(response => {
      setPermission(response.data.response)
      console.log(response.data.response, "Incoming permission data");
    }).catch(error => {
      console.log(error);
    })
  }



  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(9);
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

  function enrolCourse(id) {
    const data = {
      course: id,
    };
    setLoader(true);
    fetch(endpoints.sureLearning.enrollCouresListApi, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: enrollCourseId
      },
    })
      .then((res) => {
        if (res.status === 201) {
          setLoader(false);
          setAlert('success', 'Course Successfully Enrolled');
          getStatusInformation().then((info) => {
            setAllCourses(info);
            setLoader(false);
          })
            .then(() => setLoader(false))
            .catch(() => setLoader(false));
          return res.json();
        } if (res.status === 409) {
          setLoader(false);
          setAlert('warning', 'Course already enrolled');
          return res.json();
        }
        if (res.status !== 201 && res.status !== 409) {
          setLoader(false);
          setAlert('warning', 'somthing went wrong please try again ');
        }
        return 0;
      });
  }
  return (
    <>
      {loader === true && (
        <Backdrop className={classes.backdrop} style={{ zIndex: '100' }} open>
          <CircularProgress />
        </Backdrop>
      )}
      <Grid container spacing={2} style={{ width: '100%' }}>
        {/* {permission.can_enroll? */}
        <>
          {allCourses
            && allCourses.length !== 0
            && allCourses.results.map((item, index) => (
              <>
                {console.log(item, 'Item for tale')},
                <CourseInfoModalView
                  key={index}
                  courseImg={item.course_image || ''}
                  ratingdata={0}
                  courseName={(item.course_name) || ''}
                  courseDuration={item.course_duration || ''}
                  button={5}
                  enrollFunction={enrolCourse}
                  viewid={index}
                  courseId={item.id}
                  enroll_permission={permission.can_enroll}
                  courseCategory={(item.course_category && item.course_category.category_name) || ''}
                />
              </>
            ))}

        </>
        {/* :null} */}
      </Grid>
      {allCourses.length !== 0 && (
        <Grid item md={12} xs={12}>
          <Paper style={{ backgroundColor: '#fafafa', marginTop: '10px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `Page ${page + 1} of ${+allCourses.total_pages}`}
                    rowsPerPageOptions={[9, 20, 30]}
                    count={+allCourses.count}
                    rowsPerPage={rowsPerPage || 9}
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
    </>
  );
}
EnrollCourse.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(EnrollCourse);
