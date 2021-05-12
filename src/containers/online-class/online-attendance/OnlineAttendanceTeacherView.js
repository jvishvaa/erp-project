import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SvgIcon,
  Switch,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Loader from '../../../components/loader/loader';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import selectfilter from '../../../assets/images/selectfilter.svg';
import filterImage from '../../../assets/images/unfiltered.svg';
import unfiltered from '../../../assets/images/unfiltered.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
const OnlineAttendanceTeacherView=({history})=>{
    const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [type, setType] = useState('');
  const [sectionMappingId, setSectionMappingId] = useState('')

  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );

  const [totalCount, setTotalCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [page, setPage] = useState(1);
  const limit = 9;
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));

  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' },
  ]);
  const [selectedClassType, setSelectedClassType] = useState('');
  const moduleId=175;
  // const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  const handlePagination = (event, page) => {
    setPage(page);
  };
  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'Online Class' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if (
  //             item.child_name === 'Attendance Teacher'
  //           ) {
  //             setModuleId(item.child_id);
  //           }
            
  //           // if (
  //           //   item.child_name === 'Attend Online Class' &&
  //           //   window.location.pathname === '/erp-online-class-student-view'
  //           // ) {
  //           //   setModuleId(item.child_id);
  //           // }
  //         });
  //       }
  //     });
  //   }
  // }, []);


  const toggleHide = () => {
    setIsHidden(!isHidden);
  };


  useEffect(() => {
    callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
  }, []);


  // function handlePagination(e, page) {
  //   setPage(page);
  //   if (window.location.pathname === '/erp-online-class-student-view') {
  //     callApi(
  //       `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
  //         studentDetails &&
  //         studentDetails.role_details &&
  //         studentDetails.role_details.erp_user_id
  //       }&page_number=${page}&page_size=15&module_id=${moduleId}`,
  //       'filter'
  //     );
  //   } else {
  //     callApi(
  //       `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
  //         selectedBatch && selectedBatch.id
  //       }&start_date=${startDateTechPer.format('YYYY-MM-DD')}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&page_number=${page}&page_size=12&module_id=${moduleId}&class_type=1`,
  //       'filter'
  //     );
  //   }
  // }

  function handleClearFilter() {
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setEndDate('');
    setStartDate('');
    setSelectedAcadmeicYear('');
    setSelectedBranch([]);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setPage(1)
  }
  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || []);
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || []);
            setSectionList(result.data.data);
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

  function handleFilter() {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;

    if (!selectedClassType) {
      setAlert('warning', 'Select Classtype');
      return;
    }
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (selectedBranch.length == 0) {
      setAlert('warning', 'Select Branch');
      return;
    }
    if (selectedGrade.length == 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (selectedSection.length == 0) {
      setAlert('warning', 'Select Section');
      return;
    }
    // if (!selectedAcademicYear) {
    //   setAlert('warning', 'Select Academic Year');
    //   return;
    // }
    // if (!selectedBranch.length > 0) {
    //   setAlert('warning', 'Select Branch');
    //   return;
    // }
    // if (!selectedGrade.length > 0) {
    //   setAlert('warning', 'Select Grade');
    //   return;
    // }
    // if (!selectedSection.length > 0) {
    //   setAlert('warning', 'Select Section');
    //   return;
    // }
   
    // if (!startDate) {
    //   setAlert('warning', 'Select Start Date');
    //   return;
    // }
    setLoading(true);
    setPage(1);
    axiosInstance
    .get(`${endpoints.attendanceTeacherView.getTeacherAttendanceView}?is_aol=0&session_year=${selectedAcademicYear.id}&section_mapping_ids=${sectionMappingId}&class_type=${type}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&start_date=${startDateTechPer.format('YYYY-MM-DD')}`)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
    // axiosInstance.get(`${endpoints.attendanceTeacherView.getTeacherAttendanceView}?is_aol=0&session_year=${selectedAcademicYear.id}&section_mapping_ids=${selectedSection.map((el) => el.id)}&class_type=${selectedClassType.id}&start_date=${startDateTechPer.format(
    //   'YYYY-MM-DD'
    // )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&module_id=61`)
    // .then((res)=>console.log("asss",res))
    // `https://erpnew.letseduvate.com/qbox/erp_user/teacher_online_class/?page_number=1&page_size=15&class_type=1&is_aol=1&course=97&start_date=2021-02-21&end_date=2021-02-27`
    // if (selectedCourse.id) {
    //   callApi(
    //     `${endpoints.attendanceTeacherView.getTeacherAttendanceView}?is_aol=0&session_year=${
    //       selectedAcademicYear.id
    //     }&section_mapping_ids=${selectedSection.map((el) => el.id)}&class_type=${
    //       selectedClassType.id
    //     }&start_date=${startDateTechPer.format(
    //       'YYYY-MM-DD'
    //     )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&course_id=${
    //       selectedCourse.id
    //     }&module_id=${moduleId}`,      //&page_number=${page}&page_size=${limit}&module_id=${moduleId}
    //     'filter'
    //   );
    // } else {
    //   callApi(
    //     `${endpoints.attendanceTeacherView.getTeacherAttendanceView}?is_aol=0&session_year=${
    //       selectedAcademicYear.id
    //     }&section_mapping_ids=${selectedSection.map(
    //       (el) => el.id
    //     )}&start_date=${startDateTechPer.format(
    //       'YYYY-MM-DD'
    //     )}&end_date=${endDateTechPer.format(
    //       'YYYY-MM-DD'
    //     )}&module_id=${moduleId}`,   //&page_number=1&page_size=15&module_id=${moduleId}&page=${page}&page_size=${limit}
    //     'filter'
    //   );
    // }
  }

  // function handleDate(v1) {
  //   if (v1 && v1.length !== 0) {
  //     setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
  //     setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
  //   }
  //   setDateRangeTechPer(v1);
  // }
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

                    <span className='SignatureNavigationLinks'>Attendance View</span>
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
                    // console.log(value, 'type checking');
                    setType(value.id);
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
                  <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedAcadmeicYear(value);
              if (value) {
                callApi(
                  `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                  'branchList'
                );
              }
              setSelectedGrade([]);
              setSectionList([]);
              setSelectedSection([]);
              setSelectedBranch([]);
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedAcademicYear || ''}
            options={academicYear || ''}
            getOptionLabel={(option) => option?.session_year || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
              />
            )}
          />
                  </Grid>
                     <Grid item md={3} xs={12}>
          <Autocomplete
            // multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedBranch([]);
              if (value) {
                // const ids = value.map((el)=>el)
                const selectedId = value.branch.id;
                setSelectedBranch(value);
                callApi(
                  `${endpoints.academics.grades}?session_year=${
                    selectedAcademicYear.id
                  }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                  'gradeList'
                );
              }
              setSelectedGrade([]);
              setSectionList([]);
              setSelectedSection([]);
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch || ''}
            options={branchList || ''}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
            // multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedGrade([]);
              if (value) {
                // const ids = value.map((el)=>el)
                const selectedId = value.grade_id;
                // console.log(selectedBranch.branch)
                const branchId = selectedBranch.branch.id;
                setSelectedGrade(value);
                callApi(
                  `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                  'section'
                );
              }
              setSectionList([]);
              setSelectedSection([]);
            }}
            id='grade_id'
            className='dropdownIcon'
            value={selectedGrade || ''}
            options={gradeList || ''}
            getOptionLabel={(option) => option?.grade__grade_name || ''}
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
            // multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedSection([]);
              if (value) {
                console.log(value, "section id")
                const ids = value.id;
                const secId = value.section_id;
                setSelectedSection(value);
                setSecSelectedId(secId);
                setSectionMappingId(value.id)
              }
            }}
            id='section_id'
            className='dropdownIcon'
            value={selectedSection || ''}
            options={sectionList || ''}
            getOptionLabel={(option) =>
              option?.section__section_name || option?.section_name || ''
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
          />
                      </Grid>
                    
                      {/* {selectedClassType?.id === 0 && gradeList.length > 0 ? (
                        <Grid item md={3} xs={12}>
                          <Autocomplete
                            multiple
                            style={{ width: '100%' }}
                            size='small'
                            onChange={(event, value) => {
                              setSelectedSubject([]);
                              if (value.length) {
                                const ids = value.map((el) => el);
                                setSelectedSubject(ids);
                              }
                              setBatchList([]);
                              setSelectedBatch('');
                              setFilterList([]);
                              setPage(1)
                            }}
                            id='course_id'
                            className='dropdownIcon'
                            value={selectedSubject}
                            options={subjectList}
                            getOptionLabel={(option) => option?.subject__subject_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant='outlined'
                                label='Subject'
                                placeholder='Subject'
                              />
                            )}
                          />
                        </Grid>
                      ) : (
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
                              setFilterList([]);
                              setPage(1)
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
                      )} */}
                      <Grid item xs={12} sm={3}>
                        <LocalizationProvider dateAdapter={MomentUtils}>
                          <DateRangePicker
                            startText='Select-date-range'
                            value={dateRangeTechPer}
                            onChange={(newValue) => {
                              setDateRangeTechPer(newValue);
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
    
                {window.location.pathname !== '/erp-online-class-student-view' && (
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
                {window.location.pathname !== '/erp-online-class-student-view' && (
                  <Divider style={{ margin: '10px 0px' }} />
                )}
                {/* <Grid container spacing={2}> */}
                 
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
                <TableCell align='center'>Subject Name</TableCell>
                <TableCell align='center'>Title</TableCell>
                <TableCell align='center'>Present</TableCell>
                <TableCell align='center'>Absent</TableCell>
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
                            // onChange={(event, checked) => {
                            //   handleCheck(index, checked, el);
                            // }}
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
                {/* </Grid> */}
              </Grid>
            </Grid>
          </Layout>
        </>
      );
}

export default OnlineAttendanceTeacherView