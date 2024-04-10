import React, { useEffect, useState } from 'react';
import Layout from 'containers/Layout';
import { Tabs, Button, Tooltip, message, Select, Popover, Checkbox, Result } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import endpoints from '../../../config/endpoints';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import './style.css';
import HomeworkAttachments from './homeworkAttachment';
import NoteTaker from './NoteTaker';
import DOWNLOADICON from './../../../assets/images/download-icon-blue.png';
import BOOKMARKICON from './../../../assets/images/bookmark-icon.png';
import NOTEICON from './../../../assets/images/note-icon.png';
import { ArrowLeftOutlined } from '@ant-design/icons';

const CentralizedStudentHw = () => {
  const { Option } = Select;
  const { TabPane } = Tabs;
  const [homeworkData, setHomeworkData] = useState([]);
  const [evaluateData, setEvaluateData] = useState([]);
  const [homework, setHomework] = useState();
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [showSubjectCount, setShowSubjectCount] = useState(10);
  const [volumeData, setvolumeData] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [docTypeList, setDocTypeList] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedHomeworkFilter, setSelectedHomeworkFilter] = useState(null);
  const [homeworkFilterVisible, setHomeworkFilterVisible] = useState(false);
  const [attachmentView, setAttachmentView] = useState(false);
  const [noteTakerView, setNoteTakerView] = useState(false);

  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);
  const [selectedEvaluatedIndex, setSelectedEvaluatedIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);

  const [showTab, setShowTab] = useState('1');

  const onTabChange = (key) => {
    setShowTab(key);
    fetchStudentHomework({
      sub_sec_mpng:
        subjectSelected === 'all'
          ? subjectList?.map((e) => e?.subject_mapping_id).join(',')
          : parseInt(subjectSelected?.subject_mapping_id),
      volume: selectedVolume,
      doc_type: selectedDocType ?? selectedDocType,
      is_assessed: key === '1' ? 'True' : 'False',
    });
  };

  console.log({ attachmentView });

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  let studentGrade = JSON.parse(localStorage.getItem('userDetails'))?.role_details
    ?.grades[0];

  console.log({ studentGrade });

  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
      );
      if (result.data.status_code === 200) {
        if (result?.data?.data?.length > 0) {
          setSelectedSection(result?.data?.data[0]?.sec_id);
        } else {
          setSelectedSection(null);
        }
        console.log('slist', result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchSection(studentGrade?.grade_id);

    fetchVolumeData();
    fetchDocType();
  }, []);

  console.log({ selectedSection });
  useEffect(() => {
    if (selectedSection) {
      getSubject({
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        grade: studentGrade?.grade_id,
        section: selectedSection,
      });
    }
    console.log('use effect');
  }, [selectedSection]);

  useEffect(() => {
    if (subjectList?.length > 0) {
      fetchStudentHomework({
        sub_sec_mpng:
          subjectSelected === 'all'
            ? subjectList?.map((e) => e?.subject_mapping_id).join(',')
            : parseInt(subjectSelected?.subject_mapping_id),
        volume: selectedVolume ?? selectedVolume,
        doc_type: selectedDocType ?? selectedDocType,
        is_assessed: showTab === '1' ? 'True' : 'False',
      });
    }
  }, [subjectSelected]);

  const fetchDocType = () => {
    axiosInstance
      .get(`${endpoints.centralizedHomework.docType}`)
      .then((res) => {
        console.log({ res });
        if (res?.data?.status_code === 200) {
          setDocTypeList(res?.data?.result?.results);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchStudentHomework = (params = {}) => {
    axiosInstance
      .get(`${endpoints.centralizedHomework.studentView}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          console.log({ res });
          setHomeworkData(res?.data?.result?.results[0]?.homework);
          setEvaluateData(res?.data.result?.results);
          setHomework(res?.data.result);
          setSelectedHomework(res?.data?.result?.results[0]?.homework[0]);
        } else {
          message.error(res?.data?.message);
        }
        // setHomeworkData(res.data.result);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const getSubject = (params = {}) => {
    axiosInstance
      .get(`${endpoints.centralizedHomework.subjectList}`, {
        params: { ...params },
      })
      .then((res) => {
        console.log('subject res', res);
        setSubjectList(res?.data?.data);
        setSubjectSelected('all');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchVolumeData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setvolumeData(result?.data?.result?.results);
        } else {
        }
      })
      .catch((error) => {});
  };

  // const downloadHomeworkAttachment = async (url, filename) => {
  //   console.log(url, filename);
  //   const res = await fetch(url);
  //   const blob = await res.blob();
  //   saveAs(blob, filename);
  // };

  const handleSubjectFilter = (sub) => {
    setSubjectSelected(sub);
    console.log({ sub });
    let selectedSubject;
    if (sub === 'all') {
      selectedSubject = subjectList?.map((e) => e?.subject_mapping_id).join(',');
      console.log({ selectedSubject });
    } else {
      selectedSubject = sub;
    }
    // fetchStudentHomework({
    //   sub_sec_mpng: selectedSubject,
    // });
  };

  const handleVolume = (e) => {
    setSelectedVolume(e);
    fetchStudentHomework({
      sub_sec_mpng:
        subjectSelected === 'all'
          ? subjectList?.map((e) => e?.subject_mapping_id).join(',')
          : parseInt(subjectSelected?.subject_mapping_id),
      volume: e,
      doc_type: selectedDocType ?? selectedDocType,
      is_assessed: showTab === '1' ? 'True' : 'False',
    });
  };

  const handleClearVolume = () => {
    setSelectedVolume(null);
  };

  const handleDocType = (e) => {
    setSelectedDocType(e);
    fetchStudentHomework({
      sub_sec_mpng:
        subjectSelected === 'all'
          ? subjectList?.map((e) => e?.subject_mapping_id).join(',')
          : parseInt(subjectSelected?.subject_mapping_id),
      volume: selectedVolume ?? selectedVolume,
      doc_type: e,
      is_assessed: showTab === '1' ? 'True' : 'False',
    });
  };

  const handleClearDocType = () => {
    setSelectedDocType(null);
  };

  const searchHomework = () => {
    const filteredHomework = homeworkData?.filter((item) => {
      if (selectedHomeworkFilter === 'bookmarked') {
        return item.isBookmarked;
      } else {
        return item.isNote;
      }
    });
    setHomeworkFilterVisible(false);
    setHomeworkData(filteredHomework);
  };

  const resetHomeworkFilter = () => {
    console.log('hit reset');
    setHomeworkData(homeworkData);
    setHomeworkFilterVisible(false);
    setSelectedHomeworkFilter(null);
  };

  const handleAttachmentView = () => {
    setAttachmentView(!attachmentView);
    setNoteTakerView(false);
  };

  const handleNoteTakerView = () => {
    if (!attachmentView) {
      setNoteTakerView(true);
      setAttachmentView(true);
    } else {
      setNoteTakerView(!noteTakerView);
    }
  };

  const handleAttachment = (index) => {
    console.log({ homeworkData });
    setSelectedEvaluatedIndex(index);
    setHomeworkData(evaluateData[index]?.homework);
    setSelectedHomework(evaluateData[index]?.homework[0]);
  };

  const VolumeOptions = volumeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  const DocTypeOptions = docTypeList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} className='text-capitalize'>
        {each?.doc_type_name}
      </Option>
    );
  });

  console.log('homeworkData', homeworkData);
  console.log({ selectedHomework });
  console.log({ subjectList });

  return (
    <React.Fragment>
      {/* <Layout>
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Centralized Student Homework
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div> */}

      <div className='th-br-8 th-bg-white mx-3 mb-3 py-3'>
        {!attachmentView && (
          <div className=''>
            <div
              style={{ width: '100%', margin: '0 auto' }}
              className='row justify-content-between'
            >
              <div className='col-md-9 col-xl-10 my-4 p-0 row'>
                <div className='col-md-3 col-xl-2 col-6 p-1'>
                  <Button
                    onClick={() => handleSubjectFilter('all')}
                    className={`${
                      subjectSelected == 'all' ? 'th-button-active' : 'th-button'
                    } th-width-100 th-br-6 text-truncate th-pointer`}
                  >
                    All Subject
                  </Button>
                </div>
                {subjectList?.slice(0, showSubjectCount).map((sub) => (
                  <div className='col-md-3 col-xl-2 col-6 p-1'>
                    <Tooltip title={sub?.sub_name}>
                      <Button
                        className={`${
                          sub?.subject_mapping_id == subjectSelected?.subject_mapping_id
                            ? 'th-button-active'
                            : 'th-button'
                        } th-width-100 th-br-6 text-truncate th-pointer`}
                        onClick={() => handleSubjectFilter(sub)}
                      >
                        {console.log(
                          'selected tab',
                          sub?.subject_mapping_id,
                          subjectSelected?.id
                        )}
                        {sub?.sub_name}
                      </Button>
                    </Tooltip>
                  </div>
                ))}
                {subjectList?.length > 10 && (
                  <div className='col-md-3 col-xl-2 col-6 p-1'>
                    <Button
                      className='th-width-100 th-br-6 text-truncate th-pointer th-button'
                      onClick={() => {
                        showSubjectCount == subjectList.length
                          ? setShowSubjectCount(10)
                          : setShowSubjectCount(subjectList.length);
                      }}
                    >
                      Show {showSubjectCount == subjectList.length ? 'Less' : 'All'}
                    </Button>
                  </div>
                )}
              </div>
              <div className='col-md-3 col-xl-2 mt-md-4 p-1'>
                <Select
                  placeholder='Select Volume'
                  allowClear
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleVolume(e);
                  }}
                  onClear={handleClearVolume}
                  className='w-100 text-left th-black-1 th-bg-grey th-select'
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {VolumeOptions}
                </Select>

                <Select
                  placeholder='Select Doc Type'
                  allowClear
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleDocType(e);
                  }}
                  onClear={handleClearDocType}
                  className='w-100 text-left th-black-1 th-bg-grey th-select mt-2'
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {DocTypeOptions}
                </Select>
              </div>
            </div>
          </div>
        )}

        {!attachmentView && (
          <>
            <div
              style={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              className=''
            >
              {/* <div className='col-md-8 col-xl-9 col-sm-12 col-12'>
                <div className='row align-items-center'>
                  <div className='col-md-6 col-sm-12 col-12 text-center'>
                    <p className='th-15 mb-0'>
                      Total Assessed :
                      <span className='text-success th-fw-600'>
                        {homework?.total_assessed}
                      </span>
                    </p>
                  </div>
                  <div className='col-md-6 col-sm-12 col-12 text-center th-left-border'>
                    <p className='th-15 mb-0'>
                      Total Under Assessed :
                      <span className='text-danger th-fw-600'>
                        {homework?.total_under_assessed}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className='col-md-4 col-xl-3 th-br-10 col-sm-12  py-3 col-12'
                style={{
                  boxShadow:
                    'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  marginBottom: '5px',
                  height: 'fit-content',
                }}
              >
                <div className='d-flex justify-content-between'>
                  Total Assessed: <span className='assessed-mark assessed'></span>
                </div>
                <div className='d-flex justify-content-between mt-2'>
                  Total Under Assessed:
                  <span className='assessed-mark under-assessed'></span>
                </div>
              </div> */}
              <div
                className='col-md-3 p-0'
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <div
                  className='col-md-12 py-2'
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    className='col-md-12 row justify-content-between'
                    style={{ color: 'green' }}
                  >
                    <span className='th-fw-600'>Total Assessed</span>
                    {<span>{homework?.total_assessed}</span>}
                  </div>
                  <div
                    className='col-md-12 row justify-content-between'
                    style={{ color: 'red' }}
                  >
                    <span className='th-fw-600'>Total Under Assessed</span>
                    {<span>{homework?.total_under_assessed}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className='th-tabs th-tabs-hw mt-3 th-bg-white'>
              <Tabs type='card' onChange={onTabChange} defaultActiveKey={showTab}>
                <TabPane tab='Assessed' key='1'></TabPane>
                <TabPane tab='Under Assessed' key='2'></TabPane>
              </Tabs>
            </div>
          </>
        )}
        {homeworkData?.length > 0 ? (
          <div className='row '>
            {attachmentView && (
              <div className='row my-2'>
                <p className='th-16 col-12 th-fw-600'>
                  <ArrowLeftOutlined onClick={() => handleAttachmentView(false)} />
                  <span className='ml-2'>{selectedHomework?.name}</span>
                </p>
              </div>
            )}

            {console.log({ selectedHomework })}

            {!attachmentView && (
              <div className='col-md-5 pl-0 col-xl-4 col-sm-12 col-12 mb-3'>
                <div className='card shadow border-0 th-br-4 w-100'>
                  <div className='card-body'>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <p className='text-uppercase'>Homework Files</p>
                      </div>
                      {/* FILETR */}
                      {/* <div className='text-muted' style={{ cursor: 'pointer' }}>
                          <Popover
                            getPopupContainer={(trigger) => trigger.parentNode}
                            showArrow={false}
                            overlayClassName='th-popover'
                            content={
                              <div className='w-100 th-br-4'>
                                <div className=' py-1'>
                                  <Checkbox
                                    className='th-large-checkbox'
                                    name='notebook_filter'
                                    value={'bookmarked'}
                                    onChange={(e) =>
                                      setSelectedHomeworkFilter(e.target.value)
                                    }
                                    checked={selectedHomeworkFilter === 'bookmarked'}
                                  >
                                    Bookmarked
                                  </Checkbox>
                                </div>
                                <div className='py-1'>
                                  <Checkbox
                                    className='th-large-checkbox'
                                    name='notebook_filter'
                                    value={'withnotes'}
                                    onChange={(e) =>
                                      setSelectedHomeworkFilter(e.target.value)
                                    }
                                    checked={selectedHomeworkFilter === 'withnotes'}
                                  >
                                    With Notes
                                  </Checkbox>
                                </div>

                                <div className='d-flex mt-3 justify-content-between'>
                                  <span
                                    className='text-muted th-fw-600'
                                    style={{ cursor: 'pointer' }}
                                    onClick={searchHomework}
                                  >
                                    Search
                                  </span>
                                  <span
                                    className='text-muted th-fw-600'
                                    style={{ cursor: 'pointer' }}
                                    onClick={resetHomeworkFilter}
                                  >
                                    Reset
                                  </span>
                                </div>
                              </div>
                            }
                            trigger='click'
                            placement='bottomRight'
                            visible={homeworkFilterVisible}
                            onClick={() =>
                              setHomeworkFilterVisible(!homeworkFilterVisible)
                            }
                          >
                            Filter <FilterOutlined />
                          </Popover>
                        </div> */}
                    </div>

                    <div className='notebook-list mt-3'>
                      {Array.isArray(evaluateData) &&
                        evaluateData?.length > 0 &&
                        evaluateData?.map((item, index) => (
                          <div
                            className='notebook-list-item'
                            key={index}
                            style={{
                              backgroundColor: `${
                                selectedEvaluatedIndex === index ? '#f8f8f8' : '#fff'
                              }`,
                            }}
                          >
                            {/* <div
                              className='download-icon cursor-pointer'
                              onClick={() => {
                                downloadHomeworkAttachment(
                                  `${endpoints.erpBucket}${selectedHomework?.file_location}`,
                                  item.file_location
                                );
                              }}
                            >
                              <img
                                src={DOWNLOADICON}
                                alt='download'
                                className='img-fluid'
                              />
                            </div> */}
                            <div
                              className='notebook-content ml-2'
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleAttachment(index)}
                            >
                              <Tooltip
                                title={`${item.erp} (${item?.date})`}
                                showArrow={false}
                                placement='right'
                                overlayInnerStyle={{
                                  borderRadius: 4,
                                  backgroundColor: 'white',
                                  color: 'black',
                                  maxHeight: 200,
                                  overflowY: 'scroll',
                                  textTransform: 'capitalize',
                                }}
                              >
                                <h5 className='th-14 mb-0'>
                                  {item.erp} ({item?.date}){' '}
                                </h5>
                                {/* <p className='th-12 mb-0 text-muted text-truncate'>
                                      <span className='th-fw-600'>Description:</span>
                                      {item.description}
                                    </p> */}
                              </Tooltip>
                            </div>
                            <div className='notebook-action'>
                              {item.is_bookmarked && (
                                <span>
                                  <img
                                    className='img-fluid'
                                    alt='bookmark'
                                    src={BOOKMARKICON}
                                  />
                                </span>
                              )}
                              {item.isNote && (
                                <span>
                                  <img
                                    className='img-fluid'
                                    alt='notebook'
                                    src={NOTEICON}
                                  />
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {attachmentView && noteTakerView && (
              <div
                className={` ${
                  attachmentView && noteTakerView
                    ? 'col-md-5 col-xl-4 col-12'
                    : attachmentView
                    ? 'col-12'
                    : 'col-md-7 col-xl-4 col-sm-12 col-12'
                }`}
              >
                <NoteTaker
                  noteTakerView={noteTakerView}
                  setNoteTakerView={setNoteTakerView}
                  handleNoteTakerView={handleNoteTakerView}
                  selectedHomework={selectedHomework}
                  setSelectedHomework={setSelectedHomework}
                  selectedHomeworkIndex={selectedHomeworkIndex}
                  setSelectedHomeworkIndex={setSelectedHomeworkIndex}
                  homeworkData={homeworkData}
                />
              </div>
            )}
            <div
              className={` ${
                attachmentView && noteTakerView
                  ? 'col-md-7 pr-0 col-xl-8 col-12 mb-3'
                  : attachmentView
                  ? 'col-12 pr-0 mb-3'
                  : 'col-md-7 pr-0 col-xl-8 col-sm-12 col-12 mb-3'
              }`}
            >
              <HomeworkAttachments
                attachmentView={attachmentView}
                setAttachmentView={setAttachmentView}
                handleAttachmentView={handleAttachmentView}
                handleNoteTakerView={handleNoteTakerView}
                selectedHomework={selectedHomework}
                setSelectedHomework={setSelectedHomework}
                selectedHomeworkIndex={selectedHomeworkIndex}
                setSelectedHomeworkIndex={setSelectedHomeworkIndex}
                homeworkData={homeworkData}
                setHomeworkData={setHomeworkData}
                evaluateData={evaluateData}
                setEvaluateData={setEvaluateData}
              />
            </div>
          </div>
        ) : (
          <Result
            status='warning'
            title={<span className='th-grey'>Nothing to show</span>}
          />
        )}
      </div>
      {/* </Layout> */}
    </React.Fragment>
  );
};

export default CentralizedStudentHw;
