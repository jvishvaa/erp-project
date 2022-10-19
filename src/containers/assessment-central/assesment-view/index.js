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
import BreadcrumbToggler from '../../../components/breadcrumb-toggler';
import './assesment-view-scroll.css';

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
  const [tabIsErpCentral, setTabIsErpCentral] = useState(false);
  const [clearFlag, setClearFlag] = useState(false);
  const [callFlag, setCallFlag] = useState(false);
  const [erpCategory , setErpCategory] = useState('')
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
    isErpCentral = {},
    academic = '',
    branch = [],
    grade = '',
    subject = '',
    qpValue,
    erpCategory = '',
    newValue = 0,
  ) => {
    if (!academic || branch?.length === 0 || !grade || (!erpCategory && !subject) || !qpValue) {
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
    setTabIsErpCentral(isErpCentral);
    setErpCategory(erpCategory)
    const branchIds = branch.map((element) => element?.branch?.id) || [];
    let requestURL = `${endpoints.assessmentErp.listQuestionPaper}?academic_year=${academic?.id}&branch=${branchIds}&grade=${grade?.grade_id}&paper_level=${qpValue?.id}&page=${page}&page_size=${limit}&request_type=${isErpCentral.id} `;
    if(!erpCategory && subject) {
      requestURL += `&subjects=${subject?.subject_id}`
    }
    if (!subject && erpCategory) {
      requestURL += `&category=${isErpCentral?.flag ? erpCategory?.central_category_id : erpCategory?.erp_category_id}`;
    }
    handleGetQuestionPapers(newValue, requestURL);
    let filterdata = {
      branch : branch,
      academic: academic,
      // category : erpCategory,
      // subject: subject,
      grade: grade,
      qpValue: qpValue,
      page: page,
      limit: limit,
      type: isErpCentral
    }
    if(erpCategory && !subject){
      filterdata['category'] = erpCategory
    }
    if(!erpCategory && subject){
      filterdata['subject'] = subject

    }
    sessionStorage.setItem('filter',JSON.stringify(filterdata));
  };

  useEffect(() => {
    if (publishFlag)
      handlePeriodList(tabIsErpCentral, tabAcademic, tabBranch, tabGradeId, tabSubjectId, tabQpValue , erpCategory);
    if (tabAcademic && tabBranch && tabGradeId && (tabSubjectId || erpCategory) && tabQpValue && tabIsErpCentral)
      handlePeriodList(
        tabIsErpCentral,
        tabAcademic,
        tabBranch,
        tabGradeId,
        tabSubjectId,
        tabQpValue,
        erpCategory,
        tabValue,
        
      );
  }, [publishFlag, page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div
         className='assesment-scroll'
         style={{
           height: '90vh',
           overflowX: 'scroll',
           overflowY: 'scroll',
         }}>
        <BreadcrumbToggler isFilter={isFilter} setIsFilter={setIsFilter}>
          <CommonBreadcrumbs
            componentName='Assessment'
            childComponentName='Question Paper'
            isAcademicYearVisible={true}
          />
        </BreadcrumbToggler>
        <div className={!isFilter ? 'showFilters' : 'hideFilters'}>
          <AssessmentFilters
            setClearFlag={setClearFlag}
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
            erpCategory={erpCategory}
            page={page}
            setPage={setPage}
            setSelectedIndex={setSelectedIndex}
            tabIsErpCentral={tabIsErpCentral}
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
                      sm={12}
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
                        setCallFlag={setCallFlag}
                        setViewMoreData={setViewMoreData}
                        setPeriodDataForView={setPeriodDataForView}
                        setPublishFlag={setPublishFlag}
                        tabIsErpCentral={tabIsErpCentral}
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
        </div>
      </Layout>
    </>
  );
};

export default AssessmentView;
