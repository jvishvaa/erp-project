import React, { useState, useEffect, useContext } from 'react';
import { generateQueryParamSting } from '../../utility-functions';
import { AssessmentReviewContextProvider } from './assess-review/assess-review-context';
import Layout from '../Layout';
import Loading from '../../components/loader/loader';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './assessment.css';
import QuestionPaperCard from './questionPaperCard';
import QuestionPaperInfo from './questionPaperInfo';
import { Container, Grid } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import { Pagination } from '@material-ui/lab';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import axios from 'axios';
import axiosInstance from '../../config/axios';
import { withRouter } from 'react-router-dom';

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
  const [page, setPageNumber] = useState(getSearchParams(restProps).page || 1);
  const [totalCount, setTotalCount] = useState(0);
  // const [questionPaperInfoObj, setQuestionPaperInfoObj] = useState();

  const getInfoDefaultVal = () => {
    const questionPaperId = getSearchParams(restProps).info;
    return questionPaperId || undefined;
  };
  const [showInfo, setShowInfo] = useState(getInfoDefaultVal());
  const { setAlert } = useContext(AlertNotificationContext);
  useEffect(() => {
    fetchQuestionPapers();
  }, [page]);

  const fetchQuestionPapers = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.assessment.questionPaperList}?user=${user}&page=${page}`)
      .then((response) => {
        console.log('qp result:', response);
        if (response.data.status_code === 200) {
          setQuestionPaperList(response.data.result.result);
          setTotalCount(response.data.result.count);
          setLoading(false);
          // const quesPaperList = response.data.result.result;
          // let quesPaperInfoObj = quesPaperList.filter((q) => +q.id === +showInfo);
          // quesPaperInfoObj = quesPaperInfoObj.length ? quesPaperInfoObj[0] : undefined;
          // if (quesPaperInfoObj) {
          //   setQuestionPaperInfoObj(quesPaperInfoObj);
          // } else {
          //   setShowInfo(undefined);
          // }
        } else {
          setLoading(false);
          setAlert('error', response.data.description);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });

    // setQuestionPaperList(x.result.result);
    // setTotalCount(x.result.count);
    // setLoading(false);
    // const quesPaperList = x.result.result;
    // let quesPaperInfoObj = quesPaperList.filter((q) => +q.id === +showInfo);
    // quesPaperInfoObj = quesPaperInfoObj.length ? quesPaperInfoObj[0] : undefined;
    // if (quesPaperInfoObj) {
    //   setQuestionPaperInfoObj(quesPaperInfoObj);
    // } else {
    //   setShowInfo(undefined);
    // }
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
  };

  const handleShowInfo = (paperInfoObj) => {
    setShowInfo(paperInfoObj.id);
    // setQuestionPaperInfoObj(paperInfoObj);
  };
  useEffect(
    () =>
      history.push(`/assessment/?${generateQueryParamSting({ page, info: showInfo })}`),
    [showInfo, page]
  );

  const handleCloseInfo = () => {
    setShowInfo(undefined);
  };

  const handleStartTest = (questionPaperId) => {
    console.log('push to test start page', questionPaperId);

    // history.push('/assessment/view-assessment');
    history.push(`/assessment/${questionPaperId}/attempt`);
    // history.push('/assessment/11/qp-questions-list/');
  };
  // let questionPaperInfoObj = questionPaperList.filter((q) => q.id === showInfo);
  // questionPaperInfoObj = questionPaperInfoObj.length
  //   ? questionPaperInfoObj[0]
  //   : undefined;
  return (
    <>
      <AssessmentReviewContextProvider>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <Container>
            <CommonBreadcrumbs componentName='Assessment' />
            <h4 className='assessment_heading'>Filter Tags All | Completed | Upcoming</h4>
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
                        // handleStartTest={handleStartTest}
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
