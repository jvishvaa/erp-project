/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, IconButton } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import './question-bank.css';
import Loading from '../../../components/loader/loader';

import QuestionBankCard from './question-bank-card';
import QuestionBankFilters from './question-bank-filter';
import ViewMoreCard from './view-more-card';
import TabPanel from './tab-panel';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';

import { addQuestionToSection } from '../../../redux/actions';

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

const QuestionBankList = ({ questions, initAddQuestionToSection }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [periodData, setPeriodData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState({});
  const [periodDataForView, setPeriodDataForView] = useState([]);
  const [filterDataDown, setFilterDataDown] = useState({});
  const limit = 9;
  const [chapterSearch, setChapterSearch] = useState();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isFilter, setIsFilter] = useState(true);
  const [periodColor, setPeriodColor] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [tabPanelGradeValue, setTabPanelGradeValue] = useState('');
  const [tabMapId, setTabMapId] = useState('');
  const [tabQueLevel, setTabQueLevel] = useState([]);
  const [tabQueTypeId, setTabQueTypeId] = useState('');
  const [tabQueCatId, setTabQueCatId] = useState('');
  const [tabTopicId, setTabTopicId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const questionId = query.get('question');
  const section = query.get('section');

  const handleAddQuestionToQuestionPaper = (question) => {
    const questionIds = [];
    questions.forEach((q) => {
      q.sections[0].questions.forEach(({ id = '' }) => questionIds.push(id) || {});
    });
    if (!questionIds.includes(question.id)) {
      initAddQuestionToSection(question, questionId, section);
      history.push(`/create-question-paper?show-question-paper=true`);
    } else {
      setAlert('error', 'Question already added!');
    }
  };

  const handlePagination = (event, page) => {
    setPage(page);
    setSelectedIndex(-1);
  };

  const handlePeriodList = (
    // gradeId,
    quesTypeId,
    quesCatId,
    subjMapId,
    quesLevel,
    topicId,
    newValue
  ) => {
    // setTabValue(newValue);
    if (!subjMapId || !quesLevel) {
      setAlert('error', 'Select all the fields!');
      return;
    }
    setLoading(true);
    setPeriodData([]);
    // setChapterSearch(searchChapter);
    // setTabPanelGradeValue(gradeId);
    setTabQueTypeId(quesTypeId);
    setTabQueCatId(quesCatId);
    setTabTopicId(topicId);
    setTabMapId(subjMapId);
    setTabQueLevel(quesLevel);
    if (newValue == 0 || newValue == undefined) {
      setTabValue(0);
      const filterStatus = '';
      // if (tabValue) {
      //   filterStatus = `&question_status=${tabValue}`;
      // }
      // axiosInstance
      //   .get(
      //     `${endpoints.questionBank.questionData}?mapping_id=${subjMapId?.id}&question_type=${quesTypeId}&question_categories=${quesCatId?.value}&question_level=${quesLevel?.value}&topic=${topicId?.id}&page=${page}&page_size=${limit}${filterStatus}`
      //     // `${endpoints.questionBank.questionData}?mapping_id=14&question_type=7&question_categories=2&question_level=2`
      //   )
      axios
        .get(
          `${endpoints.questionBank.questionData}?mapping_id=${subjMapId}&question_type=${quesTypeId}&question_categories=${quesCatId?.value}&question_level=${quesLevel?.value}&topic=${topicId?.id}&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTotalCount(result?.data?.result?.count);
            setLoading(false);
            setPeriodData(result?.data?.result?.results);
            setViewMore(false);
            setViewMoreData({});
            setSelectedIndex(-1);
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
          `${endpoints.questionBank.questionData}?mapping_id=${subjMapId}&question_status=1&question_type=${quesTypeId}&question_categories=${quesCatId?.value}&question_level=${quesLevel?.value}&topic=${topicId?.id}&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setTotalCount(result?.data?.result?.count);
            setLoading(false);
            setPeriodData(result?.data?.result?.results);
            setViewMore(false);
            setViewMoreData({});
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error?.message);
        });
    } else if (newValue == 2) {
      setTabValue(2);
      axios
        .get(
          `${endpoints.questionBank.questionData}?mapping_id=${subjMapId}&question_status=3&question_type=${quesTypeId}&question_categories=${quesCatId?.value}&question_level=${quesLevel?.value}&topic=${topicId?.id}&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setTotalCount(result?.data?.result?.count);
            setLoading(false);
            setPeriodData(result?.data?.result?.results);
            setViewMore(false);
            setViewMoreData({});
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error?.message);
        });
    } else if (newValue == 3) {
      setTabValue(3);
      axios
        .get(
          `${endpoints.questionBank.questionData}?mapping_id=${subjMapId}&question_status=2&question_type=${quesTypeId}&question_categories=${quesCatId?.value}&question_level=${quesLevel?.value}&topic=${topicId?.id}&page=${page}&page_size=${limit}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setTotalCount(result?.data?.result?.count);
            setLoading(false);
            setPeriodData(result?.data?.result?.results);
            setViewMore(false);
            setViewMoreData({});
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error?.message);
        });
    }
  };

  useEffect(() => {
    if (tabQueTypeId && tabQueCatId && tabMapId && tabQueLevel && tabTopicId) {
      handlePeriodList(
        tabQueTypeId,
        tabQueCatId,
        tabMapId,
        tabQueLevel,
        tabTopicId,
        tabValue
      );
    }
  }, [page]);
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div
            style={{
              width: '95%',
              margin: '20px auto',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '100%' }}>
              <CommonBreadcrumbs
                componentName='Assessment'
                childComponentName='Question Bank'
              />
            </div>

            <div className='hideShowFilterIcon'>
              <IconButton onClick={() => setIsFilter(!isFilter)}>
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

        <div className={isFilter ? 'showFilters' : 'hideFilters'}>
          <QuestionBankFilters
            questionId={questionId}
            handlePeriodList={handlePeriodList}
            setPeriodData={setPeriodData}
            setViewMore={setViewMore}
            setViewMoreData={setViewMoreData}
            setFilterDataDown={setFilterDataDown}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
        <Grid
          container
          style={
            isMobile
              ? { width: '95%', margin: '20px auto' }
              : { width: '100%', margin: '20px auto' }
          }
          spacing={5}
        >
          <Grid item xs={12} sm={12}>
            <TabPanel
              setSelectedIndex={setSelectedIndex}
              handlePeriodList={handlePeriodList}
              // tabPanelGradeValue={tabPanelGradeValue}
              tabQueTypeId={tabQueTypeId}
              tabQueCatId={tabQueCatId}
              tabTopicId={tabTopicId}
              tabMapId={tabMapId}
              tabQueLevel={tabQueLevel}
              setTabValue={setTabValue}
              tabValue={tabValue}
              setPage={setPage}
            />
          </Grid>
        </Grid>
        <Grid
          container
          style={
            isMobile
              ? { width: '95%', margin: '20px auto' }
              : { width: '100%', margin: '20px auto' }
          }
          spacing={5}
        ></Grid>
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
              <Grid item xs={12} sm={viewMore ? 6 : 12}>
                <Grid container spacing={isMobile ? 3 : 5}>
                  {periodData.map((period, i) => (
                    <Grid
                      item
                      xs={12}
                      style={isMobile ? { marginLeft: '-8px' } : null}
                      sm={viewMore ? 6 : 4}
                    >
                      <QuestionBankCard
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
                        handlePeriodList={handlePeriodList}
                        tabQueTypeId={tabQueTypeId}
                        tabQueCatId={tabQueCatId}
                        tabMapId={tabMapId}
                        tabTopicId={tabTopicId}
                        tabQueLevel={tabQueLevel}
                        onClick={
                          questionId && section ? handleAddQuestionToQuestionPaper : null
                        }
                        showAddToQuestionPaper={questionId && section}
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
                    handlePeriodList={handlePeriodList}
                    tabQueTypeId={tabQueTypeId}
                    tabQueCatId={tabQueCatId}
                    tabMapId={tabMapId}
                    tabQueLevel={tabQueLevel}
                    tabTopicId={tabTopicId}
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

const mapStateToProps = (state) => ({
  questions: state.createQuestionPaper.questions,
});

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionToSection: (question, questionId, section) => {
    dispatch(addQuestionToSection(question, questionId, section));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionBankList);
