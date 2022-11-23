import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
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
  IconButton
} from '@material-ui/core';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarsIcon from '@material-ui/icons/Stars';
import RatingScale from './RatingScale';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message } from 'antd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import { Autocomplete, Pagination } from '@material-ui/lab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import PendingReview from './PendingReview';
import PhysicalPendingReview from './PhysicalPendingReview';
import PhysicalReviewed from './PhysicalReviews';
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
import axios from 'axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {SearchOutlined} from '@ant-design/icons'

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

const PhysicalActivityReview = () => {
    const formRef = createRef();
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState(0);
    const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
    let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
    const newBranches = JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
    const user_level = dataes?.user_level;
    const [moduleId, setModuleId] = useState();
    const [view, setView] = useState(false);
    const [flag,setFlag] = useState(false);
    const [gradeList, setGradeList] = useState([]);
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const { setAlert } = useContext(AlertNotificationContext);
    const [academicYear, setAcademicYear] = useState([]);
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const goBack = () => {
        history.push('/blog/blogview');
    };
    const [title, setTitle] = useState('');
    const [loading,setLoading] = useState(false)
    const [boardId, setBoardId] = useState();
    const [boardListData, setBoardListData] = useState([]);
    const {Option} = Select;
    const [gradeId, setGradeId] = useState();
    const [gradeName, setGradeName] = useState();
    const [gradeData, setGradeData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
  // console.log(history,"history")
  // useEffect(() => {
  //   if (history?.location?.pathname === '/blog/addreview') {
  //     setTitle(history?.location?.state?.data);

  //   }
  // }, [history]);
  useEffect(() =>{
    if(moduleId){
      let branchIds = branch_update_user?.branches?.map((item) => item?.id)
      setLoading(true)
      axios
      .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`,
      {
        headers:{
          'X-DTS-HOST' : X_DTS_HOST,
        },
      })
      .then((response) =>{
        if(response?.data?.status_code === 200){
          setBranchList(response?.data?.result|| [])
          setLoading(false)
  
        }

      })
    }
  },[window.location.pathname, moduleId])

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
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
          });
        }
      });
    }
  }, [window.location.pathname]);

function callApi(api,key){
  setLoading(true)
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
      setLoading(false)
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
    setSelectedGrade([])
    if (value?.length) {
      const branchIds = value.map((obj) => obj?.id)
      // value =
      //   value.filter(({ id }) => id === 'all').length === 1
      //     ? [...branchList].filter(({ id }) => id !== 'all')
      //     : value;
      //     console.log(value.id,"value");
      //     // const selectedId = value.map((el) => el?.branch?.id);
      //     const selectedId = value.map((item) => item?.id)
      setSelectedBranch(value);
      // callApi(
      //   `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
      //   }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
      //   'gradeList'
      // );
      if(branchIds){
        setLoading(true)
        axios
        .get(`${endpoints.newBlog.activityGrade}?branch_ids=${branchIds}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) =>{
          // debugger;
          console.log(response?.data?.result);
          setGradeList(response?.data?.result)
          setLoading(false)
        })
  
      }

      }
  
   
  };

//   const handleGrade =(event, value) =>{
//     setSelectedGrade([])
//     if(value){
//       console.log(value,'hk 33')
//       setSelectedGrade(value)
//     }
//   }

  const handleGoBack = () =>{
    history.goBack()
  }

  const goSearch =() =>{
    setLoading(true)
    if(selectedBranch?.length === 0){
      setAlert('error','Please Select Branch');
      setLoading(false)
      return
    }else if(selectedGrade?.length == 0){
      setAlert('error', 'Please Select Grade');
      setLoading(false)
      return
    }else{
      setFlag(true);
      setLoading(false)
    }

  }

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];

  const handleClearBoard = () => {
    setBoardId('');
  };

  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  const fetchBoardListData = () => {
    axios
      .get(`/academic/get-board-list/`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBoardListData(result?.data?.result);
          // if (!boardFilterArr.includes(window.location.host)) {
          let data = result?.data?.result?.filter(
            (item) => item?.board_name === 'CBSE'
          )[0];
          setBoardId(data?.id);
          // }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };


  useEffect(()=>{
    fetchBoardListData()

  },[])

  const handleBoard = (e) => {
    setBoardId(e);
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    // setSubjectData([]);
    // setSubjectId('');
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    //   fetchSubjectData({
    //     session_year: selectedAcademicYear?.id,
    //     branch_id: selectedBranch?.branch?.id,
    //     module_id: moduleId,
    //     grade: item.value,
    //   });
    }
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const handleClearGrade = () => {
    setGradeId('');
    // setGradeName('');
    // setSubjectId('');
    // setSubjectName('');
  };

  const handleClearSubject = () => {
    // setSubjectId('');
    // setSubjectName('');
  };

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });

  return (
    <div>
      {loading && <Loader/>}
      <Layout>
      <Grid
        container
        direction='row'
        // style={{ paddingLeft: '22px', paddingRight: '10px' }}
      >
        <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
          {/* <Breadcrumbs
            style={{width:'70vw'}}
            separator={<NavigateNextIcon fontSize='small' style={{color:'black'}} />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' style={{fontSize:'18px'}}>
              <strong>physical Activity Management</strong>
            </Typography>
            <Typography color='textPrimary' style={{fontSize:'18px', fontWeight:'bold'}}>Activity</Typography>
            <Typography color='textPrimary' style={{fontSize:'18px', fontWeight:'bold'}}>{ActivityId?.title}</Typography>
          </Breadcrumbs> */}
          <div className='col-md-8' style={{zIndex:2, display: 'flex', alignItems:'center' }}>
          <div>
          <IconButton aria-label="back" onClick={handleGoBack}>
           <KeyboardBackspaceIcon style={{fontSize:'20px', color:'black'}}/>
          </IconButton>
          </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Physical Activities
              </Breadcrumb.Item>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Review
              </Breadcrumb.Item>
              <Breadcrumb.Item href='' className='th-grey th-16'>
              {ActivityId?.title}
              </Breadcrumb.Item>
            </Breadcrumb>

          </div>
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
            // marginLeft: '19px',
            paddingBottom: '9px',
            paddingTop: '6px',
          }}
        >
          <div style={{ marginLeft: '22px', marginTop: '9px' }}>
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
        <div className='row'>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              {/* {boardFilterArr.includes(window.location.host) && ( */}
                <div className='col-md-2 col-6 pl-0'>
                  <div className='mb-2 text-left'>Board</div>
                  <Form.Item name='board'>
                    <Select
                      placeholder='Select Board'
                      showSearch
                    //   defaultValue={'CBSE'}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleBoard(e);
                      }}
                      onClear={handleClearBoard}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {boardOptions}
                    </Select>
                  </Form.Item>
                </div>
              {/* )} */}
              <div className='col-md-2 col-6 px-0'>
                <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
                    allowClear
                    placeholder={
                      gradeName ? (
                        <span className='th-black-1'>{gradeName}</span>
                      ) : (
                        'Select Grade'
                      )
                    }
                    showSearch
                    disabled={user_level == 13}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleGrade(value);
                    }}
                    onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                <div className='mb-2 text-left'>Subject</div>
                <Form.Item name='subject'>
                  <Select
                    placeholder='Select Subject'
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    // onChange={(e, value) => {
                    //   handleSubject(value);
                    // }}
                    onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3 pt-3'>
                <ButtonAnt type="primary" 
                icon={<SearchOutlined />}
                onClick={goSearch}
                size={'medium'}>
                    Search
                </ButtonAnt>
              </div>
            </div>
          </Form>
        </div>

        </div>
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
                    {/* <Tab
                        label='Shortlisted'
                        classes={{
                        selected: classes.selected1,
                        }}
                        className={value === 3 ? classes.tabsFont : classes.tabsFont1}
                    /> */}

                  {/* { user_level==11 ? "" :
                  <Tab
                    label='Published'
                    classes={{
                      selected: classes.selected1,
                    }}
                    className={value === 4 ? classes.tabsFont : classes.tabsFont1}
                  />
                } */}
                  
                
                </Tabs>
              </Grid>
            </Grid>
          </div>
          <div>
            {value == 2 && (
              <div style={{ marginRight: '49px' }}>
                {/* <StarsIcon style={{ color: '#F7B519' }} /> Published &nbsp;&nbsp;{' '} */}
                <BookmarksIcon style={{ color: 'gray' }} /> Shortlisted
              </div>
            )}
          </div>
        </div>
        {console.log(value,'kl 33')}
        {value == 0 && <PhysicalPendingReview  selectedBranch={selectedBranch} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={selectedGrade} flag={flag} setFlag={setFlag} />}
        {/* {value == 1 && <NotSubmitted selectedBranch={selectedBranch} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={selectedGrade} flag={flag} setFlag={setFlag}/>} */}

        {value == 1 && <PhysicalReviewed selectedBranch={selectedBranch}  setValue={setValue} value={value} handleChange={handleChange} selectedGrade={selectedGrade} flag={flag} setFlag={setFlag} />}
        {/* {value == 3 && <Shortlisted selectedBranch={selectedBranch} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={selectedGrade} flag={flag} setFlag={setFlag}/>} */}
        {/* {value == 4 && <Published selectedBranch={selectedBranch} setValue={setValue} value={value} handleChange={handleChange} selectedGrade={selectedGrade} flag={flag} setFlag={setFlag}/>} */}


      </Layout>
    </div>
  );
};

export default PhysicalActivityReview;
