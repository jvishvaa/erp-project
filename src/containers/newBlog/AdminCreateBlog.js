import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  makeStyles,
  Typography,
  Grid,
  Breadcrumbs,
  Tooltip,
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
  Select,
  Dialog,
  DialogTitle,
  Checkbox,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
import Carousel from "react-elastic-carousel";




import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import BackupIcon from '@material-ui/icons/Backup';

import {
  fetchBranchesForCreateUser as getBranches,
  fetchGrades as getGrades,
  fetchSections as getSections,
  fetchSubjects as getSubjects,
} from '../../redux/actions';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  customFileUpload: {
    border: '1px solid black',
    padding: '6px 12px',

    cursor: 'pointer',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: `${theme.palette.secondary.main} !important`,
    backgroundColor: 'white',
  },
  buttonColor1: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
tickSize:{
  transform: "scale(2.0)",
},
}));

const AdminCreateBlog = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};

  const history = useHistory();
  const [branchList, setBranchList] = useState([]);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading,setLoading]= useState(false);

  const [assigned, setAssigned] = useState(false);

  const [sectionDropdown, setSectionDropdown] = useState([]);

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [activityName, setActivityName] = useState([]);
  const [changeText,setChangeText]=useState("");
  const [visible,setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });

  // console.log(branches,"branchesdropdown");
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const handleEditorChange = (content, editor) => {
    setDesc(content);
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
  console.log(history.location.pathname == '/blog/create', 'history');
  const handleChangeActivity = (e, value) => {
    setActivityName([])
    setSelectedBranch([])
    setSelectedGrade([])
    setSelectedSection([])
    setVisible(false)
    if(value){
      setVisible(true)
      console.log(e,"event",value);
      setActivityName(value);
    }
  };
  const handleChangeText = (e, value) => {
    setChangeText(value);
  };

  // `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`

  const fetchBranches = () => {
    axiosInstance
      .get(`${endpoints.newBlog.activityBranch}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log('res', res);
        if (res?.data) {
          const transformedData = res?.data?.result?.map((obj) => ({
            id: obj.id,
            name: obj.name,
          }));
          transformedData.unshift({
            name: 'Select All',
            id: 'all',
          });
          console.log(transformedData, 'branchdata');
          setBranchList(transformedData);
        }
      });
    // })
  };

  let allGradeIds = [];

  const fetchGrades = (value) => {
    const ids = value.map((el) => el.id) || [];
    // setGradeIds(ids);
    axiosInstance
      .get(`${endpoints.newBlog.activityGrade}?branch_ids=${ids}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res, 'result');
        if (res) {
          const gradeData = res?.data?.result || [];
          for (let i = 0; i < gradeData?.length; i++) {
            allGradeIds.push(gradeData[i].id);
          }
          gradeData.unshift({
            name: 'Select All',
            id: allGradeIds,
          });
          setGradeList(gradeData);
        }
        // if (res) {
        //   const transformedData = res.data.result.map((obj) => ({
        //     id: obj.id,
        //     name: obj.name,
        //   }));
        //   transformedData.unshift({
        //     name: 'Select All',
        //     id: 'all',
        //   });
        //   console.log(transformedData,"data")
        //   setGradeList(transformedData);
        // }
      });
  };

  const fetchSections = (value) => {
    const ids = value.map((el) => el.id) || [];
    axiosInstance
      .get(`${endpoints.newBlog.activitySection}?grade_ids=${ids}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        console.log(result, 'section');
        if (result.data) {
          const gradeData = result?.data?.result || [];
          gradeData.unshift({
            name: 'Select All',
            id: 'all',
          });
          setSectionDropdown(gradeData);
        }
      });
  };

  useEffect(() => {
    fetchBranches();
  }, []);
  console.log(selectedBranch, 'selectedBranch');

  const handleBranch = (e, value) => {
    setSelectedGrade([]);
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedBranch(value);
      fetchGrades(value);
    }
    getTemplate(activityName.id);

  };

  const handleGrade = (e, value) => {
    console.log(value);
    if (value) {
      value =
        value.filter(({ name }) => name === 'Select All').length === 1
          ? [...gradeList].filter(({ name }) => name !== 'Select All')
          : value;
      setSelectedGrade(value);
      fetchSections(value);
    }
  };
  const handleSection = (e, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionDropdown].filter(({ id }) => id !== 'all')
          : value;
      setSelectedSection(value);
    }
  };

  const blogsContent = [
    {
      label: 'Public Speaking',
      value: '1',
    },
    {
      label: 'Post Card Writting',
      value: '2',
    },
    {
      label: 'Blog Card Writting',
      value: '3',
    },
  ];
  const handleStartDateChange = (val) => {
    setStartDate(val);
  };
  let branchIdss = selectedBranch.map((obj, index) => obj?.name).join(', ');
  let branchname = [...branchIdss];
  let gradeIdss = selectedGrade.map((obj, index) => obj?.name).join(', ');
  let gradename = [...gradeIdss];
  let sectionIdss = selectedSection.map((obj, index) => obj?.name).join(', ');
  let sectionname = [...sectionIdss];

  const PreviewBlog = () => {
    // history.push('/blog/editnewblog');
    setAssigned(true);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileUrl(URL.createObjectURL(event.target.files[0]));
  };
  const deleteSelectedImage = () => {
    setFileUrl(null);
    setSelectedFile(null);
  };
  const ActvityLocalStorage = () => {
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
      });
  };
  const handleClear = () => {
    setSelectedGrade([]);
    setSelectedBranch([]);
    setSelectedSection([]);
    setActivityName([]);
    setDescription('');
    setTitle('');
    setStartDate('');
  };
  const formatdate = new Date();
  const hoursAndMinutes =
    'T' +
    formatdate.getHours() +
    ':' +
    formatdate.getMinutes() +
    ':' +
    formatdate.getSeconds();
  const dataPost = () => {
    debugger
    const branchIds = selectedBranch.map((obj) => obj?.id);
    const gradeIds = selectedGrade.map((obj) => obj?.id);
    const sectionIds = selectedSection.map((obj) => obj?.id);
    // setLoading(true);
    if(!startDate){
      setLoading(false);
      setAlert('error', 'Please Select The Date')
      return;
    }
    if(activityName.length === 0){
      setAlert('error', 'Please Add Activity Name')
      return;
    }
    if(branchIds?.length === 0){
      setAlert('error', 'Please Select Branch')
      return
    }
    if(gradeIds?.length === 0) {
      setLoading(false);
      setAlert('error', 'Please Select Grade')
      return;
    }
    if(sectionIds?.length === 0) {
      setLoading(false);
      setAlert('error', 'Please Select Section')
      return;
    }
    if(title.length === 0){
      setLoading(false);
      setAlert('error', 'Please Add Title')
      return;
    }
    if(!description){
      setLoading(false);
      setAlert('error', 'Please Add Description')
      return;
    }

    if(!checked) {
      setLoading(false);
      setAlert('error','Please Select Templates')
      return;
    }
    else{
      setLoading(false);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('issue_date', null);
      formData.append('submission_date', startDate + hoursAndMinutes);
      formData.append('image', selectedFile);
      formData.append('activity_type_id', activityName.id);
      formData.append('session_year', selectedAcademicYear.session_year);
      formData.append('created_at', startDate + hoursAndMinutes);
      formData.append('created_by', user_id.id);
      formData.append('branch_ids', branchIds);
      formData.append('grade_ids', gradeIds);
      formData.append('section_ids', sectionIds);
      formData.append('is_draft', true);
      formData.append('template_type',"template");
      formData.append('template_id',checked);
      axios
        .post(`${endpoints.newBlog.activityCreate}`, formData, {
          headers: {
            // Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          setAlert('success', 'Activity Successfully Created');
          setLoading(false);
          setSelectedGrade([]);
          setSelectedBranch([]);
          setSelectedSection([]);
          setActivityName([]);
          setDescription('');
          setTitle('');
          setStartDate('');
          history.push('/blog/blogview');
  
          // localStorage.setItem(
          //   'ActivityManagement',
          //   JSON.stringify(response?.data?.result)
          // );
        });

    }
    

  };
  
  const [typeText,setTypeText]= useState([{name:"text"},{name:"template"}])

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        ActvityLocalStorage();
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const [activityStorage, setActivityStorage] = useState([]);
  const getActivitySession = () => {
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
        console.log(response, 'session');

        setActivityStorage(response.data.result);

        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
      });
  };
  const goBack = () => {
    history.push('/blog/blogview');
  }

  const closePreview = () => {
    setAssigned(false);
  };
  const [title, setTitle] = useState('');
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const [description, setDescription] = useState('');
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  const [templates,setTemplates] =useState([]);

  const getTemplate = (data) => {
    if(data){
      axios
        .get(`${endpoints.newBlog.getTemplates}${data}/`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
  
          // console.log(response?.data?.result, 'session');
          setTemplates(response?.data?.result);
       
        });

    }
  };

  useEffect(() =>{
    getTemplate()
  },[selectedBranch,activityName]);

  const [checked, setChecked] = React.useState("");

  const handleChange = (event,value) => {
    // console.log(event.target.checked)
    // console.log(event,"event",value);

    setChecked(value);
  };
//   const clickHandler = (e, item) => {

//     if (e.target.checked) {
//         setList(prevState => [
//             ...prevState,
//             item
//         ])
//         const newInitialList = initialList.filter((list, index) => list.id !== item.id);
//         setIinitialList(newInitialList)
//     }
// }

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 }
  ];
  

  return (
    <Layout>
            {loading && <Loader />}

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
            <Typography color='textPrimary' style={{fontSize:'23px', fontWeight:'bolder'}}>Create Activity</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      {/* <div style={{    marginLeft:"15px", marginBottom: "18px",
    marginTop: "-14px", cursor: 'pointer' }} onClick={goBack}>
          <div>
            {' '}
            <ArrowBackIcon style={{ color: '#0000008c' }} />{' '}
            <span style={{ color: 'gray' }}>Back to</span> &nbsp;
            <span style={{ color: '#0000008c', fontWeight: 'bold' }}>View Blog</span>
          </div>
        </div>       */}
        <div style={{ paddingLeft: '22px', paddingRight: '10px' }}>
        <Button
          variant='primary'
          style={{ borderRadius: '1px', color: 'white' }}
          disabled
        >
          Create Activity
        </Button>

        <Divider className={classes.dividerColor} />
      </div>
      <div
        style={{
          paddingLeft: '22px',
          paddingRight: '10px',
          paddingTop: '50px',
          fontSize: '15px',
        }}
      >
        <div
          style={{
            marginLeft: '9px',
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: '6px',
          }}
        >
          <div style={{ display: 'flex' }}>
            Activity Category :
            <Autocomplete
              style={{ marginTop: '-7px', width: '222px', marginLeft: '18px' }}
              size='small'
              onChange={handleChangeActivity}
              options={activityCategory || []}
              value={activityName || []}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} variant='outlined' />}
            />
            {/* <TextField


              select
              style={{ marginTop: '-6px', borderRadius: '1px', width: '198px' }}
              size='small'
              value={activityName}
              onChange={handleChangeActivity}
              SelectProps={{
                native: true,
              }}
              variant='outlined'
            >
              {activityCategory.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </TextField> */}
          </div>
          <div>
            {' '}
            Submission End Date: &nbsp;&nbsp;&nbsp;
            <TextField
              required
              size='small'
              style={{ marginTop: '-6px' }}
              onChange={(e) => handleStartDateChange(e.target.value)}
              type='date'
              value={startDate || ' '}
              variant='outlined'
            />
          </div>
        </div>
        {visible ? (
        <Grid container spacing={2} style={{ marginTop: '23px' }}>
          <Grid item md={6} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              size='small'
              limitTags={1}
              // style={{ width: '82%', marginLeft: '4px' }}
              options={branchList || []}
              value={selectedBranch || []}
              getOptionLabel={(option) => option?.name}
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
          </Grid>
          <Grid item md={6} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              limitTags={1}
              size='small'
              className='filter-student meeting-form-input'
              options={gradeList || []}
              getOptionLabel={(option) => option?.name || ''}
              filterSelectedOptions
              value={selectedGrade || []}
              onChange={(event, value) => {
                handleGrade(event, value);
              }}
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
          </Grid>
          <Grid item md={6} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              limitTags={1}
              size='small'
              className='filter-student meeting-form-input'
              options={sectionDropdown || []}
              getOptionLabel={(option) => option?.name || ''}
              filterSelectedOptions
              value={selectedSection || []}
              onChange={(event, value) => {
                handleSection(event, value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  variant='outlined'
                  label='Section'
                />
              )}
            />
          </Grid>
          {/* <Grid item md={6} xs={12}>

          <Autocomplete
              size='small'
              fullWidth

              onChange={handleChangeText}
              options={typeText || []}
              value={changeText || []}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              renderInput={(params) => <TextField label="Blog Type" {...params} variant='outlined' />}
            />
                    </Grid> */}

        </Grid>

        ): ''}
       
      
        <div
          style={{
            border: '1px solid lightgrey',
            borderRadius: '5px',
            height: 'auto',
            marginTop: '20px',
          }}
        >
          <div style={{ marginTop: '23px', marginLeft: '73px', display: 'flex' }}>
            Activity Details: &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              id='outlined-basic'
              size='small'
              fullWidth
              value={title}
              onChange={handleTitle}
              style={{ maxWidth: '80%' }}
              label='Title'
              variant='outlined'
            />
          </div>
          <br />
          <div
            style={{
              marginLeft: '13%',
              marginRight: '8%',
              marginBottom: '23px',
            }}
          >
            {/* <MyTinyEditor
              handleEditorChange={handleEditorChange}
              placeholder='Description...'
              content='<img src="https://st.depositphotos.com/1015682/1248/i/600/depositphotos_12483210-stock-photo-elephant-with-large-tusks.jpg" />'

            /> */}

            <TextField
              label='Description/Instructions'
              placeholder='Description/Instructions'
              multiline
              value={description}
              onChange={handleDescription}
              fullWidth
              style={{ maxWidth: '97%' }}
              rows='8'
              variant='outlined'
            />
          </div>
        </div>
        <div
          style={{
            border: '1px solid lightgrey',
            borderRadius: '5px',
            height: 'auto',
            marginTop: '20px',
          }}
        >
          {/* <div
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '7px',
            }}
          >
            {selectedFile ? (
              <img style={{ height: '85px', width: '158px' }} src={fileUrl} />
            ) : null}

            <input
              hidden
              type='file'
              id='upload_video'
              onChange={onFileChange}
              accept='image/*,.pdf,video/*,.docx,audio/*,.csv,.xlsx'
              className='video-file-upload'
              style={{ fontSize: '20px' }}
            />
            <div
              className='video-file-upload'
              style={{
                marginTop: '24px',
                marginLeft: '23px',
              }}
            >
              <label htmlFor='upload_video'>
                <Tooltip title='Upload'>
                  <CloudUploadIcon />
                </Tooltip>
              </label>
              <label> {selectedFile ? selectedFile.name : 'Select File'}</label>{' '}
              &nbsp;&nbsp;
              <label>
                {selectedFile ? (
                  <Button
                    color='primary'
                    variant='contained'
                    size='small'
                    onClick={deleteSelectedImage}
                  >
                    Delete
                  </Button>
                ) : null}{' '}
              </label>
            </div>
          </div> */}
          {selectedBranch?.length !== 0 && activityName?.length !== 0  ? (
          <Carousel breakPoints={breakPoints} showThumbs={false} infiniteLoop={true}>
        {/* <div style={{ height: "200px", color: "#fff" }}>this is slide 1</div>
        <div style={{ height: "200px", color: "#fff" }}>this is slide 2</div>
        <div style={{ height: "200px", color: "#fff" }}>this is slide 3</div> */}
        {templates?.map((obj,index)=>(
        <div style={{display:'flex', alignItems:'center',flexDirection:'column'}}>
        <img src={obj?.template_path} alt="images" style={{maxWidth:"34%"}}/> 
        {/* <div> */}
         <Checkbox
         value={checked}
         onChange={()=>handleChange(obj?.id,obj?.id)}
         className={classes.tickSize}        
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <div>{obj?.title}</div>
      {/* </div> */}
      </div>))}
          </Carousel>
          ) : ''}
        </div>
        <div
          style={{
            marginTop: '60px',
            marginLeft: '50px',

            display: 'flex',
          }}
        >
          <Button
            variant='outlined'
            className={classes.buttonColor}
            size='medium'
            onClick={goBack}
          >
            Back
          </Button>{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant='outlined'
            className={classes.buttonColor}
            size='medium'
            onClick={PreviewBlog}
          >
            Preview
          </Button>{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant='outlined'
            onClick={handleClear}
            className={classes.buttonColor1}
            size='medium'
          >
            Clear
          </Button>{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant='contained' color='primary' disabled={user_level==11} onClick={dataPost}>
            Create Activity
          </Button>
        </div>
      </div>
      <Dialog open={assigned} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
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
            <div style={{ marginLeft: '23px', marginTop: '28px' }}>
              <div style={{ fontSize: '15px', color: '#7F92A3' }}>
                Title -{activityName.name}
              </div>
              <div style={{ fontSize: '21px' }}>{title}</div>
              <div style={{ fontSize: '10px', color: '#7F92A3' }}>
                Submission on -{startDate}
              </div>
              <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                Branch -&nbsp;<span style={{ color: 'black' }}>{branchname}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Grade -&nbsp;<span style={{ color: 'black' }}>{gradename}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Section -&nbsp;<span style={{ color: 'black' }}>{sectionname}</span>
              </div>

              <div style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}>
                {/* word limit -300 */}
              </div>
              <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                Instructions
              </div>
              <div style={{ paddingTop: '8px', fontSize: '16px' }}>{description}</div>
              <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                <img src={fileUrl} width='50%' />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};
export default AdminCreateBlog;
