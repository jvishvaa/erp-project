import React, { useState, useRef, useEffect } from 'react';
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
  const newBranches = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};




  const [view, setView] = useState(false);
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
    setBranchList(transformedData);
  }
  useEffect(() => {

    fetchBranches();
  },[])

  const handleBranch = (event, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
          console.log(value.id,"value");
      setSelectedBranch(value);
    }
  
   
  };

  return (
    <div>
      <Layout>
        <div style={{ marginLeft: '20px' }}>
          <div style={{ color: 'gray' }}>
            {' '}
            Activity Name-
            <span style={{ color: '#0000008c', fontWeight: 'bold' }}>
              {ActivityId?.activity_type_name}
            </span>
          </div>
        </div>
        <div style={{ marginLeft: '20px', cursor: 'pointer' }} onClick={goBack}>
          <div>
            {' '}
            <ArrowBackIcon style={{ color: '#0000008c' }} />{' '}
            <span style={{ color: 'gray' }}>Back to</span> &nbsp;
            <span style={{ color: '#0000008c', fontWeight: 'bold' }}>Blog Home</span>
          </div>
        </div>

        <div
          style={{
            background: '#F1F4F6',
            width: '96%',
            height: 'auto',
            marginLeft: '19px',
            paddingBottom: '9px',
            paddingTop: '6px',
          }}
        >
          <div style={{ marginLeft: '29px', marginTop: '9px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '16px', color: '#173260', fontWeight: '400' }}>
                topic Name:{' '}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  background: 'white',
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
            <div
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
            </div>
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
              getOptionLabel={(option) => option?.branch_name}
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
                  <Tab
                    label='Reviewed'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 1 ? classes.tabsFont : classes.tabsFont1}
                  />
                  <Tab
                    label='Published'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 2 ? classes.tabsFont : classes.tabsFont1}
                  />
                  <Tab
                    label='Not Submitted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 3 ? classes.tabsFont : classes.tabsFont1}
                  />
                   <Tab
                    label='Shortlisted'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 4? classes.tabsFont : classes.tabsFont1}
                  />
                </Tabs>
               

              </Grid>
            </Grid>
          </div>
          <div>
            {value == 1 && (
              <div style={{ marginRight: '49px' }}>
                <StarsIcon style={{ color: '#F7B519' }} /> Published &nbsp;&nbsp;{' '}
                <BookmarksIcon style={{ color: 'gray' }} /> Shortlisted
              </div>
            )}
          </div>
        </div>

        {value == 0 && <PendingReview  selectedBranch={selectedBranch}/>}
        {value == 1 && <Reviewed selectedBranch={selectedBranch}/>}
        {value == 2 && <Published selectedBranch={selectedBranch}/>}
        {value == 3 && <NotSubmitted selectedBranch={selectedBranch}/>}
        {value == 4 && <Shortlisted selectedBranch={selectedBranch}/>}

      </Layout>
    </div>
  );
};

export default BlogReview;
