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
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from 'react-router-dom';
// import './attendee-list.scss';
import { Pagination } from '@material-ui/lab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from '../Layout';
import ShuffleModal from './shuffle-modal';
import { result } from 'lodash';

const AttendeeListRemake = (props) => {
  const { id } = useParams();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const history = useHistory();
  const [openShuffleModal, setOpenShuffleModal] = useState(false);
  const pageSize = 10;
  const { setAlert } = useContext(AlertNotificationContext);

  const getAttendeeList = async (date) => {
    axiosInstance.get(`${endpoints.attendanceList.list}?zoom_meeting_id=${id}&class_date=${date}&type=json&page_number=1&page_size=10`)
      .then((result) => {
        setTotalPages(result.data.total_pages);
        setAttendeeList(result.data.data);
        setTotalAttended(result.data.attended_count);
        setTotalAbsent(result.data.notattended_count);
        setLoading(false);
      }).catch(error => {
        setLoading(false);
        setAlert('error', 'Failed to load attendee list');
      })
  };

  //   useEffect(() => {
  //     getAttendeeList();
  //   }, [currentPage]);
  useEffect(()=>{
   getAttendeeList(dateValue)
  },[])
  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleChange = (event, checked) => {
    setIsEdit(checked);
  };

  const handleCheck = (index, checked, student) => {
    // console.log(student.id, 'index')
    setIsUpdating(true);
    // checked= !checked
    const { match } = props;
    try {
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

// if(isEdit){
//  const attendee = attendeeList.map((el,i)=>({[el.user.user.id]:{isChecked: true}}))
// }

  const handleExcelDownload = async () => {
    const { match } = props;
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.attendeeList}?zoom_meeting_id=${694}&type=excel`,
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

  const handleDateChange = (event, value) => {
    setDateValue(value)
    getAttendeeList(value);
  }

  const handleShuffle = () => {
    setOpenShuffleModal(true);
  }

  const handleGoBack=()=>{
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
          <Grid item xs={12} sm={2}>
              <Button onClick={handleGoBack} style={{width:'100%',backgroundColor:'lightgray'}}>BACK</Button>
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
                      <TableCell align='center'>
                        {isEdit ? (
                          <Switch
                            disabled={isUpdating}
                            checked={ el.attendance_details.is_attended}
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
      <ShuffleModal
        openShuffleModal={openShuffleModal}
        setOpenShuffleModal={setOpenShuffleModal}
      />
    </Layout>
  );
};

export default AttendeeListRemake;
