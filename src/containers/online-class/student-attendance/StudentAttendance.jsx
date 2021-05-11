import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Layout from 'containers/Layout';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Autocomplete } from '@material-ui/lab';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import moment from 'moment';

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

  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
      console.log('start date', moment(new Date(v1[0])).format('YYYY-MM-DD'));
      console.log('end date', moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    // setDateRangeTechPer(v1);
  }
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
              <Grid item md={2} xs={12}>
                <Button
                  variant='contained'
                  size='large'
                  className='BatchViewfilterButtons'
                >
                  Get Attendance
                </Button>
              </Grid>
              {/* <Grid container spacing={2} style={{ marginTop: '5px' }}> */}
              <Grid item md={2} xs={12} style={{ marginLeft: '-20px' }}>
                <Button
                  variant='contained'
                  size='large'
                  className='BatchViewfilterButtons'
                >
                  Clear All
                </Button>
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export default StudentAttendance;
