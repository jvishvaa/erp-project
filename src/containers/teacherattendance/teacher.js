import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import './teacherattendance.css';
import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import TeacherAttendanceStatus from './teacherAttendanceStatus';
import { connect, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import MomentUtils from '@date-io/moment';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'ERP ID', numeric: true, disablePadding: true, label: 'ERP ID' },
  { id: 'Name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'Designation', numeric: false, disablePadding: false, label: 'Designation' },
  { id: 'Attendance', numeric: false, disablePadding: false, label: 'Attendance' },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead align='left' stickyHeader>
      <TableRow>
      <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
          S. No.
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
          ERP Id
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeaderalign='left'>
          Name
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader align='left'>
          Role
        </TableCell>

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
  // root: {
  //   paddingLeft: theme.spacing(2),
  //   paddingRight: theme.spacing(1),
  // },
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

    // marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: 750,
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
  mobileTable: {
    marginTop: '26px',
    //  overflow:'hidden',
  },
}));

export default function TeacherAttendance(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [loading, setLoading] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [checked, setChecked] = React.useState(true);
  // const [data, setData] = React.useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedMultipleRoles, setSelectedMultipleRoles] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  console.log(selectedMultipleRoles, roles, 'roles');
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [data, setData] = React.useState([]);
  const [rolesId, setRolesId] = React.useState();

  const [moduleId, setModuleId] = React.useState();
  const [branchDropdown, setBranchDropdown] = React.useState([]);
  const [dropdownData, setDropdownData] = React.useState({
    branch: [],
    grade: [],
    section: [],
  });
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

  const [filterData, setFilterData] = React.useState({
    branch: '',
    year: '',
    grade: '',
    section: '',
  });
  console.log('filterdata', filterData);
  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
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
            if (item.child_name === 'Mark Attendance') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    // handleAcademicYear('', selectedAcademicYear);
      if (moduleId && selectedAcademicYear) getBranch();
    }, [moduleId, selectedAcademicYear]);

  function getBranch(acadId) {
    let url = `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          let branches = result.data?.data?.results.map((item) => item.branch);
          setBranchList(branches);
          console.log(
            'branches',
            result.data?.data?.results.map((item) => item.branch)
          );
        }
      })
      .catch((error) => {});
  }

  const handleBranch = (event, value) => {
    if (value) {
      console.log('selected branch', value);
      setGradeList([]);
      setSelectedGrade([]);
      setSelectedGradeIds('');
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
    if (value?.length > 0) {
        value =
        value.filter(({ section_id }) => section_id === 'all').length === 1
          ? [...sectionList].filter(({ section_id }) => section_id !== 'all')
          : value;
      const sectionId = value.map((item) => item.id)
      setSectionId(sectionId);
      const selectedsecctionId = value.map((element) => element?.section_id)
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
            const selectAllObject ={
              session_year:{},
              id:'all',
              section_id:'all',
              section__section_name: 'Select All',
              section_name: 'Select All'
            }
            const data =[selectAllObject, ...result?.data?.data];
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

  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.role_name));
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

  // const handleMultipleRoles = (event, value) => {
  //   if (value?.length) {
  //     const ids = value.map((el) => el) || [];
  //     console.log("idofrole1", ids?.[ids.length - 1]?.id);
  //     setRolesId(ids?.[ids.length - 1]?.id);
  //     setSelectedMultipleRoles(ids);
  //   } else {
  //     setSelectedMultipleRoles([]);
  //   }
  // };

  const getTeacherData = () => {
    setData([]);
    if (!selectedBranchIds || !selectedGradeIds || !rolesId) {
      console.log('jj', selectedBranchIds, selectedGradeIds);
      setAlert('error', 'Select all required field');
      return false;
    } else {
      setLoading(true);
      const result = axiosInstance
        .get(
          `${endpoints.academics.teacherAttendanceData}?branch_id=${selectedBranchIds}&grade_id=${selectedGradeIds}&section_id=${selectedSectionIds}&session_year=${selectedAcademicYear?.id}&roles=${rolesId}&date=${startDate}`
        )
        .then((result) => {
          if (result.status === 200) {
            setData(result?.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMultipleRoles = (event, value) => {
    if (value) {
      setRolesId(value?.id);
    } else {
      setRolesId('');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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
        <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' variant='h6'>
              Attendance
            </Typography>
            <Typography color='textPrimary'>Mark Attendance</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid container spacing={1}>
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
              getOptionLabel={(option) => option?.role_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  label='Role'
                  placeholder='Role'
                  required
                />
              )}
            />
          </Grid>
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
              size='small'
              multiple
              limitTags={1}
              options={sectionList || []}
              onChange={handleSection}
              value={selectedSection || []}
              getOptionLabel={(option) => option?.section__section_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label='Section' variant='outlined' />
              )}
            />
          </Grid>

          <Grid item md={1} xs={12}>
            <Button onClick={getTeacherData} variant='contained' color='primary'>
              Search
            </Button>
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
              />
              {loading ? (
                <Loader />
              ) : (
                <TableBody>
                  {
                    data.map((value, i) => {
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
                            {i+1}
                          </TableCell>
                          <TableCell align='left' style={{ width: '1px' }}>
                            {value?.erp_id}
                          </TableCell>
                          <TableCell align='left' style={{ width: '1px' }}>
                            {value?.name}
                          </TableCell>
                          <TableCell align='left' style={{ width: '1px' }}>
                            {value?.roles__role_name}
                          </TableCell>

                          <TableCell align='right'>
                            <TeacherAttendanceStatus
                              user_id={value?.id}
                              start_date={startDate}
                              attendence_status={value?.attendence_status}
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
    </Layout>
  );
}
