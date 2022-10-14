import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import RatingScale from './RatingScale';
import Loader from 'components/loader/loader';

// import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './styles.scss';

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
  Tooltip,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';

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
import './images.css';

import './styles.scss';

import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import { Rating } from '@material-ui/lab';

const DEFAULT_RATING = 0;

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
  card: {
    maxWidth: '100%',
  },
  media: {
    height: 240,
    objectFit: 'cover',
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

  customTabRoot: {
    color: 'red',
    backgroundColor: 'green',
  },
  customTabIndicator: {
    backgroundColor: 'orange',
  },
  cardcontent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
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
  rating: {
    '& .MuiRating-sizeLarge': {
      fontSize: '5px !important',
    },
  },
}));

const StudentSideBlog = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  // const User_id  = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  // console.log(User_id.id,"User_id")
  // const User_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};

  const [moduleId, setModuleId] = useState();
  const [month, setMonth] = useState('1');
  const [status, setStatus] = useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);

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
  const [values, setValues] = useState();
  const [publish, setPublish] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [readMore, setReadMore] = useState(true)
  const [flag,setFlag] = useState(false)
  const [currentDate,setCurrentDate] =useState('')
  const [userData , setUserData] = useState()
  const [loading,setLoading] = useState(false);


  const createPublish = () => {
    setPublish(true);
  };
  // useEffect(() => {
  //   setValues({
  //     rating: DEFAULT_RATING,
  //   });
  // }, []);

  const [maxWidth, setMaxWidth] = React.useState('lg');

  function handleTab(event, newValue) {
    console.log(newValue);
    setValue(newValue);
  }
  const [submit, setSubmit] = useState(false);

  const submitReview = () => {
    setLoading(true)
    setSubmit(true);
    console.log(ratingReview, 'ratingReview');
    setSubmit(true);
    let body = {
      user_reviews: ratingReview,
    };

    axios
      .post(
        `https://activities-revamp.dev-k8.letseduvate.com/api/review_student_activity/`,
        body,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setLoading(false)
      })
      .catch((err) =>{
        setLoading(false)
      })
  };

  let array = [];
  const getRatingView = (data) => {
    setLoading(true)
    axios
      .get(
        `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'responses');
        response.data.map((obj, index) => {
          let temp = {};
          temp['id'] = obj?.id;
          temp['name'] = obj?.level.name;
          temp['remarks'] = obj?.remarks;
          temp['given_rating'] = obj?.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  };
  const expandMore = () => {
    setSubmit(false);
  };
  const EditActivity = (response) => {
    // history.push('/blog/activityedit');
    history.push({
      pathname: '/blog/activityedit',
      state: {
        response,
      },
    });
  };
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
        console.log(response, 'session');

        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
      });
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
        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setUserData(response?.data?.result)
        getActivitySession();
        setLoading(false);
      });
  };
  const [assinged, setAssigned] = useState([]);
  const getAssinged = async () => {
    setLoading(true)

    const UserData =  JSON.parse(localStorage.getItem('ActivityManagement')) || {};
    axios
      .get(
        `${endpoints.newBlog.Assign}?section_ids=null&user_id=${UserData.id}&is_draft=false`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        var today = new Date().toISOString();
        const output = today?.slice(0,19);
        setCurrentDate(output)
        console.log(response);
        setAssigned(response?.data.result);
        setLoading(false)
        
      });
  };

  useEffect(() => {
    ActvityLocalStorage();
  }, []);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalReview, setTotalReview] = useState([]);
  const getTotalReview = async () => {
    setLoading(true)
    const User_id = (await JSON.parse(localStorage.getItem('ActivityManagement'))) || {};

    axios
      .get(
        `${endpoints.newBlog.studentSideApi}?section_ids=null&&user_id=${User_id.id}&&activity_detail_id=null&is_reviewed=True`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'response');
        setTotalReview(response?.data?.result);
        setLoading(false);
      });
  };

  const getTotalSubmitted = async () => {
    setLoading(true)
    const User_id = (await JSON.parse(localStorage.getItem('ActivityManagement'))) || {};

    axios
      .get(
        `${endpoints.newBlog.studentSideApi}?section_ids=null&&user_id=${User_id.id}&&activity_detail_id=null&is_reviewed=False&is_submitted=True`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'response');
        setTotalSubmitted(response?.data?.result);
        setLoading(false)
      });
  };

  useEffect(() => {
    if(userData)
  getAssinged();
  }, [value,userData]);
  const [view, setView] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [imageData,setImageData] = useState('')
  const viewMore = (data) => {
    setView(true);
    setImageData(JSON.parse(data?.template?.html_file))
    setPreviewData(data);
    getRatingView(data?.id);
  };
  const handleCloseViewMore = () => {
    setView(false);
  };

  const handleInputCreativity = (event, index) => {
    console.log(index, 'text');

    let arr = [...ratingReview];
    arr[index].remarks = event.target.value;
    setRatingReview(arr);
  };
  const handleInputCreativityOne = (event, newValue, index) => {
    console.log(index, newValue, 'event');
    let arr = [...ratingReview];
    arr[index].given_rating = event.target.value;
    setRatingReview(arr);
  };


  const handleClose =() => {
    setView(false);

  }
  return (

    <div>
      {loading && <Loader/>}
    <Layout>
       <div className='layout-container-div ebookscroll' style={{
        // background: 'white',
        height: '90vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
      }}>
      <Grid
        container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '22px',
          paddingRight: '15px',
          paddingBottom: '15px',
        }}
      >
        <Grid item xs={4} md={4}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' style={{color:'black'}} />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' variant='h6'>
              <strong>Student Activity</strong>
            </Typography>
            <Typography color='textPrimary' style={{fontSize: '22px', fontWeight:'bolder'}}>My Activities</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item md={12} xs={12} className={classes.tabStatic}>
          <Tabs
            onChange={handleTab}
            textColor='primary'
            indicatorColor='primary'
            // className={ classes.tabsFont}
            value={value}
          >
            <Tab
              label={`Assigned`}
              classes={{
                selected: classes.selected1,
              }}
              className={value === 0 ? classes.tabsFont : classes.tabsFont1}
              onClick={getAssinged}
            />

            <Tab
              label='Total Submitted'
              classes={{
                selected: classes.selected2,
              }}
              className={value === 1 ? classes.tabsFont : classes.tabsFont1}
              onClick={getTotalSubmitted}
            />
            <Tab
              label='Reviewed'
              classes={{
                selected: classes.selected2,
              }}
              className={value === 2 ? classes.tabsFont : classes.tabsFont1}
              onClick={getTotalReview}
            />

            {/* <Tab
              label='Published'
              classes={{
                selected: classes.selected2,
              }}
              className={value === 3 ? classes.tabsFont : classes.tabsFont1}
            /> */}
          </Tabs>
          <Divider className={classes.dividerColor} />
        </Grid>
      </Grid>
      {value == 0 && (
        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: '20px',
            paddingTop: '22px',
            paddingBottom: '26px',
            width: '100%',
          }}
        >
          {assinged?.map((response) => (
            <Grid item xs={12} md={3} sm={6}>
              <Card className={classes.card}>
                <CardActionArea
                  style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '7px' }}
                >
                  <Typography
                    style={{
                      fontWeight: 'bold',
                      color: '#036DE2',
                      fontSize: '10px',
                    }}
                  >
                    {response?.activity_type_name}
                  </Typography>
                  <Typography
                    style={{ color: '#061B2E', fontWeight: 'bold', fontSize: '15px' }}
                  >
                  

                      {response?.title}
                  </Typography>
                  <Typography
                    style={{ fontSize: '12px', paddingTop: '6px', color: '#536476' }}
                  >
                    {/* word limit-300{' '} */}
                  </Typography>
                  <div
                    color='textSecondary'
                    component='p'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {response && response?.issue_date == null ? (
                      ''

                    ) : (
                    <div style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>
                      
                      assinged - {response?.issue_date?.substring(8,10)}&nbsp;
                      {new Date(response?.issue_date)?.toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.issue_date.substring(0, 4)}
                    </div>

                    )}
                    &nbsp;&nbsp;&nbsp;
                    <div
                      style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#1B4CCB' }}
                    >
                      submission Date-{response?.created_at.substring(8, 10)}&nbsp;
                      {new Date(response?.created_at).toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.created_at.substring(0, 4)}
                    </div>
                    &nbsp;&nbsp;
                  </div>
                </CardActionArea>
                <CardActionArea style={{ padding: '11px' }}>
                  <CardMedia
                    className={classes.media}
                    style={{ border: '1px solid lightgray', borderRadius: '6px' }}
                    image={response?.template?.template_path}
                    title='Contemplative Reptile'
                  />
                </CardActionArea>
                { moment(currentDate).diff(moment(response?.submission_date),'hours') > 24 ? (
                  <div style={{display:'flex', justifyContent:'center', padding:'10px'}}>
                    <b style={{color:'red'}}>EXPIRED</b>
                  </div>
                ) : (
                <CardActions style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    onClick={() => EditActivity(response)}
                    color='primary'
                    size='small'
                  >
                    Start Writting
                  </Button>{' '}
                </CardActions>
                  
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {value == 2  && (
        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: '20px',
            paddingTop: '22px',
            paddingBottom: '26px',
            width: '100%',
          }}
        >
          {totalReview?.map((response) => (
            <Grid item xs={12} md={3} sm={6}>
              <Card className={classes.card}>
                <CardActionArea
                  style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '7px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          color: '#036DE2',

                          fontSize: '13px',
                        }}
                      >
                        {response?.activity_detail?.title}
                      </Typography>
                    </div>
                    <div>
                      <Tooltip title='View More'>
                        <MoreVertIcon
                          style={{ color: 'black', cursor: 'pointer' }}
                          onClick={() => viewMore(response)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <Typography
                    style={{
                      color: '#061B2E',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      paddingLeft: '5px',
                    }}
                  >
                    {ReactHtmlParser(response?.content?.html_text)}
                  </Typography>
                  <Typography
                    style={{ fontSize: '12px', paddingTop: '6px', color: '#536476' }}
                  >
                    {/* word limit-300{' '} */}
                  </Typography>
                  <div
                    color='textSecondary'
                    component='p'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>
                      assinged-{response?.activity_detail?.issue_date?.slice(8, 10)}&nbsp;
                      {new Date(
                        response?.activity_detail?.issue_date
                      ).toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.activity_detail?.issue_date?.slice(0, 4)}
                    </div>{' '}
                    &nbsp;&nbsp;&nbsp;
                    <div
                      style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#1B4CCB' }}
                    >
                      submitted-
                      {response?.submitted_on?.slice(8, 10)}&nbsp;
                      {new Date(
                        response?.submitted_on
                      ).toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.submitted_on?.slice(0, 4)}
                    </div>
                    &nbsp;&nbsp;
                  </div>
                </CardActionArea>
                <CardActionArea style={{ padding: '11px' }}>
                  <CardMedia
                    className={classes.media}
                    style={{ border: '1px solid lightgray', borderRadius: '6px' }}
                    image={response?.template?.template_path}
                    title='Contemplative Reptile'
                  />
                </CardActionArea>
                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <div>
                    <img
                      src='https://d3ka3pry54wyko.cloudfront.net/dev/media/assessment/test_id-None/4255/1660653207_group_53678@2x.png'
                      style={{ width: '25px' }}
                    />
                    &nbsp;22&nbsp;&nbsp;
                    <img src='https://d3ka3pry54wyko.cloudfront.net/dev/media/assessment/test_id-None/4255/1660653256_group_53679.png' />
                    &nbsp;21
                  </div> */}
                  <div>
                    <StyledRating 
                    // rating= {response?.user_reviews?.given_rating}
                    precision={0.1}
                    defaultValue={response?.user_reviews?.given_rating}
                    max={parseInt(response?.user_reviews?.level?.rating)}
                    readOnly
                    />
                  </div>
                </CardActions>
                {/* <CardActions style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    onClick={() => EditActivity(response)}
                    color='primary'
                    size='small'
                  >
                    Start Writting
                  </Button>{' '}
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {value ==1  && (
        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: '20px',
            paddingTop: '22px',
            paddingBottom: '26px',
            width: '100%',
          }}
        >
          {totalSubmitted?.map((response) => (
            <Grid item xs={12} md={3} sm={6}>
              <Card className={classes.card}>
                <CardActionArea
                  style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '7px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          color: '#036DE2',

                          fontSize: '13px',
                        }}
                      >
                        {response?.activity_detail?.title}
                      </Typography>
                    </div>
                    <div>
                      <Tooltip title='View More'>
                        <MoreVertIcon
                          style={{ color: 'black', cursor: 'pointer' }}
                          onClick={() => viewMore(response)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <Typography
                    style={{
                      color: '#061B2E',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      paddingLeft: '5px',
                    }}
                  >
                   
                    {ReactHtmlParser(response?.content?.html_text)}
                  </Typography>
                  <Typography
                    style={{ fontSize: '12px', paddingTop: '6px', color: '#536476' }}
                  >
                    {/* word limit-300{' '} */}
                  </Typography>
                  <div
                    color='textSecondary'
                    component='p'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>
                      assinged-{response?.activity_detail?.issue_date?.slice(8, 10)}&nbsp;
                      {new Date(
                        response?.activity_detail?.issue_date
                      ).toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.activity_detail?.issue_date?.slice(0, 4)}
                    </div>{' '}
                    &nbsp;&nbsp;&nbsp;
                    <div
                      style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#1B4CCB' }}
                    >
                      submitted-
                      {response?.submitted_on?.slice(8, 10)}&nbsp;
                      {new Date(
                        response?.submitted_on
                      ).toLocaleString('en-us', {
                        month: 'short',
                      })}
                      &nbsp;{response?.submitted_on?.slice(0, 4)}
                    </div>
                    &nbsp;&nbsp;
                  </div>
                </CardActionArea>
                <CardActionArea style={{ padding: '11px' }}>
                  <CardMedia
                    className={classes.media}
                    style={{ border: '1px solid lightgray', borderRadius: '6px' }}
                    image={response?.template?.template_path}
                    title='Contemplative Reptile'
                  />
                </CardActionArea>
                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <div>
                    <img
                      src='https://d3ka3pry54wyko.cloudfront.net/dev/media/assessment/test_id-None/4255/1660653207_group_53678@2x.png'
                      style={{ width: '25px' }}
                    />
                    &nbsp;22&nbsp;&nbsp;
                    <img src='https://d3ka3pry54wyko.cloudfront.net/dev/media/assessment/test_id-None/4255/1660653256_group_53679.png' />
                    &nbsp;21
                  </div>
                  <div>
                    <RatingScale rating='3' />
                  </div> */}
                </CardActions>
                {/* <CardActions style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    onClick={() => EditActivity(response)}
                    color='primary'
                    size='small'
                  >
                    Start Writting
                  </Button>{' '}
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', marginTop: '72px' }}>
          <div style={{display:'flex', justifyContent:'space-between',}}>
          <div style={{ fontSize: '24px' }}>
            <strong>Preview</strong>
          </div>
          <div style={{ fontSize: '24px', cursor:'pointer' }}>
            <strong onClick={handleClose}>X</strong>
          </div>

          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  border: '1px solid #813032',
                  width: '583px',
                  background: 'white',
                  height: 'auto',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    width: '554px',
                    marginLeft: '13px',
                    marginTop: '5px',
                  }}
                >
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
                    
                  </div>
                </div>

                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    marginTop: '16px',
                    height: 'auto',
                  }}
                >
                  <div
                    style={{ paddingLeft: '30px', paddingTop: '7px', fontWeight: 'bold' }}
                  >
                    <span style={{ fontWeight: 'normal' }}>
                      Title: {previewData?.activity_detail?.title}
                    </span>
                  </div>
                  <div
                    style={{
                      paddingLeft: '30px',
                      paddingTop: '10px',
                      paddingBottom: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    <span style={{ fontWeight: 'normal' }}>
                      Description: {previewData?.activity_detail?.description}
                    </span>
                  </div>
                </div>
                {console.log(previewData,"DP")}
                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    height: 'auto',
                    marginTop: '12px',
                    marginBottom: '29px',
                  }}
                >
                  <div style={{padding: '5px'}}>
                  <div
        style={{
          background: `url(${previewData?.template?.template_path})`,
          backgroundSize: "contain",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(244 245 247 / 25%)",
    height: "683px",
        }}

      >
        <div className="certificate-text-center certificate-input-box" style={{top:`calc(279px + ${imageData[0]?.x_cordinate.concat('px')})`, left:`calc(232px + ${imageData[0]?.y_cordinate.concat('px')})`}}>
          <textarea className="certificate-box" style={{width:`${imageData[0]?.width}px`,
    height:`${imageData[0]?.height}px`,top:`${imageData[0]?.x_cordinate}px`, left: `${imageData[0]?.y_cordinate}px`}} value={previewData?.submitted_work?.html_text} placeholder="type text here..." />
         
        </div>
      </div>
                  </div>
                  {/* <div
                    style={{
                      paddingLeft: '30px',
                      paddingTop: '12px',
                      paddingBottom: '6px',
                    }}
                  >
                    {ReactHtmlParser(previewData?.submitted_work?.html_text)}
                  </div> */}
                </div>
              </div>
            </Grid>
            <Grid item>
              {submit == false ? (
                <div style={{ paddingLeft: '10px' }}>Review</div>
              ) : (
                <div style={{ paddingLeft: '8px' }}>Edit Review</div>
              )}
              {submit == false && (
                <div
                  style={{
                    border: '1px solid #707070',
                    width: '295px',
                    height: 'auto',
                    marginLeft: '11px',
                    marginRight: '10px',
                  }}
                >
                  {ratingReview?.map((obj, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          paddingLeft: '15px',
                          paddingRight: '15px',
                          paddingTop: '5px',
                        }}
                      >
                        <div
                          key={index}
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          {' '}
                          {obj?.name}
                          <StyledRating
                            name={`rating${index}`}
                            size='small'
                            readOnly
                            // rating={obj?.given_rating}
                            defaultValue={obj?.given_rating}
                            precision={0.1}
                            max={parseInt(obj?.level)}
                            onChange={(event, newValue) =>
                              handleInputCreativityOne(event, newValue, index)
                            }
                          />
                        </div>
                        {/* {obj} */}
                        <div>
                          <TextField
                            id='outlined-basic'
                            size='small'
                            disabled
                            variant='outlined'
                            value={obj?.remarks}
                            style={{ width: '264px' }}
                            onChange={(event) => handleInputCreativity(event, index)}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginRight: '10px',
                      marginLeft: '6px',
                      marginBottom: '15px',
                      marginTop: '32px',
                    }}
                  ></div>
                </div>
              )}

              {submit == true && (
                <div
                  style={{
                    border: '1px solid #707070',
                    width: '318px',
                    height: 'auto',
                    marginLeft: '8px',
                    marginRight: '4px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <ExpandMoreIcon onClick={expandMore} />
                  </div>
                  <div
                    style={{
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      paddingTop: '5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {' '}
                      Overall
                      <RatingScale
                        name='simple-controlled'
                        defaultValue={DEFAULT_RATING}
                        onChange={(event, value) => {
                          setValues((prev) => ({ ...prev, rating: value }));
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '9px',
                      }}
                    >
                      Review Submitted
                    </div>
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </Drawer>
      </div>
    </Layout>

    </div>
  );
};
export default StudentSideBlog;
