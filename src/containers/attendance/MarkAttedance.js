import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Typography,
  withStyles,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import '../teacherBatchView/style.scss';
import './markAttendance.css';
import ClearIcon from '../../components/icon/ClearIcon';
import Loader from '../../components/loader/loader';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Axios from 'axios';
import { useHistory } from 'react-router';
import axios from 'axios';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',

    margin: '1.5rem -0.1rem',
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  paperStyle: {
    margin: '10px',
  },
  title: {
    fontSize: '1.1rem',
  },
  avtarSize: {
    width: '34px',
    height: '34px',
  },
  content: {
    fontSize: '18px',
  },
  contentList: {
    fontSize: '15px',
  },
  contentsmall: {
    fontSize: '0.8rem',
    textAlign: 'right',
    marginRight: '10%',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '255px',
    height: '185px',
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const MarkAttedance = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [attendanceType, setAttendanceType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));
  const [dateValueShow, setDateValueShow] = useState(moment(date).format('DD MMMM YYYY'));
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [data, setData] = useState();
  const [newData, setNewData] = useState();
  const history = useHistory();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
  });
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const [totalGenre, setTotalGenre] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 8;
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    console.log(history);

    if (history?.location?.state?.payload) {
      console.log(history?.location?.state?.payload?.academic_year_id?.session_year);
      setSelectedAcadmeicYear(history?.location?.state?.payload?.academic_year_id);
      setSelectedBranch(history?.location?.state?.payload?.branch_id);
      setSelectedGrade(history?.location?.state?.payload?.grade_id);
      setSelectedSection(history?.location?.state?.payload?.section_id);
      // setStartDate(history?.location?.state?.payload?.startDate)
      // setEndDate(history?.location?.state?.payload?.endDate)
      setNewData(history?.location?.state?.data);

      axiosInstance
        .get(
          `${endpoints.academics.studentList}?academic_year_id=${history?.location?.state?.payload?.academic_year_id?.id}&branch_id=${history?.location?.state?.payload?.branch_id?.branch?.id}&grade_id=${history?.location?.state?.payload?.grade_id?.grade_id}&section_id=${history?.location?.state?.payload?.section_id?.section_id}&page_num=${pageNumber}&page_size=${limit}`
        )
        .then((res) => {
          console.log(res, 'checking mark attendance list in useEffect');
          setNewData(res.data.results);
          setTotalGenre(res.data.count);
          console.log(res.data.count, 'checking count');
          var result = res.data.results.map((item) => ({
            name: item.name,
            student_id: item.user,
            section_mapping_id: selectedSection.section_id,
            remarks: 'none',
            fullday_present: true,
            is_first_shift_present: true,
            is_second_shift_present: true,
            attendance_for_date: dateValue,
          }));
          setData(result);
        })
        .catch((err) => {
          console.log(err);
          // setAlert('error', 'something went wrong');
        });
    } else {
      const date = new Date();
      console.log(
        new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(
          date
        )
      );
      callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
    }
  }, []);

  const handleOpenOnViewDetails = () => {
    if (history?.location?.state?.payload) {
      callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
      // console.log("history data is there")
    } else {
    }
  };

  const handleFilter = () => {
    console.log(selectedSection.id, 'section_mapping_id');
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    console.log(selectedBranch.length, '===============');
    if (selectedBranch.length == 0) {
      console.log(selectedBranch.length, '===============');
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
    setLoading(true);
    // const payload = {
    //   academic_year_id: selectedAcademicYear.id,
    //   branch_id: selectedBranch.branch.id,
    //   grade_id: selectedGrade.grade_id,
    //   section_id: selectedSection.section_id,
    //   dateValue: dateValue,
    //   attendanceType: attendanceType,
    // }
    // console.log(payload)
    axiosInstance
      .get(
        `${endpoints.academics.studentList}?academic_year_id=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}&page_num=${pageNumber}&page_size=${limit}`
      )
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        setNewData(res.data.results);
        setTotalGenre(res.data.count);
        const is_first_shift_present = false;
        const is_second_shift_present = false;
        var result = res.data.results.map((item) => ({
          name: item.name,
          student_id: item.user,
          section_mapping_id: selectedSection.id,
          remarks: 'none',
          is_first_shift_present: is_first_shift_present,
          is_second_shift_present: is_second_shift_present,
          fullday_present:
            is_first_shift_present && is_second_shift_present ? true : false,
          attendance_for_date: dateValue,
        }));
        setData(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        // setAlert('error', 'something went wrong');
      });
  };

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || [], 'checking');
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [], 'checking');
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || [], 'checking');
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || [], 'checking');
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

  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      borderRadius: '10px',
      marginLeft: '20px',
      height: '42px',
      width: '7%',
      marginTop: 'auto',
    },
  })(Button);
  const StyledFilterButton = withStyles({
    root: {
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      height: '42px',
      borderRadius: '10px',
      padding: '12px 40px',
      marginLeft: '20px',
      marginTop: 'auto',
      '&:hover': {
        backgroundColor: '#FF6B6B',
      },
    },

    startIcon: {
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
    },
  })(Button);

  const handleDateChange = (event, value) => {
    setDateValue(value);
    setDateValueShow(value);
    console.log('date', value);
  };
  const handleBack = () => {
    history.push({
      pathname: '/attendance-calendar/teacher-view',
    });
  };
  const handleClearAll = () => {
    setSelectedAcadmeicYear('');
    setSelectedBranch([]);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setDateValue(moment(date).format('YYYY-MM-DD'));
    setTotalGenre(null);
  };

  const handleFirstHalf = (e, id) => {
    console.log(e.target.checked, id);
    const studentId = data.findIndex((item) => item.student_id == id);
    console.log(studentId);
    let products = [...data];
    let product = { ...products[studentId] };
    product.is_first_shift_present = e.target.checked;
    products[studentId] = product;
    // console.log(products)
    setData(products);
    const remarks = 'test';
    const fullday_present =
      product.is_first_shift_present && product.is_second_shift_present
        ? 'true'
        : 'false';
    console.log(selectedSection.id, 'section_mapping_id');

    const fullData = {
      section_mapping_id: selectedSection.id,
      student_id: id,
      attendance_for_date: dateValue,
      remarks: remarks,
      fullday_present: fullday_present,
      is_first_shift_present: product.is_first_shift_present ? 'true' : 'false',
      is_second_shift_present: product.is_second_shift_present ? 'true' : 'false',
    };
    console.log(fullData);
    axiosInstance
      .post(`${endpoints.academics.createAttendance}`, fullData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // .post(`${endpoints.academics.createAttendance}?section_mapping_id=${selectedSection.section_id}&student_id=${id}&attendance_for_date=${dateValue}&remarks=${remarks}&fullday_present=${fullday_present}&is_first_shift_present=${product.is_first_shift_present}&is_second_shift_present=${product.is_second_shift_present}`)
    // .post(`${endpoints.academics.createAttendance}`)
    // console.log(`${endpoints.academics.createAttendance}`)
    // .then(res=>console.log(res))
    // .catch(err=>console.log(err))
    // axios.post({
    //   method: 'post',
    //   url:'http://127.0.0.1:8000/qbox/academic/create_attendance/',
    //   data: JSON.stringify(bodyFormData),
    //   headers: {
    //     authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjYxODA2MTA2OCwiZW1haWwiOiIifQ.aEV_0N-ZvMG7DWfC0hraHc7YSQNf8wxpg_j9jV2p39o'
    //   }
    // })
  };
  const handlePagination = (event, page) => {
    setPageNumber(page);
    // setGenreActiveListResponse([]);
    // setGenreInActiveListResponse([]);
    // getData();
  };

  const handleSecondHalf = (e, id) => {
    console.log(e.target.checked, id);
    const studentId = data.findIndex((item) => item.student_id == id);
    console.log(studentId);
    let products = [...data];
    let product = { ...products[studentId] };
    product.is_second_shift_present = e.target.checked;
    products[studentId] = product;
    // console.log(products)
    setData(products);
    const remarks = 'test';
    const fullday_present =
      product.is_first_shift_present && product.is_second_shift_present
        ? 'true'
        : 'false';
    console.log(selectedSection.id, 'section_mapping_id');

    const fullData = {
      section_mapping_id: selectedSection.id,
      student_id: id,
      attendance_for_date: dateValue,
      remarks: remarks,
      fullday_present: fullday_present,
      is_first_shift_present: product.is_first_shift_present ? 'true' : 'false',
      is_second_shift_present: product.is_second_shift_present ? 'true' : 'false',
    };
    console.log(fullData);
    axiosInstance
      .post(`${endpoints.academics.createAttendance}`, fullData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // axiosInstance
    //   .post(`${endpoints.academics.createAttendance}?section_mapping_id=${selectedSection.section_id}&student_id=${id}&attendance_for_date=${dateValue}&remarks=${remarks}&fullday_present=${fullday_present}&is_first_shift_present=${product.is_first_shift_present}&is_second_shift_present=${product.is_second_shift_present}`)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err))
  };

  const handlePostAttendance = () => {
    // if(data){
    //   let temp = data
    //   for(let i=0; i<data.length; i++){
    //     temp = {
    //       ...data,
    //       [`&[i]`]
    //     }
    //   }
    // }
    // data && data.map((item)=(
    //   {...data, section_mapping_id: selectedSection.section_id, student_id: item.erp_id, attendance_for_date: dateValue, remarks: null, is_fullday: }
    // ))
  };

  const StudentData = () => {
    return (
      <>
        {data &&
          data
            .sort((a, b) => {
              let fa = a.name.toLowerCase();
              let fb = b.name.toLowerCase();
              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            })
            .map((options) => {
              return (
                <div value={options.student_id} key={options.student_id}>
                  {' '}
                  <Grid item md={2} xs={12} className={classes.root}>
                    <Paper elevation={3} className={classes.paperSize}>
                      <Grid
                        container
                        direction='row'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {' '}
                        <Avatar className={[classes.orange, classes.paperStyle]}>
                          {options.name.slice(0, 1)}
                        </Avatar>
                        <Typography className={[classes.content, classes.paperStyle]}>
                          {options.name.slice(0, 6)}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography className={classes.contentsmall}>
                          Mark Present
                        </Typography>
                      </Grid>
                      <Divider />
                      <Grid container direction='row'>
                        <Typography className={[classes.contentList, classes.paperStyle]}>
                          1<sup>st</sup>
                          <span>&nbsp; Half</span>
                        </Typography>

                        <Grid style={{ marginLeft: '40%' }}>
                          {/* <Switch color='primary'  /> */}
                          <Switch
                            color='primary'
                            checked={options.is_first_shift_present}
                            onChange={(e) => handleFirstHalf(e, options.student_id)}
                          />
                        </Grid>
                      </Grid>
                      <Divider />

                      <Grid container direction='row'>
                        <Typography className={[classes.contentList, classes.paperStyle]}>
                          2<sup>nd</sup>
                          <span>&nbsp; Half</span>
                        </Typography>

                        <Grid style={{ marginLeft: '40%' }}>
                          {/* <Switch color='primary' /> */}
                          <Switch
                            color='primary'
                            checked={options.is_second_shift_present}
                            onChange={(e) => handleSecondHalf(e, options.student_id)}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })}
      </>
    );
  };

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper' style={{ marginLeft: '-10px' }}>
        <CommonBreadcrumbs componentName='Mark Attendance' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={12} xs={12}>
          <Typography>Today's attendance</Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              className='button'
              id='date-picker'
              label='Date'
              maxDate={new Date()}
              inputVariant='outlined'
              fullWidth
              value={dateValue}
              onChange={handleDateChange}
              // className='dropdown'
              style={{ width: '100%' }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onOpen={() => handleOpenOnViewDetails()}
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
                const ids = value.id;
                const secId = value.section_id;
                setSelectedSection(value);
                setSecSelectedId(secId);
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
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container direction='row'>
        <StyledClearButton
          variant='contained'
          onClick={handleBack}
          startIcon={<ClearIcon />}
        >
          Back
        </StyledClearButton>
        <StyledClearButton
          variant='contained'
          onClick={handleClearAll}
          startIcon={<ClearIcon />}
        >
          Clear All
        </StyledClearButton>

        <StyledFilterButton
          variant='contained'
          color='secondary'
          startIcon={<FilterFilledIcon className={classes.filterIcon} />}
          className={classes.filterButton}
          onClick={handleFilter}
        >
          filter
        </StyledFilterButton>
      </Grid>

      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={3}
        style={{ color: 'red', background: 'white' }}
      >
        <Grid
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: '10px',
          }}
          md={12}
          xs={12}
        >
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIosIcon />
            <Typography variant='h5'>{dateValueShow}</Typography>
            <ArrowForwardIosIcon />
          </Grid>
          <Grid>
            <Typography style={{ textAlign: 'center' }}>
              Number of Students: {data && data.length}
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Divider />
        </Grid>
        <Grid></Grid>
        <Grid
          container
          direction='row'
          className={classes.root}
          spacing={2}
          item
          justify='center'
        >
          <StudentData />
        </Grid>
        {!data && (
          <div style={{ width: '10%', margin: 'auto' }}>
            <SvgIcon component={() => <img src={unfiltered} />} />
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '20px', width: '250px' }
                      : { height: '50px', width: '400px' }
                  }
                  src={selectfilter}
                />
              )}
            />
          </div>
        )}
        <Grid item md={2} xs={12}></Grid>
        <Grid container justify='center'>
          {totalGenre > 8 && (
            <Pagination
              onChange={handlePagination}
              style={{ paddingLeft: '150px' }}
              count={Math.ceil(totalGenre / limit)}
              color='primary'
              page={pageNumber}
              color='primary'
            />
          )}
        </Grid>
      </Grid>
      {loading && <Loader />}
    </Layout>
  );
};

export default MarkAttedance;