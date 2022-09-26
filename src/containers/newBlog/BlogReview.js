import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Tab,
  Box,
  Divider,
  Drawer,
  Breadcrumbs,
} from '@material-ui/core';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarsIcon from '@material-ui/icons/Stars';
import RatingScale from './RatingScale';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import { Autocomplete, Pagination } from '@material-ui/lab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import PendingReview from './PendingReview';
import Published from './Published';
import NotSubmitted from './NotSubmitted';
import Reviewed from './Reviewed';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import Shortlisted from './Shortlisted_1';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons'

const DEFAULT_RATING = 0;

const useStyles = makeStyles((theme) => ({
  branch: {
    fontSize: '12px',
    marginLeft: '20px',
    color: 'gray',
  },
  home: {
    marginLeft: '5px',
    marginTop: '-2px',
    marginBottom: '15px',
    fontSize: '15px',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
  topic: {
    marginLeft: '20px',
    background: '#F1F4F6',
  },
  topicName: {
    color: '#173260',
  },
  grade: {
    color: '#1B689A',
  },
}));

const BlogReview = () => {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [branchList, setBranchList] = useState([]);
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const newBranches = JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = useState();
  const [view, setView] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  console.log(ActivityId, 'ActivityId');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  // console.log(history,"history")
  // useEffect(() => {
  //   if (history?.location?.pathname === '/blog/addreview') {
  //     setTitle(history?.location?.state?.data);

  //   }
  // }, [history]);
  useEffect(() =>{
    if(moduleId){
      if(selectedAcademicYear?.id > 0)
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );

    }


  },[window.location.pathname, moduleId])

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Blogs' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'Blog Activity' 
              &&
              window.location.pathname === '/blog/activityreview'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
            // if (
            //   item.child_name === 'Create Rating' 
            //     // &&
            //     // window.location.pathname === '/erp-online-class-student-view'
            // ) {
            //   setModuleId(item.child_id);
            //   localStorage.setItem('moduleId', item.child_id);
            // }
          });
        }
      });
    }
  }, [window.location.pathname]);

