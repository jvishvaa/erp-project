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
  ReloadOutlined,
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
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import _ from 'lodash';
let boardFilterArr = [
  'orchids.letseduvate.com',
  'localhost:3000',
  'dev.olvorchidnaigaon.letseduvate.com',
  'ui-revamp1.letseduvate.com',
  'qa.olvorchidnaigaon.letseduvate.com',
];
const { Panel } = Collapse;
const DailyDiary = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const dispatch = useDispatch();
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const [hwId, sethwId] = useState();
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
  const [periodID, setPeriodID] = useState();
  const [assignedHomework, setAssignedHomework] = useState('');
  const [assignedHomeworkModal, setAssignedHomeworkModal] = useState('');
  const [declined, setDeclined] = useState(false);
  const [hwMappingID, setHwMappingID] = useState();
  const [isDiaryEdit, setIsDiaryEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [diaryID, setDiaryID] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkInstructions, setHomeworkInstructions] = useState('');
  const [showIcon, setShowIcon] = useState(false);
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const [homeworkCreated, setHomeworkCreated] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(moment().format('YYYY-MM-DD'));
  const [homeworkDetails, setHomeworkDetails] = useState(false);
  const [questionEdit, setQuestionEdit] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const formRef = createRef();
  const history = useHistory();

  let editData = '';
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
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
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

  const closeAssignedHomeworkModal = () => {
    setAssignedHomeworkModal(false);
    setDeclined(true);
  };
  const showDrawer = (params = {}) => {
    setAddingUpcomingPeriod(false);
    setDrawerVisible(true);
    if (params.data) {
      setAddingUpcomingPeriod(true);
    }
    // if (keyConceptID) {
    if (!_.isEmpty(params.value)) {
      setPeriodID(params.value?.id);
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
    }
    //  else {
    //   fetchLessonResourcesData({
    //     grade: gradeID,
    //     acad_session_id: selectedBranch?.id,
    //     chapters: chapterID,
    //     subject: subjectID,
    //     central_gs_id: Number(gsMappingID),
    //     for_diary: 1,
    //     key_concepts: Number(keyConceptID),
    //   });
    // }
    // }
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
    }
    if (editRemovedPeriods.length > 0) {
      payload['remove_period_ids'] = editRemovedPeriods.map((item) => item.id).toString();
    }
    // if (editData?.periods_data.length > 0) {
    //   payload['remove_period_ids'] = editRemovedPeriods.map((item) => item.id).toString();
    // }
    if (!_.isEmpty(upcomingPeriod) && !clearUpcomingPeriod) {
      payload['upcoming_period_id'] = upcomingPeriod?.id;
    } else {
      payload['upcoming_period_id'] = null;
    }
    if (hwMappingID) {
      payload['hw_dairy_mapping_id'] = hwMappingID;
    }
    axios
      .put(
        `${endpoints?.dailyDiary?.updateDelete}${diaryID}/update-delete-dairy/`,
        payload
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          message.success('Daily Diary Edited Successfully');

          history.push('/diary/teacher');
        }
      })
      .catch((error) => {
        message.error('Something went wrong');
      });
  };
  const handleSubmit = () => {
    if (showHomeworkForm && !homeworkCreated) {
      message.error('Please finish the homework first');
      return;
    }

    if (!gradeID) {
      message.error('Please select Grade');
      return;
    }
    if (!sectionID) {
      message.error('Please select Section');
      return;
    }
    if (!subjectID) {
      message.error('Please select Subject');
      return;
    }
    // if (addedPeriods.length < 1) {
    //   message.error("Please add Today's Topic");
    //   return;
    // }
    // if (!chapterID) {
    //   message.error('Please select Chapter');
    //   return;
    // }
    setLoading(true);
    let payload = {
      academic_year: acadID,
      branch: branchID,
      module_id: moduleId,
      grade: [gradeID],
      section: [sectionID],
      section_mapping: [sectionMappingID],
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
    if (hwMappingID) {
      payload['hw_dairy_mapping_id'] = hwMappingID;
    }
    if (addedPeriods.length > 0 && !clearTodaysTopic) {
      payload['period_added_ids'] = addedPeriods.map((item) => item.id).toString();
    }
    if (!_.isEmpty(upcomingPeriod)) {
      payload['upcoming_period_id'] = upcomingPeriod?.id;
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
              history.push('/diary/teacher');
            } else if (res?.data?.message.includes('locked')) {
              message.error(res?.data?.message);
            } else {
              message.error('Daily Diary Already Exists');
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error?.message);
        });
    } else {
      message.error("Please enter either of Today's Topic, Homework or Notes");
      setLoading(false);
      return;
    }

    // if (hwMappingID) {
    //   payload['hw_dairy_mapping_id'] = hwMappingID;
    // }
    // axios
    //   .post(`${endpoints?.dailyDiary?.createDiary}`, payload)
    //   .then((res) => {
    //     if (res?.data?.status_code == 200) {
    //       setLoading(false);
    //       if (res?.data?.message === 'Daily Dairy created successfully') {
    //         message.success('Daily Diary Created Succssfully');
    //         history.push('/diary/teacher');
    //       } else {
    //         message.error('Daily Diary Already Exists');
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     message.error(error?.message);
    //   });
  };

  const handleClearGrade = () => {
    setSectionDropdown([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
  };

  const handleClearSection = () => {
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setSectionMappingID();
    setSectionID();
    setSubjectID();
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
      // setChapterName(e.children);
      // fetchKeyConceptListData({
      //   chapter_id: e.value,
      // });
    }
  };
  const handleKeyConcept = (e) => {
    if (e) {
      setKeyConceptID(e.value);
      setGSMappingID(e.gsMappingId);
      // setKeyConceptName(e.children);
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
    if (e) {
      setSubjectID(e.value);
      setSubjectName(e.children.split('_')[e.children.split('_').length - 1]);
      setDeclined(false);
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
    formRef.current.setFieldsValue({
      subject: null,
      chapter: null,
    });
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
        .get(`${endpoints.academics.subjects}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setSubjectDropdown(result?.data?.data);
          }
        })
        .catch((error) => message.error('error', error?.message));
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
      section: null,
      subject: null,
    });
    setSectionDropdown([]);
    if (e) {
      setGradeID(e.value);
      setGradeName(e.children);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: e.value,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.sections}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setSectionDropdown(result?.data?.data);
          }
        })
        .catch((error) => message.error('error', error?.message));
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

  const checkAssignedHomework = (params = {}) => {
    axios
      .get(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            setAssignedHomework(result?.data?.data);
            // mapAssignedHomework();
          }
          setShowIcon(true);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const fetchUpcomigPeriod = (periodID) => {
    const params = {
      current_period_ids: periodID,
      section_mapping: sectionMappingID,
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
              return;
            } else {
              setClearUpcomingPeriod(false);
              setUpcomingPeriod(response?.data?.data[0]);
            }
          }
        }
        setShowIcon(true);
        // }
      })
      .catch((error) => message.error('error', error?.message));
  };
  useEffect(() => {
    if (assignedHomework) {
      mapAssignedHomework();
    }
  }, [assignedHomework]);

  useEffect(() => {
    if (addedPeriods.length > 0) {
      if (isDiaryEdit && !_.isEmpty(editData?.up_coming_period)) {
        fetchUpcomigPeriod(addedPeriods[addedPeriods.length - 1].id);
      } else {
        fetchUpcomigPeriod(addedPeriods[addedPeriods.length - 1].id);
      }
      setCurrentPanel(addedPeriods.length - 1);
    } else {
      setUpcomingPeriod({});
      setClearUpcomingPeriod(true);
      setChapterID();
      setChapterName();
      setKeyConceptID();
      setKeyConceptName();
    }
  }, [addedPeriods]);

  const mapAssignedHomework = () => {
    setQuestionEdit(true);
    axios
      .post(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, {
        hw_id: assignedHomework[0]?.id,
      })
      .then((result) => {
        if (result?.data?.status_code == 201) {
          setHwMappingID(result?.data?.data?.hw_dairy_mapping_id);
          setAssignedHomeworkModal(false);
          setHomework(assignedHomework[0].homework_name);
          axios
            .get(`academic/${assignedHomework[0]?.id}/hw-questions/?hw_status=1`)
            .then((result) => {
              if (result?.data?.status_code == 200) {
                setHomeworkDetails(result?.data?.data);
                setShowHomeworkForm(true);
                if (!isDiaryEdit) {
                  setHomeworkCreated(true);
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
    if (!homeworkTitle) {
      message.error('Please fill Homework Title');
      return;
    }
    if (!homeworkInstructions) {
      message.error('Please fill Homework Instructions');
      return;
    }
    if (!questionList[0].question) {
      message.error('Please add questions');
      return;
    }
    setQuestionEdit(true);
    const reqObj = {
      name: homeworkTitle,
      description: homeworkInstructions,
      section_mapping: [sectionMappingID],
      subject: subjectID,
      date: moment().format('YYYY-MM-DD'),
      last_submission_date: submissionDate,
      questions: questionList.map((q) => {
        const qObj = q;
        delete qObj.errors;
        delete qObj.id;
        return qObj;
      }),
    };

    try {
      const response = await dispatch(addHomeWork(reqObj, isEdit, hwId));
      message.success('Homework added');
      // setShowHomeworkForm(false);
      checkAssignedHomework({
        section_mapping: sectionMappingID,
        subject: subjectID,
        date: moment().format('YYYY-MM-DD'),
        // user_id: user_id,
      });
      // setHomeworkTitle('');
      // setHomeworkInstructions('');
      setHomeworkCreated(true);

      setQuestionList(reqObj?.questions);

      // history.goBack();
    } catch (error) {
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
            sethwId(result?.data?.data[0]?.id);
            axios
              .get(`academic/${result?.data?.data[0]?.id}/hw-questions/?hw_status=1`)
              .then((result) => {
                if (result?.data?.status_code == 200) {
                  setHomeworkDetails(result?.data?.data);
                  setShowHomeworkForm(true);
                  setIsEdit(true);
                }
              })
              .catch((error) => message.error('error', error?.message));
          } else {
            setShowIcon(true);
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
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchGradeData();
      fetchResourceYear();
    }
  }, [moduleId]);
  useEffect(() => {
    if (history?.location?.state?.data) {
      let editData = history.location.state.data;
      let editSubject = history.location.state.subject;
      setIsDiaryEdit(history?.location?.state?.isDiaryEdit);
      setDiaryID(history.location.state.data?.diary_id);
      formRef.current.setFieldsValue({
        grade: editData?.grade_name,
        section: editData?.section_name,
        subject: editSubject?.subject_name,
        // chapter: editData?.chapter[0]?.chapter_name,
      });
      setAcadID(editData?.academic_year_id);
      setBranchID(editData?.branch_id);
      setGradeID(editData?.grade_id);
      setGradeName(editData?.grade_name);
      setSectionName(editData?.section_name.slice(-1).toUpperCase());
      setSectionID(editData?.section_id);
      setSectionMappingID(editData?.section_mapping_id);
      setSubjectID(editSubject?.subject_id);
      setSubjectName(editSubject?.subject_name);
      if (editData?.periods_data.length > 0) {
        setClearTodaysTopic(false);
        setAddedPeriods(editData?.periods_data);
        setCurrentPanel(0);
      }
      if (!_.isEmpty(editData?.up_coming_period)) {
        setClearUpcomingPeriod(false);
        setUpcomingPeriod(editData?.up_coming_period);
      }
      // setRecap(editData?.teacher_report?.previous_class);
      // setClasswork(editData?.teacher_report?.class_work);
      setSummary(editData?.teacher_report?.summary);
      // setTools(editData?.teacher_report?.tools_used);
      setHomework(editData?.teacher_report?.homework);
      setUploadedFiles(editData?.documents);
      if (editData?.teacher_report?.homework) {
        setHomeworkCreated(false);
        fetchHomeworkDetails({
          section_mapping: editData?.section_mapping_id,
          subject: editSubject?.subject_id,
          date: moment(editData?.created_at).format('YYYY-MM-DD'),
        });
        checkAssignedHomework({
          section_mapping: editData?.section_mapping_id,
          subject: editSubject?.subject_id,
          date: moment(editData?.created_at).format('YYYY-MM-DD'),
        });
      }
      fetchChapterDropdown({
        branch_id: selectedBranch.branch.id,
        subject_id: editSubject?.subject_id,
        grade_id: editData?.grade_id,
      });
    }
  }, []);

  useEffect(() => {
    if (homeworkDetails) {
      setQuestionList(questionModify(homeworkDetails?.hw_questions));
      setSubmissionDate(moment(homeworkDetails?.last_submission_dt).format('YYYY-MM-DD'));
      setHomeworkTitle(homeworkDetails?.homework_name);
      setHomeworkInstructions(homeworkDetails?.description);
    }
  }, [homeworkDetails]);

  useEffect(() => {
    if (showPeriodInfoModal) {
      setTimeout(() => {
        closePeriodInfoModal();
      }, 2000);
      // closePeriodInfoModal();
    }
  }, [showPeriodInfoModal]);
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
                    disabled={isDiaryEdit}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleGrade(value)}
                    placeholder='Grade'
                    allowClear
                    onClear={handleClearGrade}
                    showSearch
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
                    disabled={isDiaryEdit}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleSection(value)}
                    placeholder='Section'
                    allowClear
                    onClear={handleClearSection}
                    showSearch
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
                    disabled={isDiaryEdit}
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleSubject(value)}
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
                      <div className='row px-2 align-items-center'>
                        <div className='col-6 px-0 th-black-2 th-fw-600 th-18'>
                          Today's Topic
                        </div>
                        <div className='col-6 text-right pr-0'>
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
                          {/* {addedPeriods.length > 0 ? (
                            <span
                              className='th-12 px-1 th-red py-1 th-pointer th-br-6'
                              style={{ border: '1px solid red' }}
                              onClick={() =>
                                setClearTodaysTopic((prevState) => !prevState)
                              }
                            >
                              {clearTodaysTopic ? (
                                <>
                                  <ReloadOutlined className='mr-2' />
                                  Redo
                                </>
                              ) : (
                                <>
                                  <DeleteOutlined className='mr-2' />
                                  Delete
                                </>
                              )}
                            </span>
                          ) : null} */}
                        </div>
                      </div>

                      {clearTodaysTopic ? (
                        <div
                          // className='row h-100 align-items-center th-pointer'
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
                                        className='col-1 pr-0'
                                        onClick={() => {
                                          setIsPeriodAdded(false);
                                          setCompletedPeriod(item);
                                          openPeriodInfoModal();
                                          if (addedPeriods.length == 1) {
                                            setClearTodaysTopic(true);
                                          }
                                          const index = addedPeriods.indexOf(item);
                                          const newList = addedPeriods.slice();
                                          newList.splice(index, 1);
                                          setAddedPeriods(newList);
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
                      className='col-md-5 py-2 th-bg-grey th-br-6 ml-3'
                      style={{ height: '215px' }}
                    >
                      <div className='row px-2 align-items-center'>
                        <div className='col-sm-6 col-8 px-0 th-black-2 th-fw-600 th-18'>
                          Upcoming Period
                        </div>
                        <div className='col-sm-6 col-4 text-right pr-0'>
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
                              {/* {clearUpcomingPeriod ? (
                                <>
                                  <ReloadOutlined className='mr-2' />
                                  Redo
                                </>
                              ) : (
                                <> */}
                              <DeleteOutlined className='mr-2' />
                              Delete
                              {/* </>
                              )} */}
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
                              // setKeyConceptID()
                              subjectID
                                ? showDrawer({ data: true, value: upcomingPeriod })
                                : message.error('Please select Subject first');
                            }}
                          >
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
                                      <div className='th-10 th-grey-1'>Updated at</div>
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
                                  <div className='col-4 pr-0 th-fw-600'>Module : </div>
                                  <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                    {upcomingPeriod?.chapter__lt_module__lt_module_name}
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
                                <div className='col-4 pr-0 th-fw-600'>Key Concept : </div>
                                <div className='col-8 pl-0 th-grey-1 text-truncate'>
                                  {upcomingPeriod?.key_concept__topic_name}
                                </div>
                              </div>
                            </div>
                            <div className='col-12 text-right pb-1'>
                              <ArrowRightOutlined />
                            </div>
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
                    {assignedHomework ? (
                      <div
                        className='th-fw-600 th-black-1 px-2'
                        onClick={() => setShowHomeworkForm(true)}
                      >
                        Homework
                      </div>
                    ) : !showHomeworkForm ? (
                      <div
                        className='th-bg-grey th-black-1 px-2 py-1 th-pointer'
                        style={{ border: '1px solid #d9d9d9' }}
                        onClick={() => setShowHomeworkForm(true)}
                      >
                        <PlusOutlined className='mr-2' />
                        Add Homework
                      </div>
                    ) : (
                      <div
                        className='th-bg-primary th-white px-2 py-1'
                        onClick={() => setShowHomeworkForm(false)}
                      >
                        Remove Homework <CloseCircleOutlined className='ml-2' />
                      </div>
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
                          maxLength={30}
                        />
                      </div>
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
                            isEdit={isDiaryEdit || questionEdit}
                            index={index}
                            addNewQuestion={addNewQuestion}
                            handleChange={handleChange}
                            removeQuestion={removeQuestion}
                            sessionYear={selectedAcademicYear?.id}
                            branch={selectedBranch?.branch?.id}
                            grade={gradeID}
                            subject={subjectID}
                          />
                        ))}
                      </div>
                      {!homeworkCreated && (
                        <div className='row'>
                          <div className='col-6'>
                            <Button
                              className='th-width-100 th-br-6 th-pointer'
                              onClick={() => {
                                setQueIndexCounter(queIndexCounter + 1);
                                addNewQuestion(queIndexCounter + 1);
                              }}
                            >
                              Add Another Question
                            </Button>
                          </div>
                          <div className='col-6'>
                            <Button
                              className='th-width-100 th-bg-primary th-white th-br-6 th-pointer'
                              onClick={handleAddHomeWork}
                            >
                              {isDiaryEdit ? 'Update' : 'Finish'}
                            </Button>
                          </div>
                        </div>
                      )}
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
                              {item?.completion_status?.filter(
                                (item) => item?.section_id === sectionMappingID
                              )[0].is_complete === true ? (
                                <span>
                                  <span className='th-green th-fw-500'> Completed</span>
                                </span>
                              ) : (
                                <span className='th-fw-500 th-red'> Not Completed</span>
                              )}
                            </div>
                            {item?.completion_status?.filter(
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
                            ) : null}
                          </div>
                          <div className='col-12 col-sm-6 pl-0'>
                            {item?.completion_status?.filter(
                              (item) => item?.section_id === sectionMappingID
                            )[0].is_complete == false && (
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
                                .map((item) => item.id)
                                .includes(item.id) ? null : (
                                <div className='row align-items-center th-bg-primary py-2 th-br-4'>
                                  <div className='col-8 th-white'>
                                    {upcomingPeriod.id == item.id
                                      ? 'Period Added as Upcoming Period'
                                      : 'Add this Period as Upcoming Period'}
                                  </div>

                                  <div className='col-4 pl-0 text-center th-fw-600'>
                                    {upcomingPeriod.id == item.id ? (
                                      <div
                                        className='th-bg-white th-red py-1 px-2 th-br-6 th-pointer'
                                        onClick={() => {
                                          setIsPeriodAdded(false);
                                          setCompletedPeriod(item);
                                          openPeriodInfoModal();
                                          setUpcomingPeriod({});
                                        }}
                                      >
                                        Remove
                                      </div>
                                    ) : (
                                      !addedPeriods
                                        .map((item) => item.id)
                                        .includes(item.id) && (
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
                                      }}
                                    >
                                      Remove
                                    </div>
                                  ) : (
                                    <div
                                      className='th-bg-white th-primary py-1 px-2 th-br-6 th-pointer'
                                      onClick={() => {
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
