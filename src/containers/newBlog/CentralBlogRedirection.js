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
import './blog.css';
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
import Carousel from 'react-elastic-carousel';
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
import {
  Breadcrumb,
  Tabs,
  Select,
  DatePicker,
  Spin,
  Pagination,
  Space,
  Button,
  Divider,
} from 'antd';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

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
import {
  DownOutlined,
  PlusOutlined,
  CheckOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import CancelIcon from '@material-ui/icons/Cancel';
import { UserOutlined } from '@ant-design/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import image1 from '../../assets/images/gp1.png';
import image2 from '../../assets/images/gp2.png';
import visualImage from '../../assets/images/visual art.jpg';
import physicalImage from '../../assets/images/physical activity.jpg';
const drawerWidth = 350;
const { TabPane } = Tabs;

// const StyledRating = withStyles((theme) => ({
//   iconFilled: {
//     color: '#E1C71D',
//   },
//   root: {
//     '& .MuiSvgIcon-root': {
//       color: 'currentColor',
//     },
//   },
//   iconHover: {
//     color: 'yellow',
//   },
// }))(Rating);

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     width: 300,
//   },
//   indeterminateColor: {
//     color: '#f50057',
//   },
//   selectAllText: {
//     fontWeight: 500,
//   },
//   selectedAll: {
//     backgroundColor: 'rgba(0, 0, 0, 0.08)',
//     '&:hover': {
//       backgroundColor: 'rgba(0, 0, 0, 0.08)',
//     },
//   },
//   root: {
//     maxWidth: '90vw',
//     width: '95%',
//     margin: '20px auto',
//     marginTop: theme.spacing(4),
//     boxShadow: 'none',
//   },
//   media: {
//     height: 240,
//     objectFit: 'cover',
//     width: '45%',
//   },
//   customFileUpload: {
//     border: '1px solid black',
//     padding: '6px 12px',

//     cursor: 'pointer',
//   },
//   container: {
//     maxHeight: '70vh',
//     maxWidth: '90vw',
//   },
//   dividerColor: {
//     backgroundColor: `${theme.palette.primary.main} !important`,
//   },
//   buttonColor: {
//     color: `${theme.palette.secondary.main} !important`,
//     backgroundColor: 'white',
//   },
//   buttonColor1: {
//     color: `${theme.palette.primary.main} !important`,
//     backgroundColor: 'white',
//   },
//   columnHeader: {
//     color: `${theme.palette.secondary.main} !important`,
//     fontWeight: 600,
//     fontSize: '1rem',
//     backgroundColor: `#ffffff !important`,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   tableCell: {
//     color: theme.palette.secondary.main,
//   },
//   vl: {
//     borderLeft: `3px solid ${theme.palette.primary.main}`,
//     height: '45px',
//   },
//   tickSize: {
//     transform: 'scale(2.0)',
//   },
// }));

const CentralBlogRedirection = () => {
  // const classes = useStyles();
  // const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  // const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  // const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const [periodData, setPeriodData] = useState([]);
  const [subId, setSubId] = useState('');
  const [blogSubId, setBlogSubId] = useState('');
  const [visualSubId, setVisualSubId] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [blogLoginId, setBlogLoginId] = useState('');

  const handleBlogWriting = () => {
    history.push('/blog/studentview');
  };

  const handlePublicSpeaking = () => {
    history.push({
      pathname: '/physical/activity',
      state: {
        subActiveId: subId,
      },
    });
  };

  const handleBlogActivity = () => {
    history.push({
      pathname: '/blog/blogview',
      state: {
        blogLoginId: blogLoginId,
      },
    });
  };

  const handleVisualActivityRoute = () => {
    history.push({
      pathname: '/visual/activity',
      state: {
        subActiveId: visualSubId,
      },
    });
  };

  const periodDataAPI = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newBlog.blogRedirectApi}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setPeriodData(result?.data?.result);
        const physicalData = result?.data?.result.filter(
          (item) => item?.name == 'Physical Activity'
        );
        setSubId(physicalData[0]?.id);
        const blogActivityData = result?.data?.result.filter(
          (item) => item?.name == 'Blog Activity'
        );
        setBlogSubId(blogActivityData[0]?.id);
        const visualActivityData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() === 'visual art'
        );
        setVisualSubId(visualActivityData[0]?.id);
        // localStorage.setItem(
        //   'PhysicalActivityId',
        //   JSON.stringify(physicalData[0]?.id)
        // );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    // }
  };

  useEffect(() => {
    periodDataAPI();
  }, []);

  const handleExplore = (data) => {
    let dataLower = data?.name.toLowerCase();
    if (
      dataLower == 'blog wall' ||
      dataLower == 'blog writing' ||
      dataLower == 'blog writting'
    ) {
      // handleBlogWriting()
      return;
    } else if (dataLower === 'public speaking') {
      // handlePublicSpeaking()
      // return
    } else if (dataLower === 'physical activity') {
      localStorage.setItem('PhysicalActivityId', JSON.stringify(subId));
      handlePublicSpeaking();
      return;
    } else if (dataLower === 'art writting' || dataLower === 'blog activity') {
      localStorage.setItem('BlogActivityId', JSON.stringify(blogSubId));
      if (user_level === 2 || user_level === 8 || user_level === 11) {
        handleBlogActivity();
        return;
      } else if (user_level === 13) {
        handleBlogWriting();
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else if (dataLower === 'visual art') {
      localStorage.setItem('VisualActivityId', JSON.stringify(visualSubId));
      if (user_level === 2 || user_level === 6 || user_level === 11 || user_level === 8) {
        handleVisualActivityRoute();
        return;
      } else if (user_level === 13) {
        setAlert('error', 'Permission Denied');
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else {
      setAlert('error', 'Level Does Not Exist');
      return;
    }
  };

  const getActivitySession = () => {
    setLoading(true);
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
        setBlogLoginId(response?.data?.result);
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ActvityLocalStorage = () => {
    setLoading(true);
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
        // getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };

  const getSubjectIcon = (value) => {
    switch (value) {
      case 'Blog Activity':
        return image2;
      case 'Public Speaking':
        return image1;
      case 'Physical Activity':
        return physicalImage;
      case 'actiivtytype':
        return image1;
      case 'Visual Art':
        return visualImage;
      default:
        return '';
    }
  };
  useEffect(() => {
    localStorage.setItem('PhysicalActivityId', '');
    getActivitySession();
    ActvityLocalStorage();
  }, []);
  return (
    <Layout>
      {''}
      <div className='row px-2'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Activities Management
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='row th-bg-white th-br-5 m-3'>
          {/* <div className='col-12' style={{ fontWeight: 'bold' }}>
                <Divider orientation="left" orientationMargin="0" style={{ fontSize: '22px' }}>Activities</Divider>
              </div> */}
          {loading ? (
            <div
              className='d-flex align-items-center justify-content-center w-100'
              style={{ height: '50vh' }}
            >
              <Spin tip='Loading' />
            </div>
          ) : periodData.length > 0 ? (
            <div className='row p-3' style={{ height: '72vh', overflowY: 'auto' }}>
              {periodData?.map((each, index) => (
                // each?.data?.map((item) => (
                <div className='col-md-4 mb-2 mb-sm-0 '>
                  <div className='th-br-10 th-bg-grey shadow-sm'>
                    <div className='row p-3'>
                      <div className='col-4 px-0 th-br-5'>
                        <img
                          src={getSubjectIcon(each?.name)}
                          // src={getSubjectIcon((each?.subject_name).toLowerCase())}
                          // style={{backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '7px' }}
                          alt='Icon'
                          style={{
                            height: '150px',
                            width: '100%',
                            objectFit: '-webkit-fill-available',
                          }}
                          className='th-br-5'
                        />
                      </div>
                      <div className='col-8 pr-0'>
                        <div className='d-flex flex-column justify-content-between h-100'>
                          <div className='d-flex flex-column align-item-center th-black-1 '>
                            <div className=''>
                              <span className='th-18 th-fw-700 text-capitalize'>
                                {each?.name}
                              </span>
                            </div>
                            <div>
                              <span className='th-12 th-fw-300'>
                                {each?.count}{' '}
                                {each?.count == 1 ? 'Activity' : 'Activities'}
                              </span>
                            </div>
                          </div>
                          <div className='d-flex flex-column th-bg-pink align-item-center th-br-5'>
                            <div className=''>
                              <span className='th-12 th-fw-300 ml-2 text-capitalize th-blue-1'>
                                Recently Added
                              </span>
                            </div>
                            <div>
                              <span className='th-12 th-fw-500 ml-2'>{each?.title}</span>
                            </div>
                          </div>
                          <div className='row align-item-center'>
                            <div className='col-sm-6 pl-0'>
                              <div className='th-12 th-fw-300 text-capitalize th-black-1'>
                                Last Updated
                              </div>
                              <div className='th-12 th-fw-400'>
                                {/* 2/04/2022, 5:30 PM */}
                                {moment(each?.last_update).format('ll')}
                              </div>
                            </div>
                            <div
                              className='col-sm-6 text-sm-right px-0 px-sm-2 pt-1 pt-sm-0'
                              // style={{
                              //   display: 'flex',
                              //   justifyContent: 'flex-end',
                              //   alignItems: 'center',
                              //   padding: '0px 0px',
                              // }}
                            >
                              <Button
                                className='th-button-active th-br-6 text-truncate th-pointer'
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
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center w-100 py-5'>
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default CentralBlogRedirection;
