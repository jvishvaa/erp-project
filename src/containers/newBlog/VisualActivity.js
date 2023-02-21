import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';

import {
  IconButton,
  Divider,
  TextField,
  Button,
  makeStyles,
  Typography,
  Grid,
  Paper,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  InputAdornment,
  DialogActions,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Layout from 'containers/Layout';
import Close from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { useTheme } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { PieChartOutlined, IdcardOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button as ButtonAnt,
  Table,
  Select,
  message,
  Tag,
  Modal,
  Tooltip} from 'antd';

import { AppstoreAddOutlined } from '@ant-design/icons';

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
}));

const VisualActivity = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeData, setGradeData] = useState([]);
  const [gradeName, setGradeName] = useState();
  const [moduleId, setModuleId] = React.useState('');
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  // const [boardListData, setBoardListData] = useState([]);

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
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [preview, setPreview] = useState(false);
  const [totalCountUnassign, setTotalCountUnassign] = useState(0);
  const [currentPageUnassign, setCurrentPageUnassign] = useState(1);
  const [totalPagesUnassign, setTotalPagesUnassign] = useState(0);
  const [limitUnassign, setLimitUnassign] = useState(10);
  const [isClickedUnassign, setIsClickedUnassign] = useState(false);
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [boardId, setBoardId] = useState();
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const [isClickedAssigned, setIsClickedAssigned] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
  const localActivityData = localStorage?.getItem('ActivityData')
    ? JSON.parse(localStorage.getItem('ActivityData'))
    : '';
  const [subjectData, setSubjectData] = useState([]);
  const token = dataes?.token;
  const user_level = dataes?.user_level;
  const { Option } = Select;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [subActivityId, setSubActivityId] = useState('');
  const [sudActId, setSubActId] = useState(history?.location?.state?.subActiveId);
  const [subActivityListData, setSubActivityListData] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'Blog Activity' &&
              window.location.pathname === '/blog/wall/central/redirect'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
              setLoading(false);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      // width: '15%',
      render: (text, row, index) => (
        <span className='th-black-1'>{index + 1 + (currentPageAssigned - 1) * 10}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Topic Name</span>,
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Assigned On</span>,
      dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{moment(row?.created_at).format('DD-MM-YYYY')}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Created By</span>,
      dataIndex: 'creator',
      align: 'center',
      render: (text, row) => <span className='th-black-1'> {row?.creator?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1 d-flex justify-content-around'>
          <Tag
            icon={<PieChartOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => viewedAssign(row)}
          >
            <span className='th-fw-500 th-14'>Review</span>
          </Tag>
          <Tag
            icon={<IdcardOutlined className='th-14' />}
            color='success'
            className='th-br-5 th-pointer py-1'
            onClick={() => handlePreview(row)}
          >
            <span className='th-fw-500 th-14'>Preview</span>
          </Tag>
        </div>
      ),
    },
  ];

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

  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);
  const [branchList, setBranchList] = useState([]);

  const handleClose = () => {
    setViewed(false);
  };
  const createPush = () => {
    history.push('/visual/activity/create');
    return;
  };
  const branchViewed = () => {
    setBranchView(false);
    setBranchSearch(true);
  };
  const [data, setData] = useState('');
  const handleDate = (data) => {
    setBranchView(true);
    setBranchSearch(false);
    setData(data);
  };
  const [assigned, setAssigned] = useState(false);
  const [userId, setUserId] = useState('');
  const closeconfirm = () => {
    setAssigned(false);
  };
  const todayDate = moment();

  const confirmassign = () => {
    let body = {
      is_draft: false,
      issue_date: todayDate.format().slice(0, 19),
    };
    setLoading(true);
    axios
      .put(`${endpoints.newBlog.confirmAssign}${userId}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then(() => {
        setAssigned(false);
        setAlert('success', 'Activity Successfully Assign');
        getUnAssinged();
        // getAssinged();
        setLoading(false);
      });
  };

  const [unassingeds, setUnAssigneds] = useState([]);

  const getUnAssinged = () => {
    const branchIds = selectedBranch?.branch?.id;
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.unAssign}?section_ids=null&user_id=null&branch_ids=${
          selectedBranch?.branch ? selectedBranch?.branch?.id : branchIds
        }&is_draft=true&page=${currentPageUnassign}&page_size=${limitUnassign}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setTotalCountUnassign(response?.data?.total);
          setTotalPagesUnassign(response?.data?.page_size);
          setCurrentPageUnassign(response?.data?.page);
          setLimitUnassign(Number(limitUnassign));
          setSearchFlag(false);
          setUnAssigneds(response?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  };
  const [assingeds, setAssigneds] = useState([]);

  useEffect(() => {
    console.log('Pagination2', currentPageAssigned);
    getAssinged();
  }, [currentPageAssigned, sudActId, boardId]);
  const getAssinged = () => {
    const { id } = localActivityData;
    setLoading(true);
    axios
      .get(
        `${
          endpoints.newBlog.physicalActivityListApi
        }?section_ids=null&user_id=null&is_draft=false&page=${currentPageAssigned}&page_size=${limitAssigned}&activity_type=${
          sudActId ? sudActId?.id : id
        }&branch_ids=${boardId ? boardId : selectedBranch?.branch?.id}`,
        {
          params: {},
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        if (response?.status == 200) {
          setTotalCountAssigned(response?.data?.total);
          setTotalPagesAssigned(response?.data?.page_size);
          setCurrentPageAssigned(response?.data?.page);
          setLimitAssigned(Number(limitAssigned));
          setSearchFlag(false);
          setAssigneds(response?.data?.result);
          // setAssigneds(dummyData)
          setLoading(false);
        } else {
          setAlert('error', 'Server Issue ');
          setLoading(false);
        }
      });
  };
  const viewedAssign = (data) => {
    if (data) {
      localStorage.setItem('VisualActivityId', JSON.stringify(data));

      history.push({
        pathname: '/visual/activity/review',
        state: {
          data,
        },
      });
    }
  };

  useEffect(() => {
    if (moduleId && branch_update_user) {
      if (selectedAcademicYear?.id > 0) 
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.activityBranch}?branch_ids=${selectedBranch?.branch?.id}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if (response?.data?.status_code === 200) {
            setBranchList(response?.data?.result || []);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  }, [window.location.pathname, moduleId]);

  const fetchBranches = async () => {
    const newBranches =
      (await JSON?.parse(localStorage?.getItem('ActivityManagementSession'))) || {};
    if (newBranches?.length !== undefined) {
      const transformedData = newBranches?.branches?.map((obj) => ({
        id: obj?.id,
        name: obj?.name,
      }));
      transformedData.unshift({
        name: 'Select All',
        id: 'all',
      });
      // setBranchList(transformedData);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch?.length !== 0 && searchFlag) {
      getUnAssinged();
      getAssinged();
    }
  }, [value, selectedBranch, searchFlag, currentPageAssigned, currentPageUnassign]);
  const [previewData, setPreviewData] = useState();
  const handlePreview = (data) => {
    setPreview(true);
    axios
      .get(`${endpoints.newBlog.previewDetails}${data?.id}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setPreviewData(response?.data?.result);
        setLoading(false);
      });
  };
  const closePreview = () => {
    setPreview(false);
  };

  const [activityStorage, setActivityStorage] = useState([]);
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
        setActivityStorage(response.data.result);
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubActivityListData();
  }, []);

  const fetchSubActivityListData = () => {
    const { id } = localActivityData;
    axiosInstance
      .get(
        `${endpoints.newBlog.subActivityListApi}?type_id=${sudActId ? sudActId?.id : id}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((result) => {
        setLoading(false);
        setSubActivityListData(result?.data?.result);
      });
  };

  const handlePaginationAssign = (page) => {
    setSearchFlag(true);
    setIsClickedAssigned(true);
    setCurrentPageAssigned(page);
  };

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row '>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  onClick={() => history.goBack()}
                  className='th-black th-pointer th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-grey th-16'>
                  {localActivityData.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='col-md-6 text-right pr-2'>
              <ButtonAnt
                icon={<AppstoreAddOutlined />}
                onClick={createPush}
                className='th-button-active th-br-6 text-truncate th-pointer'
              >
                Create {localActivityData.name}
              </ButtonAnt>
            </div>
          </div>
          <div className='col-12 mt-3  th-br-5 py-3 th-bg-white'>
            <div className='row '>
              <div className='col-12 px-0'>
                <Table
                  columns={columns}
                  dataSource={assingeds}
                  className='th-table'
                  rowClassName={(record, index) =>
                    `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  loading={loading}
                  pagination={{
                    total: totalCountAssigned,
                    current: Number(currentPageAssigned),
                    pageSize: limitAssigned,
                    showSizeChanger: false,
                    onChange: (e) => {
                      console.log('Pagination', e);
                      handlePaginationAssign(e);
                    },
                  }}
                  scroll={{ x: assingeds.length > 0 ? 'max-content' : null, y: 600 }}
                />
              </div>
            </div>
          </div>
          <Modal
            centered
            visible={preview}
            onCancel={closePreview}
            footer={false}
            width={500}
            className='th-upload-modal'
            title={`Preview -${localActivityData.name}`}
          >
            <div className='row th-bg-white p-2 pb-3'>
              <div className='col-12'>
                <span className='th-black-1 th-fw-500 th-25'>{previewData?.title}</span>
              </div>
              <div className='col-12'>
                <span className='th-grey th-12'>
                  Submission on -
                  {moment(previewData?.submission_date).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className='col-12 mt-3'>
                <div className='row th-12 th-grey'>
                  <div className='col-2 px-0 th-14'>
                    <div className='d-flex justify-content-between'>
                      <span>Grades</span>
                      <span>:&nbsp;</span>
                    </div>
                  </div>
                  <div className='col-10 pl-0'>
                    <span>
                      {previewData?.grades
                        .slice(0, 2)
                        .map((item) => item?.name)
                        .toString()}
                    </span>
                    {previewData?.grades.length > 2 && (
                      <Tooltip
                        placement='bottomLeft'
                        title={
                          <div style={{ maxHeight: '150px', overflowY: 'scroll' }}>
                            {previewData?.grades?.map((item) => (
                              <div>{item?.name}</div>
                            ))}
                          </div>
                        }
                        trigger='click'
                        className='th-pointer'
                        zIndex={2000}
                      >
                        <span className='th-bg-grey th-12 th-black-1 p-1 th-br-6 ml-1 th-pointer'>
                          Show All
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className='row th-12 th-grey'>
                  <div className='col-2 px-0 th-14'>
                    <div className='d-flex justify-content-between'>
                      <span>Sections</span>
                      <span>:&nbsp;</span>
                    </div>
                  </div>
                  <div className='col-10 pl-0'>
                    <span>
                      {previewData?.sections
                        .slice(0, 2)
                        .map((item) => item?.name)
                        .toString()}
                    </span>
                    {previewData?.sections.length > 2 && (
                      <Tooltip
                        placement='bottomLeft'
                        title={
                          <div style={{ maxHeight: '150px', overflowY: 'scroll' }}>
                            {previewData?.sections?.map((item) => (
                              <div>{item?.name}</div>
                            ))}
                          </div>
                        }
                        trigger='click'
                        className='th-pointer'
                        zIndex={2000}
                      >
                        <span className='th-bg-grey th-12 th-black-1 p-1 th-br-6 ml-1 th-pointer'>
                          Show All
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className='row th-12 th-grey'>
                  <div className='d-flex flex-column'>
                    <div className='th-14'>Instructions</div>
                    <div>{previewData?.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Dialog
            // open={assigned}
            // onClose={handleClose}
            maxWidth={maxWidth}
            style={{ borderRadius: '10px' }}
          >
            <div style={{ width: '503px' }}>
              <div style={{ textAlign: 'center' }}>
                <div>
                  <DoneIcon style={{ color: 'green', fontSize: '81px' }} />
                </div>
                <div style={{ fontSize: '20px', marginBottom: '2px' }}>
                  Blog Successfully Assigned
                </div>
                <div style={{ fontSize: '15px', marginBottom: '24px' }}>
                  Check Assigned tab for new submissions
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <Button variant='contained' size='small'>
                    Okay
                  </Button>{' '}
                </div>
              </div>
            </div>
          </Dialog>
          {assigned == true && (
            <Dialog
              open={assigned}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='draggable-dialog-title'>
                <strong>Assign Details</strong>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Are you sure you want to assign ?</DialogContentText>
              </DialogContent>

              <Divider className={classes.divider} />
              <DialogActions>
                <Button style={{ backgroundColor: 'lightgray' }} onClick={closeconfirm}>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  style={{ color: 'white' }}
                  onClick={confirmassign}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <Dialog open={view} maxWidth={maxWidth}>
            {' '}
            <div style={{ width: '700px' }}>
              <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                style={{ justifyContent: 'space-between' }}
              >
                <Grid item>
                  <Typography>
                    <strong
                      style={{
                        fontSize: '14px',
                        color: themeContext.palette.primary.main,
                      }}
                    >
                      Please Select Your Branch
                    </strong>
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton size='small' style={{ visibility: 'hidden' }}>
                    <Close />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton size='small' onClick={() => handleClose()}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>

              <Divider className={classes.divider} />
              <Grid
                container
                direction='row'
                style={{ marginLeft: '5px', marginBottom: '20px' }}
              >
                {branchView == true && (
                  <Grid item>
                    Branch Name:{' '}
                    <Button
                      size='small'
                      color='primary'
                      className={classes.buttonColor}
                      variant='contained'
                      onClick={branchViewed}
                      endIcon={<ArrowDropDownIcon />}
                      style={{ width: '576px' }}
                    >
                      {data == '' ? 'Select' : data.label}
                    </Button>
                  </Grid>
                )}
                {data && (
                  <Grid
                    item
                    style={{
                      marginLeft: '580px',
                      marginTop: '25px',
                    }}
                  >
                    <Button variant='contained' size='small' color='primary'>
                      {' '}
                      Proceed
                    </Button>
                  </Grid>
                )}
                {branchSearch == true && branchView == false && (
                  <Grid item style={{ display: 'flex' }}>
                    Branch Name:&nbsp;
                    <Paper
                      style={{
                        border: '1px solid gray',
                        width: '576px',
                        height: '321px',
                        overflowY: 'auto',
                      }}
                    >
                      <div>
                        <TextField
                          placeholder='Type Text...'
                          style={{ background: 'lightgray', width: '574px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant='standard'
                        />
                      </div>
                      <div>
                        <TableContainer>
                          <Table aria-label='simple table'>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.searchTable}>
                                  Branch Name
                                </TableCell>
                                <TableCell className={classes.searchTable} align='right'>
                                  Total Submitted
                                </TableCell>
                                <TableCell className={classes.searchTable} align='right'>
                                  Reviewed
                                </TableCell>
                                <TableCell className={classes.searchTable} align='right'>
                                  Review Pending
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {months.map((option) => (
                                <TableRow
                                  key={option.value}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDate(option)}
                                >
                                  <TableCell component='th' scope='row'>
                                    {option.value}
                                  </TableCell>
                                  <TableCell align='right'>{option.label}</TableCell>
                                  <TableCell align='right'>22</TableCell>
                                  <TableCell align='right'>30</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </div>
          </Dialog>
        </div>
      </Layout>
    </div>
  );
};
export default VisualActivity;
