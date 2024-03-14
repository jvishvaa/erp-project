import React, { useEffect, useState } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Button,
  Tooltip,
  message,
  Select,
  Popover,
  Checkbox,
  Result,
} from 'antd';
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
  const [homeworkData, setHomeworkData] = useState([]);
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

  useEffect(() => {
    getSubject({
      acad_session_id: selectedAcademicYear?.id,
      branch: selectedBranch?.branch?.id,
      grade: studentGrade?.grade_id,
    });
    fetchVolumeData();
    fetchDocType();
  }, []);

  useEffect(() => {
    if (subjectList?.length > 0) {
      fetchStudentHomework({
        sub_sec_mpng:
          subjectSelected === 'all'
            ? subjectList?.map((e) => e?.subject_mapping_id).join(',')
            : parseInt(subjectSelected?.subject_mapping_id),
        volume: selectedVolume ?? selectedVolume,
        doc_type: selectedDocType ?? selectedDocType,
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
          setHomeworkData(res?.data.result?.results);
          setHomework(res?.data.result);
          setSelectedHomework(res?.data?.result?.results[0]);
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
      .get(`${endpoints.academics.subjects}`, {
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

  const downloadHomeworkAttachment = async (url, filename) => {
    console.log(url, filename);
    const res = await fetch(url);
    const blob = await res.blob();
    saveAs(blob, filename);
  };

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
    setSelectedHomeworkIndex(index);
    setSelectedHomework(homeworkData[index]);
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
          <div className='col-md-12'>
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
                          sub?.subject_mapping_id == subjectSelected?.id
                            ? 'th-button-active'
                            : 'th-button'
                        } th-width-100 th-br-6 text-truncate th-pointer`}
                        onClick={() => handleSubjectFilter(sub)}
                      >
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
                >
                  {DocTypeOptions}
                </Select>
              </div>
            </div>
          </div>
        )}
        {homeworkData?.length > 0 ? (
          <>
            <div
              style={{ width: '100%', margin: '0 auto' }}
              className='row justify-content-between mt-3'
            >
              <div className='col-md-8 col-xl-9 col-sm-12 col-12'>
                <div className='row mb-3'>
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
              <div className='col-md-4 col-xl-3 col-sm-12 col-12'>
                <div className='d-flex justify-content-between'>
                  Total Assessed: <span className='assessed-mark assessed'></span>
                </div>
                <div className='d-flex justify-content-between mt-2'>
                  Total Under Assessed:
                  <span className='assessed-mark under-assessed'></span>
                </div>
              </div>
            </div>
            <div className='row mt-3'>
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
                <div className='col-md-5 col-xl-4 col-sm-12 col-12 mb-3'>
                  <div className='card shadow border-0 th-br-4 w-100'>
                    <div className='card-body'>
                      <div className='d-flex justify-content-between'>
                        <div>
                          <p className='text-uppercase'>Homework Files</p>
                        </div>
                        <div className='text-muted' style={{ cursor: 'pointer' }}>
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
                        </div>
                      </div>

                      <div className='notebook-list mt-3'>
                        {Array.isArray(homeworkData) &&
                          homeworkData?.length > 0 &&
                          homeworkData?.map((item, index) => (
                            <div
                              className='notebook-list-item'
                              key={index}
                              style={{
                                backgroundColor: `${
                                  selectedHomeworkIndex === index ? '#f8f8f8' : '#fff'
                                }`,
                              }}
                            >
                              <div
                                className='download-icon cursor-pointer'
                                onClick={() => {
                                  downloadHomeworkAttachment(
                                    `${endpoints.erpBucket}${item?.file_location}`,
                                    item.file_location
                                  );
                                }}
                              >
                                <img
                                  src={DOWNLOADICON}
                                  alt='download'
                                  className='img-fluid'
                                />
                              </div>
                              <div
                                className='notebook-content ml-2'
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAttachment(index)}
                              >
                                <Tooltip
                                  title={`${item.file_location}`}
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
                                  <h5 className='th-14 mb-0'>{item.file_location}</h5>
                                  {/* <p className='th-12 mb-0 text-muted text-truncate'>
                                      <span className='th-fw-600'>Description:</span>
                                      {item.description}
                                    </p> */}
                                </Tooltip>
                              </div>
                              <div className='notebook-action'>
                                {item.isBookmarked && (
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
                    ? 'col-md-7 col-xl-8 col-12 mb-3'
                    : attachmentView
                    ? 'col-12 mb-3'
                    : 'col-md-7 col-xl-8 col-sm-12 col-12 mb-3'
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
                />
              </div>
            </div>
          </>
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
