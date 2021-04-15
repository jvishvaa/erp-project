/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, IconButton } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
// import './lesson.css';
import Loading from '../../../components/loader/loader';
import AssessmentCard from './assesment-card-new';
import AssessmentFilters from './filterdata';
import ViewMoreCard from './view-more-card';
import TabPanel from './tab-panel';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';
import axios from 'axios';

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

const AssessmentView = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [periodData, setPeriodData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState([]);
  const [periodDataForView, setPeriodDataForView] = useState({});
  const [filterDataDown, setFilterDataDown] = useState({});
  const limit = 9;
  const [chapterSearch, setChapterSearch] = useState();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isFilter, setIsFilter] = useState(false);
  const [periodColor, setPeriodColor] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [tabValue, setTabValue] = useState(0);
  const [tabGradeId, setTabGradeId] = useState('');
  const [tabSubjectId, setTabSubjectId] = useState('');
  const [tabQpValue, setTabQpValue] = useState('');
  const [publishFlag, setPublishFlag] = useState(false);

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const handlePeriodList = (grade, subject, qpValue, newValue) => {
    if (!grade || !qpValue) {
      setAlert('error', 'Select all the fields!');
      return;
    }
    setTabValue(0);
    setLoading(true);
    setPeriodData([]);
    setTabGradeId(grade);
    setTabSubjectId(subject);
    setTabQpValue(qpValue);

    if (newValue == 0 || newValue == undefined) {
      const tabVal = '';
      setTabValue(0);
      // if (tabValue == 1) {
      //   tabVal = '&is_draft=True';
      // } else if (tabValue == 2) {
      //   tabVal = '&is_review=True';
      // } else if (tabValue == 3) {
      //   tabVal = '&is_verified=True';
      // }
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${grade.id}&paper_level=${qpValue.id}${tabVal}&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        // axiosInstance.get(`${endpoints.assementQP.assementFilter}?grade=${2}&paper_level=${1}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result?.data?.result?.count);
            setLoading(false);
            setPeriodData(result?.data?.result?.results);
            setViewMore(false);
            setViewMoreData([]);
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error?.message);
        });
    } else if (newValue == 1) {
      setTabValue(1);
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${grade.id}&paper_level=${qpValue.id}&is_draft=True&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        // axiosInstance.get(`${endpoints.assementQP.assementFilter}?grade=${2}&paper_level=${1}&is_draft=True`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.result.count);
            setLoading(false);
            setPeriodData(result.data.result.results);
            setViewMore(false);
            setViewMoreData([]);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else if (newValue == 2) {
      setTabValue(2);
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${grade.id}&paper_level=${qpValue.id}&is_review=True&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        // axiosInstance.get(`${endpoints.assementQP.assementFilter}?grade=${2}&paper_level=${1}&is_review=True`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.result.count);
            setLoading(false);
            setPeriodData(result.data.result.results);
            setViewMore(false);
            setViewMoreData([]);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else if (newValue == 3) {
      setTabValue(3);
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${grade.id}&paper_level=${qpValue.id}&is_verified=True&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        // axiosInstance.get(`${endpoints.assementQP.assementFilter}?grade=${2}&paper_level=${1}&is_verified=True`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result.data.result.count);
            setLoading(false);
            setPeriodData(result.data.result.results);
            setViewMore(false);
            setViewMoreData([]);
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
    // if (page && chapterSearch || publishFlag)
    if (publishFlag) handlePeriodList(tabGradeId, tabSubjectId, tabQpValue);
    if (tabGradeId && tabSubjectId && tabQpValue)
      handlePeriodList(tabGradeId, tabSubjectId, tabQpValue, tabValue);
  }, [publishFlag, page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div
          className={isMobile ? 'breadCrumbFilterRow' : null}
          style={{ display: 'flex', marginLeft: '2.25rem' }}
        >
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Question Paper'
            />
          </div>

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
        </div>
        <div className={!isFilter ? 'showFilters' : 'hideFilters'}>
          <AssessmentFilters
            handlePeriodList={handlePeriodList}
            setPeriodData={setPeriodData}
            setViewMore={setViewMore}
            setViewMoreData={setViewMoreData}
            setFilterDataDown={setFilterDataDown}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
        <div>
          <TabPanel
            handlePeriodList={handlePeriodList}
            tabGradeId={tabGradeId}
            tabSubjectId={tabSubjectId}
            tabQpValue={tabQpValue}
            setTabValue={setTabValue}
            page={page}
            setPage={setPage}
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
                      <AssessmentCard
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
                        setPublishFlag={setPublishFlag}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {viewMore && (
                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                  <ViewMoreCard
                    setSelectedIndex={setSelectedIndex}
                    viewMoreData={viewMoreData}
                    setViewMore={setViewMore}
                    filterDataDown={filterDataDown}
                    periodDataForView={periodDataForView}
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

export default AssessmentView;
