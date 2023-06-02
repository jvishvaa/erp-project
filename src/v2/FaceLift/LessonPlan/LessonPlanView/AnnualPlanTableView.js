import React, { useState, useEffect, createRef } from 'react';
import {
  Table,
  Drawer,
  Space,
  Form,
  Select,
  message,
  Collapse,
  Button,
  Modal,
  Spin,
  Tooltip,
  Badge,
  Pagination,
  Tag,
  Popconfirm,
} from 'antd';
import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  CaretRightOutlined,
  RightCircleOutlined,
  RightOutlined,
  EyeFilled,
  FilePdfOutlined,
  BookOutlined,
  SnippetsOutlined,
  FilePptOutlined,
  DownloadOutlined,
  FileUnknownOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  ReadOutlined,
} from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import pptFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pptFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pdfFileIcon.svg';
import videoFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/videoFileIcon.svg';
import audioFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/audiofile.svg';
import textFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/textfile.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/excelfile.svg';
import imageFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/imagefile.svg';
import tickIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/greenTick.svg';
import defaultFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/defaultfile.svg';
import axiosInstance from 'axios';
import axios from 'v2/config/axios';
import axios2 from 'axios';
import endpoints from 'v2/config/endpoints';
import { connect, useSelector } from 'react-redux';
import '../index.css';
import { useHistory } from 'react-router-dom';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import _ from 'lodash';
import EbookList from './viewEbooks';
import IbookList from './viewIbooks';
import { saveAs } from 'file-saver';
import QuestionPaperView from './QuestionPaperView';
import { addQuestionPaperToTest } from 'redux/actions';
import ASSIGNTEST from './../../../Assets/images/assigntest.png';

const { Option } = Select;
const { Panel } = Collapse;

const getFileIcon = (type) => {
  switch (type) {
    case 'ppt':
      return pptFileIcon;
    case 'pptx':
      return pptFileIcon;
    case 'jpeg':
      return imageFileIcon;
    case 'jpg':
      return imageFileIcon;
    case 'png':
      return imageFileIcon;
    case 'xlsx':
      return excelFileIcon;
    case 'xls':
      return excelFileIcon;
    case 'pdf':
      return pdfFileIcon;
    case 'mp4':
      return videoFileIcon;
    case 'mp3':
      return audioFileIcon;
    case 'txt':
      return textFileIcon;
    default:
      return defaultFileIcon;
  }
};

