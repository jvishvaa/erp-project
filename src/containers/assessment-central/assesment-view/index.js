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
import { Breadcrumb, Button } from 'antd';

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
  const [tabIsErpCentral, setTabIsErpCentral] = useState(true);
  const [clearFlag, setClearFlag] = useState(false);
  const [callFlag, setCallFlag] = useState(false);
  const [erpCategory , setErpCategory] = useState('')
  const handlePagination = (event, page) => {
    setPage(page);
  };


  useEffect(() => {
if(tabGradeId && tabSubjectId){
  handlePeriodList(
    tabIsErpCentral,
    tabAcademic,
    tabBranch,
    tabGradeId,
    tabSubjectId,
    tabQpValue,
    // erpCategory,
    tabValue,
  );
}
  },[tabValue, tabIsErpCentral, page])

  const handleGetQuestionPapers = (newValue = 0, requestURL) => {
    setTabValue(newValue);
    if (newValue == 0) {
      requestURL += `&is_delete=False`;
    }
    if (newValue == 1) {
      requestURL += `&is_draft=True&is_delete=False`;
    }
    if (newValue == 3) {
      requestURL += `&is_review=True&is_delete=False`;
    }
    if (newValue == 2) {
      requestURL += `&is_verified=True&is_delete=False`;
    }
    if(newValue == 4){
      requestURL += `&is_delete=True`;
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
    isErpCentral = false,
    academic = '',
    branch = [],
    grade = '',
    subject = '',
    qpValue,
    // erpCategory = '',
    newValue = 0,
  ) => {
    if (!academic || branch?.length === 0 || !grade ||!subject) {
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
    // setTabIsErpCentral(isErpCentral);
    // setErpCategory(erpCategory)
    const branchIds = branch.map((element) => element?.branch?.id) || [];
    let requestURL = `${endpoints.assessmentErp.listQuestionPaper}?academic_year=${academic?.id}&branch=${branchIds}&grade=${grade?.value}&subjects=${subject?.value}&page=${page}&page_size=${limit}&request_type=${tabIsErpCentral ? 2 : 1} `;
    if(qpValue) {
      requestURL += `&paper_level=${qpValue?.value}`
    }
    // if (!subject && erpCategory) {
    //   requestURL += `&category=${isErpCentral?.flag ? erpCategory?.central_category_id : erpCategory?.erp_category_id}`;
    // }
    handleGetQuestionPapers(newValue, requestURL);
    let filterdata = {
      branch : branch,
      academic: academic,
      // category : erpCategory,
      subject: subject,
      grade: grade,
      qpValue: qpValue,
      page: page,
      limit: limit,
      type: isErpCentral
    }
    // if(erpCategory && !subject){
    //   filterdata['category'] = erpCategory
    // }
    // if(!erpCategory && subject){
    //   filterdata['subject'] = subject

    // }
    sessionStorage.setItem('filter',JSON.stringify(filterdata));
  };
  const changequestionFrom = (e) => {
    setTabIsErpCentral((prev) => !prev)
      }

  useEffect(() => {
    if (publishFlag)
      handlePeriodList(tabIsErpCentral, tabAcademic, tabBranch, tabGradeId, tabSubjectId, tabQpValue ); //erpCategory
    if (tabAcademic && tabBranch && tabGradeId && tabSubjectId && tabQpValue && tabIsErpCentral)
      handlePeriodList(
        tabIsErpCentral,
        tabAcademic,
        tabBranch,
        tabGradeId,
        tabSubjectId,
        tabQpValue,
        // erpCategory,
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
        {/* <BreadcrumbToggler isFilter={isFilter} setIsFilter={setIsFilter}> */}
        <div className='row py-3 px-2'>
          <div className='col-md-8 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-18'>Assessment</Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                Question Paper
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {/* </BreadcrumbToggler> */}
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
          {/* <TabPanel
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
          /> */}
          <div className='row ml-2'>
              <div className='col-md-1 col-6'>
              <Button
                  className={`${
                    tabValue == 0 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => 
                  {setTabValue(0)
                  setPage(1)}}
                >
                  All
                </Button>
              </div>
            <div className='col-md-5 d-flex'>
              <div className='col-md-4 col-6'>
                <Button
                  className={`${
                    tabValue == 2 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => {setTabValue(2) 
                    setPage(1)}}
                >
                  Published
                </Button>
              </div>
              {!tabIsErpCentral && <div className='col-md-4 col-6'>
                <Button
                  className={`${
                    tabValue == 3 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => {setTabValue(3)
                    setPage(1)
                  }}
                >
                  For Review
                </Button>
              </div>}
              {!tabIsErpCentral &&<div className='col-md-4 col-6'>
                <Button
                  className={`${
                    tabValue == 1 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => {setTabValue(1)
                  setPage(1)}}
                >
                  Draft
                </Button>
              </div>}
            </div>
            <div className='col-md-2 d-flex' style={{marginLeft : '-2%'}}>
            {!tabIsErpCentral &&<div className='col-md-10 col-6'>
                <Button
                  className={`${
                    tabValue == 4 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => {setTabValue(4)
                  setPage(1)}}
                >
                  Deleted
                </Button>
              </div>}
              <div className='col-md-2 col-6'></div>
              </div>
              <div className='col-md-4 d-flex'>
                <div className='col-md-1 col-6'></div>
              
                {/* <div className='d-flex align-items-center'> 
                <Switch onChange={changequestionFrom} checked={tabIsErpCentral}/>
                </div> */}
               <div className='col-md-6 col-12'>
                <Button
                  className={`${
                    tabIsErpCentral ? 'highlightbtn th-button-active' : 'nonHighlightbtn'}
                  } th-width-100 th-br-6 mt-2`}
                  style={{boxShadow : tabIsErpCentral ? 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' : 'none' }}
                  onClick={changequestionFrom}
                >
                  Eduvate Question
                </Button>
                </div>
                <div className='col-md-6 col-12'> 
                <Button
                  className={`${
                    !tabIsErpCentral ? 'highlightbtn th-button-active' : 'nonHighlightbtn'}
                  } th-width-100 th-br-6 mt-2`}
                  onClick={changequestionFrom}
                  style={{boxShadow : !tabIsErpCentral ? 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' : 'none'}}
                >
                  School Question
                </Button>
                </div>
            </div>
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
                        tabValue = {tabValue}
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
            <div className='periodDataUnavailable mt-4'>
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
