import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Container, Grid, Divider } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { generateQueryParamSting } from '../../utility-functions';
import { AssessmentReviewContextProvider } from './assess-review/assess-review-context';
import Layout from '../Layout';
import Loading from '../../components/loader/loader';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import QuestionPaperCard from './questionPaperCard';
import QuestionPaperInfo from './questionPaperInfo';
import endpoints from '../../config/endpoints';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import axiosInstance from '../../config/axios';
import './assessment.css';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    style: { fontSize: '0.8rem' },
  };
}

const x = {
  status_code: 200,
  message: 'successfully fetched question paper list',
  result: {
    next: null,
    previous: null,
    count: 2,
    limit: 10,
    current_page: 1,
    total_pages: 1,
    result: [
      {
        id: 61,
        question_paper: {
          id: 21,
          branch: 1,
          grade: 16,
          grade_name: 'Grade 2',
          subject: [2],
          subject_name: ['Hindi'],
          paper_level: '1',
        },
        is_test_completed: {
          is_completed: true,
          completed_date: '2021-02-19T12:09:52.461000Z',
        },
        test_name: 'Unit Testing',
        test_id: 67091,
        teacher: null,
        test_mode: '1',
        total_mark: 16,
        test_date: '2012-09-04T06:00:00Z',
        test_duration: 30,
        instructions: 'Mark Proper',
        descriptions: 'Hii Hello',
        total_question: 0,
        is_completed: false,
        test_type: 1,
      },
      {
        id: 60,
        question_paper: {
          id: 20,
          branch: 1,
          grade: 16,
          grade_name: 'Grade 1',
          subject: [2],
          subject_name: ['Hindi'],
          paper_level: '1',
        },
        is_test_completed: {
          is_completed: true,
          completed_date: '2021-02-22T12:14:39.072000Z',
        },
        test_name: 'Normal Test',
        test_id: 1,
        teacher: 'Manoj Kumar',
        test_mode: null,
        total_mark: 50,
        test_date: '2021-02-15T10:55:04.237796Z',
        test_duration: 180,
        instructions: 'Please read the details below',
        descriptions: 'The test contains 10 objective type of quesions',
        total_question: 10,
        is_completed: false,
        test_type: 1,
      },
    ],
  },
};
const getSearchParams = (propsObj) => {
  const { location: { search = '' } = {} } = propsObj;
  const urlParams = new URLSearchParams(search); // search = ?open=true&qId=123
  const searchParamsObj = Object.fromEntries(urlParams); // {open: "true", def: "[asf]", xyz: "5"}
  return searchParamsObj;
};
const Assessment = ({ history, ...restProps }) => {
  const { user_id: user } = JSON.parse(localStorage.getItem('userDetails') || {});
  const [loading, setLoading] = useState(false);
  const [questionPaperList, setQuestionPaperList] = useState([]);
  const [page, setPageNumber] = useState(+getSearchParams(restProps).page || 1);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState(+getSearchParams(restProps).status || 0);
  // const [questionPaperInfoObj, setQuestionPaperInfoObj] = useState();

  const getInfoDefaultVal = () => {
    const questionPaperId = getSearchParams(restProps).info;
    return questionPaperId || undefined;
  };
  const [showInfo, setShowInfo] = useState(getInfoDefaultVal());
  const { setAlert } = useContext(AlertNotificationContext);
  useEffect(() => {
    fetchQuestionPapers();
  }, [page, status]);

  const fetchQuestionPapers = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.assessment.questionPaperList}?user=${user}&page=${page}&status=${status}`
      )
      .then((response) => {
        console.log('qp result:', response);
        if (response.data.status_code === 200) {
          setQuestionPaperList(response.data.result.result);
          setTotalCount(response.data.result.count);
          setLoading(false);
        } else {
          setLoading(false);
          const { data: { message } = {} } = response;
          setAlert('error', `${message || 'Failed to fetch assessments.'}`);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
    // setQuestionPaperList(x.result.result);
    // setTotalCount(x.result.count);
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
  };

  const handleShowInfo = (paperInfoObj) => setShowInfo(paperInfoObj.id);
  useEffect(
    () =>
      history.push(
        `/assessment/?${generateQueryParamSting({ page, info: showInfo, status })}`
      ),
    [showInfo, page, status]
  );

  const handleCloseInfo = () => {
    setShowInfo(undefined);
  };

  const tabBar = () => {
    return (
      <>
        <Tabs
          indicatorColor='secondary'
          textColor='secondary'
          value={status}
          onChange={(e, a) => {
            setStatus(a);
          }}
          aria-label='simple tabs example'
        >
          <Tab label='All' {...a11yProps(0)} />
          <Tab label='Completed' {...a11yProps(1)} />
          <Tab label='Upcoming' {...a11yProps(2)} />
        </Tabs>
      </>
    );
  };

  return (
    <>
      <AssessmentReviewContextProvider>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <Container>
            <CommonBreadcrumbs componentName='Assessment' />
            {tabBar()}
            <Divider variant='middle' />
            {/* <h4 className='assessment_heading'>All | Completed | Upcoming</h4> */}
            <Grid container spacing={2}>
              <Grid item md={showInfo ? 6 : 12} xs={12}>
                <Grid
                  container
                  spacing={2}
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                >
                  {questionPaperList.map((qp, index) => (
                    <Grid
                      item
                      md={showInfo ? 6 : 4}
                      xs={12}
                      key={index}
                      onClick={() => handleShowInfo(qp)}
                    >
                      <QuestionPaperCard
                        testTitle={qp?.test_name}
                        testDescription={qp?.descriptions}
                        testId={qp?.question_paper?.id}
                        testDuration={qp?.test_duration}
                        testType={qp?.test_type}
                        testTotalQuestions={qp?.total_question}
                        testTotalMarks={qp?.total_mark}
                        handleStartTest={() => handleShowInfo(qp)}
                        {...(qp || {})}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    {questionPaperList?.length > 0 && (
                      <div className='paginateData paginateMobileMargin'>
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={Math.ceil(totalCount / 10)}
                          color='primary'
                          page={page}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {showInfo && (
                <Grid item xs={12} md={6}>
                  <QuestionPaperInfo
                    assessmentId={showInfo}
                    key={showInfo}
                    // {...questionPaperInfoObj}
                    loading={loading}
                    handleCloseInfo={handleCloseInfo}
                  />
                </Grid>
              )}
            </Grid>
          </Container>
        </Layout>
      </AssessmentReviewContextProvider>
    </>
  );
};

export default withRouter(Assessment);
