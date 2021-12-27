import React, { useState, useEffect, useContext, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useMediaQuery, useTheme, Container, Grid, Divider } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Layout, { ContainerContext } from '../../Layout';
import { generateQueryParamSting } from '../../../utility-functions';

import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import QuestionPaperCard from './questionPaperCard';
import QuestionPaperInfo from './questionPaperInfo';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import './view-assessment.css';

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

const handleDownloadPdf = (blob, title) => {
  let link = document.createElement('a');
  link.setAttribute(
    'href',
    URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
  );
  link.download = `${title}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const ViewAssessments = ({ history, ...restProps }) => {
  const { user_id: user } = JSON.parse(localStorage.getItem('userDetails') || {});
  const [loading, setLoading] = useState(false);
  const [questionPaperList, setQuestionPaperList] = useState([]);
  const [page, setPageNumber] = useState(+getSearchParams(restProps).page || 1);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState(+getSearchParams(restProps).status || 0);
  // const [questionPaperInfoObj, setQuestionPaperInfoObj] = useState();

  // const { containerRef } = React.useContext(ContainerContext);

  const getInfoDefaultVal = () => {
    const questionPaperId = getSearchParams(restProps).info;
    return questionPaperId || undefined;
  };
  const [showInfo, setShowInfo] = useState(getInfoDefaultVal());
  const [testDate, setTestDate] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const query = new URLSearchParams(window.location.search);
  useEffect(()=>{
    localStorage.setItem('is_retest',  query.get('status') === '2');
  },[])

  const fetchQuestionPapers = () => {
    setLoading(true);

    const statusId = status === 0 ? 2 : 1;

    const params = [0, 1].includes(status)
      ? `?user=${user}&page=${page}&page_size=${9}&status=${statusId}`
      : `?page=${page}&page_size=${9}`;

    const endpoint = [0, 1].includes(status)
      ? endpoints.assessment.questionPaperList
      : endpoints.assessment.retestQuestionPaperList;

    axiosInstance
      .get(`${endpoint}${params}`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setQuestionPaperList(response?.data?.result?.results);
          setTotalCount(response?.data?.result?.count);
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
  }, [page, status]);

  const handlePagination = (event, page) => {
    setPageNumber(page);
    // if (containerRef.current) {
    //   containerRef.current.style.scrollBehavior = 'smooth';
    //   containerRef.current.scrollTo(0, 0);
    // }
  };

  const handleShowInfo = (paperInfoObj) => {
    setShowInfo(paperInfoObj.id);
    setTestDate(paperInfoObj.test_date);
  };

  const [downloadTestId, setDownloadTestId] = useState(null);

  const downloadAssessment = useCallback(
    ({ id: testId, test_name: testName = 'Assessment' }) => {
      setDownloadTestId(testId);
      axiosInstance
        .get(`${endpoints.assessmentErp.downloadAssessmentPdf}?test_id=${testId}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const {
            headers = {},
            message = 'Question paper not available',
            data = '',
          } = response || {};
          const contentType = headers['content-type'] || '';
          if (contentType === 'application/pdf') {
            handleDownloadPdf(data, testName);
          } else {
            setAlert('info', message);
          }
        })
        .catch((error) => {
          setAlert(error?.message);
        });
    },
    [downloadTestId]
  );

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
            setPageNumber(1);
            setStatus(a);
            setShowInfo(undefined);
            localStorage.setItem('is_retest', a === 2);
          }}
          aria-label='simple tabs example'
        >
          {/* <Tab label='All' {...a11yProps(0)} /> */}
          <Tab label='Upcoming' {...a11yProps(0)} />
          <Tab label='Completed' {...a11yProps(1)} />
          <Tab label='Retest' {...a11yProps(2)} />
        </Tabs>
      </>
    );
  };

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs componentName='Assessment' />
        {tabBar()}
        <Divider variant='middle' />
        {/* <h4 className='assessment_heading'>All | Completed | Upcoming</h4> */}
        <Grid
          container
          spacing={2}
          direction={isMobile ? 'column' : 'row'}
          style={{ marginTop: '20px', marginBottom: '20px', width: '99%' }}
        >
          <Grid item md={showInfo ? 6 : 12} xs={12}>
            <Grid container spacing={2}>
              {questionPaperList.map((qp, index) => (
                <Grid
                  item
                  md={showInfo ? 6 : 4}
                  xs={12}
                  key={index}
                  // onClick={() => handleShowInfo(qp)}
                >
                  <QuestionPaperCard
                    {...(qp || {})}
                    handleViewMore={() => handleShowInfo(qp)}
                    downloadAssessment={() => downloadAssessment(qp)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {showInfo && (
            <Grid item xs={12} md={6}>
              <QuestionPaperInfo
                assessmentId={showInfo}
                assessmentDate={testDate}
                key={showInfo}
                loading={loading}
                handleCloseInfo={handleCloseInfo}
              />
            </Grid>
          )}
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
      </Layout>
    </>
  );
};

export default withRouter(ViewAssessments);
