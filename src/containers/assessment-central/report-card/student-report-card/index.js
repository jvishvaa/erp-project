/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useContext, useRef } from 'react';
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
import EypReportCardPdf from 'containers/assessment-central/assesment-report-card/eypReportCard/eypPdf';
import FeeReminderAssesment from 'containers/assessment-central/Feereminder';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import PhysicalEducationReportCard from '../../assesment-report-card/physicalEducationReportCard/physicalEducationReportCard.js';
import axios from 'axios';
import { message } from 'antd';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import ReactToPrint from 'react-to-print';
// const isOrchids =
//   window.location.host.split('.')[0] === 'orchids' ||
//   window.location.host.split('.')[0] === 'qa'
//     ? true
//     : false;
const isOrchids = IsOrchidsChecker();

const StudentReportCard = () => {
  const themeContext = useTheme();
  const componentRef = useRef();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
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

  const [eypConfig, setEypConfig] = useState([]);
  const [showPEConfig, setShowPEConfig] = useState([]);
  const [peReportCardData, setPEReportCardData] = useState([]);

  const renderReportCardNew = (componentRef) => {
    switch (tabValue) {
      case 0:
        return (
          <AssesmentReportNew reportCardDataNew={reportCardDataNew} ref={componentRef} />
        );
      case 1:
        return (
          <ReportCardNewBack reportCardDataNew={reportCardDataNew} ref={componentRef} />
        );
      case 2:
        return (
          <PhysicalEducationReportCard
            peReportCardData={peReportCardData}
            ref={componentRef}
          />
        );
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
    // if (!published) {
    //   setAlert('error', 'Report card not published');
    //   return;
    // }
    setSelectedGrade(value);

    let paramObj = {
      acad_session_id: selectedBranch?.id,
      erp_id: erp,
      grade_id: value?.gr_id,
    };
    let params = `?${generateQueryParamSting({ ...paramObj })}`;
    if (value?.gr_id) {
      eypConfig.includes(String(value?.gr_id))
        ? fetchEypReportCard(value?.gr_id)
        : fetchReportCardData(params);
    }
  };

  const fetchPEReportCardData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.assessmentReportTypes.physicalEducationReportCard}`, {
        params: params,
        headers: { 'X-DTS-HOST': X_DTS_HOST, authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setPEReportCardData(response.data);
        } else {
          setPEReportCardData([]);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchEypReportCard = (grade_id) => {
    let obj = {};
    obj.acad_session_id = selectedBranch?.id;
    obj.grade_id = grade_id;
    obj.erp_id = erp;
    setLoading(true);
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.eypReportCard}`, { params: { ...obj } })
      .then((response) => {
        if (response?.data) {
          // generateEypReport(response?.data?.result);
          EypReportCardPdf(response?.data?.result, selectedBranch?.branch?.branch_name);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlert('error', err?.response?.data?.message);
        setLoading(false);
      });
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
        setAlert('error', error?.response?.data?.message);
        setSelectedGrade('');
      });
    setLoading(false);
  };
  const checkPhysicalEducationConfig = (params = {}) => {
    axiosInstance
      .get(`${endpoints.doodle.checkDoodle}`, { params: { ...params } })
      .then((response) => {
        if (response?.data) {
          setShowPEConfig(response?.data?.result);
        }
      });
  };

  useEffect(() => {
    getGrades();
    checkEypConfig({ config_key: 'eyp_rc_grades' });
    checkPhysicalEducationConfig({ config_key: 'rc-pe-enle-grades' });
  }, []);

  console.log({ showPEConfig });

  useEffect(() => {
    if (showPEConfig?.includes(String(selectedGrade?.gr_id)))
      fetchPEReportCardData({
        branch_id: selectedBranch?.branch?.id,
        grade_id: selectedGrade?.gr_id,
      });
  }, [selectedGrade]);

  const checkEypConfig = (params = {}) => {
    axiosInstance
      .get(`${endpoints.doodle.checkDoodle}`, { params: { ...params } })
      .then((response) => {
        if (response?.data) {
          setEypConfig(response?.data?.result);
        }
      });
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Report-Card'
          isAcademicYearVisible={true}
        />
        {user_level == 13 ? <FeeReminderAssesment /> : ''}
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
                  <div className='row justify-content-between'>
                    {console.log(reportCardDataNew, 'reportCardDataNew')}
                    <TabPanel
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      tabValues={
                        showPEConfig
                          ? ['Front', 'Back', 'Physical Education']
                          : ['Front', 'Back']
                      }
                    />
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          variant='contained'
                          size='small'
                          color='primary'
                          style={{ fontSize: 15 }}
                        >
                          Download Report
                        </Button>
                      )}
                      content={() => componentRef.current} // Use the ref content here
                      documentTitle={`Eduvate ${
                        tabValue === 0
                          ? 'Front'
                          : tabValue === 1
                          ? 'Back'
                          : 'PhysicalEducationReportCard'
                      } - ${reportCardDataNew?.user_info?.name}`}
                    />
                  </div>
                  <Box style={{ margin: '20px auto' }}>
                    {renderReportCardNew(componentRef)}
                  </Box>
                </>
              </Grid>
            )}
          </Grid>
          {(user_level == 13 || user_level == 12) && isOrchids ? (
            <div
              className='row justify-content-end'
              style={{ position: 'fixed', bottom: '5%', right: '2%' }}
            >
              <div
                className='th-bg-white px-2 py-1 th-br-6 th-pointer'
                style={{ border: '1px solid #d9d9d9' }}
                onClick={() => setShowGrievanceModal(true)}
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
              module={'Report Card'}
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
