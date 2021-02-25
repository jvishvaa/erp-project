import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useMediaQuery, useTheme, Container, Grid, Divider } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Layout from '../Layout';
import { generateQueryParamSting } from '../../utility-functions';
import { AssessmentReviewContextProvider } from './assess-review/assess-review-context';

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
  useEffect(() => {
    fetchQuestionPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handlePagination = (event, page) => {
    setPageNumber(page);
  };

  const handleShowInfo = (paperInfoObj) => {
    setShowInfo(paperInfoObj.id);
  };
  useEffect(
    () =>
      history.push(
        `/assessment/?${generateQueryParamSting({ page, info: showInfo, status })}`
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

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
            <Grid
              container
              spacing={2}
              direction={isMobile ? 'column-reverse' : 'row'}
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              <Grid item md={showInfo ? 6 : 12} xs={12}>
                <Grid container spacing={2}>
                  {questionPaperList.map((qp, index) => (
                    <Grid
                      item
                      md={showInfo ? 6 : 4}
                      xs={12}
                      key={index}
                      onClick={() => handleShowInfo(qp)}
                    >
                      <QuestionPaperCard
                        {...(qp || {})}
                        handleViewMore={() => handleShowInfo(qp)}
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
