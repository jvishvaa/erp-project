import React, { Component, useEffect, useContext, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import axiosInstance from '../../../config/axios.js';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ListItemText from '@material-ui/core/ListItemText';
import UpdateIcon from '@material-ui/icons/Update';
import { useLocation } from 'react-router-dom';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
  Share as ShareIcon,
  Face,
} from '@material-ui/icons';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import MobileDatepicker from './datePicker';
import BlackOrchidsRadio from './BlackOrchadio.png';
import Loading from '../../../components/loader/loader';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './manageorchido.scss';
import Pagination from '@material-ui/lab/Pagination';
import unfiltered  from '../../../assets/images/unfiltered.svg';
import selectFilter  from '../../../assets/images/selectfilter.svg';

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
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: '#ffd5bb',
  },
  cardRoot: {
    height: 240,
    // maxWidth: 434,
    // width: 370,
    width: '100%',
    border: '1px solid #8C8C8C',
    margin: 10,
  },
  ListenersCardoot: {
    maxWidth: 400,
    border: '1px solid #8C8C8C',
    margin: 10,
  },
  customTooltip: {
    // I used the rgba color for the standard "secondary" color
    backgroundColor: '#F9F9F9',
    width: 200,
    alignContent: 'center',
    border: '1px solid #ff6b6b',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 250,
    minWidth: 250,
  },
  listRoot: {
    width: '115%',
    maxWidth: 360,
    paddingLeft: 0,
    // backgroundColor: theme.palette.background.paper,
  },
  selectFilterGrid: {
    height: '400px',
    justifyContent: 'center',
    textAlign: 'center',
},
unfilteredImg: {
  display: 'block',
  height: '50%',
  margin: 'auto',
  marginTop: '20px',
},
unfilteredTextImg: {
  display: 'block',
  marginTop: '10px',
  margin: 'auto',
  paddingLeft:'25px',
}
}));

