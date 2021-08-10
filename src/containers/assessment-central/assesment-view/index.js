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
import { getSubDomainName } from '../../../utility-functions';

const subDomainName = getSubDomainName();

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
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isFilter, setIsFilter] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tabValue, setTabValue] = useState(0);
  const [tabAcademic, setTabAcademic] = useState('');
  const [tabBranch, setTabBranch] = useState('');
  const [tabGradeId, setTabGradeId] = useState('');
  const [tabSubjectId, setTabSubjectId] = useState('');
  const [tabQpValue, setTabQpValue] = useState('');
  const [publishFlag, setPublishFlag] = useState(false);

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const handleGetQuestionPapers = (newValue = 0, requestURL) => {
    setTabValue(newValue);
    if (newValue == 1) {
      requestURL += `&is_draft=True`;
    }
    if (newValue == 2) {
      requestURL += `&is_review=True`;
    }
    if (newValue == 3) {
      requestURL += `&is_verified=True`;
    }
    axiosInstance
      .get(requestURL)
      .then((result) => {
        if (result?.data?.status_code === 200) {
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
  };

  const handlePeriodList = (
    academic = '',
    branch = [],
    grade = '',
    subject = '',
    qpValue,
    newValue = 0
  ) => {
    if (!academic || branch?.length === 0 || !grade || !subject || !qpValue) {
      setAlert('error', 'Select all the fields!');
      return;
    }
    setLoading(true);
    setPeriodData([]);
    setTabAcademic(academic);
    setTabBranch(branch);
    setTabGradeId(grade);
    setTabSubjectId(subject);
    setTabQpValue(qpValue);
    const branchIds = branch.map((element) => element?.branch?.id) || [];
    let requestURL = `${endpoints.assessmentErp.listQuestionPaper}?academic_year=${academic?.id}&branch=${branchIds}&subjects=${subject?.subject_id}&grade=${grade?.grade_id}&paper_level=${qpValue?.id}&page=${page}&page_size=${limit}`;
    handleGetQuestionPapers(newValue, requestURL);
  };

  useEffect(() => {
    if (publishFlag)
      handlePeriodList(tabAcademic, tabBranch, tabGradeId, tabSubjectId, tabQpValue);
    if (tabAcademic && tabBranch && tabGradeId && tabSubjectId && tabQpValue)
      handlePeriodList(
        tabAcademic,
        tabBranch,
        tabGradeId,
        tabSubjectId,
        tabQpValue,
        tabValue
      );
  }, [publishFlag, page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div
            style={{
              width: '96%',
              margin: '20px auto',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Question Paper'
              isAcademicYearVisible={true}
            />
            <div className='hideShowFilterIcon'>
              <IconButton onClick={() => setIsFilter(!isFilter)}>
                {!isMobile && (
                  <div
                    style={{
                      color: '#014b7e',
                      fontSize: '16px',
                      marginRight: '10px',
                      fontWeight: '600',
                      alignSelf: 'center',
                    }}
                  >
                    {isFilter ? 'Close Filter' : 'Expand Filter'}
                  </div>
                )}
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
            tabAcademic={tabAcademic}
            tabBranch={tabBranch}
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
                        periodColor={selectedIndex === i ? true : false}
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
                    setPublishFlag={setPublishFlag}
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
