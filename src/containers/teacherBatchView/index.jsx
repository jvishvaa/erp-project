/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import './style.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import filterImage from '../../assets/images/unfiltered.svg';
import TeacherBatchViewCard from './teacherbatchViewCard';
import TeacherBatchFullView from './teacherBatchFullView';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from '../Layout';

const TeacherBatchView = ({ history }) => {
  //   const NavData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branchList] = useState([
    {
      id: 5,
      branch_name: 'AOL',
    },
  ]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );
  const [selectedBranch, setSelectedBranch] = useState(branchList[0]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [filterList, setFilterList] = useState('');
  const [filterFullData, setFilterFullData] = useState('');
  const [selectedModule] = useState(4);
  const [selectedViewMore, setSelectedViewMore] = useState('');
  const [page, setPage] = useState(1);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'batchsize') {
            setBatchList(result.data.result || []);
          }
          if (key === 'course') {
            setCourseList(result.data.result || []);
          }
          if (key === 'filter') {
            setFilterFullData(result.data || {});
            setFilterList(result.data.data || {});
            setSelectedViewMore('');
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }

  function handleClose(data) {
    setSelectedViewMore('');
    if (data === 'success') {
      setPage(1);
      if (window.location.pathname === '/online-class/attend-class') {
        setPage(1);
        callApi(
          `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
            studentDetails &&
            studentDetails.role_details &&
            studentDetails.role_details.erp_user_id
          }&page_number=1&page_size=15`,
          'filter'
        );
      } else {
        callApi(
          `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
            selectedBatch && selectedBatch.id
          }&start_date=${startDate}&end_date=${endDate}&page_number=${page}&page_size=12&module_id=${selectedModule}&class_type=1`,
          'filter'
        );
      }
    }
  }

  useEffect(() => {
    if (window.location.pathname === '/online-class/attend-class') {
      setPage(1);
      // ${studentDetails && studentDetails.role_details.erp_user_id}
      callApi(
        // `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=1362&page_number=1&page_size=15&class_type=1`,
        `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
          studentDetails &&
          studentDetails.role_details &&
          studentDetails.role_details.erp_user_id
        }&page_number=1&page_size=15&class_type=1`,
        'filter'
      );
    } else {
      callApi(
        `${endpoints.academics.grades}?branch_id=${selectedBranch.id}&module_id=4`,
        'gradeList'
      );
    }
  }, []);

  function handlePagination(e, page) {
    setPage(page);
    if (window.location.pathname === '/online-class/attend-class') {
      callApi(
        `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
          studentDetails &&
          studentDetails.role_details &&
          studentDetails.role_details.erp_user_id
        }&page_number=${page}&page_size=15`,
        'filter'
      );
    } else {
      callApi(
        `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
          selectedBatch && selectedBatch.id
        }&start_date=${startDate}&end_date=${endDate}&page_number=${page}&page_size=12&module_id=${selectedModule}&class_type=1`,
        'filter'
      );
    }
  }

  function handleClearFilter() {
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setEndDate('');
    setStartDate('');
    setSelectedBranch('');
    setSelectedGrade('');
    setCourseList([]);
    setSelectedCourse('');
    setBatchList([]);
    setSelectedBatch('');
    setFilterList([]);
    setSelectedViewMore('');
  }

  function handleFilter() {
    if (!selectedGrade) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (!selectedCourse) {
      setAlert('warning', 'Select Course');
      return;
    }
    if (!selectedBatch) {
      setAlert('warning', 'Select Batch Size');
      return;
    }
    if (!startDate) {
      setAlert('warning', 'Select Start Date');
      return;
    }
    setLoading(true);
    setPage(1);
    callApi(
      `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
        selectedBatch && selectedBatch.id
      }&start_date=${startDate}&end_date=${endDate}&page_number=1&page_size=12&module_id=4&class_type=1&batch_limit=${
        selectedBatch && selectedBatch.batch_size
      }`,
      'filter'
    );
  }

  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    setDateRangeTechPer(v1);
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
                <span className='SignatureNavigationLinks'>{window.location.pathname ==="/online-class/teacher-view-class" ? 'Teacher Class View' : 'Student Class View '}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} className='teacherBatchViewFilter'>
            {window.location.pathname !== '/online-class/attend-class' && (
              <Grid container spacing={2} style={{ marginTop: '10px' }}>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(event, value) => {
                      setSelectedBranch(value);
                    }}
                    id='branch_id'
                    className='dropdownIcon'
                    value={selectedBranch}
                    options={branchList}
                    getOptionLabel={(option) => option?.branch_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Branch'
                        placeholder='Branch'
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(event, value) => {
                      setSelectedGrade(value);
                      if (value) {
                        callApi(
                          `${endpoints.teacherViewBatches.courseListApi}?grade=${
                            value && value.grade_id
                          }`,
                          'course'
                        );
                      }
                      setCourseList([]);
                      setBatchList([]);
                      setSelectedCourse('');
                      setSelectedBatch('');
                    }}
                    id='grade_id'
                    className='dropdownIcon'
                    value={selectedGrade}
                    options={gradeList}
                    getOptionLabel={(option) => option?.grade__grade_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Grade'
                        placeholder='Grade'
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(event, value) => {
                      setSelectedCourse(value);
                      if (value) {
                        callApi(
                          `${endpoints.teacherViewBatches.batchSizeList}?course_id=${
                            value && value.id
                          }`,
                          'batchsize'
                        );
                      }
                      setBatchList([]);
                      setSelectedBatch('');
                    }}
                    id='course_id'
                    className='dropdownIcon'
                    value={selectedCourse}
                    options={courseList}
                    getOptionLabel={(option) => option?.course_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Course'
                        placeholder='Course'
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(event, value) => {
                      setSelectedBatch(value);
                    }}
                    id='batch_size_id'
                    className='dropdownIcon'
                    value={selectedBatch}
                    options={batchList}
                    getOptionLabel={(option) =>
                      option ? `1 : ${JSON.stringify(option.batch_size)}` : ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Batch Limit'
                        placeholder='Batch Limit'
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <LocalizationProvider dateAdapter={MomentUtils}>
                    <DateRangePicker
                      startText='Select-date-range'
                      value={dateRangeTechPer}
                      onChange={(newValue) => {
                        handleDate(newValue);
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
                              style={{ minWidth: '100%' }}
                            />
                          </>
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            )}
            {window.location.pathname !== '/online-class/attend-class' && (
              <Grid container spacing={2} style={{ marginTop: '5px' }}>
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='large'
                    className='BatchViewfilterButtons'
                    onClick={() => handleClearFilter()}
                  >
                    Clear All
                  </Button>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='large'
                    className='BatchViewfilterButtons'
                    onClick={() => handleFilter()}
                  >
                    Get Classes
                  </Button>
                </Grid>
              </Grid>
            )}
            {window.location.pathname !== '/online-class/attend-class' && (
              <Divider style={{ margin: '10px 0px' }} />
            )}
            <Grid container spacing={2}>
              {window.location.pathname !== '/online-class/attend-class' && (
                <Grid item md={12} xs={12}>
                  {!filterList && (
                    <Grid item md={12} xs={12}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{ textAlign: 'center', marginTop: '10px' }}
                        >
                          <img
                            src={filterImage}
                            alt='crash'
                            height='250px'
                            width='250px'
                          />
                          <Typography>
                            Please select the filter to dislpay classes
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
              {filterList && (
                <Grid item md={12} xs={12} className='teacherBatchViewLCardList'>
                  <Grid container spacing={2}>
                    {filterList && filterList.length === 0 && (
                      <Grid item md={12} xs={12}>
                        <Grid container spacing={2}>
                          <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                            <img
                              src={filterImage}
                              alt='crash'
                              height='250px'
                              width='250px'
                            />
                            <Typography style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              Classes Not Found
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    <Grid container spacing={2}>
                      <Grid item md={selectedViewMore ? 8 : 12} xs={12}>
                        <Grid container spacing={2}>
                          {filterList &&
                            filterList.length !== 0 &&
                            filterList.map((item) => (
                              <Grid item md={selectedViewMore ? 6 : 4} xs={12}>
                                <TeacherBatchViewCard
                                  fullData={item}
                                  handleViewMore={setSelectedViewMore}
                                  selectedViewMore={selectedViewMore || {}}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                      {selectedViewMore && (
                        <Grid item md={selectedViewMore ? 4 : 0} xs={12}>
                          <TeacherBatchFullView
                            fullData={selectedViewMore}
                            handleClose={handleClose}
                          />
                        </Grid>
                      )}
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TablePagination
                        component='div'
                        count={
                          filterFullData && filterFullData && filterFullData.total_pages
                        }
                        rowsPerPage='12'
                        page={
                          Number(
                            filterFullData &&
                              filterFullData &&
                              filterFullData.current_page
                          ) - 1
                        }
                        onChangePage={(e, page) => {
                          handlePagination(e, page + 1);
                        }}
                        rowsPerPageOptions={false}
                        className='table-pagination-users-log-message'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {loading && <Loader />}
      </Layout>
    </>
  );
};
export default withRouter(TeacherBatchView);
