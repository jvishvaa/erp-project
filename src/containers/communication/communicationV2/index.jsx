import React, { useState, useEffect, useContext } from 'react';
import Layout from 'containers/Layout';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Typography,
  Menu,
  MenuItem,
  TextField,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import EventIcon from '@material-ui/icons/Event';
import EventNoteIcon from '@material-ui/icons/EventNote';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';
import SubjectIcon from '@material-ui/icons/Subject';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MessageIcon from '@material-ui/icons/Message';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { DataGrid } from '@material-ui/data-grid';
import CreateAnouncement from './CreateAnnouncement';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { connect, useSelector } from 'react-redux';
import FilterFramesIcon from '@material-ui/icons/FilterFrames';
import NoFilterData from 'components/noFilteredData/noFilterData';
import { SvgIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from './../../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts';
import './announcement.scss';
import { AlertNotificationContext } from './../../../context-api/alert-context/alert-state';
import logo from './filter.png';
import CloseIcon from '@material-ui/icons/Close';
import Loader from 'components/loader/loader';
import Pagination from 'components/PaginationComponent';  


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  listItem: {
    '&.active': {
      color: 'white !important',
      backgroundColor: '#4185F4',
      borderRadius: '20px',
    },
  },
  rootmenu:{
    '& .MuiPopover-paper' : {
      top:'115px !important',
      left: '8px !important',
      width : '100%'
    }
  },
  rootwebmenu : {
    '& .MuiPopover-paper' : {
      // top:'115px !important',
      // left: '8px !important',
      width : '26%'
    }
  },
  ellipses:{
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',}

}));

