import React, { useEffect, useState, useContext } from 'react';
import { Dialog, Button, DialogActions, DialogTitle, TextField ,Grid,IconButton} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {
  editTimeTable,
} from './apis';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';



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
      backgroundColor: '#EF676A',
      marginTop: '5px',
      marginLeft: '12%',
      '&:hover': {
        backgroundColor: '#EF676A',
      },
    },
    addperiodbutton: {
      marginLeft: '54%',
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


const TimeTableDialog = (props) => {
    const classes = useStyles();
    const [newTable, setnewTable] = useState(false);

    const { setAlert } = useContext(AlertNotificationContext);
  const [TimeTableName, setTimeTableName] = useState();
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [selectedStartTime, setselectedStartTime] = useState(new Date('0'));
  const [selectedEndTime, setselectedEndTime] = useState(new Date('0'));

  useEffect(() => {
    setnewTable(props?.editTable)
    setTimeTableName(props?.selectedItem?.ttname)
    handleStartDateChange(props?.selectedItem?.start_date)
    handleEndDateChange(props?.selectedItem?.end_date)
    setselectedStartTime(new Date('2015-03-25T' +props?.selectedItem?.school_start_time))
    setselectedEndTime(new Date('2015-03-25T' +props?.selectedItem?.school_end_time))
  }, [props?.selectedItem])



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
  const handleCancel = () => {
    setnewTable(false);
    props.setIsEdit(false);
  };

  const handleSubmit = async () => {
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
      return false;}
      
    let payload = {
      ttname: TimeTableName,
      start_date: `${moment(selectedStartDate).format('YYYY-MM-DD')}`,
      end_date: `${moment(selectedEndDate).format('YYYY-MM-DD')}`,
      school_start_time: `${moment(selectedStartTime).format('HH:mm:00')}`,
      school_end_time: `${moment(selectedEndTime).format('HH:mm:00')}`,
      section_mapping_id: props?.selectedItem?.section_mapping_id,
    }

    let data = await editTimeTable(props?.selectedItem?.id, payload);
    if (data.status_code === 200) {
      setAlert('success', data.message);
      handleCancel()
      let d = props?.getTTList(props?.selectedItem?.section_mapping_id)
      console.log(d,'dd')
      // ttList(props.section_mappingId);
    } else {
      setAlert('warning', data?.response?.data?.developer_msg);
    }
  }

  return (
      <>
      <Dialog
          open={newTable}
          fullWidth={true}
          maxWidth={'md'}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Time Table Details
            {/* <IconButton onClick={handleCancel} aria-label='close' size='large' style={{marginLeft:"72%"}}>
                <HighlightOffIcon
                  // style={{ color: 'white', backgroundColor: 'black' }}
                  fontSize='inherit'
                />
              </IconButton> */}
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
                      minDate={new Date()}
                      autoOk
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      format='MM/DD/YYYY'
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <DatePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      label='Ending Date'
                      inputVariant='outlined'
                      className={classes.datepicker}
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
                      format='hh:mm A'
                      inputVariant='outlined'
                      className={classes.datepicker}
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
                      className={classes.datepicker}
                      format='hh:mm A'
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
                value={props?.gradeName}
                // onChange={(e) => setTimeTableName(e.target.value)}
                disabled= {true}
              />
          </div>
          </div>
          <DialogActions>
            <Button color='primary' variant='contained' onClick={handleCancel}>
              Close
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      
      </>
  )
}
export default TimeTableDialog;
