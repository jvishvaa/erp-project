import React, { Component, useEffect, useContext, useCallback, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes, { element } from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import {
  Grid,
  IconButton,
  Tooltip,
  Card,
  // useMediaQuery,
  Divider,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
  ChatBubbleOutline as CommentIcon,
} from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import MobileDatepicker from './datePicker';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import RadioPlayer from './radioPlayer';
import Loading from '../../../components/loader/loader';
import orchidsRadioLogo from './orchidsRadioLogo.png';
import AudioPlayerWrapper from './audioPlayerWrapper';
import { useLocation } from 'react-router-dom';
import {
  getSparseDate,
  getFormattedHrsMnts,
} from '../../../components/utils/timeFunctions';
import ViewOrchadioMobile from './viewOrchadioMobile';
import './viewplayer.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tabRoot: {
    width: '100%',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    // margin: '20px',
  },
  heading: {
    margin: 10,
    paddingLeft: 10,
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    color: '#5E104A',
  },
  secondaryHeading: {
    marginTop: 10,
    fontSize: theme.typography.pxToRem(15),
    // color: theme.palette.text.secondary,
    color: '#014B7E',
  },
  comment: {
    // border: '1px solid red',
    backgroundColor: '#f9f9f9',
    width: '95%',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: '50px',
  },
  commentInput: {
    height: 50,
  },
  programList: {
    '&:hover': {
      background: '#F9F9F9',
    },
  },
  iconsColorSecondary: {
    color: 'yellow',
  },
  iconsColorPrimary: {
    color: 'purple',
  },
  expandComments: {
    maxHeight: '200px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    // border: '1px solid red',
  },
  selectBg: {
    backgroundColor: '#fef0f0',
  },
  unSelectBg: {
    backgroundColor: 'white',
  },
  paginationStyle: {
    '& > *': {
      marginTop: theme.spacing(2),
      paddingLeft: '150px'
    },
  }
}));

