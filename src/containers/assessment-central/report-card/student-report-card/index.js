/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useContext } from 'react';
import Layout from '../../../Layout';
import {
  Grid,
  Divider,
  TextField,
  Button,
  useTheme,
  Box,
  useMediaQuery,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { generateQueryParamSting } from '../../../../utility-functions';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import '../../../../containers/master-management/master-management.css';
import Loading from '../../../../components/loader/loader';
import TabPanel from '../../../../components/tab-panel';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import './student-report-card.css';
import AssesmentReportNew from 'containers/assessment-central/assesment-report-card/newReportPrint';
import ReportCardNewBack from 'containers/assessment-central/assesment-report-card/reportCardNewBack';
import GrievanceModal from 'v2/FaceLift/myComponents/GrievanceModal';

const isOrchids =
  window.location.host.split('.')[0] === 'orchids' ||
  window.location.host.split('.')[0] === 'qa'
    ? true
    : false;

const StudentReportCard = () => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [reportCardDataNew, setReportCardDataNew] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const { erp = '' } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { id: sessionYearId = '' } =
    JSON.parse(sessionStorage.getItem('acad_session')) || {};
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const renderReportCardNew = () => {
    switch (tabValue) {
      case 0:
        return <AssesmentReportNew reportCardDataNew={reportCardDataNew} />;
      case 1:
        return <ReportCardNewBack reportCardDataNew={reportCardDataNew} />;
    }
  };
  const handleCloseGrievanceModal = () => {
    setShowGrievanceModal(false);
  };
  const getGrades = () => {
    axiosInstance
      .get(
        `${endpoints.reportCard.studentReportGrade}?session_year=${selectedAcademicYear?.id}`
      )
      .then((response) => setGradeList(response?.data?.data))
      .catch(() => {});
  };

  const handleGrade = (event, value) => {
    setSelectedGrade('');
    const { published = '' } = value || {};
    if (!published) {
      setAlert('error', 'Report card not published');
      return;
    }
    setSelectedGrade(value);

    let paramObj = {
      acad_session_id: selectedBranch?.id,
      erp_id: erp,
      grade_id: value?.gr_id,
    };

    let params = `?${generateQueryParamSting({ ...paramObj })}`;
    fetchReportCardData(params);
  };

  const fetchReportCardData = (params) => {
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.reportCardDataNew}${params}`)
      .then((result) => {
        setLoading(true);
        setReportCardDataNew(result?.data?.result);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.data?.status === 403) {
          setAlert('error', 'Report card not published');
          setSelectedGrade('');
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    getGrades();
  }, []);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Report-Card'
          isAcademicYearVisible={true}
        />
        <div
          className='student-report-card'
          style={{
            // background: 'white',
            height: '90vh',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{
              width: '99%',
              margin: '0 auto',
            }}
          >
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='grade'
                value={selectedGrade || {}}
                options={gradeList || []}
                getOptionLabel={(option) => option?.gr_name || ''}
                getOptionSelected={(option, value) => option?.gr_id === value?.gr_id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            </Grid>
            <Grid xs={0} sm={6} />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {selectedGrade && reportCardDataNew?.report?.length > 0 && (
              <Grid item xs={12}>
                <>
                  <TabPanel
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    tabValues={['Front', 'Back']}
                  />
                  <Box style={{ margin: '20px auto' }}>{renderReportCardNew()}</Box>
                </>
              </Grid>
            )}
          </Grid>
          {(user_level == 13 || user_level == 12) && isOrchids ? (
            <div
              className='row justify-content-end th-pointer'
              style={{ position: 'fixed', bottom: '5%', right: '2%' }}
              onClick={() => setShowGrievanceModal(true)}
            >
              <div
                className='th-bg-white px-2 py-1 th-br-6'
                style={{ border: '1px solid #d9d9d9' }}
              >
                Issues with Report Card/Marks?
                <br />
                <span className='th-primary pl-1' style={{ textDecoration: 'underline' }}>
                  Raise your query
                </span>
              </div>
            </div>
          ) : null}
          {showGrievanceModal && (
            <GrievanceModal
              title={'Report Card Related Query'}
              showGrievanceModal={showGrievanceModal}
              handleClose={handleCloseGrievanceModal}
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default StudentReportCard;
