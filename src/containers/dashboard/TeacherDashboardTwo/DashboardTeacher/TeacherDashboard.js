import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StudentRightDashboard from '../../StudentDashboard/StudentRightDashboard/StudentRightDashboard';
import { useHistory } from 'react-router-dom';
import CirclePercentage from './CirclePercentage';
import Layout from '../../../../containers/Layout';
import TodayClass from './TodayClass';
import TodayAttendance from './TodayAttendance';
import Overview from './Overview';
// import Assessment from '../StudentDashboard/StudentLeftDashboard/Assessment/Assessment';
import AssessmentNew from './AssessmentNew';
import CurriculumCompletionNew from './CurriculumCompletionNew';
import TrainingReportNew from './TrainingReportNew';
// import apiRequest from '../../../../config/apiRequest';
import axios from 'axios';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
// import axiosInstance from '../../../../config/axios';
import FilterDetailsContext from '../store/filter-data';
import { connect, useSelector } from 'react-redux';
import FinanceDash from 'containers/dashboard/ownerDashboard/financeDash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import apiRequest from 'containers/dashboard/StudentDashboard/config/apiRequest';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

function TeacherDashboard() {
  // const [studentDetail, setStudentDetail] = useState({});
  const [attendanceDetail, setAttendanceDetail] = useState({});
  const [branchDetail, setBranchDetail] = useState([]);
  const [curriculumDetail, setCurriculumDetail] = useState([]);
  const [gradesectionDetail, setGradeSectionDetail] = useState([]);
  const [recentSubmissionDetail, setRecentSubmissionDetail] = useState([]);
  const [branchId, setBranchId] = useState();
  const userToken = JSON.parse(localStorage.getItem('userDetails'))?.token;
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const [sessionYearId, setSessionYearId] = useState();
  const [acadId, setAcadId] = useState();
  const ctx = useContext(FilterDetailsContext);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branchCounter, setBranchCounter] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [acadCounter, setAcadCounter] = useState(false);
  const initialState = {
    attendence: false,
    tranction: false,
    feeStatus: false,
    academic: false,
    staffDetails: false,
  };
  const [progress1, setProgress1] = useState(initialState);
  const { setAlert } = useContext(AlertNotificationContext);

  const [currBranch, setCurrBranch] = useState();
  const [branchDisplay, setBranchDisplay] = useState();

  const gradeSectionDetails = () => {
    axios
      .get(`${endpoints.teacherDashboardTwo.gradeSectionDetails}?acad_session_id=1`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setGradeSectionDetail(result?.data?.result);
          setCurriculumDetail(result?.data?.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const acadIdGenerator = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${ctx.moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          // setAcadIds(result.data.data.results[1].id);
          let acadIdArr = result.data.data.results.map((i) => {
            return i.id;
          });
          setAcadId(acadIdArr);
          // overviewDetails(acadIdArr);
          branchDetails(acadIdArr);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const overviewDetails = (...acadId) => {
    // let acadIds =  (...acadId);
    axiosInstance
      .get(`${endpoints.teacherDashboardTwo.teacherOverview}?acad_session=${acadId}`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setRecentSubmissionDetail(result.data.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const curriculumDetails = () => {
    axios
      .get(`${endpoints.teacherDashboardTwo.curriculumDetails}`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCurriculumDetail(result?.data?.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };
  const attendanceDetails = () => {
    axios
      .get(`${endpoints.teacherDashboardTwo.attendanceDetails}`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAttendanceDetail(result?.data?.result);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };
  const branchDetails = (...acadId) => {
    axios
      .get(`${endpoints.teacherDashboardTwo.branchDetails}?acad_session=${acadId}`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBranchDetail(result?.data?.result);
          setBranchId(result.data.result[0].branch_id);
          setSessionYearId(selectedAcademicYear?.id);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };
  useEffect(() => {
    acadIdGenerator();
    // branchDetails();
    attendanceDetails();
    // curriculumDetails();
    // overviewDetails();
  }, []);
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    getBranches();
  }, [moduleId, selectedAcademicYear]);

  const getBranches = () => {
    if (moduleId != '' || null || undefined) {
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
        )
        .then((res) => {
          setBranchList(res.data.data.results);
          const ids = res.data.data.results?.map((el) => el?.id); //acad id
          setSelectedBranchId(ids);
          setBranchData(res.data.data.results);
          // if(!data?.is_superuser && !(userLevel === 1 || userLevel === 2 ||userLevel === 3 ||userLevel === 4)){
          if (res.data.data.results.length === 1) {
            handleBranch('', res.data.data.results[0]);
          }
        })
        .catch(() => {});
    }
  };

  const handleBranch = (event = {}, new_value = []) => {
    let value = [new_value]
    // setSelectedDisplayBranch()
    setSelectedBranch([]);
    setBranchDisplay()
    if (new_value !== null && value?.length > 0) {
      setBranchDisplay(new_value)
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.id); //acad_id
      setSelectedBranch(ids);
      setBranchList(ids);
      setSelectedBranchId(selectedId);
      setBranchCounter(true);
    }
    if (new_value === null || value?.length === 0) {
      getBranches();
      setBranchCounter(false);
    }
  };

  const getCurrReport = (params) => {
    if(selectedBranchId?.length > 1){
      setAlert('error','Please select at least and at most one branch');
      return
    }
    setProgress1((prevState) => ({
      ...prevState,
      academic: true,
    }));
    apiRequest(
      'get',
      `${endpoints.ownerDashboard.getAllBranchCurr}?branch_id=${selectedBranchId}`,
      null,
      null,
      true,
      10000
    )
      .then((res) => {
        setCurrBranch(res.data.result);
        setProgress1(initialState);
        // setFinanceData(res.data)
        // setRoleWiseAttendance(res.data.result)
      })
      .catch(() => {});
  };

  const handleAcadRefresh = () => {
    getCurrReport();
    setAcadCounter(true);
  };

  return (
    <>
      <FilterDetailsContext.Provider
        value={{
          branchIdVal: branchId,
          moduleId: moduleId,
          sessionYearId: sessionYearId,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Grid
              item
              // container
              xs={12}
              // spacing={2}
              justifyContent='space-between'
              alignItems='center'
              style={{ paddingLeft: '10px', display: 'flex' }}
            >
              <Grid item md={2}>
                <Typography style={{ fontSize: '32px', fontWeight: 'bolder' }}>
                  {' '}
                  Dashboard{' '}
                </Typography>
              </Grid>

              <Grid item md={2} xs={12}>
                <Autocomplete
                // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleBranch}
                  id='branch_id'
                  className='dropdownIcon'
                  value={branchDisplay || {}}
                  options={branchData || []}
                  getOptionLabel={(option) => option?.branch?.branch_name || ''}
                  // getOptionSelected={(option, value) =>
                  //   option?.branch?.id == value?.branch?.id
                  // }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={7}></Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <TodayClass branchdetail={branchDetail} />
              </Grid> */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Grid container direction='column'>
                      <Grid item xs={12}>
                        <TodayAttendance attendanceDetail={attendanceDetail} />
                        {/* <Grid item xs={12}>
                          <Overview
                            recentSubmissionDetail={recentSubmissionDetail}
                            overviewDetails={overviewDetails}
                            acadId={acadId}
                          />
                        </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={0} direction='column'>
                      {/* <Grid item xs={12}>
                        <AssessmentNew gradesectionDetail={gradesectionDetail} />
                      </Grid> */}
                      <Grid item xs={12}>
                        {/* <CurriculumCompletionNew curriculumDetail={curriculumDetail} /> */}
                        {/* <OwnerLikeCurriculam/> */}
                        <FinanceDash
                          branchList={branchList}
                          branchData={branchData}
                          getBranches={getBranches}
                          branchCounter={branchCounter}
                          selectedBranch={selectedBranch}
                          handleAcadRefresh={handleAcadRefresh}
                          progress1={progress1}
                          acadCounter={acadCounter}
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <TrainingReportNew />
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* RH SIDE code below */}
          <Grid item xs={4}>
            <StudentRightDashboard />
          </Grid>
        </Grid>
        <Grid></Grid>
      </FilterDetailsContext.Provider>
    </>
  );
}

export default TeacherDashboard;
