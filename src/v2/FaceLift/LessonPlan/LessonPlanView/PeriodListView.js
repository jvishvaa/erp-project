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
} from 'antd';
import {
  CloseOutlined,
  DownOutlined,
  EyeFilled,
  CaretRightOutlined,
} from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';
import axiosInstance from 'axios';
import { useHistory } from 'react-router-dom';
import periodIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/periodicon.png';
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

const { Option } = Select;

const PeriodListView = () => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const formRef = createRef();
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level, user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();
  const [gradeName, setGradeName] = useState('');
  const [gradeId, setGradeId] = useState();
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState();
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState([]);
  const [volumeName, setVolumeName] = useState('');
  const [boardId, setBoardId] = useState([]);
  const [moduleListData, setModuleListData] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState([]);
  const [chapterListData, setChapterListData] = useState([]);
  const [chapterId, setChapterId] = useState();
  const [resourcesData, setResourcesData] = useState();
  const [keyConceptListData, setKeyConceptListData] = useState([]);
  const [keyConceptId, setKeyConceptId] = useState([]);
  const [centralGSID, setCentralGSID] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const [periodWiseData, setPeriodWiseData] = useState([]);
  const [YCPData, setYCPData] = useState([]);
  const [periodSortedData, setPeriodSortedData] = useState([]);
  const [currentPeriodId, setCurrentPeriodId] = useState('');
  const [showSection, setShowSection] = useState(false);
  const [completeSections, setCompleteSections] = useState([]);
  const [showError, setShowError] = useState(false);
  const [showCompletionStatusModal, setShowCompletionStatusModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  let isStudent = window.location.pathname.includes('student-view');
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
    setDrawerVisible(false);
    setDrawerData([]);
    setCompleteSections([]);
    setShowError(false);
  };
  const showModal = () => {
    setShowCompletionStatusModal(true);
  };

  const closeModal = () => {
    setShowCompletionStatusModal(false);
    setModalData([]);
  };
  const handleOk = () => {
    setShowCompletionStatusModal(false);
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
    setLoading(true);
    axios
      .get(`academic/get-module-list/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setModuleListData(result?.data?.result?.module_list);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
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
    if (boardFilterArr.includes(window.location.host)) {
      fetchModuleListData({
        subject_id: subjectId,
        volume: e.value,
        academic_year: history?.location?.state?.centralAcademicYearID,
        grade_id: gradeId,
        branch_id: selectedBranch?.branch?.id,
        board: boardId,
      });
    } else {
      fetchChapterListData({
        subject_id: subjectId,
        volume: e.value,
        grade_id: gradeId,
        branch_id: selectedBranch?.branch?.id,
        board: boardId,
      });
    }
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
        {each?.chapter_name}
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
    setChapterId('');
    // setChapterListData([]);
    // setKeyConceptListData([]);
    setKeyConceptId('');
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
    formRef.current.setFieldsValue({
      keyConcept: null,
    });
    setChapterId(e);
    setKeyConceptId('');
    fetchKeyConceptListData({
      chapter: e,
    });
  };
  const handleClearChapter = (e) => {
    setChapterId('');
    setKeyConceptId('');
  };
  const handleKeyConcept = (e) => {
    setKeyConceptId(e);
  };
  const handleClearKeyConcept = (e) => {
    setKeyConceptId('');
  };
  const fetchPeriodWiseData = (params = {}) => {
    setLoading(true);
    axios
      .get(`/academic/period-view/grade-subject-wise-lp-overview/`, {
        params: { ...params, ...(keyConceptId ? { key_concepts: keyConceptId } : {}) },
      })
      .then((res) => {
        if (res?.data?.status === 200) {
          setPeriodWiseData(res?.data?.data);
          setYCPData(res?.data?.ycp_data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  const markPeriodComplete = (item) => {
    setLoadingDrawer(true);
    if (completeSections?.length > 0) {
      setShowError(false);
      completeSections.map((section, index) => {
        let payLoad = {
          academic_year: selectedAcademicYear?.session_year,
          academic_year_id: history?.location?.state?.centralAcademicYearID,
          volume_id: Number(volumeId),
          volume_name: volumeName,
          subject_id: subjectId,
          chapter_id: chapterId,
          chapter_name: item.chapter__chapter_name,
          central_gs_mapping_id: Number(centralGSID),
          period_id: item?.id,
          section_mapping_id: [section],
        };
        axios
          .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
          .then((res) => {
            if (res.data.status_code === 200) {
              if (index == completeSections?.length - 1) {
                setCompleteSections([]);
                closeSectionList();
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
                fetchLessonResourcesData(drawerData);
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
  const getSortedPeriodData = (data) => {
    const conceptWisedata = data
      .sort((a, b) => Number(a.key_concept__sequence) - Number(b.key_concept__sequence))
      .reduce((initialValue, data) => {
        let key = data?.key_concept__topic_name;
        if (!initialValue[key]) {
          initialValue[key] = [];
        }
        initialValue[key].push(data);
        return initialValue;
      }, {});
    const sortedConceptData = Object.keys(conceptWisedata).map((concept) => {
      return {
        concept,
        data: conceptWisedata[concept],
      };
    });

    return sortedConceptData;
  };
  const fetchLessonResourcesData = (data) => {
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
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setResourcesData(result?.data?.data[0]);
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
  }, [chapterId, keyConceptId, selectedModuleId]);

  useEffect(() => {
    const all = moduleListData.slice();
    const allModules = all.map((item) => item.id).join(',');
    setSelectedModuleId(allModules);
  }, [moduleListData]);

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
  }, []);
  useEffect(() => {
    if (history?.location?.state.showTab == '1') {
      formRef.current.setFieldsValue({
        volume: history?.location?.state?.volumeName,
        chapter: history?.location?.state?.chapterName,
      });
      fetchVolumeListData();

      setGradeId(history?.location?.state?.gradeID);
      setGradeName(history?.location?.state?.gradeName);
      setSubjectId(history?.location?.state?.subjectID);
      setSubjectName(history?.location?.state?.subjectName);
      setVolumeId(history?.location?.state?.volumeID);
      setVolumeName(history?.location?.state?.volumeName);
      setChapterId(history?.location?.state?.chapterID);
      setBoardId(history?.location?.state?.boardID);
      setCentralGSID(history?.location?.state?.centralGSID);

      if (boardFilterArr.includes(window.location.host)) {
        fetchModuleListData({
          subject_id: history?.location?.state?.subjectID,
          volume: history?.location?.state?.volumeID,
          academic_year: history?.location?.state?.centralAcademicYearID,
          grade_id: history?.location?.state?.gradeID,
          branch_id: selectedBranch?.branch?.id,
          board: history?.location?.state?.boardID,
        });
      } else {
        fetchChapterListData({
          subject_id: history?.location?.state?.subjectID,
          volume: history?.location?.state?.volumeID,
          grade_id: history?.location?.state?.gradeID,
          branch_id: selectedBranch?.branch?.id,
          board: history?.location?.state?.boardID,
          // module_id: selectedModuleId,
        });
      }
      fetchKeyConceptListData({ chapter: history?.location?.state?.chapterID });
    }
  }, []);
  useEffect(() => {
    if (selectedModuleId.length > 0) {
      fetchChapterListData({
        subject_id: subjectId,
        volume: volumeId,
        grade_id: gradeId,
        branch_id: selectedBranch?.branch?.id,
        board: boardId,
        module_id: selectedModuleId,
      });
    }
  }, [selectedModuleId]);

  useEffect(() => {
    if (periodWiseData.length > 0) {
      setPeriodSortedData(getSortedPeriodData(periodWiseData));
    }
  }, [periodWiseData]);
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
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleChapter(e);
                  }}
                  onClear={handleClearChapter}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
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
      <div className='row'>
        {!loading && (
          <div className='col-12 mb-3 px-3'>
            <div className='row'>
              {YCPData?.filter((item) => item?.lesson_type == '1')[0]?.media_file[0] && (
                <div className='col-md-3 pl-md-0 col-12'>
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
                    <div className='row th-fw-600 th-pointer th-primary'>
                      <div className=''>Portion Document</div>
                      <div className='ml-3'>
                        <EyeFilled
                          className='th-primary'
                          fontSize={20}
                          style={{ verticalAlign: 'inherit' }}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              )}
              {YCPData?.filter((item) => item?.lesson_type == '2')[0]?.media_file[0] && (
                <div className='col-md-3 pl-md-0 col-12e4l'>
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
                    <div className='row th-fw-600 th-pointer th-primary'>
                      <div className=''>Yearly Curriculum Plan</div>
                      <div className='ml-3'>
                        <EyeFilled
                          className='th-primary'
                          fontSize={20}
                          style={{ verticalAlign: 'inherit' }}
                        />
                      </div>
                    </div>
                  </a>
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
      ) : periodWiseData.length > 0 ? (
        <div className='row th-br-10 pt-2 pb-3'>
          <div className='col-6 py-1 th-fw-600 th-20'>
            {' '}
            <img src={periodIcon} height='30' className='mr-3 pb-1 ml-1' />
            Periods
          </div>
          {periodWiseData?.every((item) => item.is_complete == true) ? (
            <div className='col-md-6 col-12 py-3 text-md-right pr-4 th-fw-600 th-20 th-primary'>
              All the periods are complete!
            </div>
          ) : null}
          <div className='col-12' style={{ height: '400px', overflowY: 'scroll' }}>
            <div className='row'>
              {periodSortedData?.map((period) => (
                <>
                  <div className='row py-2 px-0 th-black-1 th-divider'>
                    <Divider className='' orientation='left' orientationMargin='0'>
                      <span className='th-fw-600 th-18'>{period?.concept}</span>
                    </Divider>
                  </div>
                  {period?.data?.map((each, index) => (
                    <div className='col-md-4 pl-0'>
                      <div className='row mb-3 pb-1'>
                        <div className='col-12 th-br-20 th-bg-pink py-2 period-card'>
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
                              <div className='col-md-2 col-3 px-0 th-fw-600'>Chapter</div>
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
                                    placement={index % 3 === 0 ? 'bottomLeft' : 'bottom'}
                                    title={each?.completion_status?.map((item) => (
                                      <div className='row'>
                                        <span>
                                          Completed{' '}
                                          {user_level !== 13 && (
                                            <span>
                                              in Sec{' '}
                                              {item?.section_name.slice(-1).toUpperCase()}
                                            </span>
                                          )}{' '}
                                          by{' '}
                                          {item?.completed_by_user_id == user_id
                                            ? 'You'
                                            : item?.completed_by_user_name}{' '}
                                          on{' '}
                                          {moment(item?.completed_at).format(
                                            'YYYY/MM/DD'
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

      <div>
        <Drawer
          title='Resources'
          placement='right'
          onClose={closeDrawer}
          zIndex={1300}
          visible={drawerVisible}
          closable={false}
          className='th-resources-drawer'
          extra={
            <Space>
              <CloseOutlined onClick={closeDrawer} />
            </Space>
          }
        >
          {loadingDrawer ? (
            <div className='text-center mt-5'>
              <Spin tip='Loading...' />
            </div>
          ) : resourcesData ? (
            <div>
              {resourcesData?.lp_files.map((each) => each.media_file).flat().length >
              0 ? (
                <div
                  style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '50vh' }}
                  className='th-question'
                >
                  {resourcesData?.lp_files?.map((files, i) => (
                    <>
                      {files?.media_file?.map((each, index) => {
                        if (
                          (user_level == 13 && files?.document_type == 'Lesson_Plan') ||
                          (user_level == 13 &&
                            files?.document_type == 'Teacher_Reading_Material')
                        ) {
                        } else {
                          let fullName = each?.split(
                            `${files.document_type.toLowerCase()}/`
                          );
                          let fileName = fullName
                            ? fullName[fullName?.length - 1]?.split('.')
                            : null;
                          let file = fileName ? fileName[fileName?.length - 2] : '';
                          let extension = fileName ? fileName[fileName?.length - 1] : '';
                          return (
                            <div
                              className='row mt-2 py-2 align-items-center'
                              style={{ border: '1px solid #d9d9d9' }}
                            >
                              <div className='col-3'>
                                <img src={getFileIcon(extension)} />
                              </div>
                              <div className='col-9 px-0 th-pointer'>
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
                                    <div className='col-10'>{file}</div>
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
                  <div className='col-12 text-center'> No Resources Available</div>
                </div>
              )}

              <div className='mt-2'>
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
                            {resourcesData.section_wise_completion
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
                            style={{ transform: showSection ? `rotate(90deg)` : null }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showSection && (
                  <div className='row' style={{ border: '1px solid #d9d9d9' }}>
                    {resourcesData?.section_wise_completion.map((each, i) => (
                      <div className='col-2 p-2'>
                        {each.is_completed ? (
                          <Button disabled>
                            {each?.section__section_name.slice(-1).toUpperCase()}
                          </Button>
                        ) : (
                          <Button
                            type={
                              completeSections.includes(each.id) ? 'primary' : 'default'
                            }
                            onClick={() => {
                              if (completeSections.includes(each.id)) {
                                const index = completeSections.indexOf(each.id);
                                const newFileList = completeSections.slice();
                                newFileList.splice(index, 1);
                                setCompleteSections(newFileList);
                              } else {
                                setCompleteSections([...completeSections, each.id]);
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
                      {completeSections.length > 0 && (
                        <div
                          className='col-3 th-bg-grey th-black-1 p-2 th-br-6 th-pointer'
                          style={{ border: '1px solid #d9d9d9' }}
                          onClick={() => setCompleteSections([])}
                        >
                          Clear
                        </div>
                      )}
                      <div
                        className='col-3 th-bg-primary th-white p-2 mx-2 th-br-6 th-pointer'
                        onClick={() => {
                          markPeriodComplete(drawerData);
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
                    <div className='row th-black-2 mt-2 '>
                      <div className='col-12 th-grey pl-2 th-12'>
                        Last Updated {getTimeInterval(resourcesData?.updated_at)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
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
          <ol style={{ listStyle: 'none' }}>
            {modalData?.completion_status
              ?.filter((item) => item.is_complete == true)
              .map((item) => (
                <li>
                  <div className='row px-md-5 py-2 align-items-center'>
                    <div
                      style={{
                        borderRadius: '50%',
                        height: 8,
                        width: 8,
                      }}
                      className='mr-2 th-bg-primary'
                    ></div>
                    Completed in Sec {item?.section_name?.slice(-1).toUpperCase()} by{' '}
                    {item?.completed_by_user_id == user_id
                      ? 'You'
                      : item?.completed_by_user_name}{' '}
                    on {moment(item?.completed_at).format('DD/MM/YYYY')}
                  </div>
                </li>
              ))}
          </ol>
        </Modal>
      </div>
    </div>
  );
};

export default PeriodListView;
