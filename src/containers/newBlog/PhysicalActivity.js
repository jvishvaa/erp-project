import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from 'containers/Layout';
import Close from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { useTheme } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { PieChartOutlined, IdcardOutlined, DownOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button as ButtonAnt,
  Form,
  Select,
  message,
  Table,
  Tag,
  Modal,
  Tooltip,
  Spin,
} from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import TopBar from 'v2/Layout/TopBar';

const PhysicalActivity = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const formRef = createRef();
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const branchIdsLocal = role_details?.branch
    ? role_details?.branch.map((obj) => obj.id)
    : [];
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  // const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeData, setGradeData] = useState([]);
  const [gradeName, setGradeName] = useState();
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
  const physicalActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId'));
  const [subjectData, setSubjectData] = useState([]);
  const token = dataes?.token;
  const user_level = dataes?.user_level;
  const { Option } = Select;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [subActivityId, setSubActivityId] = useState('');
  const [sudActId, setSubActId] = useState(history?.location?.state?.subActiveId);
  const [subActivityListData, setSubActivityListData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];

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

  function handleTab(event, newValue) {
    setValue(newValue);
  }
  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);
  const [branchList, setBranchList] = useState([]);

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
        // setAlert('success', 'Activity Successfully Assign');
        getUnAssinged();
        setLoading(false);
        message.success('Activity Assign Successfully');
        return;
      });
  };

  const [unassingeds, setUnAssigneds] = useState([]);
  const getUnAssinged = () => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.unAssign}?section_ids=null&user_id=null&branch_ids=${selectedBranch?.branch?.id}&is_draft=true&page=${currentPageUnassign}&page_size=${limitUnassign}`,
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
    getAssinged();
  }, [currentPageAssigned, sudActId]);
  const getAssinged = () => {
    setLoading(true);
    axios
      .get(
        `${
          endpoints.newBlog.physicalActivityListApi
        }?section_ids=null&user_id=null&is_draft=false&page=${currentPageAssigned}&page_size=${limitAssigned}&activity_type=${
          sudActId ? sudActId : physicalActivityId
        }&branch_ids=${selectedBranch?.branch?.id}`,
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
          setAlert('error', 'Server Issue ');
          setLoading(false);
        }
      });
  };
  const viewedAssign = (data) => {
    if (data) {
      localStorage.setItem('ActivityId', JSON.stringify(data));

      history.push({
        pathname: '/physical/activity/review',
        state: {
          data,
        },
      });
    }
  };

  useEffect(() => {
    if (moduleId && branch_update_user) {
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
        });
    }
  }, [window.location.pathname, moduleId]);

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
      getUnAssinged();
      getAssinged();
    }
  }, [value, selectedBranch, currentPageAssigned, currentPageUnassign]);
  const [previewData, setPreviewData] = useState();
  const handlePreview = (data) => {
    setPreview(true);
    setPreviewLoading(true);
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
        setPreviewLoading(false);
      });
  };
  const closePreview = () => {
    setPreview(false);
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
        getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
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

  const EditActivity = (data) => {
    history.push({
      pathname: '/blog/admineditcreateblogs',
      state: {
        data,
      },
    });
  };

  const handleSearch = (event, value) => {
    if (selectedBranch) {
      setAlert('error', 'Please Select Branch');
      return;
    } else {
      setSearchFlag(true);
    }
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          if (user_level == 13) {
            setGradeName(res?.data?.data[0]?.grade__grade_name);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.subjects}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    fetchSubActivityListData();
  }, []);

  const fetchSubActivityListData = () => {
    axiosInstance
      .get(
        `${endpoints.newBlog.subActivityListApi}?type_id=${
          sudActId ? sudActId : physicalActivityId
        }&is_type=${true}`,
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
  const handlePaginationUnassign = (event, page) => {
    setSearchFlag(true);
    setIsClickedUnassign(true);
    setCurrentPageUnassign(page);
  };

  const createPushBlogWall = () => {
    history.push('/blog/wall');
  };

  const redirectBMI = () => {
    history.push('/bmi/view');
  };

  const handleGoBack = () => {
    history.goBack();
  };
  const handleSubActivity = (e) => {
    setCurrentPageAssigned(1);
    setSubActivityId(e);
    setSubActId(e);
  };

  const handleClearSubActivity = (e) => {
    setSubActivityId('');
  };
  const handleBoard = (e, value) => {
    setBoardId(e);
  };
  const handleClearBoard = () => {
    setBoardId('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
  const branchOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const subActivityOption = subActivityListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.sub_type}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      align: 'center',
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
      title: <span className='th-white th-fw-700'>Executed Date</span>,
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
        <div className='th-black-1 d-flex justify-content-center'>
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

  return (
    <div>
      <Layout>
        <div className='px-2'>
          <div className='row'>
            <div className='col-6'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='/blog/wall/central/redirect'
                  className='th-grey th-400 th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-16'>Physical Activity</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='col-md-6 d-flex justify-content-end'>
              {user_level == 11 ? (
                ''
              ) : (
                <ButtonAnt
                  type='primary'
                  icon={<AppstoreAddOutlined />}
                  size={'large'}
                  onClick={createPush}
                  className='th-400 mx-4'
                  disabled={user_level == 11}
                >
                  Create Physical Activity
                </ButtonAnt>
              )}

              <ButtonAnt
                type='primary'
                icon={<AppstoreAddOutlined />}
                size={'large'}
                onClick={redirectBMI}
                className='th-400'
              >
                Add BMI
              </ButtonAnt>
            </div>
          </div>
          <div className='py-3 th-bg-white mx-3 mt-3 th-br-5'>
            <div className='row mt-2'>
              <div className='col-md-12' style={{ zIndex: 5 }}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-items-center'>
                    <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Sub-Activity Type </div>
                      <Form.Item name='sub-activity'>
                        <Select
                          placeholder='Select Sub-Activity'
                          showSearch
                          suffixIcon={<DownOutlined className='th-grey' />}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e) => {
                            handleSubActivity(e);
                          }}
                          onClear={handleClearSubActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {subActivityOption}
                        </Select>
                      </Form.Item>
                    </div>
                    <div
                      className='col-md-2 col-6 pr-0 px-0 pl-md-3 mt-3'
                      style={{ display: 'flex', paddingTop: '5px' }}
                    >
                      <div className='mb-2 text-left'> </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className='col-12 mt-2 th-bg-white py-2 th-br-5'>
              <div className='row'>
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
                        handlePaginationAssign(e);
                      },
                    }}
                    scroll={{ x: assingeds.length > 0 ? 'max-content' : null, y: 600 }}
                  />
                </div>
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
            title={`Preview - Physical Activity`}
          >
            {previewLoading ? (
              <div className='row th-bg-white'>
                <div className='col-12 py-5 text-center'>
                  <Spin tip='Loading' size='large' />
                </div>
              </div>
            ) : (
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
            )}
          </Modal>
        </div>
      </Layout>
    </div>
  );
};
export default PhysicalActivity;
