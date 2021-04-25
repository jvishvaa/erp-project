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
  const [loopMax, setLoopMax] = useState(props?.loopMax || [0, 1, 2, 3, 4, 5, 6]);
  const [DataFriday, setDataFriday] = useState(0);
  const [DataSaturday, setDataSaturday] = useState(0);
  const [DataSunday, setDataSunday] = useState(0);
  const [SelectData, setSelectData] = useState();
  const [selectClick, setSelectClick] = useState(false);
  const [subject, setSubject] = useState();

  const [assignedTeacher, setAssignedTeacher] = useState();
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
    console.log(props.loopMax, 'change digits');
    setLoopMax(props.loopMax);
  }, [props.tableData, props.loopMax]);
  const handleChangeData = (data) => {
    setSelectData(data);
    setSelectClick(!selectClick);
  };
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
  

  const OpenCalanderWeek = () => {
    setDataMonday(props.tableData.Monday);
    setDataTuesday(props.tableData.Tuesday);
    setDataWednesday(props.tableData.Wednesday);
    setDataThursday(props.tableData.Thursday);
    setDataFriday(props.tableData.Friday);
    setDataSunday(props.tableData.Sunday);
    setDataSaturday(props.tableData.Saturday);
  };

  const handleChangeDisplayView = () => {
    setSelectClick(false);
  };

  return (
    <>
     
      
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
