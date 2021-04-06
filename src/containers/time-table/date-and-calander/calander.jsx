import React, { useContext, useEffect, useState } from 'react';
import DisplayBox from './displayBox.jsx';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../../config/axios';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
}));
const Calander = (props) => {
  const classes = useStyles();
  // const [dataCalander, setDataCalander] = useState(props.tableData);
  const { setAlert } = useContext(AlertNotificationContext);
  const [DataMonday, setDataMonday] = useState(0);
  const [DataTuesday, setDataTuesday] = useState(0);
  const [DataWednesday, setDataWednesday] = useState(0);
  const [DataThursday, setDataThursday] = useState(0);
  const [loopMax, setLoopMax] = useState([0, 1, 2, 3, 4]);
  const [DataFriday, setDataFriday] = useState(0);
  const [SelectData, setSelectData] = useState();
  const [selectClick, setSelectClick] = useState(false);
  const [newPeriod, setAddPeriod] = useState(false);
  const [lengthMonday, setLengthMonday] = useState();
  const [lengthTuesday, setLengthTuesday] = useState();
  const [lengthWednesday, setLengthWednesday] = useState();
  const [lengthThursday, setLengthThursday] = useState();
  const [lengthFriday, setLengthFriday] = useState();
  const [section, setSection] = useState();
  const [sectionIdOption, setSectionIdOption] = useState();
  const [maxLength, setMaxLength] = useState();
  const [assignedTeacher, setAssignedTeacher] = useState();
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [requiredMaterial, setRequiredMaterial] = useState();
  const [periodName, setPeriodName] = useState();
  const [periodDescription, setPeriodDescription] = useState();
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState();
  const [acadamicYearID, setAcadamicYear] = useState();
  const [dayName, setDayName] = useState('Monday');
  const [endTime, setEndTime] = useState();
  // const [openDialog, setOpenDialog] = useState(false);

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
    // handlePassData();
    callingSubjectAPI();
    callingTeachersAPI();
    handleContextData();
    // props.callGetAPI();
  }, [props.tableData]);
  const handleContextData = () => (
    <UserConsumer>{({ ids }) => setAcadamicYear(ids)}</UserConsumer>
  );
  console.log(props.passId, 'ids');

  const handleChangeData = (data) => {
    setSelectData(data);
    setSelectClick(!selectClick);
  };
  const handleCloseNewPeriod = () => {
    setAddPeriod(false);
  };
  const handleOpenNewPeriod = () => {
    console.log('new period');
    setAddPeriod(true);
  };
  const callingSubjectAPI = () => {
    axiosInstance
      .get('/erp_user/subjects-list/', {
        params: {
          grade: props.grade_ID,
        },
      })
      .then((res) => {
        // if (res.status === 200) {
        //   setAcadamicData(res, 'subject');
        // }
        console.log(res, 'subject');
        setSection(res.data.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(props.passId, 'sev;icsvpeplesv');
  const callingTeachersAPI = () => {
    axiosInstance
      .get('/academic/teachers-list/', {
        params: {
          grade: props.grade_ID,
        },
      })
      .then((res) => {
        console.log(res, 'teachers');
        setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createPeriodAPI = () => {
    let obj = {
      // academic_year: props.passId.academic_year_id,
      // section: props.passId.section_id,
      // branch: props.passId.section_id,
      // grade: props.passId.grade_id,
      academic_year: props.acadamicYear_ID,
      section: props.section_ID,
      branch: props.branch_ID,
      grade: props.grade_ID,
      subject: sectionIdOption,
      assigned_teacher: assignedTeacherID,
      day: day,
      period_name: periodName,
      period_description: periodDescription,
      period_start_time: startTime,
      period_end_time: endTime,
      required_material: requiredMaterial,
    };
    axiosInstance
      .post('/academic/assign_class_periods/', obj)
      .then((response) => {
        if (response.status === 200) {
          setAlert('success', 'Period Added');
          handleCloseNewPeriod();
          props.callGetAPI();
        }
      })
      .catch((error) => {
        // setAlert('error', error.data.message);
        console.log(error, 'test');
      });
  };
  const OpenCalanderWeek = () => {
    // console.log(props.tableData)
    setDataMonday(props.tableData.Monday);
    setDataTuesday(props.tableData.Tuesday);
    setDataWednesday(props.tableData.Wednesday);
    setDataThursday(props.tableData.Thursday);
    setDataFriday(props.tableData.Friday);
    console.log(props.tableData, 'calander-table-data');
    // while (1) {
    //   if (props.tableData.Monday) [counterLength];
    // // }
    // if (DataMonday) {
    //   let lengthData = DataMonday.length;
    //   if (lengthData > 0) {
    //     setLengthMonday(lengthData);
    //   }
    //   console.log(lengthData);
    // }
    // if (DataTuesday) {
    //   let lengthData = DataTuesday.length;
    //   if (lengthData > 0) setLengthTuesday(lengthData);
    //   console.log(lengthData);
    // }
    // if (DataWednesday) {
    //   let lengthData = DataWednesday.length;
    //   if (lengthData > 0) setLengthWednesday(lengthData);
    //   console.log(lengthData);
    // }
    // if (DataThursday) {
    //   let lengthData = DataTuesday.length;
    //   if (lengthData > 0) setLengthThursday(lengthData);
    //   console.log(lengthData);
    // }
    // if (DataFriday) {
    //   let lengthData = DataFriday.length;
    //   if (lengthData > 0) setLengthFriday(lengthData);
    //   console.log(lengthData);
    // }
    // console.log(
    //   lengthMonday,
    //   lengthTuesday,
    //   lengthWednesday,
    //   lengthThursday,
    //   lengthFriday
    // );
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
    // setLoopMax(mappingArray);
  };
  const handleChangeDay = (e) => {
    console.log(e, 'event');
    setDayName(e.target.value);
    setDay(e.target.value);
  };
  return (
    <>
      {props.teacherView ? (
        <div className='add-new-period-button' onClick={() => handleOpenNewPeriod()}>
          Add Period
        </div>
      ) : (
        <></>
      )}
      <Dialog
        open={newPeriod}
        onClose={handleCloseNewPeriod}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='add-new-dialog-title'>{'Add New Period'}</DialogTitle>
        <div className='dialog-data-container'>
          <div className={classes.formTextFields}>
            <Autocomplete
              id='combo-box-demo'
              options={section}
              getOptionLabel={(option) => option.subject_name}
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
              getOptionLabel={(option) => option.name}
              style={{ width: 250 }}
              onChange={(event, option) => setAssignedTeacherID(option.id)}
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
              label='Reqired materials'
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
            <InputLabel id='demo-simple-select-outlined-label'>Day</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              value={dayName}
              fullWidth
              size='small'
              onChange={(e) => handleChangeDay(e)}
              label='Day'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='Monday'>Monday</MenuItem>
              <MenuItem value='Tuesday'>Tuesday</MenuItem>
              <MenuItem value='Wednesday'>Wedneday</MenuItem>
              <MenuItem value='Thursday'>Thursday</MenuItem>
              <MenuItem value='Friday'>Friday</MenuItem>
            </Select>
          </FormControl>

          {/* <div className={classes.formTextFields}>
            <TextField
              label='Day'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setDay(e.target.value)}
            />
          </div> */}
          <div className={classes.formTextFields}>
            <TextField
              label='start Time'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className={classes.formTextFields}>
            <TextField
              label='End Time'
              id='outlined-size-small'
              variant='outlined'
              size='small'
              onChange={(e) => setEndTime(e.target.value)}
            />
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
      </Dialog>
      <div className='calander-container'>
        <div className='calander-week'>
          <table>
            <tr>
              <th>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  borderRight={1}
                  {...defaultProps}
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
                >
                  <div className='header'>Thursday</div>
                </Box>
              </th>
              <th>
                <Box justifyContent='center' alignItems='center'>
                  <div className='header'>Friday</div>
                </Box>
              </th>
            </tr>
            {loopMax.map((data, index) => (
              <tr key={data}>
                {index < DataMonday?.length ? (
                  <td
                    onClick={() => {
                      handleChangeData(DataMonday[index]);
                    }}
                  >
                    <h4>{DataMonday[index].period_name}</h4>{' '}
                    <p>
                      {DataMonday[index].period_start_time.slice(0, 5)}-
                      {DataMonday[index].period_end_time.slice(0, 5)}AM
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
                    <h4>{DataTuesday[index].period_name}</h4>{' '}
                    <p>
                      {DataTuesday[index].period_start_time.slice(0, 5)}-
                      {DataTuesday[index].period_end_time.slice(0, 5)}AM
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
                    <h4>{DataWednesday[index].period_name}</h4>{' '}
                    <p>
                      {DataWednesday[index].period_start_time.slice(0, 5)}-
                      {DataWednesday[index].period_end_time.slice(0, 5)}AM
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
                    <h4>{DataThursday[index].period_name}</h4>{' '}
                    <p>
                      {DataThursday[index].period_start_time.slice(0, 5)}-
                      {DataThursday[index].period_end_time.slice(0, 5)}.AM
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
                    <h4>{DataFriday[index].period_name}</h4>{' '}
                    <p>
                      {DataFriday[index].period_start_time.slice(0, 5)}-
                      {DataFriday[index].period_end_time.slice(0, 5)}AM
                    </p>
                    <h4>{DataFriday[index].teacher_name?.name}</h4>
                  </td>
                ) : (
                  <td>
                    <h4> </h4> <p> </p>
                    <h4> </h4>
                  </td>
                )}
              </tr>
            ))}
            {/* {props.tableData && props.tableData.map((data, index)=>{
              <tr key={data}>
              {index < DataMonday.length ? (
                <td
                  onClick={() => {
                    handleChangeData(data.Monday[index]);
                  }}
                >
                  <h4>{data.Monday[index].period_name}</h4>{' '}
                  <p>
                    {data.Monday[index].period_start_time.slice(0, 5)}-
                    {data.Monday[index].period_end_time.slice(0, 5)}AM
                  </p>
                  <h4>
                    {data.Monday[index].assigned_teacher__first_name}{' '}
                    {data.Monday[index].assigned_teacher__last_name}
                  </h4>
                </td>
              ) : (
                <td>
                  <h4> </h4> <p> </p>
                  <h4> </h4>
                </td>
              )}

              {index < DataTuesday.length ? (
                <td
                  onClick={() => {
                    handleChangeData(data.Tuesday[index]);
                  }}
                >
                  <h4>{data.Tuesday[index].period_name}</h4>{' '}
                  <p>
                    {data.Tuesday[index].period_start_time.slice(0, 5)}-
                    {data.Tuesday[index].period_end_time.slice(0, 5)}AM
                  </p>
                  <h4>
                    {data.Tuesday[index].assigned_teacher__first_name}{' '}
                    {data.Tuesday[index].assigned_teacher__last_name}
                  </h4>
                </td>
              ) : (
                <td>
                  <h4> </h4> <p> </p>
                  <h4> </h4>
                </td>
              )}
              {index < DataWednesday.length ? (
                <td
                  style={selectClick ? { borderStyle } : {}}
                  onClick={() => {
                    handleChangeData(data.Wednesday[index]);
                  }}
                >
                  <h4>{data.Wednesday[index].period_name}</h4>{' '}
                  <p>
                    {data.Wednesday[index].period_start_time.slice(0, 5)}-
                    {data.Wednesday[index].period_end_time.slice(0, 5)}AM
                  </p>
                  <h4>
                    {data.Wednesday[index].assigned_teacher__first_name}{' '}
                    {data.Wednesday[index].assigned_teacher__last_name}
                  </h4>
                </td>
              ) : (
                <td>
                  <h4> </h4> <p> </p>
                  <h4> </h4>
                </td>
              )}
              {index < DataThursday.length ? (
                <td
                  onClick={() => {
                    handleChangeData(data.Thursday[index]);
                  }}
                >
                  <h4>{data.Thursday[index].period_name}</h4>{' '}
                  <p>
                    {data.Thursday[index].period_start_time.slice(0, 5)}-
                    {data.Thursday[index].period_end_time.slice(0, 5)}.AM
                  </p>
                  <h4>
                    {data.Thursday[index].assigned_teacher__first_name}{' '}
                    {data.Thursday[index].assigned_teacher__last_name}
                  </h4>
                </td>
              ) : (
                <td>
                  <h4> </h4> <p> </p>
                  <h4> </h4>
                </td>
              )}
              {index < DataFriday.length ? (
                <td
                  onClick={() => {
                    handleChangeData(data.Friday[index]);
                  }}
                >
                  <h4>{data.Friday[index].period_name}</h4>{' '}
                  <p>
                    {data.Friday[index].period_start_time.slice(0, 5)}-
                    {data.Friday[index].period_end_time.slice(0, 5)}AM
                  </p>
                  <h4>
                    {data.Friday[index].assigned_teacher__first_name}{' '}
                    {data.Friday[index].assigned_teacher__last_name}
                  </h4>
                </td>
              ) : (
                <td>
                  <h4> </h4> <p> </p>
                  <h4> </h4>
                </td>
              )}
            </tr>
            }) }   */}
          </table>
        </div>
        <div className='display-container'>
          {selectClick ? (
            <DisplayBox
              teacherView={props.teacherView}
              callGetAPI={props.callGetAPI}
              newPeriod={newPeriod}
              handleCloseNewPeriod={handleCloseNewPeriod}
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
