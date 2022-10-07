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
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Loader from '../../components/loader/loader';

import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import TextField from '@material-ui/core/TextField';

import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import './teacherattendance.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const headCells = [
  { id: 'Branch', numeric: false, disablePadding: false, label: 'Branch' },
  { id: 'Grade', numeric: false, disablePadding: false, label: 'Grade' },
  { id: 'Section', numeric: false, disablePadding: false, label: 'Section' },
  { id: 'Role', numeric: false, disablePadding: false, label: 'User Level' },
];

function EnhancedTableHead(props) {
  const { data } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell
          className='sticky-col first-col'
          style={{ backgroundColor: 'LightGray' }}
        >
          S.No.
        </TableCell>
        <TableCell
          className='sticky-col second-col'
          style={{ backgroundColor: 'LightGray' }}
        >
          ERP ID
        </TableCell>
        <TableCell
          className='sticky-col third-col'
          style={{ backgroundColor: 'LightGray' }}
        >
          Name
        </TableCell>
        {headCells &&
          headCells?.map((headCell) => (
            <TableCell key={headCell?.id} style={{ backgroundColor: 'LightGray' }}>
              {headCell?.label}
            </TableCell>
          ))}
        {data?.[0]?.attendance?.map((headCell) => (
          <TableCell style={{ backgroundColor: 'LightGray' }}>
            {moment(headCell?.date, 'YYYY-MM-DD').date()} <br />
            {moment(headCell?.date, 'YYYY-MM-DD').format('ddd')}
          </TableCell>
        ))}
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
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
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
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'
          ></Typography>
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

    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    paddingTop: '2px',
  },
}));