const NewCommunication = () => {
  const classes = useStyles();

  const [headerOpen, setHeaderOpen] = useState(false);
  const [onClickIndex, setOnClickIndex] = useState(1);
  const [dialogData, setDialogData] = useState([]);
  const [openPublish, setOpenPublish] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentDate = moment(new Date()).format('DD/MM/YYYY');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElAnnouncementType, setAnchorElAnnouncementType] = useState(null);
  const [menuPosition, setMenuPosition] = useState(false);
  const [openModalAnnouncement, setOpenModalAnnouncement] = useState(false);
  const [rows, setRows] = useState([]);
  const [defaultdate, setDefaultDate] = useState(moment().format('YYYY-MM-DD'));
  const [branchList, setBranchList] = useState([]);
  const [selectBranchId,setSelectBranchId] = useState([])	
  const [selectedbranchData, setSelectedbranchData] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGradeListData, setSelectedGradeListData] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionListData, setSelectedSectionListData] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState([]);
  const [selectedSectionMappingId, setSelectedSectionMappingId] = useState([]);
  const [categorylist, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [announcementType, setAnnouncementType] = useState({});
  const [announcementList, setAnnouncementList] = useState([]);
  const branches = JSON.parse(localStorage.getItem('userDetails'))?.role_details?.branch || [];
  const { setAlert } = useContext(AlertNotificationContext);
  const branchId = branches.map((item) => item.id);
  const [count,setCount] = useState(0)
  const [pageNo,setpageNo] = useState(1)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('xs'));
  const limit = 10;
  const handleRightClick = (event) => {
    if (menuPosition) {
      return;
    }
    event.preventDefault();
    setMenuPosition({
      top: event.pageY,
      left: event.pageX,
    });
  };
  const handleItemClick = (event) => {
    // setMenuPosition(null);
  };
  const [moduleId, setModuleId] = useState('');
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const isSuperUser = JSON.parse(localStorage.getItem('userDetails'))?.is_superuser;
  const showBranchFilter = [1,2,4,8,9]
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const handleClose = () => {
    setHeaderOpen(false);
    setOpenPublish(false);
    setAnchorEl(null);
  };

  const handleCloseAnnouncement = (cancel = true, type = {}) => {
    setAnchorElAnnouncementType(null);
    if (!cancel) {
      setOpenModalAnnouncement(true);
      setAnnouncementType(type);
    }
  };

  const setPage = (index) => {
    setOnClickIndex(index);
  };

  const handlePopOverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  const handleAnnouncmentClick = (event) => {
    setAnchorElAnnouncementType(event.currentTarget);
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Communication' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Announcement') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const userToken = JSON.parse(localStorage.getItem('userDetails'))?.token;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const rowsData = (filterOn) => {
    setLoading(true)
    setMenuPosition(null)
    let url = '';
    let baseurl = '';
    if (category == null) {
      baseurl = `date=${defaultdate}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
    } else {
      baseurl = `date=${defaultdate}&is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
    }
    if (filterOn) {
      if (onClickIndex) {
        url = selectedSectionMappingId.length > 0 
        ? `${endpoints.announcementNew.inbox}?${baseurl}&section_mapping=${selectedSectionMappingId.toString()}`
         : `${endpoints.announcementNew.inbox}?${baseurl}`
      }
      if (onClickIndex == 2) {
        url = selectedSectionMappingId.length > 0 
        ? `${endpoints.announcementNew.inbox}?is_draft=True&${baseurl}&section_mapping=${selectedSectionMappingId.toString()}`
        : `${endpoints.announcementNew.inbox}?is_draft=True&${baseurl}`;
      }
      if (onClickIndex == 3) {
        url = selectedSectionMappingId.length > 0 
        ?  `${endpoints.announcementNew.inbox}?is_sent=True&${baseurl}&section_mapping=${selectedSectionMappingId.toString()}`
        :  `${endpoints.announcementNew.inbox}?is_sent=True&${baseurl}`;
      }
    } else {
      if (category > 0) {
        if (onClickIndex) {
          url = selectBranchId.length>0
                ? `${endpoints.announcementNew.inbox}?is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`
                : `${endpoints.announcementNew.inbox}?is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
        if (onClickIndex == 2) {
          url = selectBranchId.length>0
                ? `${endpoints.announcementNew.inbox}?is_draft=True&is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`
                : `${endpoints.announcementNew.inbox}?is_draft=True&is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
        if (onClickIndex == 3) {
          url = selectBranchId.length>0
                ? `${endpoints.announcementNew.inbox}?is_sent=True&is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`
                : `${endpoints.announcementNew.inbox}?is_sent=True&is_category=${category}&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
      } else {
        if (onClickIndex) {
          url = selectBranchId.length>0 ? 	
          `${endpoints.announcementNew.inbox}?page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`	
          :`${endpoints.announcementNew.inbox}?page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
        if (onClickIndex == 2) {
          url = selectBranchId.length>0 ? 	
          `${endpoints.announcementNew.inbox}?is_draft=True&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`	
          : `${endpoints.announcementNew.inbox}?is_draft=True&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
        if (onClickIndex == 3) {
          url = selectBranchId.length>0 ? 	
          `${endpoints.announcementNew.inbox}?is_sent=True&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId}`	
          : `${endpoints.announcementNew.inbox}?is_sent=True&page_number=${pageNo}&page_size=${limit}&session_year=${selectedAcademicYear?.id}`;
        }
      }
    }

    axiosInstance
      .get(`${url}`, {
        headers: {
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setRows(result?.data?.data);
          setCount(result?.data?.count);
          setLoading(false)
          let message =
            onClickIndex == 1 ? 'Inbox' : onClickIndex == 2 ? 'Drafts' : ' Sent';
          setAlert('success', `Successfully fetched ${message} `);
        }
        setLoading(false)
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        setLoading(false);
        setAlert('error', error?.message);
      });
  };

  useEffect(() => {
    rowsData();
  }, [onClickIndex, category, pageNo,selectBranchId]);

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get(`${endpoints.announcementNew.getAnnouncemenetCategory}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setAnnouncementList(res?.data?.data);
          setCategoryList(res?.data?.data);
        } else {
          setAnnouncementList([]);
        }
        setLoading(false)
      });
  }, []);

  const dateUpdatefun = (event) => {
    setDefaultDate(event.target.value);
  };

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(allBranchData);
        } else {
          setBranchList([]);
        }
      });
  };

  const getGrade = () => {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId.length>0 ? selectBranchId : branchId}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          setBranchList([]);
        }
      });
  };

  const handleBranch = (e,value={}) =>{	
    const Ids = value.map((i)=>i.id)
    if(value){	
      setSelectedbranchData(value)	
      setSelectBranchId(Ids)	
    }else{	
    setSelectBranchId([])	
    setSelectedbranchData([])	
    }	
  }
  const handleGrade = (e, value) => {
    if (value?.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.grade_id);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData(data);
      setSelectedGradeId(ids);
    } else {
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData([]);
      setSelectedGradeId([]);
    }
  };

  const handleSection = (e, value) => {
    if (value?.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.section_id);
      const sectionMappingIds = value.map((el) => el.id);
      setSelectedSectionId(ids);
      setSelectedSectionListData(data);
      setSelectedSectionMappingId(sectionMappingIds);
    } else {
      setSelectedSectionListData([]);
    }
  };

  const getSection = () => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectBranchId.length>0 ? selectBranchId : branchId}&grade_id=${selectedGradeId}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionList(res?.data?.data);
        } else {
          setSectionList([]);
        }
      });
  };

  useEffect(() => {
    if (moduleId) {
      getBranch();
      getGrade();
    }
  }, [moduleId]);
  
  useEffect(()=>{
    if(selectedGradeId.length>0){
      getSection();
    }
  }, [selectedGradeId])

  useEffect(()=>{	
    getGrade();	
  },[selectBranchId])
  const updatePublish = (id) => {
    const params = {
      is_draft: false,
    };
    axiosInstance
      .patch(`${endpoints.announcementNew.publish}/${id}/`, params)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          handleClose();
          setOnClickIndex(3);
          rowsData();
        } else {
          setSectionList([]);
        }
      });
  };

  const updateDelete = (id) => {
    axiosInstance.delete(`${endpoints.announcementNew.publish}/${id}/`).then((res) => {
      if (res?.data?.status_code === 200) {
        handleClose();
        rowsData();
      } else {
        setSectionList([]);
      }
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openAnnouncement = Boolean(anchorElAnnouncementType);
  const idAnnouncementType = openAnnouncement ? 'simple-popover' : undefined;

  const Output = rows.reduce((initialValue, data) => {
    const date = moment(data.created_time).format('MM/DD/YYYY');
    if (!initialValue[date]) {
      initialValue[date] = [];
    }
    initialValue[date].push(data);
    return initialValue;
  }, {});

  const dateWiseEvents = Object.keys(Output)
    .map((date) => {
      return {
        date,
        events: Output[date],
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  const resolveRole = (type) => {
    switch (type) {
      case 11:
        return 'Teacher';
      case 13:
        return 'Student';
      case 26:
        return 'Operation Manager';
      case 28:
        return 'Transport Incharge';
      case 12:
        return 'Parent';
      case 1:
        return 'Super Admin';
      case 8:
        return 'Principal';
      default:
        return '--';
    }
  };

  const resolveColor = (eventType) => {
    switch (eventType) {
      case 'Event':
        return '#7852CC';
      case 'Exam':
        return '#EF005A';
      case 'Holiday':
        return '#F96C00';
      case 'TimeTable':
        return '#62A7EB';
      case 'General':
        return '#464D57';
      case 'Circular' :
        return 'rgb(65 106 103)';
      default:
        return '#464D57';
    }
  };

  const branchName = (branchID=[]) =>{
    if(branchID.length>0){
      for(let i = 0 ; i<branchList.length ; i++){
        if(branchList[i].id === branchID[0]){
          return branchList[i].branch_name
        }
      }
    }

  }

  return (
    <Layout>
      <div 
      className='announcement-scroll'
      style={{
        height: '90vh',
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}>
      {loading && <Loader />}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection : isMobile ? 'column' : 'row',
          padding : isMobile ? '0 15px' : '0'
        }}
      >
        <div style={{ paddingTop: '10px', color: '#347394', fontSize: '20px' , marginLeft: '1%' }}>
          Announcements ({count})
        </div>
        {(showBranchFilter.includes(userLevel) || isSuperUser) &&	
          <Grid xs={6} sm={2} md={3}>	
          <Autocomplete	
            multiple
            limitTags='2'
            style={{ width: '100%' }}	
            size='small'	
            onChange={handleBranch}	
            id='branch_id'	
            className='dropdownIcon'	
            options={branchList || []}	
            getOptionLabel={(option) => option?.branch_name || ''}	
            renderInput={(params) => (	
              <TextField	
                {...params}	
                variant='outlined'	
                label='Branch'	
                placeholder='Branch'	
              />	
            )}	
          />	
          </Grid>}
        {userLevel !== 12 && userLevel !== 13 && (
          <div
            style={{
              paddingTop: '10px',
              color: '#347394',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight : isMobile ? '' : '28%'
            }}
          >
            <Typography
              onClick={handleRightClick}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {/* Filters <FilterFramesIcon /> */}
              Filters{' '}
              <img
                src={logo}
                alt=''
                style={{ height: '12px', width: '12px', marginLeft: '10px' }}
              ></img>
            </Typography>
          </div>
        )}
      </div>
      <Grid
        container
        direction={isMobile ? 'column-reverse' : 'row'}
        style={{ backgroundColor: '#F6FAFD' }}
      >
        <Grid item xs={12} sm={9} md={9} spacing={3}>
          <div style={{ padding: '0 20px' }}>
            {dateWiseEvents.length === 0 ? (
              <div style={{ marginTop: '30px' }}>
                <NoFilterData data={'No Data Found for this Section & Date'} />
              </div>
            ) : (
              dateWiseEvents?.reverse().map((announcement) => {
                return (
                  <>
                    <div
                      style={{
                        // marginLeft: '20px',
                        padding: '10px 0',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      {announcement?.date == moment(new Date()).format('MM/DD/YYYY')
                        ? 'Today, '
                        : announcement?.date ==
                          moment().subtract(1, 'days').format('MM/DD/YYYY')
                        ? 'Yesterday, '
                        : ''}
                      {announcement?.date}
                    </div>
                    <div>
                      {announcement?.events.map((item) => (
                        <Paper>
                          <Grid
                            container
                            style={{
                              height: '40px',
                              marginBottom: '5px',
                              borderLeft: `5px solid ${resolveColor(
                                item?.category__category_name
                              )}`,
                              cursor: 'pointer',
                              display: 'flex',
                            }}
                          >
                            <Grid
                              item
                              xs={2}
                              sm={2}
                              md={2}
                              style={{
                                display: 'flex',
                                // justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                style={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  color: `${resolveColor(item?.category__category_name)}`,
                                  fontWeight: 'bold',
                                  paddingLeft: '20px',
                                  fontSize: '14px',
                                }}
                              >
                                {item?.title}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={onClickIndex === 1 ? 10 : 9}
                              sm={onClickIndex === 1 ? 10 : 9}
                              md={onClickIndex === 1 ? 10 : 9}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onClick={() => {
                                setHeaderOpen(true);
                                setDialogData(item);
                              }}
                            >
                              <Typography
                                style={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  color: '#7F92A3',
                                  // height: '25px',
                                  fontSize: '14px',
                                  paddingLeft: '20px',
                                }}
                              >
                                {extractContent(item?.content)}
                              </Typography>
                            </Grid>
                            {onClickIndex !== 1 && (
                              <Grid
                                item
                                xs={1}
                                sm={1}
                                md={1}
                                style={{
                                  display: 'flex',
                                  width: '90px!important',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}
                              >
                                {onClickIndex === 2 && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      paddingRight: '10px',
                                    }}
                                    onClick={(event) => {
                                      setDialogData(item);
                                      return handlePopOverClick(event);
                                    }}
                                  >
                                    <MoreHorizIcon />
                                  </div>
                                )}
                                {onClickIndex === 3 && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      // justifyContent: 'space-evenly',
                                      paddingRight: '10px',
                                    }}
                                  >
                                    {/* <MessageIcon />
                                  <WhatsAppIcon />
                                  <MailIcon /> */}
                                  </div>
                                )}
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      ))}
                    </div>
                  </>
                );
              })
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={2} md={2} spacing={2}>
          <div style={{ height: isMobile ? 'auto' : '80px' }}></div>
          <List
            style={{
              display: isMobile ? 'flex' : 'block',
              overflow: isMobile ? 'scroll' : 'hidden',
            }}
            dense={true}
          >
            <ListItem
              className={` ${classes.listItem} ${onClickIndex == 1 && 'active'}`}
              button
              onClick={() => {
                setOnClickIndex(1);
                setpageNo(1);
                setCategory(null);
              }}
            >
              <ListItemIcon>
                <InboxIcon style={{ color: '#464D57' }} />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </ListItem>
            {userLevel !== 12 && userLevel !== 13 && (
              <>
                <ListItem
                  className={` ${classes.listItem} ${onClickIndex == 2 && 'active'}`}
                  button
                  onClick={() => {
                    setOnClickIndex(2);
                    setpageNo(1);
                    setCategory(null);
                  }}
                >
                  <ListItemIcon>
                    <MailIcon style={{ color: '#464D57' }} />
                  </ListItemIcon>
                  <ListItemText primary='Draft' />
                </ListItem>
                <ListItem
                  className={` ${classes.listItem} ${onClickIndex == 3 && 'active'}`}
                  button
                  onClick={() => {
                    setOnClickIndex(3);
                    setpageNo(1);
                    setCategory(null);
                  }}
                >
                  <ListItemIcon>
                    <SendIcon style={{ color: '#464D57' }} />
                  </ListItemIcon>
                  <ListItemText primary='Sent' />
                </ListItem>
              </>
            )}
          </List>
          <Divider />
          <List
            style={{
              display: isMobile ? 'flex' : 'block',
              width: '100%',
              overflow: isMobile ? 'scroll' : 'hidden',
            }}
            dense={true}
          >
            {announcementList.map((item) => (
              <ListItem
                button
                onClick={() => {
                  setCategory(item?.id);
                  setpageNo(1);
                }}
              >
                <ListItemIcon>
                  {item?.category_name === 'Event' ? (
                    <EventIcon style={{ color: '#7852CC' }} />
                  ) : (
                    ''
                  )}
                  {item?.category_name === 'Exam' ? (
                    <EventNoteIcon style={{ color: '#EF005A' }} />
                  ) : (
                    ''
                  )}
                  {item?.category_name === 'Holiday' ? (
                    <BeachAccessIcon style={{ color: '#F96C00' }} />
                  ) : (
                    ''
                  )}
                  {item?.category_name === 'General' ? (
                    <SubjectIcon style={{ color: '#464D57' }} />
                  ) : (
                    ''
                  )}
                  {item?.category_name === 'TimeTable' ? (
                    <InsertInvitationIcon style={{ color: '#62A7EB' }} />
                  ) : (
                    ''
                  )}
                  {item?.category_name === 'Circular' ? (
                    <BlurCircularIcon style={{ color: 'rgb(65 106 103)' }} />
                  ) : (
                    ''
                  )}
                </ListItemIcon>
                <ListItemText
                  style={{
                    color: `${resolveColor(item?.category_name)}`,
                  }}
                  primary={item?.category_name}
                />
              </ListItem>
            ))}
          </List>
          <div style={{ height: '20px' }}></div>
          {userLevel !== 12 && userLevel !== 13 && (
            <div style={{position : isMobile ? 'absolute' : 'static',bottom : isMobile? '20px' : '', right : isMobile ? '10px':''}}>
              <Button
                aria-describedby={idAnnouncementType}
                variant='contained'
                color='primary'
                style={{
                  marginLeft: '17px',
                  borderRadius: anchorElAnnouncementType ? '50%' : '18px',
                  padding: anchorElAnnouncementType ? '18px' : '',
                  marginTop: anchorElAnnouncementType ? '-18px' : '',
                }}
                onClick={handleAnnouncmentClick}
              >
                {anchorElAnnouncementType ? <CloseIcon /> : '+ Create New  '}
              </Button>
              <Popover
                id={idAnnouncementType}
                open={openAnnouncement}
                anchorEl={anchorElAnnouncementType}
                onClose={handleCloseAnnouncement}
                anchorOrigin={{
                  vertical:  'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <List dense={true}>
                  {announcementList.map((item) => (
                    <ListItem
                      button
                      onClick={() =>
                        handleCloseAnnouncement(false, {
                          id: item?.id,
                          category_name: item?.category_name,
                        })
                      }
                    >
                      <ListItemIcon>
                        {item?.category_name === 'Event' ? (
                          <EventIcon style={{ color: '#7852CC' }} />
                        ) : (
                          ''
                        )}
                        {item?.category_name === 'Exam' ? (
                          <EventNoteIcon style={{ color: '#EF005A' }} />
                        ) : (
                          ''
                        )}
                        {item?.category_name === 'Holiday' ? (
                          <BeachAccessIcon style={{ color: '#F96C00' }} />
                        ) : (
                          ''
                        )}
                        {item?.category_name === 'General' ? (
                          <SubjectIcon style={{ color: '#464D57' }} />
                        ) : (
                          ''
                        )}
                        {item?.category_name === 'TimeTable' ? (
                          <InsertInvitationIcon style={{ color: '#62A7EB' }} />
                        ) : (
                          ''
                        )}
                        {item?.category_name === 'Circular' ? (
                          <BlurCircularIcon style={{ color: 'rgb(65 106 103)' }} />
                        ) : (
                          ''
                        )}
                      </ListItemIcon>
                      <ListItemText
                        style={{
                          color: `${resolveColor(item?.category_name)}`,
                        }}
                        primary={item?.category_name}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </div>
          )}
        </Grid>
      </Grid>
      <Dialog
        maxWidth={'md'}
        fullWidth={true}
        open={headerOpen}
        onClose={handleClose}
        aria-describedby='alert-dialog-description'
        style={{ backgroundColor: 'rgba(50, 43, 47, 0.63)', marginTop: '5%' }}
      >
        {openPublish && (
          <DialogTitle
            id='max-width-dialog-title'
            style={{
              display: 'flex',
              color: 'black',
              justifyContent: 'center',
              margin: '-1% 0',
            }}
          >
            Are you sure you want to publish this draft?
          </DialogTitle>
        )}
        <DialogContent
          style={{
            borderLeft: `5px solid ${resolveColor(dialogData?.category__category_name)}`,
            margin: openPublish ? '1% 4%' : '0px',
            backgroundColor: '#EAEFF6',
            // width: '65vw',
          }}
        >
          <DialogContentText style={{ width: '100%' }}>
            <Grid container>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div>
                  <Typography
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      width: '100%',
                      whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'
                    }}
                  >
                    {dialogData?.created_user}
                  </Typography>
                </div>
                <div>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData?.created_time).format('MM/DD/YYYY')}
                  </Typography>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData?.created_time).format('hh:mm:ss a')}
                  </Typography>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {dialogData?.role?.map((item) => {
                    return (
                      <span
                        style={{
                          background: '#EBEBEB 0% 0% no-repeat padding-box',
                          border: '1px solid #EBEBEB',
                          borderRadius: 17,
                          opacity: '1',
                          textAlign: 'center',
                          fontSize: '12px',
                          margin: '5px 5px 0 0',
                          padding: '5px',
                        }}
                      >
                        {resolveRole(item)}
                      </span>
                    );
                  })}
                </div>
                <div>
                <span
                  style={{
                    background: '#EBEBEB 0% 0% no-repeat padding-box',
                    border: '1px solid #EBEBEB',
                    borderRadius: 17,
                    opacity: '1',
                    textAlign: 'center',
                    fontSize: '12px',
                    margin: '5px 5px 0 0',
                    padding: '5px 10px',
                  }}
                >
                  {branchName(dialogData.branch_id)}
                </span>
                </div>
              </Grid>
              <Grid item xs={8} sm={8} md={8} style={{ width: '100%',marginLeft:'30px' }}>
                <div style={{ whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}>{dialogData?.title}</div>
                <div style={{ margin: '10px 0' }}>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {extractContent(dialogData?.content)}
                  </Typography>
                </div>
                {dialogData?.attachments?.length>0 && <Grid><b>Attachment</b></Grid>}
                {dialogData?.attachments &&
                  dialogData?.attachments.map((item, index, arr) => {
                    const extension = item.split('.')[item.split('.').length - 1];
                    const name = item.split('.')[item.split('.').length - 2];
                    return (
                      <div
                        style={{
                          display: 'flex',
                          background: 'white',
                          margin: '10px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 'bold' }} className = {isMobile ? classes.ellipses : null}>{name}</div>
                        <div
                          className='announcementsrc'
                          style={{
                            paddingLeft: 15,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <SvgIcon
                            component={() => (
                              <VisibilityIcon
                                style={{ width: 30, height: 30, cursor: 'pointer' }}
                                onClick={() => {
                                  const fileSrc = `${endpoints.lessonPlan.s3erp}announcement/${item}`;
                                  openPreview({
                                    currentAttachmentIndex: 0,
                                    attachmentsArray: [
                                      {
                                        src: fileSrc,
                                        name: fileSrc,
                                        extension: `.${extension}`,
                                      },
                                    ],
                                  });
                                }}
                                color='primary'
                              />
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
              </Grid>
              {/* <Grid
                item
                xs={2}
                sm={2}
                md={2}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              > */}
              <div> <CancelIcon
                      style={{
                        height: isMobile ? '12px' : '25px',
                        width: isMobile ? '12px' : '25px',
                        cursor: 'pointer',
                      }}
                      onClick={handleClose}
                    /></div>
               
                {/* {openPublish ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      height: '30px',
                    }}
                  >
                    <IconButton
                      title='Delete'
                      onClick={() => updateDelete(dialogData?.id)}
                    >
                      <DeleteIcon style={{ color: '#FF006F' }} />
                    </IconButton>
                     <IconButton
                      title='Edit'
                      // onClick={}
                    >
                      <BorderColorIcon style={{ color: '#536476' }} />
                    </IconButton>
              </div> 
                ) : (
                  <>
                    <Typography
                      style={{
                        color: '#0070D5',
                        fontSize: '12px',
                        marginRight: 5,
                      }}
                    >
                      Total {dialogData?.total_members} Receipients
                    </Typography>
                    <CancelIcon
                      style={{
                        height: '12px',
                        width: '12px',
                        cursor: 'pointer',
                      }}
                      onClick={handleClose}
                    />
                  </>
                )} */}
              {/* </Grid> */}
            </Grid>
          </DialogContentText>
        </DialogContent>
        {openPublish && (
          <DialogActions
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button autoFocus onClick={handleClose} variant='contained' color='default'>
              Cancel
            </Button>
            <Button
              autoFocus
              variant='contained'
              color='primary'
              onClick={() => updatePublish(dialogData?.id)}
            >
              Publish
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopOverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List style={{ cursor: 'pointer' }} dense={true}>
          <ListItem
            onClick={() => {
              setOpenPublish(true);
              setHeaderOpen(true);
            }}
          >
            <ListItemIcon>
              <SendIcon style={{ color: '#7852CC' }} />
            </ListItemIcon>
            <ListItemText primary='Publish' style={{ color: '#7852CC' }} />
          </ListItem>

          <ListItem
            onClick={() => {
              setOpenPublish(true);
              setHeaderOpen(true);
            }}
          >
            <ListItemIcon>
              <DeleteIcon style={{ color: '#EF005A' }} />
            </ListItemIcon>
            <ListItemText primary='Delete' style={{ color: '#EF005A' }} />
          </ListItem>
        </List>
      </Popover>
      <CreateAnouncement
        openModalAnnouncement={openModalAnnouncement}
        setOpenModalAnnouncement={setOpenModalAnnouncement}
        setPage={setPage}
        announcementType={announcementType}
      />
      <Menu
        open={!!menuPosition}
        onClose={() => setMenuPosition(null)}
        anchorReference='anchorPosition'
        anchorPosition={menuPosition}
        // style={{ width: isMobile ? '100%' : '35vw' }}
        className={isMobile ? classes.rootmenu : classes.rootwebmenu}
      >
        <MenuItem onClick={handleItemClick}>
          <form className={classes.container} noValidate>
            <TextField
              id='date'
              label='Select Date'
              type='date'
              display='none'
              defaultValue={defaultdate}
              value={defaultdate || moment().format('YYYY-MM-DD')}
              onChange={dateUpdatefun}
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </MenuItem>

        {/* <MenuItem>
          <Grid xs={12} md={12} lg={12} item>
          <b>Branch</b>
          <Autocomplete
                id='combo-box-demo'
                size='small'
                options={branchList || []}
                onChange={handleBranch}
                value={selectedbranchListData}
                getOptionLabel={(option) => option?.branch_name}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Branch' variant='outlined' />
                )}
              />
          </Grid>
        </MenuItem> */}

        <MenuItem>
          <Grid xs={12} md={12} lg={12} item>
            <b>Grade</b>
            <Autocomplete
              multiple
              size='small'
              onChange={handleGrade}
              value={selectedGradeListData}
              id='message_log-smsType'
              className='multiselect_custom_autocomplete'
              options={gradeList || []}
              limitTags='2'
              getOptionLabel={(option) => option.grade__grade_name || {}}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  // label={'Choose Branch'}
                  placeholder={'Choose Grade'}
                />
              )}
            />
          </Grid>
        </MenuItem>
        <MenuItem>
          <Grid xs={12} md={12} lg={12} item>
            <b>Section</b>
            <Autocomplete
              multiple
              size='small'
              onChange={handleSection}
              value={selectedSectionListData}
              id='message_log-smsType'
              className='multiselect_custom_autocomplete'
              options={sectionList || []}
              limitTags='2'
              getOptionLabel={(option) => option.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  placeholder={'Choose Sections'}
                />
              )}
            />
          </Grid>
        </MenuItem>
        <MenuItem>
          <Button variant='contained' color='primary' onClick={() => rowsData(true)}>
            {' '}
            Apply
          </Button>
        </MenuItem>
      </Menu>
      <Grid container justify='center'>
        {rows && count > 9 && (
          <Pagination
            totalPages={Math.ceil(count / limit)}
            currentPage={pageNo}
            setCurrentPage={setpageNo}
          />
        )}
      </Grid>
      </div>
    </Layout>
  );
};

export default NewCommunication;
