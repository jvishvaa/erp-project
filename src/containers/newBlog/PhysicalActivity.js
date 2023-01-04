import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Loader from '../../components/loader/loader';


import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  makeStyles,
  Typography,
  Grid,
  MenuItem,
  TextareaAutosize,
  Paper,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  Drawer,
  TablePagination,
  InputAdornment,
  DialogActions,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Layout from 'containers/Layout';
import Close from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ForumIcon from '@material-ui/icons/Forum';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {PieChartOutlined, IdcardOutlined, DownOutlined} from '@ant-design/icons';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message } from 'antd';

import {
    AppstoreAddOutlined,
    SearchOutlined,
  } from '@ant-design/icons';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  searchTable: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },

  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },
  tabStyle: {
    color: 'white !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tabStatic: {
    position: 'static',
    paddingLeft: '19px',
    paddingRight: '39px',
    paddingTop: '36px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
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
}));


const dummyData = [
    {id:1,title:"harsha", date:'28/7'},
    {id:2,title:"harsha2", date:'28/7'},
]

const subActivityData = [
  {id:1,branch_name:"Cycling", date:'28/7'},
  {id:2,branch_name:"Swimming", date:'28/7'},
]

const PhysicalActivity = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList)
  const formRef = createRef();
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const branchIdsLocal = role_details?.branch ? role_details?.branch.map((obj) => obj.id) : [];
  const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeData, setGradeData] = useState([]);
  const [gradeName, setGradeName] = useState();
  const [moduleId, setModuleId] = React.useState('');
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  // const [boardListData, setBoardListData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [drawers, setDrawers] = useState(false);
  const [value, setValue] = useState(0);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [preview, setPreview] = useState(false);
  const [totalCountUnassign,setTotalCountUnassign] = useState(0);
  const [currentPageUnassign,setCurrentPageUnassign] = useState(1)
  const [totalPagesUnassign,setTotalPagesUnassign] = useState(0);
  const [limitUnassign,setLimitUnassign] = useState(10);
  const [isClickedUnassign, setIsClickedUnassign] = useState(false);
  const [totalCountAssigned,setTotalCountAssigned] = useState(0);
  const [currentPageAssigned,setCurrentPageAssigned] = useState(1)
  const [boardId, setBoardId] = useState();
  const [totalPagesAssigned,setTotalPagesAssigned] = useState(0);
  const [limitAssigned,setLimitAssigned] = useState(10);
  const [isClickedAssigned, setIsClickedAssigned] = useState(false);
  const [searchFlag,setSearchFlag] = useState(false)
  const [loading,setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
  const physicalActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId'))
  // const newBranches = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const [subjectData, setSubjectData] = useState([]);
  const token = dataes?.token;
  const user_level = dataes?.user_level;
  const { Option } = Select;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [subActivityId,setSubActivityId] = useState('')
  const [sudActId,setSubActId] = useState(history?.location?.state?.subActiveId);
  const [subActivityListData,setSubActivityListData] = useState([])

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];


  useEffect(() => {
    setLoading(true)
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
              window.location.pathname === '/blog/wall/central/redirect'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
              setLoading(false)
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

  const handleBranch = (event, value) => {
    setSelectedBranch([])
    // setAssigneds([])
    setUnAssigneds([])
    if (value?.length) {
      // value =
      //   value.filter(({ id }) => id === 'all').length === 1
      //     ? [...branchList].filter(({ id }) => id !== 'all')
      //     : value;
      // console.log(value.id, 'value');
      setSelectedBranch(value);
    }
  };


  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];
  const statuss = [
    { label: 'Assigned', value: '1' },
    { label: 'Unassigned', value: '2' },
  ];

  function handleTab(event, newValue) {
    setValue(newValue);
  }
  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);
  const [branchList, setBranchList] = useState([]);

  const viewed = () => {
    setViewed(true);
  };
  const handleClose = () => {
    setViewed(false);
  };
  const createPush = () => {
    history.push('/blog/create');
  };
  const branchViewed = () => {
    setBranchView(false);
    setBranchSearch(true);
  };
  const shortList = () => {
    history.push('/blog/short');
  };
  const [data, setData] = useState('');
  const handleDate = (data) => {
    setBranchView(true);
    setBranchSearch(false);
    setData(data);
  };
  const [assigned, setAssigned] = useState(false);
  const [userId, setUserId] = useState('');
  const assignIcon = (response) => {
    setUserId(response?.id);
    setAssigned(true);
  };
  const closeconfirm = () => {
    setAssigned(false);
  };
  const todayDate = moment();

  const confirmassign = () => {
    let body = {
      is_draft: false,
      issue_date: todayDate.format().slice(0, 19),
    };
    setLoading(true)
    axios
      .put(`${endpoints.newBlog.confirmAssign}${userId}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setAssigned(false);
        setAlert('success', 'Activity Successfully Assign');
        getUnAssinged();
        // getAssinged();
        setLoading(false)
      });
  };

  const [unassingeds, setUnAssigneds] = useState([]);
  const getUnAssinged = () => {
    const branchIds = selectedBranch.map((obj) => obj.id);
    setLoading(true)
    axios
      .get(
        `${endpoints.newBlog.unAssign}?section_ids=null&user_id=null&branch_ids=${branchIds}&is_draft=true&page=${currentPageUnassign}&page_size=${limitUnassign}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        if(response.status === 200){
          setTotalCountUnassign(response?.data?.total)
          setTotalPagesUnassign(response?.data?.page_size)
          setCurrentPageUnassign(response?.data?.page)
          setLimitUnassign(Number(limitUnassign))
          setSearchFlag(false)
          setUnAssigneds(response?.data?.result);
          setLoading(false)
        } else{
          setLoading(false)
        }
      });
  };
  const [assingeds, setAssigneds] = useState([]);


  // useEffect(()=>{
  //   setAssigneds(dummyData)
  // },[])

  useEffect(()=>{
    getAssinged()
  },[currentPageAssigned,sudActId,boardId])
  const getAssinged = () => {
    // const branchIds = selectedBranch.map((obj) => obj.id);
    setLoading(true)
    axios
      .get(
        `${endpoints.newBlog.physicalActivityListApi}?section_ids=null&user_id=null&is_draft=false&page=${currentPageAssigned}&page_size=${limitAssigned}&activity_type=${sudActId ? sudActId : physicalActivityId}&branch_ids=${branchIdsLocal}`,{
          params: {
            ...(boardId ? {branch_ids: boardId} : {})
          },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        } 
      )
      .then((response) => {
        if(response?.status == 200){
          setTotalCountAssigned(response?.data?.total)
          setTotalPagesAssigned(response?.data?.page_size)
          setCurrentPageAssigned(response?.data?.page)
          setLimitAssigned(Number(limitAssigned))
          setSearchFlag(false)
          setAssigneds(response?.data?.result);
            // setAssigneds(dummyData)
          setLoading(false)

        }else{
          setAlert('error', 'Server Issue ')
          setLoading(false)
        }
      });
  };
  const viewedAssign = (data) => {
    if(data){
      localStorage.setItem('ActivityId', JSON.stringify(data));
  
      history.push({
        pathname: '/physical/activity/review',
        state: {
          data,
        },
      });

    }
  };

  useEffect(() =>{
    if(moduleId && branch_update_user){
      if(selectedAcademicYear?.id > 0)
    var branchIds = branch_update_user?.branches?.map((item) => item?.id)
    setLoading(true)
    axios
    .get(
      `${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`,
      {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      }
    )
    .then((response) => {
      if(response?.data?.status_code === 200){
        setBranchList(response?.data?.result|| [])
        setLoading(false)

      }else{
        setLoading(false)
      }
    });
    }

  },[window.location.pathname, moduleId])

  console.log(unassingeds,'@@')

  function callApi(api,key) {
    axiosInstance
    .get(api)
    .then((result) => {
      if(result.status === 200){
        if(key === 'branchList'){
          setBranchList(result?.data?.data?.results || [])
        }
      }
    })
  }
  const fetchBranches = async () => {
    const newBranches =
      (await JSON?.parse(localStorage?.getItem('ActivityManagementSession'))) || {};
    if(newBranches?.length !== undefined){
      const transformedData = newBranches?.branches?.map((obj) => ({
        id: obj?.id,
        name: obj?.name,
      }));
      transformedData.unshift({
        name: 'Select All',
        id: 'all',
      });
      // setBranchList(transformedData);
    }
  };
  useEffect(() => {
    // ActvityLocalStorage();

    fetchBranches();
  }, []);


  useEffect(() => {
    if(selectedBranch?.length !== 0 && searchFlag){
      getUnAssinged();
      getAssinged();
    }
  }, [value, selectedBranch, searchFlag,currentPageAssigned,currentPageUnassign]);
  const [previewData, setPreviewData] = useState();
  const handlePreview = (data) => {
    setLoading(true)
    setPreview(true);
    axios
      .get(`${endpoints.newBlog.previewDetails}${data?.id}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        // setAssignPreview(response);
        setPreviewData(response?.data?.result);
        setLoading(false)
      });
  };
  const closePreview = () => {
    setPreview(false);
  };
  const ActvityLocalStorage = () => {
    setLoading(true)
    axios
      .post(
        `${endpoints.newBlog.activityWebLogin}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
      });
  };

  const [activityStorage, setActivityStorage] = useState([]);
  const getActivitySession = () => {
    setLoading(true)
    axios
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        setActivityStorage(response.data.result);
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
      });
  };

  const EditActivity = (data) => {
    history.push({
      pathname: '/blog/admineditcreateblogs',
      state: {
        data,
      },
    });
  };

  const handleSearch = (event,value) =>{
    if(selectedBranch?.length === 0){
      setAlert('error','Please Select Branch')
      return
    }else{
      setSearchFlag(true)

    }
  }

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          if (user_level == 13) {
            // setGradeId(res?.data?.data[0]?.grade_id);
            setGradeName(res?.data?.data[0]?.grade__grade_name);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.subjects}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          // setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() =>{
    // fetchBoardListData()
    fetchSubActivityListData()
  },[])

