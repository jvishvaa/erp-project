import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Typography,
  Divider,
  withStyles,
  Grid,
  Paper,
  TablePagination,
  IconButton,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from '@material-ui/core';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import { Link } from 'react-router-dom';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import CourseInfoModalView from '../../components/reusableComponents/courseInfoModal/courseInfoModal';
import urls from '../../url';
import Loader from '../../hoc/loader';
import useFetch from '../../hoc/useFetch';
import styles from './studentCourse.style';

const StudentCourse = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [value, setValue] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(null);
  const [page, setPage] = React.useState(0);

  const {
    data: allCourses,
    isLoading: allCoursesLoading,
    doFetch: fetchAllCourses,
  } = useFetch();

  useEffect(() => {
    fetchAllCourses({
      url: `${urls.allCourses}?page_size=${rowsPerPage || 12}&page=${page + 1}`,
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
      },
    });
  }, [fetchAllCourses, auth.personal_info.token, page, rowsPerPage]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(12);
    }
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }
  function firstPageChange() {
    setPage(0);
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }

  const viewCourse = (idno) => {
    localStorage.setItem('viewID', idno);
  };

  const allTheCourses = () => {
    let allCoursesDisplay = null;

    if (allCourses && allCourses.results && allCourses.results.length) {
      allCoursesDisplay = (
        <>
          <Grid container>
            <Grid item md={1} xs={1} />
            <Grid item md={10} xs={10}>
              <div>
                <Grid>
                  <Paper style={{ backgroundColor: 'powderblue' }}>
                    <Typography
                      variant="h4"
                      styles={{ color: 'white' }}
                      className={classes.typographyPadding}
                    >
                      All Courses
                    </Typography>
                  </Paper>
                </Grid>
                <Grid container spacing={2}>
                  {allCourses
                    && allCourses.results.map((data) => (
                      <CourseInfoModalView
                        key={data.id}
                        ratingdata={1.6}
                        courseName={data.course_name}
                        courseType={data.is_free}
                        courseDuration={data.course_duration}
                        userCount={50}
                        button={1}
                        viewid={data.id}
                        viewData={viewCourse}
                        courseImg={data.course_image}
                        courseCategory={(data.course_category && data.course_category.category_name) || ''}
                      />
                    ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </>
      );
    }
    return allCoursesDisplay;
  };

  let loader = null;
  if (allCoursesLoading) {
    loader = <Loader open />;
  }

  return (
    <>
      <Grid container style={{ marginTop: '15vh' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          <Divider className={classes.Divider} />
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction label="Home" icon={<RestoreIcon />} />
            <BottomNavigationAction
              component={Link}
              label="Course"
              icon={<RestoreIcon />}
              to="/course"
            />
          </BottomNavigation>
          <Divider className={classes.Divider} />
        </Grid>
      </Grid>

      {allTheCourses()}
      {allCourses && allCourses.results && allCourses.results.length === 0 && (
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Typography
              variant="h5"
              style={{ textAlign: 'center', color: 'blue', marginTop: '50px' }}
            >
              {' '}
              No Courses are Found
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item md={1} />
        {allCourses && allCourses.results && allCourses.results.length !== 0 && (
          <Grid item md={10} xs={10}>
            <Paper style={{ backgroundColor: 'lightgray', marginTop: '10px' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TablePagination
                      colSpan={6}
                      labelDisplayedRows={() => `Page ${page + 1} of ${+allCourses.total_pages}`}
                      rowsPerPageOptions={[12, 20, 30]}
                      count={+allCourses.count}
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
      </Grid>

      {loader}
    </>
  );
};
StudentCourse.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(StudentCourse);
