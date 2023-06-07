import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import {
  Avatar,
  Divider,
  Table,
  Drawer,
  Tabs,
  Collapse,
  Button,
  message,
  Empty,
  Modal,
  Input,
  Space,
} from 'antd';
import moment from 'moment';
import { groupBy } from 'lodash';
import {
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileDoneOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import HomeworkAssigned from 'v2/Assets/images/hwassign.png';
import HomeworkSubmit from 'v2/Assets/images/hwsubmit.png';
import HomeworkEvaluate from 'v2/Assets/images/task.png';
import './styles.scss';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axiosInstance from 'config/axios';
import {
  fetchCoordinateTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
  setTeacherUserIDCoord,
  setSelectedCoFilters,
  resetSelectedCoFilters,
  fetchTeacherHomeworkDetailsById,
} from '../../../redux/actions';
import { Typography, IconButton, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Attachment from 'containers/homework/teacher-homework/attachment';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import './attachment.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.scss';
import OnlineSub from 'assets/images/online.png';
import Highlighter from 'react-highlight-words';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const SubmissionData = withRouter(
  ({
    getCoordinateTeacherHomeworkDetails,
    onSetSelectedFilters,
    onResetSelectedFilters,
    selectedFilters,
    homeworkCols,
    homeworkRows,
    fetchingTeacherHomework,
    onSetSelectedHomework,
    evaluatedStudents,
    unevaluatedStudents,
    submittedStudents,
    unSubmittedStudents,
    fetchingStudentLists,
    fetchStudentLists,
    history,
    selectedTeacherByCoordinatorToCreateHw,
    setFirstTeacherUserIdOnloadCordinatorHomewok,
    absentList,
    getHomeworkDetailsById,
    selectedHomeworkDetails,
    ...props
  }) => {
    const [segment, setSegment] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [collapse, setCollapse] = useState();
    const selectedAcademicYear = useSelector(
      (state) => state.commonFilterReducer?.selectedYear
    );
    const selectedBranch = useSelector(
      (state) => state.commonFilterReducer?.selectedBranch
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkEdit, setCheckEdit] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const { setAlert } = useContext(AlertNotificationContext);
    const attachmentsRef = useRef(null);

    const handleOk = () => {
      axiosInstance
        .delete(
          `${endpoints.homework.hwDelete}${selectedHomeworkDetails?.id}/hw-questions/`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            message.success(result.data?.message);
            setIsModalOpen(false);
            let closeDraw = props?.onCloseDrawer();
          } else {
            message.error(result.data?.message);
          }
        })
        .catch((error) => {
          message.error('error1');
        });
    };

    var todayDate = moment();
    var yesterdayDate = moment().subtract(1, 'day');

    let IsToday = false;
    let Isyesterday = false;
    let Isafter = false;

    const checkValid = () => {
      IsToday = moment(selectedHomeworkDetails?.date).isSame(todayDate, 'day');
      Isyesterday = moment(selectedHomeworkDetails?.date).isSame(yesterdayDate, 'day');
      Isafter = moment(selectedHomeworkDetails?.date).isAfter(todayDate, 'day');

      if (IsToday) {
        setCheckEdit(true);
      } else if (Isyesterday) {
        setCheckEdit(true);
      } else if (Isafter) {
        setCheckEdit(true);
      } else {
        setCheckEdit(false);
      }
    };

    useEffect(() => {
      checkValid();
    }, [selectedHomeworkDetails]);

    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const scrollableContainer = createRef();
    const getTitle = () => {
      return (
        <div>
          {segment == 1
            ? `Select All (${unSubmittedStudents?.length})`
            : segment == 2
            ? `Select All (${submittedStudents?.length})`
            : segment == 3
            ? `Select All (${absentList?.length})`
            : segment == 4
            ? `Select All (${evaluatedStudents?.length})`
            : segment == 5
            ? `Select All (${unevaluatedStudents?.length})`
            : ''}
        </div>
      );
    };

    let submitdata = props?.submitData;
    useEffect(() => {
      if (submitdata?.tab == 'not-submitted') {
        setSegment('1');
      }
      if (submitdata?.tab == 'evaluated') {
        setSegment('4');
      }
      if (submitdata?.tab == 'submitted') {
        setSegment('2');
      }
    }, [props?.submitData]);

    // search start

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            // onKeyDown={(e) => e.stopPropagation()}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size='small'
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size='small'
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1890ff' : 'black',
            fontSize: '20px',
          }}
        />
      ),
      className: 'filterSearch',
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
    // searchh end
    const columns = [
      {
        title: getTitle(),
        dataIndex: 'first_name',
        key: 'user_id',
      },
      {
        title: 'Search User',
        align: 'right',
        width: '30%',
        key: 'icon',
        ...getColumnSearchProps('first_name'),
        render: (text, row) => (
          <>
            {row?.hw_submission_mode == 'Online Submission' ? (
              <span
                onClick={(e) => handleSubView(row)}
                className='d-flex justify-content-between th-pointer'
              >
                <img
                  src={OnlineSub}
                  style={{ height: '30px', width: '30px', marginTop: '5px' }}
                />
                <div
                  className='th-13 p-2 th-br-5'
                  style={{ border: '1px solid #d1d1d1' }}
                >
                  View
                </div>
              </span>
            ) : (
              ''
            )}
          </>
        ),
      },
    ];

    const submittedColumns = [
      {
        title: getTitle(),
        dataIndex: 'first_name',
        key: 'user_id',
      },
      {
        title: '',
        align: 'left',
        width: '30%',
        render: (text, row) => (
          <>
            <div>
              {row?.hw_status == '3' && (
                <div className='th-pointer px-2 mr-2'>
                  <FileDoneOutlined
                    title='Evaluated'
                    style={{ fontSize: '20px', color: '#1b4ccb' }}
                  />
                </div>
              )}

              {row?.hw_status == '2' && (
                <div className='th-pointer px-2 mr-2'>
                  <FileTextOutlined
                    title='Unevaluated'
                    style={{ fontSize: '20px', color: '#ff0000cf' }}
                  />
                </div>
              )}
            </div>
          </>
        ),
      },
      {
        title: 'Search User',
        align: 'right',
        width: '30%',
        key: 'icon',
        ...getColumnSearchProps('first_name'),
        render: (text, row) => (
          <div
            className='d-flex justify-content-space-between my-0 py-0'
            style={{ float: 'right' }}
          >
            <div className=''>
              {row?.hw_submission_mode == 'Online Submission' && (
                <span onClick={(e) => handleSubView(row)} className=' th-pointer'>
                  <div
                    className='th-13 px-2 th-br-5'
                    style={{ border: '1px solid #d1d1d1' }}
                  >
                    <img
                      src={OnlineSub}
                      style={{ height: '15px', width: '15px', marginRight: '5px' }}
                    />{' '}
                    View
                  </div>
                </span>
              )}
            </div>
          </div>
        ),
      },
    ];

    useEffect(() => {
      if (props?.submitData?.hw_data?.data?.hw_id) {
        getHomeworkDetailsById(props?.submitData?.hw_data?.data?.hw_id);
      }
    }, [props?.submitData?.hw_data?.data?.hw_id]);

    const handleSegment = (e) => {
      setSegment(e);
      setSelectedRowKeys([]);
    };

    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const openCollapse = (key) => {
      setCollapse(key);
    };

    const handleScroll = (dir) => {
      if (dir === 'left') {
        attachmentsRef.current.scrollLeft -= 150;
      } else {
        attachmentsRef.current.scrollLeft += 150;
      }
    };

    const handleUnSubmittedStd = () => {
      if (selectedRowKeys.length > 0) {
        axiosInstance
          .put(
            `academic/${props?.submitData?.hw_data?.data?.hw_id}/homework-unsubmitted-submitted/`,
            selectedRowKeys
          )
          .then((result) => {
            // message.success(result.data.message);
            setSelectedRowKeys([]);
            setAlert('success', result.data.message);
            fetchStudentLists(
              props?.submitData?.hw_data?.data?.hw_id,
              props?.submitData?.hw_data?.subject_id,
              props?.submitData?.props?.sectionMapping,
              props?.submitData?.props?.teacherid,
              props?.submitData?.hw_data?.date
            );
          })
          .catch((error) => {
            setAlert('error', 'something went wrong');
          });
      } else {
        setAlert('error', 'Please Select Users');
      }
    };

    const subToEvalReq = {
      user_id: selectedRowKeys,
      is_evaluated_to_submitted: false,
    };
    const handleSubmittedEval = (student_homework_id, is_evaluated_to_submitted) => {
      if (selectedRowKeys.length > 0) {
        axiosInstance
          .put(
            `academic/${props?.submitData?.hw_data?.data?.hw_id}/homework-submitted-evaluated/`,
            {
              student_homework_id,
              is_evaluated_to_submitted,
            }
          )
          .then((result) => {
            // message.success(result.data.message);
            setSelectedRowKeys([]);
            setAlert('success', result.data.message);
            fetchStudentLists(
              props?.submitData?.hw_data?.data?.hw_id,
              props?.submitData?.hw_data?.subject_id,
              props?.submitData?.props?.sectionMapping,
              props?.submitData?.props?.teacherid,
              props?.submitData?.hw_data?.date
            );
          })
          .catch((error) => {
            setAlert('error', 'something went wrong');
          });
      } else {
        setAlert('error', 'Please Select Users');
      }
    };

    let getDataStudenteval = [];
    let allDataeval = [];
    let temPayloadeval = [];
    const handleEvaltoUns = () => {
      if (selectedRowKeys.length > 0) {
        let studentData = selectedRowKeys?.map((item) => {
          getDataStudenteval = evaluatedStudents.filter(
            (each) => item == each?.student_homework_id
          );
          allData.push(getDataStudenteval[0]);
        });
        let functemp = allData?.map((item) => {
          temPayloadeval.push({
            student_homework_id: item?.student_homework_id,
            hw_submission_mode: item?.hw_submission_mode,
          });
        });
        axiosInstance
          .put(endpoints.homework.submitToUnsubmit, temPayloadeval)
          .then((result) => {
            // message.success(result.data.message);
            setAlert('success', result.data.message);
            fetchStudentLists(
              props?.submitData?.hw_data?.data?.hw_id,
              props?.submitData?.hw_data?.subject_id,
              props?.submitData?.props?.sectionMapping,
              props?.submitData?.props?.teacherid,
              props?.submitData?.hw_data?.date
            );
            getDataStudenteval = [];
            allDataeval = [];
            temPayloadeval = [];
          })
          .catch((error) => {
            setAlert('error', 'something went wrong');
            getDataStudenteval = [];
            allDataeval = [];
            temPayloadeval = [];
          });
      } else {
        setAlert('error', 'Please Select Users');
      }
    };

    let getDataStudent = [];
    let allData = [];
    let temPayload = [];
    const handleSubmittedStd = () => {
      if (selectedRowKeys.length > 0) {
        let studentData = selectedRowKeys?.map((item) => {
          getDataStudent = submittedStudents.filter(
            (each) => item == each?.student_homework_id
          );
          allData.push(getDataStudent[0]);
        });
        let functemp = allData?.map((item) => {
          temPayload.push({
            student_homework_id: item?.student_homework_id,
            hw_submission_mode: item?.hw_submission_mode,
          });
        });
        axiosInstance
          .put(endpoints.homework.submitToUnsubmit, temPayload)
          .then((result) => {
            // message.success(result.data.message);
            setAlert('success', result.data.message);
            fetchStudentLists(
              props?.submitData?.hw_data?.data?.hw_id,
              props?.submitData?.hw_data?.subject_id,
              props?.submitData?.props?.sectionMapping,
              props?.submitData?.props?.teacherid,
              props?.submitData?.hw_data?.date
            );
            getDataStudent = [];
            allData = [];
            temPayload = [];
          })
          .catch((error) => {
            setAlert('error', 'something went wrong');
            getDataStudent = [];
            allData = [];
            temPayload = [];
          });
      } else {
        setAlert('error', 'Please Select Users');
      }
    };

    const handleSubView = (row) => {
      let arr = props?.setViewHomework({
        studentHomeworkId: row?.student_homework_id,
        date: props?.submitData?.hw_data?.date,
        subjectName: props?.submitData?.hw_data?.subject_name,
      });
      let changeac = props?.setActiveView(true);
      let closedrawer = props?.onCloseDrawer();
    };

    let viewHomework = {
      hw_data: props?.submitData?.hw_data,
      filterData: {
        sectionId: props?.submitData?.props?.sectionId,
        sectionMapping: props?.submitData?.props?.sectionMapping,
        teacherid: props?.submitData?.props?.teacherid,
      },
    };

    const handleEdit = () => {
      history.push({
        pathname: `/homework/addhomework/${props?.submitData?.hw_data?.date}/${selectedAcademicYear?.id}/${props?.submitData?.hw_data?.branch}/${props?.submitData?.hw_data?.grade}/${props?.submitData?.hw_data?.subject_name}/${props?.submitData?.hw_data?.subject_id}/${props?.submitData?.props?.teacherid}`,
        state: { isEdit: true, viewHomework: viewHomework },
      });
    };

    const handleScrolleachques = (index, dir) => {
      const ele = document.getElementById(`homework_student_question_container_${index}`);
      if (dir === 'left') {
        ele.scrollLeft -= 150;
      } else {
        ele.scrollLeft += 150;
      }
    };

    return (
      <div className='submissionDrawer'>
        <div
          className='card w-100 '
          style={{ background: '#F0F2F5', borderRadius: '10px' }}
        >
          <div className='d-flex justify-content-between p-3'>
            <span className='font-weight-bold th-14'>
              {props?.submitData?.hw_data?.subject_name}
            </span>
            <div className='col-md-3 d-flex justify-content-between'>
              <div className='col-md-6 mx-1'>
                {submittedStudents?.length == 0 ? (
                  <div>
                    {checkEdit == true ? (
                      <div className='d-flex'>
                        <EditOutlined
                          className='th-20'
                          style={{ cursor: 'pointer' }}
                          onClick={handleEdit}
                        />
                        <DeleteOutlined
                          className='th-20 mx-3'
                          style={{ cursor: 'pointer' }}
                          onClick={showModal}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className='d-flex justify-content-end col-md-6 p-0'>
                <CloseCircleOutlined
                  className='th-20 mx-2'
                  style={{ cursor: 'pointer', float: 'right' }}
                  onClick={props?.onCloseDrawer}
                />
              </div>
            </div>
          </div>
          <span
            className='th-13 th-fw-600'
            style={{ color: '#A0A0A1', width: '95%', margin: '0 auto' }}
          >
            Homework Details
          </span>
          <div
            className='card'
            style={{ width: '95%', margin: '0 auto', marginBottom: '15px' }}
          >
            <Collapse
              ghost
              expandIconPosition='right'
              activeKey={collapse}
              onChange={openCollapse}
              accordion={true}
            >
              <Panel
                header={
                  collapse == 1 ? (
                    selectedHomeworkDetails?.description == '' ? (
                      <div style={{ width: '300px' }}>
                        <p
                          className='th-12 th-fw-400 text-truncate m-0'
                          style={{ color: '#556778' }}
                        >
                          {selectedHomeworkDetails?.homework_name}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className='th-14 th-fw-600' style={{ color: '#A0A0A1' }}>
                          Instruction
                        </span>
                        <p
                          className='th-14 th-fw-400 '
                          style={{
                            color: '#556778',
                            background: '#F4F9FF',
                            padding: '5px',
                            margin: '0px',
                          }}
                        >
                          {selectedHomeworkDetails?.description}
                        </p>
                      </div>
                    )
                  ) : (
                    <div style={{ width: '300px' }}>
                      <p
                        className='th-12 th-fw-400 text-truncate m-0'
                        style={{ color: '#556778' }}
                      >
                        {selectedHomeworkDetails?.homework_name}
                      </p>
                    </div>
                  )
                }
                key='1'
              >
                <div>
                  <span className='th-14 th-fw-600' style={{ color: '#A0A0A1' }}>
                    Title
                  </span>
                  <p
                    className='th-14 th-fw-400 '
                    style={{ color: '#556778', background: '#F4F9FF', padding: '5px' }}
                  >
                    {selectedHomeworkDetails?.homework_name}
                  </p>
                </div>
                <div>
                  <div className='d-flex justify-content-between'>
                    <span className='th-14 th-fw-600' style={{ color: '#A0A0A1' }}>
                      Due Date
                    </span>
                    <span className='th-14 th-fw-600' style={{ color: '#A0A0A1' }}>
                      Creation Date
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#556778',
                      background: '#F4F9FF',
                      padding: '5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p
                      className='th-14 th-fw-600 m-0'
                      style={{ color: '#556778', background: '#F4F9FF', padding: '5px' }}
                    >
                      {moment(selectedHomeworkDetails?.last_submission_dt).format(
                        'DD-MM-YYYY'
                      )}
                    </p>
                    <p className='th-14 th-fw-600 m-0'>
                      {moment(selectedHomeworkDetails?.date).format('DD-MM-YYYY')}
                    </p>
                  </div>
                </div>
                <div ref={scrollableContainer}>
                  <span className='th-14 th-fw-600' style={{ color: '#A0A0A1' }}>
                    Question
                  </span>

                  {/* question attachment */}
                  <div className='view-homework-container-coordinator viewquestioncon'>
                    {selectedHomeworkDetails &&
                      selectedHomeworkDetails?.hw_questions?.map((question, index) => (
                        <div
                          className='homework-question-container-coordinator'
                          style={{ margin: '0', width: '100%' }}
                          key={`homework_student_question_${index}`}
                        >
                          <div
                            className='homework-question'
                            style={{ border: '0px', width: '100%' }}
                          >
                            <div
                              className='th-12 th-fw-600 '
                              style={{
                                color: '#556778',
                                background: '#F4F9FF',
                                padding: '5px',
                              }}
                            >
                              {question.question}
                            </div>
                          </div>

                          {/* attachment */}

                          {question?.question_files?.length > 0 && (
                            <Grid item xs={12} className='attachments-grid'>
                              <div className='attachments-list-outer-container'>
                                <div className='prev-btn'>
                                  {question?.question_files?.length > 0 && (
                                    <IconButton onClick={() => handleScroll('left')}>
                                      <ArrowBackIosIcon />
                                    </IconButton>
                                  )}
                                </div>
                                <SimpleReactLightbox>
                                  <div
                                    className='attachments-list'
                                    ref={attachmentsRef}
                                    onScroll={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {question?.question_files.map((url, pdfindex) => {
                                      let cindex = 0;
                                      let qfiles = question?.question_files;
                                      qfiles.forEach((item, index) => {
                                        if (index < pdfindex) {
                                          if (typeof item == 'string') {
                                            cindex = cindex + 1;
                                          } else {
                                            cindex = Object.keys(item).length + cindex;
                                          }
                                        }
                                      });
                                      if (typeof url == 'object') {
                                        return Object.values(url).map((item, i) => {
                                          let imageIndex = Object.keys(url)[i];
                                          return (
                                            <div
                                              className='attachment'
                                              style={{ width: '200px', height: '200px' }}
                                            >
                                              <Attachment
                                                key={`homework_student_question_attachment_${i}`}
                                                fileUrl={item}
                                                fileName={`Attachment-${i + 1 + cindex}`}
                                                urlPrefix={
                                                  item.includes('/lesson_plan_file/')
                                                    ? `${endpoints.homework.resourcesFiles}`
                                                    : `${endpoints.discussionForum.s3}/homework`
                                                }
                                                index={i + cindex}
                                                actions={
                                                  item.includes('/lesson_plan_file/')
                                                    ? ['download']
                                                    : ['preview', 'download']
                                                }
                                                ispdf={
                                                  item.includes('/lesson_plan_file/')
                                                    ? false
                                                    : true
                                                }
                                              />
                                            </div>
                                          );
                                        });
                                      } else
                                        return (
                                          <div
                                            className='attachment'
                                            style={{ width: '200px', height: '200px' }}
                                          >
                                            <Attachment
                                              key={`homework_student_question_attachment_${pdfindex}`}
                                              fileUrl={url}
                                              fileName={`Attachment-${1 + cindex}`}
                                              urlPrefix={
                                                url.includes('/lesson_plan_file/')
                                                  ? `${endpoints.homework.resourcesFiles}`
                                                  : `${endpoints.discussionForum.s3}/homework`
                                              }
                                              index={cindex}
                                              actions={
                                                url.includes('/lesson_plan_file/') &&
                                                !url.includes('png')
                                                  ? ['download']
                                                  : ['preview', 'download']
                                              }
                                              ispdf={
                                                url.includes('/lesson_plan_file/')
                                                  ? false
                                                  : true
                                              }
                                            />
                                          </div>
                                        );
                                    })}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        visibility: 'hidden',
                                      }}
                                    >
                                      <SRLWrapper>
                                        {question?.question_files.map((url, i) => {
                                          if (typeof url == 'object') {
                                            return Object.values(url).map((item, i) => {
                                              return (
                                                <img
                                                  src={
                                                    item.includes('/lesson_plan_file/')
                                                      ? `${endpoints.homework.resourcesFiles}/${item}`
                                                      : `${endpoints.discussionForum.s3}/homework/${item}`
                                                  }
                                                  onError={(e) => {
                                                    e.target.src = placeholder;
                                                  }}
                                                  alt={`Attachment-${i + 1}`}
                                                />
                                              );
                                            });
                                          } else
                                            return (
                                              <img
                                                src={
                                                  url.includes('/lesson_plan_file/')
                                                    ? `${endpoints.homework.resourcesFiles}/${url}`
                                                    : `${endpoints.discussionForum.s3}/homework/${url}`
                                                }
                                                onError={(e) => {
                                                  e.target.src = placeholder;
                                                }}
                                                alt={`Attachment-${i + 1}`}
                                              />
                                            );
                                        })}
                                      </SRLWrapper>
                                    </div>
                                  </div>
                                </SimpleReactLightbox>
                                <div className='next-btn'>
                                  {question?.question_files?.length > 0 && (
                                    <IconButton onClick={() => handleScroll('right')}>
                                      <ArrowForwardIosIcon color='primary' />
                                    </IconButton>
                                  )}
                                </div>
                              </div>
                            </Grid>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <Tabs
          onChange={handleSegment}
          activeKey={segment}
          style={{ fontSize: '10px', fontWeight: '600' }}
          className='userTableSub'
        >
          <TabPane
            tab={`Not Submitted(${
              unSubmittedStudents?.length ? unSubmittedStudents?.length : '0'
            })`}
            key={'1'}
            style={{ color: '#F1DA89' }}
          >
            <div style={{ width: '100%' }}>
              {unSubmittedStudents?.length > 0 ? (
                <Table
                  rowSelection={{ ...rowSelection }}
                  columns={columns}
                  dataSource={unSubmittedStudents}
                  rowKey={(record) => record?.user_id}
                  className=' th-homework-table-head-bg '
                  pagination={false}
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                />
              ) : (
                <div className='mt-5'>
                  {' '}
                  <Empty />{' '}
                </div>
              )}
            </div>
          </TabPane>
          <TabPane
            tab={`Submitted(${
              submittedStudents?.length ? submittedStudents?.length : '0'
            })`}
            key={'2'}
          >
            <div style={{ width: '100%' }}>
              {submittedStudents?.length > 0 ? (
                <Table
                  rowSelection={{ ...rowSelection }}
                  columns={submittedColumns}
                  dataSource={submittedStudents}
                  rowKey={(record) => record?.student_homework_id}
                  pagination={false}
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  className=' th-homework-table-head-bg '
                />
              ) : (
                <div className='mt-5'>
                  {' '}
                  <Empty />{' '}
                </div>
              )}
            </div>
          </TabPane>
          <TabPane
            tab={`Absent(${absentList?.length ? absentList?.length : '0'})`}
            key={'3'}
          >
            <div style={{ width: '100%' }}>
              {absentList?.length > 0 ? (
                <Table
                  rowSelection={{ ...rowSelection }}
                  columns={columns}
                  dataSource={absentList}
                  rowKey={(record) => record?.user_id}
                  pagination={false}
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  className=' th-homework-table-head-bg '
                />
              ) : (
                <div className='mt-5'>
                  {' '}
                  <Empty />{' '}
                </div>
              )}
            </div>
          </TabPane>
          <TabPane
            tab={`Evaluated(${
              evaluatedStudents?.length ? evaluatedStudents?.length : '0'
            })`}
            key={'4'}
          >
            <div style={{ width: '100%' }}>
              {evaluatedStudents?.length > 0 ? (
                // <Table
                //     rowSelection={{ ...rowSelection }}
                //     columns={columns} dataSource={evaluatedStudents}
                //     rowKey={(record) => record?.user_id}
                //     pagination={false}
                //     rowClassName={(record, index) =>
                //         `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                //     }
                //     className=' th-homework-table-head-bg '
                // />

                <Table
                  rowSelection={{ ...rowSelection }}
                  columns={columns}
                  dataSource={evaluatedStudents}
                  rowKey={(record) => record?.student_homework_id}
                  pagination={false}
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  className=' th-homework-table-head-bg '
                />
              ) : (
                <div className='mt-5'>
                  {' '}
                  <Empty />{' '}
                </div>
              )}
            </div>
          </TabPane>
          <TabPane
            tab={`Un-Evaluated(${
              unevaluatedStudents?.length ? unevaluatedStudents?.length : '0'
            })`}
            key={'5'}
          >
            <div style={{ width: '100%' }}>
              {unevaluatedStudents?.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={unevaluatedStudents}
                  rowKey={(record) => record?.user_id}
                  rowClassName={(record, index) =>
                    `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                  }
                  pagination={false}
                  className=' th-homework-table-head-bg '
                />
              ) : (
                <div className='mt-5'>
                  {' '}
                  <Empty />{' '}
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
        {segment == 1 ? (
          <>
            {unSubmittedStudents?.length > 0 && (
              <div
                className='card th-br-4'
                style={{ position: 'absolute', bottom: '0', width: '30%' }}
              >
                <Button
                  onClick={handleUnSubmittedStd}
                  style={{ color: '#50A167', borderColor: '#50A167' }}
                >
                  Move To submitted
                </Button>
              </div>
            )}
          </>
        ) : segment == 2 ? (
          <>
            {submittedStudents?.length > 0 && (
              <>
                <div
                  className='card th-br-4'
                  style={{ position: 'absolute', bottom: '0', width: '30%' }}
                >
                  <Button
                    onClick={handleSubmittedStd}
                    style={{ color: '#50A167', borderColor: '#50A167' }}
                  >
                    Move to not Submitted
                  </Button>
                </div>
                {unevaluatedStudents?.length > 0 && (
                  <div
                    className='card th-br-4'
                    style={{ position: 'absolute', bottom: '0', right: 0, width: '30%' }}
                  >
                    <Button
                      onClick={() => handleSubmittedEval(selectedRowKeys, false)}
                      style={{ color: '#50A167', borderColor: '#50A167' }}
                    >
                      Move To Evaluated
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        ) : segment == 3 ? (
          <>
            {absentList?.length > 0 ? (
              <div
                className='card th-br-4'
                style={{ position: 'absolute', bottom: '0', width: '30%' }}
              >
                <Button
                  onClick={handleUnSubmittedStd}
                  style={{ color: '#50A167', borderColor: '#50A167' }}
                >
                  Move To submitted
                </Button>
              </div>
            ) : (
              ''
            )}
          </>
        ) : segment == 4 ? (
          <>
            {evaluatedStudents?.length > 0 && (
              <>
                <div
                  className='card th-br-4'
                  style={{ position: 'absolute', bottom: '0', width: '30%' }}
                >
                  <Button
                    onClick={() => handleSubmittedEval(selectedRowKeys, true)}
                    style={{ color: '#50A167', borderColor: '#50A167' }}
                  >
                    Move to Unevaluated
                  </Button>
                </div>
                <div
                  className='card th-br-4'
                  style={{ position: 'absolute', right: 0, bottom: '0', width: '30%' }}
                >
                  <Button
                    onClick={handleEvaltoUns}
                    style={{ color: '#50A167', borderColor: '#50A167' }}
                  >
                    Move to not submitted
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          ''
        )}
        <Modal
          title='Delete Homework'
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p style={{ padding: '25px' }}>{`Confirm Delete Homework ?`}</p>
        </Modal>
      </div>
    );
  }
);

const mapStateToProps = (state) => ({
  selectedFilters: state.teacherHomework.selectedCoFilters,
  homeworkCols: state.teacherHomework.homeworkCols,
  homeworkRows: state.teacherHomework.homeworkRows,
  fetchingTeacherHomework: state.teacherHomework.fetchingTeacherHomework,
  evaluatedStudents: state.teacherHomework.evaluatedStudents,
  submittedStudents: state.teacherHomework.submittedStudents,
  unSubmittedStudents: state.teacherHomework.unSubmittedStudents,
  unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
  fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
  selectedTeacherByCoordinatorToCreateHw:
    state.teacherHomework.selectedTeacherByCoordinatorToCreateHw,
  absentList: state.teacherHomework.absentList,
  selectedHomeworkDetails: state.teacherHomework.selectedHomeworkDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getCoordinateTeacherHomeworkDetails: (
    teacherModuleId,
    acadYear,
    branch,
    grade,
    sectionId,
    section,
    startDate,
    endDate,
    selectedTeacherUser_id
  ) => {
    dispatch(
      fetchCoordinateTeacherHomeworkDetails(
        teacherModuleId,
        acadYear,
        branch,
        grade,
        sectionId,
        section,
        startDate,
        endDate,
        selectedTeacherUser_id
      )
    );
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id, subjectId, sectionId, selectedTeacherUser_id, date) => {
    dispatch(
      fetchStudentsListForTeacherHomework(
        id,
        subjectId,
        sectionId,
        selectedTeacherUser_id,
        date
      )
    );
  },
  setFirstTeacherUserIdOnloadCordinatorHomewok: (selectedTeacherUser_id) => {
    return dispatch(setTeacherUserIDCoord(selectedTeacherUser_id));
  },
  onSetSelectedFilters: (data) => {
    dispatch(setSelectedCoFilters(data));
  },
  onResetSelectedFilters: () => {
    dispatch(resetSelectedCoFilters());
  },
  getHomeworkDetailsById: (id) => {
    dispatch(fetchTeacherHomeworkDetailsById(id));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SubmissionData);
