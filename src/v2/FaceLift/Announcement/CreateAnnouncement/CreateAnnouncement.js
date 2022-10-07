import React, { useState, useEffect, useRef, createRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Checkbox, Select, Input, Button, message, Form, Spin } from 'antd';
import axios from 'axios';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import uploadIcon from 'v2/Assets/dashboardIcons/announcementListIcons/uploadIcon.svg';
import { DownOutlined, CheckOutlined } from '@ant-design/icons';
import '../index.css';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import UploadModal from './UploadModal';
import MembersModal from './MembersModal';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const intimationOptions = [
  'Intimate Via SMS',
  'Intimate Via Email',
  'Intimate Via Whatsapp',
];

const CreateAnnouncement = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const history = useHistory();
  const formRef = createRef();
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);

  const [intimation, setIntimation] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedUserLevels, setSelectedUserLevels] = useState();
  const [branchId, setBranchId] = useState('');
  const [gradeData, setGradeData] = useState([]);
  const [gradeIds, setGradeIds] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionIds, setSectionIds] = useState();
  const [sectionMappingIds, setSectionMappingIds] = useState();
  const [membersCount, setMembersCount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userLevelList, setUserLevelList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const isStudentIncluded = selectedUserLevels?.includes(13);

  const { TextArea } = Input;

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };

  const handleMembersModalClose = () => {
    setShowMembersModal(false);
  };

  const handleUploadedFiles = (value) => {
    setUploadedFiles(value);
  };
  const handleRemoveUploadedFile = (index) => {
    const newFileList = uploadedFiles.slice();
    newFileList.splice(index, 1);
    setUploadedFiles(newFileList);
  };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (value) => {
    setSelectedCategory(value);
  };

  const fetchUserLevel = () => {
    axios
      .get(`${endpoints.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchCategories = () => {
    axiosInstance
      .get(`${endpoints.createAnnouncement.announcementCategory}`, {})
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setCategories(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchMembersCount = (params = {}) => {
    axiosInstance
      .get(`${endpoints.createAnnouncement.membersCount}`, {
        params: {
          ...params,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setMembersCount(res?.data?.count);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchGradeData = (params = {}) => {
    axiosInstance
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axiosInstance
      .get(`${endpoints.academics.sections}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });
  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id} sectionId={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const categoryOptions = categories?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.category_name}
      </Option>
    );
  });
  const handleBranchChange = (e) => {
    setBranchId(e);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    if (e) {
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: e,
        module_id: moduleId,
      });
    }
  };
  const handleClearBranch = () => {
    setBranchId('');
    setGradeIds([]);
    setSectionIds([]);
    setSectionMappingIds([]);
  };

  const handleGrade = (e) => {
    const grades = e.map((item) => item?.value).join(',');
    setGradeIds(grades);
    setSectionData([]);
    formRef.current.setFieldsValue({
      section: [],
    });

    if (grades) {
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: branchId,
        module_id: moduleId,
        grade_id: grades,
      });
    }
  };
  const handleClearGrade = () => {
    setGradeIds([]);
    setSectionIds([]);
    setSectionMappingIds([]);
  };
  const handleSection = (e) => {
    const sections = e.map((item) => item?.sectionId).join(',');
    const sectionMappingIds = e.map((item) => item?.value).join(',');
    setSectionIds(sections);
    setSectionMappingIds(sectionMappingIds);
  };
  const handleClearSection = () => {
    setSectionIds([]);
    setSectionMappingIds([]);
  };
  const handleUserLevel = (e) => {
    setSelectedUserLevels(e.join(','));
  };
  const handleClearUserLevel = () => {
    setSelectedUserLevels();
  };
  const handleShowModal = () => {
    if (!branchId) {
      message.error('Please select branch');
      return;
    } else {
      setShowUploadModal(true);
    }
  };

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handlePublish = (asDraft) => {
    if (!selectedCategory) {
      message.error('Please select type');
      return;
    }
    if (!title) {
      message.error('Please add title');
      return;
    }
    if (!description) {
      message.error('Please add description');
      return;
    }
    if (!branchId) {
      message.error('Please select branch');
      return;
    }
    if (!selectedUserLevels) {
      message.error('Please select atleast one user level');
      return;
    }
    if (membersCount === null) {
      message.error('No members for announcement');
      return;
    }
    if (isStudentIncluded) {
      if (!gradeIds) {
        message.error('Please select atleast one grade');
        return;
      }
      if (!sectionIds) {
        message.error('Please select atleast one section');
        return;
      }
    }


    let payLoad = {
      branch_id: branchId.toString() || '',
      session_year: selectedAcademicYear?.id,
      role_id: selectedUserLevels,
      title: title,
      content: description,
      category: selectedCategory,
    };
    if (asDraft) {
      payLoad['is_draft'] = true;
    }
    if (intimation.includes('Intimate Via SMS')) {
      payLoad['intimate_via_sms'] = true;
    }
    if (intimation.includes('Intimate Via Whatsapp')) {
      payLoad['intimate_via_whatsapp'] = true;
    }
    if (isStudentIncluded) {
      payLoad['section_mapping_id'] = sectionMappingIds;
    }
    if (intimation.includes('Intimate Via Email')) {
      payLoad['intimate_via_email'] = true;
    }
    if (uploadedFiles?.length > 0) {
      payLoad['attachments'] = uploadedFiles.flat(1) || [];
    }
    setLoading(true);
    axiosInstance
      .post(`${endpoints.createAnnouncement.publishAnnouncement}`, payLoad)
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(
            asDraft
              ? 'Announcement Saved as Draft'
              : 'Announcement Published Successfully'
          );
          setLoading(false);
          history.push('./announcement-list');
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  useEffect(() => {
    fetchUserLevel();
    fetchCategories();
  }, []);

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
    if (selectedUserLevels)
      if (isStudentIncluded) {
        if (sectionIds) {
          fetchMembersCount({
            role_id: selectedUserLevels,
            session_year: selectedAcademicYear?.id,
            branch_id: branchId,
            is_allowed_for_all: true,
            section_id: sectionIds,
            grade_id: gradeIds,
          });
        }
      } else {
        fetchMembersCount({
          role_id: selectedUserLevels,
          session_year: selectedAcademicYear?.id,
          branch_id: branchId,
          is_allowed_for_all: true,
        });
      }
  }, [selectedUserLevels, gradeIds, sectionIds]);

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>
              Create New Announcement
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {loading ? (
          <div
            className='row justify-content-center align-items-center'
            style={{ height: '20vh' }}
          >
            <Spin size='large' />
          </div>
        ) : (
          <div className='col-md-12 mt-3'>
            <div className='row th-bg-white p-2'>
              <div className='row py-2'>
                <Form
                  id='filterForm'
                  className='text-left col-md-6 row w-100'
                  ref={formRef}
                >
                  <div className='col-md-6'>
                    <span className='th-grey th-14'>Type *</span>
                    <Select
                      value={selectedCategory}
                       getPopupContainer={(trigger) => trigger.parentNode}
                      className='th-grey th-bg-grey th-br-4 w-100 mt-1'
                      placement='bottomRight'
                      suffixIcon={<DownOutlined className='th-black-1' />}
                      dropdownMatchSelectWidth={false}
                      onChange={handleChange}
                      menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                    >
                      {categoryOptions}
                    </Select>
                  </div>
                  <div className='col-md-6 py-3 py-md-0'>
                    <span className='th-grey th-14'>Title</span>
                    <Input
                      className='th-br-4 mt-1 th-16'
                      showCount
                      maxLength='30'
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className='text-right'>
                      <span className='th-red th-12 text-right'>Max. 30 Characters</span>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <span className='th-grey th-14'>Branch*</span>
                    <Form.Item name='branch'>
                      <Select
                        showSearch
                         getPopupContainer={(trigger) => trigger.parentNode}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                        placement='bottomRight'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        dropdownMatchSelectWidth={false}
                        onChange={(e) => handleBranchChange(e)}
                        allowClear={true}
                        onClear={handleClearBranch}
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                      >
                        {branchOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-6 py-3 py-md-0'>
                    <span className='th-grey th-14'>Choose User Level *</span>
                    <Select
                     getPopupContainer={(trigger) => trigger.parentNode}
                      mode='multiple'
                      maxTagCount={5}
                      allowClear={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                      placement='bottomRight'
                      showArrow={true}
                      onChange={(e, value) => handleUserLevel(e, value)}
                      onClear={handleClearUserLevel}
                      dropdownMatchSelectWidth={false}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {userLevelListOptions}
                    </Select>
                  </div>
                  {isStudentIncluded && (
                    <div className='row mt-3 py-2'>
                      <div className='col-md-6'>
                        <span className='th-grey th-14'>Grades*</span>
                        <Form.Item name='grade'>
                          <Select
                           getPopupContainer={(trigger) => trigger.parentNode}
                            mode='multiple'
                            className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                            placement='bottomRight'
                            showArrow={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            maxTagCount={3}
                            allowClear={true}
                            dropdownMatchSelectWidth={false}
                            onChange={(e, value) => handleGrade(value)}
                            onClear={handleClearGrade}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {gradeOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-6'>
                        <span className='th-grey th-14'>Sections *</span>
                        <Form.Item name='section'>
                          <Select
                           getPopupContainer={(trigger) => trigger.parentNode}
                            mode='multiple'
                            className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                            placement='bottomRight'
                            showArrow={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            maxTagCount={3}
                            allowClear={true}
                            dropdownMatchSelectWidth={false}
                            onChange={(e, value) => handleSection(value)}
                            onClear={handleClearSection}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {sectionOptions}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  )}
                </Form>
                <div className='col-md-6'>
                  <span className='th-grey th-14'>Description</span>
                  <div className='th-editor py-2'>
                    <TextArea rows={5} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className='row'>
                {/* <div className='col-4'>
                  <span className='th-grey th-14'>Description</span>
                  <div className='th-editor py-2'>
                    <TextArea rows={4} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                </div> */}

                <div className='row mt-2'>
                  <div className='col-md-6 py-3 py-md-0'>
                    <span className='th-grey th-14'>Members</span>
                    <Input
                      className='th-br-4 mt-1 th-input th-16'
                      value={
                        membersCount !== null ? `${membersCount} Members Selected` : ''
                      }
                      // addonAfter={
                      //   membersCount !== null && (
                      //     <u
                      //       className='th-primary th-14 mr-3 th-pointer'
                      //       onClick={() => setShowMembersModal(true)}
                      //     >
                      //       Select Particular Members
                      //     </u>
                      //   )
                      // }
                    />
                  </div>
                  <div className='col-md-6 py-3 py-md-0'>
                    <span className='th-grey th-14'>Upload Attachments</span>
                    <div
                      className='row justify-content-start align-items-center th-br-4 py-1 mt-1'
                      style={{ border: '1px solid #D9D9D9' }}
                    >
                      <div className='col-md-10 col-9'>
                        <div className='row'>
                          {uploadedFiles?.map((item, index) => {
                            const fullName =
                              item[0]?.split('/')[item[0]?.split('/').length - 1];

                            const fileName =
                              fullName.split('.')[fullName?.split('.').length - 2];
                            const extension =
                              fullName.split('.')[fullName?.split('.').length - 1];
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
                        className='col-md-2 col-3 th-primary text-right th-pointer pl-0 pr-1 pr-md-2'
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
                <div className='row py-2 mt-3'>
                  {/* <div className='col-12'>
                    <span className='th-grey th-14'>Upload Attachments</span>
                    <div
                      className='row justify-content-start align-items-center th-br-4 py-1 mt-1'
                      style={{ border: '1px solid #D9D9D9' }}
                    >
                      <div className='col-md-10 col-9'>
                        <div className='row'>
                          {uploadedFiles?.map((item, index) => {
                            const fullName =
                              item[0]?.split('/')[item[0]?.split('/').length - 1];

                            const fileName =
                              fullName.split('.')[fullName?.split('.').length - 2];
                            const extension =
                              fullName.split('.')[fullName?.split('.').length - 1];
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
                        className='col-md-2 col-3 th-primary text-right th-pointer pl-0 pr-1 pr-md-2'
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
                  </div> */}
                </div>

                <div className='row mt-4 py-2'>
                  <div className='col-md-8 d-flex align-items-center'>
                    <Checkbox.Group
                      options={intimationOptions}
                      onChange={(e) => setIntimation(e)}
                    />
                  </div>
                  <div className='col-md-4 d-flex justify-content-md-end py-4 py-md-0'>
                    <Button
                      className='th-bg-grey th-black-2 th-br-4 th-fw-500 th-14 th-pointer col-md-6 col-5 mr-5 mr-md-2'
                      style={{ border: '1px solid #D9D9D9' }}
                      onClick={() => handlePublish(true)}
                    >
                      Save as Draft
                    </Button>

                    <Button
                      className='th-bg-primary th-white th-br-4 th-fw-500 th-14 th-pointer col-md-6 col-5'
                      onClick={() => handlePublish(false)}
                    >
                      Publish
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <UploadModal
          show={showUploadModal}
          branchId={branchId}
          handleClose={handleUploadModalClose}
          setUploadedFiles={handleUploadedFiles}
        />
        <MembersModal show={showMembersModal} handleClose={handleMembersModalClose} />
      </div>
    </Layout>
  );
};

export default CreateAnnouncement;
