import React, { useEffect, useState } from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  IconButton,
  Typography,
} from '@material-ui/core';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import { reportTypeConstants } from '../dashboard-constants';
import { useDashboardContext } from '../dashboard-context';
import StudentRightDashboard from './../StudentDashboard/StudentRightDashboard/StudentRightDashboard';
// import AttendanceOverviewDashboard from './attendanceOverview';
import FinanceOwnerDashboard from './financeDash';
// import attendanceOverview from './attendanceOverview';
import endpoints from 'config/endpoints';
import { connect, useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import axiosInstance from 'config/axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import apiRequest from '../StudentDashboard/config/apiRequest';

const OwnerDashboard = () => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  // const branch = data?.role_details?.branch;
  const token = data?.token;
  // const selectedBranchId = branch?.map((el) => el?.id);
  const [roleWiseAttendance, setRoleWiseAttendance] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [financeData, setFinanceData] = useState([]);
  const [allCurr, setAllCurr] = useState([]);
  const [studentAttendanceOverview, setStudentAttendanceOverview] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [avgTest, setAvgTest] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [currBranch, setCurrBranch] = useState();
  const [staffOverAll, setStaffOverall] = useState([]);
  const [todayCounter, setTodayCounter] = useState(false);
  const [acadCounter, setAcadCounter] = useState(false);
  const [recentTrans, setRecentTrans] = useState();
  const [recentTransCounter, setRecentTransCounter] = useState(false);
  const [filteredBranchIds, setFilteredBranchIds] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [branchCounter, setBranchCounter] = useState(false);

  const initialState = {
    attendence: false,
    tranction: false,
    feeStatus: false,
    academic: false,
    staffDetails: false,
  }
  const [progress1, setProgress1] = useState(initialState);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Blogs' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Principal Blogs') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    // getBranches()
    getBranches();
  }, [moduleId]);

  // useEffect(() => {
  // }, [branchList])

  const handleTodayAttendance = () => {
    getAttendanceReport();
    getStaffDetails();
    setTodayCounter(true);
  };
  const handleFeeRefresh = () => {
    getFinanceReport();
  };

  const handleAcadRefresh = () => {
    // getAvgScore();
    getCurrReport();
    getAttendanceReportOverview();
    setAcadCounter(true);
  };
  const handlestaffOverViewRefresh = () => {
    getStaffDetailsOverAll();
  };

  const handlerecent = () => {
    getrecenttransaction();
    setRecentTransCounter(true);
  };

  const getrecenttransaction = () => {
    setProgress1(prevState => ({
      ...prevState,
      tranction: true
    }))
    axios
      .get(
        `${endpoints.ownerDashboard.getRecentTransaction}?academic_year=${selectedAcademicYear?.session_year}&branch=${selectedBranchId}&date=${date}`
      )
      .then((res) => {
        console.log(res, 'finan');
        setRecentTrans(res.data);
        setProgress1(initialState)
        // setFinanceData(res.data)
        // setRoleWiseAttendance(res.data.result)
      })
      .catch(() => { });
  };

  const getBranches = () => {
    if (moduleId != '' || null || undefined) {
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
        )
        .then((res) => {
          setBranchList(res.data.data.results);
          const ids = res.data.data.results?.map((el) => el?.branch?.id);
          console.log(ids);
          setSelectedBranchId(ids);
          setBranchData(res.data.data.results);
        })
        .catch(() => { });
    }
  };

  let date = moment().format('YYYY-MM-DD');

  const getAttendanceReport = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      attendence: true
    }))
    if (branchCounter === true) {
      // axios
      //   .get(
      //     `${endpoints.ownerDashboard.getStudentAttendance}?start_date=${date}&end_date=${date}&session_year_id=${selectedAcademicYear?.id}&branch_id=${selectedBranchId}`,
      //     {
      //       headers: {
      //         'X-DTS-Host': window.location.host,
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   )
      apiRequest('get', `${endpoints.ownerDashboard.getStudentAttendance}?start_date=${date}&end_date=${date}&session_year_id=${selectedAcademicYear?.id}&branch_id=${selectedBranchId}`, null, null, true, 10000)
        .then((res) => {
          setStudentAttendance(res.data.result);
          setProgress1(initialState)
        })
        .catch(() => { });
    } else {
      // axios
      //   .get(
      //     `${endpoints.ownerDashboard.getStudentAttendance}?start_date=${date}&end_date=${date}&session_year_id=${selectedAcademicYear?.id}`,
      //     {
      //       headers: {
      //         'X-DTS-Host': window.location.host,
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   )
      apiRequest('get', `${endpoints.ownerDashboard.getStudentAttendance}?start_date=${date}&end_date=${date}&session_year_id=${selectedAcademicYear?.id}`, null, null, true, 10000)
        .then((res) => {
          setStudentAttendance(res.data.result);
          setProgress1(initialState)
        })
        .catch(() => { });
    }
  };

  const getAttendanceReportOverview = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      academic: true
    }))
    // axios
    //   .get(
    //     `${endpoints.ownerDashboard.getStudentAttendance}?session_year_id=${selectedAcademicYear?.id}&branch_id=${selectedBranchId}`,
    //     {
    //       headers: {
    //         'X-DTS-Host': window.location.host,
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    apiRequest('get', `${endpoints.ownerDashboard.getStudentAttendance}?session_year_id=${selectedAcademicYear?.id}&branch_id=${selectedBranchId}`, null, null, true, 10000)
      .then((res) => {
        setStudentAttendanceOverview(res.data.result);
        setProgress1(initialState)
        // setStudentAttendance(res.data.result)
      })
      .catch(() => { });
  };

  const getStaffDetails = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      attendence: true
    }))
    const Acad_id = branchList?.map((el) => el?.id);
    if (branchCounter === true) {
      // axios
      //   .get(
      //     `${endpoints.ownerDashboard.getStaffDetails}?acad_session_id=${Acad_id}&date_range_type=today`,
      //     {
      //       headers: {
      //         'X-DTS-Host': window.location.host,
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   )
      apiRequest('get', `${endpoints.ownerDashboard.getStaffDetails}?acad_session_id=${Acad_id}&date_range_type=today`, null, null, true, 10000)
        .then((res) => {
          setRoleWiseAttendance(res.data.result);
          setProgress1(initialState)
        })
        .catch(() => { });
    } else {
      // axios
      //   .get(`${endpoints.ownerDashboard.getStaffDetails}?date_range_type=today`, {
      //     headers: {
      //       'X-DTS-Host': window.location.host,
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      apiRequest('get', `${endpoints.ownerDashboard.getStaffDetails}?date_range_type=today`, null, null, true, 10000)
        .then((res) => {
          setRoleWiseAttendance(res.data.result);
          setProgress1(initialState)
        })
        .catch(() => { });
    }
  };

  const getStaffDetailsOverAll = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      staffDetails: true
    }))
    const Acad_id = branchList?.map((el) => el?.id);
    // axios
    //   .get(`${endpoints.ownerDashboard.getStaffDetails}?acad_session_id=${Acad_id}`, {
    //     headers: {
    //       'X-DTS-Host': window.location.host,
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    apiRequest('get', `${endpoints.ownerDashboard.getStaffDetails}?acad_session_id=${Acad_id}`, null, null, true, 10000)
      .then((res) => {
        // setRoleWiseAttendance(res.data.result)
        console.log(res, 'staffover');
        setProgress1(initialState);
        setStaffOverall(res.data.result);
      })
      .catch(() => { });
  };

  const getAvgScore = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      academic: true
    }))
    const Acad_id = branchList?.map((el) => el?.id);
    // axios
    //   .get(`${endpoints.ownerDashboard.getAvgTest}?acad_session_id=${Acad_id}`, {
    //     headers: {
    //       'X-DTS-Host': window.location.host,
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    apiRequest('get', `${endpoints.ownerDashboard.getAvgTest}?acad_session_id=${Acad_id}`, null, null, true, 10000)
      .then((res) => {
        console.log(res, 'student');
        setAvgTest(res.data.result);
        setProgress1(initialState)
      })
      .catch(() => { });
  };
  const getFinanceReport = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      feeStatus: true
    }))
    axios
      .get(
        `${endpoints.ownerDashboard.getFinanceDetails}?academic_year=${selectedAcademicYear?.session_year}&branch=${selectedBranchId}`
      )
      .then((res) => {
        console.log(res, 'finan');
        setFinanceData(res.data);
        setProgress1(initialState)
        // setRoleWiseAttendance(res.data.result)
      })
      .catch(() => { });
  };

  const getCurrReport = (params) => {
    setProgress1(prevState => ({
      ...prevState,
      academic: true
    }))
    // axios
    //   .get(`${endpoints.ownerDashboard.getAllBranchCurr}?branch_id=${selectedBranchId}`, {
    //     headers: {
    //       'X-DTS-Host': window.location.host,
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    apiRequest('get', `${endpoints.ownerDashboard.getAllBranchCurr}?branch_id=${selectedBranchId}`, null, null, true, 10000)
      .then((res) => {
        console.log(res, 'currbranch');
        setCurrBranch(res.data.result);
        setProgress1(initialState)
        // setFinanceData(res.data)
        // setRoleWiseAttendance(res.data.result)
      })
      .catch(() => { });
  };

  const handleBranch = (event = {}, value = []) => {
    setSelectedBranch([]);
    if (value?.length > 0) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.branch?.id);
      setSelectedBranch(ids);
      console.log(ids);
      setBranchList(ids);
      setSelectedBranchId(selectedId);
      setBranchCounter(true);
    }
    if (value?.length === 0) {
      getBranches();
      setBranchCounter(false);
    }
  };

  return (
    <Grid container spacing={1}>
      {/* <Grid container xs={12} sm={8} md={8} spacing={1}>
                <AttendanceOverviewDashboard/>
            </Grid> */}
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
            multiple
            style={{ width: '100%' }}
            size='small'
            onChange={handleBranch}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch || []}
            options={branchData || []}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
            getOptionSelected={(option, value) => option?.branch?.id == value?.branch?.id}
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
      <Grid container xs={12} sm={9} md={9} spacing={1}>
        <FinanceOwnerDashboard
          roleWiseAttendance={roleWiseAttendance}
          financeData={financeData}
          studentAttendance={studentAttendance}
          studentAttendanceOverview={studentAttendanceOverview}
          avgTest={avgTest}
          branchList={branchList}
          currBranch={currBranch}
          staffOverAll={staffOverAll}
          moduleId={moduleId}
          handleTodayAttendance={handleTodayAttendance}
          handleFeeRefresh={handleFeeRefresh}
          handleAcadRefresh={handleAcadRefresh}
          handlestaffOverViewRefresh={handlestaffOverViewRefresh}
          todayCounter={todayCounter}
          acadCounter={acadCounter}
          handlerecent={handlerecent}
          recentTrans={recentTrans}
          recentTransCounter={recentTransCounter}
          branchData={branchData}
          getBranches={getBranches}
          branchCounter={branchCounter}
          selectedBranch={selectedBranch}
          progress1={progress1}
        />
      </Grid>
      <Grid container xs={0} sm={3} md={3}>
        <Grid item style={{ marginLeft: '5px' }}>
          <StudentRightDashboard />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OwnerDashboard;
