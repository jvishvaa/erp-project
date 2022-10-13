import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
  // IconButton,
  TextField,
  // Button,
  SvgIcon,
  makeStyles,
  // Typography,
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
  // Select,
  Dialog,
  DialogTitle,
  Checkbox,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import "./blog.css";
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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import { Rating } from '@material-ui/lab';
import { Breadcrumb, Tabs, Select, DatePicker, Spin, Pagination, Space, Button, Divider } from 'antd';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
// import { X_DTS_HOST } from 'v2/reportApiCustomHost';

import {
  fetchBranchesForCreateUser as getBranches,
  fetchGrades as getGrades,
  fetchSections as getSections,
  fetchSubjects as getSubjects,
} from '../../redux/actions';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import { Tabs } from 'antd';
import moment from 'moment';
import { DownOutlined, PlusOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import CancelIcon from '@material-ui/icons/Cancel';
import { UserOutlined } from '@ant-design/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import image1 from "../../assets/images/gp1.png";
import image2 from "../../assets/images/gp2.png"

const drawerWidth = 350;
const { TabPane } = Tabs;



const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: '#E1C71D',
  },
  root: {
    '& .MuiSvgIcon-root': {
      color: 'currentColor',
    },
  },
  iconHover: {
    color: 'yellow',
  },
}))(Rating);

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
  media: {
    height: 240,
    objectFit: 'cover',
    width: '45%'
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
  tickSize: {
    transform: "scale(2.0)",
  },
}));

const BlogWallRedirect = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const [periodData,setPeriodData] = useState([]);
  const [loading,setLoading]= useState(false);



  const handleBlogWriting = () => {
    history.push('/blog/studentview')
  }

  const handlePublicSpeaking = () => {
    history.push('/blog/publicspeaking')
  }

  const periodDataAPI = () => {
      setLoading(true)
      axiosInstance
        .get(`${endpoints.newBlog.blogRedirectApi}`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((result) => {
          setLoading(false)
          setPeriodData(result?.data?.result)
        })
        .catch((err) => {
          setLoading(false)
        })
    // }
  };

  useEffect(() =>{
    periodDataAPI()
  },[])



  const handleExplore = (data) => {
    if (data?.name == "Blog Wall" || data?.name == "Blog Writing") {
      handleBlogWriting()
    } else if (data?.name === "Public Speaking") {
      handlePublicSpeaking()
    } else {
    }
  }

  const getSubjectIcon = (value) => {
    switch(value) {
      case 'Blog Writing' :
        return image2;
      case 'Public Speaking' : 
        return image1;
      case 'blogger list' :
        return image2;
      case 'actiivtytype' : 
        return image1;
      default : 
          return ""
        
    }
  };


  return (
    <React.Fragment>
      <div>
      {loading && <Loader/>}
      <Layout>
        {''}
        <div className='row th-16 py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Activities Management
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='row'>
            <div className='col-12' style={{ fontWeight: 'bold' }}>
              <Divider orientation="left" orientationMargin="0" style={{ fontSize: '22px' }}>Activities</Divider>
            </div>
            <div className='row p-3' style={{ height: 500, overflowY: 'scroll' }}>
              {
                periodData.map((each,index) =>
                  // each?.data?.map((item) => (
                  <div className='col-md-4 pl-0 mt-2'>
                    <div
                      className='th-br-10 th-bg-grey dummy-background'
                    >
                      <div className='row p-3'>
                        <div className='col-4 th-br-5'>
                          <img
                            src={getSubjectIcon(each?.name)}
                            // src={getSubjectIcon((each?.subject_name).toLowerCase())}
                            style={{height:'153px', width:'153px', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', borderRadius:'7px'}}
                            alt="Icon"
                            // className='mb-1'
                          />
                        </div>
                        <div className='col-8'>
                          <div className='row -3 align-item-center th-black-1 '>
                            <div className='col-12 pl-0'>
                              <span className='th-18 th-fw-700 text-capitalize'>
                                {each?.name}
                              </span>
                              <p className='th-12 th-fw-200'>
                                {each?.count} Activity
                              </p>
                            </div>

                          </div>
                          <div className='row -3 th-bg-pink align-item-center th-br-5'>
                            <div className='col-12 pl-0'>
                              <span className='th-12 th-fw-500 ml-2 text-capitalize th-blue-1'>
                                Recently Added
                              </span>
                              <p className='th-12 th-fw-200 ml-2'>
                                {each?.title}
                              </p>
                            </div>

                          </div>
                          <div className='row -3 align-item-center'>
                            <div className='col-6 pl-0'>
                              <span className='th-12 th-fw-400 text-capitalize' style={{ color: 'grey' }}>
                                Last Updated
                              </span>
                              <p className='th-12 th-fw-200'>
                                {/* 2/04/2022, 5:30 PM */}
                                {moment(each?.last_update).format('ll')}
                              </p>
                            </div>
                            <div className='col-6 pl-0' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0px 0px' }}>
                              <Button type="primary"
                               onClick={() => handleExplore(each)}
                               >
                                Explore &gt;
                              </Button>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )

              }
            </div>

          </div>

        </div>
      </Layout>

      </div>
    </React.Fragment>
  );
};
export default BlogWallRedirect;
