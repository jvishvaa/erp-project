import React, { useEffect, useContext, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import Loader from '../../../../../components/loader/loader';
import './index.css';

import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import TextField from '@material-ui/core/TextField';

import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
// import MomentUtils from '@date-io/moment';
import { fetchAssesmentTypes } from '../../../../../redux/actions';

export default function AcademicReport(props) {
  const [loading, setLoading] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [academicData, setAcademicData] = useState([]);

  const [moduleId, setModuleId] = React.useState();

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');

  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);

  const [subjectList, setSubjectList] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const [assesmentTypes, setAssesmentTypes] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedTestType, setSelectedTestType] = useState([]);
  const [page, setPage] = React.useState(0);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([]);

  const history = useHistory();

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
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId) {
      getBranch();
      getAssesmentTypes();
    }
  }, [moduleId, selectedAcademicYear]);

  function getBranch() {
    let url = `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`;
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          let branches = result.data?.data?.results.map((item) => item.branch);
          setBranchList(branches);
        }
      })
      .catch((error) => {});
  }
  const getAssesmentTypes = async () => {
    try {
      const data = await fetchAssesmentTypes();
      setAssesmentTypes(data);
    } catch (e) {}
  };
  const handleBranch = (event, value) => {
    if (value) {
      setGradeList([]);
      setSelectedGrade([]);
      setSelectedGradeIds('');
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);
      const selectedId = value?.id;
      setSelectedBranch(value);
      setSelectedBranchIds(selectedId);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedId}&module_id=${moduleId}`,
        'gradeList'
      );
    } else {
      setSelectedBranchIds('');
      setSelectedBranch([]);
      setGradeList([]);
      setSelectedGradeIds([]);
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds([]);
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);
    }
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);

      const selectedId = value?.grade_id;
      setSelectedGrade(value);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedBranchIds}&grade_id=${selectedId?.toString()}&module_id=${moduleId}`,
        'section'
      );
    } else {
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedGradeIds('');
      setSelectedSectionIds('');
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);
    }
  };

  const handleSection = (event = {}, value = []) => {
    if (value) {
      const selectedsecctionId = value?.section_id;
      const sectionid = value?.id;
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);
      callApi(
        `${endpoints.academics.subjects}?session_year=${
          selectedAcademicYear?.id
        }&branch=${selectedBranchIds}&grade=${selectedGradeIds?.toString()}&section=${selectedsecctionId.toString()}&module_id=${moduleId}`,
        'subject'
      );
    } else {
      setSectionId('');
      setSelectedSection([]);
      setSelectedSectionIds('');
      setSubjectList([]);
      setSelectedSubject([]);
      setSubjectId();
    }
  };

  const handleTestType = (e, value) => {
    if (value) {
      const selectedTestId = value?.id;
      setSelectedTestType(value);
      setSelectedTestId(selectedTestId);
    } else {
      setSelectedTestType('');
      setSelectedTestId('');
    }
  };

  const handleSubject = (event = {}, value = []) => {
    if (value) {
      setSelectedSubject(value);
      setSelectedSubjectIds(value?.subject__id);
      //   setSelectedSubjectIds(value?.id)
    } else {
      setSelectedSubject([]);
      setSubjectId('');
      setSelectedSubjectIds('');
    }
  };

  function callApi(api, key) {
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'subject') {
            setSubjectList(result.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getAcademicData = () => {
    setAcademicData([]);
    if (
      !selectedBranchIds ||
      !selectedGradeIds ||
      !selectedSectionIds ||
      !selectedSubjectIds ||
      !selectedTestId
    ) {
      setAlert('error', 'Select all required fields');
      return false;
    } else {
      setLoading(true);
      const result = axiosInstance
        .get(
          `${endpoints.academicTestReport.academicTestReport}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranchIds}&grade_id=${selectedGradeIds}&section_id=${selectedSectionIds}&subject_id=${selectedSubjectIds}&test_type=${selectedTestId}&date_gte=${startDate}&date_lte=${endDate}`
        )
        .then((result) => {
          if (result.status === 200) {
            setAcademicData(result?.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    setDateRangeTechPer(v1);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Layout>
      <Grid
        container
        direction='row'
        style={{
          paddingLeft: '22px',
          paddingRight: '10px',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'
            >
              <Typography color='textPrimary' variant='h6'>
                Academic Report
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid md={6} style={{ marginBottom: 15 }} align='right'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => history.push('./homework-submission-report')}
            >
              Homework Report
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={branchList}
              onChange={handleBranch}
              value={selectedBranch}
              getOptionLabel={(option) => option.branch_name}
              renderInput={(params) => (
                <TextField {...params} label='Branch' variant='outlined' required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={gradeList}
              onChange={handleGrade}
              value={selectedGrade}
              getOptionLabel={(option) => option?.grade_name}
              renderInput={(params) => (
                <TextField {...params} label='Grade' variant='outlined' required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={sectionList}
              onChange={handleSection}
              value={selectedSection}
              getOptionLabel={(option) => option?.section__section_name}
              renderInput={(params) => (
                <TextField {...params} label='Section' variant='outlined' required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              size='small'
              onChange={handleSubject}
              value={selectedSubject}
              className='dropdownIcon'
              id='message_log-smsType'
              options={subjectList}
              getOptionLabel={(option) => option?.subject__subject_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              size='small'
              onChange={handleTestType}
              value={selectedTestType}
              className='dropdownIcon'
              id='message_log-smsType'
              options={assesmentTypes || []}
              getOptionLabel={(option) => option.exam_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  label='Test Type'
                  placeholder='Test Type'
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
              <DateRangePicker
                startText='Select-Date-Range'
                size='small'
                value={dateRangeTechPer || ''}
                onChange={(newValue) => {
                  handleDate(newValue);
                  // setDateRangeTechPer(newValue);
                  // setDateRangeTechPer(()=>newValue);
                }}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        format={(date) => moment(date).format('MM-DD-YYYY')}
                        inputProps={{
                          ...inputProps,
                          value: `${moment(inputProps.value).format(
                            'MM-DD-YYYY'
                          )} - ${moment(endProps.inputProps.value).format('MM-DD-YYYY')}`,
                          readOnly: true,
                        }}
                        size='small'
                        style={{ minWidth: '100%' }}
                      />
                    </>
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item md={1} xs={12}>
            <Button onClick={getAcademicData} variant='contained' color='primary'>
              Search
            </Button>
          </Grid>
        </Grid>
        <div className='th-sticky-header' style={{ width: '100%' }}>
          {loading && <Loader />}
          {academicData.length > 0 && (
            <TableContainer>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Total marks</TableCell>
                    <TableCell>Student Below Threshold</TableCell>
                    <TableCell>Class Average</TableCell>
                    <TableCell>Below 35%</TableCell>
                    <TableCell>35% to 70%</TableCell>
                    <TableCell>Above 70%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academicData.length > 0 &&
                    academicData
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow>
                          <TableCell>{item?.test_name}</TableCell>
                          <TableCell>{item?.total_marks}</TableCell>
                          <TableCell>{item?.student_below_threshold}</TableCell>
                          <TableCell>{item?.student_below_class_average}</TableCell>
                          <TableCell>{item?.student_below_35_per}</TableCell>
                          <TableCell>{item?.student_below_35_to_70_per}</TableCell>
                          <TableCell>{item?.student_above_70_per}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {academicData.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[]}
              component='div'
              count={academicData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>
      </Grid>
    </Layout>
  );
}