function ViewOrchadio() {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, settabValue] = React.useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = React.useState(false);
  const [ExpandedPanel, setExpandedPanel] = React.useState(null);
  const [data, setData] = useState([]);
  // const [ExpandedPanel, setExpandedPanel] = React.useState(null);
  const [audioSrc, setAudioSrc] = React.useState('');
  const [RadioTitle, setRadioTitle] = React.useState('Orchadio');
  const [isLiked, setisLiked] = React.useState(false);
  const [orchadioId, setOrchadioId] = React.useState('');
  // const [status, setStatus] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  const [branchName, setBranchName] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1)
  const limit = 5;
  const [totalPages, setTotalPages] = React.useState('')
  const [startDate, setStartDate] = React.useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState(
    moment(startDate, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const location = useLocation();

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Orchadio' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              location.pathname === '/orchadio/view-orchadio' &&
              item.child_name === 'Student Orchadio'
            ) {
              setModuleId(item?.child_id);
              console.log(item?.child_id, 'module id');
            } else if (
              location.pathname === '/orchadio/manage-orchadio' &&
              item.child_name === 'Manage Orchadio'
            ) {
              setModuleId(item?.child_id);
              console.log(item?.child_id, 'module id');
            }
          });
        }
      });
    }
  }, []);

  let userName = JSON.parse(localStorage.getItem('rememberDetails')) || {};
  console.log(userName[0], 'userName');

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { first_name: name } = JSON.parse(localStorage.getItem('userDetails') || {});

  const tabs = ['All', 'Liked', 'Archived'];
  const TimeDifference = () => {
    // const a = moment(new Date()).format('YYYY-MM-DD hh:mm:ss'); // now
    // const b = moment('05/29/2021 05:50:06');
    const a = moment('2016-06-06T21:03:55'); // now
    const b = moment('2016-05-06T20:03:55');
    console.log(a.diff(b, 'minutes'));
  };
  const arraymove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const Expandpanel = (item) => {
    // const branch = [];
    console.log(item);
    const selectedItem = [];
    const composers = [];
    item.branch.map((i) => composers.push(i.branch_name));
    selectedItem.push({
      audioSrc: item.files[0],
      radioTitle: item.album_name,
      id: item.id,
      branchName: composers,
      views: item.views,
      likes: item.likes,
      is_like: item.is_like,
      // scheduledDate: item.program_schedule[0].datetime,
      scheduledDate: moment('2021-03-17T21:03:55'),
      duration: '86400',
    });
    let arr = [];
    const found = data.filter((n) => n.id === item.id);
    const otherElements = data.filter((n) => n.id !== item.id);
    // const a = arraymove(data, b, 0);
    arr = [...otherElements];
    arr.unshift(found);
    arr = [...arr.flat()];
    setBranchName(selectedItem);
    if (arr.length) {
      console.log(arr, 'arr');
      // setData(arr);
      scrollToTop();
    }
    // console.log(, 'lp');
    // console.log(item.files[0]);
    // setAudioSrc(item.files[0]);
    // setRadioTitle(item.album_name);
    // setOrchadioId(item.id);
    // item.branch.map((i) => setBranchName([...branch, i.branch_name]));
    // console.log(branchName);
    // setBranchName([])
  };
  const handleComment = (event) => {
    setComment(event.target.value);
  };
  const postComment = (item) => {
    axios
      .put(`${endpoints.orchadio.PostCommentandLike}${item.id}/create-orchido-comment/`, {
        comment,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setComment('');
          setLoading(false);
          setAlert('success', result.data.message);
          setLoading(false);
          const dat = data.map((it) => {
            if (it.id === item.id) {
              // it.total_program_likes += 1
              it.comments_list.unshift(comment);
            }
            return it;
          });
          console.log(dat, 'datttt');
          setData(dat);
          setTotalPages(result.data.result.total_pages)
          // console.log(result.data.result);
          // setData(result.data.result);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong.. Try again later');
      });
  };
  const completionCallback = (id) => {
    const body = {
      listened_percentage: 80,
    };
    axios
      .put(
        `${endpoints.orchadio.ListenedPercentage}${id}/orchido-listened-percentage/
      `,
        body
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const completedOnPecentageLimit = (id, percentageCompleted) => {
    const body = {
      listened_percentage: percentageCompleted === 1 ? 0 : 30,
    };
    axios
      .put(
        `${endpoints.orchadio.ListenedPercentage}${id}/orchido-listened-percentage/
      `,
        body
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const getRadio = () => {
    let url;
    if (tabValue === 0) {
      setData([]);
      console.log(data, 'data');
      // url = `${endpoints.orchadio.GetRadioProgram}`;
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?page_number=${pageNumber}&page_size=${limit}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          // setAudioLink(result.data.result);
          // setBranchName(firstItem);
          Expandpanel(firstItem[0]);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } else if (tabValue === 1) {
      setData([]);
      console.log(data, 'data1');
      // Liked
      // url = `${endpoints.orchadio.GetRadioProgram}?category_type=1`;
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?category_type=1&page_number=${pageNumber}&page_size=${limit}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          // setAudioLink(result.data.result);
          // setBranchName(firstItem);
          Expandpanel(firstItem[0]);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } else if (tabValue === 2) {
      setData([]);
      console.log(data, 'data2');
      // eslint-disable-next-line no-debugger

      // Archived
      // url = `${endpoints.orchadio.GetRadioProgram}?category_type=1`;
      // url = `${endpoints.orchadio.GetRadioProgram}?is_deleted=True`;
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?is_deleted=True`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          // setAudioLink(result.data.result);
          // setBranchName(firstItem);
          Expandpanel(firstItem[0]);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };
  useEffect(() => {
    getRadio();
    // TimeDifference();
  }, []);

  const getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  const getDaysBefore = (date, amount) => {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.format('YYYY-MM-DD'));
  };
  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('YYYY-MM-DD'));
  };
  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
    setLoading(true)
    setPageNumber(1)
    // getRadio();
  };
  useEffect(() => {
    console.log('data change');
    setData(null);
    getRadio();
  }, [tabValue,pageNumber]);
  const handleChange = (panel) => (event, expanded) => {
    setExpandedPanel(expanded ? panel.id : false);
    Expandpanel(panel);
    // this.setState({
    //   expanded: expanded ? panel : false,
    // });
  };

 
  const handleFilter = () => {
    axios
      .get(
        `${endpoints.orchadio.GetRadioProgram}?is_deleted=True&start_date=${startDate}&end_date=${endDate}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          // setAudioLink(result.data.result);
          // setBranchName(firstItem);
          Expandpanel(firstItem[0]);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        // setAlert('error', 'Something went wrong.. Try again later');
      });
  };

  const likeHandler = (item) => {
    // setisLiked(!status);
    axios
      .put(`${endpoints.orchadio.PostCommentandLike}${item.id}/orchido-like/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          // console.log(result.data.result);
          // setData(result.data.result);
          // if (result.data && result.data.success === 'true') {
          const dat = data.map((it) => {
            if (it.id === item.id) {
              // it.total_program_likes += 1
              it.is_like = !it.is_like;
              if (it.is_like) {
                it.likes += 1;
              } else {
                it.likes -= 1;
              }
            }
            return it;
          });
          setData(dat);
          setTotalPages(result.data.result.total_pages)
          // }
          // if (result.data && result.data.success === 'false') {
          //   const dat = data.map((it) => {
          //     if (it.id === item.id) {
          //       // it.total_program_likes -= 1;
          //       it.is_liked = 'False';
          //     }
          //     return it;
          //   });
          //   setData(dat);
          // }
          // getRadio();
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong.. Try again later');
      });
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
    setLoading(true)
  };
  const getRadioList = () => {
    const list = branchName.map((item, i) => {
      const date = getSparseDate(item.scheduledDate);
      const composers = item.branchName.join();
      return (
        <div style={{ marginBottom: '20px' }} key={`${item.id} ${i + 1}`}>
          {/* <AudioPlayerWrapper
            albumName={item.program_name}
            // imageTxt='Orchids'
            albumComposers={item.program_made_by.split(', ')}
            src={item.audio_file}
            timeToStart={getFormattedHrsMnts(date[3], date[4])}
            timedStart
            dateToStart={selectedDate}
            duration={item.duration}
            completionPercentage={80}
            completionCallback={() => completionCallback(item.id)}
            completedOnPecentageLimit={(percentage) =>
              completedOnPecentageLimit(item.id, percentage)}
            likeHandler={() => likeClickHandler(item.id)}
            likesCount={item.total_program_likes}
            viewCount={item.total_program_participants}
            imageSrc={orchadioImg}
            isLiked={item.is_liked === 'True'}
            radioProgramId={item.id}
          /> */}
          {/* {console.log(item.branchName)} */}
          <AudioPlayerWrapper
            albumName={item.radioTitle}
            // imageTxt='Orchids'
            // albumComposers={item.composers}
            albumComposers={composers.split(', ')}
            src={`${endpoints.orchadio.s3}/${item.audioSrc}`}
            timeToStart={getFormattedHrsMnts(date[3], date[4])}
            timedStart={false}
            dateToStart={new Date()}
            duration={item.duration}
            completionPercentage={80}
            completionCallback={() => completionCallback(item.id)}
            completedOnPecentageLimit={(percentage) =>
              completedOnPecentageLimit(item.id, percentage)
            }
            likeHandler={() => likeHandler(item)}
            likesCount={item.likes}
            viewCount={item.views}
            imageSrc={orchidsRadioLogo}
            isLiked={item.is_like}
            radioProgramId={item.id}
          />
        </div>
      );
    });
    return list;
  };
  return isMobile ? (
    <ViewOrchadioMobile />
  ) : (
    <div className='layout-container-div' id='viewAudioContainer'>
      <Layout className='layout-container'>
        <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
          <div
            className='message_log_breadcrumb_wrapper'
            style={{ backgroundColor: '#F9F9F9' }}
          >
            {loading ? <Loading message='Loading...' /> : null}
            <CommonBreadcrumbs componentName='Orchadio' />

            <div className={classes.tabRoot}>
              <Tabs
                indicatorColor='primary'
                textColor='primary'
                value={tabValue}
                onChange={handleTabChange}
                aria-label='simple tabs example'
              >
                {tabs.map((tab, index) => (
                  <Tab label={tab} {...a11yProps(index)} />
                ))}
                {/* <Tab label='All' {...a11yProps(0)} /> */}
                {/* <Tab label='Today' {...a11yProps(1)} /> */}
                {/* <Tab label='Live Streams' {...a11yProps(2)} /> */}
                {/* <Tab label='Going Live' {...a11yProps(3)} /> */}
                {/* <Tab label='Most liked' {...a11yProps(4)} /> */}
                {/* <Tab label='Liked' {...a11yProps(1)} /> */}
                {/* <Tab label='Archived' {...a11yProps(2)} /> */}
              </Tabs>
              {tabs.map((tab, index) => {
                return (
                  <TabPanel value={tabValue} index={index}>
                    {tabValue === 2 ? (
                      <div className='create_group_filter_container'>
                        <Grid container>
                          <Grid item xs={12} sm={4}>
                            <div className='mobile-date-picker'>
                              <MobileDatepicker
                                onChange={(date) => handleEndDateChange(date)}
                                handleStartDateChange={handleStartDateChange}
                                handleEndDateChange={handleEndDateChange}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12}>
                            <div style={{ margin: '20px', marginLeft: 5 }}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <Button
                                    style={{
                                      fontSize: 'small',
                                      margin: '20px',
                                      width: 150,
                                    }}
                                    color='primary'
                                    size='small'
                                    variant='contained'
                                    // onClick={handleFilter}
                                    disabled
                                  >
                                    Clear All
                                  </Button>
                                  <Button
                                    style={{
                                      fontSize: 'small',
                                      margin: '20px',
                                      width: 150,
                                    }}
                                    onClick={handleFilter}
                                    color='primary'
                                    size='small'
                                    variant='contained'
                                  >
                                    Filter
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    ) : (
                      ''
                    )}
                    {data.length ? getRadioList() : ''}
                    {/* <RadioPlayer data={branchName} /> */}
                    {data.map((item, index) => (
                      <Grid item xs={12} className='audioArea'>
                        {/* <Grid container alignItems='center' className={classes.paperRoot}> */}
                        {/* <div className={classes.root}> */}
                        <ExpansionPanel
                          id={index}
                          className={classes.programList}
                          expanded={ExpandedPanel === item.id}
                          onChange={handleChange(item)}
                          className={
                            branchName &&
                            branchName.map((k) =>
                              k.id === item.id ? classes.selectBg : classes.unSelectBg
                            )
                          }
                          // onClick={() => Expandpanel(item)}
                        >
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid item xs={6}>
                              <img
                                src={orchidsRadioLogo}
                                alt='not Found'
                                width='50px'
                                style={{
                                  float: 'left',
                                  // border: '1px solid yellow',
                                  borderRadius: '60px',
                                  // padding: '10px',
                                  backgroundColor: 'white',
                                }}
                              />
                              <Typography className={classes.heading}>
                                {item.album_name}
                              </Typography>

                              {branchName &&
                                branchName.map((k) =>
                                  k.id === item.id ? (
                                    <Typography
                                      variant='body2'
                                      style={{ color: '#5E104A' }}
                                      align='center'
                                    >
                                      PLAYING
                                      {/* {ShiftArrayElement(data, data.indexOf(item.id), 0)} */}
                                    </Typography>
                                  ) : (
                                    ''
                                  )
                                )}
                            </Grid>
                            <Divider
                              style={{ marginLeft: 50, marginRight: 50 }}
                              orientation='vertical'
                              flexItem
                            />
                            <Grid item xs={3}>
                              <Typography className={classes.secondaryHeading}>
                                {item.branch.map((i) => i.branch_name)}
                              </Typography>
                            </Grid>
                            <Divider
                              style={{ marginLeft: 50, marginRight: 50 }}
                              orientation='vertical'
                              flexItem
                            />
                            <Grid item xs={3}>
                              <Typography className={classes.secondaryHeading}>
                                {typeof item.program_schedule === 'string'
                                  ? JSON.parse(item.program_schedule)[0].datetime
                                  : ''}
                              </Typography>
                            </Grid>
                            <Divider
                              style={{ marginLeft: 50, marginRight: 50 }}
                              orientation='vertical'
                              flexItem
                            />
                            <Grid item xs={3}>
                              <Tooltip title='Views'>
                                <IconButton
                                  className={
                                    index % 2 === 0
                                      ? classes.iconsColorPrimary
                                      : classes.iconsColorSecondary
                                  }
                                >
                                  <Typography variant='body2' style={{ marginRight: 5 }}>
                                    {item.views}
                                  </Typography>
                                  <PersonIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                              <Tooltip title='Like'>
                                <IconButton
                                  id={index}
                                  className={
                                    index % 2 === 0
                                      ? classes.iconsColorPrimary
                                      : classes.iconsColorSecondary
                                  }
                                  onClick={() => likeHandler(item)}
                                >
                                  <Typography variant='body2' style={{ marginRight: 5 }}>
                                    {item.likes}
                                  </Typography>
                                  {item.is_like === true ? (
                                    <LikeIcon color='secondary' />
                                  ) : (
                                    <UnlikeIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                              <Tooltip title='Comment'>
                                <IconButton
                                  className={
                                    index % 2 === 0
                                      ? classes.iconsColorPrimary
                                      : classes.iconsColorSecondary
                                  }
                                >
                                  <Typography variant='body2' style={{ marginRight: 5 }}>
                                    {item.comments_list.length}
                                  </Typography>
                                  <CommentIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails className={classes.expandComments}>
                            <Grid item xs={12}>
                              <TextField
                                id='outlined-multiline-flexible'
                                label='Enter your Comment'
                                multiline
                                size='small'
                                // fullWidth
                                rowsMax={4}
                                // InputProps={{ classes: { input: classes.commentInput } }}
                                style={{ marginBottom: '10px', width: '90%' }}
                                value={comment}
                                onChange={handleComment}
                                variant='outlined'
                                InputProps={{
                                  startAdornment: (
                                    <Chip
                                      avatar={<Avatar>{name.charAt(0)}</Avatar>}
                                      label={userName[0]}
                                    />
                                  ),
                                }}
                              />
                              <Button
                                style={{ margin: 10 }}
                                size='small'
                                onClick={() => postComment(item)}
                              >
                                Post
                              </Button>
                              {/* </Grid> */}
                              {/* <Grid item xs={12}> */}
                              {item.comments_list.map((c) => (
                                <Card className={classes.comment}>
                                  <Typography>{c}</Typography>
                                </Card>
                              ))}
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        {/* </div> */}
                        {/* <Paper className={classes.paper}> */}
                        {/* <Grid container alignItems='center' className={classes.paperRoot}> */}

                        {/* </Grid> */}
                        {/* </Paper> */}
                        {/* </Grid> */}
                      </Grid>
                    ))}
                  </TabPanel>
                );
              })}
              <Grid container justify='center'>
                {data && !loading && <Pagination 
                  onChange={handlePagination}
                  count = {totalPages}
                  color='primary'
                  page={pageNumber}
                  color='primary'
                />}
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
export default ViewOrchadio;