const TableView = ({ showTab, initAddQuestionPaperToTest }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const formRef = createRef();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level, user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();
  const [showSection, setShowSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInner, setLoadingInner] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [volumeName, setVolumeName] = useState([]);
  const [moduleListData, setModuleListData] = useState([]);
  const [annualPlanData, setAnnualPlanData] = useState([]);
  const [keyConceptsData, setKeyConceptsData] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [selectedKeyConcept, setSelectedKeyConcept] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [completeSections, setCompleteSections] = useState([]);
  const [showError, setShowError] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [currentPeriodId, setCurrentPeriodId] = useState('');
  const [currentPeriodPanel, setCurrentPeriodPanel] = useState(0);
  let isStudent = window.location.pathname.includes('student-view');
  const [YCPData, setYCPData] = useState([]);
  const [ebookData, setEbookData] = useState([]);
  const [ibookData, setIbookData] = useState([]);
  const [nextPeriodDetails, setNextPeriodDetails] = useState();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [openEbook, setOpenEbook] = useState(false);
  const [openIbook, setOpenIbook] = useState(false);
  const [pageEbook, setPageEbook] = useState(1);
  const [totalEbook, setTotalEbook] = useState();
  const [pageIbook, setPageIbook] = useState(1);
  const [totalIbook, setTotalIbook] = useState();
  const [ebookCount, setEbookCount] = useState();
  const [ibookCount, setIbookCount] = useState();

  const [isPeriodView, setIsPeriodView] = useState(true);
  const [questionData, setQuestionData] = useState([]);

  const [allowAutoAssignDiary, setAllowAutoAssignDiary] = useState(false);
  const [loadingDiaryHW, setLoadingDiaryHW] = useState(false);
  const [assignedHWList, setAssignedHWList] = useState([]);
  const [assignedDiaryList, setAssignedDiaryList] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState();

  const env = window.location.host;
  const domain = window.location.host.split('.');
  let domain_name =
    env.includes('qa') || env.includes('localhost')
      ? 'olvorchidnaigaon'
      : env.includes('test')
      ? 'orchids'
      : domain[0];

  const showEbookDrawer = () => {
    setOpenEbook(true);
  };
  const onEbookClose = () => {
    setOpenEbook(false);
  };
  const showIbookDrawer = () => {
    setOpenIbook(true);
  };
  const onIbookClose = () => {
    setOpenIbook(false);
  };
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setCurrentPeriodPanel(0);
    setDrawerVisible(false);
  };
  const showSectionList = () => {
    setShowSection((prevState) => !prevState);
  };

  const closeSectionList = () => {
    setShowSection(false);
  };
  const closeshowInfoModal = () => {
    setShowInfoModal(false);
    setCompleteSections([]);
  };
  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`/erp_user/v2/grademapping/`, { params })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.allSubjects}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchVolumeListData = () => {
    axiosInstance
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeListData(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchAnnualPlanData = (params = {}) => {
    setLoading(true);
    axios
      .get(`academic/annual-plan/modules/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setAnnualPlanData(result?.data?.data?.chapter_wise_data);
          setYCPData(result?.data?.data?.lp_ycp_data);
          setLoading(false);
        } else {
          setAnnualPlanData([]);
          setYCPData([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });

    fetchEbookCount({
      subject: subjectId,
      volume: volumeId,
      grade: gradeId,
      session_year: selectedAcademicYear?.session_year,
      book_type: '3',
      branch: selectedBranch?.branch?.id,
      domain_name: domain_name,
      lesson_plan: 'true',
      page_size: '10',
      page_number: pageEbook,
      board: boardId,
    });
  };
  const fetchEbookCount = (params) => {
    // setLoading(true)
    axios
      .get(`${endpoints.newEbook.ebook_ibook_count}`, {
        params: { ...params },
      })
      .then((res) => {
        setEbookCount(res?.data?.result?.ebook_count);
        setIbookCount(res?.data?.result?.ibook_count);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const getIbook = () => {
    fetchIbooks({
      subject: subjectId,
      volume: volumeId,
      grade: gradeId,
      session_year: selectedAcademicYear?.session_year,
      book_type: '4',
      branch: selectedBranch?.branch?.id,
      domain_name: domain_name,
      lesson_plan: 'true',
      page_size: '10',
      page: pageIbook,
      board: boardId,
    });
    showIbookDrawer();
  };
  const getEbook = () => {
    fetchEbooks({
      subject: subjectId,
      volume: volumeId,
      grade: gradeId,
      session_year: selectedAcademicYear?.session_year,
      book_type: '3',
      branch: selectedBranch?.branch?.id,
      domain_name: domain_name,
      lesson_plan: 'true',
      page_size: '10',
      page_number: pageEbook,
    });
    showEbookDrawer();
  };
  const fetchEbooks = (params) => {
    // setLoading(true)
    axios
      .get(`${endpoints.newEbook.ebookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          // message.success('Ebooks Fetched Successfully');
          setEbookData(res.data.result.data);
          setTotalEbook(res?.data?.result?.total_ebooks);
        } else {
          // message.error('Cannot Fetch Right Now');
          setEbookData([]);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };
  const fetchIbooks = (params) => {
    // setLoading(true)
    axios
      .get(`${endpoints.newibook.ibookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setIbookData(res.data.result.result);
          // setTotal(res.data.result.total_ebooks)
          setTotalIbook(res.data.result.count);
          // message.success('Ibooks Fetched Successfully');
          setLoading(false);
        } else {
          // message.error('Cannot Fetch Right Now');
          setLoading(false);
          setIbookData([]);
          // setTotal()
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const handlePageEbook = (e) => {
    setPageEbook(e);
    fetchEbooks({
      subject: subjectId,
      volume: volumeId,
      grade: gradeId,
      session_year: selectedAcademicYear?.session_year,
      book_type: '3',
      branch: selectedBranch?.branch?.id,
      domain_name: domain_name,
      lesson_plan: 'true',
      page_size: '10',
      page_number: e,
    });
    const element = document.getElementById('ebooktop');
    element.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageIbook = (e) => {
    setPageIbook(e);
    fetchIbooks({
      subject: subjectId,
      volume: volumeId,
      grade: gradeId,
      session_year: selectedAcademicYear?.session_year,
      book_type: '4',
      branch: selectedBranch?.branch?.id,
      domain_name: domain_name,
      lesson_plan: 'true',
      page_size: '10',
      page: e,
      board: boardId,
    });
    const element = document.getElementById('ibooktop');
    element.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchKeyConceptsData = (params = {}) => {
    setLoadingInner(true);
    axios
      .get(`academic/annual-plan/key-concepts/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setKeyConceptsData(result?.data?.data);
          setLoadingInner(false);
        } else {
          setLoadingInner(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingInner(false);
      });
  };

  // Diary Functions
  const fetchDiaryCompletionStatus = (params = {}) => {
    setLoadingDiaryHW(true);
    axios
      .get(`academic/diary/fetch-diary-homework/`, { params: { ...params } })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setAssignedHWList(response?.data?.result['homework']);
          setAssignedDiaryList(response?.data?.result['diary']);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoadingDiaryHW(false);
      });
  };
  const deleteHomework = (id) => {
    axios
      .delete(`/academic/${id}/hw-questions/`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          if (response?.data?.message.includes('cannot')) {
            message.warning(response?.data?.message);
          } else {
            message.success('Homework deleted successfully!');
          }
          setAssignedDiaryList([]);
          setAssignedHWList([]);
          fetchDiaryCompletionStatus({
            period_id: selectedPeriod?.id,
            section_mapping: selectedPeriod?.section_wise_completion
              ?.map((item) => item?.id)
              .join(','),
            subject: subjectId,
          });
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const deleteDiary = (id) => {
    axios
      .delete(`${endpoints?.dailyDiary?.updateDelete}${id}/update-delete-dairy/`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          message.success('Diary deleted successfully!');
          setAssignedDiaryList([]);
          setAssignedHWList([]);
          fetchDiaryCompletionStatus({
            period_id: selectedPeriod?.id,
            section_mapping: selectedPeriod?.section_wise_completion
              ?.map((item) => item?.id)
              .join(','),
            subject: subjectId,
          });
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchAllowAutoDiaryStatus = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('error', error?.message);
      });
  };
  const fetchLessonResourcesData = (data) => {
    showDrawer();
    setLoadingDrawer(true);
    const params = {
      grade_id: gradeId,
      acad_session_id: selectedBranch?.id,
      topic_id: data?.key_concept_id,
      chapter_id: data?.chapter_id,
    };
    axios
      .get(`academic/annual-plan/chapter-topic-wise-lp-data/`, {
        params: { ...params, ...(allowAutoAssignDiary ? { config: 'True' } : {}) },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setResourcesData(result?.data?.data);
          let index;
          if (!isStudent) {
            index = result?.data?.data.findIndex(
              (item) => item.next_to_be_taught == true
            );
            index == -1 ? setCurrentPeriodPanel(0) : setCurrentPeriodPanel(index);
          } else {
            index = result?.data?.data.findIndex((item) => item.last_taught == true);
            index == -1 ? setCurrentPeriodPanel(0) : setCurrentPeriodPanel(index);
          }
          if (allowAutoAssignDiary) {
            let currentPeriodIdIndex = index == -1 ? 0 : index;
            setSelectedPeriod(result?.data?.data[currentPeriodIdIndex]);
            fetchDiaryCompletionStatus({
              period_id: result?.data?.data[currentPeriodIdIndex]?.id,
              section_mapping: result?.data?.data[
                currentPeriodIdIndex
              ]?.section_wise_completion
                ?.map((item) => item?.id)
                .join(','),
              subject: subjectId,
            });
          }
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
  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      subject: null,
    });
    setSubjectData([]);
    setSubjectId('');
    if (e) {
      setGradeId(e);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: e,
      });
    }
  };
  const handleClearGrade = () => {
    setGradeId('');
    setSubjectId('');
  };
  const handleSubject = (e) => {
    setSubjectId(e);
  };
  const handleClearSubject = () => {
    setSubjectId('');
  };
  const handleVolume = (e) => {
    setVolumeId(e.value);
  };
  const handleClearVolume = () => {
    setVolumeId('');
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
  const volumeOptions = volumeListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    setKeyConceptsData([]);
    if (expanded) {
      keys.push(record.chapter_id);
      setSelectedChapter(record);
      fetchKeyConceptsData({
        chapter_id: record.chapter_id,
      });
    }

    setExpandedRowKeys(keys);
  };

  const markPeriodComplete = (item) => {
    if (completeSections?.length > 0) {
      setShowError(false);
      completeSections.map((section, index) => {
        let payLoad = {
          academic_year: selectedAcademicYear?.session_year,
          academic_year_id: item.central_academic_year_id,
          volume_id: volumeId,
          volume_name: volumeName,
          subject_id: subjectId,
          chapter_id: selectedKeyConcept.chapter_id,
          chapter_name: selectedChapter.chapter__chapter_name,
          // grade_subject: item.central_grade_subject_map_id,
          central_gs_mapping_id: item.central_grade_subject_map_id,
          period_id: item?.id,
          section_mapping_id: [section?.id],
          fetch_upcoming_period: true,
        };
        axios
          .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
          .then((res) => {
            if (res.data.status_code === 200) {
              if (index == completeSections?.length - 1) {
                closeSectionList();
                setShowInfoModal(true);
                if (!_.isEmpty(res.data.result)) {
                  setNextPeriodDetails(res.data.result);
                }
              }
            }
          })
          .catch((error) => {
            // setLoading(false);
            message.error(error.message);
          });
      });
    } else {
      setShowError(true);
    }
  };

  const handleNextPeriodResource = () => {
    setCompleteSections([]);
    closeshowInfoModal();
    if (nextPeriodDetails) {
      fetchLessonResourcesData(nextPeriodDetails);

      if (nextPeriodDetails?.volume_id !== volumeId) {
        formRef.current.setFieldsValue({
          volume: nextPeriodDetails.volume_name,
        });
        setVolumeId(nextPeriodDetails?.volume_id);
        setVolumeName(nextPeriodDetails.volume_name);
      } else if (nextPeriodDetails?.chapter_id !== selectedChapter.chapter_id) {
        setSelectedChapter(nextPeriodDetails);
      } else if (
        nextPeriodDetails?.key_concept_id !== selectedKeyConcept.key_concept_id
      ) {
        setSelectedChapter(nextPeriodDetails);
      } else {
        setCurrentPeriodPanel(currentPeriodPanel + 1);
      }
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchGradeData();
      fetchVolumeListData();
    }
  }, [moduleId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    fetchAllowAutoDiaryStatus();
  }, []);

  useEffect(() => {
    if (history?.location?.state) {
      formRef.current.setFieldsValue({
        grade: history?.location?.state?.gradeName,
        subject: history?.location?.state?.subjectName,
        volume: history?.location?.state?.volumeName,
      });
      setGradeId(history?.location?.state?.gradeID);
      setSubjectId(history?.location?.state?.subjectID);
      setVolumeId(history?.location?.state?.volumeID);
      setVolumeName(history?.location?.state?.volumeName);
      setBoardId(history?.location?.state?.boardID);

      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: history?.location?.state?.gradeID,
      });
    }
  }, [showTab]);

  useEffect(() => {
    if (subjectId && volumeId) {
      fetchAnnualPlanData({
        subject_id: subjectId,
        volume_id: volumeId,
        acad_session_id: selectedBranch?.id,
        grade_id: gradeId,
        board_id: boardId,
      });
    }
  }, [subjectId, volumeId]);

  const downloadMaterial = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    saveAs(blob, filename);
  };

  const openQpDrawer = (id) => {
    fetchQuestionData(id);
    setIsPeriodView(false);
  };

  const closeQpDrawer = () => {
    setLoadingDrawer(true);
    setIsPeriodView(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  const handleAssign = (files, subject_mapping) => {
    const obj = {
      is_central: true,
      id: files?.question_paper_id,
      section: files?.section,
      grade: files?.grade_id,
      total_marks: files?.total_marks,
      grade_subject_mapping: [subject_mapping],
      subjects: [subject_mapping],
      is_question_wise: files?.is_question_wise,
    };
    initAddQuestionPaperToTest(obj);
    history.push('/create-assesment');
  };

  const fetchQuestionData = (paperid) => {
    setLoadingDrawer(true);
    const url = endpoints.lessonPlan.questionPaperPreview.replace(
      '<question-paper-id>',
      paperid
    );
    axios2
      .get(url, { headers: { 'x-api-key': 'vikash@12345#1231' } })
      .then((result) => {
        if (result.data.status_code === 200) {
          const { sections, questions } = result.data.result;
          const parsedResponse = [];
          sections.forEach((sec) => {
            const sectionObject = { name: '', questions: [] };
            const sectionName = Object.keys(sec)[0];
            sectionObject.name = sectionName;
            sec[sectionName].forEach((qId) => {
              const questionFound = questions.find((q) => q?.id === qId);
              if (questionFound) {
                sectionObject.questions.push(questionFound);
              }
            });
            parsedResponse.push(sectionObject);
          });
          setLoadingDrawer(false);
          setQuestionData(parsedResponse);
        } else {
          setLoadingDrawer(false);
          message.error(result.data.message);
        }
      })
      .catch((error) => {
        setLoadingDrawer(false);
        message.error(error.message);
      });
  };

  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '15%',
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '30%',
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '25%',
        visible: 'false',
      },
      {
        title: '',
        dataIndex: 'key_concept__topic_name',
        align: 'center',
        width: tableWidthCalculator(40) + '%',
        render: (text, row, index) => {
          return (
            <div
              className='th-black-1 th-pointer'
              // style={{ maxWidth: window.innerWidth < 768 ? '140px' : '300px' }}
            >
              {/* <div className='col-md-2 col-0'></div>
              <div className='col-md-10 col-12 px-md-0'> */}
              <Tooltip
                placement='bottom'
                title={<span>{row.key_concept__topic_name}</span>}
              >
                {index + 1}. {row.key_concept__topic_name}
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'lp_count',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-black-1'>{data}</span>,
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '5%',
        render: (data) => (
          <span className='th-black-1'>
            <RightOutlined />
          </span>
        ),
      },
    ].filter((item) => item.visible !== 'false');

    return (
      <Table
        columns={innerColumn}
        dataSource={keyConceptsData}
        loading={loadingInner}
        pagination={false}
        showHeader={false}
        bordered={false}
        rowClassName={(record, index) => 'th-pointer th-row'}
        onRow={(row, rowIndex) => {
          return {
            onClick: (event) => {
              setSelectedKeyConcept(row);
              fetchLessonResourcesData(row);
            },
          };
        }}
      />
    );
  };
  const columns = [
    {
      title: <span className='th-white pl-md-4 th-fw-700 '>SL NO.</span>,
      align: 'center',
      width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },

    {
      title: <span className='th-white th-fw-700 '>CHAPTER</span>,
      dataIndex: 'chapter__chapter_name',
      width: '30%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MODULE</span>,
      dataIndex: 'chapter__lt_module__lt_module_name',
      width: '25%',
      align: 'left',
      visible: 'false',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>KEY CONCEPTS</span>,
      dataIndex: 'kc_count',
      width: '40%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>PERIODS</span>,
      dataIndex: 'lp_count',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
  ].filter((item) => item.visible !== 'false');
  return (
    <div className='row'>
      <div className='col-12 mb-2'>
        <Form id='filterForm' ref={formRef} layout={'horizontal'}>
          <div className='row align-items-center'>
            {!isStudent && (
              <div className='col-md-3 col-6 px-0'>
                <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    allowClear
                    placeholder='Select Grade'
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
                    onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
              <div className='mb-2 text-left'>Subject</div>
              <Form.Item name='subject'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Subject'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleSubject(e);
                  }}
                  onClear={handleClearSubject}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {subjectOptions}
                </Select>
              </Form.Item>
            </div>

            <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
              <div className='mb-2 text-left'>Volume</div>
              <Form.Item name='volume'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Volume'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleVolume(value);
                  }}
                  onClear={handleClearVolume}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {volumeOptions}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      {!loading && (
        <div className='col-12 mb-3 px-3'>
          <div className='row'>
            {YCPData?.filter((item) => item?.lesson_type == '1')[0]?.media_file[0] && (
              <div className='col-md-3'>
                <a
                  onClick={() => {
                    const fileName = YCPData?.filter(
                      (item) => item?.lesson_type == '1'
                    )[0]?.media_file[0];
                    const fileSrc = `${endpoints.lessonPlan.bucket}/${fileName}`;
                    openPreview({
                      currentAttachmentIndex: 0,
                      attachmentsArray: [
                        {
                          src: fileSrc,
                          name: 'Portion Document',
                          extension:
                            '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                        },
                      ],
                    });
                  }}
                >
                  {/* <div className='row th-fw-600 th-pointer th-primary'>
                    <div className=''>Portion Document</div>
                    <div className='ml-3'>
                      <EyeFilled
                        className='th-primary'
                        fontSize={20}
                        style={{ verticalAlign: 'inherit' }}
                      />
                    </div>
                  </div> */}
                  <div className=' pl-0 col-12e4l th-primary '>
                    <Badge count='1'>
                      <Button icon={<FilePptOutlined />} />
                    </Badge>
                    <span style={{ marginLeft: '5px', fontWeight: '600' }}>
                      Portion Document
                    </span>
                  </div>
                </a>
              </div>
            )}
            {YCPData?.filter((item) => item?.lesson_type == '2')[0]?.media_file[0] && (
              <div className='col-md-3'>
                <a
                  onClick={() => {
                    const fileName = YCPData?.filter(
                      (item) => item?.lesson_type == '2'
                    )[0]?.media_file[0];
                    const fileSrc = `${endpoints.lessonPlan.bucket}/${fileName}`;
                    openPreview({
                      currentAttachmentIndex: 0,
                      attachmentsArray: [
                        {
                          src: fileSrc,
                          name: 'Portion Document',
                          extension:
                            '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                        },
                      ],
                    });
                  }}
                >
                  {/* <div className='row th-fw-600 th-pointer th-primary'>
                    <div className=''>Yearly Curriculum Plan</div>
                    <div className='ml-3'>
                      <EyeFilled
                        className='th-primary'
                        fontSize={20}
                        style={{ verticalAlign: 'inherit' }}
                      />
                    </div>
                  </div> */}
                  <div className=' pl-0 col-12e4l th-primary '>
                    <Badge count='1'>
                      <Button icon={<SnippetsOutlined />} />
                    </Badge>
                    <span style={{ marginLeft: '5px', fontWeight: '600' }}>
                      Yearly Curriculum Plan
                    </span>
                  </div>
                </a>
              </div>
            )}
            {ebookCount != null && (
              <div className='col-md-3 pl-0 col-12e4l'>
                <a onClick={getEbook}>
                  <div className=' pl-0 col-12e4l th-primary '>
                    <Badge count={ebookCount}>
                      <Button icon={<FilePdfOutlined />} onClick={getEbook} />
                    </Badge>
                    <span style={{ marginLeft: '5px', fontWeight: '600' }}>Ebook</span>
                  </div>
                </a>
                <Modal
                  title='Ebooks'
                  closable={true}
                  onCancel={onEbookClose}
                  visible={openEbook}
                  width={'90vh'}
                  footer={[
                    <div>
                      {totalEbook > 10 ? (
                        <Pagination
                          total={totalEbook}
                          current={pageEbook}
                          onChange={handlePageEbook}
                          pageSize={10}
                        />
                      ) : (
                        ''
                      )}
                    </div>,
                  ]}
                >
                  <EbookList data={ebookData} />
                </Modal>
              </div>
            )}

            {ibookCount != null && (
              <div className='col-md-3 pl-0 col-12e4l'>
                <a onClick={getIbook}>
                  <div className=' pl-0 col-12e4l th-primary '>
                    <Badge count={ibookCount}>
                      <Button icon={<BookOutlined />} onClick={getIbook} />
                    </Badge>
                    <span style={{ marginLeft: '5px', fontWeight: '600' }}>Ibook</span>
                  </div>
                </a>
                <Modal
                  title='Ibooks'
                  closable={true}
                  onCancel={onIbookClose}
                  visible={openIbook}
                  width={'90vh'}
                  footer={[
                    <div>
                      {totalIbook > 10 ? (
                        <Pagination
                          total={totalIbook}
                          current={pageIbook}
                          onChange={handlePageIbook}
                          pageSize={10}
                        />
                      ) : (
                        ''
                      )}
                    </div>,
                  ]}
                >
                  <IbookList data={ibookData} />
                </Modal>
              </div>
            )}
            {/* {ebookData?.length > 0 && (
              <div className='col-md-3'>
                <span>Ebook</span>
                <Badge count={ebookData?.length} >
                  <Button icon={<FilePdfOutlined />} onClick={showEbookDrawer} />
                </Badge>
              </div>
            )}
            <Modal
              title="Ebooks"
              closable={true}
              onCancel={onEbookClose}
              visible={openEbook}
              footer={null}
            >

              <EbookList data={ebookData} />
            </Modal>
            {ibookData?.length > 0 && (
              <div className='col-md-3'>
                <span>Ibook</span>
                <Badge count={ibookData?.length} >
                  <Button icon={<BookOutlined />} onClick={showIbookDrawer} />
                </Badge>
              </div>
            )}
            <Modal
              title="Ibooks"
              closable={true}
              onCancel={onIbookClose}
              visible={openIbook}
              footer={null}
              width={'90vh'}
            >

              <IbookList data={ibookData} />
            </Modal> */}
          </div>
        </div>
      )}
      <div className='col-12'>
        <Table
          className='th-table '
          rowClassName={(record, index) =>
            `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
          }
          expandRowByClick={true}
          columns={columns}
          rowKey={(record) => record?.chapter_id}
          expandable={{ expandedRowRender }}
          dataSource={annualPlanData}
          pagination={false}
          loading={loading}
          onExpand={onTableRowExpand}
          expandedRowKeys={expandedRowKeys}
          expandIconColumnIndex={5}
          expandIcon={({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined className='th-black-1' onClick={(e) => onExpand(record, e)} />
            ) : (
              <DownOutlined className='th-black-1' onClick={(e) => onExpand(record, e)} />
            )
          }
          scroll={{ x: 'max-content', y: 600 }}
        />
      </div>
      <div>
        <Drawer
          zIndex={1300}
          title={
            <div className='th-bg-grey'>
              {isPeriodView ? 'Resources' : 'Question Paper'}
            </div>
          }
          placement='right'
          onClose={isPeriodView ? closeDrawer : closeQpDrawer}
          visible={drawerVisible}
          closable={false}
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          className='th-resources-drawer'
          extra={
            <Space>
              <CloseOutlined onClick={isPeriodView ? closeDrawer : closeQpDrawer} />
            </Space>
          }
        >
          {isPeriodView ? (
            <>
              {loadingDrawer ? (
                <div className='text-center mt-5'>
                  <Spin tip='Loading...' />
                </div>
              ) : resourcesData.length > 0 ? (
                resourcesData.map((item, i) => (
                  <Collapse
                    activeKey={currentPeriodPanel}
                    expandIconPosition='right'
                    bordered={true}
                    className='th-br-6 my-2 th-bg-grey th-collapse'
                    style={{ border: '1px solid #d9d9d9' }}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    onChange={() => {
                      if (i !== currentPeriodPanel) {
                        setCurrentPeriodPanel(i);
                        setSelectedPeriod(resourcesData[i]);
                        fetchDiaryCompletionStatus({
                          period_id: resourcesData[i]?.id,
                          section_mapping: resourcesData[i]?.section_wise_completion
                            ?.map((item) => item?.id)
                            .join(','),
                          subject: subjectId,
                        });
                      }
                    }}
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
                          <div className='col-2 th-black-1 px-0'>
                            <div className='row justify-content-between'>
                              <span>Module</span>
                              <span>:&nbsp;</span>
                            </div>
                          </div>

                          <div className='col-10 th-primary px-0'>
                            {selectedChapter.chapter__lt_module__lt_module_name}
                          </div>
                        </div>
                      )}
                      <div className='row mt-2 th-fw-600'>
                        <div className='col-2 th-black-1 px-0'>
                          <div className='row justify-content-between'>
                            <span>Chapter</span>
                            <span>:&nbsp;</span>
                          </div>
                        </div>

                        <div className='col-10 th-primary px-0'>
                          {selectedChapter.chapter__chapter_name}
                        </div>
                      </div>
                      <div className='row mt-2 th-fw-600'>
                        <div className='col-3 th-black-1 px-0'>
                          <div className='row justify-content-between'>
                            <span>Key Concept</span>
                            <span>:&nbsp;</span>
                          </div>
                        </div>

                        <div className='col-9 th-primary px-0'>
                          {selectedKeyConcept.key_concept__topic_name}
                        </div>
                      </div>
                      <div className='row mt-2'>
                        <div className='col-12 text-through pl-0'>
                          <span className='th-grey'>Resources</span>
                        </div>
                      </div>
                      <div
                        style={{
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                          maxHeight: 160,
                        }}
                        className='th-question'
                      >
                        {item?.lp_files.map((files, i) =>
                          files?.media_file?.map((each, index) => {
                            if (
                              (user_level == 13 &&
                                files?.document_type == 'Lesson_Plan') ||
                              (user_level == 13 && files?.document_type == 'Homework') ||
                              (user_level == 13 &&
                                files?.document_type == 'Teacher_Reading_Material')
                            ) {
                            } else {
                              let fullName = each?.split(
                                `${files?.document_type.toLowerCase()}/`
                              )[1];
                              let textIndex = fullName
                                ?.split('_')
                                .indexOf(fullName.split('_').find((item) => isNaN(item)));
                              let displayName = fullName
                                .split('_')
                                .slice(textIndex)
                                .join('_');
                              let fileName = displayName ? displayName.split('.') : null;
                              let file = fileName ? fileName[fileName?.length - 2] : '';
                              let extension = fileName
                                ? fileName[fileName?.length - 1]
                                : '';
                              return (
                                <div
                                  className='row mt-2 py-2 align-items-center'
                                  style={{ border: '1px solid #d9d9d9' }}
                                >
                                  <div className='col-2'>
                                    <img src={getFileIcon(extension)} />
                                  </div>
                                  {/* <div className='col-10 px-0 th-pointer'>
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
                              </div> */}
                                  <div className='col-10 px-0 th-pointer'>
                                    <div className='row align-items-center'>
                                      <div className='col-9 px-0'>
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
                                          {files.document_type}_{file}
                                        </a>
                                      </div>

                                      <div className='col-1'>
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
                                          <EyeFilled />
                                        </a>
                                      </div>

                                      {files?.document_type ==
                                        'Teacher_Reading_Material' && (
                                        <div className='col-1'>
                                          <a
                                            rel='noopener noreferrer'
                                            target='_blank'
                                            // href={`${endpoints.lessonPlan.bucket}/${files?.media_file}`}
                                            onClick={() =>
                                              downloadMaterial(
                                                `${endpoints.lessonPlan.bucket}/${each}`,
                                                `${files.document_type}_${file}`
                                              )
                                            }
                                          >
                                            <DownloadOutlined />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })
                        )}
                      </div>
                      <hr />

                      {item?.lp_files?.map((files, i) => (
                        <>
                          {user_level !== 13 &&
                          files?.document_type == 'QuestionPaper' ? (
                            <div className='row mt-3'>
                              <div className='col-12 text-through pl-0'>
                                <span className='th-grey'>Quiz</span>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))}

                      {item?.lp_files?.map((files, i) => (
                        <>
                          {user_level !== 13 &&
                          files?.document_type == 'QuestionPaper' ? (
                            <div
                              style={{
                                overflowY: 'scroll',
                                overflowX: 'hidden',
                                maxHeight: '40vh',
                              }}
                            >
                              <div
                                className='row mt-1 py-2 align-items-center'
                                style={{ border: '1px solid #d9d9d9' }}
                              >
                                <div className='col-2'>
                                  <FileUnknownOutlined style={{ fontSize: 35 }} />
                                </div>
                                <div className='col-10'>
                                  <div className='row align-items-center'>
                                    <div className='col-9 px-0'>
                                      <p
                                        className='text-ellipsis'
                                        title={files.question_paper_name}
                                      >
                                        {files.question_paper_name}
                                      </p>
                                    </div>
                                    {/* <div className='col-3'>
                                      <Button
                                        type='primary'
                                        className='th-br-4 mr-3'
                                        onClick={() =>
                                          openQpDrawer(files.question_paper_id)
                                        }
                                      >
                                        View
                                      </Button>
                                    </div> */}
                                    {/* <div className='col-3'>
                                      <Button
                                        type='primary'
                                        className='th-br-4'
                                        onClick={() =>
                                          openQpDrawer(files.question_paper_id)
                                        }
                                      >
                                        View
                                      </Button>
                                    </div> */}

                                    <div className='col-1'>
                                      <a
                                        onClick={() =>
                                          openQpDrawer(files.question_paper_id)
                                        }
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        title='View Quiz'
                                      >
                                        <EyeFilled />
                                      </a>
                                    </div>
                                    <div className='col-1'>
                                      <a
                                        onClick={() =>
                                          handleAssign(
                                            files,
                                            item?.central_grade_subject_map_id
                                          )
                                        }
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        title='Assign Test'
                                      >
                                        <img
                                          title='Assign Test'
                                          src={ASSIGNTEST}
                                          alt='Assign Test'
                                        />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))}

                      <div className='row mt-2'>
                        <div className='col-12 th-black-2 pl-0'>
                          Status :{' '}
                          {item?.section_wise_completion?.filter(
                            (item) => item?.is_completed === true
                          )?.length > 0 ? (
                            <span>
                              <span className='th-green th-fw-500'>Completed</span>
                              {!isStudent && (
                                <>
                                  {' '}
                                  for Section{' '}
                                  {item.section_wise_completion
                                    .filter((item) => item?.is_completed === true)
                                    .map((item) =>
                                      item?.section__section_name.slice(-1).toUpperCase()
                                    )
                                    .join(', ')}
                                </>
                              )}
                            </span>
                          ) : (
                            <span className='th-fw-500 th-red'> Not Completed</span>
                          )}
                        </div>
                      </div>

                      {!isStudent && (
                        <div className='row th-black-2 mt-2 '>
                          <div className='col-12' style={{ border: '1px solid #d9d9d9' }}>
                            <div
                              className='row justify-content-between py-2 th-pointer'
                              onClick={() => {
                                showSectionList();
                                setCurrentPeriodId(item?.id);
                              }}
                            >
                              <div>Add / Update Status</div>
                              <div>
                                <CaretRightOutlined
                                  style={{
                                    transform: showSection ? `rotate(90deg)` : null,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {showSection && currentPeriodId == item?.id && (
                        <div className='row' style={{ border: '1px solid #d9d9d9' }}>
                          {item.section_wise_completion.map((each, i) => (
                            <div className='col-2 p-2'>
                              {each.is_completed ? (
                                <Button disabled>
                                  {each?.section__section_name.slice(-1).toUpperCase()}
                                </Button>
                              ) : (
                                <Button
                                  type={
                                    completeSections.includes(each)
                                      ? 'primary'
                                      : 'default'
                                  }
                                  onClick={() => {
                                    if (completeSections.includes(each)) {
                                      const index = completeSections.indexOf(each);
                                      const newFileList = completeSections.slice();
                                      newFileList.splice(index, 1);
                                      setCompleteSections(newFileList);
                                    } else {
                                      setCompleteSections([...completeSections, each]);
                                    }
                                  }}
                                >
                                  {each?.section__section_name.slice(-1).toUpperCase()}
                                </Button>
                              )}
                            </div>
                          ))}
                          <div
                            className='row justify-content-end py-2 mt-2 text-center'
                            style={{ borderTop: '1px solid #d9d9d9' }}
                          >
                            <div
                              className='col-3 th-bg-grey th-black-1 p-2 th-br-6 th-pointer'
                              style={{ border: '1px solid #d9d9d9' }}
                              onClick={() => setCompleteSections([])}
                            >
                              Clear
                            </div>
                            <div
                              className='col-3 th-bg-primary th-white p-2 mx-2 th-br-6 th-pointer'
                              onClick={() => {
                                markPeriodComplete(item);
                              }}
                            >
                              Update
                            </div>
                          </div>
                          {showError && completeSections?.length < 1 && (
                            <div className='th-red'>
                              Please select at least one section first!
                            </div>
                          )}
                        </div>
                      )}
                      <div className='row th-black-2 mt-2 '>
                        <div className='col-12 th-grey pl-0 th-12'>
                          Last Updated {getTimeInterval(item.updated_at)}
                        </div>
                      </div>
                      {allowAutoAssignDiary && user_level !== 13 ? (
                        assignedDiaryList.map((el) => el?.section).flat().length <
                        item?.section_wise_completion?.length ? (
                          <>
                            <div
                              className='th-bg-primary th-white p-2 text-center mt-2 th-br-8 th-pointer'
                              onClick={() => {
                                if (completeSections?.length > 0) {
                                  message.error(
                                    'Please update the status of selected sections first!!'
                                  );
                                } else {
                                  if (
                                    item?.section_wise_completion
                                      .filter((item) => item?.is_completed == true)
                                      .map((item) => item?.id)
                                      .filter(
                                        (el) =>
                                          assignedDiaryList
                                            .map((item) => item.section_mapping)
                                            .flat()
                                            .indexOf(el) < 0
                                      ).length > 0
                                  ) {
                                    let excludedSections = item?.section_wise_completion
                                      .filter((item) => item?.is_completed == true)
                                      .map((item) => item?.id)
                                      .filter(
                                        (el) =>
                                          assignedDiaryList
                                            .map((item) => item.section_mapping)
                                            .flat()
                                            .indexOf(el) < 0
                                      );
                                    history.push({
                                      pathname: '/create/diary',
                                      state: {
                                        periodData: {
                                          subjectID: subjectId,
                                          subjectName:
                                            history?.location?.state?.subjectName,
                                          gradeID: gradeId,
                                          gradeName: history?.location?.state?.gradeName,
                                          volumeID: volumeId,
                                          periodID: item?.id,
                                          periodName: item?.period_name,
                                          sections: item?.section_wise_completion.filter(
                                            (item) => excludedSections.includes(item?.id)
                                          ),
                                          chapterID: selectedKeyConcept.chapter_id,
                                          chapterName: item?.chapter_name,
                                          keyConceptID: item?.key_concept_id,
                                          keyConceptName: item?.topic_name,
                                          board: boardId,
                                        },
                                        isDiaryAutoAssign: true,
                                        isDiaryEdit: assignedDiaryList
                                          ?.map((item) => item.section_mapping)
                                          .flat()
                                          .every((elem) =>
                                            item?.section_wise_completion
                                              ?.filter(
                                                (item) => item?.is_completed == true
                                              )
                                              .map((item) => item?.id)
                                              .includes(elem)
                                          )
                                          ? true
                                          : false,
                                      },
                                    });
                                  } else {
                                    message.error(
                                      'Please update the status of desired sections first!!'
                                    );
                                  }
                                }
                              }}
                            >
                              <PlusCircleFilled className='mr-2' /> Add HW & Diary
                            </div>
                          </>
                        ) : null
                      ) : null}
                      {loadingDiaryHW ? (
                        <div className='mt-4 text-center'>
                          <Spin tip='Loading...' />
                        </div>
                      ) : (
                        <>
                          <div className='row'>
                            {user_level == 13 ? (
                              <>
                                {assignedDiaryList?.map((item) => (
                                  <div
                                    className='col-12 py-3 mt-3'
                                    style={{ border: '1px solid #d9d9d9' }}
                                  >
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div className='d-flex justify-content-between align-items-center th-fw-600'>
                                        <ReadOutlined className='th-primary th-24 mr-3' />
                                        Diary assigned
                                      </div>
                                      <div
                                        className='th-pointer th-button-active th-br-8 px-2 py-1 th-12 text-capitalize'
                                        onClick={() => {
                                          history.push({
                                            pathname: '/diary/student',
                                            state: {
                                              diary_created_at: item?.diary_created_at,
                                            },
                                          });
                                        }}
                                      >
                                        View Diary
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {assignedHWList?.map((item) => (
                                  <div
                                    className='col-12 py-3 mt-3'
                                    style={{ border: '1px solid #d9d9d9' }}
                                  >
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div className='d-flex justify-content-between align-items-center th-fw-600'>
                                        <ReadOutlined className='th-primary th-24 mr-3' />
                                        Homework assigned
                                      </div>
                                      <div
                                        className='th-pointer th-button-active th-br-8 px-2 py-1 th-12 text-capitalize'
                                        onClick={() => {
                                          history.push({
                                            pathname: '/homework/student',
                                          });
                                        }}
                                      >
                                        View Homework
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <>
                                {assignedDiaryList.length > 0 && (
                                  <div className='col-12 px-0'>
                                    <Collapse
                                      expandIconPosition='right'
                                      bordered={true}
                                      className='th-br-6 my-2 th-bg-white th-width-100'
                                      style={{ border: '1px solid #d9d9d9' }}
                                      expandIcon={({ isActive }) => (
                                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                      )}
                                    >
                                      <Panel
                                        collapsible={true}
                                        header={
                                          <div className='row align-items-center'>
                                            <div className='col-2 pr-0'>
                                              <ReadOutlined
                                                style={{
                                                  fontSize: 30,
                                                  color: '#1b4ccb',
                                                }}
                                              />
                                            </div>
                                            <div className='col-10 pl-1'>
                                              <div className='th-fw-500 th-16 text-capitalize'>
                                                Diary
                                              </div>
                                              <div className='th-green th-14 pr-3'>
                                                Successfully Assigned for Sections &nbsp;
                                                {assignedDiaryList
                                                  .map((item) => item?.section)
                                                  .flat()
                                                  .map((el) => el?.slice(-1))
                                                  .join(', ')}
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      >
                                        <div className='row'>
                                          {assignedDiaryList?.map((el, index) => {
                                            return el?.section?.map(
                                              (each, sectionIndex) => (
                                                <div className='col-12'>
                                                  <div className='d-flex justify-content-between align-items-center py-2'>
                                                    <div className='th-fw-500 text-capitalize'>
                                                      {each}
                                                    </div>
                                                    {user_id ==
                                                    assignedDiaryList[index]
                                                      ?.created_by ? (
                                                      <Space>
                                                        <Tag
                                                          icon={<FormOutlined />}
                                                          title='Edit'
                                                          color='processing'
                                                          className='th-pointer th-br-6'
                                                          onClick={() => {
                                                            history.push({
                                                              pathname: '/create/diary',
                                                              state: {
                                                                data: {
                                                                  ...assignedDiaryList[
                                                                    index
                                                                  ],
                                                                  diary_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ].dairy_id,
                                                                  section_name: each,
                                                                  section_mapping_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ].section_mapping[
                                                                      sectionIndex
                                                                    ],
                                                                  section_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ]?.section_id[
                                                                      sectionIndex
                                                                    ],
                                                                  chapterID:
                                                                    selectedKeyConcept.chapter_id,
                                                                  periodID: item?.id,
                                                                  keyConceptID:
                                                                    selectedKeyConcept?.key_concept_id,
                                                                },
                                                                subject: {
                                                                  subject_name:
                                                                    history?.location
                                                                      ?.state
                                                                      ?.subjectName,
                                                                  subject_id: subjectId,
                                                                },
                                                                isDiaryEdit: true,
                                                              },
                                                            });
                                                          }}
                                                        >
                                                          Edit
                                                        </Tag>
                                                        <Popconfirm
                                                          placement='bottomRight'
                                                          title={
                                                            'Are you sure you want to delete this diary?'
                                                          }
                                                          onConfirm={() =>
                                                            deleteDiary(
                                                              assignedDiaryList[index]
                                                                .dairy_id
                                                            )
                                                          }
                                                          okText='Yes'
                                                          cancelText='No'
                                                          zIndex={2100}
                                                        >
                                                          <Tag
                                                            icon={<DeleteOutlined />}
                                                            title='Delete'
                                                            color='volcano'
                                                            className='th-pointer th-br-6'
                                                          >
                                                            Delete
                                                          </Tag>
                                                        </Popconfirm>
                                                      </Space>
                                                    ) : (
                                                      <Space>
                                                        <div
                                                          className='th-pointer th-button-active th-br-8 px-2 py-1 th-12'
                                                          onClick={() => {
                                                            history.push({
                                                              pathname: '/diary/teacher',
                                                              state: {
                                                                diary_created_at:
                                                                  assignedDiaryList[index]
                                                                    ?.diary_created_at,
                                                              },
                                                            });
                                                          }}
                                                        >
                                                          View Diary
                                                        </div>
                                                      </Space>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            );
                                          })}
                                        </div>
                                      </Panel>
                                    </Collapse>
                                  </div>
                                )}
                                {assignedHWList.length > 0 && (
                                  <div className='col-12 px-0'>
                                    <Collapse
                                      expandIconPosition='right'
                                      bordered={true}
                                      className='th-br-6 my-2 th-bg-white th-width-100'
                                      style={{ border: '1px solid #d9d9d9' }}
                                      expandIcon={({ isActive }) => (
                                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                      )}
                                    >
                                      <Panel
                                        collapsible={true}
                                        header={
                                          <div className='row align-items-center'>
                                            <div className='col-2 pr-0'>
                                              <ReadOutlined
                                                style={{
                                                  fontSize: 30,
                                                  color: '#1b4ccb',
                                                }}
                                              />
                                            </div>
                                            <div className='col-10 pl-1'>
                                              <div className='th-fw-500 th-16 text-capitalize'>
                                                Homework
                                              </div>
                                              <div className='th-green th-14 pr-3'>
                                                Successfully Assigned for Sections &nbsp;
                                                {assignedHWList
                                                  .map((item) => item?.section)
                                                  .flat()
                                                  .map((el) => el?.slice(-1))
                                                  .join(', ')}
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      >
                                        <div className='row'>
                                          {assignedHWList?.map((el, index) => {
                                            return el?.section?.map(
                                              (each, sectionIndex) => (
                                                <div className='col-12'>
                                                  <div className='d-flex justify-content-between align-items-center py-2'>
                                                    <div className='th-fw-500 text-capitalize'>
                                                      {each}
                                                    </div>
                                                    {user_id ==
                                                    assignedHWList[index]
                                                      ?.created_by_staff ? (
                                                      <Space>
                                                        <Tag
                                                          icon={<FormOutlined />}
                                                          title='Edit'
                                                          color='processing'
                                                          className='th-pointer th-br-6'
                                                          onClick={() => {
                                                            history.push({
                                                              pathname: '/create/diary',
                                                              state: {
                                                                data: {
                                                                  ...assignedDiaryList[
                                                                    index
                                                                  ],
                                                                  diary_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ].dairy_id,
                                                                  section_name: each,
                                                                  section_mapping_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ].section_mapping[
                                                                      sectionIndex
                                                                    ],
                                                                  section_id:
                                                                    assignedDiaryList[
                                                                      index
                                                                    ]?.section_id[
                                                                      sectionIndex
                                                                    ],
                                                                  chapterID:
                                                                    selectedKeyConcept.chapter_id,
                                                                  periodID: item?.id,
                                                                  keyConceptID:
                                                                    selectedKeyConcept?.key_concept_id,
                                                                },
                                                                subject: {
                                                                  subject_name:
                                                                    history?.location
                                                                      ?.state
                                                                      ?.subjectName,
                                                                  subject_id: subjectId,
                                                                },
                                                                isDiaryEdit: true,
                                                              },
                                                            });
                                                          }}
                                                        >
                                                          Edit
                                                        </Tag>
                                                        <Popconfirm
                                                          placement='bottomRight'
                                                          title={
                                                            'Are you sure you want to delete this homework?'
                                                          }
                                                          onConfirm={() =>
                                                            deleteHomework(
                                                              assignedHWList[index]
                                                                .homework_id
                                                            )
                                                          }
                                                          okText='Yes'
                                                          cancelText='No'
                                                          zIndex={2100}
                                                        >
                                                          <Tag
                                                            icon={<DeleteOutlined />}
                                                            title='Delete'
                                                            color='volcano'
                                                            className='th-pointer th-br-6'
                                                          >
                                                            Delete
                                                          </Tag>
                                                        </Popconfirm>
                                                      </Space>
                                                    ) : (
                                                      <Space>
                                                        <div
                                                          className='th-pointer th-button-active th-br-8 px-2 py-1 th-12'
                                                          onClick={() => {
                                                            history.push({
                                                              pathname: '/diary/teacher',
                                                              state: {
                                                                diary_created_at:
                                                                  assignedDiaryList[index]
                                                                    ?.diary_created_at,
                                                              },
                                                            });
                                                          }}
                                                        >
                                                          View Homework
                                                        </div>
                                                      </Space>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            );
                                          })}
                                        </div>
                                      </Panel>
                                    </Collapse>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </Panel>
                  </Collapse>
                ))
              ) : (
                <div className='row justify-content-center mt-5'>
                  <img src={NoDataIcon} />
                </div>
              )}
            </>
          ) : (
            <>
              {loadingDrawer ? (
                <div className='text-center mt-5'>
                  <Spin tip='Loading...' />
                </div>
              ) : (
                <>
                  <QuestionPaperView questionData={questionData} />
                  <div className='row justify-content-end mt-3'>
                    <div className='col-md-4 col-sm-8'>
                      <Button
                        type='primary'
                        className='th-br-4'
                        onClick={closeQpDrawer}
                        style={{ float: 'right', marginRight: '-15px' }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </Drawer>
      </div>
      <div>
        <Modal
          visible={showInfoModal}
          onCancel={closeshowInfoModal}
          className='th-upload-modal'
          centered
          footer={[]}
        >
          <div className='row py-2'>
            <div className='col-12 px-md-4 pt-3 th-fw-500 th-18 th-grey'>
              <div className='row pl-md-5'>
                <div
                  style={{
                    border: '2px solid #25A53F',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                  }}
                  className='row mr-3'
                >
                  <img src={tickIcon} height={50} className='mr-5' />
                </div>
                <div>
                  Lesson is completed for <br />
                  {completeSections.length > 1 ? 'Sections' : 'Section'}&nbsp;
                  <span className='th-black-1 th-fw-600 '>
                    {completeSections
                      ?.map((item) => item.section__section_name.slice(-1).toUpperCase())
                      .join(', ')}
                  </span>
                </div>
              </div>
            </div>
            {nextPeriodDetails ? (
              <div className='col-12 pt-2 th-16 text-center'>
                View Resources for Upcoming Class
                <div className='col-12 pl-2 th-truncate'>
                  <div>
                    <div className='text-truncate'>
                      {nextPeriodDetails?.period_name},
                      {nextPeriodDetails?.key_concept__topic_name}{' '}
                    </div>
                    <div
                      className='th-grey'
                      style={{
                        fontStyle: 'italic',
                      }}
                    >
                      {nextPeriodDetails?.chapter__chapter_name}
                      {boardFilterArr.includes(window.location.host)
                        ? ',' + nextPeriodDetails?.chapter__lt_module__lt_module_name
                        : null}
                    </div>
                  </div>
                </div>
                {/* <span>
                  : {nextPeriodDetails?.period_name} {'> '}
                  {nextPeriodDetails?.key_concept__topic_name} {'> '}
                  {nextPeriodDetails?.chapter__chapter_name} {'> '}
                  {boardFilterArr.includes(window.location.host)
                    ? nextPeriodDetails?.chapter__lt_module__lt_module_name + ' > '
                    : null}
                  {nextPeriodDetails?.volume_name}
                </span> */}
                <Button
                  type='default'
                  onClick={handleNextPeriodResource}
                  className='ml-3 th-primary th-bg-grey'
                >
                  Resources <RightCircleOutlined />
                </Button>
              </div>
            ) : null}
            {allowAutoAssignDiary && (
              <div className='col-12 text-center'>
                <div
                  className='th-bg-primary th-white p-2 mt-2 text-center th-br-6 th-pointer th-br-8'
                  onClick={() => {
                    history.push({
                      pathname: '/create/diary',
                      state: {
                        periodData: {
                          subjectID: subjectId,
                          subjectName: history?.location?.state?.subjectName,
                          gradeID: gradeId,
                          gradeName: history?.location?.state?.gradeName,
                          volumeID: volumeId,
                          periodID: resourcesData?.id,
                          periodName: resourcesData?.period_name,
                          sections: completeSections,
                          chapterID: selectedKeyConcept.chapter_id,
                          chapterName: selectedChapter?.chapter_name,
                          keyConceptID: selectedKeyConcept?.key_concept_id,
                          keyConceptName: selectedKeyConcept?.topic_name,
                          board: boardId,
                        },
                        isDiaryAutoAssign: true,
                      },
                    });
                  }}
                >
                  <PlusCircleFilled className='mr-2' /> Add HW & Diary
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionPaperToTest: (data) => dispatch(addQuestionPaperToTest(data)),
});

export default connect(null, mapDispatchToProps)(TableView);
// export default TableView;
