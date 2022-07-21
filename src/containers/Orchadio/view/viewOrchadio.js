import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import {
  Grid,
  IconButton,
  Tooltip,
  Card,
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
import MobileDatepicker from './datePicker';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Loading from '../../../components/loader/loader';
import orchidsRadioLogo from './orchidsRadioLogo.png';
import Nodata from '../../../assets/images/not-found.png';
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
    color: theme.palette.secondary.main,
  },
  comment: {
    backgroundColor: '#f9f9f9',
    width: '95%',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: '50px',
    display: 'flex',
  },
  commenter: {
    marginRight: '5px'
  },
  commentInput: {
    height: 50,
  },
  programList: {
    '&:hover': {
      background: '#F9F9F9',
    },
  },
  expandComments: {
    maxHeight: '200px',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  selectBg: {
    backgroundColor: theme.palette.primary.primarylightest,
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
  const [branchName, setBranchName] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1)
  const limit = 5;
  const [totalPages, setTotalPages] = React.useState('')
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'))
  const [startDate, setStartDate] = React.useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState(
    moment(startDate, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const location = useLocation();

  var letterNumber = /^.*[a-zA-Z0-9][^a-zA-Z0-9]*$/

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
  

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const Expandpanel = (item) => {
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
      scheduledDate: moment('2021-03-17T21:03:55'),
      duration: '86400',
    });
    let arr = [];
    const found = data.filter((n) => n.id === item.id);
    const otherElements = data.filter((n) => n.id !== item.id);
    arr = [...otherElements];
    arr.unshift(found);
    arr = [...arr.flat()];
    setBranchName(selectedItem);
    if (arr.length) {
      console.log(arr, 'arr');
      scrollToTop();
    }
    
  };
  const handleComment = (event) => {
    setComment(event.target.value);
  };

  const commentValidate = (item) => {
    if (!letterNumber.test(comment)) {
      console.log("not match");
      setAlert('warning', "Please enter comment");
    } else {
      postComment(item);
    }
  }

  const postComment = (item) => {
    if(!comment){
      setAlert('warning', "Please enter comment");
     return
    }
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
            console.log(it , "it");
            console.log(item , "item");
            if (it.id === item.id) {
              const commentArray = [{'comment' : comment, 'user__first_name' : name ,'user__username' : userName[0] }]
              it.comments_list.unshift(commentArray[0]);
              console.log(commentArray , "its");
            }
            return it;
          });
          setData(dat);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.response?.data?.description)
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
    if (tabValue === 0) {
      setData([]);
      console.log(data, 'data');
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?page_number=${pageNumber}&page_size=${limit}&session_year=${sessionYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          
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
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?category_type=1&page_number=${pageNumber}&page_size=${limit}&session_year=${sessionYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
         
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
     
      axios
      .get(`${endpoints.orchadio.GetRadioProgram}?is_deleted=True&page_number=${pageNumber}&page_size=${limit}&session_year=${sessionYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
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
  }, []);

  const getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('DD-MM-YYYY') : undefined;
  };
  const getDaysBefore = (date, amount) => {
    return date ? date.subtract(amount, 'days').format('DD-MM-YYYY') : undefined;
  };
  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.format('DD-MM-YYYY'));
  };
  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('DD-MM-YYYY'));
  };
  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
    setLoading(true)
    setPageNumber(1)
  };
  useEffect(() => {
    console.log('data change');
    setData(null);
    getRadio();
  }, [tabValue,pageNumber]);
  const handleChange = (panel) => (event, expanded) => {
    setExpandedPanel(expanded ? panel.id : false);
    Expandpanel(panel);
   
  };

 
  const handleFilter = () => {
    axios
      .get(
        `${endpoints.orchadio.GetRadioProgram}?is_deleted=True&start_date=${startDate}&end_date=${endDate}&session_year=${sessionYear?.id}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages)
          const firstItem =
            result.data.result.data.length && result.data.result.data.slice(0, 1);
          Expandpanel(firstItem[0]);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };

  const likeHandler = (item) => {
    setLoading(true)
    axios
      .put(`${endpoints.orchadio.PostCommentandLike}${item.id}/orchido-like/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
         
          const dat = data.map((it) => {
            if (it.id === item.id) {
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
          <AudioPlayerWrapper
            albumName={item.radioTitle}
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
                                      margin: '20px',
                                      width: 150,
                                    }}
                                    className = "labelColor cancelButton"
                                    size='medium'
                                    variant='contained'
                                    disabled
                                  >
                                    Clear All
                                  </Button>
                                  <Button
                                    style={{
                                      margin: '20px',
                                      width: 150,
                                    }}
                                    onClick={handleFilter}
                                    color='primary'
                                    size='medium'
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
                    {data.length ? getRadioList() : <div  style={{display:'flex' , justifyContent:'center',width:'100%'}}> <img src={Nodata}  /> </div>}
                    {data.map((item, index) => (
                      <Grid item xs={12} className='audioArea'>
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
                        >
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid item xs={6}>
                              <img
                                src={orchidsRadioLogo}
                                alt='not Found'
                                width='50px'
                                style={{
                                  float: 'left',
                                  borderRadius: '60px',
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
                                <IconButton>
                                  <Typography variant='body2' style={{ marginRight: 5, color : "black" }}>
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
                                  onClick={() => likeHandler(item)}
                                >
                                  <Typography variant='body2' style={{ marginRight: 5,color : "black" }}>
                                    {item.likes}
                                  </Typography>
                                  {item.is_like === true ? (
                                    <LikeIcon style = {{color : 'red'}} />
                                  ) : (
                                    <UnlikeIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                              <Tooltip title='Comment'>
                                <IconButton>
                                  <Typography variant='body2' style={{ marginRight: 5 , color : "black"}}>
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
                                required
                                // fullWidth
                                rowsMax={4}
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
                                onClick={() => commentValidate(item)}
                              >
                                Post
                              </Button>
                              {item.comments_list.map((c) => (
                                <div className="commentArea" >
                                 
                                <Card className={classes.comment}  >
                                <Chip
                                      avatar={<Avatar>{c?.user__first_name?.charAt(0)}</Avatar>}
                                      label={c.user__first_name}
                                      className={classes.commenter}
                                    />
                                  <Typography>{c.comment}</Typography>
                                </Card>
                                </div>
                              ))}
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
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
