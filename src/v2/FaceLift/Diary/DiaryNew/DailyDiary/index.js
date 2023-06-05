import React, { useState, createRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  message,
  Collapse,
  Drawer,
  DatePicker,
  Spin,
  Tag,
  Checkbox,
} from 'antd';
import {
  DownOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import axios from 'v2/config/axios';
import axiosInstance from 'axios';
import endpoints from 'v2/config/endpoints';
import { useSelector, useDispatch } from 'react-redux';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import uploadIcon from 'v2/Assets/dashboardIcons/announcementListIcons/uploadIcon.svg';
import UploadDocument from '../UploadDocument';
import QuestionCard from 'components/question-card';
import moment from 'moment';
import cuid from 'cuid';
import { addHomeWork } from 'redux/actions/teacherHomeworkActions';
import tickIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/greenTick.svg';
import deleteIcon from 'v2/Assets/dashboardIcons/diaryIcons/deleteRedIcon.svg';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import AssessmentIcon from 'v2/Assets/dashboardIcons/diaryIcons/AssessmentIcon.svg';
import _ from 'lodash';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { getActivityColor, ActivityTypes } from 'v2/generalActivityFunction';

let boardFilterArr = [
  'orchids.letseduvate.com',
  'localhost:3000',
  'dev.olvorchidnaigaon.letseduvate.com',
  'ui-revamp1.letseduvate.com',
  'qa.olvorchidnaigaon.letseduvate.com',
];
const { Panel } = Collapse;
const DailyDiary = ({ isSubstituteDiary }) => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const dispatch = useDispatch();
  // const { erp } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const [branchID, setBranchID] = useState(selectedBranch?.branch?.id);
  const [acadID, setAcadID] = useState(selectedBranch?.id);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [keyConceptDropdown, setKeyConceptDropdown] = useState([]);
  const [gradeID, setGradeID] = useState();
  const [gradeName, setGradeName] = useState();
  const [sectionName, setSectionName] = useState();
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [sectionID, setSectionID] = useState();
  const [sectionMappingID, setSectionMappingID] = useState([]);
  const [subjectID, setSubjectID] = useState();
  const [subjectName, setSubjectName] = useState();
  const [chapterID, setChapterID] = useState();
  const [chapterName, setChapterName] = useState();
  const [keyConceptID, setKeyConceptID] = useState();
  const [keyConceptName, setKeyConceptName] = useState();
  const [gsMappingID, setGSMappingID] = useState();
  const [recap, setRecap] = useState('');
  const [classwork, setClasswork] = useState('');
  const [summary, setSummary] = useState('');
  const [tools, setTools] = useState('');
  const [homework, setHomework] = useState('');
  const [assignedHomework, setAssignedHomework] = useState('');
  const [hwMappingID, setHwMappingID] = useState();
  const [isDiaryEdit, setIsDiaryEdit] = useState(false);
  const [diaryID, setDiaryID] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkInstructions, setHomeworkInstructions] = useState('');
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const [homeworkCreated, setHomeworkCreated] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(moment().format('YYYY-MM-DD'));
  const [homeworkDetails, setHomeworkDetails] = useState({});
  const [questionEdit, setQuestionEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [homeworkMapped, setHomeworkMapped] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  // {
  //   id: cuid(),
  //   question: '',
  //   attachments: [],
  //   is_attachment_enable: false,
  //   max_attachment: 2,
  //   penTool: false,
  //   is_central: false,
  // },
  // );
  const [centralAcademicYearID, setCentralAcademicYearID] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [resourcesData, setResourcesData] = useState(false);
  const [completedPeriod, setCompletedPeriod] = useState(false);
  const [showPeriodInfoModal, setShowPeriodInfoModal] = useState(false);
  const [currentPeriodPanel, setCurrentPeriodPanel] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(null);
  const [addedPeriods, setAddedPeriods] = useState([]);
  const [editAddedPeriods, setEditAddedPeriods] = useState([]);
  const [editRemovedPeriods, setEditRemovedPeriods] = useState([]);
  const [upcomingPeriod, setUpcomingPeriod] = useState({});
  const [isPeriodAdded, setIsPeriodAdded] = useState(false);
  const [clearTodaysTopic, setClearTodaysTopic] = useState(true);
  const [clearUpcomingPeriod, setClearUpcomingPeriod] = useState(true);
  const [addingUpcomingPeriod, setAddingUpcomingPeriod] = useState(false);
  const [todaysAssessment, setTodaysAssessment] = useState([]);
  const [upcomingAssessment, setUpcomingAssessment] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [isAutoAssignDiary, setIsAutoAssignDiary] = useState(false);
  const [centralHomework, setCentralHomework] = useState([]);
  const [currentPeriodData, setCurrentPeriodData] = useState([]);
  const [hwDiaryPeriodMappingId, setHwDiaryPeriodMappingId] = useState();
  const [selectedChapterTopic, setSelectedChapterTopic] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [allowAutoAssignDiary, setAllowAutoAssignDiary] = useState(false);
  const questionModify = (questions) => {
    let arr = [];
    questions.map((question) => {
      arr.push({
        id: question.id,
        question: question.question,
        attachments: question.question_files
          ? question.question_files
          : question.attachments,
        is_attachment_enable: question.is_attachment_enable,
        max_attachment: question.max_attachment,
        penTool: question.is_pen_editor_enable
          ? question.is_pen_editor_enable
          : question?.penTool
          ? question?.penTool
          : false,
        is_central: question.is_central ? question.is_central : false,
      });
    });
    return arr;
  };
  const formRef = createRef();
  const history = useHistory();

  let editData = '';
  let periodData = '';
  const { TextArea } = Input;

  const { Option } = Select;
  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };
  const openPeriodInfoModal = () => {
    setShowPeriodInfoModal(true);
  };
  const closePeriodInfoModal = () => {
    setShowPeriodInfoModal(false);
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
    if (questionList.length > 0) {
      setQuestionList((prevState) => [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1),
      ]);
    }
  };

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
        is_central: false,
      },
      ...prevState.slice(index),
    ]);
  };
  const handleShowModal = () => {
    if (!branchID && !gradeID) {
      message.error('Please select grade first');
      return;
    } else {
      setShowUploadModal(true);
    }
  };

  const handleUploadedFiles = (value) => {
    setUploadedFiles(value);
  };
  const handleRemoveUploadedFile = (index) => {
    const newFileList = uploadedFiles.slice();
    newFileList.splice(index, 1);
    setUploadedFiles(newFileList);
  };

  const showDrawer = (params = {}) => {
    setAddingUpcomingPeriod(false);
    setDrawerVisible(true);
    if (params.data) {
      setAddingUpcomingPeriod(true);
    }
    // if (keyConceptID) {
    if (!_.isEmpty(params.value)) {
      setChapterID(params.value.chapter_id);
      setKeyConceptID(params.value.key_concept_id);
      fetchLessonResourcesData({
        grade: gradeID,
        acad_session_id: selectedBranch?.id,
        chapters: params.value.chapter_id,
        subject: subjectID,
        central_gs_id: Number(params.value.chapter__grade_subject_mapping_id),
        for_diary: 1,
        key_concepts: Number(params.value.key_concept_id),
      });
      setKeyConceptName(params.value.key_concept__topic_name);
      setChapterName(params.value.chapter__chapter_name);
      setGSMappingID(params.value.chapter__grade_subject_mapping_id);
    }
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const handleBack = () => {
    history.push('/diary/teacher');
  };
  const handleSubmissionDate = (value) => {
    setSubmissionDate(moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD'));
  };

  const fetchAllowAutoDiaryStatus = () => {
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=hw_auto_asgn`)
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setAllowAutoAssignDiary(true);
          } else {
            setAllowAutoAssignDiary(false);
          }
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
  };
  const handleEdit = () => {
    let payload = {
      academic_year: acadID,
      branch: branchID,
      section: [sectionID],
      subject: subjectID,
      documents: uploadedFiles,
      teacher_report: {
        previous_class: recap,
        summary: summary,
        class_work: classwork,
        tools_used: tools,
        homework: homework,
      },
      dairy_type: 2,
    };
    if (editAddedPeriods.length > 0) {
      payload['added_period_ids'] = editAddedPeriods.map((item) => item.id).toString();
      payload['lesson_plan_id'] = editAddedPeriods.map((item) => item.id);
    }
    if (editRemovedPeriods.length > 0) {
      payload['remove_period_ids'] = editRemovedPeriods.map((item) => item.id).toString();
    }
    if (!_.isEmpty(upcomingPeriod) && !clearUpcomingPeriod) {
      payload['upcoming_period_id'] = upcomingPeriod?.id;
    } else {
      payload['upcoming_period_id'] = null;
    }
    if (hwMappingID && homeworkMapped) {
      payload['hw_dairy_mapping_id'] = hwMappingID;
    }
    setRequestSent(true);
    axios
      .put(
        `${endpoints?.dailyDiary?.updateDelete}${diaryID}/update-delete-dairy/`,
        payload
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          message.success('Daily Diary Updated Successfully');
          setRequestSent(false);
          history.push('/diary/teacher');
        }
      })
      .catch((error) => {
        message.error('Something went wrong');
        setRequestSent(false);
      });
  };
  const handleSubmit = () => {
    if (showHomeworkForm && !homeworkMapped) {
      message.error('Please finish the homework first');
      return;
    }
    if (!gradeID) {
      message.error('Please select Grade');
      return;
    }
    if (isAutoAssignDiary) {
      if (sectionID.length == 0) {
        message.error('Please select Section');
        return;
      }
    } else {
      if (!sectionID) {
        message.error('Please select Section');
        return;
      }
    }

    if (!subjectID) {
      message.error('Please select Subject');
      return;
    }
    setLoading(true);
    setRequestSent(true);
    let payload = {
      academic_year: acadID,
      branch: branchID,
      module_id: moduleId,
      grade: [gradeID],
      section: Array.isArray(sectionMappingID) ? sectionID : [sectionID],
      section_mapping: Array.isArray(sectionMappingID)
        ? sectionMappingID
        : [sectionMappingID],
      subject: subjectID,
      chapter: chapterID,
      documents: uploadedFiles,
      teacher_report: {
        previous_class: recap,
        summary: summary,
        class_work: classwork,
        tools_used: tools,
        homework: homework,
      },
      dairy_type: 2,
      is_central: false,
    };
    if (hwMappingID && homeworkMapped) {
      payload['hw_dairy_mapping_id'] = hwMappingID;
    }
    if (addedPeriods.length > 0 && !clearTodaysTopic) {
      payload['period_added_ids'] = addedPeriods.map((item) => item.id).toString();
    }
    if (hwDiaryPeriodMappingId) {
      payload['hw_diary_period_mapping_id'] = hwDiaryPeriodMappingId;
    } else {
      payload['lesson_plan_id'] = addedPeriods.map((item) => item.id);
    }
    if (!_.isEmpty(upcomingPeriod)) {
      payload['upcoming_period_id'] = upcomingPeriod?.id;
    }
    if (isSubstituteDiary) {
      payload['is_substitute_diary'] = true;
    }
    if (
      payload?.teacher_report?.summary ||
      payload?.period_added_ids ||
      (showHomeworkForm && payload?.teacher_report?.homework) ||
      assignedHomework?.length > 0
    ) {
      axios
        .post(`${endpoints?.dailyDiary?.createDiary}`, payload)
        .then((res) => {
          if (res?.data?.status_code == 200) {
            if (res?.data?.message === 'Daily Dairy created successfully') {
              message.success('Daily Diary Created Successfully');
              // if (isAutoAssignDiary) {
              //   history.goBack();
              // } else {
              history.push('/diary/teacher');
              // }
            } else if (res?.data?.message.includes('locked')) {
              message.error(res?.data?.message);
            } else {
              message.error('Daily Diary Already Exists');
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error?.message);
        })
        .finally(() => {
          setRequestSent(false);
          setLoading(false);
        });
    } else {
      message.error("Please enter either of Today's Topic, Homework or Notes");
      setLoading(false);
      return;
    }
  };

  const handleClearGrade = () => {
    formRef.current.setFieldsValue({
      section: null,
      subject: null,
    });
    setSectionDropdown([]);
    setSectionMappingID();
    setSectionID();
    setSubjectDropdown([]);
    setSubjectID();
    setChapterDropdown([]);
  };

  const handleClearSection = () => {
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setSectionMappingID();
    setSectionID();
    setSubjectID();
    formRef.current.setFieldsValue({
      subject: null,
    });
  };

  const handleClearSubject = () => {
    setSubjectID();
    setChapterDropdown([]);
  };

  //For Chapter
  const chapterOptions = chapterDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.chapter_name}
      </Option>
    );
  });
  const keyConceptOptions = keyConceptDropdown?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        gsMappingId={each.chptr_fk__grade_subject_mapping_id}
      >
        {each?.topic_name}
      </Option>
    );
  });

  const handleChapter = (e) => {
    formRef.current.setFieldsValue({
      key_concept: null,
    });
    setKeyConceptDropdown([]);
    setResourcesData([]);
    setKeyConceptID();
    if (e) {
      setChapterID(e.value);
    }
  };
  const handleKeyConcept = (e) => {
    if (e) {
      setKeyConceptID(e.value);
      setGSMappingID(e.gsMappingId);
      fetchLessonResourcesData({
        grade: gradeID,
        acad_session_id: selectedBranch?.id,
        chapters: chapterID,
        subject: subjectID,
        central_gs_id: Number(e.gsMappingId),
        for_diary: 1,
        key_concepts: Number(e.value),
      });
    } else {
      setResourcesData([]);
    }
  };

  const fetchLessonResourcesData = (params = {}) => {
    setLoadingDrawer(true);
    axios
      .get(`/academic/period-view/grade-subject-wise-lp-overview/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setResourcesData(result?.data?.data);
          setLoadingDrawer(false);
        } else {
          setLoadingDrawer(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingDrawer(false);
      });
  };
  //For Subject
  const subjectOptions = subjectDropdown?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each?.subject__id} id={each?.id}>
        {each?.subject__subject_name}
      </Option>
    );
  });
  const fetchChapterDropdown = (params = {}) => {
    axios
      .get('/academic/diary/chapters/', { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setChapterDropdown(result?.data?.data);
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
  };
  const fetchTodaysTopic = (params = {}) => {
    axios
      .get('/academic/diary/today-period/', { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          if (!_.isEmpty(result?.data?.data)) {
            setClearTodaysTopic(false);
            setAddedPeriods(result?.data?.data);
            setCurrentPanel(0);
            setChapterID(result?.data?.data[0]?.chapter_id);
            setKeyConceptID(result?.data?.data[0]?.key_concept_id);
            setGSMappingID(result?.data?.data[0]?.chapter__grade_subject_mapping_id);
            setChapterName(result?.data?.data[0]?.chapter__chapter_name);
            setKeyConceptName(result?.data?.data[0]?.key_concept__topic_name);
          }
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
  };

  const handleSubject = (e) => {
    formRef.current.setFieldsValue({
      chapter: null,
      key_concept: null,
    });
    setChapterDropdown([]);
    setChapterID();
    setKeyConceptDropdown([]);
    setKeyConceptID();
    setAddedPeriods([]);
    setResourcesData([]);
    setClearTodaysTopic(true);
    setAssignedHomework();
    setHomework('');
    setHomeworkCreated(false);
    setShowHomeworkForm(false);
    setHomeworkDetails({});
    setHomeworkMapped(false);
    setActivityData([]);
    setQuestionList([]);
    if (e) {
      setSubjectID(e.value);
      setSubjectName(e.children.split('_')[e.children.split('_').length - 1]);
      setHwMappingID();
      checkAssignedHomework({
        section_mapping: sectionMappingID,
        subject: e?.value,
        date: moment().format('YYYY-MM-DD'),
      });
      fetchTodaysTopic({ section_mapping: sectionMappingID, subject_id: e.value });
      fetchChapterDropdown({
        branch_id: selectedBranch.branch.id,
        subject_id: e.value,
        grade_id: gradeID,
      });
      fetchAssessmentData({
        section_mapping: sectionMappingID,
        subject_id: e.value,
        date: moment().format('YYYY-MM-DD'),
      });
      fetchActivityData({
        branch_id: selectedBranch?.branch?.id,
        grade_id: gradeID,
        section_id: sectionID,
        start_date: moment().format('YYYY-MM-DD'),
        type: e.children.split('_')[e.children.split('_').length - 1],
      });
    }
  };

  //For Section
  const sectionOptions = sectionDropdown?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleSection = (each) => {
    setShowHomeworkForm(false);
    if (isAutoAssignDiary) {
      setSectionID(each?.map((item) => item?.value));
      setSectionMappingID(each?.map((item) => item?.mappingId));
    } else {
      formRef.current.setFieldsValue({
        subject: null,
        chapter: null,
      });
      setSubjectDropdown([]);
      setSubjectID();
      if (each) {
        setSectionID(each?.value);
        setSectionMappingID(each?.mappingId);
        setSectionName(each?.children?.slice(-1).toUpperCase());
        const params = {
          session_year: selectedAcademicYear?.id,
          branch: selectedBranch?.branch?.id,
          grade: gradeID,
          section: each.value,
          module_id: moduleId,
        };
        axios
          .get(`${endpoints.academics.subjects}`, {
            params: {
              ...params,
              ...(isSubstituteDiary ? { is_substitue_teacher: 1 } : {}),
            },
          })
          .then((result) => {
            if (result?.data?.status_code == 200) {
              setSubjectDropdown(result?.data?.data);
            }
          })
          .catch((error) => message.error('error', error?.message));
      }
    }
  };

  //For Grade
  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: isAutoAssignDiary ? [] : null,
      subject: null,
    });
    setSectionDropdown([]);
    setSectionMappingID();
    setSectionID();
    setSubjectDropdown([]);
    setSubjectID();
    setShowHomeworkForm(false);
    if (e) {
      setGradeID(e.value);
      setGradeName(e.children);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: e.value,
        module_id: moduleId,
      };
      fetchSectionData(params);
    }
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          if (isAutoAssignDiary) {
            setSectionDropdown(
              result?.data?.data.filter((each) =>
                history.location.state?.periodData?.sections
                  .map((item) => item?.section_id)
                  .includes(each?.section_id)
              )
            );
          } else {
            setSectionDropdown(result?.data?.data);
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, {
        params: { ...params, ...(isSubstituteDiary ? { is_substitue_teacher: 1 } : {}) },
      })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeDropdown(result?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const fetchKeyConceptListData = (params = {}) => {
    axios
      .get(`/academic/diary/topics/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setKeyConceptDropdown(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchActivityData = (params = {}) => {
    axios
      .get(`${endpoints.newBlog.diaryActivities}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setActivityData(response?.data?.result);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const checkAssignedHomework = (params = {}) => {
    axios
      .get(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            setAssignedHomework(result?.data?.data);
          } else {
            //   if (Object.keys(selectedPeriod).length > 0) {
            //     fetchCentralHomework({
            //       chapter: selectedPeriod?.chapterID,
            //       period: selectedPeriod?.periodName,
            //       topic_id: selectedPeriod?.keyConceptID,
            //     });
            //   }
            // }
          }
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
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
  const fetchUpcomigPeriod = (periodID) => {
    const params = {
      current_period_ids: periodID,
      section_mapping: Array.isArray(sectionMappingID)
        ? sectionMappingID.join(',')
        : sectionMappingID,
      subject_id: subjectID,
    };
    axios
      .get(`/academic/diary/upcoming-period/`, {
        params: { ...params },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          if (response?.data?.data.length > 0) {
            if (
              addedPeriods
                ?.map((item) => item.id)
                .includes(response?.data?.data[0]?.id) ||
              response?.data?.data[0]?.id == 0
            ) {
              fetchUpcomigPeriod(response?.data?.data[0]?.id);
            } else {
              setClearUpcomingPeriod(false);
              setUpcomingPeriod(response?.data?.data[0]);
            }
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'Teacher Diary' ||
              item.child_name === 'Student Diary'
            ) {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    fetchAllowAutoDiaryStatus();
  }, []);
  useEffect(() => {
    if (assignedHomework) {
      mapAssignedHomework();
    }
  }, [assignedHomework]);

  useEffect(() => {
    if (addedPeriods.length > 0) {
      let lastPeriod = addedPeriods[addedPeriods.length - 1];
      if (isDiaryEdit && !_.isEmpty(editData?.up_coming_period)) {
        fetchUpcomigPeriod(lastPeriod.id);
      } else {
        fetchUpcomigPeriod(lastPeriod.id);
      }
      // alert('add period use effect');
      setCurrentPanel(addedPeriods.length - 1);
      if (isAutoAssignDiary) {
        fetchCentralHomework({
          chapter: lastPeriod?.chapter_id,
          period: lastPeriod?.period_name,
          topic_id: lastPeriod?.key_concept_id,
        });
        let title = addedPeriods?.reduce((initialValue, data) => {
          let key = data['chapter__chapter_name'];
          if (!initialValue[key]) {
            initialValue[key] = [];
          }
          initialValue[key].push(data?.key_concept__topic_name);
          return initialValue;
        }, {});
        let combinedTitle = Object.keys(title)
          ?.map((item) => item + ' - ' + title[item]?.map((each) => each).join(','))
          .join(',');
        setHomeworkTitle(`HW : ${combinedTitle}`);
      }
    } else {
      setUpcomingPeriod({});
      setClearUpcomingPeriod(true);
      setChapterID();
      setChapterName();
      setKeyConceptID();
      setKeyConceptName();
      setHomeworkTitle();
    }
  }, [addedPeriods]);
  console.log('rohan', allowAutoAssignDiary);
  const mapAssignedHomework = () => {
    setQuestionEdit(true);
    axios
      .post(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, {
        hw_id: assignedHomework[0]?.id,
      })
      .then((result) => {
        if (result?.data?.status_code == 201) {
          setHwMappingID(result?.data?.data?.hw_dairy_mapping_id);
          setHomework(assignedHomework[0].homework_name);
          setHomeworkMapped(true);
          axios
            .get(`academic/${assignedHomework[0]?.id}/hw-questions/?hw_status=1`)
            .then((result) => {
              if (result?.data?.status_code == 200) {
                setHomeworkDetails(result?.data?.data);
                setShowHomeworkForm(true);
                if (!isDiaryEdit) {
                  setHomeworkCreated(true);
                }
                if (
                  result?.data?.data?.hw_questions.some((e) => e.is_central === true) &&
                  history.location?.state?.isDiaryAutoAssign
                ) {
                  setIsAutoAssignDiary(true);
                }
              }
            })
            .catch((error) => message.error('error', error?.message));
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  useEffect(() => {
    if (chapterID) {
      fetchKeyConceptListData({
        chapter_id: chapterID,
      });
    }
  }, [chapterID]);

  const handleAddHomeWork = async () => {
    if (!homeworkTitle.trim().length) {
      message.error('Please fill Homework Title');
      return;
    }
    // if (!homeworkInstructions.trim().length && !isAutoAssignDiary) {
    //   message.error('Please fill Homework Instructions');
    //   return;
    // }
    if (!questionList[0]?.question) {
      message.error('Please add questions');
      return;
    }
    setQuestionEdit(true);
    setLoading(true);
    let reqObj = {
      name: homeworkTitle,
      description: homeworkInstructions,
      section_mapping: Array.isArray(sectionMappingID)
        ? sectionMappingID
        : [sectionMappingID],
      subject: subjectID,
      date: moment().format('YYYY-MM-DD'),
      last_submission_date: submissionDate,
      questions: questionList.map((q) => {
        const qObj = q;
        delete qObj.errors;
        delete qObj.id;
        return qObj;
      }),
      lesson_plan_id: addedPeriods.map((item) => item.id),
    };
    if (diaryID) {
      reqObj['diary_id'] = diaryID;
    }
    try {
      const response = await dispatch(
        addHomeWork(
          reqObj,
          homeworkMapped,
          assignedHomework ? assignedHomework[0]?.id : null,
          isAutoAssignDiary
        )
      );
      setHwDiaryPeriodMappingId(response.data?.data?.hw_dairy_period_mapping_ids);
      setLoading(false);
      message.success('Homework added');
      setQuestionList([]);
      setShowHomeworkForm(true);
      checkAssignedHomework({
        section_mapping: sectionMappingID.toString(),
        subject: subjectID,
        date: moment().format('YYYY-MM-DD'),
      });
      setHomeworkCreated(true);

      // setQuestionList(reqObj?.questions);

      // history.goBack();
    } catch (error) {
      setLoading(false);
      message.error('Failed to add homework');
    }
    // }
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
                  setShowHomeworkForm(true);
                  if (
                    result?.data?.data?.hw_questions.some((e) => e.is_central === true) &&
                    isDiaryEdit
                  ) {
                    setIsAutoAssignDiary(true);
                  }
                }
              })
              .catch((error) => message.error('error', error?.message));
          } else {
            setAssignedHomework();
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const fetchResourceYear = () => {
    axiosInstance
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCentralAcademicYearID(
            result?.data?.result?.results?.filter(
              (item) => item?.session_year == selectedAcademicYear.session_year
            )[0]?.id
          );
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };
  const markPeriodComplete = (item) => {
    setLoadingDrawer(true);
    if (Array.isArray(sectionMappingID)) {
      sectionMappingID.map((section, index) => {
        let payLoad = {
          academic_year: selectedAcademicYear?.session_year,
          academic_year_id: centralAcademicYearID,
          volume_id: Number(item?.chapter__volume_id),
          volume_name: item?.chapter__volume__volume_name,
          subject_id: subjectID,
          chapter_id: chapterID,
          chapter_name: item.chapter__chapter_name,
          central_gs_mapping_id: Number(gsMappingID),
          period_id: item?.id,
          section_mapping_id: [section],
        };
        axios
          .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
          .then((res) => {
            if (res.data.status_code === 200) {
              if (index == sectionMappingID?.length - 1) {
                message.success('Period Completed Successfully');
                fetchLessonResourcesData({
                  grade: gradeID,
                  acad_session_id: selectedBranch?.id,
                  chapters: chapterID,
                  subject: subjectID,
                  central_gs_id: Number(gsMappingID),
                  for_diary: 1,
                  key_concepts: Number(item?.key_concept_id),
                });
              }
            }
          })
          .catch((error) => {
            message.error(error?.response?.data?.message);
          })
          .finally(() => {
            setLoadingDrawer(false);
          });
      });
    } else {
      let payLoad = {
        academic_year: selectedAcademicYear?.session_year,
        academic_year_id: centralAcademicYearID,
        volume_id: Number(item?.chapter__volume_id),
        volume_name: item?.chapter__volume__volume_name,
        subject_id: subjectID,
        chapter_id: chapterID,
        chapter_name: item?.chapter__chapter_name,
        central_gs_mapping_id: Number(gsMappingID),
        period_id: item?.id,
        section_mapping_id: [sectionMappingID],
      };
      axios
        .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
        .then((res) => {
          if (res.data.status_code === 200) {
            message.success('Period Completed Successfully');
            fetchLessonResourcesData({
              grade: gradeID,
              acad_session_id: selectedBranch?.id,
              chapters: chapterID,
              subject: subjectID,
              central_gs_id: Number(gsMappingID),
              for_diary: 1,
              key_concepts: Number(keyConceptID),
            });
          }
        })
        .catch((error) => {
          message.error(error.response.data.message);
        })
        .finally(() => {
          setLoadingDrawer(false);
        });
    }
  };
  useEffect(() => {
    // handleClearAll();
    if (moduleId && selectedBranch) {
      fetchGradeData();
      fetchResourceYear();
    }
  }, [moduleId, isSubstituteDiary]);

  const handleClearAll = () => {
    setGradeDropdown([]);
    setGradeID();
    setGradeName();
    setSectionID();
    setSectionMappingID();
    setSectionName();
    setSectionDropdown([]);
    setSubjectID();
    setSubjectName();
    setSubjectDropdown([]);
    setClearTodaysTopic(true);
    setAddedPeriods([]);
    setUpcomingPeriod({});
    formRef.current.setFieldsValue({
      grade: null,
      section: null,
      subject: null,
    });
  };

  useEffect(() => {
    if (history?.location?.state?.data) {
      let editData = history.location.state.data;
      let editSubject = history.location.state.subject;
      setIsDiaryEdit(history?.location?.state?.isDiaryEdit);
      setIsAutoAssignDiary(history?.location?.state?.isDiaryAutoAssign);
      setDiaryID(history.location.state.data?.diary_id);
      formRef.current.setFieldsValue({
        grade: editData?.grade_name,
        section: editData?.section_name,
        subject: editSubject?.subject_name,
        // chapter: editData?.chapter[0]?.chapter_name,
      });
      setAcadID(editData?.academic_year_id);
      setBranchID(editData?.branch_id);
      setGradeID(
        Array.isArray(editData?.grade_id) ? editData?.grade_id[0] : editData?.grade_id
      );
      setGradeName(editData?.grade_name);
      setSectionName(editData?.section_name.slice(-1).toUpperCase());
      setSectionID(editData?.section_id);
      setSectionMappingID(editData?.section_mapping_id);
      setSubjectID(editSubject?.subject_id);
      setSubjectName(editSubject?.subject_name);
      if (editData?.periods_data?.length > 0) {
        setClearTodaysTopic(false);
        setAddedPeriods(editData?.periods_data);
        setCurrentPanel(0);
      }
      if (!_.isEmpty(editData?.up_coming_period)) {
        setClearUpcomingPeriod(false);
        setUpcomingPeriod(editData?.up_coming_period);
      }
      setSummary(editData?.teacher_report?.summary);
      setHomework(editData?.teacher_report?.homework);
      setUploadedFiles(editData?.documents);
      if (editData?.teacher_report?.homework) {
        setHomeworkCreated(false);
        // fetchHomeworkDetails({
        //   section_mapping: editData?.section_mapping_id,
        //   subject: editSubject?.subject_id,
        //   date: moment(editData?.created_at).format('YYYY-MM-DD'),
        // });
        checkAssignedHomework({
          section_mapping: editData?.section_mapping_id,
          subject: editSubject?.subject_id,
          date: moment(editData?.created_at).format('YYYY-MM-DD'),
        });
      }
      fetchChapterDropdown({
        branch_id: selectedBranch.branch.id,
        subject_id: editSubject?.subject_id,
        grade_id: Array.isArray(editData?.grade_id)
          ? editData?.grade_id[0]
          : editData?.grade_id,
      });
      fetchAssessmentData({
        section_mapping: editData?.section_mapping_id,
        subject_id: editSubject?.subject_id,
        date: moment(editData?.created_at).format('YYYY-MM-DD'),
      });

      setCurrentPeriodData([
        ...currentPeriodData,
        {
          chapterID: editData?.chapterID,
          periodID: editData?.periodID,
          keyConceptID: editData?.keyConceptID,
        },
      ]);
      fetchActivityData({
        branch_id: selectedBranch?.branch?.id,
        grade_id: Array.isArray(editData?.grade_id)
          ? editData?.grade_id[0]
          : editData?.grade_id,
        section_id: Array.isArray(editData?.section_id)
          ? editData?.section_id.toString()
          : editData?.section_id,
        start_date: moment().format('YYYY-MM-DD'),
        type: editSubject?.subject_name.split('_')[
          editSubject?.subject_name.split('_').length - 1
        ],
      });
    } else if (history.location?.state?.isDiaryAutoAssign) {
      setIsAutoAssignDiary(true);
      periodData = history.location.state?.periodData;
      setSelectedPeriod(periodData);
      setAcadID(selectedBranch?.id);
      setBranchID(selectedBranch?.branch?.id);
      setIsDiaryEdit(periodData?.isDiaryEdit);
      setSectionDropdown(periodData?.sections);
      setGradeID(periodData?.gradeID);
      setGradeName(periodData?.gradeName);
      setSectionID(periodData?.sections.map((item) => item?.section_id));
      setSectionMappingID(periodData?.sections.map((item) => item?.id));
      setSubjectID(periodData?.subjectID);
      setChapterID(periodData?.chapterID);
      setSubjectName(periodData?.subjectName);
      formRef.current.setFieldsValue({
        grade: periodData?.gradeName,
        section: periodData?.sections.map((item) => item?.section_id),
        subject: periodData?.subjectName,
        chapter: periodData?.chapterName,
      });
      if (periodData?.subjectID) {
        fetchChapterDropdown({
          branch_id: selectedBranch.branch.id,
          subject_id: periodData?.subjectID,
          grade_id: periodData?.gradeID,
        });
        checkAssignedHomework({
          section_mapping: periodData?.sections.map((item) => item?.id).join(','),
          subject: periodData?.subjectID,
          date: moment().format('YYYY-MM-DD'),
        });
        fetchTodaysTopic({
          section_mapping: periodData?.sections.map((item) => item?.id).join(','),
          subject_id: periodData?.subjectID,
        });
        setCurrentPeriodData([
          ...currentPeriodData,
          {
            chapterID: periodData?.chapterID,
            periodID: periodData?.periodID,
            keyConceptID: periodData?.keyConceptID,
          },
        ]);
        setSelectedChapterTopic([
          {
            chapter: periodData?.chapterName,
            keyConcept: periodData?.keyConceptName,
          },
        ]);
        fetchActivityData({
          branch_id: selectedBranch?.branch?.id,
          grade_id: Array.isArray(periodData?.gradeID)
            ? periodData?.gradeID[0]
            : periodData?.gradeID,
          section_id: Array.isArray(periodData?.sections)
            ? periodData?.sections.map((item) => item?.id).join(',')
            : periodData?.section_id,
          start_date: moment().format('YYYY-MM-DD'),
          type: periodData?.subjectName.split('_')[
            periodData?.subjectName.split('_').length - 1
          ],
        });
      }
    }
  }, []);

  const showAssessmentData = (data) => {
    return data.map((item) => (
      <div className='col-4 px-1 mb-2'>
        <div className='th-bg-grey py-1 px-2 th-br-6'>
          <div className='row th-black-2 align-items-center py-1'>
            <div className='col-4 px-0 d-flex justify-content-between th-black-1 th-fw-500'>
              <span>Status of Exam</span>
              <span>:&nbsp;</span>
            </div>
            <div className='col-8 pl-1 text-capitalize'>
              <span
                className={`${
                  item?.exam_status == 'completed'
                    ? 'th-green'
                    : item?.exam_status == 'ongoing'
                    ? 'th-red th-fw-600'
                    : 'th-primary'
                } text-capitalize`}
              >
                {item?.exam_status}
              </span>
            </div>
          </div>
          <div className='row th-black-2 align-items-center py-1'>
            <div className='col-4 px-0 d-flex justify-content-between th-black-1 th-fw-500'>
              <span>Test Name</span>
              <span>:&nbsp;</span>
            </div>
            <div className='col-8 pl-1 text-truncate'>{item?.test_name}</div>
          </div>
          <div className='row th-black-2 align-items-center py-1'>
            <div className='col-4 d-flex justify-content-between px-0 th-black-1 th-fw-500'>
              <span>Scheduled At</span>
              <span>:&nbsp;</span>
            </div>
            <div className='col-8 pl-1 text-truncate th-12'>
              {moment(item?.test_date).format('DD/MM/YYYY HH:mm a')}
            </div>
          </div>
          <div className='row th-black-2 align-items-center py-1'>
            <div className='col-4 d-flex justify-content-between px-0 th-black-1 th-fw-500'>
              <span>Total Marks</span>
              <span>:&nbsp;</span>
            </div>
            <div className='col-8 pl-1 text-truncate th-12'>{item?.total_mark} </div>
          </div>
        </div>
      </div>
    ));
  };

  const fetchCentralHomework = (params = {}) => {
    axiosInstance
      .get(`${endpoints?.dailyDiary?.centralHomeworkData}`, {
        params: { ...params, ...(allowAutoAssignDiary ? { config: 'True' } : {}) },
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          let data = history?.location?.state?.periodData;
          let homeworkData = response?.data?.result.filter(
            (item) => item.document_type == 'Homework' && item?.homework_text !== ''
          );
          if (homeworkData.length > 0) {
            let centralHomework = {
              id: cuid(),
              question: homeworkData[0]?.homework_text,
              question_files: homeworkData[0]?.media_file,
              is_attachment_enable: false,
              max_attachment: 2,
              is_pen_editor_enable: false,
              is_central: true,
            };

            // if (questionList.length == 1) {
            //   setQuestionList(questionModify([centralHomework]));
            // } else {
            if (Array.isArray(questionList)) {
              setQuestionList(questionModify([...questionList, centralHomework]));
            } else {
              setQuestionList(questionModify([centralHomework]));
            }
            // setQuestionList(questionModify([...questionList, centralHomework]));
            // }
            setSubmissionDate(
              moment(homeworkDetails?.last_submission_dt)
                .add(1, 'days')
                .format('YYYY-MM-DD')
            );
            setShowHomeworkForm(true);
            // setHomeworkMapped(true);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  useEffect(() => {
    if (Object.keys(homeworkDetails).length > 0) {
      if (Array.isArray(questionList)) {
        setQuestionList(
          questionModify([...questionList, homeworkDetails?.hw_questions].flat())
        );
      } else {
        setQuestionList(questionModify(homeworkDetails?.hw_questions));
      }
      setSubmissionDate(moment(homeworkDetails?.last_submission_dt).format('YYYY-MM-DD'));
      setHomeworkTitle(homeworkDetails?.homework_name);
      setHomeworkInstructions(homeworkDetails?.description);
      // alert('add homework use effect');
      //   if(Object.keys(selectedPeriod).length > 0) {
      //   setTimeout(() => {
      //     fetchCentralHomework({
      //       chapter: selectedPeriod?.chapterID,
      //       period: selectedPeriod?.periodName,
      //       topic_id: selectedPeriod?.keyConceptID,
      //     });
      //   }, 500);
      // }
    }
    //  else if (!isAutoAssignDiary) {
    //   setQuestionList([
    //     {
    //       id: cuid(),
    //       question: '',
    //       attachments: [],
    //       is_attachment_enable: false,
    //       max_attachment: 2,
    //       penTool: false,
    //     },
    //   ]);
    //   // setSubmissionDate();
    //   setHomeworkTitle();
    //   setHomeworkInstructions();
    // }
  }, [homeworkDetails]);

  useEffect(() => {
    if (showPeriodInfoModal) {
      setTimeout(() => {
        closePeriodInfoModal();
      }, 2000);
    }
  }, [showPeriodInfoModal]);

  useEffect(() => {
    if (!history?.location?.state?.data) {
      setAddedPeriods([]);
      setUpcomingPeriod({});
      setClearUpcomingPeriod(true);
      setClearTodaysTopic(true);
    }
  }, [subjectID]);

  return (
    <div className='row th-bg-white'>
      <div className='row py-1'>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row py-2 text-left'>
              <div className='col-md-4 py-2'>
                <div className='text-capitalize th-fw-700 th-black-1'>Grade</div>
                <Form.Item name='grade'>
                  <Select
                    disabled={isDiaryEdit || isAutoAssignDiary}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleGrade(value)}
                    placeholder='Grade'
                    allowClear
                    onClear={handleClearGrade}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>

              <div className='col-md-4 py-2'>
                <div className='text-capitalize th-fw-700 th-black-1'>Section</div>
                <Form.Item name='section'>
                  <Select
                    disabled={
                      isDiaryEdit ? true : sectionMappingID?.length == 1 ? true : false
                    }
                    mode={isAutoAssignDiary ? 'multiple' : 'single'}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleSection(value)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Section'
                    allowClear={isAutoAssignDiary ? false : true}
                    onClear={handleClearSection}
                    showSearch
                    value={sectionMappingID}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4 py-2'>
                <div className='text-capitalize th-fw-700 th-black-1'>Subject</div>
                <Form.Item name='subject'>
                  <Select
                    disabled={isDiaryEdit || isAutoAssignDiary}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleSubject(value)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Subject'
                    allowClear
                    onClear={handleClearSubject}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
          {loading ? (
            <div className='d-flex justify-content-center align-items-center h-50 mb-3'>
              <Spin tip='Creating Diary...' size='large' />
            </div>
          ) : (
            <>
              <div className='row th-bg-white py-1'>
                <div className='col-12 px-0'>
                  <div
                    className='row'
                    // style={{ border: '1px solid #d9d9d9' }}
                  >
                    <div className='col-md-5 py-2 th-bg-grey th-br-6 ml-2'>
                      <div className='d-flex justify-content-between px-2 align-items-center'>
                        <div className=' th-black-2 th-fw-600 th-18'>Today's Topic</div>
                        <div className=' text-right px-1'>
                          {addedPeriods.length > 0 && (
                            <span
                              className='th-12 px-1 th-primary py-1 th-pointer mr-3 th-br-6'
                              style={{ border: '1px solid #d9d9d9' }}
                              onClick={() =>
                                subjectID
                                  ? showDrawer({
                                      value: addedPeriods[addedPeriods.length - 1],
                                    })
                                  : message.error('Please select Subject first')
                              }
                            >
                              Add More
                            </span>
                          )}
                        </div>
                      </div>

                      {clearTodaysTopic ? (
                        <div
                          className='row mt-1 th-br-6'
                          style={{
                            border: '1px solid #d9d9d9',
                            boxShadow: '0px 0px 6px 0px #0000005E',
                            height: 170,
                            overflowY: 'auto',
                          }}
                          onClick={() =>
                            subjectID
                              ? showDrawer()
                              : message.error('Please select Subject first')
                          }
                        >
                          <div className='row align-items-center justify-content-center th-fw-500 th-black-2 th-pointer'>
                            <PlusOutlined className='mr-3' />
                            Select from Lesson plan
                          </div>
                        </div>
                      ) : (
                        <div
                          className='row mt-1 th-br-6'
                          style={{
                            border: '1px solid #d9d9d9',
                            boxShadow: '0px 0px 6px 0px #0000005E',
                            height: 170,
                            overflowY: 'auto',
                          }}
                        >
                          {addedPeriods?.map((item, index) => (
                            <div className='row px-1 th-diary-collapse'>
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
                                      <div className='col-6 pr-0 th-18'>
                                        {item?.period_name}
                                      </div>
                                      <div className='col-5 pl-0 text-right'>
                                        {item?.completion_status?.filter(
                                          (item) => item?.section_id === sectionMappingID
                                        )[0]?.is_complete === true ? (
                                          <div className='d-flex flex-column'>
                                            <div className='th-10 th-grey-1'>
                                              Updated at
                                            </div>
                                            <div className='th-10 th-black-1'>
                                              {moment(
                                                item?.completion_status?.filter(
                                                  (item) =>
                                                    item?.section_id === sectionMappingID
                                                )[0]?.completed_at
                                              ).format('DD/MM/YYYY HH:mm a')}
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                      <div
                                        className='col-1 px-1'
                                        onClick={() => {
                                          setIsPeriodAdded(false);
                                          setCompletedPeriod(item);
                                          openPeriodInfoModal();
                                          if (addedPeriods.length == 1) {
                                            setClearTodaysTopic(true);
                                            setShowHomeworkForm(false);
                                          }
                                          const index = addedPeriods.indexOf(item);
                                          const newList = addedPeriods.slice();
                                          newList.splice(index, 1);
                                          setAddedPeriods(newList);
                                          if (!isDiaryEdit) {
                                            removeQuestion(index);
                                          }
                                          if (isDiaryEdit) {
                                            if (
                                              !editData?.periods_data
                                                ?.map((item) => item.id)
                                                .includes(item.id)
                                            )
                                              setEditRemovedPeriods([
                                                ...editRemovedPeriods,
                                                item,
                                              ]);
                                          }
                                        }}
                                      >
                                        X
                                      </div>
                                    </div>
                                  }
                                  key={index}
                                >
                                  <div
                                    className='row th-pointer'
                                    onClick={() => {
                                      subjectID
                                        ? showDrawer({ value: item })
                                        : message.error('Please select Subject first');
                                    }}
                                  >
                                    <div className='col-12 px-0'>
                                      {boardFilterArr.includes(window.location.host) && (
                                        <div className='row pt-3'>
                                          <div className='col-4 pr-0 th-fw-600'>
                                            Module :
                                          </div>
                                          <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                            {item?.chapter__lt_module__lt_module_name}
                                          </div>
                                        </div>
                                      )}
                                      <div className='row py-1'>
                                        <div className='col-4 pr-0 th-fw-600'>
                                          Chapter Name :
                                        </div>
                                        <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                          {item?.chapter__chapter_name}
                                        </div>
                                      </div>
                                      <div className='row pb-2'>
                                        <div className='col-4 pr-0 th-fw-600'>
                                          Key Concept :
                                        </div>
                                        <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                          {item?.key_concept__topic_name}
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-12 text-right pb-1'>
                                      <ArrowRightOutlined />
                                    </div>
                                  </div>
                                </Panel>
                              </Collapse>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className='col-md-5 py-2 th-bg-grey th-br-6 ml-2'
                      style={{ minHeight: '215px' }}
                    >
                      <div className='d-flex justify-content-between px-2 align-items-center'>
                        <div className=' px-0 th-black-2 th-fw-600 th-18'>
                          Upcoming Period
                        </div>
                        <div className='text-right px-1'>
                          {!_.isEmpty(upcomingPeriod) ? (
                            <span
                              className='th-12 px-1 th-red py-1 th-pointer th-br-6'
                              style={{
                                border: '1px solid red',
                              }}
                              onClick={() => {
                                setClearUpcomingPeriod((prevState) => !prevState);
                                if (addedPeriods.length == 0) {
                                  setClearTodaysTopic(true);
                                }
                                setUpcomingPeriod({});
                              }}
                            >
                              <DeleteOutlined className='mr-2' />
                              Delete
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className='row mt-1 th-br-6'
                        style={{
                          border: '1px solid #d9d9d9',
                          boxShadow: '0px 0px 6px 0px #0000005E',
                          height: '170px',
                        }}
                      >
                        {clearUpcomingPeriod ? (
                          <>
                            <div
                              className='row h-100 align-items-center th-pointer'
                              onClick={() =>
                                subjectID
                                  ? showDrawer({ data: true })
                                  : message.error('Please select Subject first')
                              }
                            >
                              <div className='col-12 text-center th-fw-500 th-black-2 th-pointer'>
                                <PlusOutlined className='mr-3' />
                                Add Today's Topic to get Upcoming Period
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            className='row th-pointer'
                            onClick={() => {
                              subjectID
                                ? showDrawer({ data: true, value: upcomingPeriod })
                                : message.error('Please select Subject first');
                            }}
                          >
                            {!_.isEmpty(upcomingPeriod) && (
                              <>
                                <div className='col-12 px-0'>
                                  <div
                                    className='row th-fw-600 align-items-center py-1 th-bg-pink'
                                    style={{ borderRadius: '6px 6px 0px 0px' }}
                                  >
                                    <div className='col-6 pr-0 th-18'>
                                      {upcomingPeriod?.period_name}
                                    </div>
                                    <div className='col-6 pl-0 text-right'>
                                      {upcomingPeriod?.completion_status?.filter(
                                        (item) => item?.section_id === sectionMappingID
                                      )[0]?.is_complete === true ? (
                                        <div className='d-flex flex-column'>
                                          <div className='th-10 th-grey-1'>
                                            Updated at
                                          </div>
                                          <div className='th-10 th-black-1'>
                                            {moment(
                                              upcomingPeriod?.completion_status?.filter(
                                                (item) =>
                                                  item?.section_id === sectionMappingID
                                              )[0]?.completed_at
                                            ).format('DD/MM/YYYY HH:mm a')}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  {boardFilterArr.includes(window.location.host) && (
                                    <div className='row pt-3'>
                                      <div className='col-4 pr-0 th-fw-600'>
                                        Module :{' '}
                                      </div>
                                      <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                        {
                                          upcomingPeriod?.chapter__lt_module__lt_module_name
                                        }
                                      </div>
                                    </div>
                                  )}
                                  <div className='row py-1'>
                                    <div className='col-4 pr-0 th-fw-600'>
                                      Chapter Name :{' '}
                                    </div>
                                    <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                      {upcomingPeriod?.chapter__chapter_name}
                                    </div>
                                  </div>
                                  <div className='row pb-2'>
                                    <div className='col-4 pr-0 th-fw-600'>
                                      Key Concept :{' '}
                                    </div>
                                    <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                      {upcomingPeriod?.key_concept__topic_name}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-12 text-right pb-1'>
                                  <ArrowRightOutlined />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-12 py-2'>
                    <span className='th-grey th-14'>
                      Upload Attachments (Accepted files: [ .jpeg,.jpg,.png,.pdf ])
                    </span>
                    <div
                      className='row justify-content-start align-items-center th-br-4 py-1 mt-1 th-bg-white'
                      style={{ border: '1px solid #D9D9D9' }}
                    >
                      <div className='col-8'>
                        <div className='row'>
                          {uploadedFiles?.map((item, index) => {
                            const fullName =
                              item?.split('_')[item?.split('_').length - 1];

                            const fileName =
                              fullName.split('.')[fullName?.split('.').length - 2];
                            const extension =
                              fullName.split('.')[fullName?.split('.').length - 1];

                            return (
                              <div className='th-br-15 col-md-3 col-5 px-1 px-md-3 py-2 th-bg-grey text-center d-flex align-items-center'>
                                <span className='th-12 th-black-1 text-truncate'>
                                  {fileName}
                                </span>
                                <span className='th-12 th-black-1 '>.{extension}</span>

                                <span className='ml-md-3 ml-1 th-pointer '>
                                  <img
                                    src={smallCloseIcon}
                                    onClick={() => handleRemoveUploadedFile(index)}
                                  />
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className='col-4 th-primary text-right th-pointer pl-0 pr-1 pr-md-2'>
                        <span onClick={handleShowModal}>
                          <span className='th-12'>
                            {' '}
                            <u>Upload</u>
                          </span>
                          <span className='ml-3 pb-2'>
                            <img src={uploadIcon} />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {subjectID && (
                  <div className='row px-3 py-2'>
                    {!showHomeworkForm ? (
                      <div
                        className='th-bg-grey th-black-1 px-2 py-1 th-pointer th-br-6'
                        style={{ border: '1px solid #d9d9d9' }}
                        onClick={() => {
                          setShowHomeworkForm(true);
                          if (hwMappingID) {
                            setHomeworkMapped(true);
                          }
                          if (addedPeriods.length > 0) {
                            // let lastPeriod = addedPeriods[addedPeriods.length - 1];
                            addedPeriods.map((el) => {
                              return fetchCentralHomework({
                                chapter: el?.chapter_id,
                                period: el?.period_name,
                                topic_id: el?.key_concept_id,
                              });
                            });
                          } else {
                            setQuestionList([
                              {
                                id: cuid(),
                                question: '',
                                attachments: [],
                                is_attachment_enable: false,
                                max_attachment: 2,
                                penTool: false,
                                is_central: false,
                              },
                            ]);
                          }
                        }}
                      >
                        <PlusOutlined className='mr-2' />
                        Add Homework
                      </div>
                    ) : (
                      !hwMappingID && (
                        <div
                          className='th-bg-primary th-white px-2 py-1 th-br-6 th-pointer'
                          onClick={() => {
                            setShowHomeworkForm(false);
                            setHomeworkMapped(false);
                          }}
                        >
                          Remove Homework <CloseCircleOutlined className='ml-2' />
                        </div>
                      )
                    )}
                  </div>
                )}
                {showHomeworkForm && (
                  <div className='row px-3 mt-3'>
                    <div
                      className='col-12 py-2 px-3 th-br-6'
                      style={{ border: '1px solid black' }}
                    >
                      <div className='row py-2'>
                        <div className='th-black-1 th-fw-600 pb-1'>Title</div>
                        <Input
                          className='th-width-100 th-br-6'
                          value={homeworkTitle}
                          onChange={(e) => setHomeworkTitle(e.target.value)}
                          placeholder='Enter Title'
                          maxLength={100}
                        />
                      </div>
                      {isAutoAssignDiary ? null : (
                        <div className='row py-2'>
                          <div className='th-black-1 th-fw-600 pb-1'>Instructions</div>
                          <Input
                            className='th-width-100 th-br-6'
                            value={homeworkInstructions}
                            onChange={(e) => setHomeworkInstructions(e.target.value)}
                            placeholder='Enter Instructions'
                            maxLength={250}
                          />
                        </div>
                      )}
                      <div className='row align-items-center'>
                        <span className='th-black-1 th-fw-600'>Due Date</span>
                        <span className='th-br-4 p-1 th-bg-grey ml-2'>
                          <DatePicker
                            disabledDate={(current) =>
                              current.isBefore(moment().subtract(1, 'day'))
                            }
                            allowClear={false}
                            placeholder={submissionDate}
                            placement='bottomLeft'
                            onChange={(event, value) => handleSubmissionDate(value)}
                            showToday={false}
                            suffixIcon={<DownOutlined className='th-black-1' />}
                            className='th-black-2 pl-0 th-date-picker'
                            format={'DD/MM/YYYY'}
                          />
                        </span>
                      </div>
                      <div className='row py-2'>
                        <div className='th-black-1 th-fw-600 pb-1'>Questions</div>
                        {questionList?.map((question, index) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            isEdit={isDiaryEdit || questionEdit || isAutoAssignDiary}
                            index={index}
                            addNewQuestion={addNewQuestion}
                            handleChange={handleChange}
                            removeQuestion={removeQuestion}
                            sessionYear={selectedAcademicYear?.id}
                            branch={selectedBranch?.branch?.id}
                            grade={gradeID}
                            subject={subjectID}
                            isCentralHomework={question?.is_central}
                            periodData={currentPeriodData}
                            allowAutoAssignDiary={allowAutoAssignDiary}
                          />
                        ))}
                      </div>
                      {showHomeworkForm && (
                        <div className='row'>
                          <div className='col-6'>
                            {questionList.length < 5 ? (
                              <Button
                                className='th-width-100 th-br-6 th-pointer'
                                onClick={() => {
                                  setQueIndexCounter(queIndexCounter + 1);
                                  addNewQuestion(queIndexCounter + 1);
                                }}
                              >
                                Add Another Question
                              </Button>
                            ) : null}
                          </div>
                          <div className='col-6'>
                            <Button
                              className='th-width-100 th-bg-primary th-white th-br-6 th-pointer'
                              onClick={handleAddHomeWork}
                            >
                              {homeworkMapped ? 'Update' : 'Finish'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(todaysAssessment.length > 0 || upcomingAssessment.length > 0) &&
                  subjectID && (
                    <div
                      className='row mx-3 th-br-6 mt-3'
                      style={{ border: '1px solid #d9d9d9' }}
                    >
                      <div
                        className='col-12 th-bg-blue-1 px-1'
                        style={{ borderRadius: '6px 6px 0px 0px' }}
                      >
                        <div className='row py-1 align-items-center'>
                          <img src={AssessmentIcon} className='mr-2 mb-1' />{' '}
                          <span className='th-fw-500'>Assessment</span>
                        </div>
                      </div>
                      <div
                        className='row py-1'
                        style={{ maxHeight: '25vh', overflowY: 'scroll' }}
                      >
                        {todaysAssessment.length > 0 &&
                          showAssessmentData(todaysAssessment)}
                        {upcomingAssessment.length > 0 &&
                          showAssessmentData(upcomingAssessment)}
                      </div>
                    </div>
                  )}
                {activityData.length > 0 && subjectID && (
                  <div
                    className='row mx-3 th-br-6 mt-3'
                    style={{ border: '1px solid #d9d9d9' }}
                  >
                    <div
                      className='col-12 th-bg-blue-1 px-1'
                      style={{ borderRadius: '6px 6px 0px 0px' }}
                    >
                      <div className='row py-1 align-items-center'>
                        <img src={AssessmentIcon} className='mr-2 mb-1' />{' '}
                        <span className='th-fw-500'>Activities</span>
                      </div>
                    </div>
                    <div
                      className='row py-1'
                      style={{ maxHeight: '25vh', overflowY: 'scroll' }}
                    >
                      {activityData.map((item) => (
                        <div className='col-sm-6 col-lg-4 px-1 mb-2'>
                          <div className='th-bg-grey py-1 px-2 th-br-6'>
                            <div className='row th-black-2 align-items-center py-1'>
                              <div className='col-4 px-0 d-flex justify-content-between th-black-1 th-fw-500'>
                                <span>Status </span>
                                <span>:&nbsp;</span>
                              </div>
                              <div className='col-8 pl-1 text-capitalize'>
                                {item?.activity_type?.name === 'Public Speaking' ? (
                                  <span
                                    className={`${
                                      item?.state == 'completed'
                                        ? 'th-green'
                                        : item?.state == 'ongoing'
                                        ? 'th-red th-fw-600'
                                        : 'th-primary'
                                    } text-capitalize`}
                                  >
                                    {item?.state}
                                  </span>
                                ) : (
                                  <span
                                    className={`${
                                      moment(moment(), 'hh:mm A').isBefore(
                                        moment(item?.submission_date, 'hh:mm A')
                                      )
                                        ? 'th-primary'
                                        : 'th-green'
                                    } text-capitalize`}
                                  >
                                    {moment(moment(), 'hh:mm A').isBefore(
                                      moment(item?.submission_date, 'hh:mm A')
                                    )
                                      ? 'Upcoming'
                                      : 'Completed'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className='row th-black-2 align-items-center py-1'>
                              <div className='col-4 px-0 d-flex justify-content-between th-black-1 th-fw-500'>
                                <span>Activity Type</span>
                                <span>:&nbsp;</span>
                              </div>
                              <div className='col-8 pl-1 text-truncate'>
                                <Tag color={getActivityColor(item?.activity_type?.name)}>
                                  {item?.activity_type?.name}
                                </Tag>
                              </div>
                            </div>
                            <div className='row th-black-2 align-items-center py-1'>
                              <div className='col-4 px-0 d-flex justify-content-between th-black-1 th-fw-500'>
                                <span>Title</span>
                                <span>:&nbsp;</span>
                              </div>
                              <div className='col-8 pl-1 text-truncate'>
                                {item?.name ? item?.name : item?.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className='row py-2'>
                  <div className='col-3 th-black-2'>Note (Optional)</div>
                  <div className='col-12 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder='Write Something'
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>

                <div className='row pt-3'>
                  <div className='col-md-2 col-6'>
                    <Button
                      className='th-width-100 th-br-6 th-pointer'
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>
                  <div className='col-md-2 col-6'>
                    <Button
                      className='th-width-100 th-bg-primary th-white th-br-6 th-pointer'
                      onClick={isDiaryEdit ? handleEdit : handleSubmit}
                      loading={requestSent}
                    >
                      {isDiaryEdit ? 'Update' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </div>{' '}
            </>
          )}
        </div>
      </div>
      <Drawer
        placement='right'
        className='th-diaryDrawer'
        zIndex={1300}
        title={
          <div className='row th-bg-grey py-2 th-fw-600'>
            <div className='col-10 '>Details </div>
            <div className='col-2 text-right'>
              <CloseOutlined onClick={closeDrawer} />
            </div>
          </div>
        }
        onClose={closeDrawer}
        visible={drawerVisible}
        closable={false}
        width={window.innerWidth < 768 ? '95vw' : '450px'}
      >
        <div className='th-bg-white'>
          <div className='row align-items-center th-fw-700 th-18 th-black-2 text-capitalize'>
            <div className='col-6'>
              {gradeName}
              {sectionName}
            </div>
            <div className='col-6 text-right'>{subjectName}</div>
          </div>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              <div className='col-3 th-primary th-fw-600 pr-0'>Chapter</div>
              <div className='col-9 pt-2'>
                <Form.Item name='chapter'>
                  <Select
                    // disabled={isDiaryEdit}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleChapter(value)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder={
                      chapterName ? (
                        <div className='th-black-2'>{chapterName}</div>
                      ) : (
                        'Select Chapter'
                      )
                    }
                    allowClear
                    showSearch
                    value={chapterID}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {chapterOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className='row align-items-center'>
              <div className='col-3 pr-0 th-primary th-fw-600'>Key Concept</div>
              <div className='col-9 pt-2'>
                <Form.Item name='key_concept'>
                  <Select
                    // disabled={isDiaryEdit}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleKeyConcept(value)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder={
                      keyConceptName ? (
                        <div className='th-black-2'>{keyConceptName}</div>
                      ) : (
                        'Select Key Concept'
                      )
                    }
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {keyConceptOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
          <div className='row'>
            {loadingDrawer ? (
              <div className='text-center w-100 mt-5'>
                <Spin tip='Loading...' />
              </div>
            ) : resourcesData.length > 0 ? (
              resourcesData.map((item, i) => {
                return (
                  <div className='row'>
                    <Collapse
                      activeKey={currentPeriodPanel}
                      expandIconPosition='right'
                      bordered={true}
                      className='th-br-6 my-2 th-bg-grey th-width-100'
                      style={{ border: '1px solid #d9d9d9' }}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      onChange={() => setCurrentPeriodPanel(i)}
                    >
                      <Panel
                        collapsible={true}
                        header={
                          <div className='row'>
                            <div className='th-black-1 px-0 col-12 pl-0'>
                              <div className='row justify-content-between'>
                                <span className='th-fw-500'>{item.period_name} </span>
                              </div>
                            </div>
                          </div>
                        }
                        key={i}
                      >
                        {boardFilterArr.includes(window.location.host) && (
                          <div className='row mt-1 th-fw-600'>
                            <div className='col-3 col-md-2 th-black-1 px-0'>
                              <div className='row justify-content-between'>
                                <span>Module</span>
                                <span>:&nbsp;</span>
                              </div>
                            </div>

                            <div className='col-9 col-md-10 text-truncate th-primary px-0'>
                              {item?.chapter__lt_module__lt_module_name}
                            </div>
                          </div>
                        )}
                        <div className='row mt-2 th-fw-600'>
                          <div className='col-3 col-md-2 th-black-1 px-0'>
                            <div className='row justify-content-between'>
                              <span>Chapter</span>
                              <span>:&nbsp;</span>
                            </div>
                          </div>

                          <div className='col-9 col-md-10 text-truncate th-primary px-0'>
                            {item?.chapter__chapter_name}
                          </div>
                        </div>
                        <div className='row mt-2 th-fw-600'>
                          <div className='col-3 th-black-1 px-0'>
                            <div className='row justify-content-between'>
                              <span>Key Concept</span>
                              <span>:&nbsp;</span>
                            </div>
                          </div>

                          <div className='col-9 text-truncate th-primary px-0'>
                            {item?.key_concept__topic_name}
                          </div>
                        </div>
                        <hr className='mt-1' />
                        <div className='row mb-2 align-items-center'>
                          <div className='col-12 col-sm-6 th-black-2 pl-0'>
                            <div className='row'>
                              Status :{' '}
                              {isAutoAssignDiary ? (
                                (
                                  Array.isArray(sectionMappingID)
                                    ? sectionMappingID.every((val) =>
                                        item?.completion_status
                                          ?.filter((item) => item?.is_complete === true)
                                          ?.map((item) => item?.section_id)
                                          .includes(val)
                                      )
                                    : item?.completion_status?.filter(
                                        (item) => item?.section_id === sectionMappingID
                                      )[0]?.is_complete == true
                                ) ? (
                                  <span className='th-green th-fw-500'>
                                    &nbsp;Completed
                                  </span>
                                ) : (
                                  <span className='th-fw-500 th-red'>
                                    &nbsp;Not Completed for sections&nbsp;
                                    {item?.completion_status
                                      ?.filter((item) => item?.is_complete === false)
                                      ?.map((item) => item?.section_name?.slice(-1))
                                      .join(', ')}
                                  </span>
                                )
                              ) : item?.completion_status?.filter(
                                  (item) => item?.section_id === sectionMappingID
                                )[0]?.is_complete === true ? (
                                <span>
                                  <span className='th-green th-fw-500'>
                                    &nbsp;Completed
                                  </span>
                                </span>
                              ) : (
                                <span className='th-fw-500 th-red'>
                                  &nbsp;Not Completed
                                </span>
                              )}
                            </div>
                          </div>
                          {/* {item?.completion_status?.filter(
                              (item) => item?.section_id === sectionMappingID
                            )[0]?.is_complete === true ? (
                              <div className='row th-black-2 '>
                                <div className='col-12 th-grey pl-0 th-12'>
                                  Updated at{' '}
                                  {getTimeInterval(
                                    item?.completion_status?.filter(
                                      (item) => item?.section_id === sectionMappingID
                                    )[0]?.completed_at
                                  )}
                                </div>
                              </div>
                            ) : null} */}

                          <div className='col-12 col-sm-6 pl-0'>
                            {isAutoAssignDiary ? (
                              Array.isArray(sectionMappingID) ? (
                                sectionMappingID?.every((val) =>
                                  item?.completion_status
                                    ?.filter((item) => item?.is_complete === true)
                                    ?.map((item) => item?.section_id)
                                    .includes(val)
                                )
                              ) : item?.completion_status?.filter(
                                  (item) => item?.section_id === sectionMappingID
                                )[0]?.is_complete === true ? null : (
                                <div className='th-bg-green-2 px-2 py-1 th-br-6'>
                                  <Checkbox
                                    onChange={() => {
                                      markPeriodComplete(item);
                                    }}
                                    className='th-green th-fw-500'
                                  >
                                    Mark Complete
                                  </Checkbox>
                                </div>
                              )
                            ) : item?.completion_status?.filter(
                                (item) => item?.section_id === sectionMappingID
                              )[0]?.is_complete === true ? null : (
                              <div className='th-bg-green-2 px-2 py-1 th-br-6'>
                                <Checkbox
                                  onChange={() => markPeriodComplete(item)}
                                  className='th-green th-fw-500'
                                >
                                  Mark Complete
                                </Checkbox>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='row th-black-2 mt-1 '>
                          <div className='col-12 th-primary pl-0 th-12'>
                            {addingUpcomingPeriod ? (
                              addedPeriods
                                .map((item) => item?.id)
                                .includes(item?.id) ? null : (
                                <div className='row align-items-center th-bg-primary py-2 th-br-4'>
                                  <div className='col-8 th-white'>
                                    {upcomingPeriod?.id == item?.id
                                      ? 'Period Added as Upcoming Period'
                                      : 'Add this Period as Upcoming Period'}
                                  </div>

                                  <div className='col-4 pl-0 text-center th-fw-600'>
                                    {upcomingPeriod?.id == item?.id ? (
                                      <div
                                        className='th-bg-white th-red py-1 px-2 th-br-6 th-pointer'
                                        onClick={() => {
                                          setIsPeriodAdded(false);
                                          setCompletedPeriod(item);
                                          openPeriodInfoModal();
                                          setUpcomingPeriod({});
                                          setClearUpcomingPeriod(true);
                                        }}
                                      >
                                        Remove
                                      </div>
                                    ) : (
                                      !addedPeriods
                                        .map((item) => item?.id)
                                        .includes(item?.id) && (
                                        <div
                                          className='th-bg-white th-primary py-1 px-2 th-br-6 th-pointer'
                                          onClick={() => {
                                            setIsPeriodAdded(true);
                                            setCompletedPeriod(item);
                                            openPeriodInfoModal();
                                            setClearUpcomingPeriod(false);
                                            setUpcomingPeriod(item);
                                          }}
                                        >
                                          Add
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className='row align-items-center th-bg-primary py-2 th-br-4'>
                                <div className='col-8 th-white'>
                                  {addedPeriods?.map((item) => item.id).includes(item.id)
                                    ? 'Period Added to Diary'
                                    : 'Add this Period to Diary'}
                                </div>

                                <div className='col-4 pl-0 text-center th-fw-600'>
                                  {addedPeriods
                                    ?.map((item) => item.id)
                                    .includes(item.id) ? (
                                    <div
                                      className='th-bg-white th-red py-1 px-2 th-br-6 th-pointer'
                                      onClick={() => {
                                        setIsPeriodAdded(false);
                                        setCompletedPeriod(item);
                                        openPeriodInfoModal();
                                        if (addedPeriods.length == 1) {
                                          setClearTodaysTopic(true);
                                        }
                                        const index = addedPeriods
                                          .map((item) => item.id)
                                          .indexOf(item.id);
                                        const newList = addedPeriods.slice();
                                        newList.splice(index, 1);
                                        setAddedPeriods(newList);
                                        removeQuestion(index);
                                      }}
                                    >
                                      Remove
                                    </div>
                                  ) : (
                                    <div
                                      className='th-bg-white th-primary py-1 px-2 th-br-6 th-pointer'
                                      onClick={() => {
                                        // if(item?.)isAutoAssignDiary && item?.completion_status.every((item) => item?.is_complete == true) &&
                                        if (isAutoAssignDiary) {
                                          if (
                                            // item?.completion_status.filter(
                                            //   (item) => item?.is_complete == false
                                            // ).length == 0
                                            Array.isArray(sectionMappingID)
                                              ? sectionMappingID.every((val) =>
                                                  item?.completion_status
                                                    ?.filter(
                                                      (item) => item?.is_complete === true
                                                    )
                                                    ?.map((item) => item?.section_id)
                                                    .includes(val)
                                                )
                                              : item?.completion_status?.filter(
                                                  (item) =>
                                                    item?.section_id === sectionMappingID
                                                )[0]?.is_complete == true
                                          ) {
                                            if (
                                              !addedPeriods
                                                ?.map((item) => item.id)
                                                .includes(item.id) ||
                                              upcomingPeriod.id !== item.id
                                            ) {
                                              setIsPeriodAdded(true);
                                              setClearTodaysTopic(false);
                                              setCompletedPeriod(item);
                                              openPeriodInfoModal();
                                              setAddedPeriods([...addedPeriods, item]);
                                              setSelectedChapterTopic([
                                                ...selectedChapterTopic,
                                                {
                                                  chapter: item?.chapter__chapter_name,
                                                  keyConcept:
                                                    item?.key_concept__topic_name,
                                                },
                                              ]);
                                            } else {
                                              message.warning(
                                                "Period is already added to Today's Topic"
                                              );
                                            }
                                            if (isDiaryEdit && !addingUpcomingPeriod) {
                                              setEditAddedPeriods([
                                                ...editAddedPeriods,
                                                item,
                                              ]);
                                            }
                                          } else {
                                            message.error(
                                              'Please complete the period before adding'
                                            );
                                          }
                                        } else {
                                          if (
                                            !addedPeriods
                                              ?.map((item) => item.id)
                                              .includes(item.id) ||
                                            upcomingPeriod.id !== item.id
                                          ) {
                                            setIsPeriodAdded(true);
                                            setClearTodaysTopic(false);
                                            setCompletedPeriod(item);
                                            openPeriodInfoModal();
                                            setAddedPeriods([...addedPeriods, item]);
                                            setSelectedChapterTopic([
                                              ...selectedChapterTopic,
                                              {
                                                chapter: item?.chapter__chapter_name,
                                                keyConcept: item?.key_concept__topic_name,
                                              },
                                            ]);
                                          } else {
                                            message.warning(
                                              "Period is already added to Today's Topic"
                                            );
                                          }
                                          if (isDiaryEdit && !addingUpcomingPeriod) {
                                            setEditAddedPeriods([
                                              ...editAddedPeriods,
                                              item,
                                            ]);
                                          }
                                        }
                                      }}
                                    >
                                      Add to Diary
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                );
              })
            ) : (
              <div className='row justify-content-center mt-5'>
                <img src={NoDataIcon} />
              </div>
            )}
          </div>
        </div>
      </Drawer>
      <Modal
        visible={showPeriodInfoModal}
        onCancel={closePeriodInfoModal}
        className='th-upload-modal'
        centered
        footer={false}
        closeIcon={<CloseOutlined className='th-black-1' />}
        closable={true}
      >
        <div
          className='row py-4 align-items-center'
          style={{ color: isPeriodAdded ? '#25A53F' : 'red' }}
        >
          <div className='col-2'>
            <div
              style={{
                border: `2px solid ${isPeriodAdded ? '#25A53F' : 'red'}`,
                borderRadius: '50%',
                width: 50,
                height: 50,
                position: 'relative',
              }}
            >
              {isPeriodAdded ? (
                <img src={tickIcon} height={50} />
              ) : (
                <img
                  src={deleteIcon}
                  height={30}
                  style={{
                    position: 'relative',
                    left: '20%',
                    top: '10%',
                  }}
                />
              )}
            </div>
          </div>

          <div className='col-10 th-20'>
            {isPeriodAdded ? (
              <span>'{completedPeriod.period_name}' added to Diary Successfully</span>
            ) : (
              <span>'{completedPeriod.period_name}' removed from Diary</span>
            )}
          </div>
        </div>
      </Modal>
      <UploadDocument
        show={showUploadModal}
        branchName={selectedBranch?.branch?.branch_name}
        gradeID={gradeID}
        handleClose={handleUploadModalClose}
        setUploadedFiles={handleUploadedFiles}
      />
    </div>
    // </Layout>
  );
};

export default DailyDiary;
