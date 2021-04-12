import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Layout/index';
import Avatar from '@material-ui/core/Avatar';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state'
import {Link, useHistory} from 'react-router-dom';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import Group from '../../assets/images/Group.png';

import ClearIcon from '../../components/icon/ClearIcon';

import { deepOrange, deepPurple } from '@material-ui/core/colors';
import OutlinedFlagRoundedIcon from '@material-ui/icons/OutlinedFlagRounded';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',

    width: '100%',

    margin: '1.5rem -0.1rem',
  },

  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const AttedanceCalender = () => {
  const classes = useStyles();
  const moduleId = 178;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [academicYear,setAcademicYear] = useState([]);
  const [selectedAcademicYear,setSelectedAcadmeicYear] = useState('');  
  const [branchList,setBranchList] = useState([])
  const [selectedBranch,setSelectedBranch] = useState([])
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([])
  const [studentData, setStudentData] = useState([])
  const history = useHistory();

  useEffect(() => {
    callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
    // callApi(`${endpoints.academics.branches}`,'branchList');
    //   callApi(
    //       `${endpoints.academics.grades}?branch_id=${selectedBranch.id}&module_id=15`,
    //       'gradeList'
    //   );
  }, []);

const handleFilter = ()=>{
 
  let startDate = "2021-04-08";
  let endDate = "2021-04-14";
  // console.log(payload)
  axiosInstance.
  get(
    `${endpoints.academics.attendance}?academic_year=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}&start_date=${startDate}&end_date=${endDate}`
  )
  .then(res=>{
    console.log(res.data)
    let temp = [...res.data.absent_list, ...res.data.present_list]
    console.log(temp)
    setStudentData(temp)
  })
  .catch(err=>console.log(err))
}
    

const handleViewDetails = ()=>{

  const payload = {
    academic_year_id: selectedAcademicYear,
    branch_id: selectedBranch,
    grade_id: selectedGrade,
    section_id: selectedSection,
    startDate: "2021-04-08",
    endDate: "2021-04-14"
  }
  history.push({
    pathname:'/OverallAttendance',
    state:{
      data: studentData,
      payload: payload
    }
  })
}

const handleMarkAttendance = ()=>{
  const payload = {
    academic_year_id: selectedAcademicYear,
    branch_id: selectedBranch,
    grade_id: selectedGrade,
    section_id: selectedSection,
    startDate: "2021-04-08",
    endDate: "2021-04-14"
  }
  history.push({
    pathname:'/markattedance',
    state:{
      data: studentData,
      payload: payload
    }
  })
}

  function callApi(api, key) {
    setLoading(true);
    axiosInstance.get(api)
    .then((result) => {
        if (result.status === 200) {
          if(key === 'academicYearList'){
            console.log(result?.data?.data || [])
            setAcademicYear(result?.data?.data || [])
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [])
            setBranchList(result?.data?.data?.results || []);
          }
            if (key === 'gradeList') {
              console.log(result?.data?.data || [])
                setGradeList(result.data.data || []);
            }
            if (key === 'section') {
              console.log(result?.data?.data || [])
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
      height: '42px',
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
  const [value, setValue] = React.useState([null, null]);

  return (
    <Layout>
      {/* <CommonBreadcrumbs componentName='Attedance+Calender' /> */}
      <div className='profile_breadcrumb_wrapper'>
          <CommonBreadcrumbs componentName='Attedance + Calender' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedAcadmeicYear(value)
                console.log(value, "test")
                if(value){
                  callApi(
                    `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                    'branchList'
                  );
                }
                setSelectedGrade([]);
                setSectionList([]);
                setSelectedSection([]);
                setSelectedBranch([])

              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedAcademicYear}
              options={academicYear}
              getOptionLabel={(option) => option?.session_year}
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
                setSelectedBranch([])
                if(value){
                  // const ids = value.map((el)=>el)
                  const selectedId=value.branch.id
                  setSelectedBranch(value)
                  console.log(value)
                  callApi(
                    `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                    'gradeList'
                  );
                }
                setSelectedGrade([]);
                setSectionList([]);
                setSelectedSection([]);

              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch}
              options={branchList}
              getOptionLabel={(option) => option?.branch?.branch_name}
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
                setSelectedGrade([])
                if(value){
                  // const ids = value.map((el)=>el)
                  const selectedId=value.grade_id
                  // console.log(selectedBranch.branch)
                  const branchId=selectedBranch.branch.id
                  setSelectedGrade(value)
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
              // multiple
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedSection([])
                if (value) {
                  const ids=value.id
                  const secId=value.section_id
                  setSelectedSection(value)
                  setSecSelectedId(secId)
                }

              }}
              id='section_id'
              className='dropdownIcon'
              value={selectedSection}
              options={sectionList}
              getOptionLabel={(option) => option?.section__section_name || option?.section_name}
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
        <Grid container direction='row' className={classes.root} spacing={3} >
          <StyledClearButton
            variant='contained'
            startIcon={<ClearIcon />}
            // href={`/markattedance`}
          >
            Clear all
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
      </Grid>
      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={3}
        style={{ background: 'white' }}
      >
        <Grid item md={6}></Grid>
        <Grid item md={2}>
          <Paper elevation={3} className={classes.paperSize}>
            <Grid container direction='row' className={classes.root}>
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary' >
                  Attedance
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small' onClick={handleMarkAttendance}>
                  <span className={classes.contentData}>MarkAttendance</span>
                </Button>
              </Grid>
              <Grid item md={5}>
                <Typography className={classes.content}>Student</Typography>
              </Grid>
              <KeyboardArrowDownIcon />
            </Grid>
              {
                studentData && studentData.slice(0,5).map((item)=>(
                    <Grid key={value} item container justify="center" style={{display:'flex', justifyContent:'center'}}>
                      <Avatar className={[classes.orange, classes.paperStyle, classes.small]}>
                        {item.student_first_name.slice(0, 1)}
                      </Avatar>
                      <Typography
                        className={[classes.content, classes.paperStyle]}
                        style={{fontSize:'12px'}} 
                      >
                        {item.student_first_name.slice(0, 6) || ""}
                      </Typography>
                      <Typography style={{fontSize:'12px'}}>3days present</Typography>
                    </Grid>
                ))
                
              }
              {
                studentData ? 
                (
                  <div style={{display:'flex', justifyContent:'center'}}>
                    <Button onClick={handleViewDetails}>
                      view details
                    </Button>
                  </div>
                )
                : ""
              }
            <img src={Group} width='100%' height=' 504px' />
          </Paper>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={2}>
          <Paper elevation={3} className={[classes.root, classes.paperSize]}>
            <Grid container direction='row'>
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary'>
                  Event
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button size='small' fullWidth>
                  ADD EVENT
                </Button>
              </Grid>
              <Grid item md={5}>
                <Typography className={classes.contentsmall}>Event Details</Typography>
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.contentsmall}>
                  Updated:1 Day ago
                </Typography>
              </Grid>
            </Grid>

            <Paper elevation={1}>
              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>

              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>

              <Typography className={[classes.contentsmall, classes.root]}>
                12 December 2020
                <br />
                <Grid container direction='row'>
                  <OutlinedFlagRoundedIcon
                    style={{ background: '#78B5F3', borderRadius: '30px' }}
                  />
                  <Typography> Event Name</Typography>
                </Grid>
                <Grid container direction='row'>
                  <WatchLaterOutlinedIcon color='primary' className={classes.content} />
                  11:20AM
                  <EventOutlinedIcon color='primary' className={classes.content} />
                  11-01-2021
                </Grid>
                <Typography className={classes.contentData}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna
                </Typography>
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AttedanceCalender;
