import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles ,useTheme } from '@material-ui/core/styles';
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

import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'


import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from "@material-ui/core/useMediaQuery";


import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { setValueAndLabel } from 'utility-functions';
import StudentIdCardDetails from 'containers/student-Id-Card/studentIdCardDetail';
import StudentAttendance from 'containers/online-class/student-attendance/StudentAttendance';
import { Select } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';



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
  { id: 'Sno', numeric: true, disablePadding: true, label: 'Sno' },
  { id: 'Staff Name', numeric: false, disablePadding: false, label: 'Staff Name' },
  { id: 'Role', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'Contact Number', numeric: false, disablePadding: false, label: 'Contact Number' },


];


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, data } = props;
  // const [date,setDate]=React.useState([]);
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  



  return (

    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            style={{ backgroundColor: "LightGray" }}

            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              className={classes.fontColorHeadCell}

            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {data?.[0]?.attendance.map((headCell) => (
          <TableCell

          style={{ backgroundColor: "LightGray" }}
          >
            <TableSortLabel

              className={classes.fontColorHeadCell}
            >
              {moment(headCell?.date, "YYYY-MM-DD").date()} <br />
              {moment(headCell?.date, "YYYY-MM-DD").format('ddd')}

            </TableSortLabel>
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
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (<>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

        </Typography>
      </>)}


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
}));

export default function TeacherAttendanceVerify() {
  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Erp_id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [checked, setChecked] = React.useState(true);
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedMultipleRoles, setSelectedMultipleRoles] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [academicYearDropdown, setAcademicYearDropdown] = React.useState([]);


 

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [data, setData] = React.useState([]);
 
  var studentAttendanceData=[];
  data.map((item)=>
    studentAttendanceData.push({erp_id:item.erp_id,name:item.name,contact:item.contact,roles__role_name:item.roles__role_name}),
  )
  for(var i=0;i<=data?.length;i++){
    for(var j=0;j<=data[i]?.attendance?.length;j++){
      
      
      var dateSplit = data[i]?.attendance[j]?.date?.split('-')
      var a = '-'
      if (data[i]?.attendance[j]?.attendence_status === 'present') a = 'P'
      else if (data[i]?.attendance[j]?.attendence_status === 'absent') a = 'A'
      else if (data[i]?.attendance[j]?.attendence_status === 'halfday') a = 'HD'
      else if (data[i]?.attendance[j]?.attendence_status === 'late') a = 'L'
      else if (data[i]?.attendance[j]?.attendence_status === 'holiday') a = 'H'

      studentAttendanceData[i][data[i]?.attendance[j]?.date]  = a
    }
    
  }

  // const mapping = () => {
  //   data.map((values, index) => {
  //     values.attendance.map((valued, indexing) => {
  //       console.log(valued?.attendence_status, "valued")
  //       setValued(valued?.attendence_status)
  //     })
  //   })
  // }
  // useEffect(() => {
  //   mapping();
  // }, [])
  const [rolesId, setRolesId] = React.useState();

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('2021');
  const [open, setOpen] = React.useState(false);



  const [filterData, setFilterData] = React.useState({
    branch: '',
    year: '',
  });
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const handleChanges = (event) => {
    console.log(event, "event");
    setMonth(event.target.value);
  };
  const handleYear = (event) => {
    setYear(event.target.value);
  };
  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        console.log(result, "idofrole")
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



  const handleMultipleRoles = (event, value) => {
    if (value?.length) {
      const ids = value.map((el) => el) || [];
      console.log("idofrole1", ids?.[ids.length - 1]?.id);
      setRolesId(ids?.[ids.length - 1]?.id);
      setSelectedMultipleRoles(ids);
    } else {
      setSelectedMultipleRoles([]);
    }
  };

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
    const result = axiosInstance.get(`${endpoints.academics.getTeacherAttendanceData}?month=${month}&year=${year}&roles=${rolesId}`)
      .then((result) => {
        if (result.status === 200) {

          setData(result?.data);
          // console.log(result?.data, "data")

        }

      }
      ).catch((error) => {
        console.log(error)
      })
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


  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
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
      case "present":
        return "green"
      case "absent":
        return "red"
      case "late":
        return "#800080"
      case "halfday":
        return "#4747d1"
      case "holiday":
        return "#ffff00"
      case "NA":
        return "black"
    }
  }
  const exportTo = (data,fileName) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const dataX = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(dataX, fileName + fileExtension)
  }



  return (
    <Layout>
      <Grid container direction="row" style={{ paddingLeft: "22px", paddingRight: "10px" }}>
        <Grid item xs={12}>
          <Typography className={classes.title} style={{ fontWeight: 'bold' }} id="tableTitle" component="div">
            <span style={{ color: "#ff944d" }}>Attendance Report </span>( <span style={{ color: '#00ff00' }}>P:PRESENT</span>, <span style={{ color: 'red' }}>A:ABSENT </span>,<span style={{ color: '#800080' }}> L:LATE </span>,<span style={{ color: '#4747d1' }}> HD:HALF DAY </span>,<span style={{ color: '#ffff00' }}> H:Holiday Day</span>)
          </Typography>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '5px' }}>
          <Grid item xs={12} md={2} style={{ maxHeight: '5px' }}>
            <Autocomplete
              multiple
              size='small'
              onChange={handleMultipleRoles}
              value={selectedMultipleRoles}
              className='dropdownIcon'
              style={{ marginTop: '15px' }}

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

          <Grid item xs={12} md={2} style={{marginLeft:"25px"}}>
          <InputLabel htmlFor="age-native-simple">Month</InputLabel>
            <Select
              native
              value={month}
              onChange={handleChanges}
              >
              {months.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={2} style={{marginLeft:"-49px"}}>
          <InputLabel htmlFor="month-native-simple">Year</InputLabel>
              <Select
              native
              value={year}
              onChange={handleYear}
            >
              {years.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid item md={2} xs={12} sm={12} style={{    marginLeft: '-57px'}}>
            <Button onClick={getTeacherData} style={{ marginTop: '10px', backgroundColor: '#e65c00' }} variant="contained">
              Search
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '35px' }}>
          <Grid item xs={12} md={2}>
          {/* <exportToCSV data={studentAttendanceData} fileName="attendance" /> */}
          <Button variant="contained" style={{  backgroundColor: '#e65c00' }} 
          onClick={() => exportTo(studentAttendanceData, "attendance")}>

             Download excel file
             </Button>
            
          </Grid>
        </Grid>

      </Grid>


      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer style={{ marginBottom: "5px" }}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}

              onRequestSort={handleRequestSort}
              rowCount={data?.length}
              data={data}
            />
            <TableBody>
              {data.map((value, i) => {
               
               return (<>
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={value.name}

                  >

                    <TableCell component="th" scope="row" padding="none" >
                      {i + 1}
                    </TableCell>
                    <TableCell align="right" >{value?.name}</TableCell>
                    <TableCell align="right" >{value?.roles__role_name}</TableCell>
                    <TableCell align="right" >{value?.contact}</TableCell>
                    {
                      value?.attendance?.map((item, index) => {
                        return <TableCell key={`att_${index}`} align="center" style={{ color: getStatusCol(item?.attendence_status) }}>{item?.attendence_status === "NA" ? 'NA' : item?.attendence_status === 'halfday'?'HD' :item?.attendence_status.substr(0, 1).toUpperCase()}</TableCell>
                      })
                    }



                </TableRow>
                </>);

              })
              }

            </TableBody>
          </Table>
        </TableContainer>

      
      </Paper>

    </Layout>
  );
}
