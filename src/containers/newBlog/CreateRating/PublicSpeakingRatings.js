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
} from 'antd';
import {
  DeleteFilled,
  PlusOutlined,
  SnippetsOutlined,
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
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [publicSpeakingRatingList, setPublivSpeakingRatingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [showCreateratingModal, setShowCreateratingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState({
    title: '',
    subject: '',
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
  //   const fetchPublicSpeakingRatingList =() => {
  //     axios
  //   }

  const handleShowCreateRatingModal = () => {
    setShowCreateratingModal(true);
  };
  const handleCloseCreateRatingModal = () => {
    setShowCreateratingModal(false);
    formRef.current.setFieldsValue({
      grade: [],
      subject: null,
    });
    setSelectedSubject(null);
    setSelectedGrades(null);
    setSubjectData([]);
    setCurrentRating({
      title: '',
      subject: '',
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
    if (e.length > 0) {
      setSelectedGrades(e.join(','));
      fetchSubjectList({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: e.join(','),
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
      title: <span className='th-white th-fw-700 '>Activity Type Name </span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Sub Activity Name </span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => <p>{row?.sub_type ? row?.sub_type : <b>NA</b>}</p>,
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Title</span>,
      dataIndex: 'criteria_title',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => (
        <p>{row?.criteria_title ? row?.criteria_title : <b>NA</b>}</p>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Name</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item.name ? item?.name : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Rating</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <>
            <p>
              {row.va_rating[0]
                ? row.va_rating[0].map((item) => <p>{item?.name}</p>)
                : row.grading_scheme.map((item) => <p>{item?.rating}</p>)}
            </p>
          </>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Score</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item?.score ? item?.score : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <div style={{ display: 'flex' }}>
            {row?.is_editable ? (
              <>
                <Tag
                  icon={<EditFilled className='th-14' />}
                  color={'geekblue'}
                  className='th-br-5 th-pointer py-1 px-1'
                  //   onClick={(e) => handleEdit(e, row)}
                >
                  Edit
                </Tag>
                <Popconfirm
                  title='Delete the Remarks ?'
                  description='Are you sure to delete this remarks?'
                  //   onConfirm={() => handleDelete(row)}
                  onOpenChange={() => console.log('open change')}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Tag
                    icon={<DeleteFilled className='="th-14' />}
                    color={'red'}
                    className='th-br-5 th-pointer py-1'
                  >
                    Delete
                  </Tag>
                </Popconfirm>
              </>
            ) : (
              <Tag
                color={'magenta'}
                icon={<StopOutlined className='="th-14' />}
                className='th-br-5 py-1'
              >
                Permission Denied
              </Tag>
            )}
          </div>
        );
      },
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
    // if (isQuestionsNull?.length > 0) {
    //   message.error('Questions can not be empty');
    //   return;
    // }
    // if (isRatingsNull?.length > 0) {
    //   message.error('Name and marks can not be empty in Ratings');
    //   return;
    // }
    let payload = {
      subject_id: selectedSubject?.value,
      user_id: user_level,
      grade_ids: selectedGrades,
      subject_name: selectedSubject?.children,
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
    console.log('Payload', payload, currentRating);
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
              {loading ? (
                <div
                  className='d-flex align-items-center justify-content-center w-100 text-center'
                  style={{ height: '30vh' }}
                >
                  <Spin tip='Loading' />
                </div>
              ) : publicSpeakingRatingList?.length > 0 ? (
                <Table
                  className='th-table'
                  rowClassName={(record, index) =>
                    `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  pagination={false}
                  scroll={{ y: '50vh' }}
                  //   loading={loading}
                  columns={columns}
                  dataSource={publicSpeakingRatingList}
                />
              ) : (
                <div
                  className='row justify-content-center align-item-center py-5'
                  style={{ height: '47 vh' }}
                >
                  <img src={NoDataIcon} />
                </div>
              )}
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
                      mode='multiple'
                      maxTagCount={2}
                      placeholder={'Select Grades *'}
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
          <div className='col-12 mt-3'>
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
          <div className='row mt-2'>
            <div className='col-12'>
              <Button type='primary' className='th-br-8' onClick={handleCreateRating}>
                Create Rating
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </Modal>
    </Layout>
  );
};

export default PublicSpeakingRatings;
