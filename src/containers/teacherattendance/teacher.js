import React, { useEffect, useContext } from 'react';
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
    <TableHead stickyHeader>
      <TableRow>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader>
          ERP Id
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader>
          Name
        </TableCell>
        <TableCell style={{ backgroundColor: 'LightGray' }} stickyHeader>
          Designation
        </TableCell>
     
        <TableCell style={{ backgroundColor: 'LightGray', width: '490px' }} stickyHeader>
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
  mobileTable: {
    marginTop: '26px',
    //  overflow:'hidden',
  },
}));

export default function TeacherAttendance(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
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
  // const { setAlert } = useContext(AlertNotificationContext);
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [data, setData] = React.useState([]);
  const [rolesId, setRolesId] = React.useState();

  const [moduleId, setModuleId] = React.useState();
  const [branchDropdown, setBranchDropdown] = React.useState([]);
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
  console.log('branch', filterData.branch?.branch?.id);
  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
  };
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
      console.log('acad', filterData);
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

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Circular' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Circular') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const getTeacherData = () => {
    if (filterData.branch?.branch?.id === undefined) {
      setAlert('error', 'select branch');
      return false;
    }
    setData([]);
    const result = axiosInstance
      .get(
        `${endpoints.academics.teacherAttendanceData}?branch_id=${filterData.branch?.branch?.id}&roles=${rolesId}&date=${startDate}`
      )
      .then((result) => {
        if (result.status === 200) {
          setData(result?.data);
          console.log(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    setRolesId(value.id);
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
        style={{ paddingLeft: '22px', paddingRight: '10px' }}
      >
        <Grid item xs={12} md={2}>
          <Typography
            className={classes.title}
            style={{
              fontWeight: 'bold',
            }}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            ATTENDANCE
          </Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Autocomplete
              size='small'
              onChange={handleBranch}
              id='branch'
              style={{ marginTop: '4px' }}
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

          <Grid item xs={12} md={2}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
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
              disableClearable
              className='dropdownIcon'
              style={{ marginTop: '4px' }}
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
                />
              )}
            />
          </Grid>
          <Grid item md={2} xs={12} sm={12}>
            <Button onClick={getTeacherData} variant='contained' color='primary'>
              Search
            </Button>
          </Grid>
        </Grid>

        <TableContainer className='tableContainer'>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              onRequestSort={handleRequestSort}
              rowCount={data?.length}
            />
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
                        {value?.erp_id}
                      </TableCell>
                      <TableCell align='left' style={{ width: '1px' }}>
                        {value?.name}
                      </TableCell>
                      <TableCell align='left' style={{ width: '1px' }}>
                        {value?.roles__role_name}
                      </TableCell>
                     
                      <TableCell align='center' style={{ width: '1px' }}>
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
          </Table>
        </TableContainer>
      </Grid>
    </Layout>
  );
}
