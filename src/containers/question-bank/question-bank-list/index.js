/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useRef, useEffect, useState } from 'react';
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
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isFilter, setIsFilter] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tabMapId, setTabMapId] = useState('');
  const [tabQueLevel, setTabQueLevel] = useState('');
  const [tabQueTypeId, setTabQueTypeId] = useState('');
  const [tabQueCatId, setTabQueCatId] = useState('');
  const [tabTopicId, setTabTopicId] = useState('');
  const [tabYearId, setTabYearId] = useState('');
  const [tabGradeId, setTabGradeId] = useState('');
  const [tabChapterId, setTabChapterId] = useState('');
  const [tabIsErpCentral, setTabIsErpCentral] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const questionId = query.get('question');
  const section = query.get('section');
  const filterRef = useRef(null);
  const [clearFlag, setClearFlag] = useState(false);
  const [callFlag, setCallFlag] = useState(false);

  const addQuestionToPaper = (question, questionId, section) => {
    initAddQuestionToSection(question, questionId, section);
    setAlert('success', 'Question added successfully!');
    filterRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  const handleAddQuestionToQuestionPaper = (question) => {
    const questionIds = [];
    const centralQuestionIds = [];
    questions.forEach((q) => {
      q.sections[0].questions.forEach(({ id = '', is_central = false }) => {
        if (is_central) {
          centralQuestionIds.push(id);
        } else {
          questionIds.push(id);
        }
      });
    });
    if (!question?.is_central) {
      if (!questionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section);
      } else setAlert('error', 'Question already added!');
    } else {
      if (!centralQuestionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section);
      } else setAlert('error', 'Question already added!');
    }
  };

  const handlePagination = (event, page) => {
    setPage(page);
    setSelectedIndex(-1);
  };

  const handlePeriodList = (
    quesTypeId,
    quesCatId = '',
    subjMapId,
    quesLevel,
    topicId = '',
    yearId,
    gradeId,
    chapterObj,
    isErpCentral = false,
    newValue = 0
  ) => {
    setLoading(true);
    setPeriodData([]);
    setTabQueTypeId(quesTypeId);
    setTabQueCatId(quesCatId);
    setTabTopicId(topicId);
    setTabMapId(subjMapId);
    setTabQueLevel(quesLevel);
    setTabYearId(yearId);
    setTabGradeId(gradeId);
    setTabChapterId(chapterObj);
    setTabIsErpCentral(isErpCentral);
    setTabValue(newValue);
    let requestUrl = `${endpoints.questionBank.erpQuestionList}?academic_session=${yearId}&grade=${gradeId}&subject=${subjMapId}&chapter=${chapterObj?.id}&question_level=${quesLevel?.value}&question_type=${quesTypeId}&page_size=${limit}&page=${page}`;
    requestUrl += `&request_type=${isErpCentral?.flag ? 2 : 1}`;
    if (newValue) {
      requestUrl += `&question_status=${newValue}`;
    }
    if (quesCatId) {
      requestUrl += `&question_categories=${quesCatId?.value}`;
    }
    if (topicId) {
      requestUrl += `&topic=${topicId?.id}`;
    }
    axiosInstance
      .get(requestUrl)
      .then((result) => {
        if (result?.data?.status_code === 200) {
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
  };

  useEffect(() => {
    if (
      tabQueTypeId &&
      tabMapId &&
      tabQueLevel &&
      tabYearId &&
      tabGradeId &&
      tabChapterId &&
      tabIsErpCentral &&
      page
    ) {
      setSelectedIndex(-1);
      handlePeriodList(
        tabQueTypeId,
        tabQueCatId,
        tabMapId,
        tabQueLevel,
        tabTopicId,
        tabYearId,
        tabGradeId,
        tabChapterId,
        tabIsErpCentral,
        tabValue
      );
    }
  }, [page, tabValue, callFlag]);

  useEffect(() => {
    setTabMapId('')
    setTabQueLevel('');
    setTabQueTypeId('');
    setTabQueCatId('');
    setTabTopicId('');
    setTabYearId('');
    setTabGradeId('');
    setTabChapterId('');
    setTabIsErpCentral(false);
  }, [clearFlag]);

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
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Question Bank'
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

        <div className={isFilter ? 'showFilters' : 'hideFilters'} ref={filterRef}>
          <QuestionBankFilters
            setClearFlag={setClearFlag}
            questionId={questionId}
            section={section}
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
            <TabPanel setTabValue={setTabValue} tabValue={tabValue} setPage={setPage} />
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
                        viewMore={viewMore}
                        setLoading={setLoading}
                        setViewMore={setViewMore}
                        setViewMoreData={setViewMoreData}
                        setPeriodDataForView={setPeriodDataForView}
                        setCallFlag={setCallFlag}
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
                    setCallFlag={setCallFlag}
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
