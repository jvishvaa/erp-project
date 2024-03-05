import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Form,
  Popconfirm,
  Result,
  Select,
  Table,
  message,
} from 'antd';
import { Input, Space, Upload } from 'antd';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import axios from 'axios';
import '../BranchStaffSide/branchside.scss';
import dragDropIcon from 'v2/Assets/dashboardIcons/announcementListIcons/dragDropIcon.svg';
import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './../student/style.css';

const UploadHomework = () => {
  const history = useHistory();
  const [branch, setBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  // const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
  const searchRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch]);

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleChangeGrade = (each) => {
    if (each.some((item) => item.value === 'all')) {
      const allGrade = gradeList.map((item) => item.grade_id).join(',');
      setGrade(allGrade);
      fetchSection(allGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        grade: gradeList.map((item) => item.grade_id),
        section: [],
      });
    } else {
      const singleGrade = each.map((item) => item.value).join(',');
      setGrade(singleGrade);
      fetchSection(singleGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        section: [],
      });
    }
  };

  const handleChangeSection = (each) => {
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionList?.map((item) => item.section_id).join(',');
      setSection(allsections);
      formRef.current.setFieldsValue({
        section: sectionList?.map((item) => item.id),
      });
      fetchSubject(allsections);
    } else {
      const singleSection = each.map((item) => item.value).join(',');
      setSection(singleSection);
      fetchSubject(singleSection);
    }
  };

  const handleChangeSubject = (each) => {
    console.log(each);
    setSubject(each);
  };

  const handleClearGrade = () => {
    setGrade([]);
    setSection('');
    setSectionList([]);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
  };

  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
      );
      if (result.data.status_code === 200) {
        setSectionList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchSubject = async (section) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.subjects}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}&section=${section}`
      );
      if (result.data.status_code === 200) {
        setSubjectList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const subjectOptions = subjectList?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each.subject_mapping_id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const handleClearSection = () => {
    setSection([]);
  };

  const handleClearSubject = () => {
    setSubject([]);
  };

  const [fileList, setFileList] = useState([]);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(parseFloat(bytes / Math.pow(k, i))) + ' ' + sizes[i];
  };

  let todayDate = moment().format('DD-MM-YYYY');

  const handleUpload = () => {
    if (!subject?.value) {
      return message.error('Please Select Filters First !');
    }
    console.log(uniqueFilesList);
    uniqueFilesList.forEach((file) => {
      const formData = new FormData();
      formData.append('sub_sec_mpng', subject?.value);
      formData.append('file', file);
      formData.append('date', todayDate);

      axios
        .post(`${endpoints.homework.uploadZip}`, formData)
        .then((res) => {
          if (res?.data?.status_code === 200) {
            message.success('Attachment Added');
            // props.setUploadedFiles((pre) => [...pre, res?.data?.result]);
            setFileList([]);
            setUploading(false);
          }
        })
        .catch((e) => {
          message.error('Upload Failed');
        });
    });
  };
  const { Dragger } = Upload;
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    // accept: '.jpeg,.jpg,.png,.pdf ',
    accept: '.zip',
    multiple: false,
    maxCount: 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (...file) => {
      const type = file[0]?.type.split('/')[1];
      // if (['jpeg', 'jpg', 'png', 'pdf'].includes(type)) {
      if (['zip'].includes(type)) {
        setFileList([...file[1]]);
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }
      return false;
    },
    fileList,
  };

  const uniqueFiles = [];
  let uniqueFilesList = fileList.filter((element) => {
    const isDuplicate = uniqueFiles.includes(element.name);

    if (!isDuplicate) {
      uniqueFiles.push(element.name);

      return true;
    }
  });

  useEffect(() => {
    if (uniqueFilesList.length !== 0) {
      setUploading(false);
    } else {
      setUploading(true);
    }
  }, [uniqueFilesList]);

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className='th-black-1 th-16'
                href='/centralized-homework/homework-upload-status'
              >
                Homework Upload Status
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Homework Upload Status
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row'>
                <Form
                  id='filterForm'
                  className='mt-3'
                  layout={'vertical'}
                  ref={formRef}
                  style={{ width: '100%' }}
                >
                  <div className='row'>
                    <div className='col-md-12 row'>
                      <div className='col-md-2 col-sm-6 col-12'>
                        <Form.Item name='grade'>
                          <Select
                            mode='multiple'
                            getPopupContainer={(trigger) => trigger.parentNode}
                            maxTagCount={1}
                            allowClear={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                            placement='bottomRight'
                            showArrow={true}
                            onChange={(e, value) => handleChangeGrade(value)}
                            onClear={handleClearGrade}
                            dropdownMatchSelectWidth={false}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            placeholder='Select Grade'
                          >
                            {gradeOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-2 col-sm-6 col-12'>
                        <Form.Item name='section'>
                          <Select
                            mode='multiple'
                            getPopupContainer={(trigger) => trigger.parentNode}
                            maxTagCount={1}
                            allowClear={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                            placement='bottomRight'
                            showArrow={true}
                            onChange={(e, value) => handleChangeSection(value)}
                            onClear={handleClearSection}
                            dropdownMatchSelectWidth={false}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            placeholder='Select section'
                          >
                            {sectionOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-2 col-sm-6 col-12'>
                        <Form.Item name='Subject'>
                          <Select
                            // mode='multiple'
                            getPopupContainer={(trigger) => trigger.parentNode}
                            maxTagCount={1}
                            allowClear={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                            placement='bottomRight'
                            showArrow={true}
                            onChange={(e, value) => handleChangeSubject(value)}
                            onClear={handleClearSubject}
                            dropdownMatchSelectWidth={false}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            placeholder='Select Subject'
                          >
                            {subjectOptions}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>

              <div className='uploadContainer'>
                <div className='col-md-12'>
                  <div className='row px-4 mt-3 th-bg-white th-br-10'>
                    <div className='col-md-12 d-flex justify-content-center'>
                      <Dragger
                        multiple
                        {...draggerProps}
                        className='th-br-4'
                        style={{
                          border: '1px solid #D9D9D9',
                          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                          width: window.innerWidth < 768 ? 330 : 600,
                          height: 200,
                        }}
                      >
                        <p className='pt-2'>
                          <img src={dragDropIcon} />
                        </p>

                        <p className='pt-2'>
                          {' '}
                          Drag And Drop Files Here <br /> or
                        </p>

                        <Button
                          className='th-primary pb-2 mt-0 th-bg-white th-br-4'
                          style={{ border: '1px solid #1b4ccb' }}
                        >
                          Browse Files
                        </Button>
                      </Dragger>
                      {fileTypeError && (
                        <div className='row pt-3 justify-content-center th-red'>
                          Please add image and pdf files only
                        </div>
                      )}
                    </div>
                    {fileList?.length > 0 && (
                      <span className='th-black-1 mt-3'>Selected Files</span>
                    )}
                    {uniqueFilesList?.length > 0 && (
                      <div
                        className='row my-2 th-grey'
                        style={{ height: 150, overflowY: 'auto' }}
                      >
                        {uniqueFilesList?.map((item) => {
                          const filename = item?.name?.split('.')[0];
                          const extension = item?.type?.split('/')[1];

                          return (
                            <div className='row mb-1 align-items-center th-12 th-bg-grey py-1'>
                              <div className='col-6 text-truncate'>{filename}</div>
                              <div className='col-2 px-0'>{getSize(item?.size)}</div>
                              <div className='col-2 pr-0'>.{extension}</div>
                              <div className='col-2'>
                                <CloseCircleOutlined
                                  onClick={() => {
                                    draggerProps.onRemove(item);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className='row justify-content-end'>
                    <div className='col-md-3 mt-3'>
                      <Button
                        className=' th-br-4 float-right w-100'
                        type='primary'
                        onClick={handleUpload}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
      </Layout>
    </React.Fragment>
  );
};

export default UploadHomework;
