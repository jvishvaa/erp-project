/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  FormControlLabel,
  Checkbox,
  Switch,
  SvgIcon
} from '@material-ui/core';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams, useLocation } from 'react-router-dom';
// import './attendee-list.scss';
import { Pagination } from '@material-ui/lab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { useSelector } from 'react-redux';
import Layout from '../Layout';
import ShuffleModal from './shuffle-modal';
import { result } from 'lodash';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
import './attendance.scss'
import APIREQUEST from "../../config/apiRequest";

const AttendeeListRemake = (props) => {
  const history = useHistory();
  const location = useLocation();
  //const { attendDate } = history.location.state
  const { id } = useParams();
  const attendanceDate = useSelector((state) => state.attendanceReducers.attendance);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [dateValue, setDateValue] = useState(moment(attendanceDate? attendanceDate : new Date()).format('YYYY-MM-DD'));
  const [openShuffleModal, setOpenShuffleModal] = useState(false);
  const pageSize = 10;
  const [excelDate, setExcelDate] = useState('')
  const { setAlert } = useContext(AlertNotificationContext);

  const handleAttendList =(result)=>{
    setTotalPages(result.data.total_pages);
    setAttendeeList(result.data.data);
    setTotalAttended(result.data.attended_count);
    setTotalAbsent(result.data.notattended_count);
    setLoading(false);
  }

  const msApigetAttendeeList = (date)=>{
    APIREQUEST("get", `/oncls/v1/oncls-attendeelist/?zoom_meeting_id=${id}&class_date=${date}&type=json&page_number=${currentPage}&page_size=10`)
    .then((result)=>{
      handleAttendList(result);
    })
    .catch(error => {
      setLoading(false);
      setAlert('error', 'Failed to load attendee list');
    })
  }

  const getAttendeeList = (date) => {
    setExcelDate(date)
    if(JSON.parse(localStorage.getItem('isMsAPI'))){
      msApigetAttendeeList(date);
      return
    }
    axiosInstance.get(`${endpoints.attendanceList.list}?zoom_meeting_id=${id}&class_date=${date}&type=json&page_number=${currentPage}&page_size=10`)
      .then((result) => {
        handleAttendList(result);
      }).catch(error => {
        setLoading(false);
        setAlert('error', 'Failed to load attendee list');
      })
  };

  //   useEffect(() => {
  //     getAttendeeList();
  //   }, [currentPage]);
  
  useEffect(() => {
    getAttendeeList(dateValue)
  }, [currentPage]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleChange = (event, checked) => {
    setIsEdit(checked);
  };

  const msApihandleCheck = (checked, student)=>{
    APIREQUEST("put", "/oncls/v1/mark-attendance/", {
      'zoom_meeting_id': student.id,
      'class_date': dateValue,
      'is_attended': checked
    })
    .then((result)=>{
      if (result.data.status_code === 200) {
        getAttendeeList(dateValue);
        setAlert('success', result.data.message)
      }
    })
    .catch((error)=>{
      setIsUpdating(false);
      setAlert('error', 'Failed to mark attendance');
    }) 
  }

  const handleCheck = (index, checked, student) => {
    setIsUpdating(true);
    // checked= !checked
    const { match } = props;
    try {
      if(JSON.parse(localStorage.getItem('isMsAPI'))){
        msApihandleCheck(checked, student);
      }
      else{
        axiosInstance.put(`${endpoints.attendanceList.updateAttendance}`, {
          'zoom_meeting_id': student.id,
          'class_date': dateValue,
          'is_attended': checked
        }).then(result => {
          if (result.data.status_code === 200) {
            getAttendeeList(dateValue);
            setAlert('success', result.data.message)
          }
        })
      }
      const stateCopy = attendeeList;
      const copy = stateCopy.map((el, ind) => {
        if (ind === index) {
          return { ...el, is_attended: checked };
        }
        return el;
      });
      setAttendeeList(copy);
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      setAlert('error', 'Failed to mark attendance');
    }
  };

  // const handleExcelDownload = () => {
  //   const { data } = axiosInstance.get(`${endpoints.attendanceList.list}?zoom_meeting_id=${id}&class_date=${excelDate}&type=excel&page_number=1&page_size=10`, {
  //     responseType: 'arraybuffer',
  //   })
  //   const blob = new Blob([data],
  //   {
  //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   });
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   // link.download = 'aol_attendance_report.xlsx';
  //   link.click();
  //   link.remove();
  // }


  // if(isEdit){
  //  const attendee = attendeeList.map((el,i)=>({[el.user.user.id]:{isChecked: true}}))
  // }

  const handleExcelDownload = async () => {
    const { match } = props;
    try {
      const { data } = JSON.parse(localStorage.getItem('isMsAPI')) ? await APIREQUEST('get',`/oncls/v1/oncls-attendeelist/?zoom_meeting_id=${id}&class_date=${excelDate}&type=excel&page_number=1&page_size=10`, null, "arraybuffer" ) : 
      await axiosInstance.get(
        `${endpoints.attendanceList.list}?zoom_meeting_id=${id}&class_date=${excelDate}&type=excel&page_number=1&page_size=10`,
        {
          responseType: 'arraybuffer',
        }
      );
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      if(window.location.pathname === `/erp-attendance-list/${id}`){
        link.download = `erp_attendance_report_${excelDate}.xlsx`;
      }
      if(window.location.pathname === `/aol-attendance-list/${id}`){
        link.download = `aol_attendance_report_${excelDate}.xlsx`;
      }
      link.click();
      link.remove();
    } catch (error) {
      setAlert('error', 'Failed to download attendee list');
    }
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  const handleDateChange = (event, value) => {
    setDateValue(value)
    setCurrentPage(1);
    getAttendeeList(value);
  }

  const handleShuffle = () => {
    setOpenShuffleModal(true);
  }

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <Layout>
      <div className='breadcrumb-container'>
        <CommonBreadcrumbs componentName='Online Class' childComponentName='Attendance List' />
      </div>
      <div className='attendeelist-filters'>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={2}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                size='small'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker'
                label='Start date'
                value={dateValue}
                // minDate={new Date()}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button onClick={handleExcelDownload} style={{backgroundColor:'#ff6b6b'}}>Download Excel</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'green' }}>
              Attended Count
              <Chip
                label={<Typography variant='h6'>{totalAttended}</Typography>}
                style={{ marginLeft: 10 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'red' }}>
              Absent Count
              <Chip
                label={<Typography variant='h6'>{totalAbsent}</Typography>}
                style={{ marginLeft: 10 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEdit}
                  onChange={handleChange}
                  name='Edit attendance'
                />
              }
              label={<Typography variant='h6'>Edit Attendance</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button onClick={handleGoBack} style={{ width: '100%', backgroundColor: 'lightgray' }}>BACK</Button>
          </Grid>
        </Grid>
      </div>
      <div className='attendee__management-table'>
        {isHidden ? (
          <AddCircleOutlineIcon className='expand-management' onClick={toggleHide} />
        ) : (
            <RemoveCircleIcon className='expand-management' onClick={toggleHide} />
          )}
        <TableContainer>
          <Table className='viewclass__table' aria-label='simple table'>
            <TableHead className='styled__table-head'>
              <TableRow>
                <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                  SL_NO.
                </TableCell>
                <TableCell align='center'>Student Name</TableCell>
                <TableCell align='center'>ERP</TableCell>
                <TableCell align='center'>Attended Status</TableCell>
              </TableRow>
            </TableHead>
            {attendeeList && attendeeList.length >0 ? (
              <TableBody className='styled__table-body'>
                {attendeeList.map((el, index) => {
                  return (
                    <TableRow key={el.id}>
                      <TableCell
                        align='center'
                        className={`${isHidden ? 'hide' : 'show'}`}
                      >
                        {index + (currentPage * 10) - 9}
                      </TableCell>
                      <TableCell align='center'>{el.user.user.first_name}</TableCell>
                      <TableCell align='center'>{el.user.user.username}</TableCell>
                      <TableCell align='center'>
                        {isEdit ? (
                          <Switch
                            disabled={isUpdating}
                            checked={el.attendance_details.is_attended}
                            onChange={(event, checked) => {
                              handleCheck(index, checked, el);
                            }}
                            name='checked'
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        ) : el.attendance_details.is_attended ? (
                          'Attended'
                        ) : (
                              'Not attended'
                            )}
                        { }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <div className='attendanceDataUnavailable'>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      // isMobile
                      //   ? { height: '100px', width: '200px' }
                        // :
                         { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />
              <SvgIcon
                component={() => (
                  <img
                    style={
                      // isMobile
                      //   ? { height: '20px', width: '250px' }
                      //   : 
                        { height: '50px', width: '400px', marginLeft: '5%' }
                    }
                    src={selectfilter}
                  />
                )}
              />
            </div>
              )}
          </Table>
        </TableContainer>
      </div>
      <Grid
        className='pagination__container'
        container
        direction='column'
        alignItems='center'
        justify='center'
      >
        <Grid item xs={12}>
          {!loading ? (
            <Pagination
              onChange={handlePagination}
              style={{ marginTop: 25 }}
              count={totalPages}
              color='primary'
              page={currentPage}
            />
          ) : (
              ''
            )}
        </Grid>
      </Grid>
      <ShuffleModal
        openShuffleModal={openShuffleModal}
        setOpenShuffleModal={setOpenShuffleModal}
      />
    </Layout>
  );
};

export default AttendeeListRemake;
