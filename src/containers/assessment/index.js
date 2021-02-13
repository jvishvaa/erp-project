import React, { useState, useEffect, useContext } from 'react';
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

const Assessment = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [questionPaperList, setQuestionPaperList] = useState([]);
  const [page, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  useEffect(() => {
    fetchQuestionPapers();
  }, [page]);

  const fetchQuestionPapers = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.assessment.questionPaperList}?page=${page}`)
      .then((response) => {
        console.log('qp result:', response);
        if (response.data.status_code === 200) {
          setQuestionPaperList(response.data.result.result);
          setTotalCount(response.data.result.count);
          setLoading(false);
        } else {
          setLoading(false);
          setAlert('error', response.data.description);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
  };

  const handleShowInfo = () => {
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const handleStartTest = (testId) => {
    console.log('push to test start page', testId);

    // history.push('/assessment/view-assessment');
    history.push('/assessment/11/attempt');
    // history.push('/assessment/11/qp-questions-list/');
  };
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Container>
          <CommonBreadcrumbs componentName='Assessment' />
          <h4 className='assessment_heading'>Filter Tags</h4>
          <Grid container spacing={2}>
            <Grid item md={showInfo ? 8 : 12} xs={12}>
              <Grid
                container
                spacing={4}
                style={{ marginTop: '20px', marginBottom: '20px' }}
              >
                {questionPaperList.map((qp, index) => (
                  <Grid
                    item
                    md={showInfo ? 6 : 4}
                    xs={12}
                    key={index}
                    onClick={handleShowInfo}
                  >
                    <QuestionPaperCard
                      testTitle={qp?.test_name}
                      testDescription={qp?.descriptions}
                      testId={qp?.question_paper?.id}
                      testDuration={qp?.test_duration}
                      testType={qp?.test_type}
                      testTotalQuestions={qp?.total_question}
                      testTotalMarks={qp?.total_mark}
                      handleStartTest={handleStartTest}
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
              <Grid item xs={12} md={4}>
                <QuestionPaperInfo handleCloseInfo={handleCloseInfo} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Layout>
    </>
  );
};

export default withRouter(Assessment);