function ManageOrchadio() {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, settabValue] = React.useState(0);
  const [arr, setArr] = React.useState([1, 2, 3, 8, 9]);
  const [startDate, setStartDate] = React.useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState(
    moment(startDate, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
  );
  const [expanded, setExpanded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState([]);
  const [branchList, setBranchList] = React.useState([]);
  const [branchId, setBranchId] = React.useState([]);
  const [studentsList, setStudentsList] = React.useState([]);
  const [studentsId, setStudentsId] = React.useState([]);
  const [selectedStudent, setSelectedStudent] = React.useState([]);
  const [SelectedOrchadioId, setSelectedOrchadioId] = React.useState([]);
  const [ParticipantOpen, setParticipantOpen] = React.useState(false);
  const [ParticipantOpenId, setParticipantOpenID] = React.useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [userId, setUserId] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [pageNumber, setPageNumber] = React.useState(1)
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const location = useLocation();
  const [filterFlag, setFilterFlag] = useState(0);
  const limit = 5;
  const [totalPages, setTotalPages] = React.useState('')
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

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
              console.log(item?.child_id, "module id");
            } else if (
              location.pathname === '/orchadio/manage-orchadio' &&
              item.child_name === 'Manage Orchadio'
            ) {
              setModuleId(item?.child_id);
              console.log(item?.child_id, "module id");
              localStorage.setItem('moduleIdOrchido', item?.child_id);
            }
          });
        }
      });
    }
  }, []);


  const getRadio = () => {
    axios
      .get(`${endpoints.orchadio.GetRadioProgram}?page_number=${pageNumber}&page_size=${limit}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          // console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          // const firstItem = result.data.result.slice(0, 1);
          // setAudioLink(result.data.result);
          // setBranchName(firstItem);
          // Expandpanel(firstItem[0]);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => { });
  };
  const getBranch = () => {
    axios
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setBranchList(result.data.data);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => { });
  };
  useEffect(() => {
    getRadio();
    callApi(
      `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
      'academicYearList'
    );
  }, [moduleId]);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || []);
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || []);
            setSectionList(result.data.data);
          }
          if (key === 'student') {
            console.log(result.data.result || [], "studentsss");
            setStudentList(result?.data?.result);
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

  const handleBranch = (event, value) => {
    const branchId = [];
    setSelectedBranch(value);
    value.map((item) => {
      branchId.push(item.id);
    });
    console.log(branchId);
    setBranchId(branchId);
    axios
      .get(`${endpoints.orchadio.AddParticipants}?branch_id=${branchId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          // setAlert('success', result.data.message);
          // console.log(result.data.result);
          setStudentsList(result.data.result);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong.. Try again later');
      });
    // this.setState({ data: [], selectedBranch: value }, () => {
    //   this.getGrade();
  };
  const handleStudents = (event, value) => {
    const studentsId = [];
    setSelectedStudent(value);
    value.map((item) => {
      studentsId.push(item.id);
    });
    // console.log(branchId);
    setStudentsId(studentsId);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
    setPageNumber(1)
    // setLoading(true)
  };
  const getDaysAfter = (date, amount) => {
    // return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
    return date ? date.add(amount, 'days').format('DD-MM-YYYY') : undefined;
  };
  const getDaysBefore = (date, amount) => {
    // return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
    return date ? date.subtract(amount, 'days').format('DD-MM-YYYY') : undefined;
  };
  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    // setStartDate(date.format('YYYY-MM-DD'));
    setStartDate(date.format('DD-MM-YYYY'));
  };
  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    // setEndDate(date.format('YYYY-MM-DD'));
    setEndDate(date.format('DD-MM-YYYY'));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
      if(filterFlag === 0){
        setLoading(true)
        axios
        .get(`${endpoints.orchadio.GetRadioProgram}?page_number=${page}&page_size=${limit}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setAlert('success', result.data.message);
            setLoading(false);
            setData(result.data.result.data);
            setTotalPages(result.data.result.total_pages)
          } else {
            console.log(result.data.message);
          }
        })
        .catch((error) => { });
       
      }else if(filterFlag === 1){
        setLoading(true); 
        axios
          .get(
            `${endpoints.orchadio.GetRadioProgram}?start_date=${startDate}&end_date=${endDate}&page_number=${page}&page_size=${limit}`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data.message);
              setData(result.data.result.data);
              setTotalPages(result.data.result.total_pages)
              setLoading(false)
            } else {
              setLoading(false)
              setAlert('warning', result.data.message);
              console.log(result.data.message);
            }
          })
          .catch((error) => {
            setLoading(false)
            setAlert('error', 'Something went wrong.. Try again later');
          });
      }
  };

  const handleFilter = () => {
    setFilterFlag(1);
    setTotalPages(1)
    setLoading(true); 
    axios
      .get(
        `${endpoints.orchadio.GetRadioProgram}?start_date=${startDate}&end_date=${endDate}&page_number=${pageNumber}&page_size=${limit}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          // console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          setLoading(false)
        } else {
          setLoading(false)
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false)
        setAlert('error', 'Something went wrong.. Try again later');
      });
  };

  const handleDelete = (item) => {
    // console.log(item);
    setLoading(true)
    axios
      .delete(`${endpoints.orchadio.DeleteOrchadio}${item.id}/update-orchadio/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
           if (filterFlag) { 
          handleFilter(); 
          } else { 
            getRadio(); 
           } 
          setAlert('success', result.data.message);
        } else {
          setLoading(false);
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong.. Try again later');
      });
  };
  const handleParticipantsCollapse = (index) => {
    setParticipantOpen(!ParticipantOpen);
    setParticipantOpenID(index);
  };
  const handleAddParticipant = (item) => {
    setSelectedOrchadioId(item.id);
    handleOpen();
  };
  const handleParticipantSubmit = () => {
    axios
      .put(`${endpoints.orchadio.createRadioProgram}`, {
        orchadio_id: SelectedOrchadioId,
        users: [userId],
      })
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'Something Went Wrong');
      });
    handleClose();
  };
  return (
    <div className='layout-container-div' id="manageorchidoContainer" >
      <Layout className='layout-container'>
        <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
          <div
            className='message_log_breadcrumb_wrapper'
            style={{ backgroundColor: '#F9F9F9' }}
          >
            {loading ? <Loading message='Loading...' /> : null}
            <CommonBreadcrumbs componentName='Orchadio' />
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
                      {/* <Grid item>
                      <Button
                        color='primary'
                        style={{ fontSize: 'small', margin: '20px' }}
                        size='small'
                        variant='contained'
                      >
                        Clear All
                      </Button>
                    </Grid> */}
                      <Grid item xs={12}>
                        <Button
                          style={{ fontSize: 'small', margin: '20px', width: 150 }}
                          color='primary'
                          size='small'
                          variant='contained'
                          onClick={handleFilter}
                          disabled
                        >
                          Clear All
                        </Button>
                        <Button
                          style={{ fontSize: 'small', margin: '20px', width: 150 }}
                          onClick={handleFilter}
                          color='primary'
                          size='small'
                          variant='contained'
                        >
                          Filter
                        </Button>
                        <Button
                          style={{ fontSize: 'small', margin: '20px', width: 150 }}
                          onClick={() => history.push('/orchadio/add-orchadio')}
                          color='primary'
                          size='small'
                          variant='contained'
                        >
                          Add New
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className={classes.root}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className={classes.tabRoot}>
                    <Tabs
                      indicatorColor='primary'
                      textColor='primary'
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label='simple tabs example'
                    >
                      <Tab label='Participants List' {...a11yProps(0)} />
                      <Tab label='Listeners List' {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                      {data && data.length ? (
                        <Grid
                          container
                          direction={isMobile ? 'column' : 'row'}
                          justify='flex-start'
                          alignItems='center'
                          spacing={isMobile ? 1 : 3}
                        >
                          {data &&
                            data.map((item) => (
                              <Grid item xs={12} md={4}>
                                <Card className={classes.cardRoot}>
                                  <CardHeader
                                    avatar={
                                      <img
                                        src={BlackOrchidsRadio}
                                        style={{ width: '30px' }}
                                        alt='not found'
                                      />
                                    }
                                    action={(
                                      <Tooltip
                                        arrow
                                        classes={{
                                          tooltip: classes.customTooltip,
                                          arrow: classes.customArrow,
                                        }}
                                        interactive
                                        title={(
                                          <>
                                            <Typography
                                              color='primary'
                                              variant='body2'
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => handleDelete(item)}
                                            >
                                              Delete Participant
                                            </Typography>
                                            <Typography
                                              color='primary'
                                              variant='body2'
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => handleAddParticipant(item)}
                                            >
                                              Add Participant
                                            </Typography>
                                          </>
                                        )}
                                      >
                                        <IconButton aria-label='settings' color='primary'>
                                          <MoreHorizIcon />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    title={(
                                      <Typography align='center'>
                                        {/* {item.album_name} */}
                                        ORCHADIO
                                      </Typography>
                                    )}
                                  />
                                  {/* <CardMedia
                                className={classes.media}
                                image='/static/images/cards/paella.jpg'
                                title='Paella dish'
                              /> */}
                                  <CardHeader
                                    style={{
                                      backgroundColor: '#F3F3F3',
                                      paddingTop: '5px',
                                      paddingBottom: '5px',
                                    }}
                                    avatar={(
                                      <Avatar
                                        aria-label='recipe'
                                        className={classes.avatar}
                                      >
                                        {item.branch
                                          ? item.branch.map((i) => {
                                            const str = i.branch_name;
                                            // let str = 'karthick raja j'
                                            const matches = str.match(/\b(\w)/g);
                                            const acronym = matches.join('');
                                            return acronym;
                                          })
                                          : ''}
                                      </Avatar>
                                    )}
                                    title={(
                                      <>
                                        <Grid item xs={12} sm container>
                                          <Grid
                                            item
                                            xs
                                            container
                                            direction='column'
                                            spacing={2}
                                          >
                                            <Grid item xs>
                                              <Typography
                                                style={{ marginTop: 7, color: '#014B7E' }}
                                                gutterBottom
                                                variant='subtitle1'
                                              >
                                                {item.branch.length
                                                  ? item.branch.map((i) => i.branch_name)
                                                  : ''}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                          <Grid item xs align='right'>
                                            <Typography
                                              style={{ color: '#014B7E' }}
                                              variant='body2'
                                            >
                                              {item.program_schedule
                                                ? JSON.parse(item.program_schedule)[0]
                                                  .datetime
                                                : ''}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </>
                                    )}
                                  />
                                  <CardActions disableSpacing>
                                    {/* <div style={{ border: '1px solid red' }}> */}
                                    <Grid item xs={4} align='center'>
                                      <IconButton
                                        style={{ color: 'blue' }}
                                        aria-label='add to favorites'
                                      >
                                        <UpdateIcon />
                                      </IconButton>
                                      <Typography
                                        variant='body2'
                                        style={{ marginTop: '-10px', color: '#014B7E' }}
                                      >
                                        {item.duration}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} align='center'>
                                      <IconButton aria-label='share'>
                                        <UnlikeIcon style={{ color: 'red' }} />
                                      </IconButton>
                                      <Typography
                                        variant='body2'
                                        style={{ marginTop: '-10px', color: '#014B7E' }}
                                      >
                                        {item.likes && item.likes} likes
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} align='center'>
                                      <IconButton
                                        className={clsx(classes.expand, {
                                          [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label='show more'
                                      >
                                        <Face style={{ color: '#d8ff13' }} />
                                      </IconButton>
                                      <Typography
                                        variant='body2'
                                        style={{ marginTop: '-10px', color: '#014B7E' }}
                                      >
                                        {item.views && item.views} views
                                      </Typography>
                                    </Grid>
                                    {/* </div> */}
                                  </CardActions>
                                </Card>
                              </Grid>
                            ))}
                        </Grid>
                      ) : (
                        // <Typography variant='subtitle1'>No Data Found</Typography>
                      <Grid item xs={12} className={classes.selectFilterGrid}>
                                <img
                                    src={unfiltered}
                                    alt="unFilter"
                                    className={classes.unfilteredImg}
                                />
                                <img
                                    src={selectFilter}
                                    alt="unFilter"
                                    className={classes.unfilteredTextImg}
                                />
                      </Grid>
                      )}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      {data && data.length ? (
                        <Grid
                          container
                          direction={isMobile ? 'column' : 'row'}
                          justify='flex-start'
                          alignItems='center'
                          spacing={isMobile ? 1 : 3}
                        >
                          {data.map((item, index) => (
                            <Grid item xs={12} md={6}>
                              <Card className={classes.ListenersCardoot}>
                                <CardHeader
                                  avatar={(
                                    <img
                                      src={BlackOrchidsRadio}
                                      style={{ width: '30px' }}
                                      alt='not found'
                                    />
                                  )}
                                  action={
                                    <Tooltip
                                      arrow
                                      classes={{
                                        tooltip: classes.customTooltip,
                                        arrow: classes.customArrow,
                                      }}
                                      interactive
                                      title={(
                                        <Typography
                                          color='primary'
                                          variant='body2'
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => handleDelete(item)}
                                        >
                                          Delete Participant
                                        </Typography>
                                      )}
                                    >
                                      <IconButton aria-label='settings' color='primary'>
                                        <MoreHorizIcon />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                  title={<Typography align='center'>ORCHADIO</Typography>}
                                />

                                <CardHeader
                                  style={{
                                    backgroundColor: '#F3F3F3',
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                  avatar={
                                    <IconButton
                                      className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                      })}
                                      onClick={handleExpandClick}
                                      aria-expanded={expanded}
                                      aria-label='show more'
                                    >
                                      <Face style={{ color: '#042955' }} />
                                    </IconButton>
                                  }
                                  title={
                                    <>
                                      <Grid item xs={12} sm container>
                                        <Grid
                                          item
                                          xs
                                          container
                                          direction='column'
                                          spacing={2}
                                        >
                                          <Grid item xs={isMobile ? 12 : ''}>
                                            {/* <Tooltip
                                              arrow
                                              classes={{
                                                tooltip: classes.customTooltip,
                                                arrow: classes.customArrow,
                                              }}
                                              disableFocusListener
                                              title={
                                                item.users.length ? (
                                                  item.users.map((i) => (
                                                    <li>
                                                      <Typography align='center'>
                                                        {i.first_name}
                                                      </Typography>
                                                    </li>
                                                  ))
                                                ) : (
                                                  <Typography align='center'>
                                                    No Participants
                                                  </Typography>
                                                )
                                              }
                                            > */}
                                            {isMobile ? (
                                              <List
                                                component='nav'
                                                aria-labelledby='nested-list-subheader'
                                                className={classes.listRoot}
                                              >
                                                <ListItem
                                                  id={index}
                                                  button
                                                  onClick={() =>
                                                    handleParticipantsCollapse(index)}
                                                >
                                                  <ListItemText
                                                    primary={(
                                                      <Typography
                                                        style={{ color: '#014b7e' }}
                                                        variant='body1'
                                                      >
                                                        Participants List
                                                      </Typography>
                                                    )}
                                                  />
                                                  {ParticipantOpen ? (
                                                    <ExpandLess />
                                                  ) : (
                                                    <ExpandMoreIcon />
                                                  )}
                                                </ListItem>
                                                {index === ParticipantOpenId ? (
                                                  <Collapse
                                                    id={index}
                                                    in={ParticipantOpen}
                                                    timeout='auto'
                                                    unmountOnExit
                                                  >
                                                    <List component='div' disablePadding>
                                                      <ListItem
                                                        button
                                                        className={classes.nested}
                                                      >
                                                        {item.users.length ? (
                                                          item.users.map((i) => (
                                                            <ListItemText
                                                              primary={(
                                                                <Typography align='center'>
                                                                  {i.first_name}
                                                                </Typography>
                                                              )}
                                                            />
                                                          ))
                                                        ) : (
                                                          <ListItemText
                                                            primary={(
                                                              <Typography align='center'>
                                                                No Participants
                                                              </Typography>
                                                            )}
                                                          />
                                                        )}
                                                      </ListItem>
                                                    </List>
                                                  </Collapse>
                                                ) : (
                                                  ''
                                                )}
                                              </List>
                                            ) : (
                                              <Tooltip
                                                arrow
                                                classes={{
                                                  tooltip: classes.customTooltip,
                                                  arrow: classes.customArrow,
                                                }}
                                                disableFocusListener
                                                title={
                                                  item.users.length ? (
                                                    item.users.map((i) => (
                                                      <li>
                                                        <Typography align='center'>
                                                          {i.first_name}
                                                        </Typography>
                                                      </li>
                                                    ))
                                                  ) : (
                                                    <Typography align='center'>
                                                      No Participants
                                                    </Typography>
                                                  )
                                                }
                                              >
                                                <Typography>Participants List</Typography>
                                              </Tooltip>
                                            )}
                                          </Grid>
                                        </Grid>
                                        {isMobile ? '' : <Grid item xs align='right'>
                                          <Typography
                                            style={{ color: '#014b7e' }}
                                            variant='body1'
                                          >
                                            {item.program_schedule &&
                                              JSON.parse(item.program_schedule)[0]
                                                .datetime}
                                          </Typography>
                                        </Grid>
                                        }
                                      </Grid>
                                    </>
                                  }
                                />
                                <CardContent>
                                  <Grid item xs={12} sm container>
                                    <Grid
                                      item
                                      xs
                                      container
                                      direction='row'
                                      alignContent='center'
                                      spacing={2}
                                    >
                                      <Grid item xs align='center'>
                                        <IconButton
                                          align='center'
                                          style={{ color: 'blue' }}
                                          aria-label='add to favorites'
                                        >
                                          <UpdateIcon />
                                        </IconButton>
                                        <Typography
                                          variant='body2'
                                          style={{ marginTop: '-10px', color: '#014B7E' }}
                                        >
                                          {item.duration && item.duration} min
                                        </Typography>
                                      </Grid>
                                      <Grid item xs align='center'>
                                        {/* </Grid> */}
                                        {/* <Grid item xs align='center'> */}
                                        <IconButton
                                          align='center'
                                          className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                          })}
                                          onClick={handleExpandClick}
                                          aria-expanded={expanded}
                                          aria-label='show more'
                                        >
                                          <UnlikeIcon style={{ color: 'red' }} />
                                        </IconButton>
                                        <Typography
                                          variant='body2'
                                          style={{ marginTop: '-10px', color: '#014B7E' }}
                                        >
                                          {item.likes && item.likes} likes
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Divider variant='middle' />
                                  <Grid item xs={12} sm container>
                                    <Grid
                                      item
                                      xs
                                      container
                                      direction='column'
                                      alignContent='center'
                                      spacing={2}
                                    >
                                      <Grid item xs align='center'>
                                        <Typography>Listened above</Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                                <CardActions disableSpacing>
                                  {/* <div style={{ border: '1px solid red' }}> */}
                                  <Grid item xs={4} align='center'>
                                    <Typography color='primary'>0%</Typography>
                                    <Typography>
                                      {item.listened_zero_percentage &&
                                        item.listened_zero_percentage}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} align='center'>
                                    <Typography color='primary'>30%</Typography>
                                    <Typography>
                                      {item.listened_upto_30_percentage &&
                                        item.listened_upto_30_percentage}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} align='center'>
                                    <Typography color='primary'>80%</Typography>
                                    <Typography>
                                      {item.listened_upto_80_percentage &&
                                        item.listened_upto_80_percentage}
                                    </Typography>
                                  </Grid>
                                  {/* </div> */}
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        // <Typography variant='subtitle1'>No Data Found</Typography>
                        <Grid item xs={12} className={classes.selectFilterGrid}>
                                <img
                                    src={unfiltered}
                                    alt="unFilter"
                                    className={classes.unfilteredImg}
                                />
                                <img
                                    src={selectFilter}
                                    alt="unFilter"
                                    className={classes.unfilteredTextImg}
                                />
                      </Grid>
                      )}
                    </TabPanel>
                  </div>
                </Grid>
              </Grid>
              <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
                id="modalManageContainer"
              >
                <Fade in={open}>
                  <div className={classes.modalPaper}>
                    <h2 id='transition-modal-title'>Schedule</h2>
                    <Grid container>
                      <Grid item md={3} xs={12}>
                        <Autocomplete
                          style={{ width: '100%' }}
                          size='small'
                          onChange={(event, value) => {
                            setSelectedAcadmeicYear(value);
                            console.log(value, 'test');
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
                              console.log(value);
                              callApi(
                                `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id
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
                              const branchId = selectedBranch.branch.id;
                              const gradeId = selectedGrade.grade_id;
                              const secId = value.section_id;
                              setSelectedSection(value);
                              setSecSelectedId(secId);
                              callApi(
                                `${endpoints.academics.students}?academic_year_id=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${gradeId}&section_id=${secId}&module_id=${moduleId}`,
                                'student'
                              );
                            }
                            setStudentList([])
                            setSelectedStudent([])
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

                      <Grid item md={3} xs={12}>
                        <Autocomplete
                          // multiple
                          style={{ width: '100%' }}
                          size='small'
                          onChange={(event, value) => {
                            setSelectedStudent([]);
                            if (value) {
                              const ids = value.id;
                              console.log(value, "userrr");
                              const stuId = value.user;
                              setSelectedStudent(value);
                              setSecSelectedId(stuId);
                              setUserId(stuId);
                            }
                          }}
                          id='section_id'
                          className='dropdownIcon'
                          value={selectedStudent || ''}
                          options={studentList || ''}
                          getOptionLabel={(option) =>
                            option?.name || ''
                          }
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Student'
                              placeholder='Students'
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <div style={{ marginTop: 20 }}>
                          <Button
                            style={{
                              fontSize: 'small',
                              width: 150,
                              position: 'absolute',
                              //   marginTop: '115px',
                            }}
                            onClick={handleParticipantSubmit}
                            color='primary'
                            size='small'
                            variant='contained'
                          >
                            Submit
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </div>

                  {/* <TextField
                      fullWidth
                      style={{ marginLeft: 20 }}
                      id='outlined-basic'
                      label='Duration in minutes'
                      variant='outlined'
                      multiline
                    /> */}
                  {/* </div> */}
                </Fade>
              </Modal>
            </div>
          </div>
        </div>
        <Grid container justify='center'>
          {data && !loading && <Pagination
            onChange={handlePagination}
            // style={{ paddingLeft: '150px' }}
            // count={Math.ceil(totalGenre / limit)}
            count={totalPages}
            color='primary'
            page={pageNumber}
            color='primary'
          />}
        </Grid>
      </Layout>
    </div>
  );
}
export default ManageOrchadio;
