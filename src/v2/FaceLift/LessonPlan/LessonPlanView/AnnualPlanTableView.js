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
} from 'antd';
import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  CaretRightOutlined,
  RightCircleOutlined,
  RightOutlined,
  EyeFilled,
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
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import '../index.css';
import { useHistory } from 'react-router-dom';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import _ from 'lodash';

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

const TableView = (props) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const formRef = createRef();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
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
  const [nextPeriodDetails, setNextPeriodDetails] = useState();
  const [showInfoModal, setShowInfoModal] = useState(false);

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
  };
  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
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
      .get(`${endpoints.lessonPlan.subjects}`, { params: { ...params } })
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
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setResourcesData(result?.data?.data);
          if (!isStudent) {
            let index = result?.data?.data.findIndex(
              (item) => item.next_to_be_taught == true
            );
            index == -1 ? setCurrentPeriodPanel(0) : setCurrentPeriodPanel(index);
          } else {
            let index = result?.data?.data.findIndex((item) => item.last_taught == true);
            index == -1 ? setCurrentPeriodPanel(0) : setCurrentPeriodPanel(index);
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
                // fetchLessonResourcesData(selectedKeyConcept);
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
  }, [props.showTab]);

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
          title={<div className='th-bg-grey'>Resources</div>}
          placement='right'
          onClose={closeDrawer}
          visible={drawerVisible}
          closable={false}
          width={window.innerWidth < 768 ? '90vw' : '450px'}
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
                    style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: 160 }}
                    className='th-question'
                  >
                    {item?.lp_files.map((files, i) =>
                      files?.media_file?.map((each, index) => {
                        if (
                          (user_level == 13 && files?.document_type == 'Lesson_Plan') ||
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
                          let extension = fileName ? fileName[fileName?.length - 1] : '';
                          return (
                            <div
                              className='row mt-2 py-2 align-items-center'
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
                      })
                    )}
                  </div>
                  <hr />

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
                              style={{ transform: showSection ? `rotate(90deg)` : null }}
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
                                completeSections.includes(each) ? 'primary' : 'default'
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
                </Panel>
              </Collapse>
            ))
          ) : (
            <div className='row justify-content-center mt-5'>
              <img src={NoDataIcon} />
            </div>
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
              <div className='col-12 pt-2 th-16'>
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
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TableView;