function callApi(api,key){
  // setLoading(true)
  axiosInstance
    .get(api)
    .then((result) => {
      if(result.status === 200){
        if (key === 'academicYearList') {
          setAcademicYear(result?.data?.data || []);
          const viewMoreData = JSON.parse(localStorage.getItem('viewMoreData'));
          if (
            window.location.pathname !== '/erp-online-class-student-view' &&
            !viewMoreData?.academic
          )
            callApi(
              `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
              'branchList'
            );
        }
        if(key === 'branchList') {
          // debugger;  
          setBranchList(result?.data?.data?.results || [])
        }
        if(key === 'gradeList'){
          const gradeData = result?.data?.data || [];
          gradeData.unshift({
            grade_grade_name: 'Select All',
            grade_id:'all',
            id:'all',
          });
          setGradeList(gradeData);
        }

      }
    })
}

  const fetchBranches = () => {
    
    const transformedData = newBranches?.branches?.map((obj) => ({
      id: obj.id,
      branch_name: obj.name,
    }));
    transformedData.unshift({
      branch_name: 'Select All',
      id: 'all',
    });
    console.log(transformedData, 'branchdata');
    // setBranchList(transformedData);
  }
  useEffect(() => {

    fetchBranches();
  },[])

  const handleBranch = (event, value) => {
    setSelectedBranch([])
    if (value?.length) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
          console.log(value.id,"value");
          // const selectedId = value.map((el) => el?.branch?.id);
          const selectedId = value.map((item) => item?.id)
      setSelectedBranch(value);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
        'gradeList'
      );

    }
  
   
  };

  return (
    <div>
      <Layout>
      <Grid
        container
        direction='row'
        style={{ paddingLeft: '22px', paddingRight: '10px' }}
      >
        <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' variant='h6'>
              <strong>Activity Management</strong>
            </Typography>
            <Typography color='textPrimary' style={{fontSize:'23px', fontWeight:'bolder'}}>Activity</Typography>
            <Typography color='textPrimary' style={{fontSize:'23px', fontWeight:'bolder'}}>{ActivityId?.title}</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
        {/* <div style={{ marginLeft: '20px', cursor: 'pointer' }} onClick={goBack}>
          <div>
            {' '}
            <ArrowBackIcon style={{ color: '#0000008c' }} />{' '}
            <span style={{ color: 'gray' }}>Back to</span> &nbsp;
            <span style={{ color: '#0000008c', fontWeight: 'bold' }}>Blog Home</span>
          </div>
        </div> */}

        <div
          style={{
            // background: '#F1F4F6',
            width: '96%',
            height: 'auto',
            marginLeft: '19px',
            paddingBottom: '9px',
            paddingTop: '6px',
          }}
        >
          <div style={{ marginLeft: '29px', marginTop: '9px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '16px', fontWeight: '400' }}>
                Topic Name:{' '}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  // background: 'white',
                  fontWeight: 'bold',
                  width: '91%',
                  paddingLeft: '12px',
                  fontWeight: '500',
                  color: '#1C4FA8',
                }}
              >
                {ActivityId?.title}{' '}
              </div>
            </div>
            {/* <div
              style={{
                display: 'flex',
                color: '#1B689A',
                marginTop: '13px',
                fontSize: '14px',
              }}
            >
              <div> Grade:1</div>
              <div style={{ paddingLeft: '39px' }}> Total Assigned:100</div>
              <div style={{ paddingLeft: '36px' }}>
                {' '}
                Assigned On : {ActivityId?.submission_date?.slice(0, 10)}
              </div>
            </div> */}
          </div>
        </div>

        {/* <Grid container spacing={2} style={{ padding: '20px' }}> */}
        {/* <Grid item md={4} xs={12}> */}
        <div style={{ display: 'flex', padding: '20px' }}>
          <div style={{ width: '20%' }}>
          <Autocomplete
              multiple
              fullWidth
              size='small'
              limitTags={1}
              // style={{ width: '82%', marginLeft: '4px' }}
              options={branchList || []}
              value={selectedBranch || []}
              getOptionLabel={(option) => option?.branch?.branch_name}
              filterSelectedOptions
              onChange={(event, value) => {
                handleBranch(event, value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  variant='outlined'
                  label='Branch'
                />
              )}
            />
          </div>
          {/* </Grid> */}
          {/* <Grid item md={4} xs={12}> */}
          <div style={{ width: '21%', paddingLeft: '42px' }}>
            <Autocomplete
              // multiple
              fullWidth
              limitTags={1}
              size='small'
              className='filter-student meeting-form-input'
              // options={gradeList || []}
              // getOptionLabel={(option) => option?.name || ''}
              filterSelectedOptions
              // value={selectedGrade || []}
              // onChange={(event, value) => {
              //   handleGrade(event, value);
              // }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  variant='outlined'
                  label='Grade'
                />
              )}
            />
          </div>
          <div style={{ paddingLeft: '39px' }}>
            {/* </Grid> */}
            {/* <Grid item md={2} xs={12}> */}
            <Button style={{ width: '112px', backgroundColor: 'primary' }}>Search</Button>
          </div>
          <div style={{ paddingLeft: '39px' }}>
            <Button 
            variant="contained"
            color='primary'
            onClick={goBack}
            style={{ width: '112px',}}>Back</Button>
          </div>
        </div>

        {/* </Grid>
        </Grid> */}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Grid container style={{ paddingLeft: '21px' }}>
              <Grid item md={12} xs={12} className={classes.tabStatic}>
                <Tabs
                  onChange={handleChange}
                  textColor='primary'
                  indicatorColor='primary'
                  // className={ classes.tabsFont}
                  value={value}
                >
                  <Tab
                    label='Pending Review'
                    classes={{
                      selected: classes.selected2,
                    }}
                    className={value === 0 ? classes.tabsFont : classes.tabsFont1}
                  />
                    {/* <Tab
                    label='Not Submitted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 1 ? classes.tabsFont : classes.tabsFont1}
                  /> */}
                  <Tab
                    label='Reviewed'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 1 ? classes.tabsFont : classes.tabsFont1}
                  />
                    <Tab
                    label='Shortlisted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 2? classes.tabsFont : classes.tabsFont1}
                  />

                  { user_level==11 ?"":
                  <Tab
                    label='Published'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 3 ? classes.tabsFont : classes.tabsFont1}
                  />
                }
                  
                
                </Tabs>
              </Grid>
            </Grid>
          </div>
          <div>
            {value == 2 && (
              <div style={{ marginRight: '49px' }}>
                <StarsIcon style={{ color: '#F7B519' }} /> Published &nbsp;&nbsp;{' '}
                <BookmarksIcon style={{ color: 'gray' }} /> Shortlisted
              </div>
            )}
          </div>
        </div>
        {console.log(value,'kl 33')}
        {value == 0 && <PendingReview  selectedBranch={selectedBranch} setValue={setValue} value={value} handleChange={handleChange} />}
        {/* {value == 1 && <NotSubmitted selectedBranch={selectedBranch}/>} */}

        {value == 1 && <Reviewed selectedBranch={selectedBranch}/>}
        {value == 2 && <Shortlisted selectedBranch={selectedBranch}/>}
        {value == 3 && <Published selectedBranch={selectedBranch}/>}


      </Layout>
    </div>
  );
};

export default BlogReview;
