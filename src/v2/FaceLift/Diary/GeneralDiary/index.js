import React, { useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Form,
  Select,
  Input,
  Table,
  Button,
  Spin,
  message,
  Checkbox,
} from 'antd';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import uploadIcon from 'v2/Assets/dashboardIcons/announcementListIcons/uploadIcon.svg';
import UploadDocument from '../UploadDocument';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';

const GeneralDiary = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedAcademicYear
  );
  const academicYearList = useSelector(
    (state) => state.commonFilterReducer?.academicYearList
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [loading, setLoading] = useState(false);
  const [moduleId, setModuleId] = useState();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [branchID, setBranchID] = useState();
  const [branchName, setBranchName] = useState('');
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [academicYearID, setAcademicYearID] = useState();
  const [sectionID, setSectionID] = useState();
  const [sectionMappingID, setSectionMappingID] = useState();
  const [gradeID, setGradeID] = useState();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [generalDairyUsers, setGeneralDiaryUsers] = useState('');
  const [studentCheckedID, setStudentCheckedID] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const formRef = createRef();
  const { Option } = Select;
  const { TextArea } = Input;
  const history = useHistory();

  const sectionOptions = sectionDropdown?.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.section_id} mappingId={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };
  const handleShowModal = () => {
    if (!branchID && !gradeID) {
      message.error('Please select branch and grade first');
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

  const handleBack = () => {
    history.push('/diary/teacher');
    // setState({ isEdit: false, editData: [] });
  };

  const handleSection = (e) => {
    setSectionID(e.value);
    setSectionMappingID(e.mappingId);
  };

  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: null,
    });
    setSectionDropdown([]);
    if (e) {
      setGradeID(e);
      const params = {
        session_year: academicYearID,
        branch_id: branchID,
        grade_id: e,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.sections}`, { params: { ...params } })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setSectionDropdown(result?.data?.data);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const branchOptions = branchDropdown?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const handleBranch = (each) => {
    formRef.current.setFieldsValue({
      grade: null,
      section: null,
    });
    setGradeDropdown([]);
    setSectionDropdown([]);
    if (each) {
      setBranchID(each.value);
      setBranchName(each.children);
      const params = {
        session_year: academicYearID,
        branch_id: each.value,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.grades}`, { params: { ...params } })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const gradeData = result?.data?.data || [];
            setGradeDropdown(gradeData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const yearOptions = academicYearList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.session_year}
      </Option>
    );
  });

  const handleStudentCheckbox = (e, id) => {
    if (e.target.checked) {
      setStudentCheckedID([...studentCheckedID, id]);
    } else {
      const index = studentCheckedID.indexOf(id);
      if (index > -1) {
        const newList = studentCheckedID.slice();
        newList.splice(index, 1);
        setStudentCheckedID(newList);
      }
    }
  };

  const handleClearAcademic = () => {
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
  };

  const handleClearBranch = () => {
    setGradeDropdown([]);
    setSectionDropdown([]);
  };

  const handleClearGrade = () => {
    setSectionDropdown([]);
  };

  const handleAcademicYear = (e) => {
    formRef.current.setFieldsValue({
      branch: null,
      grade: null,
      section: null,
    });
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
    if (e) {
      setAcademicYearID(e);
      const params = {
        session_year: e,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.branches}`, { params: { ...params } })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setBranchDropdown(result?.data?.data?.results);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const publishGeneralDiary = () => {
    if (!academicYearID) {
      message.error('Please select Academic Year');
      return;
    }
    if (!branchID) {
      message.error('Please select Branch');
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
    if (studentCheckedID.length < 1) {
      message.error('Please select atleast one student');
      return;
    }

    let payload = {
      title: title,
      message: description,
      academic_year: academicYearID,
      branch: branchID,
      grade: [gradeID],
      section_mapping: [sectionMappingID],
      section: [sectionID],
      user_id: studentCheckedID,
      dairy_type: 1,
    };

    axios
      .post(`${endpoints?.dailyDiary?.createDiary}`, payload)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success('General Diary Created Succssfully');
          history.push('/diary/teacher');
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchGeneralDiaryusers = () => {
    setLoading(true);
    const params = {
      active: 0,
      bgs_mapping: sectionMappingID,
      module_id: moduleId,
      academic_year: academicYearID,
    };
    axios
      .get(`${endpoints?.dailyDiary?.generalDiaryUsers}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGeneralDiaryUsers(result?.data?.result?.results);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error('error', error.message);
        setLoading(false);
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
            if (item.child_name === 'Teacher Diary') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Sl No.</span>,
      align: 'center',
      width: '10%',
      render: (text, row, index) => index + 1,
    },

    {
      title: <span className='th-white th-fw-700'>EDP_ID</span>,
      dataIndex: 'score',
      align: 'center',
      width: '30%',
      dataIndex: 'erp_id',
    },
    {
      title: <span className='th-white th-fw-700'>STUDENT</span>,
      dataIndex: 'score',
      align: 'center',
      width: '30%',
      dataIndex: 'name',
    },
    {
      title: '',
      align: 'center',
      width: '10%',
      render: (text, row) => (
        <Checkbox onChange={(e) => handleStudentCheckbox(e, row?.id)} />
      ),
    },
  ];
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12 px-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1'>Diary</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Create General Diary</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className='col-12 mt-3 px-2'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row py-2 text-left'>
              <div className='col-md-3 py-2'>
                <Form.Item name='academic'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={handleAcademicYear}
                    placeholder='Academic Year'
                    allowClear
                    onClear={handleClearAcademic}
                  >
                    {yearOptions}
                  </Select>
                </Form.Item>
              </div>

              <div className='col-md-3 py-2'>
                <Form.Item name='branch'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleBranch(value)}
                    placeholder='Branch'
                    allowClear
                    onClear={handleClearBranch}
                  >
                    {branchOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 py-2'>
                <Form.Item name='grade'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={handleGrade}
                    placeholder='Grade'
                    allowClear
                    onClear={handleClearGrade}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>

              <div className='col-md-3 py-2'>
                <Form.Item name='section'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleSection(value)}
                    placeholder='Section'
                    allowClear
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className='row px-md-3 px-2'>
          <div className='col-md-2 col-6' onClick={fetchGeneralDiaryusers}>
            <Button className='th-width-100 th-br-6 th-bg-primary th-white'>
              Filter
            </Button>
          </div>
        </div>

        {generalDairyUsers?.length < 1 && !loading && (
          <div className='row text-center pt-3'>
            <div className='col-md-12 th-grey th-18'>
              Please Select the filter to display reports
            </div>
          </div>
        )}
        <div className='row py-3 px-4'>
          {loading ? (
            <div className='row d-flex justify-content-center pt-5'>
              <Spin tip='Loading...' size='large' />
            </div>
          ) : generalDairyUsers?.length > 0 ? (
            <Table
              className='th-table'
              columns={columns}
              title={() => 'Filter Students'}
              rowKey={(record) => record?.id}
              dataSource={generalDairyUsers}
              pagination={{ defaultPageSize: 4, position: 'bottomRight' }}
              bordered={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              style={{ width: '100%', height: '400px' }}
            />
          ) : (
            ''
          )}
        </div>

        {generalDairyUsers?.length > 0 ? (
          <>
            <div className='row'>
              <div className='col-12 px-md-3'>
                <div className='row th-br-6 py-3' style={{ border: '1px solid #d9d9d9' }}>
                  <div className='col-12 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='Title'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>
                  <div className='col-12 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Description'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>
                  <div className='col-12'>
                    <span className='th-grey th-14'>
                      Upload Attachments (Accepted files: [ .jpeg,.jpg,.png,.pdf ])
                    </span>
                    <div
                      className='row justify-content-start align-items-center th-br-4 py-1 mt-1'
                      style={{ border: '1px solid #D9D9D9' }}
                    >
                      <div className='col-md-10 col-8'>
                        <div className='row'>
                          {uploadedFiles?.map((item, index) => {
                            const fullName = item?.split('_')[
                              item?.split('_').length - 1
                            ];

                            const fileName = fullName.split('.')[
                              fullName?.split('.').length - 2
                            ];
                            const extension = fullName.split('.')[
                              fullName?.split('.').length - 1
                            ];

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
                      <div
                        className='col-md-2 col-4 th-primary text-right th-pointer pl-0 pr-1 pr-md-2'
                        onClick={handleShowModal}
                      >
                        <span className='th-12'>
                          {' '}
                          <u>Upload</u>
                        </span>
                        <span className='ml-3 pb-2'>
                          <img src={uploadIcon} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        <div className='row'>
          <div className='col-12'>
            <div className='row py-3'>
              <div className='col-md-2 col-6'>
                <Button className='th-width-100 th-br-6 th-pointer' onClick={handleBack}>
                  Back
                </Button>
              </div>
              {generalDairyUsers?.length > 0 && (
                <div className='col-md-2 col-6'>
                  <Button
                    className='th-width-100 th-br-6 th-bg-primary th-white th-pointer'
                    onClick={publishGeneralDiary}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <UploadDocument
          show={showUploadModal}
          branchName={branchName}
          gradeID={gradeID}
          section={sectionMappingID}
          handleClose={handleUploadModalClose}
          setUploadedFiles={handleUploadedFiles}
        />
      </div>
    </Layout>
  );
};

export default GeneralDiary;
