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
import AssesmentReportTable from '../../assesment-report-card/index';
import AssessmentReportBack from '../../assesment-report-card/report-table-observation-and-feedback';
import TabPanel from '../../../../components/tab-panel';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const StudentReportCard = () => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const widerWidth = isMobile ? '98%' : '95%';
  const [loading, setLoading] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [reportCardData, setReportCardData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const { erp = '' } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { id: sessionYearId = '' } =
    JSON.parse(localStorage.getItem('acad_session')) || {};

  const renderReportCard = () => {
    switch (tabValue) {
      case 0:
        return <AssesmentReportTable reportCardData={reportCardData} />;
      case 1:
        return (
          <AssessmentReportBack
            observationFeedback={reportCardData['observation_feedback']}
          />
        );
    }
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
    if (value) {
      setSelectedGrade(value);
    }
  };

  const fetchReportCardData = (params) => {
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.reportCardData}${params}`)
      .then((result) => {
        if (result?.data?.status === 200) {
          setReportCardData(result?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handlePreview = (selectedGrade) => {
    setLoading(true);
    let paramObj = {
      erp,
      grade: selectedGrade?.gr_id,
      is_student: true,
      session_year: sessionYearId,
    };
    const isPreview = Object.values(paramObj).every(Boolean);
    if (!isPreview) {
      for (const [key, value] of Object.entries(paramObj).reverse()) {
        if (!Boolean(value)) setAlert('error', `Please select ${key}.`);
      }
      return;
    }
    let params = `?${generateQueryParamSting({ ...paramObj })}`;
    fetchReportCardData(params);
  };

  useEffect(() => {
    getGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      setLoading(true);
      handlePreview(selectedGrade);
    }
  }, [selectedGrade]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Report-Card'
          isAcademicYearVisible={true}
        />
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{
            width: widerWidth,
            margin: isMobile ? '0px 0px -10px 0px' : '-10px 0px 20px 8px',
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
          {selectedGrade && (
            <Grid item xs={12}>
              <>
                <TabPanel
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  tabValues={['Front', 'Back']}
                />
                <Box style={{ margin: '20px auto' }}>{renderReportCard()}</Box>
              </>
            </Grid>
          )}
        </Grid>
      </Layout>
    </>
  );
};

export default StudentReportCard;
