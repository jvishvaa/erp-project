/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, IconButton } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axios from 'axios';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import './lesson.css';
import Loading from '../../../components/loader/loader';
import PeriodCard from './period-card';
import LessonViewFilters from './lesson-view-filters';
import ViewMoreCard from './view-more-card';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';

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

const LessonPlan = () => {
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
  const [centralGradeName, setCentralGradeName] = useState('');
  const [centralSubjectName, setCentralSubjectName] = useState('');

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const handlePeriodList = (searchChapter) => {
    setLoading(true);
    setPeriodData([]);
    setChapterSearch(searchChapter);
    axios
      .get(
        `${endpoints.lessonPlan.periodData}?chapter=${searchChapter}&page_number=${page}&page_size=${limit}`,
        {
          headers: {
            'x-api-key': 'vikash@12345#1231',
          },
        }
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
  };

  useEffect(() => {
    if (page && chapterSearch) handlePeriodList(chapterSearch);
  }, [page]);

  const sortPeriodsAsPerNumber =(periodArray=[])=>{
    try{
        const sortFunc = function({period_name:periodName1='-'}, {period_name:periodName2='-'}){return periodName1.split('-')[1] - periodName2.split('-')[1]}
        return periodArray.sort(sortFunc)
    }catch(er){
        return periodArray
    }
}

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs componentName='Lesson Plan' childComponentName='View' />
          </div>
          {isMobile ? (
            <div className='hideShowFilterIcon'>
              <IconButton onClick={() => setIsFilter(!isFilter)}>
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
          ) : null}
        </div>
        <div
          className={!isMobile ? 'showFilters' : isFilter ? 'showFilters' : 'hideFilters'}
        >
          <LessonViewFilters
            handlePeriodList={handlePeriodList}
            setPeriodData={setPeriodData}
            setViewMore={setViewMore}
            setViewMoreData={setViewMoreData}
            setFilterDataDown={setFilterDataDown}
            setSelectedIndex={setSelectedIndex}
            setLoading={setLoading}
            setCentralGradeName={setCentralGradeName}
            setCentralSubjectName={setCentralSubjectName}
            centralGradeName={centralGradeName}
            centralSubjectName={centralSubjectName}
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
              <Grid item xs={12} sm={viewMore && viewMoreData?.length > 0 ? 7 : 12}>
                <Grid container spacing={isMobile ? 3 : 5}>
                  {/* {periodData.map((period, i) => ( */}
                  {sortPeriodsAsPerNumber(periodData).map((period, i) => (
                    <Grid
                      item
                      xs={12}
                      style={isMobile ? { marginLeft: '-8px' } : null}
                      sm={viewMore && viewMoreData?.length > 0 ? 6 : 4}
                    >
                      <PeriodCard
                        index={i}
                        filterDataDown={filterDataDown}
                        period={period}
                        setSelectedIndex={setSelectedIndex}
                        periodColor={selectedIndex === i}
                        setPeriodColor={setPeriodColor}
                        viewMore={viewMore}
                        setLoading={setLoading}
                        setViewMore={setViewMore}
                        setViewMoreData={setViewMoreData}
                        setPeriodDataForView={setPeriodDataForView}
                        setCompletedStatus={setCompletedStatus}
                        centralGradeName={centralGradeName}
                        centralSubjectName={centralSubjectName}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {viewMore && viewMoreData?.length > 0 && (
                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                  <ViewMoreCard
                    completedStatus={completedStatus}
                    viewMoreData={viewMoreData}
                    setViewMore={setViewMore}
                    setSelectedIndex={setSelectedIndex}
                    filterDataDown={filterDataDown}
                    periodDataForView={periodDataForView}
                    setLoading={setLoading}
                    centralGradeName={centralGradeName}
                    centralSubjectName={centralSubjectName}
                  />
                </Grid>
              )}
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

export default LessonPlan;
