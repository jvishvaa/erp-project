import Layout from 'containers/Layout';
import React, { useState, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import endpoints from 'config/endpoints';
import axios from 'axios';
import axiosInstance from 'config/axios';
import { Autocomplete } from '@material-ui/lab';
import { setReportType } from 'redux/actions';
import { connect, useSelector } from 'react-redux';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import './student-report.css';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import { Grid, TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const StudentReport = ({ widerWidth, isMobile, selectedReportType }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [studentIndivisualReport, setStudentIndivisualReport] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
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

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
      erp: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
      erp: '',
    });
    if (value) {
      getGrade(selectedAcademicYear?.id, value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
    }
  };

  const handleSubject = (event, value) => {
    setDropdownData({
      ...dropdownData,
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getTest(
        filterData.branch?.branch?.id,
        filterData.grade?.grade_id,
        value?.subject_id
      );

      getChapter(value?.subject_id);
      setFilterData({ ...filterData, subject: value });
      getUsersData(filterData, value);
    }
  };

  const handleGrade = (event, value) => {
    setDropdownData({
      ...dropdownData,
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
      erp: [],
    });
    setFilterData({
      ...filterData,
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
      erp: '',
    });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      getSection(
        selectedAcademicYear?.id,
        filterData.branch?.branch?.id,
        value?.grade_id
      );

      getSubject(filterData.branch?.id, value?.grade_id);

      getSection(
        selectedAcademicYear?.id,
        filterData.branch?.branch?.id,
        value?.grade_id
      );
    }
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
      .catch((error) => {});
  }

  function getGrade(acadId, branchId) {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              grade: result.data?.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getSection(acadId, branchId, gradeId) {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchId}&grade_id=${gradeId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              section: result.data?.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getSubject(acadMappingId, gradeId) {
    axiosInstance
      .get(
        `${endpoints.assessmentErp.subjectList}?session_year=${acadMappingId}&grade=${gradeId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              subject: result.data?.result,
            };
          });
        }
      })
      .catch((error) => {});
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
      .catch((error) => {});
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
      .catch((error) => {});
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

  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'Assessment' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if (item.child_name === 'Indivisual Student Report') {
  //             setModuleId(item.child_id);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Individual Student Report') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId) {
      getBranch(selectedAcademicYear?.id);
    }
  }, [moduleId]);
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

  function getUsersData(value, subj) {
    console.log(value, 'iop');
    axiosInstance
      .get(
        `${endpoints.assessmentReportTypes.individualStudentReport}?session_year=${value?.branch?.session_year?.id}&branch_id=${value?.branch?.branch?.id}&grade_id=${value?.grade?.grade_id}&subject=${subj?.subject_id}`
      )
      .then((response) => {
        setStudentIndivisualReport(response?.data);
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong');
      });
  }

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Assessment'
        isAcademicYearVisible={true}
        childComponentName='Individual Student Reports'
      />
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%', margin: 30 }}
            size='small'
            onChange={handleBranch}
            id='branch'
            value={filterData.branch || {}}
            options={dropdownData.branch || []}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
            filterSelectedOptions
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
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%', margin: 30 }}
            size='small'
            onChange={handleGrade}
            id='grade'
            value={filterData.grade || {}}
            options={dropdownData.grade || []}
            getOptionLabel={(option) => option?.grade__grade_name || ''}
            filterSelectedOptions
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
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%', margin: 30 }}
            size='small'
            onChange={handleSubject}
            id='subject'
            value={filterData.subject || {}}
            options={dropdownData.subject || []}
            getOptionLabel={(option) => option?.subject_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
              />
            )}
          />
        </Grid>
        <Grid container>
          <TableContainer>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Test Mode</TableCell>
                  <TableCell>Correct Answer</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Wrong Answer</TableCell>
                  <TableCell>Marks Obtained</TableCell>
                  <TableCell>Marks Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentIndivisualReport.map((repos) => (
                  <TableRow className={repos.marks_percentage < 60 ? 'highlighted' : ''}>
                    <TableCell>{repos.test__test_name}</TableCell>
                    <TableCell>{repos.test__test_mode == 1 ? 'Online' : 'Offline'}</TableCell>
                    <TableCell>{repos.correct_answer == 0 && repos.test__test_mode == '2' ? '-' : repos.correct_answer}</TableCell>
                    <TableCell>{repos.test__total_mark}</TableCell>
                    <TableCell>{repos.wrong_answer == 0 && repos.test__test_mode == '2' ? '-' : repos.wrong_answer}</TableCell>
                    <TableCell>{repos.marks_obtained}</TableCell>
                    <TableCell>{repos.marks_percentage} %</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default StudentReport;
