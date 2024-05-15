import React, { useState, useEffect, useRef, createRef } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Checkbox,
  Select,
  Input,
  Button,
  message,
  Form,
  Spin,
  DatePicker,
} from 'antd';
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
import { Profanity } from 'components/file-validation/Profanity.js';
import moment from 'moment';

const { Option } = Select;

const intimationOptions = [
  'Intimate Via SMS',
  'Intimate Via Email',
  'Intimate Via Whatsapp',
];

const CreateAnnouncement = (props) => {
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
  const [branchId, setBranchId] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [sectionMappingIds, setSectionMappingIds] = useState([]);
  const [membersCount, setMembersCount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userLevelList, setUserLevelList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const isStudentIncluded = selectedUserLevels?.includes(13);
  const [allGradesSelected, setAllGradesSelected] = useState(false);
  const [email, setEmail] = useState(false);
  const [sms, setSMS] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [flashEvent, setFlashEvent] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [flashModal, setFlashModal] = useState(false);
  const [flashLink, setFlashLink] = useState(null);
  const [uploadedFlashFiles, setUploadedFlashFiles] = useState([]);
  const [allowPublish, setAllowPublish] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notiConfig, setNotiConfig] = useState();
  const [feeReminderSelected, setFeeReminderSelected] = useState();
  const [dataForEdit, setDataForEdit] = useState(null);

  const { TextArea } = Input;

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };
  const handleUploadFlashModalClose = () => {
    setFlashModal(false);
  };

  const handleMembersModalClose = () => {
    setShowMembersModal(false);
  };

  const handleUploadedFiles = (value) => {
    setUploadedFiles(value);
  };
  const handleFlashUploadedFiles = (value) => {
    setUploadedFlashFiles(value);
  };
  const handleRemoveUploadedFile = (index) => {
    const newFileList = uploadedFiles.slice();
    newFileList.splice(index, 1);
    setUploadedFiles(newFileList);
  };

  const handleChange = (value) => {
    setSelectedCategory(value);
    if (!props?.match?.params?.id) {
      if (value == 11) {
        setFeeReminderSelected(true);
        handleUserLevel([13]);
        formRef.current.setFieldsValue({
          user_level: [13],
        });
        if (sectionIds.length > 0) {
          fetchMembersCount({
            role_id: 13,
            branch_id: branchId?.join(','),
            is_allowed_for_all: true,
            section_id: sectionIds.join(','),
            grade_id: gradeIds.join(','),
          });
        }
      } else {
        setFeeReminderSelected(false);
        handleUserLevel([]);
        formRef.current.setFieldsValue({
          user_level: [],
        });
      }
    }
  };

  useEffect(() => {
    fetchConfig();
    if (props?.match?.params?.id) {
      console.log(formRef?.current);
      getAnnouncementData(props?.match?.params?.id);
    }
  }, []);

  const getAnnouncementData = (id) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.createAnnouncement.retrieveUpdateDeleteAnnouncement}${id}/`)
      .then((res) => {
        // setLoading(false);
        console.log(res.data.data, formRef?.current?.getFieldsValue());
        const data = res.data.data;
        console.log('rohan)', data);
        setDataForEdit(data);
        setSelectedCategory(data?.category_id);
        setTitle(data?.title);
        setDescription(data?.content);
        setMembersCount(data?.total_members);
        setUploadedFiles(data?.attachments?.map((item) => [item]));
        setBranchId(data?.branch_id);
        setSelectedUserLevels(data?.role?.join(','));
        setFlashEvent(data?.is_flash_event);
        if (data?.is_flash_event) {
          console.log(
            data.start_date,
            moment(data.start_date).format('YYYY-MM-DD'),
            'jwdjw'
          );
          setStartDate(data.start_date);
          setEndDate(data.end_date);
          setFlashLink(data.event_link);
          setUploadedFlashFiles(data?.flash_img?.map((item) => [item]));
        }

        if (data?.role?.includes(13)) {
          fetchGradeData({
            session_year: selectedAcademicYear?.id,
            branch_id: data?.branch_id?.join(','),
            is_first: true,
            dataForEdit: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dataForEdit) {
      formRef.current.setFieldsValue({
        branch: dataForEdit?.branch_id,
        user_level: dataForEdit?.role,
        // grade: [5120],
        grade: [...new Set(dataForEdit?.bgsm?.map((item) => item?.grade_id))],
        section: [...new Set(dataForEdit?.bgsm?.map((item) => item?.section_mapping_id))],
      });
      setGradeIds([...new Set(dataForEdit?.bgsm?.map((each) => each?.grade_id))]);
    }
  }, [dataForEdit]);

  const setFormFieldValue = (grade_data, dataForEdit) => {
    let gradesIds = [...new Set(dataForEdit?.bgsm?.map((each) => each?.grade_id))];
    setGradeIds(gradesIds);
    let sections = [...new Set(dataForEdit?.bgsm?.map((each) => each?.section_id))];
    let sectionMappingIds = [
      ...new Set(dataForEdit?.bgsm?.map((each) => each?.section_mapping_id)),
    ];
    console.log({ dataForEdit, gradesIds, sections, sectionMappingIds }, 'section set');
    setSectionIds(sections);
    setSectionMappingIds(sectionMappingIds);
  };

  const fetchConfig = () => {
    axiosInstance
      .get(
        `${endpoints.academics.getConfigAnnouncement}?config_key=anncmt_cumctn_config&config_type=json`
      )
      .then((res) => {
        setNotiConfig(res?.data?.result);
        if (res?.data?.result?.enbl_brnches?.length > 0) {
          setAllowPublish(false);
        } else {
          setAllowPublish(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          ...(feeReminderSelected ? { is_fee_reminder: true } : {}),
          ...(feeReminderSelected
            ? { session_year: selectedAcademicYear?.session_year }
            : { session_year: selectedAcademicYear?.id }),
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
    const { dataForEdit, is_first, ...rest } = params;
    axiosInstance
      .get(`${endpoints.academics.grades}`, { params: { ...rest } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
          if (params.is_first) {
            setFormFieldValue(res.data.data, params.dataForEdit);
          }
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
        if (res?.data?.status_code === 200) {
          setSectionData(res?.data?.data);
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
      <Option
        key={each?.grade_id}
        value={each?.grade_id}
        grade_id={each?.grade_id}
        disabled={
          branchId?.length > 1 && gradeIds?.length && !gradeIds?.includes(each?.grade_id)
        }
      >
        {each?.grade__grade_name}
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

  useEffect(() => {
    if (branchId?.length === 1) {
      if (notiConfig?.enbl_brnches?.length > 0) {
        if (notiConfig?.enbl_brnches?.includes(branchId[0])) {
          setAllowPublish(true);
        } else {
          setAllowPublish(false);
        }
      }
    } else if (branchId?.length > 1) {
      setAllowPublish(true);
    } else {
      setAllowPublish(false);
    }
  }, [branchId, notiConfig]);

  const handleBranchChange = (e) => {
    setBranchId(e);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    setGradeIds([]);
    setSectionIds([]);
    setSectionMappingIds([]);
    // if (notiConfig?.enbl_brnches?.length > 0) {
    //   if (notiConfig?.enbl_brnches?.includes(e)) {
    //     setAllowPublish(true);
    //   } else {
    //     setAllowPublish(false);
    //   }
    // }
    if (e?.length) {
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: e?.join(','),
        // module_id: moduleId,
      });
      setGradeData([])
      setSectionData([])
    }
  };
  const handleClearBranch = () => {
    setBranchId([]);
    setGradeIds([]);
    setSectionIds([]);
    setSectionMappingIds([]);
    setGradeData([])
    setSectionData([])
  };

  const handleSelectGrade = (value, arr) => {
    if (value == 'all') {
      formRef.current.setFieldsValue({
        grade: arr,
      });
      setGradeIds(arr);
    } else {
      if (!gradeIds.includes(value)) {
        setGradeIds([...gradeIds, Number(value)]);
      }
    }
  };
  const handleDeSelectGrade = (each) => {
    formRef.current.setFieldsValue({
      section: [],
    });
    const index = gradeIds.indexOf(each?.value);
    const newGradeList = gradeIds.slice();
    newGradeList.splice(index, 1);
    setGradeIds(newGradeList);
    if (newGradeList.length == 0) {
      setMembersCount(0);
    }
  };

  const handleSelectSection = (each) => {
    if (each.value == 'all') {
      formRef.current.setFieldsValue({
        section: sectionData?.map((item) => item.id),
      });

      setSectionIds(sectionData.map((item) => item.section_id));
      setSectionMappingIds(sectionData.map((item) => item.id));
    } else {
      if (!sectionIds.includes(each.sectionId)) {
        setSectionIds([...sectionIds, Number(each.sectionId)]);
      }
      if (!sectionMappingIds.includes(each.value)) {
        setSectionMappingIds([...sectionMappingIds, Number(each.value)]);
      }
    }
  };
  const handleDeSelectSection = (each) => {
    const sectionIdIndex = sectionIds.indexOf(each?.sectionId);
    const newSectionIdList = sectionIds.slice();
    newSectionIdList.splice(sectionIdIndex, 1);
    setSectionIds(newSectionIdList);
    const sectionMappingIdIndex = sectionMappingIds.indexOf(each?.value);
    const newSectionMappingIdList = sectionMappingIds.slice();
    newSectionMappingIdList.splice(sectionMappingIdIndex, 1);
    setSectionMappingIds(newSectionMappingIdList);
  };
  const handleClearSection = () => {
    setSectionIds([]);
    setSectionMappingIds([]);
  };
  const handleUserLevel = (e) => {
    setSelectedUserLevels(e?.join(','));
    if (e?.length == 0) {
      setMembersCount(null);
      formRef.current.setFieldsValue({
        grade: [],
        section: [],
      });
      setGradeIds([]);
    }
  };
  const handleClearUserLevel = () => {
    setSelectedUserLevels();
  };
  const handleShowModal = (isFlash) => {
    if (isFlash) {
      setFlashModal(true);
    } else {
      if (!branchId) {
        message.error('Please select branch');
        return;
      } else {
        setShowUploadModal(true);
      }
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
    if (flashEvent && !startDate) {
      message.error('Please Select Start Date');
      return;
    }
    if (flashEvent && !endDate) {
      message.error('Please Select End Date');
      return;
    }
    if (flashEvent && !uploadedFlashFiles?.length > 0) {
      message.error('Please upload flash image');
      return;
    }
    if (flashEvent && !(new Date(endDate) >= new Date(startDate))) {
      message.error('End date should be gretaer than Start Date');
      return;
    }
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
      if (sectionIds.length < 1) {
        message.error('Please select atleast one section');
        return;
      }
    }

    if (Profanity(description)) {
      message.error('Description Contains Banned Words , Please Check');
      return;
    }
    if (Profanity(title)) {
      message.error('Title Contains Banned Words , Please Check');
      return;
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
    if (!props?.match?.params?.id) {
      if (sms == true) {
        payLoad['intimate_via_sms'] = true;
      }
      if (whatsapp == true) {
        payLoad['intimate_via_whatsapp'] = true;
      }
      if (email == true) {
        payLoad['intimate_via_email'] = true;
      }
    }
    if (isStudentIncluded) {
      payLoad['section_mapping_id'] = sectionMappingIds.join(',');
    }
    if (email == true) {
      payLoad['intimate_via_email'] = true;
    }
    if (flashEvent == true) {
      payLoad['is_flash_event'] = true;
      payLoad['start_date'] = moment(startDate).format('YYYY-MM-DD');
      payLoad['end_date'] = moment(endDate).format('YYYY-MM-DD');
      if (flashLink) {
        payLoad['event_link'] = flashLink;
      }

      if (uploadedFlashFiles?.length > 0) {
        payLoad['flash_img'] = uploadedFlashFiles.flat(1) || [];
      }
    }
    if (uploadedFiles?.length > 0) {
      payLoad['attachments'] = uploadedFiles.flat(1) || [];
    }
    if (!props?.match?.params?.id) {
      setLoading(true);
      axiosInstance
        .post(`${endpoints.createAnnouncement.publishAnnouncement}`, payLoad)
        .then((res) => {
          if (res.data.status_code === 200) {
            message.success(
              asDraft
                ? 'Announcement has saved in Draft'
                : 'Announcement Published Successfully'
            );
            setLoading(false);
            history.push('/announcement-list');
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    } else {
      setLoading(true);
      axiosInstance
        .put(
          `${endpoints.createAnnouncement.retrieveUpdateDeleteAnnouncement}${props?.match?.params?.id}/`,
          payLoad
        )
        .then((res) => {
          if (res.data.status_code === 200) {
            message.success('Announcement Updated Successfully');
            setLoading(false);
            history.push('/announcement-list');
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    }
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
    if (selectedUserLevels) {
      if (isStudentIncluded) {
        if (sectionIds.length > 0) {
          fetchMembersCount({
            role_id: selectedUserLevels,
            branch_id: branchId?.join(','),
            is_allowed_for_all: true,
            section_id: sectionIds.join(','),
            grade_id: gradeIds.join(','),
          });
        } else {
          setMembersCount(0);
        }
      } else {
        fetchMembersCount({
          role_id: selectedUserLevels,
          branch_id: branchId?.join(','),
          is_allowed_for_all: true,
        });
      }
    }
  }, [selectedUserLevels, gradeIds, sectionIds]);

  useEffect(() => {
    setSectionData([]);
    if (gradeIds.length > 0 && branchId?.length > 0) {
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: branchId?.join(','),
        // module_id: moduleId,
        grade_id: gradeIds.join(','),
      });
    }
  }, [gradeIds, branchId]);

  useEffect(() => {
    if (!props?.match?.params?.id) {
      if (sectionData.length > 0) {
        // if (allGradesSelected) {
        formRef.current.setFieldsValue({
          section: sectionData?.map((item) => item.id),
        });
        setSectionIds(sectionData?.map((item) => item?.section_id));
        setSectionMappingIds(sectionData?.map((item) => item?.id));
        // }
      }
    } else {
      if (sectionData.length > 0 && sectionIds.length > 0) {
        setSectionMappingIds(
          sectionData
            ?.filter((each) => sectionIds?.includes(each.section_id))
            ?.map((item) => item?.id)
        );
        formRef.current.setFieldsValue({
          section: sectionData
            ?.filter((each) => sectionIds?.includes(each.section_id))
            ?.map((item) => item?.id),
        });
      }
    }
  }, [sectionData]);
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/announcement-list' className='th-grey'>
              Announcements
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>
              Create New Announcement
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {/* {loading ? (
          <div
            className='row justify-content-center align-items-center'
            style={{ height: '20vh' }}
          >
            <Spin size='large' />
          </div>
        ) : ( */}

        <Spin spinning={loading} size='large'>
          <div className='col-md-12 mt-3'>
            <div className='row th-bg-white p-2'>
              <div className='row py-2'>
                <Form
                  id='filterForm'
                  className='text-left col-md-6 row w-100'
                  ref={formRef}
                >
                  <div className='col-md-6'>
                    <span className='th-grey th-14'>Type*</span>
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
                    <span className='th-grey th-14'>Title*</span>
                    <Input
                      className='th-br-4 mt-1 th-16'
                      showCount
                      maxLength='100'
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                    <div className='text-right'>
                      <span className='th-red th-12 text-right'>Max. 100 Characters</span>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <span className='th-grey th-14'>Branch*</span>
                    <Form.Item name='branch'>
                      <Select
                        mode='multiple'
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                        placement='bottomRight'
                        suffixIcon={<DownOutlined className='th-grey' />}
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                        disabled={props?.match?.params?.id}
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
                    <span className='th-grey th-14'>Choose User Level*</span>
                    <Form.Item name='user_level'>
                      <Select
                        mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={2}
                        // allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                        placement='bottomRight'
                        showArrow={true}
                        disabled={feeReminderSelected || props?.match?.params?.id}
                        onChange={(e, value) => handleUserLevel(e)}
                        onClear={handleClearUserLevel}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                      >
                        {userLevelListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  {isStudentIncluded && (
                    <div className='row mt-3 py-2'>
                      <div className='col-md-6'>
                        <span className='th-grey th-14'>Grades*</span>
                        <Form.Item name='grade'>
                          <Select
                            mode='multiple'
                            getPopupContainer={(trigger) => trigger.parentNode}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                            placement='bottomRight'
                            showArrow={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            maxTagCount={1}
                            dropdownMatchSelectWidth={false}
                            disabled={props?.match?.params?.id}
                            onSelect={(e) => {
                              handleSelectGrade(
                                e,
                                gradeData?.map((item) => item.grade_id)
                              );
                            }}
                            onDeselect={(e, value) => {
                              handleDeSelectGrade(value);
                            }}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {gradeData.length > 1 && branchId?.length === 1 && (
                              <>
                                <Option key={0} value={'all'}>
                                  All
                                </Option>
                              </>
                            )}
                            {gradeOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-6'>
                        <span className='th-grey th-14'>Sections*</span>
                        <Form.Item name='section'>
                          <Select
                            mode='multiple'
                            disabled={
                              (gradeIds.length > 0 && feeReminderSelected) ||
                              props?.match?.params?.id
                            }
                            value={sectionMappingIds}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                            placement='bottomRight'
                            showArrow={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            maxTagCount={1}
                            // allowClear={true}
                            dropdownMatchSelectWidth={false}
                            onSelect={(e, value) => {
                              handleSelectSection(value);
                            }}
                            onDeselect={(e, value) => {
                              handleDeSelectSection(value);
                            }}
                            onClear={handleClearSection}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {sectionData.length > 1 && (
                              <>
                                <Option key={0} value={'all'}>
                                  All
                                </Option>
                              </>
                            )}
                            {sectionOptions}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  )}
                </Form>
                <div className='col-md-6'>
                  <span className='th-grey th-14'>Description*</span>
                  <div className='th-editor py-2'>
                    <TextArea
                      rows={5}
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
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

                            const fileName2 =
                              item[0]?.split('/')[item[0]?.split('/').length - 1];

                            return (
                              <div
                                title={fileName2}
                                className='th-br-15 col-md-3 col-5 px-1 px-md-3 py-2 mr-1 mb-1 th-bg-grey text-center d-flex align-items-center'
                              >
                                <span className='th-12 th-black-1 text-truncate'>
                                  {fileName2}
                                </span>
                                {/* <span className='th-12 th-black-1 '>.{extension}</span> */}

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
                        onClick={() => handleShowModal(false)}
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
                <div className='row mt-2 align-items-center'>
                  <div className='col-md-2 py-3 py-md-0'>
                    <Checkbox
                      onChange={(e) => setFlashEvent(e.target.checked)}
                      checked={flashEvent}
                    >
                      <span className='th-grey th-14'> Is Flash Event?</span>
                    </Checkbox>
                  </div>
                  {flashEvent ? (
                    <>
                      <div className='col-md-2 py-3 py-md-0'>
                        <span className='th-grey th-14'>Start Date*</span>
                        <div>
                          <DatePicker
                            disabledDate={(current) => {
                              return current < moment().startOf('day');
                            }}
                            className='text-left'
                            onChange={(e) => setStartDate(e.format('YYYY-MM-DD'))}
                            value={moment(startDate)}
                          />
                        </div>
                      </div>

                      <div className='col-md-2 py-3 py-md-0'>
                        <span className='th-grey th-14'>End Date*</span>
                        <div>
                          <DatePicker
                            disabledDate={(current) => {
                              return current < moment().startOf('day');
                            }}
                            onChange={(e) => setEndDate(e.format('YYYY-MM-DD'))}
                            value={moment(endDate)}
                          />
                        </div>
                      </div>
                      <div className='col-md-3 py-3 py-md-0'>
                        <span className='th-grey th-14'>Upload Flash Image*</span>
                        <div
                          className='row justify-content-start align-items-center th-br-4 py-1 mt-1'
                          style={{ border: '1px solid #D9D9D9' }}
                        >
                          <div className='col-md-8 col-9'>
                            <div className='row'>
                              {uploadedFlashFiles?.map((item, index) => {
                                const fileName2 =
                                  item[0]?.split('/')[item[0]?.split('/').length - 1];

                                return (
                                  <div
                                    title={fileName2}
                                    className='th-br-15 col-md-3 col-5 px-1 px-md-3 py-2 mr-1 mb-1 th-bg-grey text-center d-flex align-items-center'
                                  >
                                    <span className='th-12 th-black-1 text-truncate'>
                                      {fileName2}
                                    </span>
                                    {/* <span className='th-12 th-black-1 '>.{extension}</span> */}

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
                            className='col-md-4 col-3 th-primary text-right th-pointer pl-0 pr-1 pr-md-2'
                            onClick={() => handleShowModal(true)}
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
                      <div className='col-md-3'>
                        <span className='th-grey th-14'>Link</span>
                        <div className='th-editor py-2'>
                          <Input
                            style={{ fontSize: '10px' }}
                            onChange={(e) => setFlashLink(e.target.value)}
                            value={flashLink}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
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
                    {!props?.match?.params?.id ? (
                      <>
                        {/* <Checkbox.Group
                      options={intimationOptions}
                      onChange={(e) => setIntimation(e)}
                    /> */}
                        {notiConfig?.is_email == true ? (
                          <Checkbox onChange={(e) => setEmail(e.target.checked)}>
                            Intimate Via Email
                          </Checkbox>
                        ) : (
                          ''
                        )}
                        {notiConfig?.is_sms == true ? (
                          <Checkbox onChange={(e) => setSMS(e.target.checked)}>
                            Intimate Via SMS
                          </Checkbox>
                        ) : (
                          ''
                        )}
                        {notiConfig?.is_whatsapp == true ? (
                          <Checkbox onChange={(e) => setWhatsapp(e.target.checked)}>
                            Intimate Via Whatsapp
                          </Checkbox>
                        ) : (
                          ''
                        )}
                      </>
                    ) : null}
                  </div>
                  <div className='col-md-4 d-flex justify-content-md-end py-4 py-md-0'>
                    {!props?.match?.params?.id ? (
                      <>
                        <Button
                          className='th-bg-grey th-black-2 th-br-4 th-fw-500 th-14 th-pointer col-md-6 col-5 mr-5 mr-md-2'
                          style={{ border: '1px solid #D9D9D9' }}
                          onClick={() => handlePublish(true)}
                        >
                          Save as Draft
                        </Button>
                        {allowPublish && (
                          <Button
                            className='th-bg-primary th-white th-br-4 th-fw-500 th-14 th-pointer col-md-6 col-5'
                            onClick={() => handlePublish(false)}
                            // disabled={!allowPublish}
                          >
                            Publish
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        className='th-bg-grey th-black-2 th-br-4 th-fw-500 th-14 th-pointer col-md-6 col-5 mr-5 mr-md-2'
                        style={{ border: '1px solid #D9D9D9' }}
                        onClick={() => handlePublish()}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
        {/* )} */}
        <UploadModal
          show={showUploadModal}
          branchId={branchId}
          handleClose={handleUploadModalClose}
          setUploadedFiles={handleUploadedFiles}
          setFlashUploadedFiles={handleFlashUploadedFiles}
          flashModal={flashModal}
          handleFlashClose={handleUploadFlashModalClose}
        />
        <MembersModal show={showMembersModal} handleClose={handleMembersModalClose} />
      </div>
    </Layout>
  );
};

export default CreateAnnouncement;