const fetchSubActivityListData = () => {
  axiosInstance
    .get(`${endpoints.newBlog.subActivityListApi}?type_id=${sudActId ? sudActId : physicalActivityId }`,{
      headers: {
        'X-DTS-HOST': X_DTS_HOST,
      },
    })
    .then((result) =>{
      setLoading(false)
      console.log(result?.data?.result,'sub')
      setSubActivityListData(result?.data?.result)
    })
}


  // const fetchBoardListData = () => {
  //   axios
  //     .get(`/academic/get-board-list/`)
  //     .then((result) => {
  //       if (result?.data?.status_code === 200) {
  //         setBoardListData(result?.data?.result);
  //         // if (!boardFilterArr.includes(window.location.host)) {
  //         let data = result?.data?.result?.filter(
  //           (item) => item?.board_name === 'CBSE'
  //         )[0];
  //         setBoardId(data?.id);
  //         // }
  //       }
  //     })
  //     .catch((error) => {
  //       message.error(error.message);
  //     });
  // };

  const handlePaginationAssign = (event, page) =>{
    setSearchFlag(true)
    setIsClickedAssigned(true);
    setCurrentPageAssigned(page);
  }
  const handlePaginationUnassign = (event, page) =>{
    setSearchFlag(true)
    setIsClickedUnassign(true);
    setCurrentPageUnassign(page);
  }

  const createPushBlogWall = () => {
    history.push('/blog/wall');
  };

  const redirectBMI = () => {
    history.push('/bmi/view');
  }

  const handleGoBack = () =>{
    history.goBack()
  }
  const handleSubActivity =(e) => {
    setSubActivityId(e)
    setSubActId(e)
  }

  const handleClearSubActivity = (e) => {
    setSubActivityId('')
    
  }
  const handleBoard = (e,value) => {
    setBoardId(e);
  };
  const handleClearBoard = () => {
    setBoardId('');
  };

  const handleSubject = (item) => {
    // formRef.current.setFieldsValue({
    //   board: [],
    // });
    // if (item) {
    //   setSubjectId(item.value);
    //   setSubjectName(item.children);
    // }
  };

  const handleClearGrade = () => {
    // setGradeId('');
    // setGradeName('');
    // setSubjectId('');
    // setSubjectName('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
const branchOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const subActivityOption = subActivityListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.sub_type}
      </Option>
    );
  });


  return (
    <div>
      {loading && <Loader/>}
    <Layout>
      <Grid
        container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '22px',
          paddingBottom: '15px',
        }}
      >
        <div className='col-md-6' style={{zIndex:2, display: 'flex', alignItems:'center' }}>
        <div>
          <IconButton aria-label="back" onClick={handleGoBack}>
           <KeyboardBackspaceIcon style={{fontSize:'20px', color:'black'}}/>
          </IconButton>
          </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Physical Activity
              </Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <div className='col-md-4' style={{zIndex:2, display: 'flex', alignItems:'center', justifyContent:'end' }}>
            <ButtonAnt type="primary" icon={<AppstoreAddOutlined />} 
            size={'large'}
            onClick={createPush}
            >
              Create Physical Activity
            </ButtonAnt>
        </div>
        <div className='col-md-2' style={{zIndex:2, display: 'flex', alignItems:'center', justifyContent:'center' }}>
            <ButtonAnt type="primary" icon={<AppstoreAddOutlined />} 
            size={'large'}
            onClick={redirectBMI}
            >
              Add BMI
            </ButtonAnt>
        </div>
        <div className='row'>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              {/* {boardFilterArr.includes(window.location.host) && ( */}
                <div className='col-md-2 col-6 pl-0'>
                  <div className='mb-2 text-left'>Sub-Activity </div>
                  <Form.Item name='board'>
                    <Select
                      // allowClear={true}
                      placeholder='Select Sub-Activity'
                      showSearch
                      suffixIcon={<DownOutlined className='th-grey' />}
                      // defaultValue={'CBSE'}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSubActivity(e);
                      }}
                      onClear={handleClearSubActivity}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {subActivityOption}
                    </Select>
                  </Form.Item>
                </div>
              <div className='col-md-2 col-6 px-0'>
                <div className='mb-2 text-left'>Branch</div>
                <Form.Item name='branch'>
                    <Select
                        showSearch
                        placeholder='Select Branch'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        // className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        placement='bottomRight'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        dropdownMatchSelectWidth={false}
                        onChange={(e) => handleBoard(e,value)}
                        allowClear={true}
                        onClear={handleClearBoard}
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                      >
                        {branchOptions}
                      </Select>
                </Form.Item>
              </div>
              {/* <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
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
                    // onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div> */}
              <div className='col-md-2 col-6 pr-0 px-0 pl-md-3 mt-3' style={{display:'flex', paddingTop:'5px'}}>
                <div  className='mb-2 text-left'>  </div>
                {/* <ButtonAnt type="primary" icon={<SearchOutlined />} size={'medium'}  onClick={handleSearch}>
                  Search
                </ButtonAnt> */}
              </div>
            </div>
          </Form>
        </div>
        </div>

      </Grid>
      <Grid>
        <Paper className={`${classes.root} common-table`} id='singleStudent'>
          <TableContainer
            className={`table table-shadow view_users_table ${classes.container}`}
          >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className={`${classes.columnHeader} table-header-row`}>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    S No.
                  </TableCell>
                  {/* <TableCell className={classes.tableCell}>Grade </TableCell> */}
                  <TableCell className={classes.tableCell}>Topic Name</TableCell>
                  <TableCell className={classes.tableCell}>Assigned On</TableCell>
                  <TableCell className={classes.tableCell}>Created By</TableCell>
                  <TableCell style={{ width: '252px' }} className={classes.tableCell}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              {assingeds?.map((response, index) => (
                <TableBody>
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    // key={`user_table_index${i}`}
                  >
                    <TableCell className={classes.tableCells}>{index + 1 + (Number(currentPageAssigned) -1) * limitAssigned}</TableCell>
                    <TableCell className={classes.tableCells}>{response.title}</TableCell>
                    <TableCell className={classes.tableCells}>
                      {moment(response?.created_at).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.creator?.name}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      <ButtonAnt
                        type="primary" 
                        icon={<PieChartOutlined />} 
                        size={'medium'}
                        onClick={() => viewedAssign(response)}
                        >
                        Review
                      </ButtonAnt>
                      &nbsp;&nbsp;
                      {/* <Button
                        variant='outlined'
                        size='small'
                        className={classes.buttonColor2}
                        onClick={() => handlePreview(response)}
                      >
                        Preview
                      </Button> */}
                      <ButtonAnt
                        type="primary" 
                        icon={<IdcardOutlined />} 
                        size={'medium'}
                        style={{backgroundColor:'#ff9800', border:'1px solid #ff9800'}}
                        // onClick={() => viewedAssign(response)}
                        onClick={() => handlePreview(response)}
                        >
                        Preview
                      </ButtonAnt>
                      &nbsp;&nbsp;
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
            <TablePagination
              component='div'
              count={totalCountAssigned}
              rowsPerPage={limitAssigned}
              page={Number(currentPageAssigned) - 1}
              onChangePage={(e, page) => {
              handlePaginationAssign(e, page + 1);
              }}
              rowsPerPageOptions={false}
              className='table-pagination'
              classes={{
                spacer: classes.tablePaginationSpacer,
                toolbar: classes.tablePaginationToolbar,
              }}
            />
          </TableContainer>
        </Paper>

      </Grid>

      <Dialog open={preview} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
        <div style={{ width: '642px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
            }}
          >
            <DialogTitle id='confirm-dialog'>Preview</DialogTitle>
            <div style={{ marginTop: '21px', marginRight: '34px' }}>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={closePreview} />
            </div>
          </div>

          <div
            style={{
              border: '1px solid lightgray',
              height: ' auto',
              // width: '100%',
              marginLeft: '16px',
              marginRight: '32px',
              borderRadius: '10px',
              marginBottom: '9px',
            }}
          >
            <div style={{ marginLeft: '23px', marginTop: '28px', overflow:'scroll' }}>
              <div style={{ fontSize: '15px', color: '#7F92A3' }}>{}</div>
              <div style={{ fontSize: '21px' }}>{previewData?.title}</div>
              <div style={{ fontSize: '10px', color: '#7F92A3' }}>
              Submission on -{previewData?.submission_date?.substring(0, 10)}
              </div>
              <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                Branch -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.branches.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Grade -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.grades.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Section -&nbsp;
                <span style={{ color: 'black' }}>
                  {previewData?.sections.map((obj) => obj?.name).join(', ')},{' '}
                </span>
              </div>
              <div style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}>
                {/* word limit -300 */}
              </div>
              <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                Instructions
              </div>
              <div style={{ paddingTop: '8px', fontSize: '16px' }}>
                {previewData?.description}
              </div>
              {/* <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                <img src={previewData?.template?.template_path} width='50%' />
              </div> */}
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        // open={assigned}
        // onClose={handleClose}
        maxWidth={maxWidth}
        style={{ borderRadius: '10px' }}
      >
        <div style={{ width: '503px' }}>
          <div style={{ textAlign: 'center' }}>
            <div>
              <DoneIcon style={{ color: 'green', fontSize: '81px' }} />
            </div>
            <div style={{ fontSize: '20px', marginBottom: '2px' }}>
              Blog Successfully Assigned
            </div>
            <div style={{ fontSize: '15px', marginBottom: '24px' }}>
              Check Assigned tab for new submissions
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Button variant='contained' size='small'>
                Okay
              </Button>{' '}
            </div>
          </div>
        </div>
      </Dialog>

      {assigned == true && (
        <Dialog
          open={assigned}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='draggable-dialog-title'>
            <strong>Assign Details</strong>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to assign ?</DialogContentText>
          </DialogContent>

          <Divider className={classes.divider} />
          <DialogActions>
            <Button style={{ backgroundColor: 'lightgray' }} onClick={closeconfirm}>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={confirmassign}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={view}
        maxWidth={maxWidth}
      >
        {' '}
        <div style={{ width: '700px' }}>
          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            style={{ justifyContent: 'space-between' }}
          >
            <Grid item>
              <Typography>
                <strong
                  style={{ fontSize: '14px', color: themeContext.palette.primary.main }}
                >
                  Please Select Your Branch
                </strong>
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size='small' style={{ visibility: 'hidden' }}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={() => handleClose()}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />
          <Grid
            container
            direction='row'
            style={{ marginLeft: '5px', marginBottom: '20px' }}
          >
            {branchView == true && (
              <Grid item>
                Branch Name:{' '}
                <Button
                  size='small'
                  color='primary'
                  className={classes.buttonColor}
                  variant='contained'
                  onClick={branchViewed}
                  endIcon={<ArrowDropDownIcon />}
                  style={{ width: '576px' }}
                >
                  {data == '' ? 'Select' : data.label}
                </Button>
              </Grid>
            )}
            {data && (
              <Grid
                item
                style={{
                  marginLeft: '580px',
                  marginTop: '25px',
                }}
              >
                <Button variant='contained' size='small' color='primary'>
                  {' '}
                  Proceed
                </Button>
              </Grid>
            )}
            {branchSearch == true && branchView == false && (
              <Grid item style={{ display: 'flex' }}>
                Branch Name:&nbsp;
                <Paper
                  style={{
                    border: '1px solid gray',
                    width: '576px',
                    height: '321px',
                    overflowY: 'auto',
                  }}
                >
                  <div>
                    <TextField
                      placeholder='Type Text...'
                      style={{ background: 'lightgray', width: '574px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant='standard'
                    />
                  </div>
                  <div>
                    <TableContainer>
                      <Table aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.searchTable}>
                              Branch Name
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Total Submitted
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Reviewed
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Review Pending
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {months.map((option) => (
                            <TableRow
                              key={option.value}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDate(option)}
                            >
                              <TableCell component='th' scope='row'>
                                {option.value}
                              </TableCell>
                              <TableCell align='right'>{option.label}</TableCell>
                              <TableCell align='right'>22</TableCell>
                              <TableCell align='right'>30</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </Dialog>
    </Layout>
    </div>
  );
};
export default PhysicalActivity;
