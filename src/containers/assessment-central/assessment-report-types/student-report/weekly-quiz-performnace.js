import Layout from 'containers/Layout';
import React, { useState, useEffect, useContext } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import endpoints from 'config/endpoints';
import axios from 'axios';
import axiosInstance from 'config/axios';
import { setReportType } from 'redux/actions';
import { connect, useSelector } from 'react-redux';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import './student-report.css'
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import {
  Grid,
  TextField,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const StudentReport = (
  {
    isMobile,
    selectedReportType,

  }
) => {
  const { setAlert } = useContext(AlertNotificationContext)
  const [studentIndivisualReport, setStudentIndivisualReport] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [examDate, setExamDate] = useState(null);
  const [testData, settestdata] = useState([]);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [dropdownData, setDropdownData] = useState({
    branch: [],
    grade: [],
    section: [],
    subject: [],
    test: [],
    chapter: [],
    topic: [],
    erp: [],
  });
  const [isLoading, setIsLoading] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
    subject: '',
    test: '',
    chapter: '',
    topic: '',
    erp: '',
  });


  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
    else setEndDate(date);
    getUsersData();
  };

  function getTest(branchId, gradeId, subjectId) {
    axiosInstance
      .get(
        `${endpoints.assessmentErp.testList}?branch=${branchId}&session_year=${selectedAcademicYear?.id}&grade=${gradeId}&subjects=${subjectId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              test: result.data?.result,
            };
          });
        }
      })
      .catch((error) => { });
  }


  function getChapter(subjectId) {
    axiosInstance
      .get(`${endpoints.assessmentErp.chapterList}?subject=${subjectId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              chapter: result.data?.result,
            };
          });
        }
      })
      .catch((error) => { });
  }


  function getBranch(acadId) {
    axiosInstance
      .get(`${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              branch: result.data?.data?.results,
            };
          });
        }
      })
      .catch((error) => { });
  }


  useEffect(() => {
    if (selectedReportType?.id) {
      setFilterData({
        branch: '',
        grade: '',
        section: '',
        subject: '',
        test: '',
        chapter: '',
        topic: '',
      });
    }
  }, [selectedReportType?.id, moduleId]);


  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Indivisual Student Report') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  // useEffect(() => {
  //     getUsersData();
  // },[]);

  useEffect(() => {
    getBranch(selectedAcademicYear?.id)
  }, []);
  const getERP = (branchId, gradeId, sectionId) => {
    setIsLoading(true);
    const {
      personal_info: { role = '' },
    } = userDetails || {};
    let params = `?branch=${branchId}&session_year=${selectedAcademicYear?.id}&grade=${gradeId}&section=${sectionId}`;
    if (role) params += `&role=${role}`;
    axiosInstance
      .get(`${endpoints.communication.studentUserList}${params}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              erp: result.data?.data?.results,
            };
          });
        }
        setIsLoading(null);
      })
      .catch((error) => {
        setIsLoading(null);
      });
  };



  const getUsersData = () => {
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.weeklyQuizPerformance
        }?date_gte=${startDate}&date_lte=${endDate}&academic_session=3`)
      .then(response => {
        setStudentIndivisualReport(response?.data);
        settestdata(response?.data)
      })
      .catch((error) => {
        setAlert("error", "Something went wrong")
      })

  }

  return (
      <div>
      <CommonBreadcrumbs
        componentName='Assessment'
        isAcademicYearVisible={true}
        childComponentName='Weekly Assessment Performance'
      />
      <div>
        <Grid container className="datemargin">
          <MuiPickersUtilsProvider utils={MomentUtils} >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'} >
              <KeyboardDatePicker
                size='small'
                color='primary'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-start-date'
                label='Start date'
                value={startDate}
                onChange={(event, date) => {
                  handleDateChange('startDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: -6 }}
              />
            </Grid>

            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <KeyboardDatePicker
                size='small'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-end-date'
                name='endDate'
                label='End date'
                value={endDate}

                onChange={(event, date) => {
                  handleDateChange('endDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              // style={{ marginTop: -6 }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      </div>


      <div>
        <TableContainer>
          {/* {testData.map((repos) => (<> */}

          <Table stickyHeader aria-label='sticky table'>
            <TableHead className="table-header-row">
              <TableRow >
                {/* <tr style={{backgroundColor: '#dddddd'}}> */}
                <TableCell >ID</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Total Subjects</TableCell>
                <TableCell>Paper Name</TableCell>
                <TableCell>Section</TableCell>
                {/* <TableCell>Subjects</TableCell> */}
                <TableCell>Test Date</TableCell>
                <TableCell>Attempted</TableCell>
                <TableCell>Marks Obtained</TableCell>
                {/* </tr> */}

              </TableRow>
            </TableHead>
            <TableBody>
              {/* {testData.map((repos) => ( */}
              {/* <TableRow> */}
              {testData.map((repos) => (<>
                <TableRow>
                  <TableCell>{repos.id}</TableCell>
                  <TableCell>{repos.question_paper__grade__grade_name}</TableCell>
                  <TableCell>{repos.question_paper__subjects}</TableCell>
                  <TableCell>{repos.question_paper__paper_name}</TableCell>
                  <TableCell>{repos.question_paper__section[0].A}</TableCell>
                  <TableCell>{repos.test_date}</TableCell>
                  <TableCell>{repos.test_details.total_attemped}</TableCell>
                  <TableCell>{repos.test_details.total_marks_obtained}</TableCell>
                </TableRow>
              </>))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </div>
  );
}
export default StudentReport;