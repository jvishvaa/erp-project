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
            <Typography style={{ fontWeight: '1000', fontSize: '16px' }}>
              Dashboard
            </Typography>
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
                        <Grid item xs={12}>
                          <Overview
                            recentSubmissionDetail={recentSubmissionDetail}
                            overviewDetails={overviewDetails}
                            acadId={acadId}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={0} direction='column'>
                      {/* <Grid item xs={12}>
                        <AssessmentNew gradesectionDetail={gradesectionDetail} />
                      </Grid> */}
                      <Grid item xs={12}>
                        <CurriculumCompletionNew
                          curriculumDetail={curriculumDetail}
                          curriculumDetails={curriculumDetails}
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