export default function TeacherAttendanceVerify() {
  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [loading, setLoading] = React.useState(false);
  const [seachedData, setSeachedData] = React.useState('');
  const [orderBy, setOrderBy] = React.useState('Erp_id');
  const [dense, setDense] = React.useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [roles, setRoles] = React.useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [academicYearDropdown, setAcademicYearDropdown] = React.useState([]);
  const [disableDownload, setDisableDownload] = React.useState(true);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [data, setData] = React.useState([]);

  var studentAttendanceData = [];
  data.map((item) =>
    studentAttendanceData.push({
      'ERP ID': item.erp_id,
      Name: item.name,
      // 'Contact Number': item.contact,
      Branch: item.section_mapping__acad_session__branch__branch_name,
      Grade: item.section_mapping__grade__grade_name,
      Section: item.section_mapping__section__section_name,
      Role: item.roles__role_name,
    })
  );
  for (var i = 0; i <= data?.length; i++) {
    for (var j = 0; j < data[i]?.attendance?.length; j++) {
      var a = '-';
      if (data[i]?.attendance[j]?.attendence_status === 'present') a = 'P';
      else if (data[i]?.attendance[j]?.attendence_status === 'absent') a = 'A';
      else if (data[i]?.attendance[j]?.attendence_status === 'halfday') a = 'HD';
      else if (data[i]?.attendance[j]?.attendence_status === 'late') a = 'L';
      else if (data[i]?.attendance[j]?.attendence_status === 'holiday') a = 'H';

      studentAttendanceData[i][data[i]?.attendance[j]?.date] = a;
    }
  }

  const [rolesId, setRolesId] = React.useState();

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState({
    value: moment().format('M'),
    label: moment().format('MMMM'),
  });
  const [year, setYear] = React.useState({
    value: '2022',
    label: '06',
  });

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');

  const [dropdownData, setDropdownData] = React.useState({
    branch: [],
    grade: [],
  });
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [filterData, setFilterData] = React.useState({
    branch: '',
    year: '',
  });
  useEffect(() => {
    handleAcademicYear('', selectedAcademicYear);
    setFilterData({
      branch: '',
      grade: '',
    });
  }, [moduleId]);

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

  const handleAcademicYear = (event, value) => {
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
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
    });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, selectedAcademicYear });
    }
  };

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

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const handleChanges = (event, value) => {
    console.log(event, 'event');
    setMonth(value);
  };
  const handleYear = (event, value) => {
    setYear(value);
  };
  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.userManagement.centralUserLevel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        console.log(result, 'idofrole');
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
    getRoleApi();
  }, []);

  const handleMultipleRoles = (event, value) => {
    console.log('value', value);

    setRolesId(value?.id);
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'View Attendance') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const getTeacherData = () => {
    if (!rolesId) {
      setAlert('error', 'Please Select User Level');
      return false;
    }

    if (filterData.branch?.branch?.id === undefined) {
      setAlert('error', 'Please Select Branch');
      return false;
    }
    if (!selectedGradeIds) {
      setAlert('error', 'Please Select Grade');
      return false;
    }

    setLoading(true);
    setDisableDownload(true);
    const result = axiosInstance
      .get(
        `${endpoints.academics.getTeacherAttendanceData}?branch_id=${filterData.branch?.branch?.id}&grade_id=${selectedGradeIds}&section_id=${selectedSectionIds}&session_year=${selectedAcademicYear?.id}&month=${month?.value}&year=${year?.value}&user_level=${rolesId}`
      )
      .then((result) => {
        if (result.status === 200) {
          setData(result?.data);
          setLoading(false);
          if (result?.data?.length > 0) setDisableDownload(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setAcademicYearDropdown(result?.data?.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];

  const years = [
    {
      value: '2022',
      label: '06',
    },
    {
      value: '2021',
      label: '01',
    },
    {
      value: '2020',
      label: '02',
    },
    {
      value: '1999',
      label: '03',
    },
    {
      value: '1998',
      label: '04',
    },
    {
      value: '1997',
      label: '05',
    },
  ];

  const getStatusCol = (status) => {
    switch (status) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'late':
        return '#800080';
      case 'halfday':
        return '#4747d1';
      case 'H':
        return '#81c3b4';
      case 'NA':
        return 'black';
    }
  };
  const exportTo = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataX = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataX, fileName + fileExtension);
  };

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
    });
    if (value) {
      getGrade(selectedAcademicYear?.id, value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
      const selectedId = value?.branch?.id;
      setSelectedBranch(value);
      setSelectedBranchIds(selectedId);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedId}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');

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
    }
  };

  const handleSection = (event = {}, value = []) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionList].filter(({ id }) => id !== 'all')
          : value;
      const selectedsecctionId = value.map((item) => item.section_id || []);
      // const selectedsecctionId = value?.section_id;
      const sectionid = value.map((item) => item.id || []);
      // const sectionid = value?.id;
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
    } else {
      setSectionId('');
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
              section__section_name: 'Select All',
              section_name: 'Select All',
              section_id: 'all',
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
          style={{ paddingLeft: '22px', paddingRight: '10px' }}
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
                View Attendence
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={months}
                onChange={handleChanges}
                value={month}
                getOptionLabel={(option) => option?.label}
                renderInput={(params) => (
                  <TextField {...params} label='Month' variant='outlined' />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={years}
                onChange={handleYear}
                value={year}
                getOptionLabel={(option) => option?.value}
                renderInput={(params) => (
                  <TextField {...params} label='Year' variant='outlined' />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Autocomplete
                // multiple
                size='small'
                // disableClearable
                onChange={handleMultipleRoles}
                value={rolesId}
                className='dropdownIcon'
                // style={{ marginTop: '15px' }}
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
            <Grid item xs={12} md={2}>
              <Autocomplete
                size='small'
                onChange={handleBranch}
                id='branch'
                // style={{ marginTop: '16px' }}
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
                    required
                  />
                )}
              />
            </Grid>
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
            <Grid item xs={12} md={2}>
              <Autocomplete
                id='combo-box-demo'
                multiple
                limitTags={1}
                size='small'
                options={sectionList}
                onChange={handleSection}
                value={selectedSection}
                getOptionLabel={(option) => option?.section__section_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label='Section' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                onClick={getTeacherData}
                variant='contained'
                style={{ backgroundColor: '#e65c00' }}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              {/* <exportToCSV data={studentAttendanceData} fileName="attendance" /> */}
              {!disableDownload && (
                <Button
                  variant='contained'
                  className='mobile-download'
                  style={{ backgroundColor: '#e65c00' }}
                  onClick={() => exportTo(studentAttendanceData, 'attendance')}
                >
                  Download
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item md={4}>
              <Paper elevation={3} className='search'>
                <div>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder=' Search'
                  onChange={(e) => {
                    setSeachedData(e.target.value);
                  }}
                />
              </Paper>
            </Grid>{' '}
            <Grid item md={8}>
              <Grid
                container
                spacing={1}
                direction='row'
                justifyContent='space-evenly'
                alignItems='center'
                style={{ fontWeight: 'bold', height: '100%' }}
              >
                <span style={{ color: '#ff944d' }}>Index : </span>
                <span style={{ color: '#00ff00' }}>P : Present</span>
                <span style={{ color: 'red' }}>A : Absent </span>
                <span style={{ color: '#800080' }}> L : Late </span>
                <span style={{ color: '#4747d1' }}> HD : Half Day</span>
                <span style={{ color: '#81c3b4' }}> H : Holiday </span>
                <span style={{ color: 'rgb(118 94 111)' }}> NA : Not Available </span>
              </Grid>
            </Grid>
          </Grid>

          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
              aria-label='enhanced table'
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data?.length}
                data={data}
              />
              {loading ? (
                <Loader />
              ) : (
                <TableBody>
                  {data
                    ?.filter(
                      (item) =>
                        item?.name?.toLowerCase()?.includes(seachedData?.toLowerCase()) ||
                        item?.erp_id?.includes(seachedData) ||
                        item?.contact?.includes(seachedData)
                    )
                    .map((value, i) => {
                      return (
                        <>
                          <TableRow role='checkbox' tabIndex={-1} key={value.name}>
                            <TableCell
                              className='sticky-col first-col'
                              component='th'
                              scope='row'
                              padding='none'
                            >
                              {i + 1}.
                            </TableCell>
                            <TableCell className='sticky-col second-col' align='right'>
                              {value?.erp_id}
                            </TableCell>
                            <TableCell className='sticky-col third-col' align='right'>
                              {value?.name}
                            </TableCell>
                            <TableCell align='right'>
                              {value?.section_mapping__acad_session__branch__branch_name
                                ? value?.section_mapping__acad_session__branch__branch_name
                                : '-'}
                            </TableCell>
                            <TableCell align='right'>
                              {value?.section_mapping__grade__grade_name
                                ? value?.section_mapping__grade__grade_name
                                : '-'}
                            </TableCell>
                            <TableCell align='right'>
                              {value?.section_mapping__section__section_name
                                ? value?.section_mapping__section__section_name
                                : '-'}
                            </TableCell>
                            <TableCell align='right'>{value?.roles__role_name}</TableCell>
                            {/* <TableCell align='right'>{value?.contact}</TableCell> */}
                            {value?.attendance?.map((item, index) => {
                              return (
                                <TableCell
                                  className='th-sticky-header'
                                  key={`att_${index}`}
                                  align='center'
                                  style={{
                                    color: getStatusCol(item?.attendence_status),
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {item?.attendence_status === 'NA'
                                    ? 'NA'
                                    : item?.attendence_status === 'halfday'
                                    ? 'HD'
                                    : item?.attendence_status.substr(0, 1).toUpperCase()}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </>
                      );
                    })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </Layout>
  );
}
