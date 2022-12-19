import React, { useState, useEffect } from 'react';
import '../index.css';
import fileDownload from 'js-file-download';
import {
  ArrowLeftOutlined,
  PaperClipOutlined,
  MoreOutlined,
  CloseOutlined,
  EyeFilled,
  CaretRightOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Spin,
  Button,
  Avatar,
  message,
  Collapse,
  Drawer,
  Popover,
  Popconfirm,
  Divider,
  Tag,
} from 'antd';
import axios from 'v2/config/axios';
import axiosInstance from 'axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import moment from 'moment';
import hwIcon from 'v2/Assets/dashboardIcons/diaryIcons/hwIcon.png';
import { getFileIcon } from 'v2/getFileIcon';
import QuestionCard from 'components/question-card';
import cuid from 'cuid';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import toddlerGroup from '../../../../../assets/images/toddler-group.svg';

const { Panel } = Collapse;
let boardFilterArr = [
  'orchids.letseduvate.com',
  'localhost:3000',
  'dev.olvorchidnaigaon.letseduvate.com',
  'ui-revamp1.letseduvate.com',
  'qa.olvorchidnaigaon.letseduvate.com',
];

const DailyDairyCard = ({ diary, fetchDiaryList, subject, isStudentDiary }) => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const { user_level, user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [homeworkDetails, setHomeworkDetails] = useState(false);
  const [questionList, setQuestionList] = useState([
    {
      id: cuid(),
      question: '',
      attachments: [],
      is_attachment_enable: false,
      max_attachment: 2,
      penTool: false,
    },
  ]);
  const [showTab, setShowTab] = useState(1);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showUpcomingResources, setShowUpcomingResources] = useState(false);
  const [resourcesData, setResourcesData] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [todaysAssessment, setTodaysAssessment] = useState([]);
  const [upcomingAssessment, setUpcomingAssessment] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState([]);
  const history = useHistory();

  const showAssessmentData = (data) => {
    return data.map((item) => (
      <div className='row th-bg-white th-br-6 py-2 th-fw-500 mb-2'>
        <div className='col-6 th-12'>
          Status of Exam :&nbsp;
          <span
            className={`${
              item?.exam_status == 'completed' ? 'th-green' : 'th-primary'
            } text-capitalize`}
          >
            {' '}
            {item?.exam_status}
          </span>
        </div>
        <div className='col-6 text-right th-12'>
          Scheduled At :&nbsp;
          <span className='th-grey'>
            {moment(item?.test_date).format('DD/MM/YYYY hh:mm a')}
          </span>
        </div>
        <div className='col-12 pt-2 text-truncate'>
          <span className='th-fw-600 th-black-1'>Test Name :&nbsp; </span>
          <span className='th-fw-600 th-grey '>{item?.test_name}</span>
        </div>
        {item?.exam_status == 'completed' && user_level == 13 && (
          <div className='col-12 text-right'>
            <div
              className='badge p-2 th-bg-white th-br-6 th-pointer'
              style={{
                border: '1px solid #d9d9d9',
              }}
              onClick={() => {
                setShowTab(3);
                setCurrentAssessment(item);
              }}
            >
              View &gt;
            </div>
          </div>
        )}
      </div>
    ));
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    // setShowHomeworkDrawer(false);
    setShowTab(1);
    setCurrentPeriodId(null);
  };
  const displayHomeworkDetails = () => {
    // setShowHomeworkDrawer(true);
    setShowTab(2);
  };
  const fetchResourcesData = (id) => {
    setLoadingResources(true);
    axiosInstance
      .get(`${endpoints.diaryReport.resources}?lesson_plan_id=${id}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setResourcesData(response?.data?.result);
        }
        setLoadingResources(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingResources(false);
      });
  };
  const handleDownloadAll = (files) => {
    files.map((item) => {
      const fullName = item?.split('_')[item?.split('_').length - 1];

      axios
        .get(`${endpoints.announcementList.s3erp}${item}`, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, fullName);
        });
    });
  };

  const deleteDiary = (id) => {
    axios
      .delete(`${endpoints?.dailyDiary?.updateDelete}${id}/update-delete-dairy/`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          message.success('Diary Deleted Successfully');
          fetchDiaryList();
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const editDiary = (data) => {
    history.push({
      pathname: '/create/diary',
      state: {
        data: data,
        subject,
        isDiaryEdit: true,
      },
    });
  };
  const questionModify = (questions) => {
    let arr = [];
    questions.map((question) => {
      arr.push({
        id: question.homework_id,
        question: question.question,
        attachments: question.question_files,
        is_attachment_enable: question.is_attachment_enable,
        max_attachment: question.max_attachment,
        penTool: question.is_pen_editor_enable,
      });
    });
    return arr;
  };
  const fetchHomeworkDetails = (params = {}) => {
    axios
      .get(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            axios
              .get(`academic/${result?.data?.data[0]?.id}/hw-questions/?hw_status=1`)
              .then((result) => {
                if (result?.data?.status_code == 200) {
                  setHomeworkDetails(result?.data?.data);
                }
              })
              .catch((error) => message.error('error', error?.message));
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  useEffect(() => {
    if (homeworkDetails) {
      setQuestionList(questionModify(homeworkDetails?.hw_questions));
    }
  }, [homeworkDetails]);
  const addNewQuestion = (index) => {
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      {
        id: cuid(),
        question: '',
        attachments: [],
        is_attachment_enable: false,
        max_attachment: 2,
        penTool: false,
      },
      ...prevState.slice(index),
    ]);
  };
  const handleChange = (index, field, value) => {
    const form = questionList[index];
    const modifiedForm = { ...form, [field]: value };
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      modifiedForm,
      ...prevState.slice(index + 1),
    ]);
  };
  const removeQuestion = (index) => {
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };
  const fetchAssessmentData = (params = {}) => {
    axios
      .get(`/academic/diary/assessment/`, {
        params: { ...params },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTodaysAssessment(response?.data?.result?.today_assessment);
          setUpcomingAssessment(response?.data?.result?.upcoming_assessment);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  useEffect(() => {
    if (drawerVisible) {
      fetchHomeworkDetails({
        section_mapping: diary?.section_mapping_id,
        subject: subject?.subject_id,
        date: moment(diary?.created_at).format('YYYY-MM-DD'),
      });
      fetchAssessmentData({
        section_mapping: diary?.section_mapping_id,
        subject_id: subject?.subject_id,
        date: moment(diary?.created_at).format('YYYY-MM-DD'),
      });
    }
  }, [drawerVisible]);
  return (
    <>
      <div
        className={`th-br-6 th-bg-white`}
        style={{ border: '1px solid #d9d9d9', height: 200 }}
      >
        <div
          className={`row th-bg-blue-1 align-items-center py-1`}
          style={{ borderRadius: '6px 6px 0px 0px' }}
        >
          <div className='col-7 pl-2'>
            {isStudentDiary ? (
              <div className='th-fw-600 th-black-2 text-capitalize'>
                {subject?.subject_name}
              </div>
            ) : (
              <>
                <div className='th-fw-600 th-black-2 text-capitalize'>
                  <span>{diary?.grade_name}, </span>
                  <span>Sec {diary?.section_name?.slice(-1)}</span>
                </div>
              </>
            )}
          </div>
          <div className='col-4 text-right px-0 py-1'>
            {/* <span className='th-bg-primary th-10 th-white th-br-6 p-2'>Daily Diary</span> */}
            <Tag color='geekblue' className='th-10 th-br-6'>
              Daily Diary
            </Tag>
          </div>
          {user_id == diary?.teacher_id && (
            <div className='col-1 text-right pl-0'>
              <Popover
                content={
                  <>
                    <div
                      className='row justify-content-between th-pointer'
                      onClick={() => editDiary(diary)}
                    >
                      <span className='th-green th-16'>Edit</span>
                    </div>

                    <Popconfirm
                      placement='bottomRight'
                      title={'Are you sure you want to delete this diary?'}
                      onConfirm={() => deleteDiary(diary?.diary_id)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <div className='row justify-content-between th-pointer pt-2'>
                        <span className='th-red th-16 '>Delete</span>
                      </div>
                    </Popconfirm>
                  </>
                }
                trigger='click'
                placement='bottomRight'
              >
                <MoreOutlined />
              </Popover>
            </div>
          )}
        </div>
        <div className='row' onClick={showDrawer}>
          {!_.isEmpty(diary?.periods_data) ? (
            <div className='col-12 p-1'>
              <div className='row th-bg-grey py-1 px-2'>
                <div className='col-12 px-0 th-10 th-truncate-1'>
                  <span className='th-fw-600 th-black-1'>Topic Name</span>
                  <span className='th-black-2 ml-2 '>
                    ({diary?.periods_data?.map((item) => item?.period_name).toString()})
                  </span>
                </div>
                <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                  {diary?.periods_data
                    ? diary?.periods_data[0].key_concept__topic_name
                    : ''}
                </div>
                <div className='col-12 px-0 th-10'>
                  <div className='th-fw-600 th-black-1'>Key Concept</div>
                </div>
                <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                  {diary?.periods_data
                    ? diary?.periods_data[0].chapter__chapter_name
                    : ''}
                </div>
              </div>
            </div>
          ) : (
            <div className='col-12 p-1'>
              {diary?.hw_description ? (
                <div className='row th-bg-grey pl-1' style={{ height: 85 }}>
                  <div className='col-12 pl-0 th-10'>
                    <div className='th-fw-600 th-black-1'>Title</div>
                  </div>
                  <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                    {diary?.teacher_report?.homework}
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-3 px-0 th-black-1 th-10'>Due Date</div>
                    <div className='col-9 pl-0 th-fw-700'>
                      {moment(diary?.hw_due_date).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row th-bg-grey pl-1' style={{ height: 85 }}>
                  <div className='col-12 px-0 th-10'>
                    <div className='th-fw-600 th-black-1'>Notes</div>
                  </div>
                  <div className='col-12 px-0 th-fw-500 th-black-2 text-truncate th-16'>
                    {diary?.teacher_report?.summary}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className='col-12 p-0 px-1'>
            <div className='row'>
              <div className='col-6 px-1 th-10'>
                <div className='row th-grey'></div>Created By
                <div className='row th-black-2 th-14 th-fw-600'>
                  {diary?.teacher_name}
                </div>
                <div className='row px-0 th-12 th-grey'>
                  {moment(diary?.created_at).format('DD/MM/YYYY HH:mm a')}
                </div>
              </div>

              <div className='col-6 px-2 pb-1'>
                <div className={`row justify-content-end align-items-end h-100`}>
                  <div
                    className={`d-flex align-items-end th-bg-grey th-12 p-0  ${
                      diary?.hw_description ? 'mr-2' : 'mr-1'
                    }`}
                  >
                    <span>
                      <img src={hwIcon} height={30} />
                    </span>
                    {!diary?.hw_description && (
                      <span className='th-red px-2 th-lh-10 py-1 th-fw-500'>
                        Homework <br />
                        not assigned
                      </span>
                    )}
                  </div>

                  <div className='th-diary-badge'>
                    <Badge
                      count={diary?.documents.length > 0 ? diary?.documents.length : 0}
                      color='green'
                      size='small'
                      overflowCount={10}
                    >
                      <Avatar
                        shape='square'
                        size='large'
                        icon={<PaperClipOutlined />}
                        className='th-bg-grey th-black-2'
                      />
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        placement='right'
        className='th-diaryDrawer'
        zIndex={1300}
        title={
          showTab == 1 ? (
            <div className='row pr-1'>
              <div className='col-12 th-bg-yellow-2 th-br-6'>
                <div className='row th-fw-700 th-black-1 py-2'>
                  <div className='col-11 px-0 text-truncate'>
                    Subject : {subject?.subject_name}
                  </div>

                  <div className='col-1 px-0 tex-right'>
                    <CloseOutlined onClick={closeDrawer} />
                  </div>
                </div>
                <div className='row th-fw-600 text-capitalize'>
                  Grade {diary?.grade_name.slice(-1)}
                  {diary?.section_name.slice(-1)}
                </div>
                <div className='row py-1'>
                  <div className='row'>
                    <span className='th-black-2 col-3 px-0'>Created By : </span>{' '}
                    <span className='th-fw-600 col-9 pl-0 text-truncate'>
                      {diary?.teacher_name}
                    </span>
                  </div>
                  <div className='row th-12 th-black-2'>
                    {moment(diary?.created_at).format('DD/MM/YYYY HH:mm a')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='row pr-1'>
              <div className='col-12 th-bg-primary th-white py-2 th-br-6'>
                <div className='row th-fw-700 align-items-center py-1'>
                  <ArrowLeftOutlined
                    className='mr-3'
                    onClick={() => setShowTab(1)}
                    // onClick={() => setShowHomeworkDrawer(false)}
                  />
                  <span> {showTab == 2 ? 'Homework' : 'Assessment'}</span>
                </div>
              </div>
            </div>
          )
        }
        onClose={closeDrawer}
        visible={drawerVisible}
        // visible={true}
        closable={false}
        width={window.innerWidth < 768 ? '90vw' : '450px'}
      >
        {showTab == 1 && (
          <>
            <div className='row th-black-1 th-fw-600 px-2 py-1 th-18'>Today's Topic</div>
            {!_.isEmpty(diary?.periods_data) ? (
              <div
                className='th-bg-grey shadom-sm pb-3 th-br-4'
                style={{
                  border: '2px solid #d9d9d9',
                  maxHeight: '30vh',
                  overflowY: 'auto',
                }}
              >
                {diary?.periods_data?.map((item, index) => (
                  <div className='row px-1 th-diary-collapse th-br-6'>
                    <Collapse
                      activeKey={currentPanel}
                      expandIconPosition='right'
                      bordered={true}
                      showArrow={false}
                      className='th-br-6 my-2 th-bg-grey th-width-100'
                      style={{ border: '1px solid #d9d9d9' }}
                      onChange={() => {
                        if (currentPanel == index) {
                          setCurrentPanel(null);
                        } else {
                          setCurrentPanel(index);
                        }
                      }}
                    >
                      <Panel
                        collapsible={true}
                        showArrow={false}
                        header={
                          <div
                            className='row th-fw-600 align-items-center py-1 th-bg-pink-2 th-width-100'
                            style={{ borderRadius: '6px 6px 0px 0px' }}
                          >
                            <div className='col-12 pr-0 th-18'>{item?.period_name}</div>
                          </div>
                        }
                        key={index}
                      >
                        <div className='row th-pointer py-2'>
                          <>
                            {boardFilterArr.includes(window.location.host) && (
                              <div className='row'>
                                <div className='col-4 pr-0 th-fw-600'>Module :</div>
                                <div className='col-8 pl-0 text-truncate th-grey-1'>
                                  {item?.chapter__lt_module__lt_module_name}
                                </div>
                              </div>
                            )}
                            <div className='row'>
                              <div className='col-4 pr-0 th-fw-600'>Chapter Name :</div>
                              <div className='col-8 pl-0 text-truncate th-grey-1'>
                                {item?.chapter__chapter_name}
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-4 pr-0 th-fw-600'>Key Concept :</div>
                              <div className='col-8 pl-0 text-truncate th-grey-1'>
                                {item?.key_concept__topic_name}
                              </div>
                            </div>
                            <div className='row mt-2 px-2'>
                              <div
                                className='col-12 th-bg-grey'
                                style={{ border: '1px solid #d9d9d9' }}
                              >
                                <div
                                  className='row justify-content-between py-2 th-pointer'
                                  onClick={() => {
                                    setShowResources((prevState) => !prevState);
                                    setShowUpcomingResources(false);
                                    if (currentPeriodId !== item?.id) {
                                      setCurrentPeriodId(item?.id);
                                      fetchResourcesData(item?.id);
                                    }
                                  }}
                                >
                                  <div className='th-fw-600 th-black-2'>Resources</div>
                                  <div>
                                    <CaretRightOutlined
                                      style={{
                                        transform: showResources ? `rotate(90deg)` : null,
                                      }}
                                    />
                                  </div>
                                </div>
                                {showResources && currentPeriodId == item?.id && (
                                  <div className='row'>
                                    {loadingResources ? (
                                      <div className='row justify-content-center my-2'>
                                        <Spin title='Loading...' />
                                      </div>
                                    ) : // !_.isEmpty(resourcesData) ? (
                                    resourcesData?.map((each) => each?.media_file).flat()
                                        .length > 0 ? (
                                      <div
                                        style={{
                                          overflowY: 'scroll',
                                          width: '100%',
                                          maxHeight: '40vh',
                                        }}
                                      >
                                        {resourcesData?.map((files, i) => (
                                          <>
                                            {files?.media_file?.map((each, index) => {
                                              if (
                                                (user_level == 13 &&
                                                  files?.document_type ==
                                                    'Lesson_Plan') ||
                                                (user_level == 13 &&
                                                  files?.document_type ==
                                                    'Teacher_Reading_Material')
                                              ) {
                                              } else {
                                                let fullName = each?.split(
                                                  `${files?.document_type.toLowerCase()}/`
                                                )[1];
                                                let textIndex = fullName
                                                  ?.split('_')
                                                  .indexOf(
                                                    fullName
                                                      .split('_')
                                                      .find((item) => isNaN(item))
                                                  );
                                                let displayName = fullName
                                                  .split('_')
                                                  .slice(textIndex)
                                                  .join('_');
                                                let fileName = displayName
                                                  ? displayName.split('.')
                                                  : null;
                                                let file = fileName
                                                  ? fileName[fileName?.length - 2]
                                                  : '';
                                                let extension = fileName
                                                  ? fileName[fileName?.length - 1]
                                                  : '';
                                                return (
                                                  <div
                                                    className='row mt-2 py-2 align-items-center'
                                                    style={{
                                                      border: '1px solid #d9d9d9',
                                                    }}
                                                  >
                                                    <div className='col-2'>
                                                      <img src={getFileIcon(extension)} />
                                                    </div>
                                                    <div className='col-10 px-0 th-pointer'>
                                                      <a
                                                        onClick={() => {
                                                          openPreview({
                                                            currentAttachmentIndex: 0,
                                                            attachmentsArray: [
                                                              {
                                                                src: `${endpoints.homework.resourcesFiles}/${each}`,

                                                                name: fileName,
                                                                extension:
                                                                  '.' + extension,
                                                              },
                                                            ],
                                                          });
                                                        }}
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                      >
                                                        <div className='row align-items-center'>
                                                          <div className='col-10 px-0'>
                                                            {files.document_type}_{file}
                                                          </div>
                                                          <div className='col-2'>
                                                            <EyeFilled />
                                                          </div>
                                                        </div>
                                                      </a>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            })}
                                          </>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className='row'>
                                        <div className='col-12 text-center py-2'>
                                          {' '}
                                          No Resources Available
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className='th-bg-white shadom-sm align-items-center th-br-4 row p-2'
                style={{
                  border: '2px solid #d9d9d9',
                }}
              >
                No topic added to diary
              </div>
            )}
            <div className='row'>
              <div className='col-12'>
                <Divider className='my-1' />
              </div>
            </div>
            <div className='row th-black-1 th-fw-600 px-2 py-1 th-18'>
              Upcoming Period
            </div>

            {!_.isEmpty(diary?.up_coming_period) ? (
              <div
                className='th-bg-white shadom-sm pb-3 th-br-4'
                style={{ border: '2px solid #d9d9d9' }}
              >
                <div className='row th-fw-600 pt-2'>
                  <div className='col-12 pr-0'>
                    {diary?.up_coming_period?.period_name}
                  </div>
                </div>
                {boardFilterArr.includes(window.location.host) && (
                  <div className='row'>
                    <div className='col-4 pr-0 th-fw-600'>Module :</div>
                    <div className='col-8 pl-0 text-truncate th-grey-1'>
                      {diary?.up_coming_period?.chapter__lt_module__lt_module_name}
                    </div>
                  </div>
                )}
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Chapter Name :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>
                    {diary?.up_coming_period?.chapter__chapter_name}
                  </div>
                </div>
                <div className='row'>
                  <div className='col-4 pr-0 th-fw-600'>Key Concept :</div>
                  <div className='col-8 pl-0 text-truncate th-grey-1'>
                    {diary?.up_coming_period?.key_concept__topic_name}
                  </div>
                </div>
                <div className='row mt-2 px-2'>
                  <div
                    className='col-12 th-bg-grey'
                    style={{ border: '1px solid #d9d9d9' }}
                  >
                    <div
                      className='row justify-content-between py-2 th-pointer'
                      onClick={() => {
                        setShowUpcomingResources((prevState) => !prevState);
                        setShowResources(false);
                        fetchResourcesData(diary?.up_coming_period?.id);
                      }}
                    >
                      <div className='th-fw-600 th-black-2'>Resources</div>
                      <div>
                        <CaretRightOutlined
                          style={{
                            transform: showUpcomingResources ? `rotate(90deg)` : null,
                          }}
                        />
                      </div>
                    </div>
                    {showUpcomingResources && (
                      <div className='row'>
                        {loadingResources ? (
                          <div className='row justify-content-center my-2'>
                            <Spin title='Loading...' />
                          </div>
                        ) : // !_.isEmpty(resourcesData) ? (
                        resourcesData?.map((each) => each?.media_file).flat().length >
                          0 ? (
                          <div
                            style={{
                              overflowY: 'scroll',
                              maxHeight: '40vh',
                              width: '100%',
                            }}
                          >
                            {resourcesData?.map((files, i) => (
                              <>
                                {files?.media_file?.map((each, index) => {
                                  if (
                                    (user_level == 13 &&
                                      files?.document_type == 'Lesson_Plan') ||
                                    (user_level == 13 &&
                                      files?.document_type == 'Teacher_Reading_Material')
                                  ) {
                                  } else {
                                    let fullName = each?.split(
                                      `${files?.document_type.toLowerCase()}/`
                                    )[1];
                                    let textIndex = fullName
                                      ?.split('_')
                                      .indexOf(
                                        fullName.split('_').find((item) => isNaN(item))
                                      );
                                    let displayName = fullName
                                      .split('_')
                                      .slice(textIndex)
                                      .join('_');
                                    let fileName = displayName
                                      ? displayName.split('.')
                                      : null;
                                    let file = fileName
                                      ? fileName[fileName?.length - 2]
                                      : '';
                                    let extension = fileName
                                      ? fileName[fileName?.length - 1]
                                      : '';
                                    return (
                                      <div
                                        className='row mt-2 py-2 align-items-center'
                                        style={{
                                          border: '1px solid #d9d9d9',
                                        }}
                                      >
                                        <div className='col-2'>
                                          <img src={getFileIcon(extension)} />
                                        </div>
                                        <div className='col-10 px-0 th-pointer'>
                                          <a
                                            onClick={() => {
                                              openPreview({
                                                currentAttachmentIndex: 0,
                                                attachmentsArray: [
                                                  {
                                                    src: `${endpoints.homework.resourcesFiles}/${each}`,

                                                    name: fileName,
                                                    extension: '.' + extension,
                                                  },
                                                ],
                                              });
                                            }}
                                            rel='noopener noreferrer'
                                            target='_blank'
                                          >
                                            <div className='row align-items-center'>
                                              <div className='col-10 px-0'>
                                                {files.document_type}_{file}
                                              </div>
                                              <div className='col-2'>
                                                <EyeFilled />
                                              </div>
                                            </div>
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  }
                                })}
                              </>
                            ))}
                          </div>
                        ) : (
                          <div className='row'>
                            <div className='col-12 text-center py-2'>
                              {' '}
                              No Resources Available
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='th-bg-white shadom-sm align-items-center th-br-4 row p-2'
                style={{
                  border: '2px solid #d9d9d9',
                }}
              >
                No Upcoming Period added to diary
              </div>
            )}
            {(todaysAssessment.length > 0 || upcomingAssessment.length > 0) && (
              <div className='row py-2'>
                <div className='row th-black-1 th-fw-600 px-2 py-1 th-18'>Assessment</div>
                <div
                  className='col-12 py-2 px-1 th-bg-grey th-br-6'
                  style={{
                    border: '2px solid #d9d9d9',
                    height: '30vh',
                    overflowY: 'auto',
                  }}
                >
                  {showAssessmentData(todaysAssessment)}
                  {showAssessmentData(upcomingAssessment)}
                </div>
              </div>
            )}
            <div className='row py-2'>
              <div className='row th-black-1 th-fw-600 px-2 py-1 th-18'>Homework</div>
              <div className='col-12 px-1'>
                <div className='row th-bg-blue-2 th-br-6'>
                  {diary?.teacher_report?.homework ? (
                    <>
                      <div className='row pt-1'>
                        <div className='col-12 pr-0 th-black-1'>Title</div>
                        <div className='col-12 px-3 '>
                          <div className='th-bg-white p-1 th-br-6 text-truncate'>
                            {diary?.teacher_report?.homework}
                          </div>
                        </div>
                      </div>
                      <div className='row pt-1'>
                        <div className='col-3 pr-0 th-black-1'>Due Date</div>
                        <div className='col-9 pl-0 th-fw-700'>
                          {moment(diary?.hw_due_date).format('DD/MM/YYYY')}
                        </div>
                      </div>
                      <div class='row py-1 pb-2 justify-content-end'>
                        <div class='col-4 text-center'>
                          <div
                            class='th-bg-primary th-white px-2 py-1 th-br-6 th-pointer'
                            onClick={displayHomeworkDetails}
                          >
                            {' '}
                            View More
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='row p-2'> No Homework Added</div>
                  )}
                </div>
              </div>
            </div>
            <div className='row py-2'>
              <div className='row th-black-1 th-fw-600 px-2 py-1 th-18'>Notes</div>
              <div className='col-12 px-1'>
                <div className='row th-bg-blue-1 th-br-6'>
                  {diary?.teacher_report?.summary ? (
                    <>
                      <div className='row py-1'>
                        <div className='col-3 pr-0 th-black-1'>Description</div>
                        <div className='col-9 pl-0'>{diary?.teacher_report?.summary}</div>
                      </div>
                    </>
                  ) : (
                    <div className='row p-2'> No Notes were added</div>
                  )}
                </div>
              </div>
            </div>

            {diary?.documents?.length > 0 && (
              <>
                <div className='th-16 th-black-2 th-fw-500 row'>
                  <div className='col-6 pl-0 text-left'>Attachments:</div>
                  <div className='col-6 text-right'>
                    <u
                      className='th-pointer th-12'
                      onClick={() => handleDownloadAll(diary?.documents)}
                    >
                      Download All
                    </u>
                  </div>
                </div>
                <div
                  className='row px-3 py-2 th-bg-white th-br-6 flex-column th-black-2 mb-3'
                  style={{ border: '1px solid #d9d9d9' }}
                >
                  <div className='th-16' style={{ height: 120, overflowY: 'auto' }}>
                    {diary?.documents?.map((each) => {
                      const fullName = each?.split('_')[each?.split('_').length - 1];
                      const fileName =
                        fullName.split('.')[fullName?.split('.').length - 2];
                      const extension =
                        fullName.split('.')[fullName?.split('.').length - 1];
                      return (
                        <div
                          className='row mt-2 py-2 align-items-center th-bg-grey'
                          style={{ border: '1px solid #d9d9d9' }}
                        >
                          <div className='col-2'>
                            <img src={getFileIcon(extension)} />
                          </div>
                          <div className='col-10 px-0 th-pointer'>
                            <a
                              onClick={() => {
                                openPreview({
                                  currentAttachmentIndex: 0,
                                  attachmentsArray: [
                                    {
                                      src: `${endpoints.announcementList.s3erp}${each}`,

                                      name: fileName,
                                      extension: '.' + extension,
                                    },
                                  ],
                                });
                              }}
                              rel='noopener noreferrer'
                              target='_blank'
                            >
                              <div className='row align-items-center'>
                                <div className='col-10 px-1'>{fileName}</div>
                                <div className='col-2'>
                                  <EyeFilled />
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {showTab == 2 && (
          <>
            <div className='row px-3 mt-3'>
              <div
                className='col-12 py-2 px-3 th-br-6'
                style={{ border: '1px solid black' }}
              >
                <div className='row py-2'>
                  <div className='th-black-1 th-fw-600 pb-1 col-12 px-0'>Title</div>
                  <div
                    className='th-black-1 col-12 px-1 th-br-6'
                    style={{ border: '1px solid #d9d9d9' }}
                  >
                    {homeworkDetails?.homework_name}
                  </div>
                </div>
                <div className='row py-2'>
                  <div className='th-black-1 th-fw-600 pb-1 col-12 px-0'>
                    Instructions
                  </div>
                  <div
                    className='th-black-1 col-12 px-1 th-br-6'
                    style={{ border: '1px solid #d9d9d9' }}
                  >
                    {homeworkDetails?.description}
                  </div>
                </div>
                <div className='row py-2'>
                  <div className='col-3 px-0 th-black-1 th-fw-600 pb-1'>Due Date</div>
                  <div className='col-9 th-black-1 pl-0 th-fw-700 pb-1'>
                    {moment(diary?.hw_due_date).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className='row py-2'>
                  <div className='th-black-1 th-fw-600 pb-1'>Questions</div>
                  {questionList?.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      isEdit={true}
                      index={index}
                      addNewQuestion={addNewQuestion}
                      handleChange={handleChange}
                      removeQuestion={removeQuestion}
                      sessionYear={selectedAcademicYear?.id}
                      branch={selectedBranch?.branch?.id}
                      grade={diary?.grade_id}
                      subject={subject?.subject_id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {showTab == 3 && (
          <>
            <div className='row pb-2'>
              <div className='col-12 py-2 px-1 th-bg-blue-1 th-br-6'>
                <div className='row th-br-6 py-2 th-fw-500 align-items-center'>
                  <div className='col-6 th-12'>
                    <div className='th-bg-white th-br-6 p-1 th-br-6'>
                      Status of Exam :&nbsp;
                      <span className='th-green text-capitalize'>
                        {currentAssessment?.exam_status}
                      </span>
                    </div>
                  </div>
                  <div className='col-6 text-right th-12'>
                    Scheduled At :&nbsp;
                    <span className='th-grey'>
                      {moment(currentAssessment?.test_date).format('DD/MM/YYYY hh:mm a')}
                    </span>
                  </div>
                  <div className='col-12 pt-2 text-truncate'>
                    <span className='th-fw-600 th-black-1 th-12'>Test Name :&nbsp; </span>
                    <span className='th-fw-600 th-grey '>
                      {currentAssessment?.test_name}
                    </span>
                  </div>
                  <div className='col-12'>
                    <Divider className='my-1' />
                  </div>
                  <div className='col-12 th-black-2 th-12'>
                    Status :{' '}
                    <span className='th-green th-14'>
                      {currentAssessment?.attempted_questions !== null
                        ? 'Attempted'
                        : 'Not Attempted'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {currentAssessment?.attempted_questions !== null && (
              <>
                <div className='row py-2 th-bg-pink th-br-6'>
                  <div className='row flex-column align-items-center py-2'>
                    <div
                      className='py-2 px-3'
                      style={{
                        border: '2px solid rgb(0, 0, 0)',
                        borderBottom: 'none',
                        borderRadius: '6px 6px 0px 0px',
                      }}
                    >
                      {currentAssessment?.userresponse__total_mark}
                    </div>
                    <div
                      className='th-white py-2 px-3 th-br-6'
                      style={{ backgroundColor: '#000000' }}
                    >
                      Out of {currentAssessment?.total_mark}
                    </div>
                  </div>
                  <div className='row align-items-center pt-2 pb-3'>
                    <div className='col-8 text-center pr-0'>
                      <div className='row py-0 mt-2  th-bg-primary th-fw-500 th-br-6'>
                        <div className='col-9 px-0 th-white py-1'>Correct</div>
                        <div
                          className='col-3 px-0 th-bg-white py-1'
                          style={{ borderRadius: '0px 6px 6px 0px' }}
                        >
                          {currentAssessment?.userresponse__correct_answer}
                        </div>
                      </div>
                      <div className='row py-0 mt-2 th-bg-primary th-fw-500 th-br-6'>
                        <div className='col-9 px-0 py-1 th-white '>Wrong</div>
                        <div
                          className='col-3 px-0 py-1 th-bg-white'
                          style={{ borderRadius: '0px 6px 6px 0px' }}
                        >
                          {currentAssessment?.userresponse__wrong_answer}
                        </div>
                      </div>
                      <div className='row py-0 mt-2 th-bg-primary th-fw-500 th-br-6'>
                        <div className='col-9 px-0 py-1 th-white '>No.of Questions</div>
                        <div
                          className='col-3 px-0 py-1 th-bg-white'
                          style={{ borderRadius: '0px 6px 6px 0px' }}
                        >
                          {currentAssessment?.userresponse__total_question}
                        </div>
                      </div>
                      <div className='row py-0 mt-2 th-bg-primary th-fw-500 th-br-6'>
                        <div className='col-9 px-0 py-1 th-white '>
                          Questions Attempted
                        </div>
                        <div
                          className='col-3 px-0 py-1 th-bg-white'
                          style={{ borderRadius: '0px 6px 6px 0px' }}
                        >
                          {currentAssessment?.attempted_questions}
                        </div>
                      </div>
                      {/* <div className='row py-0 mt-2 th-bg-primary th-fw-500 th-br-6'>
                    <div className='col-9 px-0 py-1 th-white '>Sub Questions</div>
                    <div
                      className='col-3 px-0 py-1 th-bg-white'
                      style={{ borderRadius: '0px 6px 6px 0px' }}
                    >
                      {currentAssessment?.userresponse__correct_answer}
                    </div>
                  </div> */}
                    </div>
                    <div className='col-4 px-0  text-center'>
                      <img src={toddlerGroup} width='120px' />
                    </div>
                  </div>
                </div>
                <div className='row justify-content-end p-2'>
                  <Button
                    className='th-button-active th-br-6 th-pointer'
                    onClick={() => history.push('/assessment/?page=1&status=1')}
                  >
                    {' '}
                    View Details &gt;
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default DailyDairyCard;
