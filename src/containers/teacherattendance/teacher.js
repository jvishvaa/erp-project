import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Checkbox from '@material-ui/core/Checkbox';
import './teacherattendance.css';
import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import TeacherAttendanceStatus from './teacherAttendanceStatus';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import MomentUtils from '@date-io/moment';
import NotifyConfirmPopUp from './notifyConfirmPopUp';

function EnhancedTableHead(props) {
  const { onRequestSort, isStudent } = props;

  return (
    <TableHead align='left' stickyHeader>
      <TableRow>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
          S.No.
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
          ERP ID
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeaderalign='left'>
          Name
        </TableCell>
        {!isStudent && (
          <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
            User Role
          </TableCell>
        )}
        {isStudent && (
          <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
            Grade
          </TableCell>
        )}
        {isStudent && (
          <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
            Section
          </TableCell>
        )}

        <TableCell
          style={{ backgroundColor: 'LightGray' }}
          className='mobile-attendance'
          stickyHeader
          align='left'
        >
          Attendance
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
    fontWeight: 'bold',
  },
  button: {
    background: theme.palette.secondary.main,
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography
              className={classes.title}
              variant='h6'
              id='tableTitle'
              component='div'
            ></Typography>
          </Grid>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  table: {},
  fontColorHeadCell: {
    color: 'black',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  mobileTable: {
    marginTop: '26px',
  },
  button: {
    background: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
}));

export default function TeacherAttendance(props) {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [loading, setLoading] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [dense, setDense] = React.useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [roles, setRoles] = React.useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const user_level = userData?.user_level;
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [data, setData] = React.useState([]);
  const [recordsData, setRecordsData] = React.useState([]);
  const [rolesId, setRolesId] = React.useState();
  const [isStudent, setIsStudent] = React.useState(false);

  const [moduleId, setModuleId] = React.useState();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');

  const [sectionId, setSectionId] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [selectedallsecctionmappingId, setSelectedallsecctionmappingId] = useState([]);
  const [count, setCount] = useState(false);
  const [showdata, setshowdata] = useState(false);
  const [isStudentInRole, setIsStudentInRole] = useState(false);

  const [checkedSelect, setCheckedSelect] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [attendanceDialog, setAttendanceDialog] = React.useState('');
  const [absentvalue, setAbsent] = React.useState(0);
  const [presentvalue, setPresent] = React.useState(0);

  const handleChangeSelect = (event) => {
    setCheckedSelect(event.target.checked);
    setOpenSelect(event.target.checked);
  };

  const handleCloseSelect = () => {
    setOpenSelect(false);
    setCheckedSelect(false);
  };

  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
  };

  useEffect(() => {
    setSelectedBranch('');
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Mark Student Attendance') {
              setModuleId(item.child_id);

              if (user_level == 11 && item.child_id) {
                let selectedId = userData?.role_details?.branch[0]?.id;
                setSelectedBranch(userData?.role_details?.branch[0]);
                setSelectedBranchIds(selectedId);

                callApi(
                  `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedId}&module_id=${item.child_id}`,
                  'gradeList'
                );
              }
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId && selectedAcademicYear) getBranch();
  }, [moduleId, selectedAcademicYear]);

  function getBranch(acadId) {
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

  const handleBranch = (event, value) => {
    if (value) {
      setGradeList([]);
      setSelectedGrade([]);
      setSelectedGradeIds('');
      setSectionId([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
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
      setSectionId([]);
    }
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
      setSectionId([]);

      const selectedId = value?.grade_id;
      setSelectedGrade(value);
      setSelectedGradeIds(selectedId);

      if (window.location.pathname.includes('mark-student-attendance')) {
        callApi(
          `${endpoints.academics.sections}?session_year=${
            selectedAcademicYear?.id
          }&branch_id=${selectedBranchIds}&grade_id=${selectedId?.toString()}&module_id=${moduleId}`,
          'section'
        );
      }
    } else {
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedGradeIds('');
      setSelectedSectionIds('');
      setSectionId([]);
    }
  };

  const handleSection = (event = {}, value = []) => {
    if (value?.length > 0) {
      value =
        value.filter(({ section_id }) => section_id === 'all').length === 1
          ? [...sectionList].filter(({ section_id }) => section_id !== 'all')
          : value;
      let sectionId = [];
      sectionId = value.map((item) => item.id);
      setSectionId(sectionId);
      const selectedsecctionId = value.map((element) => element?.section_id);
      const selectedsecctionmappingId = value.map((element) => element?.id);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
      setSelectedallsecctionmappingId(selectedsecctionmappingId);
    } else {
      setSectionId([]);
      setSelectedSection([]);
      setSelectedSectionIds('');
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
            const selectAllObject = {
              session_year: {},
              id: 'all',
              section_id: 'all',
              section__section_name: 'Select All',
              section_name: 'Select All',
            };
            const data = [selectAllObject, ...result?.data?.data];
            setSectionList(data);
          }
        } else {
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleChangeSelectPA = (event) => {
    setAttendanceDialog(event.target.value);
  };

  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.userManagement.centralUserLevel, {
        params: { exclude_student: true },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.level_name));
        setRoles(result.data.result);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  useEffect(() => {
    setData([]);
    setRecordsData([]);
    setshowdata(false);
    setGradeList([]);
    setSelectedGrade([]);
    setSelectedGradeIds('');
    setSectionId([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedSectionIds('');

    if (window.location.pathname.includes('mark-student-attendance')) {
      setIsStudent(true);
      setRolesId(13);
      setIsStudentInRole(true);
      if (selectedGradeIds) {
        callApi(
          `${endpoints.academics.sections}?session_year=${
            selectedAcademicYear?.id
          }&branch_id=${selectedBranchIds}&grade_id=${selectedGradeIds?.toString()}&module_id=${moduleId}`,
          'section'
        );
      }
    } else {
      setIsStudent(false);
      setIsStudentInRole(false);
      getRoleApi();
      setRolesId();
    }
  }, [window.location.pathname]);

  const getTeacherData = () => {
    setData([]);
    if (
      window.location.pathname.includes('mark-student-attendance') &&
      sectionId.length == 0
    ) {
      setAlert('warning', 'Please select all required fields');
      return false;
    }

    if (!selectedBranchIds || !selectedGradeIds || !rolesId) {
      setAlert('warning', 'Please select all required fields');
      return false;
    } else {
      setLoading(true);
      const result = axiosInstance
        .get(
          `${endpoints.academics.teacherAttendanceData}?branch_id=${selectedBranchIds}&grade_id=${selectedGradeIds}&session_year=${selectedAcademicYear?.id}&user_level=${rolesId}&date=${startDate}&section_id=${selectedSectionIds}`
        )
        .then((result) => {
          if (result.status === 200) {
            setData(result?.data?.attendance_data);
            setRecordsData(result?.data?.aggregate_counts);
            setLoading(false);
            setshowdata(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          setshowdata(false);
        });
    }
  };

  const getReportData = () => {
    let url = '';
    if (sectionId.length > 0) {
      url = `${endpoints.academics.dataupdate}?date=${startDate}&user_level=${rolesId}&section_mapping_id=${selectedallsecctionmappingId}`;
    } else {
      url = `${endpoints.academics.dataupdate}?date=${startDate}&user_level=${rolesId}&grade_id=${selectedGradeIds}&branch_id=${selectedBranchIds}&session_year_id=${selectedAcademicYear?.id}`;
    }
    const result = axiosInstance
      .get(url)
      .then((result) => {
        if (result.status === 200) {
          let present;
          let absent;
          present = result?.data?.result
            ?.filter((item) => item.attendence_status !== 'absent')
            .reduce((accumulator, item) => {
              return accumulator + item.count;
            }, 0);
          absent = result?.data?.result
            ?.filter((item) => item.attendence_status == 'absent')
            .reduce((accumulator, item) => {
              return accumulator + item.count;
            }, 0);
          setAbsent(absent);
          setPresent(present);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getReportData();
  }, [data, count]);

  const handleMark = () => {
    setLoading(true);
    let arrSec = [];
    arrSec.push(sectionId.map((ele) => ele));
    const payload = {
      // section_mapping_id: arrSec[0].toString(),
      user_level: rolesId,
      date: startDate,
      attendance_status: attendanceDialog,
    };
    if (sectionId.length > 0) {
      payload['section_mapping_id'] = arrSec[0].toString();
    } else {
      payload['grade_id'] = selectedGradeIds;
      payload['branch_id'] = selectedBranchIds;
      payload['session_year_id'] = selectedAcademicYear?.id;
    }
    axiosInstance
      .post(`${endpoints.academics.markAllAttendance}`, payload)
      .then((result) => {
        getTeacherData();
        handleCloseSelect();
        setAttendanceDialog('');
      })
      .catch((error) => {});
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMultipleRoles = (event, value) => {
    if (value) {
      const isSubset = (array1, array2) =>
        array2.every((element) => array1.includes(element));
      const roleName = value?.level_name.toUpperCase().split('');
      const studentSpelling = ['S', 'T', 'U', 'D', 'E', 'N', 'T'];
      setIsStudentInRole(isSubset(roleName, studentSpelling));
      setRolesId(value?.id);
    } else {
      setRolesId('');
      setIsStudentInRole(false);
    }
  };

  const handleNotifyPopUp = (val) => {
    if (startDate !== moment().format('YYYY-MM-DD')) {
      setAlert('warning', "Please select today's date");
    }
    if (sectionId.length == 0 || !selectedBranchIds || !selectedGradeIds) {
      setAlert('warning', 'Please select all required fields');
    }
    if (
      sectionId.length > 0 &&
      selectedBranchIds &&
      selectedGradeIds &&
      startDate == moment().format('YYYY-MM-DD')
    ) {
      setOpenModal(val);
    }
  };
  const local = 'localhost:3000';
  // const dev = 'dev.olvorchidnaigaon.letseduvate.com';
  const ui_revamp1 = 'ui-revamp1.letseduvate.com';
  const qa = 'qa.olvorchidnaigaon.letseduvate.com';
  const prod = 'orchids.letseduvate.com';

  const isDateEditable = [1, 2, 8, 9].includes(user_level);

  return (
    <Layout>
      <div
        className='attendancescroll'
        style={{
          background: 'white',
          height: '90vh',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
      >
        <Grid
          container
          direction='row'
          style={{
            paddingLeft: '22px',
            paddingRight: '10px',
          }}
        >
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'
            >
              <Typography color='textPrimary' variant='h6' className='th-18'>
                Attendance
              </Typography>
              <Typography color='textPrimary' className='th-18'>
                {isStudent ? 'Mark Student Attendance' : 'Mark Staff Attendance'}
              </Typography>
            </Breadcrumbs>
          </Grid>

          <Grid container spacing={1}>
            {isDateEditable && (
              <Grid item xs={12} md={2}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    onOpen={() => {
                      setTimeout(() => {
                        document
                          .querySelectorAll(
                            '.MuiPickersModal-dialogRoot .MuiDialogActions-root button'
                          )
                          .forEach((elem) => {
                            elem.classList.remove('MuiButton-textPrimary');
                            elem.classList.add('MuiButton-containedPrimary');
                          });
                      }, 1000);
                    }}
                    size='small'
                    color='primary'
                    // disableToolbar
                    variant='dialog'
                    format='YYYY-MM-DD'
                    margin='none'
                    id='date-picker-start-date'
                    label='Select date'
                    value={startDate}
                    // maxDate={new Date()}
                    disableFuture={true}
                    onChange={(event, date) => {
                      handleDateChange('startDate', date);
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            )}
            {!isStudent && (
              <Grid item xs={12} md={2}>
                <Autocomplete
                  // multiple
                  size='small'
                  onChange={handleMultipleRoles}
                  value={rolesId}
                  // disableClearable
                  className='dropdownIcon'
                  id='message_log-smsType'
                  options={roles}
                  getOptionLabel={(option) => option?.level_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='User Level'
                      placeholder='User Level'
                      required
                    />
                  )}
                />
              </Grid>
            )}
            {user_level !== 11 ? (
              <Grid item xs={12} md={2}>
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
            ) : null}
            <Grid item xs={12} md={2}>
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

            {window.location.pathname.includes('mark-student-attendance') ? (
              <Grid item xs={12} md={2}>
                <Autocomplete
                  id='combo-box-demo'
                  size='small'
                  multiple
                  limitTags={1}
                  options={sectionList || []}
                  onChange={handleSection}
                  value={selectedSection || []}
                  getOptionLabel={(option) => option?.section__section_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label='Section' variant='outlined' required />
                  )}
                />
              </Grid>
            ) : null}

            <Grid item md={2} xs={12}>
              <Button
                onClick={getTeacherData}
                variant='contained'
                color='primary'
                className='mx-1 w-100'
              >
                Search
              </Button>
            </Grid>
            <Grid>
              {data?.length > 0 ? (
                <Grid xs={12} container spacing={1} justifyContent='flex-end'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '-22px',
                    }}
                  >
                    <Checkbox
                      checked={checkedSelect}
                      onChange={handleChangeSelect}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      className='ml-3'
                    />
                    <p
                      style={{
                        whiteSpace: 'nowrap',
                        marginTop: '1rem',
                      }}
                    >
                      Mark All
                    </p>
                  </div>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
          <div className='th-sticky-header' style={{ width: '100%' }}>
            <TableContainer className='tableContainer'>
              <Table
                className={classes.table}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}
                aria-label='enhanced table'
                stickyHeader
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                  isStudent={isStudent}
                />
                {loading ? (
                  <Loader />
                ) : (
                  <TableBody>
                    {
                      data?.map((value, i) => {
                        return (
                          <TableRow
                            hover
                            // onClick={(event) => handleClick(event, row.name)}
                            role='checkbox'
                            // aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={value?.name}
                            // selected={isItemSelected}
                          >
                            <TableCell align='left' style={{ width: '1px' }}>
                              {i + 1}
                            </TableCell>
                            <TableCell align='left' style={{ width: '1px' }}>
                              {value?.erp_id}
                            </TableCell>
                            <TableCell align='left' style={{ width: '1px' }}>
                              {value?.name}
                            </TableCell>
                            {!isStudent && (
                              <TableCell align='left' style={{ width: '1px' }}>
                                {value?.roles__role_name}
                              </TableCell>
                            )}
                            {isStudent && (
                              <TableCell align='left' style={{ width: '1px' }}>
                                {value?.section_mapping__grade__grade_name}
                              </TableCell>
                            )}
                            {isStudent && (
                              <TableCell align='left' style={{ width: '1px' }}>
                                {value?.section_mapping__section__section_name}
                              </TableCell>
                            )}

                            <TableCell align='right'>
                              <TeacherAttendanceStatus
                                user_id={value?.id}
                                start_date={startDate}
                                attendence_status={value?.attendence_status}
                                isStudentInRole={isStudentInRole}
                                getReportData={getReportData}
                                setCount={setCount}
                                index={i}
                                setDate={setData}
                                data={data}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                      // })}
                      /* {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */
                    }
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
        </Grid>
        {showdata ? (
          <Grid
            container
            spacing={1}
            style={{
              padding: '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'sticky',
              bottom: '0px',
              backgroundColor: 'lightgray',
              width: '97%',
              marginLeft: 20,
            }}
          >
            {recordsData?.total ? (
              <h5 className='mb-0'>
                Total Present : {presentvalue || 0} &nbsp; Total Absent :{' '}
                {absentvalue || 0} &nbsp; Total Marked : {absentvalue + presentvalue}{' '}
                &nbsp; Total Unmarked :{' '}
                {recordsData?.total - (absentvalue + presentvalue)} &nbsp; Total:{' '}
                {recordsData?.total}
              </h5>
            ) : null}
            {isStudentInRole &&
              (recordsData?.total ? true : false) &&
              (window.location.host == local ||
                // window.location.host == dev ||
                window.location.host == qa ||
                window.location.host == ui_revamp1 ||
                window.location.host == prod) && (
                <Grid item md={2} xs={12} style={{ marginLeft: 15 }}>
                  <Button
                    onClick={() => {
                      handleNotifyPopUp(true);
                    }}
                    variant='contained'
                    color='primary'
                  >
                    Notify Absentees
                  </Button>
                </Grid>
              )}
          </Grid>
        ) : null}

        <NotifyConfirmPopUp
          openModal={openModal}
          handleNotifyPopUp={handleNotifyPopUp}
          sectionId={sectionId}
          startDate={startDate}
          rolesId={rolesId}
        />

        <Dialog
          open={openSelect}
          onClose={handleCloseSelect}
          aria-labelledby='responsive-dialog-title'
        >
          <DialogTitle id='responsive-dialog-title'>
            {'Please Select Present or Absent?'}
          </DialogTitle>
          <DialogContent>
            <FormControl
              component='fieldset'
              name='attendence_status'
              style={{ display: 'flex', justifyContent: 'space-around' }}
            >
              <RadioGroup
                row={true}
                value={attendanceDialog}
                onChange={handleChangeSelectPA}
              >
                <Grid item md={3}>
                  <FormControlLabel
                    value='present'
                    control={<Radio />}
                    label='Present'
                    className='th-font-size-13 th-label'
                  />
                </Grid>
                <Grid item md={2} className='absentPadding'>
                  <FormControlLabel
                    value='absent'
                    control={<Radio />}
                    label='Absent'
                    className='th-font-size-13 th-label'
                  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseSelect}
              style={{ background: 'darkgrey' }}
            >
              Cancel
            </Button>
            <Button onClick={handleMark} color='primary' className={classes.button}>
              Publish
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
}
