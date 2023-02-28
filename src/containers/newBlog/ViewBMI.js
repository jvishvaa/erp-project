import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { Grid, IconButton } from '@material-ui/core';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
// import axios from 'axios';
// import endpoints from 'v2/config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {
  SearchOutlined,
  DownOutlined,
  FileAddOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import endpoints from '../../config/endpoints';
import ViewBMITableCustom from './ViewBMITable';

const DEFAULT_RATING = 0;

const dummyData = [
  { id: 1, height: 20, weight: 40, bmi: 23, date: '28th Dec' },
  { id: 2, height: 21, weight: 40, bmi: 33, date: '28th Dec' },
  { id: 3, height: 20, weight: 44, bmi: 23, date: '28th Dec' },
];

const tableData = {
  id: 1,
  student_name: 'Anam',
  erp_id: '221313131_OLV',
  grade: 'grade 1',
  branch: 'Branch 1',
};

const ViewBMI = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const formRef = createRef();
  // const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  // const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const newBranches =
    JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = useState();
  const [view, setView] = useState(false);
  const [flag, setFlag] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  // const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const goBack = () => {
    history.push('/blog/blogview');
  };
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  // const [boardId, setBoardId] = useState();
  const { Option } = Select;
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector((state) => state.commonFilterReducer?.selectedBranch)
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState();
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [targetData, setTargetData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [loadingInner, setLoadingInner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openBigModal, setOpenBigModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
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
              window.location.pathname === '/bmi/view'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const columns = [
    {
      title: <span className='th-white th-fw-700 '> Student Name</span>,
      dataIndex: 'student_name',
      key: 'student_name',
      align: 'center',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: <span className='th-white th-fw-700 '>ERP ID</span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (text, row, index) => (
        <>
          <span style={{ margin: '0.5rem 1rem' }}>
            <ButtonAnt
              type='primary'
              icon={<FileAddOutlined />}
              size={'medium'}
              onClick={() => CheckBMIFun(row)}
            >
              Add BMI
            </ButtonAnt>
          </span>
          <span style={{ margin: '0.5rem 1rem' }}>
            <ButtonAnt
              type='primary'
              icon={<EyeOutlined />}
              size={'medium'}
              onClick={showBigModal}
            >
              View
            </ButtonAnt>
          </span>
        </>
      ),
    },
  ];

  const columnsBigTable = [
    {
      title: <span className='th-white th-fw-700 '>Height(in meters)</span>,
      dataIndex: 'height',
      key: 'height',
      align: 'center',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: <span className='th-white th-fw-700 '>Weight(in kgs)</span>,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>BMI</span>,
      dataIndex: 'bmi',
      key: 'bmi',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Date</span>,
      dataIndex: 'date',
      key: 'date',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (data) => (
        <>
          <span style={{ margin: '0.5rem 1rem' }}>
            <ButtonAnt
              type='primary'
              icon={<EditOutlined />}
              size={'medium'}
              onClick={editModal}
              // onClick={showModal}
            >
              Edit
            </ButtonAnt>
          </span>
        </>
      ),
    },
  ];

  const fetchBranches = () => {
    const transformedData = newBranches?.branches?.map((obj) => ({
      id: obj.id,
      branch_name: obj.name,
    }));
    transformedData.unshift({
      branch_name: 'Select All',
      id: 'all',
    });
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const editModal = () => {
    showModal();
    setIsEdit(true);
  };

  const showBigModal = () => {
    setOpenBigModal(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const handleBranch = (event, value) => {
    setSelectedGrade([]);
    if (value?.length) {
      const branchIds = value.map((obj) => obj?.id);
      // setSelectedBranch(value);
      if (branchIds) {
        setLoading(true);
        axios
          .get(`${endpoints.newBlog.activityGrade}?branch_ids=${selectedBranch?.branch?.id}`, {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          })
          .then((response) => {
            setGradeList(response?.data?.result);
            setLoading(false);
          });
      }
    }
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const goSearch = () => {
    setLoading(true);
    if (gradeId == undefined) {
      message.error('Please Select Grade ')
      setLoading(false);
      return;
    } else if (subjectId == undefined) {
      message.error('Please Select Section')
      setLoading(false);
      return;
    } else {
      setFlag(true);
      setLoading(false);
    }
  };

  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  const handleBoard = (e, value) => {
    formRef.current.setFieldsValue({
      grade: null,
      subject: null,
    });
    if (value) {
      setBoardName(value?.children);
    }
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    }
  };

  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchGradeData();
    }
  }, [selectedBranch, moduleId]);

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
          // if (user_level == 13) {
          // setGradeId(res?.data?.data[0]?.grade_id);
          setGradeName(res?.data?.data[0]?.grade__grade_name);
          // }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (gradeId !== '') {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade_id: gradeId,
      });
    }
  }, [gradeId]);

  const fetchSubjectData = (params = {}) => {
    if (gradeId) {
      axios
        .get(`${endpoints.academics.sections}`, {
          params: { ...params },
        })
        .then((res) => {
          if (res.data.status_code === 200) {
            setSubjectData(res?.data?.data);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const handleClearGrade = () => {
    setGradeId('');
    // setGradeName('');
    // setSubjectId('');
    // setSubjectName('');
  };

  const handleClearSubject = () => {
    // setSubjectId('');
    // setSubjectName('');
  };

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.section_id} mappingId={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleSubject = (item) => {
    if (item) {
      // setSubjectId(item.value);
      setSubjectId(item.value);
      setSubjectName(item?.mappingId);
    }
  };

  const erpData = () => {
    axios
      .get(`${endpoints.userManagementBlog.getUserLevel}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {});
  };

  const branchOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const erpAPI = () => {
    axios
      .get(`${endpoints.newBlog.erpDataStudentsAPI}?section_mapping_id=${subjectName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSourceData(response?.data?.result);
        setTotalSubmitted(response?.data?.result);
        // ActivityManagement(response?.data?.result)
        setFlag(false);
        // message.success(response?.data?.message)
        setLoading(false);
      });
  };

  const CheckBMIFun = (data) => {
    if (data) {
      showModal();
      setLoading(true);
      axios
        .get(`${endpoints.newBlog.checkBMIApi}?erp_id=${data?.erp_id}&user_level=${13}`, {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          message.success(response?.data?.message)
          setLoading(false);
        });
    }
  };

  const getTotalSubmitted = () => {
    // if (props) {
    setLoading(true);
    erpAPI();
    setLoading(false);

    // }
  };

  useEffect(() => {
    if (gradeId === undefined) {
      setTotalSubmitted([]);
    }
  }, [selectedBranch, gradeId, flag]);

  useEffect(() => {
    if (flag) {
      getTotalSubmitted();
    }
  }, [selectedBranch, gradeId, flag, currentPage]);

  const goDownload = () => {
    //will implement soon
  };

  return (
    <div>
      {loading && <Loader />}
      <Layout>
        {/* <Grid
          container
          direction='row'
        > */}
        <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
          <div
            className='col-md-8'
            style={{
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
            }}
          >
            <div>
              <IconButton aria-label='back' onClick={handleGoBack}>
                <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
              </IconButton>
            </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16' onClick={handleGoBack}>
                Physical Activities
              </Breadcrumb.Item>
              <Breadcrumb.Item href='/dashboard' className='th-black th-16'>
                BMI List
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Grid>
        {/* </Grid> */}
        <div className='row' style={{ padding: '0.5rem' }}>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-md-2 col-6 px-0'>
                  <div className='mb-2 text-left'>Grade</div>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder='Select Grade'
                      showSearch
                      disabled={user_level == 13}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleGrade(value);
                      }}
                      onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                  <div className='mb-2 text-left'>Section</div>
                  <Form.Item name='subject'>
                    <Select
                      placeholder='Select Section'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  className='col-md-2 col-6 pr-0 px-0 pl-md-3 pt-3'
                  style={{ display: 'flex', alignItem: 'center' }}
                >
                  <ButtonAnt
                    type='primary'
                    icon={<SearchOutlined />}
                    onClick={goSearch}
                    size={'medium'}
                  >
                    Search
                  </ButtonAnt>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <ViewBMITableCustom
          style={{ border: '1px solid red' }}
          selectedBranch={selectedBranch?.branch?.id}
          selectedBoardName={selectedBranch?.branch?.branch_name}
          setValue={setValue}
          value={value}
          handleChange={handleChange}
          selectedGrade={gradeId}
          selectedGradeName={gradeName}
          selectedSubject={subjectId}
          setSubjectName={subjectName}
          flag={flag}
          setFlag={setFlag}
        />
      </Layout>
    </div>
  );
};

export default ViewBMI;
