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
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import MomentUtils from '@date-io/moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
// import './attendee-list.scss';
import { Pagination } from '@material-ui/lab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from '../Layout';
import { result } from 'lodash';

const AttendeeListRemake = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [dateValue,setDateValue] =useState('');
  const history = useHistory();

  const pageSize = 10;

  const { setAlert } = useContext(AlertNotificationContext);

  const getAttendeeList = async (date) => {

    axiosInstance.get(`${endpoints.attendanceList.list}?zoom_meeting_id=641&class_date=${date}&type=json&page_number=1&page_size=10`)
    .then((result)=>{
        console.log(result.data.data,'========')
      setTotalPages(result.data.total_pages);
      setAttendeeList(result.data.data);
      setTotalAttended(result.data.attended_count);
      setTotalAbsent(result.data.notattended_count);
      setLoading(false);
        
    }).catch(error=>{
        
            setLoading(false);
            setAlert('error', 'Failed to load attendee list');
        
    }) 
    //   setTotalPages(data.total_pages);
    //   setAttendeeList(data.data);
    //   setTotalAttended(data.attended_count);
    //   setTotalAbsent(data.notattended_count);
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    //   setAlert('error', 'Failed to load attendee list');
    // }
  };

//   useEffect(() => {
//     getAttendeeList();
//   }, [currentPage]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleChange = (event, checked) => {
    setIsEdit(checked);
  };

  const handleCheck =  (index, checked, student) => {
    console.log(student.id,'index')
    setIsUpdating(true);
    // checked= !checked
    const { match } = props;
    try {
    //   const formData = new FormData();
    //   formData.append('zoom_meeting_id', 641);
    //   formData.append('student_id', student.user.id);
    //   formData.append('is_attended', checked);
      // const data = {
      //   zoom_meeting_id: match.params.id * 1,
      //   student_id: student.user.id,
      //   is_attended: checked,
      // };
       axiosInstance.put(`${endpoints.attendanceList.updateAttendance}`, {
        'zoom_meeting_id':student.id,
        'class_date':dateValue,
        'is_attended':checked
    //     "zoom_meeting_id": 5804,
    // "class_date": "2021-01-29",
    // "is_attended": true


      }).then(result=>{
          console.log(result,'==============')
          if(result.data.status_code===200){
              setAlert('success',result.data.message)
          }
      })
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

  const handleExcelDownload = async () => {
    const { match } = props;
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.attendeeList}?zoom_meeting_id=${641}&type=excel`,
        {
          responseType: 'arraybuffer',
        }
      );
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'online_class_attendance_report.xlsx';
      link.click();
      link.remove();
    } catch (error) {
      setAlert('error', 'Failed to download attendee list');
    }
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

const  handleDateChange=(event, value)=>{
    console.log(value,'land')
    setDateValue(value)
    getAttendeeList(value);
}
console.log(dateValue,'//////////')
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
                //   value={onlineClass.selectedDate}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                </MuiPickersUtilsProvider>
            </Grid>
          
          <Grid item xs={12} sm={2}>
            <Button onClick={handleExcelDownload}>Download Excel</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'green' }}>
              Attended count
              <Chip
                label={<Typography variant='h6'>{totalAttended}</Typography>}
                style={{ marginLeft: 10 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'red' }}>
              Absent count
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
              label={<Typography variant='h6'>Edit attendance</Typography>}
            />
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
                <TableCell align='center'>Student name</TableCell>
                <TableCell align='center'>Erp</TableCell>
                {/* <TableCell align='center'>Accepted status</TableCell> */}
                <TableCell align='center'>Attended status</TableCell>
              </TableRow>
            </TableHead>
            {!loading ? (
              <TableBody className='styled__table-body'>
                {attendeeList.map((el, index) => {
                  return (
                    <TableRow key={el.id}>
                      <TableCell
                        align='center'
                        className={`${isHidden ? 'hide' : 'show'}`}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align='center'>{el.user.user.first_name}</TableCell>
                      <TableCell align='center'>{el.user.user.username}</TableCell>
                      {/* <TableCell align='center'>
                        {el.is_accepted ? 'Accepted' : 'Not accepted'}
                      </TableCell> */}
                      <TableCell align='center'>
                      {/* <Switch
                            disabled={isUpdating}
                            checked={el.is_attended}
                            onChange={(event, checked) => {
                              handleCheck(index, checked, el);
                            }}
                            name='checked'
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          /> */}
                        {isEdit ? (
                          <Switch
                            disabled={isUpdating}
                            checked={el.is_attended}
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
                        {}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              ''
            )}
          </Table>
        </TableContainer>
        {/* {loading ? (
          <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
          >
            <Grid item xs={3}>
              <CircularProgress style={{ marginTop: 20 }} />
            </Grid>
          </Grid>
        ) : (
          ''
        )} */}
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
      </div>
    </Layout>
  );
};

export default AttendeeListRemake;
