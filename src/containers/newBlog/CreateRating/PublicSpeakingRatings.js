import React, { useEffect, useState, useRef } from 'react';
import Layout from 'containers/Layout';
import {
  Button,
  Input,
  InputNumber,
  Select,
  Breadcrumb,
  Spin,
  Table,
  Modal,
  Tag,
  message,
  Popconfirm,
  Form,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  StopOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import axiosInstance from 'axios';

const { Option } = Select;

const PublicSpeakingRatings = () => {
  const history = useHistory();
  const formRef = useRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();
  const [activityUserId, setActivityUserId] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [publicSpeakingRatingList, setPublicSpeakingRatingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [editID, setEditID] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [showCreateratingModal, setShowCreateratingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState({
    title: '',
    questions: [
      {
        title: '',
      },
    ],
    levels: [
      {
        name: '',
        status: false,
        marks: '',
      },
    ],
  });

  const handleShowCreateRatingModal = () => {
    setShowCreateratingModal(true);
  };
  const handleCloseCreateRatingModal = () => {
    setShowCreateratingModal(false);
    formRef.current.setFieldsValue({
      grade: null,
      subject: null,
    });
    setSelectedSubject(null);
    setSelectedGrade(null);
    setSubjectData([]);
    setCurrentRating({
      title: '',
      questions: [
        {
          title: '',
        },
      ],
      levels: [
        {
          name: '',
          status: false,
          marks: '',
        },
      ],
    });
  };
  const handleAddQuestions = () => {
    let newRating = currentRating?.questions?.concat({ title: '' });
    setCurrentRating({ ...currentRating, questions: newRating });
  };
  const handleDeleteQuestions = (index) => {
    let newRating = currentRating?.questions?.slice();
    newRating.splice(index, 1);
    setCurrentRating({ ...currentRating, questions: newRating });
  };
  const handleChangeQuestions = (value, index) => {
    let newRating = Object.assign({}, currentRating);
    newRating.questions[index]['title'] = value;
    setCurrentRating({ ...newRating });
  };
  const handleAddRatings = () => {
    let newRating = currentRating?.levels?.concat({ name: '', status: false, marks: '' });
    setCurrentRating({ ...currentRating, levels: newRating });
  };
  const handleDeleteRatings = (index) => {
    let newRating = currentRating?.levels?.slice();
    newRating.splice(index, 1);
    setCurrentRating({ ...currentRating, levels: newRating });
  };
  const handleChangeLevels = (value, index, type) => {
    let newRating = Object.assign({}, currentRating);
    newRating.levels[index][type] = value;
    setCurrentRating({ ...newRating });
  };

  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      subject: null,
    });
    setSubjectData([]);
    if (e) {
      setSelectedGrade(e);
      fetchSubjectList({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: e,
      });
    }
  };
  const handleSubject = (e) => {
    if (e) {
      setSelectedSubject(e);
    } else {
      setSelectedSubject(null);
    }
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
  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Sl No. </span>,
      dataIndex: 'grade_name',
      key: 'name',
      render: (text, row, index) => <span>{index + 1}.</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Grade </span>,
      dataIndex: 'grade_name',
      key: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Subject </span>,
      dataIndex: 'subject_name',
      key: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Rating Title </span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => <span>{JSON.parse(row?.scheme_criteria)?.name}</span>,
    },

    {
      title: <span className='th-white th-fw-700 '>Actions</span>,
      key: 'actions',
      align: 'center',
      render: (record) => (
        <Space size=''>
          <Tag
            icon={<EditFilled />}
            color='processing'
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setEditID(record.id);
              handleEditScheme(record);
            }}
          >
            Edit
          </Tag>
          <Popconfirm
            placement='bottomRight'
            title={'Are you sure you want to delete this item?'}
            onConfirm={() => handleDeleteScheme(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Tag icon={<DeleteOutlined />} color='volcano' style={{ cursor: 'pointer' }}>
              Delete
            </Tag>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreateRating = () => {
    const isQuestionsNull = currentRating?.questions?.filter(function (el) {
      return el?.title?.trim() == '';
    });
    const isRatingsNull = currentRating?.levels?.filter(function (el) {
      return el?.marks == '' || el?.name?.trim() == '';
    });

    if (!currentRating?.title?.trim().length) {
      message.error('Please fill the Ratings title');
      return;
    }
    if (isQuestionsNull?.length > 0) {
      message.error('Questions can not be empty');
      return;
    }
    if (isRatingsNull?.length > 0) {
      message.error('Name and marks can not be empty in Ratings');
      return;
    }

    let payload = {
      user_id: activityUserId,
      scheme_criteria: [
        {
          name: currentRating?.title,
          content: currentRating?.questions?.map((item) => ({
            criterion: item?.title,
            levels: currentRating?.levels,
          })),
        },
      ],
    };
    if (editID) {
      payload['scheme_id'] = editID;
    } else {
      payload['subject_id'] = selectedSubject?.value;
      payload['grade_ids'] = selectedGrade.toString();
      payload['subject_name'] = selectedSubject?.children;
    }
    setRequestSent(true);
    if (editID) {
      axios
        .post(`${endpoints.newBlog.updatePublicSpeakingRatingSchemas}`, payload, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((res) => {
          if (res?.data?.status_code == 200) {
            message.success('Rating updated successfully !');
            handleCloseCreateRatingModal();
            fetchPublicSpeakingRatingsList();
            setEditID();
          } else {
            message.error('Update failed. Please try again !');
          }
        })
        .catch((err) => message.error(err?.message))
        .finally(() => {
          setRequestSent(false);
        });
    } else {
      axios
        .post(`${endpoints.newBlog.createPublicSpeakingRatingSchemas}`, payload, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((res) => {
          if (res?.data?.status_code == 200) {
            message.success('Rating created successfully !');
            handleCloseCreateRatingModal();
            fetchPublicSpeakingRatingsList();
          } else if (res?.data?.status_code == 400) {
            message.error(res?.data?.message);
          }
        })
        .catch((err) => message.error(err?.message))
        .finally(() => {
          setRequestSent(false);
        });
    }
  };

  const handleDeleteScheme = (id) => {
    axios
      .delete(`${endpoints.newBlog.deletePublicSpeakingRatingSchemas}${id}/`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          fetchPublicSpeakingRatingsList();
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleEditScheme = (record) => {
    setSelectedGrade(record?.grade_id);
    setSelectedSubject({
      value: record?.subject_id,
      children: record?.subject_name,
    });
    let schemeData = JSON.parse(record?.scheme_criteria);
    var currentData = _.cloneDeep(schemeData);
    console.log({ currentData });
    setCurrentRating({
      title: currentData?.name,
      questions: currentData?.content
        ?.filter((item) => item.criterion !== 'Overall')
        ?.map((item) => ({
          title: item?.criterion,
        })),

      levels: currentData?.content[0]?.levels,
    });
    handleShowCreateRatingModal();
    setTimeout(() => {
      formRef.current.setFieldsValue({
        grade: record?.grade_name,
        subject: record?.subject_name,
      });
    }, 500);
  };

  const fetchGradeList = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`/erp_user/v2/grademapping/`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectList = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.allSubjects}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchPublicSpeakingRatingsList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.publicSpeakingRatingSchemas}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setPublicSpeakingRatingsList(res?.data?.result);
        }
      })
      .catch((err) => message.error(err?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const getActivitySession = () => {
    axiosInstance
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
        if (response?.data?.status_code === 200) {
          setActivityUserId(response?.data?.status_code?.user_id);
        }
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
      });
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Rating') {
              setModuleId(item?.child_id);
            }
          });
        }
      });
    }
    fetchPublicSpeakingRatingsList();
    getActivitySession();
  }, []);
  useEffect(() => {
    fetchGradeList();
  }, [moduleId]);

  return (
    <Layout>
      <div className='row px-2'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item
              href='/blog/wall/central/redirect'
              className='th-grey th-16 th-pointer'
            >
              Activity Management
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => {
                history.goBack();
              }}
              className='th-grey th-16 th-pointer'
            >
              Create rating
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black th-16'>
              Public Speaking Ratings
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 mt-3'>
          <div className='row th-bg-white th-br-5 '>
            <div className='col-12 p-3 text-right'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                className='th-br-8'
                onClick={() => {
                  handleShowCreateRatingModal();
                }}
              >
                Creating New Rating
              </Button>
            </div>
            <div className='col-12'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                }
                pagination={false}
                scroll={{ y: '50vh' }}
                loading={loading}
                columns={columns}
                dataSource={publicSpeakingRatingList}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title='Create Public Speaking Rating'
        centered
        visible={showCreateratingModal}
        footer={null}
        className='th-upload-modal'
        onOk={() => handleCloseCreateRatingModal()}
        onCancel={handleCloseCreateRatingModal}
        width={window.innerWidth < 600 ? '90vw' : '75vw'}
      >
        <div className='row py-3 px-sm-3'>
          <div className='col-12 px-0 px-sm-3 py-2'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-sm-3 px-sm-0'>
                  <div className='mb-2 text-left th-fw-500'>Grade</div>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder={'Select Grade *'}
                      disabled={editID}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleGrade(e);
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-sm-3'>
                  <div className='mb-2 text-left th-fw-500'>Subject</div>
                  <Form.Item name='subject'>
                    <Select
                      placeholder='Select Subject *'
                      showSearch
                      disabled={editID}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div className='col-sm-1 pr-0 th-fw-600 th-black-1'>Title</div>
          <div className='col-sm-11 pl-sm-0'>
            <Input
              placeholder='Please enter Ratings Title *'
              showCount
              maxLength='100'
              value={currentRating?.title}
              onChange={(e) => {
                e.preventDefault();
                setCurrentRating({ ...currentRating, title: e.target.value });
              }}
            />
          </div>
          <div className='col-12 mt-3'>
            <div className='th-fw-600 th-black-1'>Add Questions</div>

            {currentRating?.questions?.map((item, index) => {
              return (
                <div className='row py-2 align-items-center'>
                  <div
                    className={`${
                      currentRating?.questions.length > 1 ? 'col-11' : 'col-12'
                    } px-0`}
                  >
                    <Input
                      onChange={(e) => {
                        e.preventDefault();
                        if (e.target.value.toString().length > 500) {
                          message.error('Title must be less than 500 character');
                        } else {
                          handleChangeQuestions(e.target.value, index);
                        }
                      }}
                      showCount
                      maxLength='500'
                      className='w-100 th-br-5'
                      value={item?.title}
                      placeholder='Enter Question Title*'
                    />
                  </div>

                  {currentRating?.questions?.length > 1 && (
                    // <div className='col-1 text-center'>
                    <div
                      className={`${
                        currentRating?.questions.length > 1
                          ? 'col-1 text-center px-0'
                          : 'd-none'
                      }`}
                    >
                      <CloseCircleOutlined
                        className='th-pointer'
                        onClick={() => handleDeleteQuestions(index)}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className='row'>
              <div className='col-12 text-right'>
                <Button
                  icon={<PlusOutlined />}
                  type='primary'
                  className='th-br-8'
                  onClick={handleAddQuestions}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div className='col-12 mt-3 mb-2'>
            <div className='th-fw-600 th-black-1'>Add Ratings</div>
            {currentRating?.levels?.map((item, index) => {
              return (
                <div className='row py-2 align-items-center'>
                  <div
                    className={`${
                      currentRating?.levels?.length > 1 ? 'col-sm-9' : 'col-sm-10'
                    } px-0 pr-sm-2`}
                  >
                    <Input
                      onChange={(e) => {
                        e.preventDefault();
                        if (e.target.value.toString().length > 100) {
                          message.error('Name must be less than 100 character');
                        } else {
                          handleChangeLevels(e.target.value, index, 'name');
                        }
                      }}
                      className='w-100 th-br-5'
                      value={item?.name}
                      showCount
                      maxLength='100'
                      required
                      placeholder='Enter Name*'
                    />
                  </div>
                  {/* <div className='col-2 pr-0'> */}
                  <div className='col-sm-2 col-6 px-0 pr-sm-0 pt-2 pt-sm-0'>
                    <InputNumber
                      onChange={(e) => {
                        if (e > 99) {
                          message.error('Score must be of 2 digit only');
                        } else {
                          handleChangeLevels(e, index, 'marks');
                        }
                      }}
                      className='w-100 th-br-5'
                      value={item?.marks}
                      placeholder='Enter Marks*'
                      type='number'
                      maxLength={3}
                    />
                  </div>
                  {currentRating?.levels?.length > 1 && (
                    <div
                      className={`${
                        currentRating?.levels?.length > 1 ? 'col-1 text-center' : 'd-none'
                      }`}
                    >
                      <CloseCircleOutlined
                        className='th-pointer'
                        onClick={() => handleDeleteRatings(index)}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className='row'>
              <div className='col-12 text-right'>
                <Button
                  icon={<PlusOutlined />}
                  type='primary'
                  className='th-br-8 w-sm-20'
                  onClick={handleAddRatings}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          {/* <div className='col-sm-1 pr-0 th-fw-600 th-black-1'>Overall</div>
          <div className='col-sm-11 pl-sm-0'>
            <Input
              placeholder='Please enter Overall remarks*'
              showCount
              maxLength='100'
              value={currentRating?.overall}
              onChange={(e) => {
                e.preventDefault();
                setCurrentRating({ ...currentRating, overall: e.target.value });
              }}
            />
          </div> */}
          <div className='row mt-3'>
            <div className='col-12'>
              <Button
                type='primary'
                disabled={requestSent}
                className='th-br-8'
                onClick={handleCreateRating}
              >
                {editID ? 'Update' : 'Create'} Rating
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default PublicSpeakingRatings;
