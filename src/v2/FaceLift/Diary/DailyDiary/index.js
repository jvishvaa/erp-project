import React, { useState, createRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Form, Select, Input, Button, message, Modal } from 'antd';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import uploadIcon from 'v2/Assets/dashboardIcons/announcementListIcons/uploadIcon.svg';
import UploadDocument from '../UploadDocument';
import moment from 'moment';

const DailyDiary = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const academicYearList = useSelector(
    (state) => state.commonFilterReducer?.academicYearList
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const [academicYearID, setAcademicYearID] = useState();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [branchID, setBranchID] = useState();
  const [branchName, setBranchName] = useState('');
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [gradeID, setGradeID] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [sectionMapping, setSectionMapping] = useState([]);
  const { user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [sectionID, setSectionID] = useState([]);
  const [sectionMappingID, setSectionMappingID] = useState([]);
  const [subjectID, setSubjectID] = useState();
  const [subjectName, setSubjectName] = useState();
  const [chapterID, setChapterID] = useState();
  const [recap, setRecap] = useState('');
  const [classwork, setClasswork] = useState('');
  const [summary, setSummary] = useState('');
  const [tools, setTools] = useState('');
  const [homework, setHomework] = useState('');
  const [assignedHomework, setAssignedHomework] = useState('');
  const [assignedHomeworkModal, setAssignedHomeworkModal] = useState('');
  const [declined, setDeclined] = useState(false);
  const [hwMappingID, setHwMappingID] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [diaryID, setDiaryID] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const formRef = createRef();
  const history = useHistory();

  let editData = '';
  const { TextArea } = Input;

  const { Option } = Select;
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

  const closeAssignedHomeworkModal = () => {
    setAssignedHomeworkModal(false);
    setDeclined(true);
  };

  const handleBack = () => {
    history.push('/diary/teacher');
  };

  const handleEdit = () => {
    let payload = {
      academic_year: academicYearID,
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
    axios
      .put(
        `${endpoints?.dailyDiary?.updateDelete}${diaryID}/update-delete-dairy/`,
        payload
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          message.success('Diary Edited Successfully');

          history.push('/diary/teacher');
        }
      })
      .catch((error) => {
        message.error('Something went wrong');
      });
  };

  const handleSubmit = () => {
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
    if (!subjectID) {
      message.error('Please select Subject');
      return;
    }
    if (!chapterID) {
      message.error('Please select Chapter');
      return;
    }
    let payload = {
      academic_year: academicYearID,
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
    axios
      .post(`${endpoints?.dailyDiary?.createDiary}`, payload)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success('Diary Created Succssfully');
          history.push('/diary/teacher');
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleClearAcademic = () => {
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
  };

  const handleClearBranch = () => {
    setGradeDropdown([]);
    setSectionDropdown([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
  };

  const handleClearGrade = () => {
    setSectionDropdown([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
  };

  const handleClearSection = () => {
    setSubjectDropdown([]);
    setChapterDropdown([]);
  };

  const handleClearSubject = () => {
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

  const handleChapter = (e) => {
    setChapterID(e);
  };

  //For Subject
  const subjectOptions = subjectDropdown?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each?.subject__id} id={each?.id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const handleSubject = (e) => {
    formRef.current.setFieldsValue({
      chapter: null,
    });
    if (e) {
      setSubjectID(e.value);
      setSubjectName(e.children);
      const params = {
        session_year: selectedBranch.branch.id,
        subject_id: e.id,
        subject: e.value,
      };
      axios
        .get(`${endpoints.academics.chapter}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setChapterDropdown(result?.data?.result);
          }
        })
        .catch((error) => {
          message.error('error', error?.message);
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
      const params = {
        session_year: academicYearID,
        branch: branchID,
        grade: gradeID,
        section: each.value,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.subjects}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const subjectData = result?.data?.data || [];
            setSubjectDropdown(subjectData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  //For Grade
  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleGrade = (e, value) => {
    formRef.current.setFieldsValue({
      section: null,
      subject: null,
      chapter: null,
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
        .get(`${endpoints.academics.sections}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const sectionData = result?.data?.data || [];
            setSectionDropdown(sectionData);
            gradeDropdown.map((each) => {
              if (each?.grade_id === e) {
                setSectionMapping(each.id);
              }
            });
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  //For Branch
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
      subject: null,
      chapter: null,
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
        .get(`${endpoints.academics.grades}`, { params })
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

  const handleAcademicYear = (e) => {
    formRef.current.setFieldsValue({
      branch: null,
      grade: null,
      section: null,
      subject: null,
      chapter: null,
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
        .get(`${endpoints.academics.branches}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setBranchDropdown(result?.data?.data?.results);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const checkAssignedHomework = () => {
    if (!subjectID) {
      message.error('Please select all filters');
      return;
    }
    const params = {
      section_mapping: sectionMappingID,
      subject: subjectID,
      date: moment().format('YYYY-MM-DD'),
      user_id: user_id,
    };
    axios
      .get(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, { params })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            setAssignedHomework(result?.data?.data);
            setAssignedHomeworkModal(true);
          } else {
            let session_year = academicYearID;
            history.push(
              `/homework/add/${moment().format(
                'YYYY-MM-DD'
              )}/${session_year}/${branchID}/${gradeID}/${subjectName}/${subjectID}`
            );
          }
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const mapAssignedHomework = () => {
    axios
      .post(`${endpoints?.dailyDiary?.assignHomeworkDiary}`, {
        hw_id: assignedHomework[0]?.id,
      })
      .then((result) => {
        if (result?.data?.status_code == 201) {
          setHwMappingID(result?.data?.data?.hw_dairy_mapping_id);
          setAssignedHomeworkModal(false);
          setHomework(assignedHomework[0].description);
        }
      })
      .catch((error) => message.error('error', error?.message));
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

  useEffect(() => {
    if (history?.location?.state?.data) {
      let editData = history.location.state.data;
      setIsEdit(history?.location?.state?.isEdit);
      setDiaryID(history.location.state.data?.id);
      formRef.current.setFieldsValue({
        academic: editData?.academic_year?.session_year,
        branch: editData?.branch?.branch_name,
        grade: editData?.grade[0]?.grade_name,
        section: editData?.section[0]?.section__section_name,
        subject: editData?.subject?.subject_name,
        chapter: editData?.chapter[0]?.chapter_name,
      });
      setAcademicYearID(editData?.academic_year?.id);
      setBranchID(editData?.branch?.id);
      setSectionID(editData?.section[0]?.id);
      setSectionMappingID(editData?.section_mapping[0]);
      setSubjectID(editData?.subject?.id);
      setRecap(editData?.teacher_report?.previous_class);
      setClasswork(editData?.teacher_report?.class_work);
      setSummary(editData?.teacher_report?.summary);
      setTools(editData?.teacher_report?.tools_used);
      setHomework(editData?.teacher_report?.homework);
      setUploadedFiles(editData?.documents);
    }
  }, []);
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12 px-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1'>Diary</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Create Daily Diary</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className='row py-3'>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row py-2 text-left'>
                <div className='col-md-4 py-2'>
                  <Form.Item name='academic'>
                    <Select
                      className='th-width-100 th-br-6'
                      onChange={handleAcademicYear}
                      placeholder='Academic Year'
                      allowClear
                      onClear={handleClearAcademic}
                      value={academicYearID}
                    >
                      {yearOptions}
                    </Select>
                  </Form.Item>
                </div>

                <div className='col-md-4 py-2'>
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
                <div className='col-md-4 py-2'>
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

                <div className='col-md-4 py-2'>
                  <Form.Item name='section'>
                    <Select
                      className='th-width-100 th-br-6'
                      onChange={(e, value) => handleSection(value)}
                      placeholder='Section'
                      allowClear
                      onClear={handleClearSection}
                    >
                      {sectionOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-4 py-2'>
                  <Form.Item name='subject'>
                    <Select
                      className='th-width-100 th-br-6'
                      onChange={(e, value) => handleSubject(value)}
                      placeholder='Subject'
                      allowClear
                      onClear={handleClearSubject}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-4 py-2'>
                  <Form.Item name='chapter'>
                    <Select
                      className='th-width-100 th-br-6'
                      onChange={handleChapter}
                      placeholder='Chapter'
                      allowClear
                    >
                      {chapterOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
            <div className='row'>
              <div className='col-12'>
                <div
                  className='row px-2 py-3 th-br-10'
                  style={{ border: '1px solid #d9d9d9' }}
                >
                  <div className='col-md-4 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={recap}
                      onChange={(e) => setRecap(e.target.value)}
                      placeholder='Recap of Previous Class'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>
                  <div className='col-md-4 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={classwork}
                      onChange={(e) => setClasswork(e.target.value)}
                      placeholder='Details of ClassWork'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>
                  <div className='col-md-4 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder='Summary'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>

                  <div className='col-md-4 py-2'>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={tools}
                      onChange={(e) => setTools(e.target.value)}
                      placeholder='Tools Used'
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  </div>
                  <div className='col-md-4 py-2' onClick={() => checkAssignedHomework()}>
                    <TextArea
                      className='th-width-100 th-br-6'
                      value={homework}
                      onChange={(e) => setHomework(e.target.value)}
                      placeholder='Add Homework'
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
            <div className='row pt-3'>
              <div className='col-md-2 col-6'>
                <Button className='th-width-100 th-br-6 th-pointer' onClick={handleBack}>
                  Back
                </Button>
              </div>
              <div className='col-md-2 col-6'>
                <Button
                  className='th-width-100 th-br-6 th-bg-primary th-white th-pointer'
                  onClick={isEdit ? handleEdit : handleSubmit}
                >
                  {isEdit ? 'Update' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          visible={!declined && assignedHomeworkModal}
          title='Assign Existing Homework'
          onCancel={closeAssignedHomeworkModal}
          footer={[
            <Button key='back' onClick={closeAssignedHomeworkModal}>
              No
            </Button>,
            <Button key='submit' type='primary' onClick={mapAssignedHomework}>
              Yes
            </Button>,
          ]}
        >
          <div className='row px-2 py-3'>
            Homework already exists, do you want to link it to Diary?
          </div>
        </Modal>
        <UploadDocument
          show={showUploadModal}
          branchName={branchName}
          gradeID={gradeID}
          handleClose={handleUploadModalClose}
          setUploadedFiles={handleUploadedFiles}
        />
      </div>
    </Layout>
  );
};

export default DailyDiary;
