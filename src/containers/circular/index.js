/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, IconButton } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import axios from 'axios';
// import './lesson.css';
import Loading from '../../components/loader/loader';
import CircularCard from './circular-card';
import CircularFilters from './circular-filterdata';
import ViewMoreCard from './view-more-card';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
import hidefilter from '../../assets/images/hidefilter.svg';
import showfilter from '../../assets/images/showfilter.svg';

import { Context } from './context/CircularStore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '-10px auto',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
}));

const CircularList = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [periodData, setPeriodData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState({});
  const [periodDataForView, setPeriodDataForView] = useState({});
  const [filterDataDown, setFilterDataDown] = useState({});
  const [completedStatus, setCompletedStatus] = useState(false);
  const limit = 9;
  const [isFilter, setIsFilter] = useState(true);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [chapterSearch, setChapterSearch] = useState();
  const [periodColor, setPeriodColor] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [grade, setGrade] = useState();
  const [branch, setBranch] = useState();
  const [section, setSection] = useState();
  const [acadYear,setAcadYear] = useState();
  const [startDateFilter,setStartDateFilter] = useState()
  const [endDateFilter,setEndDateFilter] = useState()
  const [deleteFlag,setDeleteFlag] =useState(false)

  //for edit circular data
  const [editData, setEditData] = useState([]);

  const [state, setState] = useContext(Context);

  // setState(editData)
  // console.log(state, '@@@@');

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const handlePeriodList = (grade, branch, section,year,startDate,endDate) => {
    console.log(grade, branch, section,year,startDate,endDate,']]]]]]]]]]]]]]]]]]')
    setLoading(true);
   if(window.location.pathname === '/teacher-circular') {
    setPeriodData([]);
    setGrade(grade);
    setBranch(branch);
    setSection(section);
    setAcadYear(year);
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
    setFilterDataDown(grade, branch, section,year,startDate,endDate);
    axiosInstance
      .get(
        `${endpoints.circular.circularList}?is_superuser=True&branch=${branch.id}&grade=${grade.grade_id}&section=${section.id}&academic_year=${year.id}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&page=${page}&page_size=${limit}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data.count);
          setLoading(false);
          setPeriodData(result.data.result);
          setViewMore(false);
          setViewMoreData({});
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
    else{
      // alert('',grade,branch)
      // console.log(grade,branch,'|||||||||||||||||||')
      setPeriodData([]);
      setStartDateFilter(grade);
      setEndDateFilter(branch);
      setFilterDataDown(grade,branch);
      axiosInstance
      .get(
        `${endpoints.circular.circularList}?start_date=${grade.format('YYYY-MM-DD')}&end_date=${branch.format('YYYY-MM-DD')}&page=${page}&page_size=${limit}&module_id=168&role_id=2`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data.count);
          setLoading(false);
          setPeriodData(result.data.result);
          setViewMore(false);
          setViewMoreData({});
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
  };
 

  useEffect(() => {
    if (page && grade && branch && section && acadYear && startDateFilter && endDateFilter) handlePeriodList(grade, branch, section, acadYear, startDateFilter,endDateFilter);
    if(deleteFlag)handlePeriodList(grade, branch, section,acadYear, startDateFilter,endDateFilter);
  }, [page,deleteFlag]);
  // console.log('BBBBB', editData);
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null} style={{display:'flex'}}>
          <div style={{ width: '95%', margin: '20px auto',marginLeft:'30px' }}>
            <CommonBreadcrumbs
              componentName={window.location.pathname === '/teacher-circular' ? 'Teacher Circular': 'Student Circular'}
            />
          </div>
          {/* {isMobile ? ( */}
            <div className='hideShowFilterIcon'>
              <IconButton onClick={() => setIsFilter(!isFilter)} style={{marginRight:'36px'}}>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ height: '20px', width: '25px' }}
                      src={isFilter ? hidefilter : showfilter}
                    />
                  )}
                />
              </IconButton>
            </div>
          {/* ) : null} */}
        </div>
        <div
          className={isFilter ? 'showFilters' : 'hideFilters'}
        >
          <CircularFilters
            handlePeriodList={handlePeriodList}
            setPeriodData={setPeriodData}
            setViewMore={setViewMore}
            setViewMoreData={setViewMoreData}
            setFilterDataDown={setFilterDataDown}
            setSelectedIndex={setSelectedIndex}
          />
        </div>

        <Paper className={classes.root}>
          {periodData?.length > 0 ? (
            <Grid
              container
              style={
                isMobile
                  ? { width: '95%', margin: '20px auto' }
                  : { width: '100%', margin: '20px auto' }
              }
              spacing={5}
            >
              <Grid item xs={12} sm={viewMore ? 7 : 12}>
                <Grid container spacing={isMobile ? 3 : 5}>
                  {periodData.map((period, i) => (
                    <Grid
                      item
                      xs={12}
                      style={isMobile ? { marginLeft: '-8px' } : null}
                      sm={viewMore ? 6 : 4}
                    >
                      <CircularCard
                        index={i}
                        filterDataDown={filterDataDown}
                        period={period}
                        setSelectedIndex={setSelectedIndex}
                        periodColor={selectedIndex === i ? true : false}
                        setPeriodColor={setPeriodColor}
                        viewMore={viewMore}
                        setLoading={setLoading}
                        setViewMore={setViewMore}
                        setViewMoreData={setViewMoreData}
                        setPeriodDataForView={setPeriodDataForView}
                        setCompletedStatus={setCompletedStatus}
                        setEditData={setEditData}
                        deleteFlag={deleteFlag}
                        setDeleteFlag={setDeleteFlag}    
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {viewMore ? (
                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                  <ViewMoreCard
                    completedStatus={completedStatus}
                    viewMoreData={viewMoreData}
                    setViewMore={setViewMore}
                    setSelectedIndex={setSelectedIndex}
                    filterDataDown={filterDataDown}
                    periodDataForView={periodDataForView}
                    grade={grade}
                    section={section}
                    branch={branch}
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
          {periodData?.length > 0 && (
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

export default CircularList;
