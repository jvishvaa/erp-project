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
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import NoFilterData from '../../../../../../components/noFilteredData/noFilterData';
import { Menu, Fade } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';
import Loader from '../../../../../../components/loader/loader';
import './index.css';
import GetAppIcon from '@material-ui/icons/GetApp';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import TextField from '@material-ui/core/TextField';
import axiosInstance from '../../../../../../config/axios';
import endpoints from '../../../../../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';
import { useDashboardContext } from '../../../../dashboard-context';

const reportTypes = [
  { type: 'Yesterday Report', days: '1' },
  { type: 'Weekly Report', days: '7' },
  { type: 'Monthly Report', days: '30' },
];

export default function HomeworkReport(props) {
  const {
    branchIds = [],
    downloadReport = () => {},
    getReport = () => {},
    setCard,
    setReports,
  } = useDashboardContext();
  const [loading, setLoading] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [submissionData, setSubmissionData] = useState([]);

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
  const [selectedSectionIds, setSelectedSectionIds] = useState('');

  const [subjectList, setSubjectList] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [page, setPage] = React.useState(0);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showNoData, setShowNoData] = useState(false);
  const [multipleBranchSelect, setMultipleBranchSelect] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Books' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Online Books') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId) getBranch();
  }, [moduleId]);

  function getBranch() {
    let allBranchIds = [];
    let url = `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`;
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          let branches = result.data?.data?.results.map((item) => item.branch);
          for (let i = 0; i < branches.length; i++) {
            allBranchIds.push(branches[i].id);
          }
          setBranchList(branches);
          branches.unshift({
            branch_name: 'Select All',
            id: allBranchIds,
          });
        }
      })
      .catch((error) => {});
  }

  const handleBranch = (event, value) => {
    if (value.length > 1 || value[0]?.branch_name === 'Select All') {
      setMultipleBranchSelect(true);
    } else {
      setMultipleBranchSelect(false);
    }
    var branchIds = [];
    if (value.length) {
      for (let i = 0; i < value.length; i++) {
        branchIds.push(value[i].id);
      }
      setGradeList([]);
      setSelectedGrade([]);
      setSelectedGradeIds('');
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
      setSubjectList([]);
      setShowButton(true);
      setSelectedSubject([]);
      setSelectedSubjectIds([]);
      setSelectedBranch(value);
      setSelectedBranchIds(branchIds);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchIds}&module_id=${moduleId}`,
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
      setShowButton(false);
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
            // setShowButton(true);
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

  const getSubmissionData = () => {
    if (multipleBranchSelect === true) {
      setAlert('error', 'Select Single Branch');
    } else {
      setSubmissionData([]);
      if (
        !selectedBranchIds ||
        !selectedGradeIds ||
        !selectedSectionIds ||
        !selectedSubjectIds
      ) {
        setAlert('error', 'Select all required fields');
        return false;
      } else {
        setLoading(true);
        const result = axiosInstance
          .get(
            `${endpoints.academicTestReport.homeworkSubmissionReport}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranchIds}&grade_id=${selectedGradeIds}&section_id=${selectedSectionIds}&subject_id=${selectedSubjectIds}&date_gte=${startDate}&date_lte=${endDate}`,
            {
              headers: {
                'X-DTS-HOST': window.location.host,
              },
            }
          )
          .then((result) => {
            if (result.status === 200) {
              setSubmissionData(result?.data);
              setLoading(false);
              if (result?.data?.data?.length === 0) setShowNoData(true);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    }
  };

  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      if (v1[1] !== undefined) {
        setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
      }
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

  const downloadExcelFile = (excelData) => {
    const blob = window.URL.createObjectURL(
      new Blob([excelData], {
        type: 'application/vnd.ms-excel',
      })
    );
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = blob;
    link.setAttribute('download', 'report.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownload = (days) => {
    const params = {
      days,
      branch_ids: selectedBranchIds.toString(),
      session_year_id: selectedAcademicYear?.id,
    };
    const decisonParam = 'Homework Report'.toLowerCase().split(' ')[0];
    downloadReport(decisonParam, params)
      .then((response) => {
        const {
          headers = {},
          message = 'Downloadable report not available',
          data = '',
        } = response || {};
        const contentType = headers['content-type'] || 'application/json';
        if (contentType === 'application/json') {
          setAlert('info', message);
        } else {
          downloadExcelFile(data);
        }
      })
      .catch(() => {});
    handleClose();
  };

  return (
    <>
      <Grid container spacing={2}>
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
        <Grid item xs={12} md={6} align='right'>
          {showButton && (
            <Button
              variant='contained'
              color='primary'
              startIcon={<GetAppIcon />}
              onClick={handleClick}
            >
              Download Report
            </Button>
          )}
          <Menu
            id='fade-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {reportTypes.map(({ type, days }) => (
              <MenuItem
                dense={true}
                key={`${type - days}`}
                onClick={() => handleDownload(days)}
                component='button'
              >
                <ListItemIcon>
                  <GetAppIcon fontSize='small' />
                </ListItemIcon>
                <Typography variant='inherit'>{type}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Autocomplete
            multiple
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
                      // format={(date) => moment(date).format('MM-DD-YYYY')}
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

        <Grid item md={1} xs={12} style={{ marginRight: 15 }}>
          <Button onClick={getSubmissionData} variant='contained' color='primary'>
            Search
          </Button>
        </Grid>
      </Grid>
      <div className='th-sticky-header' style={{ width: '100%' }}>
        {loading && <Loader />}
        {submissionData?.data?.length > 0 && (
          <TableContainer>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Not Submitted</TableCell>
                  <TableCell>Submission Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissionData?.data?.length > 0 &&
                  submissionData?.data
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow>
                        <TableCell>{moment(item?.date).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{submissionData?.total_student}</TableCell>
                        <TableCell>{item?.total_submission}</TableCell>
                        <TableCell>
                          {submissionData?.total_student - item?.total_submission}
                        </TableCell>
                        <TableCell>
                          {(
                            (item?.total_submission / submissionData?.total_student) *
                            100
                          ).toFixed(2)}{' '}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {submissionData?.data?.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[]}
            component='div'
            count={submissionData?.data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>

      {showNoData && <NoFilterData data={'No Data Found'} />}
    </>
  );
}
