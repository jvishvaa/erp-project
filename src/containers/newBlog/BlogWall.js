import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
  // Divider,
  TextField,
  makeStyles,
  Grid,
  Drawer,
  CardActionArea,
} from '@material-ui/core';
import "./blog.css";
import Layout from 'containers/Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { withStyles } from '@material-ui/core/styles';
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
import { Rating } from '@material-ui/lab';
import { Breadcrumb, Tabs, Select, DatePicker, Spin, Pagination, Button, Modal, Badge, Tooltip, Table as TableAnt } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { DownOutlined, CheckOutlined, SearchOutlined, FormOutlined, CloseOutlined, LikeFilled, PlayCircleOutlined, CommentOutlined, FileImageOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import BlogWallImage from "../../assets/images/ssss.jpg";
import './blog.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player';
// import { useGallary } from './useGallary';

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
    width: '100%'
  },
  mediaBlog: {
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



const options = [
  { id: 1, value: "All" },
  { id: 2, value: "Blogs" },
  { id: 3, value: "Posts" },
  { id: 1, value: "Public Speaking" },

]



const columns = [
  {
    title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>Criteria</span>,
    width: '75%',
    align: 'left',
    render: (text, row) => {
      return (
        row?.criterion
      )

    }
  },
  {
    title: <span className='th-white th-fw-600'>Remarks</span>,
    // dataIndex: 'attendance',
    width: '25%',
    align: 'center',
    // key: 'total',
    // id: 2,
    render: (text, row) => (
      row?.levels?.filter((item) => item.status == true)[0].name
    )
  },
];


const BlogWall = () => {
  const classes = useStyles();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const user_level = data?.user_level;
  const branch_update_user = localStorage.getItem('ActivityManagementSession') ? JSON.parse(localStorage.getItem('ActivityManagementSession')) : {};
  const history = useHistory();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [openModal, setOpenModal] = useState(false);
  const [openModalPublic, setOpenModalPublic] = useState(false);
  const branchIdsLocalId = branch_update_user?.branches?.map((item) => item?.id)

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
  const [showTab, setShowTab] = useState('0');
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
  const userId = localStorage.getItem('ActivityManagementSession') ? JSON.parse(localStorage.getItem('ActivityManagementSession'))?.user_id : ''
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
  const [userDataAPI, setUserDataAPI] = useState()
  const token = data?.token;
  const [isPlaying, setIsPlaying] = useState(false);
  const [categoriesFilter, setCategoriesFilter] = useState('All');
  const [videoDetailsPub, setVideoDetailsPub] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [viewMorePostButton, setViewMorePostButton] = useState([])
  const [typeText, setTypeText] = useState([{ name: "text" }, { name: "template" }])
  const [activityCategory, setActivityCategory] = useState([]);
  const [activityStorage, setActivityStorage] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [templates, setTemplates] = useState([]);
  const [publicSpeakingView, setPublicSpeakingView] = useState([])
  const [commentData, setCommentData] = useState([]);
  const [openAttachment, setOpenAttachment] = useState(false)
  const [attachmentDetails, setAttachmentDetails] = useState([])
  const [chatDetails, setChatDetails] = useState([])
  const [reloadData, setReloadData] = useState([])
  // const user_level = userData?.user_level;




  const showBranchFilter = [1, 2, 4, 8, 9];
  const branchOptions = branchList?.map((each) => {
    return (
      <Option value={each?.id} key={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const cateGoriesOptions = options?.map((each) => {
    return (
      <Option value={each?.value} key={each?.value}>
        {each?.value}
      </Option>
    )
  })

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
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
        setShowTab('1')
      });
  };



  useEffect(() => {
    ActvityLocalStorage()
  }, [])
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
        setUserDataAPI(response?.data?.result)
        getActivitySession();
        setLoading(false);
      });
  };

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
      if (branchIdsLocalId) {
        setLoading(true)
        var branchIds = branch_update_user?.branches?.map((item) => item?.id)
        axios
          .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIdsLocalId}`,
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
      .get(`${endpoints.newBlog.getSchoolWallApi}`, {
        params: {
          ...params,
          ...(startDate ? { start_date: startDate } : {}),
          ...(endDate ? { end_date: endDate } : {}),
          ...(branchIds ? { branch_ids: branchIds } : {}),
          ...(selectedBlogListId ? { activity_detail_id: selectedBlogListId } : {}),
          ...(selectedGradeId ? { grade_ids: selectedGradeId } : {}),
          ...(categoriesFilter ? { category: categoriesFilter } : {}),

        },

        headers: {
          'X-DTS-HOST': X_DTS_HOST,

        }
      })
      .then((response) => {
        console.log(response, "kl4")
        // setPostWallList(response?.data?.result)
        setPostListCount(response?.data?.result?.length)
        // setPostWallList(postDummy)
        setPostWallList(response?.data?.result)
        // setPostListCount(postDummy)
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
  }, [showTab, pageNumber, categoriesFilter])

  const handleSearch = () => {
    if (showTab == 1) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        user_id: userId,
      });

      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        user_id: userId,
        // is_limited: 'True',
      })
    } else if (showTab == 2) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        publish_level: 'Intra Orchids Level',
        user_id: userId,
      });
      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        publish_level: 'Intra Orchids Level',
        user_id: userId,
        // categories: categoriesFilter
        // is_limited: 'True',
      })
    } else if (showTab == 3) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        publish_level: 'Branch Level',
        user_id: userId,
      })

      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        publish_level: 'Branch Level',
        user_id: userId,
        // categories:categoriesFilter
        // is_limited: 'True',
      })

    } else if (showTab == 4) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        publish_level: 'Grade Level',
        user_id: userId,
      })
      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        publish_level: 'Grade Level',
        user_id: userId,
        // categories:categoriesFilter
        // is_limited: 'True',
      })
    } else if (showTab == 5) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        is_best_blog: 'true',
        user_id: userId,
      })
      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        is_best_blog: 'true',
        user_id: userId,
        // categoriesFilter:categoriesFilter
        // is_limited: 'True',
      })
    } else if (showTab == 6) {
      fetchSchoolWall({
        page_size: 4,
        page: pageNumber,
        publish_level: 'Section Level',
        user_id: userId,
      })
      fetchPostWall({
        // page_size: 10,
        // page: pageNumber,
        publish_level: 'Section Level',
        user_id: userId,
        // categories:categoriesFilter
        // is_limited: 'True',
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
        setViewMorePostButton(response?.data?.result)
        setLoading(false)
        setOpenModal(true)
      })

  }

  const getWhatsAppDetails = (prop) => {
    // if(prop){
    setLoading(true)
    if (prop !== null) {
      setReloadData(prop)
    }
    axios
      .get(`${endpoints.newBlog.whatsAppChatGetApi}?erp_id=${data?.erp}&created_at__date__gte=${prop !== null ? prop?.created_at__date__gte : reloadData?.created_at__date__gte}&created_at__date__lte=${prop !== null ? prop?.created_at__date__lte : reloadData?.created_at__date__lte}`, {
        headers: {
          'HOST': X_DTS_HOST,
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        setLoading(false)
        setChatDetails(response?.data)


      })
      .catch((err) => {
        setLoading(false)
      })

    // }
  }
  const viewMorePost = (data) => {
    // setPostView(true);
    setPostPreviewData(data)
    getViewCard(data?.id)

  }








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
    history.push('/post-activity-view')
    return
  }

  const handleSeeMoreBlog = () => {
    history.push('/blog-activity-view')
    return
  }

  const handleModal = () => {
    setOpenModal(true)

  }
  const arr = [
    { source: "https://elle.ua/i/publications/1022/560_292/do-togo-kak-tebya-nakonec-pustyat-k-tarelke-nuzhno-so-vsemi-obshchatsya-kak-mops-agamemnon-na-zvaniy-uzhin-hodil-1838-21405.jpg", type: "jpeg", id: 1 },
    { source: "https://www.tapeciarnia.pl/tapety/normalne/tapeta-mops-w-trawie.jpg", type: "jpeg", id: 2 },
    { source: "https://disgustingmen.com/wp-content/uploads/2020/03/the-order-of-the-pug-6.jpg", type: "jpeg", id: 3 },
    {
      description: "The first Blender Open Movie from 2006",
      source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      subtitle: "By Blender Foundation",
      thumb: "https://source.unsplash.com/user/c_v_r/1900x800",
      title: "Elephant Dream",
      type: "mp4",
      id: 4
    },
    {
      description: "The first Blender Open Movie from 2006",
      source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      subtitle: "By Blender Foundation",
      thumb: "https://source.unsplash.com/user/c_v_r/1900x800",
      title: "Elephant Dream",
      type: "mp4",
      id: 5
    },
  ]

  const customRenderItem = (item, props) => <item.type {...item.props} {...props} />;

  const customRenderThumb = (props, state) => {
    console.log(props, 'IPAD')
    let thumbList = props.map((product, index) =>
      product?.props?.children?.props?.alt === "image" ?
        <picture key={index}>
          <source data-srcSet={product?.props?.children?.props?.thumb} type="image/jpg" />

          <img
            key={product?.props?.children?.key}
            src={product?.props?.children?.props?.thumb}
            alt={product?.props?.children?.props?.alt}
            height="70"
          />

        </picture>
        : <video key={index} controls style={{width:'70px',height:'40px'}}>
            <source data-srcSet={product?.props?.children?.props?.thumb}  
            type="video/mp4"
            width="70px" height="40px" 
            />
            {/* <img
            key={product?.props?.children?.key}
            src={product?.props?.children?.props?.thumb}
            alt={product?.props?.children?.props?.alt}
            height="70"
          /> */}
          </video>)
    return (thumbList)

  }


  const handleModalPublic = (e) => {
    if (e?.asset?.state == "processed") {
      setPublicSpeakingView(e)
      let data = JSON.parse(e?.grading?.grade_scheme_markings)
      setMarksData(data)
      axios
        .get(
          `${endpoints.newBlog.studentPSContentApi}?asset_id=${e?.asset?.id}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          setVideoDetailsPub(response?.data?.result)
          getWhatsAppDetails(response?.data?.result)
          setVideoUrl(response?.data?.result?.signed_URL)
          setOpenModalPublic(true)
          setLoading(false);
          // setOpen(true);
        });
      return
    } else if (e?.asset == null) {
      setAlert('error', 'Student Not Yet Submitted !')
      return

    } else {
      setAlert('error', 'Student Not Yet Submitted')
      return

    }



  };


  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
    setCategoriesFilter(value)
  };

  const handleVideoPlay = (event, value) => {
    setIsPlaying(!isPlaying)
  }


  const viewMoreAttachment = (item) => {
    setAttachmentDetails(item)
    setOpenAttachment(true)
  }

  const reloadButton = (clickedData) => {
    getWhatsAppDetails(null)
  }



  const PostContent = () => {
    return (
      <>
        <div className='row mb-md-0 mt-3'>
          {user_level == '13' || user_level == '10' ? (
            ' '
          ) : (
            <div className='row' style={{ alignItems: 'center' }} >
              <div className='col-md-2 px-0 py-2 py-md-0'>
                <div className='mb-2 text-left'>Branch</div>
                <Select
                  className='th-primary th-bg-grey th-br-4 th-width-100 text-left'
                  placement='bottomRight'
                  mode='multiple'
                  maxTagCount={3}
                  showArrow={true}
                  allowClear={true}
                  bordered={true}
                  suffixIcon={<DownOutlined className='th-primary' />}
                  placeholder='Select Branches'
                  getPopupContainer={(trigger) => trigger.parentNode}
                  // placeholder={
                  //   <span className='th-primary'>{selectedBranch?.branch?.branch_name}</span>
                  // }
                  dropdownMatchSelectWidth={false}
                  onChange={(e, value) => handleBranchChange(value)}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {branchOptions}
                </Select>

              </div>
              <div className='col-md-2 col-5 px-0 px-md-2'>
                <div className='mb-2 text-left'>Grade</div>
                <Select
                  className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                  bordered={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  // value={selectedCategoryName}
                  placement='bottomRight'
                  placeholder='Select Grade'
                  suffixIcon={<DownOutlined className='th-black-1' />}
                  dropdownMatchSelectWidth={false}
                  onChange={(e, val) => handleGradeChange(e, val)}
                  allowClear

                  menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                >
                  {gradeOptions}
                </Select>
              </div>{' '}
              <div className='col-md-2 col-5 px-0 px-md-2'>
                <div className='mb-2 text-left'>Blog List</div>
                <Select
                  className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                  bordered={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  // value={selectedCategoryName}
                  placement='bottomRight'
                  placeholder='Select Blog List'
                  suffixIcon={<DownOutlined className='th-black-1' />}
                  dropdownMatchSelectWidth={false}
                  onChange={(e, val) => handleBlogListChange(e, val)}
                  allowClear

                  menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                >
                  {blogListOptions}
                </Select>
              </div>{' '}
              <div className='col-md-2 col-7 px-2 th-br-4'>
                <div className='mb-2 text-left'>Date</div>
                <RangePicker
                  allowClear={false}
                  bordered={true}
                  placement='bottomRight'
                  showToday={false}
                  suffixIcon={<DownOutlined />}
                  // defaultValue={[moment(), moment()]}
                  onChange={(value) => handleDateChange(value)}
                  className='th-range-picker th-br-4'
                  separator={'to'}
                  format={'DD/MM/YYYY'}
                />
              </div>
              <div className='col-md-2 col-7 px-2 th-br-4'>
                <div className='mb-2 text-left' style={{ paddingTop: '22px' }}>{' '}</div>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
          )}
        </div>
        {loading ? (
          ""
        ) :
          postListCount > 0 ? (

            <Grid container spacing={2} >
              <Grid
                className='col-12 mt-4'
                style={{ overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', padding: 0, paddingBottom: '30px' }}
              >

                {/* <Grid item xs={12} md={12} style={{display:'flex', flexWrap:'wrap'}}> */}
                <Grid container spacing={4} xs={12}>

                  {postWallList && postWallList.map((item, index) =>
                    (item?.type == "post") ? (

                      <Grid item xs={12} md={3}>
                        <Badge.Ribbon text={item?.type.toUpperCase()} color="blue">
                          <Card
                            // className={classes.root}
                            onClick={() => viewMorePost(item)}
                            className='card-design'
                          >
                            <CardActionArea>
                            </CardActionArea>
                            <CardActionArea style={{ padding: '5px' }}>
                              <div className='col-12' style={{ display: 'flex', alignItems: 'center', padding: 0, margin: '0.5rem 0rem' }} >
                                <span>{item?.branch?.name}</span>
                              </div>
                              <Badge.Ribbon text={item?.view_level} color="orange">
                                <CardMedia
                                  // className={classes.media}
                                  className='card-media-design'
                                  image={item?.content?.s3_url}
                                  style={{ border: '1px solid lightgray', borderRadius: '6px', width: '100%', position: 'relative', display: 'inline-block' }}
                                  alt="Dummy Image"
                                  title="Blog View"
                                />
                                <span class="badge bg-light text-dark" style={{ position: 'absolute', bottom: '10px', right: '0.5rem', padding: '0.5rem' }}>+{item?.content_count}More</span>

                              </Badge.Ribbon>
                            </CardActionArea>
                            <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', width: '100%', padding: '0.5rem 0rem' }}>
                                <div>
                                  <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                                  </Avatar>
                                </div>
                                <div style={{ padding: '0 0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  {/* <div style={{ fontSize: '12px', color: 'blue' }}>
                                    Grade Name
                                  </div> */}
                                  <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                    {item?.name}
                                  </div>
                                </div>
                              </div>
                              <Divider style={{ padding: "0px", margin: "0px" }} />
                              <div className='col-12' style={{ width: '100%', padding: '5px', fontSize: '12px', fontWeight: 500, display: 'flex' }}>
                                <div className='col-6' style={{ padding: '0px' }}>
                                  {moment(item?.created_at).format("MMM Do YY")}
                                </div>
                                {/* <div className='col-6' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <LikeFilled style={{ color: 'blue', fontSize: '16px' }} />
                                </div> */}
                                {/* <Button onClick={handleModal}>
                                  modal
                                </Button> */}

                              </div>
                            </CardActions>
                          </Card>

                        </Badge.Ribbon>
                      </Grid>
                    ) : (item?.type == "blog") ? (
                      <Grid item xs={12} md={3}>
                        <Badge.Ribbon text={item?.type.toUpperCase()} color="purple">
                          <Card
                            // className={classes.root}
                            // onClick={() => viewMorePost(item)}
                            onClick={() => viewMore(item)}
                            className='card-design'
                          >
                            <CardActionArea style={{ padding: '8px' }}>
                              <div className='col-12' style={{ display: 'flex', alignItems: 'center', padding: 0, margin: '0.5rem 0rem' }}>
                                <div className='col-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>

                                  </Avatar>
                                </div>
                                <div className='col-10' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 0 }}>
                                  <span style={{ fontSize: '10px', color: 'blue', fontWeight: 'bold' }}>{item?.grade?.name}</span>
                                  <span style={{ fontSize: '16px', color: 'grey', fontWeight: 'bold' }}>{item?.name}</span>
                                </div>
                              </div>
                              <Badge.Ribbon text={item?.publish_level} color="orange">
                                <CardMedia
                                  className={classes.media}
                                  image={item?.template?.template_path}
                                  style={{ border: '1px solid lightgray', borderRadius: '6px', width: '100%', position: 'relative', display: 'inline-block', }}
                                  alt="Image"
                                  title="Blog View"
                                />

                              </Badge.Ribbon>
                            </CardActionArea>
                            <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', flexDirection: 'column' }}>
                              <div className='col-12' style={{ fontWeight: 600, fontSize: '16px', padding: 0 }}>
                                {item?.title}
                              </div>
                              <Divider style={{ padding: "0px", margin: "0px" }} />
                              <div style={{ width: '100%', padding: '0px', fontSize: '12px', fontWeight: 500 }}>
                                <div className="col-12" style={{ padding: 0 }}>
                                  {moment(item?.created_at).format("MMM Do YY")}
                                </div>
                                <div className='col-12' style={{ padding: 0 }}>
                                  <StyledRating
                                    fontSize="small"
                                    style={{ fontSize: 18, width: '6vw', display: 'flex', flexWrap: 'wrap' }}
                                    precision={0.1}
                                    defaultValue={item?.given_rating}
                                    max={parseInt(item?.rating)}
                                    readOnly
                                  />
                                </div>

                              </div>
                            </CardActions>
                          </Card>

                        </Badge.Ribbon>
                      </Grid>

                    ) : (
                      <Grid item xs={12} md={3}>
                        <Badge.Ribbon text={item?.type.toUpperCase()} color="hsl(102, 53%, 61%)">
                          <Card
                            onClick={() => handleModalPublic(item)}
                            className='card-design'
                          >
                            <CardActionArea>
                            </CardActionArea>
                            <CardActionArea style={{ padding: '8px' }}>
                              <div className='col-12' style={{ display: 'flex', alignItems: 'center', padding: 0, margin: '0.5rem 0rem' }} >

                                <span>{selectedBranch?.branch?.branch_name}</span>
                              </div>
                              <CardMedia
                                className={classes.media}
                                style={{ border: '1px solid lightgray', borderRadius: '6px', width: '100%' }}
                                component="video"
                                // autoPlay 
                                controls={false}
                                // image={'https://source.unsplash.com/user/c_v_r/1900x800'}
                                src={item?.asset?.signed_URL}
                              />
                            </CardActionArea>
                            <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', width: '100%', padding: '0.5rem 0rem' }}>
                                <div>
                                  <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                                  </Avatar>
                                </div>
                                <div style={{ padding: '0 0.5rem' }}>
                                  <div style={{ fontSize: '12px', color: 'blue' }}>
                                    {item.grade}
                                  </div>
                                  <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                    {item?.group?.activity?.name}
                                  </div>
                                </div>
                              </div>
                              <Divider style={{ padding: "0px", margin: "0px" }} />
                              <div style={{ width: '100%', padding: '5px', fontSize: '12px', fontWeight: 500 }}>
                                <div>
                                  {moment(item?.created_at).format("MMM Do YY")}
                                </div>
                              </div>
                            </CardActions>
                          </Card>

                        </Badge.Ribbon>
                      </Grid>
                    )
                  )}
                </Grid>

              </Grid>
            </Grid>
          )
            : (
              <div className='d-flex justify-content-center mt-5'>
                <img src={NoDataIcon} />
              </div>
            )}

        <Modal
          title="Public Speaking"
          centered
          // open={postView}
          visible={openModalPublic}
          onOk={() => setOpenModalPublic(false)}
          onCancel={() => setOpenModalPublic(false)}
          width={'80vw'}
          // bodyStyle={{ height: "90vh" }}
          footer={null}
          closeIcon={
            <CloseOutlined />
          }
        >
          <div className='row'>
            <div className='col-7 carousel-global'>

              <div className='image'>
                <ReactPlayer
                  url={videoDetailsPub?.signed_URL}
                  // src={item?.thumb}
                  width="100%"
                  // thumb={item?.thumb}
                  height="60vh"
                  pip={true}
                  // light={item?.thumb}
                  // playing = {isPlaying}
                  // onPlay={handleVideoPlay}
                  // muted
                  // playing
                  playIcon={<Tooltip title="play">
                    <Button style={{ background: 'transparent', border: 'none', height: '30vh', width: '30vw' }} shape="circle" icon={<PlayCircleOutlined style={{ color: 'white', fontSize: '70px' }} />} />
                  </Tooltip>}
                  alt={"video"}
                  controls={true}
                // playing={true}
                />
              </div>
            </div>
            <div className='col-5 public-speaking-content'>
              <div className='col-12 post-description'>
                <div className='col-2 post-avatar'>
                  <Avatar size="large" icon={<UserOutlined />} />
                </div>
                <div className='col-10 post-profile-description'>
                  <p style={{ fontWeight: 'bold', margin: 'auto' }}>{publicSpeakingView?.group?.activity?.name}</p>
                  <p style={{ color: 'blue', fontSize: '12px', margin: 'auto' }}>{selectedBranch?.branch?.branch_name}</p>
                  <p style={{ fontSize: '12px', margin: 'auto' }} fontSize>{data?.role_details?.grades[0]?.grade__grade_name}</p>
                </div>
              </div>
              <Divider />
              <div className='col-12 post-description-inner'>
                <div className='col-12' style={{ padding: '10px' }}>
                  <TableAnt
                    className='th-table'
                    columns={columns}
                    // rowKey={(record) => record?.erp_id}
                    loading={loading}
                    dataSource={marksData}
                    pagination={false}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              </div>
              <Divider />
              <div className='col-12'>
                <div className='col-12' style={{ display: 'flex', alignItems: 'center' }}>
                  <div className='col-6'>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}> <CommentOutlined style={{ color: 'blue', fontSize: '20px', paddingRight: '0.5rem' }} />Comments</span>
                  </div>
                  <div className='col-6' style={{ display: 'flex', justifyContent: 'end' }}>
                    <span> <Button type="primary" shape="circle" onClick={() => reloadButton()} icon={<RedoOutlined />} /></span>
                  </div>
                </div>
                <Divider style={{ margin: 0, padding: '0.5rem' }} />
                <div style={{ padding: '0.5rem 1rem', border: '2px solid #4800c9', borderRadius: '10px', margin: '0.5rem 0rem' }}>
                  {chatDetails.length !== 0 ? (
                    <>
                      {chatDetails.map((item, index) => {
                        if (item?.sent_by === "USER") {
                          return (
                            <div className=' col-12 comment-header'>
                              <div className='col-2'> <UserOutlined style={{ fontSize: '18px', background: '#4800c9', color: 'white', borderRadius: '20px', padding: '0.5rem' }} /> </div>
                              <div className='col-8'>

                                <span key={item?.index}>{item.message}</span>
                              </div>
                              <div className='col-2'>
                                {item?.media_link !== null ? (
                                  <span>
                                    <Button onClick={() => viewMoreAttachment(item)} type="primary" size='small' shape="circle" icon={<FileImageOutlined />} />

                                  </span>

                                ) : ""}
                              </div>
                            </div>

                          )

                        }
                      })}
                    </>

                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItem: 'center', fontSize: '16px', fontWeight: 400 }}>No Comments Submitted</div>
                  )}


                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Attachment"
          centered
          // open={postView}
          visible={openAttachment}
          onOk={() => setOpenAttachment(false)}
          onCancel={() => setOpenAttachment(false)}
          width={'80vw'}
          // bodyStyle={{ height: "90vh" }}
          footer={null}
          closeIcon={
            <CloseOutlined />
          }
        >
          <div className='row'>
            <div className='col-12 carousel-global'>

              <div className='image'>

                {attachmentDetails?.message_type == "VIDEO" ? (
                  <ReactPlayer
                    url={attachmentDetails?.media_link}
                    // src={item?.thumb}
                    width="100%"
                    // thumb={item?.thumb}
                    height="60vh"
                    pip={true}
                    // light={item?.thumb}
                    // playing = {isPlaying}
                    // onPlay={handleVideoPlay}
                    // muted
                    // playing
                    playIcon={<Tooltip title="play">
                      <Button style={{ background: 'transparent', border: 'none', height: '30vh', width: '30vw' }} shape="circle" icon={<PlayCircleOutlined style={{ color: 'white', fontSize: '70px' }} />} />
                    </Tooltip>}
                    alt={"video"}
                    controls={true}
                  // playing={true}
                  />

                ) : (
                  ""

                )}
              </div>
            </div>
          </div>
        </Modal>

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
                  <div style={{ display: 'flex', width: '100%', padding: '0.5rem 1rem' }}>
                    <div style={{ padding: '5px' }}>
                      <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                      </Avatar>
                    </div>
                    <div style={{ padding: '0 0.5rem' }}>
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
                    margin: '0.5rem 1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    marginTop: '10px',
                    height: 'auto',
                    border: '1px solid #dbdbdb',
                    width: '21vw',
                    overflowY: 'auto',
                    maxHeight: '16vh'

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
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '17px' }}>Review</div>
                <div
                  style={{
                    border: '1px solid grey',
                    width: '295px',
                    height: 'auto',
                    // marginLeft: '11px',
                    // marginRight: '10px',
                    margin: 'auto',
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
        {viewMorePostButton?.length !== 0 ? (
          <Modal
            title="Preview"
            centered
            // open={postView}
            visible={openModal}
            onOk={() => setOpenModal(false)}
            onCancel={() => setOpenModal(false)}
            width={'80vw'}
            style={{ top: 20 }}
            // bodyStyle={{ height: "90vh" }}
            footer={null}
            closeIcon={
              <CloseOutlined />
            }
          >
            <div className='row'>
              <div className='col-9 carousel-global'>
                <Carousel
                  infiniteLoop={true}
                  showArrows={true}
                  showThumbs={true}
                  showStatus={false}
                  emulateTouch={true}
                  // renderItem={customRenderItem}
                  renderThumbs={customRenderThumb}
                >
                  {viewMorePostButton && viewMorePostButton?.content.map((item, index) => {
                    return (
                      <div className='image'>
                        {(item.file_type === 'image/png') || (item.file_type === "image/jpeg") ? (

                          <img src={item?.s3_url} alt={"image"} thumb={item?.s3_url} key={index} width="100%" />

                        ) : (
                          <ReactPlayer
                            url={item?.s3_url}
                            thumb={item?.s3_url}
                            key={index}
                            // src={item?.thumb}
                            width="100%"
                            // thumb={item?.thumb}
                            height="100%"
                            // pip={true}
                            // light={item?.thumb}
                            // playing = {isPlaying}
                            // onPlay={handleVideoPlay}
                            // muted
                            // playing
                            playIcon={<Tooltip title="play">
                              <Button style={{ background: 'transparent', border: 'none', height: '30vh', width: '30vw' }} shape="circle" icon={<PlayCircleOutlined style={{ color: 'white', fontSize: '70px' }} />} />
                            </Tooltip>}
                            alt={"video"}
                            controls={true}
                          // playing={true}
                          />
                        )
                        }

                      </div>

                      //  </div>
                    )
                  })}
                </Carousel>
              </div>
              <div className='col-3'>
                <div className='col-12 post-description'>
                  <div className='col-3 post-avatar'>
                    <Avatar size="large" icon={<UserOutlined />} />
                  </div>
                  <div className='col-9 post-profile-description'>
                    <p style={{ fontWeight: 'bold', margin: 'auto' }}>{postPreviewData?.name}</p>
                    <p style={{ color: 'blue', fontSize: '12px', margin: 'auto' }}>{postPreviewData?.branch?.name}</p>
                    {/* <p style={{ fontSize: '12px', margin: 'auto' }} fontSize>Grade Name </p> */}
                  </div>
                </div>
                <Divider />
                <div className='col-12 post-description-inner'>
                  {postPreviewData?.description}
                </div>
                <Divider />
              </div>
            </div>
          </Modal>

        ) : ""}

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
            </Breadcrumb>
          </div>
          {user_level == '13' || user_level == '10' ? (
            ''
          ) : (
            <div className='col-md-4' style={{ display: 'flex', justifyContent: 'end' }}>
              <Button type="primary" icon={<FormOutlined />} size={'medium'} onClick={showModal}>
                Create Post Activity
              </Button>
            </div>

          )}
          <div className='col-md-12'>
            <img
              src={BlogWallImage}
              alt="icon"
              className='post-redirect-card'

            />
          </div>

          <div className='row' style={{ marginTop: '20px' }}>
            <div className='col-12 px-4'>
              <div className='table-filter'>
                <div className='col-10' style={{ margin: 'auto', padding: 0 }}>
                  <div className='filter-container-tab'>
                    <span>Select Level</span>
                    <button className={showTab == 1 ? 'active' : ""} onClick={() => onChangeTab(1)} key={1} >All </button>
                    <button className={showTab == 2 ? 'active' : ""} onClick={() => onChangeTab(2)} key={2} >Intra Orchids</button>
                    <button className={showTab == 3 ? 'active' : ""} onClick={() => onChangeTab(3)} key={3} >Branch Level</button>
                    <button className={showTab == 4 ? 'active' : ""} onClick={() => onChangeTab(4)} key={4} >Grade Level</button>
                    <button className={showTab == 6 ? 'active' : ""} onClick={() => onChangeTab(6)} key={6} >Section Level</button>
                    <button className={showTab == 5 ? 'active' : ""} onClick={() => onChangeTab(5)} key={5} >Blogs Of The Month</button>
                  </div>
                </div>
                <div className='col-2' style={{ display: 'flex', justifyContent: 'end', margin: 'auto', padding: 0, alignItems: 'center' }}>
                  <span style={{ marginRight: '1rem', color: 'grey', fontSize: '14px', fontWeight: 'bold' }}>Categories</span>
                  <Select
                    size={'medium'}
                    defaultValue="All"
                    placeholder='Select Categories'
                    onChange={handleChange}
                    style={{
                      maxWidth: 200,
                    }}
                  // options={options?.values}

                  >
                    {cateGoriesOptions}
                  </Select>
                </div>

              </div>
              <div>
                {PostContent()}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};
export default BlogWall;
