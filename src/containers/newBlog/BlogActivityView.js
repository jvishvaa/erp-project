import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
  // Divider,
  TextField,
  makeStyles,
  Grid,
  Drawer,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import "./blog.css";
import Layout from 'containers/Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { useTheme, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from '../../config/endpoints';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Rating } from '@material-ui/lab';
import { Breadcrumb, Tabs, Select, DatePicker, Spin, Pagination, Button } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { DownOutlined, CheckOutlined, SearchOutlined, FormOutlined } from '@ant-design/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import { UserOutlined } from '@ant-design/icons';
import BlogWallImage from "../../assets/images/ssss.jpg";
import './blog.css';

const drawerWidth = 350;
const { TabPane } = Tabs;

const StyledRating = withStyles(() => ({
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



const BlogActivityView = () => {
  const classes = useStyles();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const user_level = data?.user_level;
  const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );


  const [maxWidth, setMaxWidth] = React.useState('lg');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [desc, setDesc] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [activityName, setActivityName] = useState([]);
  const [changeText, setChangeText] = useState("");
  const [visible, setVisible] = useState(false);
  const [showTab, setShowTab] = useState('1');
  const [view, setView] = useState(false);
  const [postView, setPostView] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });
  // const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  // const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const [branchIds, setBranchIds] = useState('');
  const [date, setDate] = useState('');
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const userId = JSON.parse(localStorage.getItem('ActivityManagementSession'))?.user_id;
  const [categories, setCategories] = useState([]);
  const [listCount, setListCount] = useState('');
  const [postListCount, setPostListCount] = useState('')
  const [pageNumber, setPageNumber] = useState(1);
  const [blogWallList, setBlogWallList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedGradeId, setSelectedGradeIds] = useState('')
  const [blogList, setBlogList] = useState([])
  const [selectedBlogListId, setSelectedBlogListId] = useState('')
  const [imageData, setImageData] = useState('')
  const [previewData, setPreviewData] = useState('');
  const [ratingReview, setRatingReview] = useState([]);
  const [expandFilter, setExpandFilter] = useState(true);
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const [postWallList, setPostWallList] = useState([])
  const [postPreviewData, setPostPreviewData] = useState('');
  // const user_level = userData?.user_level;





  const showBranchFilter = [1, 2, 4, 8, 9];
  const branchOptions = branchList?.map((each) => {
    return (
      <Option value={each?.id} key={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const blogListOptions = blogList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.title}
      </Option>
    )
  })

  const fetchGradeData = (e) => {
    if (e) {
      setLoading(true)
      axios
        .get(`${endpoints.newBlog.activityGrade}?branch_ids=${e}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          })
        .then((response) => {
          setGradeList(response?.data?.result)
          setLoading(false)
        })

    }
  };

  const handleBranchChange = (item) => {
    const branches = item?.map((i) => i.value).join(',');
    setBranchIds(branches);
    fetchGradeData(branches)
  };


  useEffect(() => {
    if (branch_update_user) {
      setLoading(true)
      var branchIds = branch_update_user?.branches?.map((item) => item?.id)
      axios
        .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          })
        .then((response) => {
          if (response?.data?.status_code === 200) {
            setBranchList(response?.data?.result || [])
            setLoading(false)

          }

        })

    }
  }, [])

  const blogListApiCall = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.blogListDropApi}`, {
        params: {
          ...(branchIds ? { branch_ids: branchIds } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {})
        },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        }

      })
      .then((response) => {
        if (response.status === 200) {
          setBlogList(response?.data?.result)
          setLoading(false)

        }
      })
      .catch(() => {
        setLoading(false)
      })
  }



  const handleGradeChange = (e) => {
    if (e) {
      setSelectedGradeIds(e)
    } else {
      setSelectedGradeIds('')
    }
  };

  const handleBlogListChange = (e, value) => {
    if (e) {
      setSelectedBlogListId(value?.value)
    } else {
      setSelectedBlogListId('')
    }
  }


  const fetchPostWall = (params = {}) => {
    setLoading(true)
    axios
      .get(`${endpoints.newBlog.postActivityListAPI}`, {
        params: {
          ...params,
          ...(startDate ? { start_date: startDate } : {}),
          ...(endDate ? { end_date: endDate } : {}),
          ...(branchIds ? { branch_ids: branchIds } : {}),
          ...(selectedBlogListId ? { activity_detail_id: selectedBlogListId } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {})

        },

        headers: {
          'X-DTS-HOST': X_DTS_HOST,

        }
      })
      .then((response) => {
        setPostWallList(response?.data?.result)
        setPostListCount(response?.data?.result?.length)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const fetchSchoolWall = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.blogWallApi}`, {
        params: {
          ...params,
          ...(startDate ? { start_date: startDate } : {}),
          ...(endDate ? { end_date: endDate } : {}),
          ...(branchIds ? { branch_ids: branchIds } : {}),
          ...(selectedBlogListId ? { activity_detail_id: selectedBlogListId } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {})
        },

        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setBlogWallList(response?.data?.result)
          setListCount(response?.data?.total)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const handleGoBack = () => {
    history.goBack()
  }


  useEffect(() => {
    blogListApiCall()
  }, [branchIds, selectedGradeId])


  useEffect(() => {
    handleSearch()
  }, [showTab, pageNumber])

  const handleSearch = () => {
    if (showTab == 1) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        user_id: userId,
      });
    } else if (showTab == 2) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        publish_level: 'Intra Orchids Level',
        user_id: userId,
      });
    } else if (showTab == 3) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        publish_level: 'Branch Level',
        user_id: userId,
      })
    } else if (showTab == 4) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        publish_level: 'Grade Level',
        user_id: userId,
      })
    } else if (showTab == 5) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        is_best_blog: 'true',
        user_id: userId,
      })
    } else if (showTab == 6) {
      fetchSchoolWall({
        // page_size: 5,
        // page: pageNumber,
        publish_level: 'Section Level',
        user_id: userId,
      })

    }
  }


  const handleClose = () => {
    setView(false);
    setPostView(false)

  }

  const viewMore = (data) => {
    setView(true);
    setImageData(JSON.parse(data?.template?.html_file))
    setPreviewData(data)
    getRatingView(data?.booking_id)
  };


  const getViewCard = (data) => {
    setLoading(true)
    axios
      .get(`${endpoints.newBlog.postActivityViewMoreAPI}${data}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setLoading(false)

      })

  }

  const viewMorePost = (data) => {
    setPostView(true);
    setPostPreviewData(data)
    getViewCard(data?.id)

  }






  const [typeText, setTypeText] = useState([{ name: "text" }, { name: "template" }])
  const [activityCategory, setActivityCategory] = useState([]);
  const [activityStorage, setActivityStorage] = useState([]);


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [templates, setTemplates] = useState([]);

  const getTemplate = (data) => {
    if (data) {
      setLoading(true)
      axios
        .get(`${endpoints.newBlog.getTemplates}${data}/`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          setTemplates(response?.data?.result);
          setLoading(false)

        });

    }
  };

  const showModal = () => {
    history.push(
      `/create-post-activity`
    );
  };

  useEffect(() => {
    getTemplate()
  }, [selectedBranch, activityName]);

  const [checked, setChecked] = React.useState("");




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
        response.data.map((obj) => {
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
      .catch(() => {
        setLoading(false)
      })
  };

  const handleCloseViewMore = () => {
    setView(false);
  };


  const onChangeTab = (key) => {
    setShowTab(key.toString());
  };

  const handleDateChange = (value) => {
    if (value) {
      // debugger;
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const handleInputCreativity = (event, index) => {
    let arr = [...ratingReview];
    arr[index].remarks = event.target.value;
    setRatingReview(arr);
  };


  const handleSeeMorePost = () => {
    // if(data == "Post Activity"){
    history.push('/post-activity-view')
    return
  }
  
  let schoolDetails = JSON.parse(localStorage.getItem('schoolDetails'));
  const { school_logo } = schoolDetails;


  const TabContent = () => {
    return (
      <>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-50'>
            <Spin tip='Loading...' size='large' />
          </div>
        ) :
          listCount > 0 ? (

            <Grid container spacing={4} >
              <Grid className='col-12 mt-3 pt-2'>
                <Divider orientation="left" orientationMargin="0">
                  Blog ({blogWallList?.length})
                </Divider>
              </Grid>
              <Grid
                className='col-12 mt-3 pt-2'
                style={{ overflowY: 'scroll', display: 'flex', flexWrap: 'wrap' }}
              >
                <Grid container spacing={3} xs={12}>
                  {blogWallList.map((item) => {
                    return (
                      <Grid item xs={12} md={3}>
                        <Card
                        onClick={() => viewMore(item)}
                          // className={classes.root}
                          className='card-design'

                        // style={{ width: '20vw', border: '1px solid black', borderRadius: '15px', margin: '10px' }}
                        >
                          <CardActionArea>
                            <CardHeader
                              avatar={
                                <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>

                                </Avatar>
                              }
                              title={<span style={{fontWeight: 600, fontSize:'16px'}}>{item?.name}</span>}
                              subheader={<span style={{fontSize:'14px', fontWeight: 500}}> {item?.branch?.name}</span>}
                            // subheader={item?.grade?.name}
                            />
                            <div style={{ display: 'flex' }}>
                              <div style={{ fontSize: '12px', color: '#09A4D4', marginLeft: '72px', marginTop: '-15px' }}>
                                {item?.grade?.name}
                              </div>
                              {/* <div style={{ fontSize: '12px', marginLeft: '72px', marginTop: '-15px', color: 'blue' }}>
                                {item?.publish_level}
                              </div> */}
                            </div>
                            {/* <div style={{ display: 'flex' }}>
                              <div style={{ fontSize: '10px', marginLeft: '72px', color: 'blue' }}>
                                {moment(item?.created_at).format("MMM Do YY")}
                              </div>
                            </div> */}
                          </CardActionArea>
                          <CardActionArea style={{ padding: '11px'}}>
                            <CardMedia
                              className={classes.media}
                              image={item.template.template_path}
                              style={{ border: '1px solid lightgray', borderRadius: '6px', width:'auto', height:'18vh' }}
                              // alt="Dummy Image"
                              title="Blog View"
                            />
                          </CardActionArea>
                          <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '12px'}}>
                              {item?.publish_level}
                            </div>
                            <div style={{ fontSize: '12px' }}>
                              {moment(item?.created_at).format("MMM Do YY")}
                            </div>

                            <StyledRating
                              fontSize="small"
                              style={{ fontSize: 18, width: '10vw', display: 'flex', flexWrap: 'wrap' }}
                              precision={0.1}
                              defaultValue={item?.given_rating}
                              max={parseInt(item?.rating)}
                              readOnly
                            />
                            {/* <Button type="primary" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => viewMore(item)}>
                              View
                            </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>

                    )

                  })}

                </Grid>

              </Grid>
            </Grid>
          )
            : (
              <div className='d-flex justify-content-center mt-5'>
                <img src={NoDataIcon} />
              </div>
            )}

        {!loading && listCount > 0 && (
          <div className='text-center'>
            <Pagination
              current={pageNumber}
              hideOnSinglePage={true}
              showSizeChanger={false}
              onChange={(page) => {
                setPageNumber(page);
              }}
              total={listCount}
            />
          </div>
        )}
           <Drawer
          anchor='right'
          maxWidth={maxWidth}
          open={view}
          onClose={handleCloseViewMore}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <div style={{ width: '100%', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
              <div style={{ fontSize: '24px', marginLeft: '15px' }}>
                <strong>Preview</strong>
              </div>
              <div style={{ fontSize: '24px', cursor: 'pointer' }}>
                <strong onClick={handleClose}> <CancelIcon /> </strong>
              </div>

            </div>
            <Divider style={{ margin: 0 }} />

            <Grid container direction='row' justifyContent='center'>
              <Grid item>
                <div
                  style={{
                    border: '1px solid black  ',
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
                        src={school_logo}
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
                      height: 'auto',
                      marginTop: '12px',
                      marginBottom: '29px',
                    }}
                  >
                    <div style={{ padding: '5px' }}>
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
                        <div className="certificate-text-center certificate-input-box" style={{ top: `calc(279px + ${imageData[0]?.x_cordinate.concat('px')})`, left: `calc(232px + ${imageData[0]?.y_cordinate.concat('px')})` }}>
                          <textarea className="certificate-box" style={{
                            width: `${imageData[0]?.width}px`,
                            height: `${imageData[0]?.height}px`, top: `${imageData[0]?.x_cordinate}px`, left: `${imageData[0]?.y_cordinate}px`
                          }} value={previewData?.content} placeholder="type text here..." />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item>
                <div>
                  <div style={{ display: 'flex', width: '100%', padding:'0.5rem 1rem' }}>
                    <div style={{ padding: '5px' }}>
                      <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                      </Avatar>
                    </div>
                    <div style={{ padding: '0rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>
                        {previewData?.name}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {previewData?.branch?.name}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '12px' }}>
                        {previewData?.grade?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: '#f9f9f9',
                    margin:'0.5rem 1rem',
                    padding:'0.5rem 1rem',
                    borderRadius:'5px',
                    marginTop: '10px',
                    height: 'auto',
                    border:'1px solid #dbdbdb',
                    width:'21vw',
                    overflowY:'auto',
                    maxHeight:'16vh'

                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', paddingLeft: '10px', marginTop: '10px' }}
                  >
                    <span style={{ fontWeight: 'normal', fontSize: '16px', }}>
                      Title: {previewData?.activity_detail?.title}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      paddingBottom: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
                      Description: {previewData?.activity_detail?.description}
                    </span>
                  </div>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '17px'}}>Review</div>
                <div
                  style={{
                    border: '1px solid grey',
                    width: '295px',
                    height: 'auto',
                    // marginLeft: '11px',
                    // marginRight: '10px',
                    margin:'auto',
                    borderRadius: '5px',
                    background: '#f4f5f9'
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
                            defaultValue={obj?.given_rating}
                            precision={0.1}
                            max={parseInt(obj?.level)}
                          />
                        </div>
                        <div>
                          <TextField
                            id='outlined-basic'
                            size='small'
                            disabled
                            variant='outlined'
                            value={obj?.remarks}
                            style={{ width: '264px', background: 'white' }}
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
              </Grid>
            </Grid>
          </div>
        </Drawer>
      </>
    );
  };
  return (
    <React.Fragment>
      <Layout>
        {''}
        <div className='row th-16 py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}>
            <div>
              <IconButton aria-label="back" onClick={handleGoBack}>
                <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
              </IconButton>
            </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Activity Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Blog
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                School Wall
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Blog Activity
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12'>
            <img
              src={BlogWallImage}
              alt="icon"
              className='post-redirect-card'

            />
          </div>

          <div className='row' style={{ marginTop: '20px' }}>
            <div className='col-12 px-4'>
              <div className='th-grey th-tabs'>
                <div className='filter-container-tab'>
                  <button className={showTab == 1 ? 'active' : ""} onClick={() => onChangeTab(1)} key={1} >All </button>
                  <button className={showTab == 2 ? 'active' : ""} onClick={() => onChangeTab(2)} key={2} >Intra Orchids</button>
                  <button className={showTab == 3 ? 'active' : ""} onClick={() => onChangeTab(3)} key={3} >Branch Level</button>
                  <button className={showTab == 4 ? 'active' : ""} onClick={() => onChangeTab(4)} key={4} >Grade Level</button>
                  <button className={showTab == 6 ? 'active' : ""} onClick={() => onChangeTab(6)} key={6} >Section Level</button>
                  <button className={showTab == 5 ? 'active' : ""} onClick={() => onChangeTab(5)} key={5} >Blogs Of The Month</button>
                </div>
                <div>
                  {TabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};
export default BlogActivityView;
