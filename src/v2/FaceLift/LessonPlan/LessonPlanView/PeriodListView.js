import React, { useState, useEffect, createRef, useRef } from 'react';
import {
  Select,
  Form,
  message,
  Drawer,
  Space,
  Modal,
  Spin,
  Tooltip,
  Button,
  Divider,
  Badge,
  Popconfirm,
  Pagination,
  Collapse,
  Tag,
} from 'antd';
import {
  CloseOutlined,
  DownOutlined,
  EyeFilled,
  CaretRightOutlined,
  LeftOutlined,
  RightOutlined,
  RightCircleOutlined,
  FilePdfOutlined,
  BookOutlined,
  SnippetsOutlined,
  FilePptOutlined,
  DownloadOutlined,
  FileUnknownOutlined,
  PlusCircleFilled,
  FormOutlined,
  DeleteOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import axios from 'v2/config/axios';
import axios2 from 'axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';
import axiosInstance from 'axios';
import { useHistory } from 'react-router-dom';
import periodIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/periodicon.png';
import tickIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/greenTick.svg';
import analysisIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/analysisIcon.png';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import pptFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pptFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pdfFileIcon.svg';
import videoFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/videoFileIcon.svg';
import audioFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/audiofile.svg';
import textFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/textfile.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/excelfile.svg';
import imageFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/imagefile.svg';
import defaultFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/defaultfile.svg';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import moment from 'moment';
import _ from 'lodash';
import EbookList from './viewEbooks';
import IbookList from './viewIbooks';
import { saveAs } from 'file-saver';
import QuestionPaperView from './QuestionPaperView';
import { addQuestionPaperToTest } from 'redux/actions';
import { connect } from 'react-redux';
import ASSIGNTEST from './../../../Assets/images/assigntest.png';
const { Option } = Select;
const { Panel } = Collapse;

const PeriodListView = ({ initAddQuestionPaperToTest }) => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const formRef = createRef();
  const myRef = useRef();
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const { user_level, user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [gradeName, setGradeName] = useState('');
  const [gradeId, setGradeId] = useState();
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState();
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState();
  const [volumeName, setVolumeName] = useState('');
  const [boardId, setBoardId] = useState([]);
  const [moduleListData, setModuleListData] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState([]);
  const [chapterListData, setChapterListData] = useState([]);
  const [chapterId, setChapterId] = useState();
  const [resourcesData, setResourcesData] = useState();
  const [keyConceptListData, setKeyConceptListData] = useState([]);
  const [keyConceptId, setKeyConceptId] = useState();
  const [centralGSID, setCentralGSID] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const [periodWiseData, setPeriodWiseData] = useState([]);
  const [YCPData, setYCPData] = useState([]);
  const [periodSortedData, setPeriodSortedData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState();
  const [showSection, setShowSection] = useState(false);
  const [completeSections, setCompleteSections] = useState([]);
  const [sectionsCompleted, setSectionsCompleted] = useState([]);
  const [showError, setShowError] = useState(false);
  const [showCompletionStatusModal, setShowCompletionStatusModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [nextPeriodDetails, setNextPeriodDetails] = useState();
  const [ebookData, setEbookData] = useState([]);
  const [ibookData, setIbookData] = useState([]);
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

  let isStudent = window.location.pathname.includes('student-view');
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'localhost:3001',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
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

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setShowError(false);
  };

  const openQpDrawer = (id) => {
    fetchQuestionData(id);
    setIsPeriodView(false);
  };

  const closeQpDrawer = () => {
    setLoadingDrawer(true);
    setIsPeriodView(true);
    setLoadingDrawer(false);
  };

  const handleAssign = (files) => {
    const obj = {
      is_central: true,
      id: files?.question_paper_id,
      section: files?.section,
      grade: files?.grade_id,
      total_marks: files?.total_marks,
      grade_subject_mapping: [resourcesData?.central_grade_subject_map_id],
      subjects: [resourcesData?.central_grade_subject_map_id],
      is_question_wise: files?.is_question_wise,
    };
    initAddQuestionPaperToTest(obj);
    history.push('/create-assesment');
  };

  const showModal = () => {
    setShowCompletionStatusModal(true);
  };

  const closeModal = () => {
    setShowCompletionStatusModal(false);
    setModalData([]);
  };
  const closeshowInfoModal = () => {
    setSectionsCompleted([]);
    setShowInfoModal(false);
  };
  const handleNextPeriodResource = () => {
    setCompleteSections([]);
    closeshowInfoModal();
    if (nextPeriodDetails) {
      fetchLessonResourcesData(nextPeriodDetails);
      if (nextPeriodDetails.volume_id !== volumeId) {
        setSelectedModuleId([]);
        formRef.current.setFieldsValue({
          volume: nextPeriodDetails.volume_name,
          chapter: nextPeriodDetails?.chapter__chapter_name,
          module: nextPeriodDetails?.chapter__lt_module__lt_module_name,
        });
        setVolumeId(nextPeriodDetails?.volume_id);
        setChapterId(nextPeriodDetails?.chapter_id);
        // setSelectedModuleId(nextPeriodDetails?.module_id);
        fetchChapterListData({
          subject_id: subjectId,
          volume: nextPeriodDetails?.volume_id,
          grade_id: gradeId,
          branch_id: selectedBranch?.branch?.id,
          board: boardId,
          module_id: nextPeriodDetails?.module_id,
        });
      } else if (nextPeriodDetails.chapter_id !== chapterId) {
        let chapterName = nextPeriodDetails?.chapter__chapter_name;
        formRef.current.setFieldsValue({
          chapter: chapterName,
        });
        setChapterId(nextPeriodDetails.chapter_id);
      }
    }
  };
  const showSectionList = () => {
    setShowSection((prevState) => !prevState);
  };

  const closeSectionList = () => {
    setShowSection(false);
  };
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
  const fetchModuleListData = (params = {}) => {
    axios
      .get(`academic/get-module-list/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setModuleListData(result?.data?.result?.module_list);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchChapterListData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.chapterList}`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setChapterListData(res?.data?.result?.chapter_list);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchKeyConceptListData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.keyConceptList}`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setKeyConceptListData(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handlevolume = (e) => {
    formRef.current.setFieldsValue({
      module: [],
      chapter: null,
      keyConcept: null,
    });
    setChapterListData([]);
    setKeyConceptListData([]);
    setVolumeId(e.value);
    setVolumeName(e.children);
    setChapterId();
    setChapterListData([]);
    setKeyConceptId();
    setKeyConceptListData([]);
  };
  const handleClearVolume = () => {
    setVolumeId('');
    setVolumeName('');
  };

  const volumeOptions = volumeListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });
  const moduleOptions = moduleListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.lt_module_name}
      </Option>
    );
  });
  const chapterOptions = chapterListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.lt_module?.lt_module_name.toLowerCase() == 'kit activity'
          ? `${each?.chapter_name} (Kit Activity)`
          : each?.chapter_name}
      </Option>
    );
  });
  const keyConceptOptions = keyConceptListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.topic_name}
      </Option>
    );
  });

  const handleModule = (each) => {
    formRef.current.setFieldsValue({
      chapter: null,
      keyConcept: null,
    });
    setChapterId();
    setChapterListData([]);
    setKeyConceptId();
    setKeyConceptListData([]);
    if (each.length === 1 && each.some((item) => item.value === 'All')) {
      const all = moduleListData.slice();
      const allModules = all.map((item) => item.id).join(',');
      setSelectedModuleId(allModules);
    } else if (each.some((item) => item.value === 'All') && each.length > 1) {
      message.error('Either select all modules or other options');
      return;
    } else {
      setSelectedModuleId(each.map((item) => item.value).join(','));
    }
  };
  const handleClearModule = () => {
    setSelectedModuleId('');
  };
  const handleChapter = (e) => {
    setChapterId(e);
    setKeyConceptId();
  };
  const handleClearChapter = (e) => {
    setChapterId('');
    setKeyConceptId();
  };
  const handleKeyConcept = (e) => {
    setKeyConceptId(e);
  };
  const handleClearKeyConcept = (e) => {
    setKeyConceptId();
  };

  const fetchPeriodWiseData = (params = {}) => {
    setLoading(true);
    setAllComplete(false);

    axios
      .get(`/academic/period-view/grade-subject-wise-lp-overview/`, {
        params: { ...params, ...(keyConceptId ? { key_concepts: keyConceptId } : {}) },
      })
      .then((res) => {
        if (res?.data?.status === 200) {
          setPeriodWiseData(res?.data?.data);
          setYCPData(res?.data?.ycp_data);
          if (res?.data?.data?.every((item) => item.is_complete == true)) {
            setAllComplete(true);
          }

          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
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
          setTotalIbook(res.data.result.count);
          // setTotal(res.data.result.total_ebooks)
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

  const markPeriodComplete = (item) => {
    setLoadingDrawer(true);
    let sectionsCompletedSuccess = [];
    if (completeSections?.length > 0) {
      setShowError(false);
      completeSections.map((section, index) => {
        let payLoad = {
          academic_year: selectedAcademicYear?.session_year,
          academic_year_id: resourcesData?.central_academic_year_id,
          volume_id: Number(volumeId),
          volume_name: volumeName,
          subject_id: subjectId,
          chapter_id: chapterId,
          chapter_name: item.chapter__chapter_name,
          central_gs_mapping_id: Number(centralGSID),
          period_id: item?.id,
          section_mapping_id: [section?.id],
          fetch_upcoming_period: true,
        };
        axios
          .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
          .then((res) => {
            if (res.data.status_code === 200) {
              if (
                !sectionsCompletedSuccess?.map((item) => item?.id).includes(section?.id)
              ) {
                sectionsCompletedSuccess.push(section);
              }
              setSectionsCompleted(sectionsCompletedSuccess);
              if (index == completeSections?.length - 1) {
                closeSectionList();
                closeDrawer();
                fetchPeriodWiseData({
                  acad_session_id: selectedBranch?.id,
                  board_id: boardId,
                  grade: gradeId,
                  subject: subjectId,
                  chapters: chapterId,
                  modules: selectedModuleId,
                  board: boardId,
                  volume: volumeId,
                  central_gs_id: centralGSID,
                });
                setCompleteSections([]);
                setShowInfoModal(true);
                if (!_.isEmpty(res.data.result)) {
                  setNextPeriodDetails(res.data.result);
                }
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
      setShowError(true);
    }
  };
  const getSortedPeriodData = (data) => {
    const conceptWisedata = data
      ?.sort((a, b) => Number(a.key_concept__sequence) - Number(b.key_concept__sequence))
      ?.reduce((initialValue, data) => {
        let key = data?.key_concept__topic_name;
        if (!initialValue[key]) {
          initialValue[key] = [];
        }
        initialValue[key].push(data);
        return initialValue;
      }, {});
    const sortedConceptData = Object.keys(conceptWisedata)?.map((concept) => {
      return {
        concept,
        data: conceptWisedata[concept],
      };
    });

    return sortedConceptData;
  };
  const fetchLessonResourcesData = (data) => {
    setResourcesData([]);
    setNextPeriodDetails();
    showDrawer();
    setLoadingDrawer(true);
    const params = {
      grade_id: gradeId,
      acad_session_id: selectedBranch?.id,
      topic_id: data?.key_concept_id,
      chapter_id: chapterId,
      period_id: data?.id,
    };
    axios
      .get(`academic/annual-plan/chapter-topic-wise-lp-data/`, {
        params: { ...params, ...(allowAutoAssignDiary ? { config: 'True' } : {}) },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setResourcesData(result?.data?.data[0]);
          setLoadingDrawer(false);
          if (allowAutoAssignDiary) {
            fetchDiaryCompletionStatus({
              period_id: data?.id,
              section_mapping: result?.data?.data[0]?.section_wise_completion
                ?.map((item) => item?.id)
                .join(','),
              subject: subjectId,
            });
          }
        } else {
          setLoadingDrawer(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingDrawer(false);
      });
  };

  const handleNext = () => {
    if (keyConceptId) {
      setKeyConceptId(keyConceptListData[currentIndex + 1]?.id);
      formRef.current.setFieldsValue({
        keyConcept: keyConceptListData[currentIndex + 1]?.topic_name,
      });
    } else {
      setChapterId(chapterListData[currentIndex + 1]?.id);
      formRef.current.setFieldsValue({
        chapter: chapterListData[currentIndex + 1]?.chapter_name,
      });
    }
  };

  const handlePrevious = () => {
    if (keyConceptId) {
      setKeyConceptId(keyConceptListData[currentIndex - 1]?.id);
      formRef.current.setFieldsValue({
        keyConcept: keyConceptListData[currentIndex - 1]?.topic_name,
      });
    } else {
      formRef.current.setFieldsValue({
        chapter: chapterListData[currentIndex - 1]?.chapter_name,
      });
      setChapterId(chapterListData[currentIndex - 1]?.id);
    }
  };
  const executeScroll = () => {
    myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    if (moduleListData.length > 0) {
      formRef.current.setFieldsValue({
        module: ['All'],
      });
      const all = moduleListData.slice();
      const allModules = all.map((item) => item.id).join(',');
      setSelectedModuleId(allModules);
    }
  }, [moduleListData]);

  useEffect(() => {
    fetchVolumeListData();
  }, [window.location.pathname]);

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
          message.success('Homework deleted successfully!');
          setAssignedDiaryList([]);
          setAssignedHWList([]);
          fetchDiaryCompletionStatus({
            period_id: resourcesData?.id,
            section_mapping: resourcesData?.section_wise_completion
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
            period_id: resourcesData?.id,
            section_mapping: resourcesData?.section_wise_completion
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
  useEffect(() => {
    fetchAllowAutoDiaryStatus();
  }, [selectedBranch]);

  useEffect(() => {
    if (myRef.current) executeScroll();
  }, [myRef.current]);
  useEffect(() => {
    if (history?.location?.state) {
      formRef.current.setFieldsValue({
        volume: history?.location?.state?.volumeName,
        chapter: history?.location?.state?.chapterName,
      });
      fetchChapterListData({
        subject_id: history?.location?.state?.subjectID,
        volume: history?.location?.state?.volumeID,
        grade_id: history?.location?.state?.gradeID,
        branch_id: selectedBranch?.branch?.id,
        board: history?.location?.state?.boardID,
      });
      setGradeId(history?.location?.state?.gradeID);
      setGradeName(history?.location?.state?.gradeName);
      setSubjectId(history?.location?.state?.subjectID);
      setSubjectName(history?.location?.state?.subjectName);
      setVolumeId(history?.location?.state?.volumeID);
      setVolumeName(history?.location?.state?.volumeName);
      setChapterId(Number(history?.location?.state?.chapterID));
      setBoardId(history?.location?.state?.boardID);
      setCentralGSID(history?.location?.state?.centralGSID);
    }
  }, [window.location.pathname]);
  useEffect(() => {
    if (chapterId) {
      fetchPeriodWiseData({
        acad_session_id: selectedBranch?.id,
        board_id: boardId,
        grade: gradeId,
        subject: subjectId,
        chapters: chapterId,
        modules: selectedModuleId,
        board: boardId,
        volume: volumeId,
        central_gs_id: centralGSID,
      });
    }
  }, [chapterId, keyConceptId]);
  useEffect(() => {
    if (selectedModuleId.length > 0) {
      if (chapterListData.length == 0) {
        fetchChapterListData({
          subject_id: subjectId,
          volume: volumeId,
          grade_id: gradeId,
          branch_id: selectedBranch?.branch?.id,
          board: boardId,
          module_id: selectedModuleId,
        });
      }
    }
  }, [selectedModuleId]);

  useEffect(() => {
    // if (periodWiseData.length > 0) {
    setPeriodSortedData(getSortedPeriodData(periodWiseData));
    // }
  }, [periodWiseData]);

  useEffect(() => {
    if (chapterId && chapterListData.length > 0) {
      if (keyConceptId) {
        setCurrentIndex(keyConceptListData?.map((e) => e.id).indexOf(keyConceptId));
      } else {
        setCurrentIndex(chapterListData?.map((e) => e.id).indexOf(chapterId));
      }
    }
  }, [periodWiseData, chapterListData]);

  useEffect(() => {
    setKeyConceptId();
    setKeyConceptListData([]);
    formRef.current.setFieldsValue({
      keyConcept: null,
    });
    if (chapterId) {
      fetchKeyConceptListData({
        chapter: chapterId,
      });
      formRef.current.setFieldsValue({
        keyConcept: 'All',
      });
    }
  }, [chapterId]);

  useEffect(() => {
    if (volumeId) {
      if (boardFilterArr.includes(window.location.host)) {
        setSelectedModuleId([]);
        fetchModuleListData({
          subject_id: subjectId,
          volume: volumeId,
          academic_year: history?.location?.state?.centralAcademicYearID,
          grade_id: gradeId,
          branch_id: selectedBranch?.branch?.id,
          board: boardId,
        });
      } else {
        fetchChapterListData({
          subject_id: subjectId,
          volume: volumeId,
          grade_id: gradeId,
          branch_id: selectedBranch?.branch?.id,
          board: boardId,
        });
      }
    }
  }, [volumeId]);

  const downloadMaterial = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    saveAs(blob, filename);
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

  return (
    <div className='row '>
      <div className='row align-items-center mb-2'>
        <div className='col-md-3 col-6 text-left pl-md-3'>
          <span className='th-grey'>Grade </span>
          <span className='text-capitalize th-fw-700 th-black-1'>{gradeName}</span>
        </div>
        <div className='col-md-3 col-6 text-left pl-md-2'>
          <span className='th-grey'>Subject </span>
          <span className='text-capitalize th-fw-700 th-black-1'>{subjectName}</span>
        </div>
      </div>
      <div className='col-12 px-0 px-md-2'>
        <Form id='filterForm' ref={formRef} layout={'horizontal'}>
          <div className='row align-items-center'>
            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left pl-md-1'>Volume</div>
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
                    handlevolume(value);
                  }}
                  onClear={handleClearVolume}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {volumeOptions}
                </Select>
              </Form.Item>
            </div>
            {boardFilterArr.includes(window.location.host) && (
              <div className='col-md-3 col-6 pl-md-1'>
                <div className='text-left'>Module</div>
                <Form.Item name='module'>
                  <Select
                    showSearch
                    mode='multiple'
                    maxTagCount={2}
                    optionFilterProp='children'
                    defaultValue={'All'}
                    value={selectedModuleId}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleModule(value);
                    }}
                    onClear={handleClearModule}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                    placement='bottomRight'
                    showArrow={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    placeholder='Select Module'
                  >
                    {moduleListData.length > 0 && (
                      <Option key='0' value='All'>
                        All
                      </Option>
                    )}
                    {moduleOptions}
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left'>Chapters</div>
              <Form.Item name='chapter'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Chapter'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleChapter(e);
                  }}
                  onClear={handleClearChapter}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                  allowClear
                >
                  {chapterOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left'>Key Concepts</div>
              <Form.Item name='keyConcept'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Key Concepts'
                  // placeholder={<span className='th-black-1'>All</span>}
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleKeyConcept(e);
                  }}
                  onClear={handleClearKeyConcept}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                  allowClear={true}
                >
                  {keyConceptOptions}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      {!chapterId ? (
        <div className='row justify-content-center my-5 th-24 th-black-2'>
          Please select the chapter to show data!
        </div>
      ) : (
        <>
          <div className='row'>
            {!loading && (
              <div className='col-12 mb-3 px-3'>
                <div className='row'>
                  {YCPData?.filter((item) => item?.lesson_type == '1')[0]
                    ?.media_file[0] && (
                    <div className='col-md-3 pl-0 col-12'>
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
                                  '.' +
                                  fileName?.split('.')[fileName?.split('.')?.length - 1],
                              },
                            ],
                          });
                        }}
                      >
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
                  {YCPData?.filter((item) => item?.lesson_type == '2')[0]
                    ?.media_file[0] && (
                    <div className='col-md-3 pl-0 col-12e4l'>
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
                                name: 'Yearly Curriculum Plan',
                                extension:
                                  '.' +
                                  fileName?.split('.')[fileName?.split('.')?.length - 1],
                              },
                            ],
                          });
                        }}
                      >
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
                          <span style={{ marginLeft: '5px', fontWeight: '600' }}>
                            Ebook
                          </span>
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
                          <span style={{ marginLeft: '5px', fontWeight: '600' }}>
                            Ibook
                          </span>
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
                </div>
              </div>
            )}
          </div>
          {loading ? (
            <div className='row justify-content-center my-5'>
              <Spin title='Loading...' />
            </div>
          ) : periodSortedData.length > 0 ? (
            <div className='row th-br-10 pt-2 pb-3'>
              <div className='col-6 py-1 th-fw-600 th-20'>
                {' '}
                <img src={periodIcon} height='30' className='mr-3 pb-1 ml-1' />
                Periods
              </div>
              {allComplete ? (
                <div className='col-md-6 col-12 py-3 text-md-right pr-4 th-fw-600 th-20 th-primary'>
                  All the periods are complete!
                </div>
              ) : null}
              <div className='col-12' style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                <div className='row'>
                  {periodSortedData?.map((period) => (
                    <>
                      <div className='row py-2 px-0 th-black-1 th-divider'>
                        {window.innerWidth < 768 ? (
                          <span className='th-fw-600 th-18'>{period?.concept}</span>
                        ) : (
                          <Divider className='' orientation='left' orientationMargin='0'>
                            <span className='th-fw-600 th-18'>{period?.concept}</span>
                          </Divider>
                        )}
                      </div>
                      {period?.data?.map((each, index) => (
                        <div
                          className='col-lg-4 col-md-6 pl-0'
                          ref={
                            !isStudent
                              ? each?.next_to_be_taught == true
                                ? myRef
                                : null
                              : each?.last_taught == true
                              ? myRef
                              : null
                          }
                        >
                          <div className='row mb-3 pb-1'>
                            <div
                              className={`col-12 th-br-20 th-bg-pink py-2 ${
                                isStudent
                                  ? each.last_taught == true
                                    ? 'highlighted-period'
                                    : 'period-card'
                                  : each.next_to_be_taught == true
                                  ? 'highlighted-period'
                                  : 'period-card'
                              }`}
                              // id={each.next_to_be_taught == true ? 'highlightedPeriod' : ''}
                            >
                              <div className='row px-1 pt-2'>
                                <div className='col-md-7 col-6 px-0 th-18 th-fw-600'>
                                  {each?.period_name}
                                </div>
                                <div className='col-md-5 col-6 px-0 th-12 d-flex justify-content-end align-items-center'>
                                  <div
                                    style={{
                                      borderRadius: '50%',
                                      height: 8,
                                      width: 8,
                                      background: each?.is_complete ? 'green' : 'red',
                                    }}
                                    className='mr-2'
                                  ></div>
                                  <div
                                    className={`${
                                      each?.is_complete ? 'th-green' : 'th-red'
                                    } th-fw-500`}
                                  >
                                    {each?.is_complete ? 'COMPLETED' : 'NOT COMPLETED'}
                                  </div>
                                </div>
                              </div>
                              <div className='row pt-3 pb-2 px-1 th-12'>
                                <div className='row'>
                                  <div className='col-md-2 col-3 px-0 th-fw-600'>
                                    Chapter
                                  </div>
                                  <div className='col-md-10 col-9 pl-1'>
                                    {each?.chapter__chapter_name}
                                  </div>
                                </div>
                                {boardFilterArr.includes(window.location.host) && (
                                  <div className='row'>
                                    <div className='col-md-2 col-3 px-0 th-fw-600'>
                                      Module
                                    </div>
                                    <div className='col-md-10 col-3 pl-1'>
                                      {each?.chapter__lt_module__lt_module_name}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className='row align-items-center'>
                                <div className='col-6 px-0 text-left th-12'>
                                  {each?.completion_status?.some(
                                    (item) => item.is_complete == true
                                  ) ? (
                                    isStudent ? (
                                      <Tooltip
                                        placement={
                                          index % 3 === 0 ? 'bottomLeft' : 'bottom'
                                        }
                                        title={each?.completion_status?.map((item) => (
                                          <div className='row'>
                                            <span>
                                              Completed{' '}
                                              {user_level !== 13 && (
                                                <span>
                                                  in Sec{' '}
                                                  {item?.section_name
                                                    .slice(-1)
                                                    .toUpperCase()}
                                                </span>
                                              )}{' '}
                                              by{' '}
                                              {item?.completed_by_user_id == user_id
                                                ? 'You'
                                                : item?.completed_by_user_name}{' '}
                                              on{' '}
                                              {moment(item?.completed_at).format(
                                                'DD/MM/YYYY'
                                              )}
                                            </span>
                                          </div>
                                        ))}
                                        trigger='click'
                                        className='th-pointer'
                                      >
                                        <img
                                          src={analysisIcon}
                                          height='18'
                                          className='mx-2'
                                        />
                                        View Status
                                      </Tooltip>
                                    ) : (
                                      <div
                                        onClick={() => {
                                          setModalData(each);
                                          showModal();
                                        }}
                                        className='th-pointer th-12'
                                      >
                                        <img
                                          src={analysisIcon}
                                          height='18'
                                          className='mx-2'
                                        />
                                        View Status
                                      </div>
                                    )
                                  ) : null}
                                </div>
                                <div className='col-6 px-0 text-right'>
                                  <div
                                    className='badge p-2 th-br-10 th-bg-pink th-pointer '
                                    style={{ border: '2px solid #d9d9d9' }}
                                    onClick={() => {
                                      setDrawerData(each);
                                      // setCurrentPeriodId(each?.id);
                                      // showDrawer();
                                      fetchLessonResourcesData(each);
                                    }}
                                  >
                                    View Resources &gt;
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='row justify-content-center my-5'>
              <img src={NoDataIcon} />
            </div>
          )}
          {!loading && (
            <div className='row justify-content-between p-1 pb-2'>
              <div className='col-lg-2 col-6'>
                <Button
                  disabled={currentIndex == 0}
                  type='primary'
                  onClick={handlePrevious}
                  className='th-br-6'
                >
                  <LeftOutlined /> Previous {keyConceptId ? 'Key Concept' : 'Chapter'}
                </Button>
              </div>
              <div className='col-lg-2 col-6 text-right'>
                <Button
                  disabled={
                    keyConceptId
                      ? currentIndex == keyConceptListData?.length - 1
                      : currentIndex == chapterListData?.length - 1
                  }
                  type='primary'
                  onClick={handleNext}
                  className='th-br-6'
                >
                  Next {keyConceptId ? 'Key Concept' : 'Chapter'}
                  <RightOutlined />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <Drawer
          title={
            <span className='th-fw-500'>
              {isPeriodView ? resourcesData?.period_name : 'Question Paper'}
            </span>
          }
          placement='right'
          onClose={isPeriodView ? closeDrawer : closeQpDrawer}
          zIndex={1300}
          visible={drawerVisible}
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          closable={false}
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
              ) : resourcesData ? (
                <div>
                  {boardFilterArr.includes(window.location.host) && (
                    <div className='row mt-1 th-fw-600'>
                      <div className='col-2 th-black-1 px-0'>
                        <div className='d-flex justify-content-between'>
                          <span>Module </span>
                          <span>:&nbsp;</span>
                        </div>
                      </div>

                      <div className='col-10 th-primary px-0'>
                        {resourcesData.module_name}
                      </div>
                    </div>
                  )}
                  <div className='row mt-2 th-fw-600'>
                    <div className='col-2 th-black-1 px-0'>
                      <div className='d-flex justify-content-between'>
                        <span>Chapter </span>
                        <span>:&nbsp;</span>
                      </div>
                    </div>

                    <div className='col-10 th-primary px-0'>
                      {resourcesData.chapter_name}
                    </div>
                  </div>
                  <div className='row mt-2 th-fw-600'>
                    <div className='col-3 th-black-1 px-0'>
                      <div className='d-flex justify-content-between'>
                        <span>Key Concept </span>
                        <span>:&nbsp;</span>
                      </div>
                    </div>

                    <div className='col-9 th-primary px-0'>
                      {resourcesData.topic_name}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12 text-through pl-0'>
                      <span className='th-grey'>Resources</span>
                    </div>
                  </div>
                  {resourcesData?.lp_files?.map((each) => each?.media_file).flat()
                    .length > 0 ? (
                    <div
                      style={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        maxHeight: '40vh',
                      }}
                    >
                      {resourcesData?.lp_files?.map((files, i) => (
                        <>
                          {files?.media_file?.map((each, index) => {
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
                                            target='_self'
                                            onClick={() =>
                                              downloadMaterial(
                                                `${endpoints.homework.resourcesFiles}/${each}`,
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
                          })}
                        </>
                      ))}
                    </div>
                  ) : (
                    <div className='row'>
                      <div className='col-12 text-center'> No Resources Available</div>
                    </div>
                  )}

                  {resourcesData?.lp_files?.map((files, i) => (
                    <>
                      {user_level !== 13 && files?.document_type == 'QuestionPaper' ? (
                        <div className='row mt-3'>
                          <div className='col-12 text-through pl-0'>
                            <span className='th-grey'>Quiz</span>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ))}

                  {resourcesData?.lp_files?.map((files, i) => (
                    <>
                      {user_level !== 13 && files?.document_type == 'QuestionPaper' ? (
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
                            <div className='col-10 px-0'>
                              <div className='row align-items-center'>
                                <div className='col-9 px-0'>
                                  <p
                                    className='text-ellipsis'
                                    title={files.question_paper_name}
                                  >
                                    {files.question_paper_name}
                                  </p>
                                </div>
                                <div className='col-1'>
                                  <a
                                    onClick={() => openQpDrawer(files.question_paper_id)}
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    title='View Quiz'
                                  >
                                    <EyeFilled />
                                  </a>
                                </div>
                                <div className='col-1'>
                                  <a
                                    onClick={() => handleAssign(files)}
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

                  <div className='mt-3'>
                    <div className='row mt-2'>
                      <div className='col-12 th-black-2 pl-0'>
                        Status :{' '}
                        {resourcesData?.section_wise_completion?.filter(
                          (item) => item?.is_completed === true
                        )?.length > 0 ? (
                          <span>
                            <span className='th-green th-fw-500'>Completed</span>
                            {!isStudent && (
                              <>
                                {' '}
                                for Section{' '}
                                {resourcesData?.section_wise_completion
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
                    {showSection && (
                      <>
                        <div className='row' style={{ border: '1px solid #d9d9d9' }}>
                          {resourcesData?.section_wise_completion?.map((each, i) => (
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
                            <div className='d-flex'>
                              {completeSections?.length > 0 && (
                                <div
                                  className='th-bg-grey th-black-1 p-2 th-br-6 th-pointer'
                                  style={{ border: '1px solid #d9d9d9' }}
                                  onClick={() => setCompleteSections([])}
                                >
                                  Clear
                                </div>
                              )}

                              {resourcesData?.section_wise_completion?.filter(
                                (item) => item.is_completed
                              )?.length ===
                              resourcesData?.section_wise_completion?.length ? (
                                <div
                                  className='th-white p-2 mx-2 th-br-6'
                                  style={{
                                    background: '#8dadff',
                                    cursor: 'not-allowed',
                                  }}
                                >
                                  Update
                                </div>
                              ) : (
                                <div
                                  className='th-bg-primary th-white p-2 mx-2 th-br-6 th-pointer'
                                  onClick={() => {
                                    markPeriodComplete(resourcesData);
                                  }}
                                >
                                  Update
                                </div>
                              )}
                            </div>
                          </div>
                          {showError && completeSections?.length < 1 && (
                            <div className='th-red'>
                              Please select at least one section first!
                            </div>
                          )}
                          <div className='row th-black-2 mt-2 '>
                            <div className='col-12 th-grey pl-2 th-12'>
                              Last Updated {getTimeInterval(resourcesData?.updated_at)}
                            </div>
                          </div>
                        </div>
                        {allowAutoAssignDiary ? (
                          assignedDiaryList.map((item) => item?.section).flat().length <
                          resourcesData?.section_wise_completion?.length ? (
                            <>
                              <div
                                className='th-bg-primary th-white p-2 text-center mt-2 th-br-8 th-pointer'
                                onClick={() => {
                                  if (completeSections?.length > 0) {
                                    message.error(
                                      'Please update the status of selected sections first!!'
                                    );
                                  } else {
                                    message.error(
                                      'Please update the status of desired sections first!!'
                                    );
                                  }
                                }}
                              >
                                <PlusCircleFilled className='mr-2' /> Add HW & Diary
                              </div>

                              {/* {resourcesData?.section_wise_completion?.filter(
                                (item) => item?.is_completed == true
                              )?.length > 0 ? (
                                <div className='th-bg-primary th-white p-2 text-center mt-2 th-br-8 th-pointer'>
                                  Create Diary for Sections Rohan{' '}
                                  {resourcesData?.section_wise_completion
                                    .filter((item) => item?.is_completed == true)
                                    .map((item) => item)
                                    .filter((el) =>
                                      assignedDiaryList
                                        .map((item) => item.section_mapping)
                                        .flat()
                                        .includes(el?.id)
                                    )}
                                </div>
                              ) : null} */}
                            </>
                          ) : null
                        ) : null}
                      </>
                    )}
                  </div>
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
                                      <div className='row'>
                                        <div className='col-2'>
                                          <ReadOutlined
                                            style={{
                                              fontSize: 30,
                                              color: '#1b4ccb',
                                            }}
                                          />
                                        </div>
                                        <div className='col-10'>
                                          <div className='th-fw-500 th-16 text-capitalize'>
                                            Diary
                                          </div>
                                          <div className='th-green th-14'>
                                            Successfully Assigned for Sections &nbsp;
                                            {assignedDiaryList
                                              .map((item) => item?.section)
                                              .flat()
                                              .map((el) => el?.slice(-1))
                                              .toString()}
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className='row'>
                                      {assignedDiaryList?.map((el, index) => {
                                        return el?.section?.map((each, sectionIndex) => (
                                          <div className='col-12'>
                                            <div className='d-flex justify-content-between align-items-center py-2'>
                                              <div className='th-fw-500 text-capitalize'>
                                                {each}
                                              </div>
                                              {user_id ==
                                              assignedDiaryList[index]?.created_by ? (
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
                                                            ...assignedDiaryList[index],
                                                            diary_id:
                                                              assignedDiaryList[index]
                                                                .dairy_id,
                                                            section_name: each,
                                                            section_mapping_id:
                                                              assignedDiaryList[index]
                                                                .section_mapping[
                                                                sectionIndex
                                                              ],
                                                            section_id:
                                                              assignedDiaryList[index]
                                                                ?.section_id[
                                                                sectionIndex
                                                              ],
                                                            chapterID: chapterId,
                                                            periodID: resourcesData?.id,
                                                            keyConceptID:
                                                              drawerData?.key_concept_id,
                                                          },
                                                          subject: {
                                                            subject_name: subjectName,
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
                                                        assignedDiaryList[index].dairy_id
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
                                        ));
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
                                      <div className='row'>
                                        <div className='col-2'>
                                          <ReadOutlined
                                            style={{
                                              fontSize: 30,
                                              color: '#1b4ccb',
                                            }}
                                          />
                                        </div>
                                        <div className='col-10'>
                                          <div className='th-fw-500 th-16 text-capitalize'>
                                            Homework
                                          </div>
                                          <div className='th-green th-14'>
                                            Successfully Assigned for Sections &nbsp;
                                            {assignedHWList
                                              .map((item) => item?.section)
                                              .flat()
                                              .map((el) => el?.slice(-1))
                                              .toString()}
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className='row'>
                                      {assignedHWList?.map((el, index) => {
                                        return el?.section?.map((each, sectionIndex) => (
                                          <div className='col-12'>
                                            <div className='d-flex justify-content-between align-items-center py-2'>
                                              <div className='th-fw-500 text-capitalize'>
                                                {each}
                                              </div>
                                              {user_id ==
                                              assignedHWList[index]?.created_by_staff ? (
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
                                                            ...assignedDiaryList[index],
                                                            diary_id:
                                                              assignedDiaryList[index]
                                                                .dairy_id,
                                                            section_name: each,
                                                            section_mapping_id:
                                                              assignedDiaryList[index]
                                                                .section_mapping[
                                                                sectionIndex
                                                              ],
                                                            section_id:
                                                              assignedDiaryList[index]
                                                                ?.section_id[
                                                                sectionIndex
                                                              ],
                                                            chapterID: chapterId,
                                                            periodID: resourcesData?.id,
                                                            keyConceptID:
                                                              drawerData?.key_concept_id,
                                                          },
                                                          subject: {
                                                            subject_name: subjectName,
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
                                                        assignedHWList[index].homework_id
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
                                        ));
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
                </div>
              ) : null}
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
          title={
            <div className='row align-items-center'>
              {' '}
              <img src={analysisIcon} height='20' className='mx-2' />
              Completion Status
            </div>
          }
          visible={showCompletionStatusModal}
          onCancel={closeModal}
          className='th-upload-modal'
          centered
          footer={[]}
        >
          {modalData?.completion_status
            ?.filter((item) => item.is_complete == true)
            .map((item) => (
              <div className='row px-md-5 py-2 align-items-center justify-content-start'>
                <span
                  style={{
                    borderRadius: '50%',
                    height: 8,
                    width: 8,
                  }}
                  className='mr-2 th-bg-primary'
                ></span>
                <span>
                  Completed in Sec {item?.section_name?.slice(-1).toUpperCase()} by{' '}
                  {item?.completed_by_user_id == user_id
                    ? 'You'
                    : item?.completed_by_user_name}{' '}
                  on {moment(item?.completed_at).format('DD/MM/YYYY')}
                </span>
              </div>
            ))}
        </Modal>
      </div>
      <div>
        <Modal
          visible={showInfoModal}
          onCancel={closeshowInfoModal}
          className='th-upload-modal-grey-close'
          centered
          footer={false}
          closeIcon={<CloseOutlined />}
          closable={true}
        >
          <div className='row py-2'>
            <div className='col-12 px-md-4 pt-3 th-fw-500 th-18 th-grey'>
              <div className='row justify-content-center'>
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
                  Period is completed for <br />
                  {sectionsCompleted?.length > 1 ? 'Sections' : 'Section'}&nbsp;
                  <span className='th-black-1 th-fw-600 '>
                    {sectionsCompleted
                      ?.map((item) =>
                        item?.section__section_name?.slice(-1).toUpperCase()
                      )
                      .join(', ')}
                  </span>
                </div>
              </div>
            </div>
            {nextPeriodDetails ? (
              <div className='col-12 pt-2 th-16'>
                <div className='text-center'>
                  View Resources for Upcoming Class{' '}
                  <div className='text-center'>
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
                  </div>
                </div>
                <div className='text-center'>
                  <Button
                    type='default'
                    onClick={handleNextPeriodResource}
                    className='my-1 th-primary th-bg-grey'
                  >
                    Resources <RightCircleOutlined />
                  </Button>
                </div>
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
                          subjectName: subjectName,
                          gradeID: gradeId,
                          gradeName,
                          volumeID: volumeId,
                          periodID: resourcesData?.id,
                          periodName: resourcesData?.period_name,
                          sections: sectionsCompleted,
                          chapterID: chapterId,
                          chapterName: resourcesData?.chapter_name,
                          keyConceptID: drawerData?.key_concept_id,
                          keyConceptName: resourcesData?.topic_name,
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

export default connect(null, mapDispatchToProps)(PeriodListView);

// export default PeriodListView;
