import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SvgIcon,
  Switch,
} from '@material-ui/core';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Layout from 'containers/Layout';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Autocomplete } from '@material-ui/lab';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import moment from 'moment';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';

function StudentAttendance({ history }) {
  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' },
  ]);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleHide = () => {
    setIsHidden(!isHidden);
  };
  const [attendeeList, setAttendeeList] = useState([]);
  const arr = [
    {
      id: 1,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 2,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 3,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 4,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 5,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 6,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 7,
      subject: 'English',
      absent: 7,
      present: 10,
    },
    {
      id: 8,
      subject: 'English',
      absent: 7,
      present: 10,
    },
  ];
  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
      console.log('start date', moment(new Date(v1[0])).format('YYYY-MM-DD'));
      console.log('end date', moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    // setDateRangeTechPer(v1);
  }
  const handleGetAttendance = () => {
    const payload = {
      class_type: selectedClassType,
      start_date: startDate,
      end_date: endDate,
    };
    console.log(payload, 'checking data');
  };
  const handleClearAll = () => {
    setSelectedClassType([]);
  };
  return (
    <>
      <Layout>
        <Grid container spacing={2} className='teacherBatchViewMainDiv'>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2} justify='middle' className='signatureNavDiv'>
              <Grid item md={12} xs={12} style={{ display: 'flex' }}>
                <button
                  type='button'
                  className='SignatureNavigationLinks'
                  onClick={() => history.push('/dashboard')}
                >
                  Dashboard
                </button>
                <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
                <span className='SignatureNavigationLinks'>Online Class</span>
                <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
                <span className='SignatureNavigationLinks'>
                  {window.location.pathname === '/student-attendance-report'
                    ? 'Student Attendance Report'
                    : ''}
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} className='teacherBatchViewFilter'>
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    setSelectedClassType(value);
                  }}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedClassType || ''}
                  options={classTypes || ''}
                  getOptionLabel={(option) => option?.type || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Class Type'
                      placeholder='Class Type'
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <LocalizationProvider dateAdapter={MomentUtils}>
                  <DateRangePicker
                    startText='Select-date-range'
                    value={dateRangeTechPer || ''}
                    onChange={(newValue) => {
                      handleDate(newValue);
                      console.log(newValue, 'date checking');
                      //   setDateRangeTechPer(newValue);
                    }}
                    renderInput={({ inputProps, ...startProps }, endProps) => {
                      return (
                        <>
                          <TextField
                            {...startProps}
                            inputProps={{
                              ...inputProps,
                              value: `${inputProps.value} - ${endProps.inputProps.value}`,
                              readOnly: true,
                            }}
                            size='small'
                            className='dropdownIcon'
                            style={{ minWidth: '100%' }}
                          />
                        </>
                      );
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item md={2} xs={12} direction='row' justify='center'>
                <Button
                  variant='contained'
                  size='large'
                  className='BatchViewfilterButtons'
                  onClick={handleGetAttendance}
                >
                  Get Attendance
                </Button>
              </Grid>
              {/* <Grid container spacing={2} style={{ marginTop: '5px' }}> */}
              <Grid
                item
                md={2}
                xs={12}
                style={{ marginLeft: '-20px' }}
                direction='row'
                justify='center'
              >
                <Button
                  variant='contained'
                  size='large'
                  className='BatchViewfilterButtons'
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Grid>
          <Divider style={{ margin: '10px 0px' }} />
          <Grid
            itemxs={12}
            className='attendee__management-table'
            style={{ width: '100%' }}
          >
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
                    <TableCell align='center'>Subject</TableCell>
                    <TableCell align='center'>No.of Present Days</TableCell>
                    <TableCell align='center'>No.of Absent Days</TableCell>
                  </TableRow>
                </TableHead>
                {arr && arr.length > 0 ? (
                  <TableBody className='styled__table-body'>
                    {arr.map((item, index) => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell
                            align='center'
                            className={`${isHidden ? 'hide' : 'show'}`}
                          >
                            {index + currentPage * 10 - 9}
                          </TableCell>
                          <TableCell align='center'>{item.subject}</TableCell>
                          {/* <TableCell align='center'>{el.user.user.first_name}</TableCell> */}
                          <TableCell align='center'>{item.present}</TableCell>
                          {/* <TableCell align='center'>{el.user.user.username}</TableCell> */}
                          <TableCell align='center'>{item.absent}</TableCell>
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
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export default StudentAttendance;
