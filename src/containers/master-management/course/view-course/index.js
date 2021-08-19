import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Pagination } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import { Button, useTheme ,IconButton} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import deleteIcon from '../../../../assets/images/delete.svg';
import attachmenticon from '../../../../assets/images/attachmenticon.svg';
import Divider from '@material-ui/core/Divider';
import Loading from '../../../../components/loader/loader';
import unfiltered from '../../../../assets/images/unfiltered.svg';
import selectfilter from '../../../../assets/images/selectfilter.svg';
import Layout from '../../../Layout';
import CourseFilter from './course-filter';
import CourseCard from './course-card';
import ViewMoreCard from './view-more-card';
import Context from './context/ViewStore';
import TabPanel from './course-tab';
import { useCallback } from 'react';

const CourseView = () => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [periodColor, setPeriodColor] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState([]);
  const [periodDataForView, setPeriodDataForView] = useState({});
  const [sendGrade, setSendGrade] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageFlag, setPageFlag] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const limit = 9;
  const [tabVal, setTabVal] = useState('');

  const [courseData, setCourseData] = useState([]);

  const handleCourseList = (gradeIds, tabMenuval) => {
    setTabVal(tabMenuval);
    setLoading(true);
    setSendGrade(gradeIds);
    setCourseData([]);
    if (
      gradeIds.length !== 0 &&
      (tabMenuval === 0 || tabMenuval === undefined || tabMenuval === null)
    ) {
      axiosInstance
        .get(
          `${endpoints.onlineCourses.courseList}?grade=${gradeIds}&page=${page}&page_size=${limit}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.count);
            setLoading(false);
            setCourseData(result.data.result);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
    if (gradeIds.length !== 0 && tabMenuval === 1) {
      axiosInstance
        .get(
          `${endpoints.onlineCourses.courseList}?grade=${gradeIds}&page=${page}&page_size=${limit}&is_active=True`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.count);
            setLoading(false);
            setCourseData(result.data.result);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
    if (gradeIds.length !== 0 && tabMenuval === 2) {
      axiosInstance
        .get(
          `${endpoints.onlineCourses.courseList}?grade=${gradeIds}&page=${page}&page_size=${limit}&is_active=False`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.count);
            setLoading(false);
            setCourseData(result.data.result);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
    if (gradeIds.length === 0) {
      setAlert('warning', 'Select Grade');
    }
  };

  const handleClearFilter = () => {
    setSendGrade([]);
    setTabValue(0);
    setTabVal('');
  };

  const handlePagination = (event, page) => {
    setPage(page);
    setPageFlag(true);
  };
  useEffect(() => {
    if (deleteFlag) {
      handleCourseList(sendGrade, tabVal);
    }
  }, [deleteFlag]);
  useEffect(() => {
    if (pageFlag === true && page) {
      handleCourseList(sendGrade, tabVal);
    }
  }, [page]);

  return (
    <>
      {sendGrade.length !== 0 && loading ? <Loading message='Loading...' /> : null}

      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Course List'
        />
        <CourseFilter
          handleCourseList={handleCourseList}
          handleClearFilter={handleClearFilter}
          setCourseData={setCourseData}
          setPageFlag={setPageFlag}
          tabValue={tabValue}
        />
        <TabPanel
          handleCourseList={handleCourseList}
          sendGrade={sendGrade}
          setTabValue={setTabValue}
          tabValue={tabValue}
        />
        <Paper className={classes.root}>
          {courseData && courseData.length > 0 ? (
            <Grid
              container
              style={
                isMobile
                  ? { width: '95%', margin: '0 auto 20px auto' }
                  : { width: '100%', margin: '0 auto 20px auto' }
              }
              spacing={5}
            >
              <Grid item xs={12} sm={viewMore ? 7 : 12}>
                <Grid container spacing={isMobile ? 3 : 5}>
                  {courseData.map((period, i) => (
                    <Grid
                      item
                      xs={12}
                      style={isMobile ? { marginLeft: '-8px' } : null}
                      sm={viewMore ? 6 : 4}
                    >
                      <CourseCard
                        index={i}
                        period={period}
                        setSelectedIndex={setSelectedIndex}
                        periodColor={selectedIndex === i ? true : false}
                        setPeriodColor={setPeriodColor}
                        viewMore={viewMore}
                        setLoading={setLoading}
                        setViewMore={setViewMore}
                        setViewMoreData={setViewMoreData}
                        setPeriodDataForView={setPeriodDataForView}
                        deleteFlag={deleteFlag}
                        setDeleteFlag={setDeleteFlag}
                        sendGrade={sendGrade}
                        selectedIndex={selectedIndex}
                        tabVal={tabVal}
                        handleCourseList={handleCourseList}
                        sendGrade={sendGrade}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {viewMore ? (
                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                  <ViewMoreCard
                    viewMoreData={viewMoreData}
                    setViewMore={setViewMore}
                    setSelectedIndex={setSelectedIndex}
                    periodDataForView={periodDataForView}
                    sendGrade={sendGrade}
                  />
                </Grid>
              ) : null}
            </Grid>
          ) : (
            <div className='periodDataUnavailable'>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '20px', width: '250px' }
                        : { height: '50px', width: '400px', marginLeft: '5%' }
                    }
                    src={selectfilter}
                  />
                )}
              />
            </div>
          )}
          {courseData?.length > 0 && (
            <div className='paginateData paginateMobileMargin'>
              <Pagination
                onChange={handlePagination}
                style={{ marginTop: 25 }}
                count={Math.ceil(totalCount / limit)}
                color='primary'
                page={page}
              />
            </div>
          )}
        </Paper>
      </Layout>
    </>
  );
};

export default CourseView;
