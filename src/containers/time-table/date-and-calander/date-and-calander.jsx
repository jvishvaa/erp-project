import React, { useState, useEffect, useContext } from 'react';
import Divider from '@material-ui/core/Divider';
import Calander from './calander.jsx';
import Daily from './daily.jsx';
import '../timetable.scss';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import moment from 'moment';
import MyCalendar from './monthly';
import Loader from 'components/loader/loader.jsx';
import TimeTableDialog from './timeTableDialog.js';
import {
  createTimeTable,
  getTTList,
  getTimeTable,
  editTimeTable,
  deleteTimeTable,
  collidingPeriod,
} from './apis';
import EditPeriodDialog from './editPeriodDialog';
import ConfirmPopOver from '../ConfirmPopOver.js';
    import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// import NewTimeTable from 'components/newTimeTable.js';

import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';

import {
  TextField,
  Button,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TableViews from './TableViews';
import NoFilterData from 'components/noFilteredData/noFilterData.js';

const useStyles = makeStyles((theme) => ({
  formTextFields: {
    margin: '15px',
  },
  filter: {
    color: theme.palette.secondary.main,
    fontSize: '11px',
    fontWeight: 600,
    marginRight: '4px',
    cursor: 'pointer',
  },
  addtimetablebtn: {
    backgroundColor:  `${theme.palette.v2Color2.primaryV2} !important`,
    marginTop: '5px',
    marginLeft: '12%',
    '&:hover': {
      backgroundColor:  `${theme.palette.v2Color2.primaryV2} !important`,
    },
  },
  addperiodbutton: {
    marginLeft: '76%',
    color: 'white',
  },
  publishDraft: {
    display: 'flex',
    justifyContent: 'end',
    padding: '0 25px 0 0',
  },
  datepicker: {
    '& .MuiInputBase-input': {
      // color: theme.palette.secondary.main,
      padding: "10px",
    }

  },
  
}));
const DateAndCalander = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [timeTableEvents, setTimeTableEvents] = useState();
  const [newTable, setnewTable] = useState(false);
  const [TimeTableList, setTimeTableList] = useState([]);
  const [TimeTableName, setTimeTableName] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState();
  const [addPeriodButton, setShowAddPeriodButton] = useState(false);
  const [ttId, setttId] = useState();
  const [gradeID, setGradeID] = useState(props.grade_ID);
  const [periodDetails, setPeriodDetails] = useState();
  const [isperiodDetail, setIsPeriodDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStartTime, setselectedStartTime] = useState(new Date('0'));
  const [selectedEndTime, setselectedEndTime] = useState(new Date('0'));
  const [openModal, setOpenModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState();
  const [showTableView, setShowTableView] = useState(true);
  const [collidingIDs,setCollidingIDs] = useState()
  const [isTTCollided,setIsTTCollided] = useState(false)
  const [collidingMsg,setCollidingMsg] = useState()
  const [isEdit,setIsEdit] = useState(false)
  const [selectedItem , setSelectedItem] = useState()
  const { user_level,is_superuser } = JSON.parse(localStorage.getItem('userDetails'));





  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  const ResponseConverter = (ResponseEvents) => {
    let tempArray = [];
    var curr = new Date();
    var firstDateOfWeek = curr.getDate() - curr.getDay();
    ResponseEvents.forEach((item, index) => {
      var currDate = new Date();
      let setColor =
        item?.period_type === 1
          ? 'paleyellow'
          : item?.period_type === 2
          ? 'tomato'
          : item?.period_type === 3
          ? 'green'
          : item?.period_type === 5
          ? '#956dbf'
          : '#d2d86e';
      let setDate =
        item?.day === 0
          ? firstDateOfWeek + 1
          : item?.day === 1
          ? firstDateOfWeek + 2
          : item?.day === 2
          ? firstDateOfWeek + 3
          : item?.day === 3
          ? firstDateOfWeek + 4
          : item?.day === 4
          ? firstDateOfWeek + 5
          : item?.day === 5
          ? firstDateOfWeek + 6
          : firstDateOfWeek;
      let setConvertDate = convert(currDate.setDate(setDate));
      let pType = item?.period_type_name === "Examination"? 'Exam': item?.period_type_name
      let subName = item?.subject_name
      let title = (item?.period_type === 3 || item?.period_type === 2) ? subName ? `${pType} : ${subName}` : `${pType}` : item?.period_type_name
      let tempObj = {
        title: title == "Break" ? title  : title +" "+ "(" + item?.teacher_name + ")",
        start: setConvertDate + 'T' + item?.start_time,
        end: setConvertDate + 'T' + item?.end_time,
        extendedProps: item,
        color: setColor,
      };
      tempArray.push(tempObj);
    });
    setTimeTableEvents(tempArray);
  };

  const createNewTable = () => {
    setShowTable(false);
    props.HideAutocomplete(false)
    setnewTable(true);
    setTimeTableName('');
    setselectedStartTime(new Date('0'));
    setselectedEndTime(new Date('0'));
    handleStartDateChange(new Date());
    handleEndDateChange(new Date());
  };

  const ttList = async (id) => {
    try {
      const data = await getTTList(id);
      setTimeTableList(data?.result);
      setLoading(false)
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setLoading(true)
      ttList(props.section_mappingId);
  }, [props.section_mappingId,showTableView]);

  useEffect(() => {
    if (props.getTTFlag) {
      getTT(ttId);
    }
  }, [props.getTTFlag]);


  const handleCancel = () => {
    setnewTable(false);
  };
  // const handleClear = () => {
  //   setTimeTableName(null);
  //   setselectedStartTime(new Date('0'));
  //   setselectedEndTime(new Date('0'));
  //   handleStartDateChange(new Date());
  //   handleEndDateChange(new Date());
  // }

  const handleOpenNewPeriod = () => {
    props.handlePassOpenNewPeriod();
  };

  const getTT = async (id) => {
    const data = await getTimeTable(id);
    // setAlert('error', 'Please Change School Ending Time or Starting Time');
    setttId(id);
    props.ttId(id);
    props.setGetTTFlag(false);
    setShowTable(true);
    props.HideAutocomplete(true)
    setShowAddPeriodButton(true);
    if (data?.result?.length) ResponseConverter(data?.result);
    else setTimeTableEvents([]);
  };
  const handleTimeTable = (e, value, view) => {
    setSelectedTable(value);
    if (!value) {
      setShowTable(false);
      props.HideAutocomplete(false)
      setShowAddPeriodButton(false);
      return;
    }
    if (view === 'tableview') {
      setShowTableView(false);
    }
    setTimeTableName(value?.ttname);
    handleStartDateChange(value?.start_date);
    handleEndDateChange(value?.end_date);
    getTT(value?.id);
    setselectedStartTime(value?.school_start_time);
    setselectedEndTime(value?.school_end_time);
  };

  const createTT = async (payload) => {
    let data = await createTimeTable(payload);
    if(data?.status_code === 200){
      const list = await getTTList(props?.section_mappingId);
      setTimeTableList(list?.result);
        list.result.forEach(item => {
          if(item?.id === data?.result?.id) {
              handleTimeTable('',item)
          }
        })
        setLoading(false)
        setShowTable(true);
        props.HideAutocomplete(true)
        setShowAddPeriodButton(true);
      setAlert('success', 'TimeTable created successfully');
      console.log('Time Table Created SuccessFully', data);
    }else{
      setLoading(false)
      setAlert('warning', data?.response?.data?.developer_msg);
    }
    
  };

  const handlesetPeriodDetails = (data) => {
    setIsPeriodDetails(true);
    setPeriodDetails(data?.event?.extendedProps);
  };

  const handleperiodclose = () => {
    setIsPeriodDetails(false);
    getTT(ttId);
  };

  const handleSubmit = () => {
    let start_date = `${moment(selectedStartDate).format('YYYY-MM-DD')}`
    let end_date = `${moment(selectedEndDate).format('YYYY-MM-DD')}`
    let start_time = `${moment(selectedStartTime).format('HH:mm:00')}`
    let end_time = `${moment(selectedEndTime).format('HH:mm:00')}`
    if (!TimeTableName) {
      setAlert('error', 'Please Add Time Table Name');
      return false;
    } else if (!selectedStartDate) {
      setAlert('error', 'Please Select Time Table Start Date');
      return false;
    } else if (!selectedEndDate) {
      setAlert('error', 'Please Select selected End Date');
      return false;
    } else if (!selectedStartTime) {
      setAlert('error', 'Please Select School Starting Time');
      return false;
    } else if (!selectedEndTime) {
      setAlert('error', 'Please Select School Ending Time');
      return false;
    } else if(!props?.grade_Name){
      setAlert('error','Please Select Grade');
      return false;
    } else if (start_date === end_date) {
      setAlert('error', 'Please Change School Ending Date or Starting Date');
      return false;
    } else if (start_time === end_time) {
      setAlert('error', 'Please Change School Ending Time or Starting Time');
      return false;
    }
    
    let payload = {
      ttname: TimeTableName,
      start_date: start_date,
      end_date: end_date,
      school_start_time: start_time,
      school_end_time: end_time,
      section_mapping_id: props.section_mappingId,
    };
    // setselectedEndTime(`${moment(selectedEndTime).format('HH:mm:00')}`);
    // setselectedStartTime(`${moment(selectedStartTime).format('HH:mm:00')}`);
    setLoading(true)
    handleTimeTable('', null);
    setnewTable(false);
    setTimeTableEvents([]);
    createTT(payload);
    setShowTableView(false)
  };

  const calendarBtnHideFix = () => {
    setTimeout(() => {
      document
        .querySelectorAll('.MuiPickersModal-dialogRoot .MuiDialogActions-root button')
        .forEach((elem) => {
          elem.classList.remove('MuiButton-textPrimary');
          elem.classList.add('MuiButton-containedPrimary');
        });
    }, 1000);
  };

  const submitResult = async () => {
    if (confirmMessage === 'active') {
      let payload = {
        is_active: true,
      };
      let data = await editTimeTable(selectedTable?.id, payload);
      if (data.status_code === 200) {
        setAlert('success', data.message);
        ttList(props.section_mappingId);

      } else {
        setAlert('warning', data?.response?.data?.developer_msg);
      }
    }

    if (confirmMessage === 'delete') {
      let data = await deleteTimeTable(selectedTable?.id);
      if (data?.status_code === 200) {
        setAlert('success', data?.message);
        setShowTable(false);
        props.HideAutocomplete(false)
        ttList(props.section_mappingId);
        setShowAddPeriodButton(false);
        handleTimeTable('', null);
      } else {
        setAlert('warning', data?.response?.data?.developer_msg);
      }
    }
    if (confirmMessage === 'publish' || confirmMessage === 'draft') {
      let temp_status =
        confirmMessage === 'publish' ? 2 : confirmMessage === 'draft' ? 1 : 0;
      let payload = {
        status: temp_status,
      };
      let data = await editTimeTable(selectedTable?.id, payload);
      
      if (data?.status_code === 200) {
        setAlert('success', data?.message);
        setShowTable(false);
        props.HideAutocomplete(false)
        ttList(props.section_mappingId);
        setShowAddPeriodButton(false);
        handleTimeTable('', null);
      } else {
        // setAlert('warning', data?.response?.data?.developer_msg);
        setCollidingIDs(data?.response?.data?.result?.colliding_id)
        setCollidingMsg(data?.response?.data?.message)
        // console.log(data?.response?.data?.result?.colliding_id)
        setIsTTCollided(true)
      }
    }
    setShowTableView(true);
    setShowTable(false);
    props.HideAutocomplete(false)
  };

  const handleCollide = async() => {
   let payload = {
      "colliding_id" : collidingIDs
    }
let data = await collidingPeriod(payload);
    if(data?.status_code == 200){
      setAlert("success", data?.message)
    }
  }

  const handleBack = () => {
    setShowTable(false);
    props.HideAutocomplete(false)
    setShowTableView(true);
  }
  const handleOperation = (operation,value) =>{
    if(operation === "deActive"){
      setAlert("warning", "Please activate other timeTable")
      return;
    }
    if(operation === "active" && value?.status === 1){
      setAlert("warning", "Please Publish Your TimeTable First")
    } else if(operation === 'edit' && value?.status === 2){
      setAlert("warning", "Time Table is Already Published")
    }else if(operation === 'edit' && value?.status === 1){
      setIsEdit(true)
      // setSelectedItem(value)
      setSelectedTable(value);
    }else{
      setSelectedTable(value);
      setConfirmMessage(operation);
      setOpenModal(true);
    }
  }

  const handleEditTT = () => {

  }
  return (
    <>
      {showTableView && (
        <>
        {(user_level === 1 || user_level === 8 || user_level === 10 || is_superuser) && props?.teacherView && <Button
          color='primary'
          style={{marginBottom:'10px'}}
          variant='contained'
          onClick={createNewTable}
        >
          Create New Timetable
        </Button>}
        { TimeTableList?.length > 0 && <TableViews 
          TimeTableList={TimeTableList} 
          handleView={handleTimeTable} 
          handleOperation={handleOperation}
          user_level = {user_level}
          teacherView = {props?.teacherView}
          is_superuser = {is_superuser}
        />}
        </>
      )}
      {
        TimeTableList?.length === 0 && <NoFilterData data={"No Data Found"}/>
      }

    { showTableView === false && (
      <div className='table-header'>
        {/* <Grid item xs={3} sm={3} md={3}>
          <Autocomplete
            size='small'
            style={{ width: '100%', marginLeft: '10%' }}
            id='timetable'
            value={selectedTable || []}
            options={TimeTableList || []}
            getOptionLabel={(option) => option?.ttname}
            // getOptionSelected={(option, value) => option?.id == value?.id}
            onChange={handleTimeTable}
            renderInput={(params) => (
              <TextField {...params} variant='outlined' label='Time Table' />
            )}
          />
        </Grid> */}
        {/* <Grid item xs={3} sm={3} md={3}>
          <Tooltip title='Create TimeTable' placement='bottom' arrow>
            <IconButton
              size='small'
              variant='contained'
              onClick={createNewTable}
              className={classes.addtimetablebtn}
            >
              <AddIcon style={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
        </Grid> */}
        <Grid item xs={12} sm={12} md={12}>
          {props.teacherView &&
          addPeriodButton &&
          selectedTable?.status == 1 &&
          showTable ? (
            <>
            <div style={{display:'flex'}}>
             <Grid item xs={2} sm={2} md={2}>
             {/* {timeTableEvents?.length && (user_level === 1 || user_level === 8 || user_level === 10 || is_superuser) && props?.teacherView && <Button
              color='primary'
              variant='contained'
              style = {{marginLeft : '17%'}}
              onClick={() => {
                setConfirmMessage('publish');
                setOpenModal(true);
              }}
            >
              Publish
            </Button>} */}
            </Grid>
            <Grid item xs={2} sm={2} md={2} style={{marginLeft : '72%'}}>
            {(user_level === 1 || user_level === 8 || user_level === 10 || is_superuser) && props?.teacherView &&<Button
              color='primary'
              // className={classes.addperiodbutton}
              variant='contained'
              onClick={() => handleOpenNewPeriod()}
            >
              Add Period
            </Button>}
            </Grid>
           </div>
            </>
          ) : (
            <></>
          )}
        </Grid>
          <Grid item xs={3} sm={3} md={1}>
            <Button
              color='primary'
              // className={classes.addperiodbutton}
              // style={{ marginLeft: '2%' }}
              variant='contained'
              onClick={()=>handleBack()}
            >
              Back
            </Button>
          </Grid>
        </div>
      )}
      
      {/* <Divider variant='middle' className='date-week-underline' /> */}
      {newTable && (
        <Dialog
          open={newTable}
          fullWidth={true}
          maxWidth={'sm'}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>
            Create Time Table 

              </div>
              <div style={{marginRight:'15px'}}>
            <IconButton onClick={handleCancel} aria-label='close' size='large' style={{marginLeft:"72%"}}>
                <HighlightOffIcon
                  // style={{ color: 'white', backgroundColor: 'black' }}
                  fontSize='inherit'
                />
              </IconButton>

              </div>

            </div>
            </DialogTitle>
            <hr/>
          <div className='dialog-data-container'>
            <div className={classes.formTextFields}>
              <TextField
                label='TimeTable Name'
                id='outlined-size-small'
                variant='outlined'
                inputProps={{
                  autocomplete: 'off',
                }}
                size='small'
                value={TimeTableName}
                onChange={(e) => setTimeTableName(e.target.value)}
              />
            </div>
            <div className={classes.formTextFields}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6} md={6}>
                    <DatePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      inputVariant='outlined'
                      className={classes.datepicker}
                      label='Starting Date'
                      autoOk
                      value={selectedStartDate}
                      minDate={new Date()}
                      onChange={handleStartDateChange}
                      format='MM/DD/YYYY'
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <DatePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      inputVariant='outlined'
                      className={classes.datepicker}
                      label='Ending Date'
                      autoOk
                      value={selectedEndDate}
                      minDate={new Date()}
                      onChange={handleEndDateChange}
                      format='MM/DD/YYYY'
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TimePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      autoOk
                      inputVariant='outlined'
                      className={classes.datepicker}
                      format='hh:mm A'
                      label='School Start Time'
                      value={selectedStartTime}
                      onChange={setselectedStartTime}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TimePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      autoOk
                      inputVariant='outlined'
                      format='hh:mm A'
                      className={classes.datepicker}
                      label='School End Time'
                      value={selectedEndTime}
                      onChange={setselectedEndTime}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.formTextFields}>
              <TextField
                label='Grade'
                id='outlined-size-small'
                variant='outlined'
                inputProps={{
                  autocomplete: 'off',
                }}
                size='small'
                value={props?.grade_Name}
                // onChange={(e) => setTimeTableName(e.target.value)}
                disabled= {true}
              />
            </div>
          </div>
          <hr/>
          <DialogActions>
            <Button color='primary' variant='contained' onClick={createNewTable}>
              Clear
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                handleSubmit();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showTable && (
        <>
          <h2 style={{ textAlign: 'center' }}>
            {' '}
            {TimeTableName} - ({`${moment(selectedStartDate).format('MMMM D[,] YYYY')}`} -{' '}
            {`${moment(selectedEndDate).format('MMMM D[,] YYYY')}`})
          </h2>

          <MyCalendar
            defaultView={'timeGridWeek'}
            timeTableEvents={timeTableEvents}
            startSchoolTime={selectedStartTime}
            endSchoolTime={selectedEndTime}
            heading={'false'}
            eventClick={handlesetPeriodDetails}
          />
          {/* <div className={classes.publishDraft}>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                setConfirmMessage('active');
                setOpenModal(true);
              }}
            >
              Active
            </Button>
            {/* <Button
              color='primary'
              variant='contained'
              style={{ margin: '0 0 0 10px' }}
              onClick={() => {
                setConfirmMessage('draft');
                setOpenModal(true);
              }}
            >
              Draft
            </Button> 
            <Button
              color='primary'
              variant='contained'
              style={{ margin: '0 0 0 10px' }}
              onClick={() => {
                setConfirmMessage('publish');
                setOpenModal(true);
              }}
            >
              Publish
            </Button>
            <Button
              color='red'
              variant='contained'
              style={{ margin: '0 0 0 10px', backgroundColor: 'red', color: 'white' }}
              onClick={() => {
                setConfirmMessage('delete');
                setOpenModal(true);
              }}
            >
              Delete
            </Button>
          </div> */}
        </>
      )}
      {isperiodDetail && (
        <EditPeriodDialog
          isPeriodOpen={isperiodDetail}
          handleperiodclose={handleperiodclose}
          grade_ID={gradeID}
          periodDetails={periodDetails}
          section_mappingId={props.section_mappingId}
          ttId={ttId}
          selectedTableId={selectedTable?.status}
          user_level = {user_level}
          is_superuser = {is_superuser}
          teacherView={props?.teacherView}
        />
      )}

      {openModal && (
        <ConfirmPopOver
          submit={() => submitResult()}
          openModal={openModal}
          setOpenModal={setOpenModal}
          operation={confirmMessage}
        />
      )}
      {isTTCollided && (
        <ConfirmPopOver
          submit={handleCollide}
          openModal={isTTCollided}
          setOpenModal={setIsTTCollided}
          operation={"custom"}
          message = {collidingMsg}
        />
      )}
       { isEdit &&
       <TimeTableDialog
       selectedItem = {selectedTable}
       editTable = {isEdit}
       setIsEdit = {setIsEdit}
       getTTList = {ttList}
       gradeName = {props?.grade_Name}
       section_mappingId = {props.section_mappingId}  
      />}
      {loading && <Loader />}
    </> 
  );
};

export default DateAndCalander;
