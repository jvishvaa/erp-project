import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';

import { Divider, Button, DialogActions } from '@material-ui/core';
import Layout from 'containers/Layout';
import DoneIcon from '@material-ui/icons/Done';
import { useTheme } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {
  Breadcrumb,
  Button as ButtonAnt,
  message,
  Tabs,
  Table,
  Tag,
  Modal,
  Spin,
} from 'antd';
import {
  PlusSquareOutlined,
  SketchOutlined,
  MonitorOutlined,
  UserSwitchOutlined,
  ContactsOutlined,
  EditOutlined,
  CloseSquareOutlined,
  CheckSquareOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { TabPane } from 'rc-tabs';
const AdminViewBlog = () => {
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const themeContext = useTheme();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = dataes?.token;
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = React.useState('');
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
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
  const [value, setValue] = useState(user_level == 8 || user_level == 2 ? 0 : 1);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [preview, setPreview] = useState(false);
  const [totalCountUnassign, setTotalCountUnassign] = useState(0);
  const [currentPageUnassign, setCurrentPageUnassign] = useState(1);
  const [totalPagesUnassign, setTotalPagesUnassign] = useState(0);
  const [limitUnassign, setLimitUnassign] = useState(10);
  const [isClickedUnassign, setIsClickedUnassign] = useState(false);
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const [isClickedAssigned, setIsClickedAssigned] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assingeds, setAssigneds] = useState([]);
  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);
  const [branchList, setBranchList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const blogActivityId = localStorage.getItem('BlogActivityId')
    ? JSON.parse(localStorage.getItem('BlogActivityId'))
    : {};

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

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

  const handleBranch = (event, value) => {
    setAssigneds([]);
    setUnAssigneds([]);
    if (value?.length) {
    }
  };

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
  const statuss = [
    { label: 'Assigned', value: '1' },
    { label: 'Unassigned', value: '2' },
  ];

  function handleTab(newValue) {
    setValue(newValue);
    if (newValue == 0) {
      getUnAssinged();
      return;
    } else if (newValue == 1) {
      getAssinged();
      return;
    }
  }

  const viewed = () => {
    setViewed(true);
  };
  const handleClose = () => {
    setViewed(false);
  };
  const createPush = () => {
    history.push('/blog/create');
  };
  const branchViewed = () => {
    setBranchView(false);
    setBranchSearch(true);
  };
  const blogsContent = [
    {
      label: 'Public Speaking',
      value: '1',
    },
    {
      label: 'Post Card Writting',
      value: '2',
    },
    {
      label: 'Blog Card Writting',
      value: '3',
    },
  ];
  const shortList = () => {
    history.push('/blog/short');
  };
  const [data, setData] = useState('');
  const handleDate = (data) => {
    setBranchView(true);
    setBranchSearch(false);
    setData(data);
  };
  const [assigned, setAssigned] = useState(false);
  const [userId, setUserId] = useState('');
  const assignIcon = (response) => {
    setUserId(response?.id);
    setAssigned(true);
  };
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
      .then((response) => {
        setAssigned(false);
        message.success('Activity Successfully Assigned');
        getUnAssinged();
        getAssinged();
        setLoading(false);
      });
  };

  const [unassingeds, setUnAssigneds] = useState([]);
  const getUnAssinged = () => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.unAssign}?section_ids=null&user_id=null&branch_ids=${selectedBranch?.branch?.id}&is_draft=true&page=${currentPageUnassign}&page_size=${limitUnassign}&activity_type=${blogActivityId}`,
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

  const getAssinged = () => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.Assign}?section_ids=null&user_id=null&branch_ids=${selectedBranch?.branch?.id}&is_draft=false&page=${currentPageAssigned}&page_size=${limitAssigned}&activity_type=${blogActivityId}`,
        {
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
          setLoading(false);
        } else {
          message.error('Server Issue');
          setLoading(false);
        }
      });
  };
  const viewedAssign = (data) => {
    if (data) {
      localStorage.setItem('ActivityId', JSON.stringify(data));

      history.push({
        pathname: '/blog/activityreview',
        state: {
          data,
        },
      });
    }
  };

  useEffect(() => {
    if (branch_update_user) {
      if (selectedAcademicYear?.id > 0) setLoading(true);
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
          setLoading(false);
        });
    }
  }, [window.location.pathname]);

  function callApi(api, key) {
    axiosInstance.get(api).then((result) => {
      if (result.status === 200) {
        if (key === 'branchList') {
          setBranchList(result?.data?.data?.results || []);
        }
      }
    });
  }
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
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      if (value == 0) {
        getUnAssinged();
        return;
      } else if (value == 1) {
        getAssinged();
        return;
      }
    }
  }, [value, selectedBranch, currentPageAssigned, currentPageUnassign]);

  const [previewData, setPreviewData] = useState();
  const handlePreview = (data) => {
    setPreview(true);
    setLoadingDetails(true);
    axios
      .get(`${endpoints.newBlog.previewDetails}${data?.id}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setPreviewData(response?.data?.result);
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  };
  const closePreview = () => {
    setPreview(false);
    setPreviewData(null);
  };
  const EditActivity = (data) => {
    history.push({
      pathname: '/blog/admineditcreateblogs',
      state: {
        data,
      },
    });
  };

  const handlePaginationAssign = (page) => {
    setSearchFlag(true);
    setIsClickedAssigned(true);
    setCurrentPageAssigned(page);
  };

  const handlePaginationUnassign = (page) => {
    setSearchFlag(true);
    setIsClickedUnassign(true);
    setCurrentPageUnassign(page);
  };

  const createPushBlogWall = () => {
    history.push('/blog/wall');
  };

  const columnsUnassigned = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      render: (text, row, index) => (
        <span className='th-black-1'>{index + 1 + (currentPageAssigned - 1) * 10}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Topic Name</span>,
      // dataIndex: 'title',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.title}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Submission On</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {moment(row?.submission_date).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Created By</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.creator?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<EditOutlined className='th-14' />}
            color='red'
            className='th-br-5 th-pointer py-1'
            disabled={user_level == 11 || user_level == 10 || user_level == 8}
            onClick={() => EditActivity(row)}
          >
            <span className='th-fw-500 th-14'>Edit</span>
          </Tag>
          <Tag
            icon={<UserSwitchOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignIcon(row)}
            disabled={user_level == 11 || user_level == 10 || user_level == 8}
          >
            <span className='th-fw-500 th-14'>Assign</span>
          </Tag>
          <Tag
            icon={<ContactsOutlined className='th-14' />}
            color='green'
            className='th-br-5 th-pointer py-1'
            onClick={() => handlePreview(row)}
          >
            <span className='th-fw-500 th-14'>Preview</span>
          </Tag>
        </div>
      ),
    },
  ];
  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      width: '15%',
      render: (text, row, index) => (
        <span className='th-black-1'>{index + 1 + (currentPageAssigned - 1) * 10}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Topic Name</span>,
      // dataIndex: 'title',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.title}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Assigned On</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{moment(row?.issue_date).format('DD-MM-YYYY')}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Created By</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.creator?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<PieChartOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            // onClick={() => assignPage(row)}
            onClick={() => viewedAssign(row)}
          >
            <span className='th-fw-500 th-14'>Review</span>
          </Tag>
          <Tag
            icon={<MonitorOutlined className='th-14' />}
            color='orange'
            className='th-br-5 th-pointer py-1'
            // onClick={() => assignPage(row)}
            onClick={() => handlePreview(row)}
          >
            <span className='th-fw-500 th-14'>Preview</span>
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <div className='px-2'>
          <div className='row'>
            <div className='col-6'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  onClick={() => history.push('/blog/wall/central/redirect')}
                  className='th-grey-1 th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black th-16'>
                  Blog Activity
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='col-6 d-flex justify-content-end px-4'>
              {user_level === 11 || user_level == 10 || user_level == 8 ? (
                ''
              ) : (
                <ButtonAnt
                  type='primary'
                  icon={<PlusSquareOutlined />}
                  className='th-600 mr-3'
                  disabled={user_level == 11}
                  onClick={createPush}
                >
                  Create Activity
                </ButtonAnt>
              )}
              <ButtonAnt
                icon={<SketchOutlined />}
                className='th-600 th-white th-border-white'
                type='primary'
                onClick={createPushBlogWall}
              >
                School Wall
              </ButtonAnt>
            </div>
          </div>
          <div className='py-3 th-bg-white mx-3 mt-4 th-br-5'>
            <div className='row'>
              <div className='col-12'>
                <div className='th-tabs th-bg-white'>
                  <Tabs
                    type='card'
                    // onChange={handleChange}
                    onChange={handleTab}
                    defaultValue={value}
                  >
                    {(user_level == 8 || user_level == 2) && (
                      <TabPane tab='UNASSIGNED' key='0'>
                        <Table
                          columns={columnsUnassigned}
                          dataSource={unassingeds}
                          className='th-table'
                          rowClassName={(record, index) =>
                            `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                          }
                          loading={loading}
                          pagination={{
                            total: totalCountUnassign,
                            current: Number(currentPageAssigned),
                            pageSize: limitAssigned,
                            showSizeChanger: false,
                            onChange: (page) => {
                              console.log('Pagination', page);
                              handlePaginationUnassign(page);
                            },
                          }}
                          scroll={{
                            x: unassingeds?.length > 0 ? 'max-content' : null,
                            y: 600,
                          }}
                        />
                      </TabPane>
                    )}
                    <TabPane tab='ASSIGNED' key='1'>
                      {/* {(value == 1 ||
                        (value == 1 && user_level === 11) ||
                        user_level === 10 ||
                        user_level === 2 ||
                        user_level === 8) && ( */}
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
                            onChange: (page) => {
                              console.log('Pagination', page);
                              handlePaginationAssign(page);
                            },
                          }}
                          scroll={{
                            x: assingeds.length > 0 ? 'max-content' : null,
                            y: 600,
                          }}
                        />
                      </div>
                      {/* )} */}
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <Modal
            centered
            onCancel={closePreview}
            visible={preview}
            footer={false}
            width={500}
            className='th-upload-modal'
            title={`Preview Blog Activity`}
          >
            {loadingDetails ? (
              <div className='row'>
                <div className='col-12 text-center py-5'>
                  <Spin tip='Loading..' size='large'></Spin>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ margin: '10px', overflow: 'scroll', maxHeight: '80vh' }}>
                  <div style={{ fontSize: '15px', color: '#7F92A3' }}>{}</div>
                  <div style={{ fontSize: '21px' }}>{previewData?.title}</div>
                  <div style={{ fontSize: '10px', color: '#7F92A3' }}>
                    Submission on -{previewData?.submission_date?.substring(0, 10)}
                  </div>
                  <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                    Branch -&nbsp;
                    <span style={{ color: 'black' }}>
                      {previewData?.branches.map((obj) => obj?.name).join(', ')},{' '}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'gray' }}>
                    Grade -&nbsp;
                    <span style={{ color: 'black' }}>
                      {previewData?.grades.map((obj) => obj?.name).join(', ')},{' '}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'gray' }}>
                    Section -&nbsp;
                    <span style={{ color: 'black' }}>
                      {previewData?.sections.map((obj) => obj?.name).join(', ')},{' '}
                    </span>
                  </div>

                  <div
                    style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}
                  ></div>
                  <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                    Instructions
                  </div>
                  <div style={{ paddingTop: '8px', fontSize: '16px' }}>
                    {previewData?.description}
                  </div>
                  <div
                    style={{
                      paddingTop: '28px',
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={previewData?.template?.template_path} width='50%' />
                  </div>
                </div>
              </div>
            )}
          </Modal>
          {/* </Dialog> */}
          <Dialog maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
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

              <Divider
              // className={classes.divider}
              />
              <DialogActions>
                <ButtonAnt
                  // style={{ backgroundColor: 'lightgray' }}
                  icon={<CloseSquareOutlined className='th-14' />}
                  onClick={closeconfirm}
                >
                  Cancel
                </ButtonAnt>
                <ButtonAnt
                  icon={<CheckSquareOutlined className='th-14' />}
                  type='primary'
                  // style={{ color: 'white' }}
                  onClick={confirmassign}
                >
                  Confirm
                </ButtonAnt>
              </DialogActions>
            </Dialog>
          )}
        </div>
      </Layout>
    </>
  );
};
export default AdminViewBlog;
