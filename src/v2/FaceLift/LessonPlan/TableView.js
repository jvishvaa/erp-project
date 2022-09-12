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
  Radio,
  Spin,
} from 'antd';
import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  CaretRightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import pptFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pptFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pdfFileIcon.svg';
import videoFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/videoFileIcon.svg';
import audioFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/audiofile.svg';
import textFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/textfile.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/excelfile.svg';
import imageFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/imagefile.svg';
import defaultFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/defaultfile.svg';
import axiosInstance from 'axios';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import './index.css';
import { useHistory } from 'react-router-dom';
import fileDownload from 'js-file-download';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const { Option } = Select;
const { Panel } = Collapse;

const getFileIcon = (type) => {
  switch (type) {
    case 'ppt':
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

const TableView = () => {
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
  const [selectedModuleId, setSelectedModuleId] = useState([]);
  const [annualPlanData, setAnnualPlanData] = useState([]);
  const [keyConceptsData, setKeyConceptsData] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [selectedKeyConcept, setSelectedKeyConcept] = useState([]);
  const [resourcesData, setResourcesData] = useState([
    {
      id: 1560,
      lp_files: [
        {
          id: 15139,
          lesson_id: 1560,
          document_type: 'Video',
          file_name: '',
          media_file: [
            'dev/lesson_plan_file/38/48/183/666/video/1658469999_big_buck_bunny_720p_1mb.mp4',
            'dev/lesson_plan_file/38/48/183/666/video/1659510763_big_buck_bunny_720p_1mb.mp4',
          ],
          question_papers: [],
          is_quiz: false,
        },
        {
          id: 15138,
          lesson_id: 1560,
          document_type: '',
          file_name: '',
          media_file: [],
          question_papers: [],
          is_quiz: false,
        },
      ],
      period_name: 'Period-1',
      created_at: '2022-07-22T05:58:09.363255Z',
      updated_at: '2022-07-22T05:58:09.363308Z',
      completed_sections: [
        {
          id: 3087,
          section__section_name: 'SecA',
        },
        {
          id: 3088,
          section__section_name: 'sec B',
        },
      ],
      all_sections: [
        {
          id: 3088,
          section__section_name: 'sec B',
        },
        {
          id: 3087,
          section__section_name: 'SecA',
        },
      ],
    },
  ]);
  const [completeSections, setCompleteSections] = useState([]);
  const [showError, setShowError] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [completionCheck, setCompletionCheck] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const showSectionList = () => {
    setShowSection((prevState) => !prevState);
  };

  const closeSectionList = () => {
    setShowSection(false);
  };

  const handleCompletionCheck = () => {
    if (completionCheck) {
      setCompletionCheck(false);
    } else {
      setCompletionCheck(true);
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
  const fetchModuleListData = (params = {}) => {
    axios
      .get(`/academic/get-module-list/`, {
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
  const fetchAnnualPlanData = (params = {}) => {
    setLoading(true);
    axios
      .get(`academic/annual-plan/modules/`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status === 200) {
          setAnnualPlanData(result?.data?.data);
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
      chapter_id: selectedChapter?.chapter_id,
    };
    axios
      .get(`academic/annual-plan/chapter-topic-wise-lp-data/`, {
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
        grade_id: e,
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
  const handlevolume = (e) => {
    setVolumeId(e.value);
  };
  const handleClearVolume = () => {
    setVolumeId('');
  };

  const handleModule = (each) => {
    if (each.length === 1 && each.some((item) => item.value === 'All')) {
      const all = moduleListData.slice();
      const allModules = all.map((item) => item.id).join(',');
      setSelectedModuleId(allModules);
    } else if (each.some((item) => item.value === 'All') && each.length > 1) {
      message.error('Either select all branch or other options');
      return;
    } else {
      setSelectedModuleId(each.map((item) => item.value).join(','));
    }
  };

  const handleClearModule = () => {
    setSelectedModuleId('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
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
  const moduleOptions = moduleListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.lt_module_name}
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

  const handleDownload = (file) => {
    axios
      .get(`${endpoints.homework.resourcesFiles}/${file}`, {
        responseType: 'blob',
      })
      .then((res) => {
        fileDownload(res.data, file);
      });
  };

  const markPeriodComplete = (item) => {
    if (completeSections.length > 0) {
      setShowError(false);
      closeSectionList();
      completeSections.map((section, index) => {
        let payLoad = {
          academic_year: selectedAcademicYear?.session_year,
          academic_year_id: item.central_academic_year_id,
          volume_id: volumeId,
          volume_name: volumeName,
          subject_id: subjectId,
          chapter_id: selectedChapter.chapter_id,
          chapter_name: selectedChapter.chapter__chapter_name,
          // grade_subject: item.central_grade_subject_map_id,
          central_gs_mapping_id: item.central_grade_subject_map_id,
          period_id: item?.id,
          section_mapping_id: [section],
        };
        axios
          .post(`/academic/v2/lessonplan-completed-status/`, payLoad)
          .then((res) => {
            if (res.data.status_code === 200) {
              if (index == completeSections.length - 1) {
                setCompleteSections([]);
                fetchLessonResourcesData();
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
    }
    fetchModuleListData({
      subject_id: history?.location?.state?.subjectID,
      volume: history?.location?.state?.volumeID,
      academic_year: history?.location?.state?.centralAcademicYearID,
      grade_id: history?.location?.state?.gradeID,
      branch_id: 188,
      // branch_id: selectedBranch?.branch?.id,
      board: history?.location?.state?.boardID,
    });
  }, []);
  useEffect(() => {
    if (selectedModuleId.length == 0) {
      const all = moduleListData.slice();
      const allModules = all.map((item) => item.id).join(',');
      setSelectedModuleId(allModules);
    }
  }, [moduleListData]);
  useEffect(() => {
    if (selectedModuleId.length > 0) {
      fetchAnnualPlanData({
        module_id: selectedModuleId,
        subject_id: subjectId,
        volume_id: volumeId,
        acad_session_id: selectedBranch?.id,
        grade_id: gradeId,
        board_id: boardId,
      });
    }
  }, [selectedModuleId]);

  const expandedRowRender = () => {
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
        width: '20%',
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '20%',
      },
      {
        title: '',
        dataIndex: 'key_concept__topic_name',
        align: 'left',
        width: tableWidthCalculator(25) + '%',
        render: (text, row, index) => (
          <span
            className='th-black-2 th-pointer text-truncate'
            onClick={() => {
              setSelectedKeyConcept(row);
              fetchLessonResourcesData(row);
            }}
          >
            {index + 1}. {row.key_concept__topic_name}
          </span>
        ),
      },
      {
        title: '',
        dataIndex: 'lp_count',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '5%',
        render: (data) => <span className='th-black-'>{''}</span>,
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={keyConceptsData}
        loading={loadingInner}
        pagination={false}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>CHAPTER NO.</span>,
      align: 'center',
      width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}.</span>,
    },

    {
      title: <span className='th-white th-fw-700 '>CHAPTER</span>,
      dataIndex: 'chapter__chapter_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MODULE</span>,
      dataIndex: 'chapter__lt_module__lt_module_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>KEY CONCEPTS</span>,
      dataIndex: 'kc_count',
      width: '25%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
      dataIndex: 'lp_count',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
  ];
  console.log('kkk', completionCheck);
  return (
    <div className='row'>
      <div className='col-12 mb-2'>
        <Form id='filterForm' ref={formRef} layout={'horizontal'}>
          <div className='row align-items-center'>
            {user_level !== 13 && (
              <div className='col-md-3 col-6 px-0'>
                <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
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
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
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
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
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
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {volumeOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
              <div className='mb-2 text-left'>Module</div>
              <Select
                placeholder='Select Module'
                showSearch
                mode='multiple'
                maxTagCount={2}
                defaultValue={'All'}
                optionFilterProp='children'
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={(e, value) => {
                  handleModule(value);
                }}
                onClear={handleClearModule}
                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                bordered={false}
              >
                <Option key='0' value='All'>
                  All
                </Option>
                {moduleOptions}
              </Select>
            </div>
          </div>
        </Form>
      </div>
      <div className='col-12'>
        <Table
          className='th-table'
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
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
          scroll={{ x: 'max-content' }}
        />
      </div>
      <div>
        <Drawer
          zIndex={1300}
          title={<div className='th-bg-grey'>Resources</div>}
          placement='right'
          onClose={closeDrawer}
          visible={drawerVisible}
          // visible={true}
          closable={false}
          width={'450px'}
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
                defaultActiveKey={['0']}
                accordion={true}
                expandIconPosition='right'
                bordered={true}
                className='th-br-6 my-2 th-bg-grey th-collapse'
                style={{ border: '1px solid #d9d9d9' }}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className='row'>
                      <div className='th-black-1 th-fw-600 col-6 pl-0'>
                        {selectedKeyConcept.key_concept__topic_name}
                      </div>
                      <div className='th-black-1 px-0 col-6'>: {item.period_name}</div>
                    </div>
                  }
                  key={i}
                >
                  <div className='row mt-1 th-fw-600'>
                    <div className='col-5 th-black-1 pl-0'>Module</div>
                    <div className='col-6 th-primary'>
                      : {selectedChapter.chapter__lt_module__lt_module_name}
                    </div>
                  </div>
                  <div className='row mt-2 th-fw-600'>
                    <div className='col-5 th-black-1 pl-0'>Chapter Name</div>
                    <div className='col-6 th-primary'>
                      : {selectedChapter.chapter__chapter_name}
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-12 text-through pl-0'>
                      <span className='th-grey'>Resources</span>
                    </div>
                  </div>
                  <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 160 }}>
                    {item.lp_files.map((files, i) =>
                      files.media_file?.map((each, index) => {
                        let fullName = each.split(
                          `${files.document_type.toLowerCase()}/`
                        );
                        let fileName = fullName[fullName.length - 1].split('.');
                        let extension = fileName[fileName.length - 1];
                        return (
                          <div
                            className='row mt-2 py-2'
                            style={{ border: '1px solid #d9d9d9' }}
                          >
                            <div className='col-3'>
                              <img src={getFileIcon(extension)} />
                            </div>
                            <div className='col-7 px-0 th-pointer'>
                              {' '}
                              <a
                                onClick={() => {
                                  openPreview({
                                    currentAttachmentIndex: 0,
                                    attachmentsArray: [
                                      {
                                        // src: `${endpoints.announcementList.s3erp}${each}`,
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
                                <div>{fileName}</div>
                              </a>
                            </div>
                            <div className='col-2'>
                              <DownloadOutlined
                                className='th-primary th-pointer'
                                onClick={() => handleDownload(each)}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <hr />

                  <div className='row mt-2'>
                    <div className='col-12 th-black-2 pl-0'>
                      Status :{' '}
                      {item?.section_wise_completion?.filter(
                        (item) => item?.is_completed === true
                      ).length > 0 ? (
                        <span>
                          <span className='th-green'>Completed</span> for Section{' '}
                          {item.section_wise_completion
                            .filter((item) => item?.is_completed === true)
                            .map((item) =>
                              item?.section__section_name.slice(-1).toUpperCase()
                            )
                            .join(', ')}
                        </span>
                      ) : (
                        <span> Not Completed</span>
                      )}
                    </div>
                  </div>

                  {user_level !== 13 && (
                    <div className='row th-black-2 mt-2 '>
                      <div className='col-12' style={{ border: '1px solid #d9d9d9' }}>
                        <div
                          className='row justify-content-between py-2 th-pointer'
                          onClick={() => showSectionList()}
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
                      {item.section_wise_completion.map((each, i) => (
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
                      {/* <div className='row mt-2 justify-content-end'>
                        <div
                          className='col-4 px-2 py-1 th-br-4 mr-2'
                          style={{ border: '1px solid #d9d9d9' }}
                        >
                          <Radio
                            onChange={handleCompletionCheck}
                            checked={completionCheck}
                          >
                            Completed
                          </Radio>
                        </div>
                      </div> */}
                      <div
                        className='row justify-content-end py-2 mt-2 text-center'
                        style={{ borderTop: '1px solid #d9d9d9' }}
                      >
                        <div
                          className='col-3 th-bg-grey th-black-1 p-2 th-br-6 th-pointer'
                          style={{ border: '1px solid #d9d9d9' }}
                          onClick={() => closeSectionList()}
                        >
                          Close
                        </div>
                        <div
                          className='col-3 th-bg-primary th-white p-2 mx-2 th-br-6 th-poinrt'
                          onClick={() => markPeriodComplete(item)}
                        >
                          Update
                        </div>
                      </div>
                      {showError && completeSections.length < 1 && (
                        <div className='th-red'>
                          Please select atleast one section first!
                        </div>
                      )}
                    </div>
                  )}
                  <div className='row th-black-2 mt-2 '>
                    <div className='col-12 th-grey pl-0 th-12'>
                      Last Upadted {getTimeInterval(item.updated_at)}
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
    </div>
  );
};

export default TableView;
