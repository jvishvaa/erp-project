import React, { useContext, useEffect, useState } from 'react';
import DisplayBox from './displayBox.jsx';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../../config/axios';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { UserConsumer } from '../tableContext/userContext';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import '../timetable.scss';
const useStyles = makeStyles(() => ({
  formTextFields: {
    margin: '8px',
  },
  multilineColor: {
    background: 'white',
    color: '#014B7E',
  },
  boxStyle: {
    margin: '0px',
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Calander = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  // const [dataCalander, setDataCalander] = useState(props.tableData);
  const { setAlert } = useContext(AlertNotificationContext);
  const [DataMonday, setDataMonday] = useState(0);
  const [DataTuesday, setDataTuesday] = useState(0);
  const [DataWednesday, setDataWednesday] = useState(0);
  const [DataThursday, setDataThursday] = useState(0);
  const [loopMax, setLoopMax] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [DataFriday, setDataFriday] = useState(0);
  const [DataSaturday, setDataSaturday] = useState(0);
  const [DataSunday, setDataSunday] = useState(0);
  const [SelectData, setSelectData] = useState();
  const [selectClick, setSelectClick] = useState(false);
  // const [newPeriod, setAddPeriod] = useState(props.openNewPeriod || false);
  // console.log(props.openNewPeriod,'calander add period')
  const [lengthMonday, setLengthMonday] = useState();
  const [lengthTuesday, setLengthTuesday] = useState();
  const [lengthWednesday, setLengthWednesday] = useState();
  const [lengthThursday, setLengthThursday] = useState();
  const [lengthFriday, setLengthFriday] = useState();
  const [subject, setSubject] = useState();
  const [sectionIdOption, setSectionIdOption] = useState(null);
  const [maxLength, setMaxLength] = useState();
  const [assignedTeacher, setAssignedTeacher] = useState();
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [requiredMaterial, setRequiredMaterial] = useState();
  const [periodName, setPeriodName] = useState();
  const [periodDescription, setPeriodDescription] = useState();
  const [days, setDays] = useState(['Monday']);
  const [startTime, setStartTime] = useState(new Date('2014-08-18T00:00:00'));
  const [acadamicYearID, setAcadamicYear] = useState();
  // const [dayName, setDayName] = useState('Monday');
  const [endTime, setEndTime] = useState(new Date('2014-08-18T00:00:00'));
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateStartTimeChange = (time) => {
    // let dataTime = time.toString().slice(16, 21)
    setStartTime(time);
  };
  const handleDateEndTimeChange = (time) => {
    // let dataTime = time.toString().slice(16, 21)
    setEndTime(time);
  };

  const borderStyle = {
    border: 'border: 2px solid #ff6b6b;',
  };
  const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    style: { height: '3rem', color: '#014b7e', display: 'flex' },
    borderColor: 'text.primary',
  };
  useEffect(() => {
    OpenCalanderWeek();
    callingSubjectAPI();
    callingTeachersAPI();
    handleContextData();
  }, [props.tableData]);
  const handleContextData = () => (
    <UserConsumer>{({ ids }) => setAcadamicYear(ids)}</UserConsumer>
  );

  const handleChangeData = (data) => {
    setSelectData(data);
    setSelectClick(!selectClick);
  };
  const handleCloseNewPeriod = () => {
    // setAddPeriod(false);
    props.handlePassCloseNewPeriod();
  };
  // const handleOpenNewPeriod = () => {
  //   setAddPeriod(true);
  // };
  const callingSubjectAPI = () => {
    axiosInstance
      .get('/erp_user/subjects-list/', {
        params: {
          grade: props.grade_ID,
        },
      })
      .then((res) => {
        setSubject(res.data.data.results);
      })
      .catch((error) => {
        setAlert('error', "can't fetch subjects");
      });
  };
  const callingTeachersAPI = () => {
    axiosInstance
      .get('/academic/teachers-list/', {
        params: {
          grade: props.grade_ID,
        },
      })
      .then((res) => {
        setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch teachers list");
      });
  };
  const createPeriodAPI = () => {
    if (sectionIdOption === null) {
      setAlert('', 'Please Add Subjects');
    } else {
      let obj = {
        academic_year: props.acadamicYear_ID,
        section: props.section_ID,
        branch: props.branch_ID,
        grade: props.grade_ID,
        subject: sectionIdOption,
        assigned_teacher: assignedTeacherID,
        // days: day,
        days: days,
        period_name: periodName,
        period_description: periodDescription,
        period_start_time: startTime.toString().slice(16, 21),
        period_end_time: endTime.toString().slice(16, 21),
        required_material: requiredMaterial,
      };
      axiosInstance
        .post('/academic/assign_multiple_class_periods/', obj)
        .then((response) => {
          if (response.status === 200) {
            setAlert('success', 'Period Added');
            handleCloseNewPeriod();
            props.callGetAPI();
          }
        })
        .catch((error) => {
          setAlert('error', 'please fill all fields or change time range');
        });
    }
  };
  const handleChangeMultipleDays = (event) => {
    setDays(event.target.value);
    console.log(days,'selected days')
  };
  const OpenCalanderWeek = () => {
    setDataMonday(props.tableData.Monday);
    setDataTuesday(props.tableData.Tuesday);
    setDataWednesday(props.tableData.Wednesday);
    setDataThursday(props.tableData.Thursday);
    setDataFriday(props.tableData.Friday);
    setDataSunday(props.tableData.Sunday);
    setDataSaturday(props.tableData.Saturday);
    // while (1) {
    //   if (props.tableData.Monday) [counterLength];
    // // }
    // if (DataMonday) {
    //   let lengthData = DataMonday.length;
    //   if (lengthData > 6) {
    //     setLengthMonday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // if (DataTuesday) {
    //   let lengthData = DataTuesday.length;
    //   if (lengthData > 6) {
    //     setLengthTuesday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // if (DataWednesday) {
    //   let lengthData = DataWednesday.length;
    //   if (lengthData > 6) {
    //     setLengthWednesday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // if (DataThursday) {
    //   let lengthData = DataTuesday.length;
    //   if (lengthData > 6) {
    //     setLengthThursday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // if (DataFriday) {
    //   let lengthData = DataFriday.length;
    //   if (lengthData > 6) {
    //     setLengthFriday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // // if(monday)
    // let arrayLength = [
    //   lengthMonday,
    //   lengthTuesday,
    //   lengthWednesday,
    //   lengthThursday,
    //   lengthFriday,
    // ];
    // let sortedArray = arrayLength.sort();
    // setMaxLength(lengthMonday);
    // console.log(sortedArray, 'sorted array');
    // console.log(maxLength, 'max length');
    // let mappingArray = Array.from(Array(maxLength).keys());
    // if (maxLength > 6) {
    //   setLoopMax(mappingArray);
    // }
  };
  // const handleChangeDay = (e) => {
  //   // setDayName(e.target.value);
  //   setDay(e.target.value);
  // };
  const handleChangeDisplayView = () => {
    setSelectClick(false);
  };

  return (
    <>
     
      {/* <Dialog
        open={props.openNewPeriod}
        onClose={handleCloseNewPeriod}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='add-new-dialog-title'>{'Add New Period'}</DialogTitle>
        <div className='dialog-data-container'>
          <div className={classes.formTextFields}>
            <Autocomplete
              id='combo-box-demo'
              options={subject}
              getOptionLabel={(option) => option?.subject_name}
              style={{ width: 250 }}
              onChange={(event, option) => setSectionIdOption(option?.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Subject'
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className={classes.formTextFields}>
            <Autocomplete
              id='combo-box-demo'
              options={assignedTeacher}
              getOptionLabel={(option) => option?.name}
              style={{ width: 250 }}
              onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Assigned Teacher'
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className={classes.formTextFields}>
            <TextField
              label='Required materials'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setRequiredMaterial(e.target.value)}
            />
          </div>
          <div className={classes.formTextFields}>
            <TextField
              label='Period Name'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setPeriodName(e.target.value)}
            />
          </div>
          <div className={classes.formTextFields}>
            <TextField
              label='Period Description'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setPeriodDescription(e.target.value)}
            />
          </div>

          <FormControl
            variant='outlined'
            size='small'
            id='select-day'
            className={classes.formTextFields}
          >
            <InputLabel id='demo-mutiple-chip-label'>Day</InputLabel>
         
            <Select
              labelId='demo-mutiple-chip-label'
              id='demo-mutiple-chip'
              variant='outlined'
              multiple
              value={days}
              onChange={handleChangeMultipleDays}
              input={<Input id='select-multiple-chip' />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {dayNames.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(dayNames, days, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className={classes.formTextFields} style={{ width: '43%' }}>
            <MuiPickersUtilsProvider variant='outlined' fullWidth utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin='normal'
                id='time-picker'
                variant='outlined'
                label='Start Time'
                fullWidth
                ampm={false}
                helperText='24-hour format'
                value={startTime}
                onChange={handleDateStartTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.formTextFields} style={{ width: '43%' }}>
        
            <MuiPickersUtilsProvider variant='outlined' fullWidth utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin='normal'
                id='time-picker'
                variant='outlined'
                label='End Time'
                fullWidth
                ampm={false}
                helperText='24-hour format'
                value={endTime}
                onChange={handleDateEndTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <DialogActions>
          <Button onClick={handleCloseNewPeriod} color='primary'>
            Close
          </Button>
          <Button onClick={createPeriodAPI} color='primary' autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog> */}
      <div className='calander-container-time-table-module'>
        <div className='calander-week-time-table-module'>
          <table>
            <tr>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Sunday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Monday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Tuesday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Wednesday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Thursday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
                  className={classes.boxStyle}
                >
                  <div className='header'>Friday</div>
                </Box>
              </th>
              <th>
                <Box
                  justifyContent='center'
                  className={classes.boxStyle}
                  alignItems='center'
                >
                  <div className='header'>Saturday</div>
                </Box>
              </th>
            </tr>

            {loopMax.map((data, index) => (
              <tr key={data}>
                {index < DataSunday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataSunday[index]);
                    }}
                  >
                    <h4>{DataSunday[index].period_name}</h4>
                    <h3>{DataSunday[index].subject_details?.subject_name}</h3>
                    <p>
                      {DataSunday[index].period_start_time.slice(0, 5)}-
                      {DataSunday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataSunday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
                {index < DataMonday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataMonday[index]);
                    }}
                  >
                    <h4>{DataMonday[index].period_name}</h4>
                    <h3>{DataMonday[index].subject_details?.subject_name}</h3>
                    <p>
                      {DataMonday[index].period_start_time.slice(0, 5)}-
                      {DataMonday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataMonday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}

                {index < DataTuesday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataTuesday[index]);
                    }}
                  >
                    <h4>{DataTuesday[index].period_name}</h4>
                    <h3>{DataTuesday[index].subject_details?.subject_name}</h3>{' '}
                    <p>
                      {DataTuesday[index].period_start_time.slice(0, 5)}-
                      {DataTuesday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataTuesday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
                {index < DataWednesday?.length ? (
                  <td
                    style={selectClick ? { borderStyle } : {}}
                    onClick={() => {
                      handleChangeData(DataWednesday[index]);
                    }}
                  >
                    <h4>{DataWednesday[index].period_name}</h4>
                    <h3>{DataWednesday[index].subject_details?.subject_name}</h3>{' '}
                    <p>
                      {DataWednesday[index].period_start_time.slice(0, 5)}-
                      {DataWednesday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataWednesday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
                {index < DataThursday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataThursday[index]);
                    }}
                  >
                    <h4>{DataThursday[index].period_name}</h4>
                    <h3>{DataThursday[index].subject_details?.subject_name}</h3>{' '}
                    <p>
                      {DataThursday[index].period_start_time.slice(0, 5)}-
                      {DataThursday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataThursday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
                {index < DataFriday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataFriday[index]);
                    }}
                  >
                    <h4>{DataFriday[index]?.period_name}</h4>
                    <h3>{DataFriday[index]?.subject_details?.subject_name}</h3>
                    <p>
                      {DataFriday[index].period_start_time.slice(0, 5)}-
                      {DataFriday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataFriday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
                {index < DataSaturday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataSaturday[index]);
                    }}
                  >
                    <h4>{DataSaturday[index].period_name}</h4>
                    <h3>{DataSaturday[index].subject_details?.subject_name}</h3>
                    <p>
                      {DataSaturday[index].period_start_time.slice(0, 5)}-
                      {DataSaturday[index].period_end_time.slice(0, 5)}
                    </p>
                    <h4>{DataSaturday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
              </tr>
            ))}
          </table>
        </div>
        <div className='display-container-time-table-module'>
          {selectClick ? (
            <DisplayBox
              subject={subject}
              assignedTeacher={assignedTeacher}
              handleChangeDisplayView={handleChangeDisplayView}
              teacherView={props.teacherView}
              callGetAPI={props.callGetAPI}
              dataOpenChange={SelectData}
            />
          ) : (
            <div className='message'>Select card to view further details</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calander;
