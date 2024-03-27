import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../Layout/index';
import FormHelperText from '@material-ui/core/FormHelperText';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { withRouter } from 'react-router-dom';
import {
  SvgIcon,
  // Button,
  Grid,
  FormControl,
  TextField,
  withStyles,
} from '@material-ui/core';
import Addicon from '../../assets/images/Add.svg';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import Subjectcard from './subjectCard';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './subjectgrademapping.scss';
import { generateQueryParamSting } from '../../utility-functions';
import moment from 'moment';
import { Breadcrumb, Select, Form, Table, Button, Modal } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { AllInboxOutlined } from '@material-ui/icons';
import jsPDF from 'jspdf';

// const StyledButton = withStyles((theme) => ({
//   root: {
//     color: '#FFFFFF',
//     backgroundColor: theme.palette.primary.main,
//     '&:hover': {
//       backgroundColor: theme.palette.primary.main,
//     },
//   },
//   startIcon: {},
// }))(Button);

const ListandFilter = (props) => {
  const { Option } = Select;
  const AssignMappingRef = useRef();
  const AssessmentCategoryMappingRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const [branch, setBranchRes] = useState([]);
  const [gradeRes, setGradeRes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [branchValue, setBranchValue] = useState(null);
  const [branchFilter, setBranchFilter] = useState(null);
  const [gradeValue, setGradeValue] = useState(null);
  const [schoolGsMapping, setSchoolGsMapping] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [versionList, setVersionList] = useState([]);
  const [versionId, setVersionId] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [modalToggle, setModalToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [centralCategory, setCentralCategory] = useState([]);
  const [erpCategory, setErpCategory] = useState([]);
  const [selectedERPCategory, setSelectedERPCategory] = useState(null);
  const [selectedCentralCategory, setSelectedCentralCategory] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [gradeSubjectList, setGradeSubjectList] = useState([]);
  const moduleList = [
    { id: 'lesson-plan', label: 'Lesson plan', key: 'is_lesson_plan', value: true },
    { id: 'assessment', label: 'Assessment', key: 'is_assessment', value: true },
    { id: 'ebook', label: 'Ebook', key: 'is_ebook', value: true },
    { id: 'ibook', label: 'Ibook', key: 'is_ibook', value: true },
  ];
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const dummyData = [
    {
      key: '1',
      branch: 'Branch A',
      lessonPlan: 'Plan A',
      ebook: 'Ebook A',
      ibook: 'Ibook A',
    },
    {
      key: '2',
      branch: 'Branch B',
      lessonPlan: 'Plan B',
      ebook: 'Ebook B',
      ibook: 'Ibook B',
    },
    {
      key: '3',
      branch: 'Branch C',
      lessonPlan: 'Plan C',
      ebook: 'Ebook C',
      ibook: 'Ibook C',
    },
    {
      key: '4',
      branch: 'Branch D',
      lessonPlan: 'Plan D',
      ebook: 'Ebook D',
      ibook: 'Ibook D',
    },
  ];

  const gardeSubjectData = [
    {
      key: '1',
      grade: 'Grade 1',
      subject: 'Biology',
    },
    {
      key: '2',
      grade: 'Grade 2',
      subject: 'EVS',
    },
    {
      key: '3',
      grade: 'Grade 1',
      subject: 'English',
    },
    {
      key: '4',
      grade: 'Grade 1',
      subject: 'Maths',
    },
  ];

  const getVersionName = (value) => {
    switch (value) {
      case 15:
        return 'Version 1';
      case 38:
        return 'Version 2';
      case 40:
        return 'Version 3';
      default:
        return '-';
    }
  };

  const dataIndexToNameMap = {
    lesson_plan_version: 'is_lesson_plan',
    ebook_version: 'is_ebook',
    ibook_version: 'is_ibook',
  };

  const columns = [
    {
      title: 'Branch',
      dataIndex: 'academic_year__branch__branch_name',
      key: 'academic_year__branch__branch_name',
    },
    {
      title: 'Lesson Plan',
      dataIndex: 'lesson_plan_version',
      key: 'lesson_plan_version',
      render: (value) => getVersionName(value),
    },
    {
      title: 'Ebook',
      dataIndex: 'ebook_version',
      key: 'ebook_version',
      render: (value) => getVersionName(value),
    },
    {
      title: 'Ibook',
      dataIndex: 'ibook_version',
      key: 'ibook_version',
      render: (value) => getVersionName(value),
    },
  ];

  const gradeColumns = [
    {
      title: 'Grade',
      dataIndex: ['grade', 'grade_name'], // Use array notation to access nested properties
      key: 'grade',
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'subject_name'], // Use array notation to access nested properties
      key: 'subject',
    },
  ];

  console.log(selectedYear, 'selectedAcademicYear');

  const handleOpenModal = () => {
    setModalToggle(true);
  };

  const handleCloseModal = () => {
    setModalToggle(false);
    AssignMappingRef.current.resetFields();
  };

  const handleOpenCategoryModal = () => {
    setCategoryToggle(true);
  };

  const handleCloseCategoryModal = () => {
    console.log('closing');
    setCategoryToggle(false);
    setSelectedERPCategory(null);
    setSelectedCentralCategory(null);
    AssessmentCategoryMappingRef.current.resetFields();
  };

  const navigateToCreatePage = () => {
    props.history.push('/master-management/subject/grade/mapping');
  };

  const navigateToCategoryPage = () => {
    props.history.push('/master-management/category-mapping');
  };

  const handleClearAll = () => {
    setFilter(false);
    setSchoolGsMapping([]);
    setGradeRes([]);
    setBranchValue(null);
    setGradeValue(null);
  };

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Content Mapping') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getERPCategory = () => {
    axiosInstance
      .get(`${endpoints.questionBank.categoryQuestion}`)
      .then((res) => {
        if (res?.data) {
          setErpCategory(res?.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCentralCategory = () => {
    axios
      .get(`${endpoints.questionBank.categoryList}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((res) => {
        if (res?.data) {
          setCentralCategory(res?.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchWiseTable = async (branch) => {
    axiosInstance
      .get(`${endpoints.masterManagement.branchWiseVersion}?acad_session=${branch?.id}`)
      .then((res) => {
        if (res?.data?.result) {
          setTableData(res?.data?.result);
          setSchoolId(res?.data?.result[0]?.school_id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(tableData, 'table');

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
      .then((res) => {
        if (res.data.data) {
          console.log(res.data, 'academic');
          setAcademicYear(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(
        `${endpoints.masterManagement.branchWiseVersion}?acad_session=${selectedBranch?.id}`
      )
      .then((res) => {
        if (res?.data?.result) {
          setTableData(res?.data?.result);
          setSchoolId(res?.data?.result[0]?.school_id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const getBranch = () => {
      //axiosInstance.get(endpoints.masterManagement.branchList).then(res => {
      axiosInstance
        .get(
          `${endpoints.mappingStudentGrade.branch}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
        )
        .then((res) => {
          if (res.data.data) {
            setBranchRes(res.data.data.results);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (selectedAcademicYear?.id) {
      getBranch();
    }
    getCentralCategory();
    getERPCategory();
  }, []);

  console.log(branchValue, 'Student');

  const handleConfirm = async () => {
    if (
      selectedYear === null ||
      branchValue === null ||
      selectedModule === null ||
      versionId === null
    ) {
      setAlert('error', 'Please select all the fields');
      return;
    } else {
      const { key: moduleKey, value } = selectedModule;
      let body = {
        branch: branchValue && branchValue.branch.id,
        module: moduleKey,
        [moduleKey]: value,
        eduvate_sy: versionId?.academic_year,
        acad_session: branchValue?.id,
      };
      console.log(body, 'branch');

      await axiosInstance
        .post(endpoints.masterManagement.branchWiseVersion, body)
        .then((res) => {
          if (res.data.status_code === 200) {
            setAlert('success', res.data.message);
          } else {
            setAlert('warning', res.data.message);
          }
        })
        .catch((err) => {
          setAlert('error', err.message);
          console.log(err);
        });
    }
    getBranchWiseTable(branchValue);
    handleCloseModal();
  };

  console.log(selectedERPCategory, 'selected');

  let body = {
    central_category_name:
      selectedCentralCategory && selectedCentralCategory?.category_name,
    category_id: selectedERPCategory && selectedERPCategory?.id,
    central_category_id: selectedCentralCategory && selectedCentralCategory?.id,
  };

  // console.log(body, 'selected');

  // const handleConfirmCategory = () => {
  //   handleCloseCategoryModal();
  // };

  const categoryMappingSubmit = () => {
    console.log(selectedERPCategory, selectedCentralCategory);
    if (selectedERPCategory && selectedCentralCategory) {
      //   const { key: moduleKey, value } = selectedModule;
      let body = {
        central_category_name:
          selectedCentralCategory && selectedCentralCategory?.category_name,
        category_id: selectedERPCategory && selectedERPCategory?.id,
        central_category_id: selectedCentralCategory && selectedCentralCategory?.id,
      };
      axiosInstance
        .post(endpoints.questionBank.categoryMapping, body)
        .then((res) => {
          if (res?.status === 200) {
            setAlert('success', res.data[0]);
            // history.push('/subject/grade');
          } else {
            setAlert('warning', res.data[0]);
          }
          handleCloseCategoryModal();
        })
        .catch((err) => {
          setAlert('error', err.message);
          console.log(err);
        });
    } else {
      setAlert('error', 'Please select all the fields');
      return;
    }
  };

  const handleChangeYear = (e, vaule) => {
    setBranchValue(null);
    setSelectedModule(null);
    if (vaule) {
      setSelectedYear(JSON.parse(vaule?.value));
    }
  };

  const branchOption = branch?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={JSON.stringify(each)}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const academicYearOption = academicYear?.map((each) => {
    return (
      <Option key={each?.id} value={JSON.stringify(each)}>
        {each?.session_year}
      </Option>
    );
  });

  const moduleOption = moduleList?.map((each) => {
    return (
      <Option key={each?.id} value={JSON.stringify(each)}>
        {each?.label}
      </Option>
    );
  });

  console.log(versionList, 'version');

  const versionOption = versionList?.map((each) => {
    return (
      <Option key={each?.academic_year} value={JSON.stringify(each)}>
        {each?.version_name}
      </Option>
    );
  });

  const erpCategoryOption = erpCategory?.map((each) => {
    return (
      <Option key={each?.id} value={JSON.stringify(each)}>
        {each?.category_name}
      </Option>
    );
  });

  const centralCategoryOption = centralCategory?.map((each) => {
    return (
      <Option key={each?.id} value={JSON.stringify(each)}>
        {each?.category_name}
      </Option>
    );
  });

  useEffect(() => {
    if (academicYear.length > 0) {
      const currentAcademicYear =
        moment().month() < 3
          ? `${Number(moment().year()) - 1}-${moment().format('YY')}`
          : `${moment().year()}-${Number(moment().format('YY')) + 1}`;
      academicYear.map((option) => {
        if (option.session_year === currentAcademicYear) {
          handleChangeYear(option);
        }
      });
    }
  }, [academicYear]);

  const handleBranchFilter = (e, value) => {
    if (value) {
      setBranchFilter(JSON.parse(value?.value));
    } else {
      setBranchFilter(null);
    }
  };

  const handleChangeBranch = (e, value) => {
    if (value) {
      setBranchValue(JSON.parse(value?.value));
      setSelectedModule(null);
    } else {
      setBranchValue(null);
    }
    getBranchWiseTable(JSON.parse(value?.value));
  };

  const handleChangeModule = (e, value) => {
    if (value && schoolId) {
      setSelectedModule(JSON.parse(value?.value));
      const module = JSON.parse(value?.value);
      getVersion(module?.key, schoolId);
    } else {
      setSelectedModule(null);
    }
  };

  const handleChangeVersion = (e, value) => {
    if (value) {
      console.log(JSON.parse(value?.value, 'version'));
      setVersionId(JSON.parse(value?.value));
    }
  };

  const handleGradeChange = (value) => {
    //setGradeValue(value);
    if (value) {
      setGradeValue(value);
    } else {
      setGradeValue(null);
    }
  };

  const handleErpCategory = (e, val) => {
    if (val) {
      setSelectedERPCategory(JSON.parse(val?.value));
    } else {
      setSelectedERPCategory(null);
    }
  };

  const handleCentralCategory = (e, val) => {
    if (val) {
      setSelectedCentralCategory(JSON.parse(val?.value));
    } else {
      setSelectedCentralCategory(null);
    }
  };

  // const getRoleApi = async () => {
  //   try {
  //     const result = await axios.get(endpoints.userManagement.userLevelList, {
  //       headers: {
  //         'x-api-key': 'vikash@12345#1231',
  //       },
  //     });
  //     if (result.status === 200) {
  //       // setRoles(result?.data?.result);
  //     } else {
  //       setAlert('error', result?.data?.message);
  //     }
  //   } catch (error) {
  //     setAlert('error', error?.message);
  //   }
  // };

  // useEffect(() => {
  //   getRoleApi();
  // }, []);

  const getVersion = async (module, school_id) => {
    const queryString = generateQueryParamSting({ school: school_id, [module]: true });
    await axios
      .get(`${endpoints.masterManagement.versionData}?${queryString}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        console.log(result?.data?.result?.result[0]?.school_versions, 'success');
        setVersionList(result?.data?.result?.result[0]?.school_versions);
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const fetchDetails = async (selectedSchool, moduleKey, version_id) => {
    const queryString = generateQueryParamSting({
      school: selectedSchool,
      version_id: version_id,
      [moduleKey]: true,
    });
    const apiURL = `${endpoints.masterManagement.schoolList}?${queryString}`;
    await axios
      .get(apiURL, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((res) => {
        setGradeSubjectList(res?.data?.result[0]?.grade_subject_mapping);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = async () => {
    if (branchFilter === null) {
      setAlert('warning', 'Select Branch');
      return false;
    } else {
      setFilter(true);
      await axiosInstance
        .get(
          `${endpoints.masterManagement.branchWiseVersion}?acad_session=${branchFilter?.id}`
        )
        .then((res) => {
          setTableData(res?.data?.result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateDeletData = (value, index) => {
    const newData = value;
    value.splice(index, 1);
    setSchoolGsMapping(newData);
  };

  const Validation = (formData) => {
    let input = formData;
    let error = {};
    let errors = false;
    let isValid = true;
    if (!input['branch']) {
      isValid = false;
      errors = true;
      error['branchError'] = 'Please select valid branch';
    }
    // if (!input['erp_grade']) {
    //   isValid = false;
    //   errors = true;
    //   error['erp_gradeError'] = 'Please select valid Grade';
    // }
    const validInfo = {
      errorMessage: error,
      isValid,
      errors,
    };
    return validInfo;
  };

  const handleRowClick = (record, dataIndex) => {
    // setModuleName(dataIndexToNameMap[dataIndex]);
    fetchDetails(record?.school_id, dataIndexToNameMap[dataIndex], record[dataIndex]);
    setSelectedRow({ record, dataIndex });
    // setVersionId(record[dataIndex]);
    console.log(record[dataIndex], dataIndex, 'rowclicked');
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  return (
    <Layout>
      <div style={{ height: '100%' }}>
        {/* <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Content Mapping'
        /> */}
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-18 th-grey'>
                Master Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                Content Mapping
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 shadow-sm'>
              <div className='row'>
                <div className='col-md-3 col-sm-6 col-12'>
                  <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                    Branch
                  </div>
                  <Select
                    mode='single'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Branch'
                    onChange={(e, value) => {
                      handleBranchFilter(e, value);
                    }}
                    bordered={false}
                  >
                    {branchOption}
                  </Select>
                </div>

                <div
                  className='col-lg-2 col-md-3 col-sm-4 col-6 pl-1 mb-2 mt-4'
                  style={{ marginTop: '5px' }}
                >
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    onClick={handleFilter}
                  >
                    Filter
                  </Button>
                </div>
              </div>
              <br />
              <div className='col-lg-9 col-md-12 col-sm-12 col-12'>
                <div className='row no-gutters'>
                  <div className='col-lg-3 col-md-3 col-sm-6 col-6 pl-1'>
                    <Button
                      type='primary'
                      className='w-100 btn-block th-br-4 th-14'
                      // onClick={navigateToCreatePage}
                      onClick={handleOpenModal}
                      icon={<PlusOutlined />}
                    >
                      Assign Mapping
                    </Button>
                  </div>
                  <Modal
                    title='Assign Mapping'
                    visible={modalToggle}
                    onOk={handleConfirm}
                    onCancel={handleCloseModal}
                    centered
                    okText='Assign'
                  >
                    <div className='p-2 mt-3 mb-3 d-flex justify-content-center align-items-center'>
                      <div className='col-12'>
                        <Form ref={AssignMappingRef} layout={'vertical'}>
                          <div className='col-md-12 col-sm-10 col-12 mb-4'>
                            <Form.Item name={'Academic Year'} label='Academic Year'>
                              <Select
                                mode='single'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Academic Year*'
                                onChange={(e, value) => {
                                  handleChangeYear(e, value);
                                }}
                                bordered={false}
                              >
                                {academicYearOption}
                              </Select>
                            </Form.Item>
                          </div>

                          <div className='col-md-12 col-sm-10 col-12 mb-4'>
                            <Form.Item name={'Branch'} label='Branch'>
                              <Select
                                mode='single'
                                // key={branchValue}
                                // value={branchValue}
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Branch*'
                                onChange={(e, value) => {
                                  handleChangeBranch(e, value);
                                }}
                                bordered={false}
                              >
                                {branchOption}
                              </Select>
                            </Form.Item>
                          </div>

                          <div className='col-md-12 col-sm-10 col-12 mb-4'>
                            <Form.Item name={'Module'} label='Module'>
                              <Select
                                mode='single'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Module*'
                                onChange={(e, value) => {
                                  handleChangeModule(e, value);
                                }}
                                bordered={false}
                              >
                                {moduleOption}
                              </Select>
                            </Form.Item>
                          </div>

                          {selectedModule?.id !== 'assessment' && (
                            <div className='col-md-12 col-sm-10 col-12 mb-4'>
                              <Form.Item name={'Version'} label='Version'>
                                <Select
                                  mode='single'
                                  getPopupContainer={(trigger) => trigger.parentNode}
                                  allowClear={true}
                                  suffixIcon={<DownOutlined className='th-grey' />}
                                  className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                  placement='bottomRight'
                                  showArrow={true}
                                  dropdownMatchSelectWidth={true}
                                  filterOption={(input, options) => {
                                    return (
                                      options.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    );
                                  }}
                                  showSearch
                                  placeholder='Select Version*'
                                  onChange={(e, value) => {
                                    handleChangeVersion(e, value);
                                  }}
                                  bordered={false}
                                >
                                  {versionOption}
                                </Select>
                              </Form.Item>
                            </div>
                          )}
                        </Form>
                      </div>
                    </div>
                    {/* <div className='p-2 mt-3 mb-3 d-flex flex-column justify-content-center align-items-center'>
                      <div className='col-md-10 col-sm-10 col-12 mb-4'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          Academic Year
                        </div>
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Academic Year*'
                          onChange={(e, value) => {
                            handleChangeYear(e, value);
                          }}
                          bordered={false}
                        >
                          {academicYearOption}
                        </Select>
                      </div>

                      <div className='col-md-10 col-sm-10 col-12 mb-4'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          Branch
                        </div>
                        <Select
                          mode='single'
                          // key={branchValue}
                          // value={branchValue}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Branch*'
                          onChange={(e, value) => {
                            handleChangeBranch(e, value);
                          }}
                          bordered={false}
                        >
                          {branchOption}
                        </Select>
                      </div>

                      <div className='col-md-10 col-sm-10 col-12 mb-4'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          Module
                        </div>
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Module*'
                          onChange={(e, value) => {
                            handleChangeModule(e, value);
                          }}
                          bordered={false}
                        >
                          {moduleOption}
                        </Select>
                      </div>

                      <div className='col-md-10 col-sm-10 col-12'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          Version
                        </div>
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Version*'
                          onChange={(e, value) => {
                            handleChangeVersion(e, value);
                          }}
                          bordered={false}
                        >
                          {versionOption}
                        </Select>
                      </div>
                    </div> */}
                  </Modal>
                  <div className='col-lg-4 col-md-5 col-sm-6 col-6 pl-1'>
                    <Button
                      type='primary'
                      className='w-100 btn-block th-br-4 th-14'
                      // onClick={navigateToCategoryPage}
                      onClick={handleOpenCategoryModal}
                      icon={<PlusOutlined />}
                      // style={{ width: '100%' }}
                    >
                      Assignment Category Mapping
                    </Button>
                  </div>
                  <Modal
                    title='Assignment Category Mapping'
                    visible={categoryToggle}
                    onOk={categoryMappingSubmit}
                    onCancel={handleCloseCategoryModal}
                    centered
                    okText='Assign'
                  >
                    <div className='p-2 mt-3 mb-3 d-flex justify-content-center align-items-center'>
                      <div className='col-12'>
                        <Form ref={AssessmentCategoryMappingRef} layout={'vertical'}>
                          <div className='col-md-12 col-sm-10 col-12 mb-4'>
                            <Form.Item name={'ERP Category'} label='ERP Category'>
                              <Select
                                mode='single'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                defaultValue={selectedERPCategory?.category_name}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select ERP Category*'
                                // value={
                                //   selectedERPCategory ? selectedERPCategory?.category_name : null
                                // }
                                onChange={(e, val) => {
                                  handleErpCategory(e, val);
                                }}
                                bordered={false}
                              >
                                {erpCategoryOption}
                              </Select>
                            </Form.Item>
                          </div>

                          <div className='col-md-12 col-sm-10 col-12 mb-4'>
                            <Form.Item name={'Central Category'} label='Central Category'>
                              <Select
                                mode='single'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Central Category*'
                                onChange={(e, value) => {
                                  handleCentralCategory(e, value);
                                  // setSelectedCentralCategory(e, value);
                                }}
                                bordered={false}
                              >
                                {centralCategoryOption}
                              </Select>
                            </Form.Item>
                          </div>
                        </Form>
                      </div>
                    </div>
                    {/* <div className='p-2 mt-3 mb-3 d-flex flex-column justify-content-center align-items-center'>
                      <div className='col-md-10 col-sm-10 col-12 mb-4'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          ERP Category
                        </div>
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          defaultValue={selectedERPCategory?.category_name}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select ERP Category*'
                          // value={
                          //   selectedERPCategory ? selectedERPCategory?.category_name : null
                          // }
                          onChange={(e, val) => {
                            handleErpCategory(e, val);
                          }}
                          bordered={false}
                        >
                          {erpCategoryOption}
                        </Select>
                      </div>
                      <div className='col-md-10 col-sm-10 col-12 mb-4'>
                        <div className='mb-2 text-left' style={{ marginLeft: '2%' }}>
                          Central Category
                        </div>
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Central Category*'
                          onChange={(e, value) => {
                            handleCentralCategory(e, value);
                            // setSelectedCentralCategory(e, value);
                          }}
                          bordered={false}
                        >
                          {centralCategoryOption}
                        </Select>
                      </div>
                    </div> */}
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='convert col-md-12 mt-4'>
          <Table
            className='th-table version-table'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
            }
            // loading={loading}
            columns={columns.map((col, index) => ({
              ...col,
              onCell: (record) => ({
                onClick: index !== 0 ? () => handleRowClick(record, col.dataIndex) : null,
              }),
            }))}
            rowKey={(record) => record?.id}
            dataSource={tableData}
            pagination={false}
            scroll={{
              x: window.innerWidth > 400 ? '100%' : 'max-content',
              y: 350,
            }}
          />
        </div>
        <Modal
          title='Content Mapping'
          visible={selectedRow !== null}
          onCancel={closeModal}
          onOk={closeModal}
          width={'40%'}
          centered
        >
          {selectedRow && (
            <div className='p-2 mt-3 mb-3'>
              <div className='ml-3 d-flex justify-content-around'>
                {/* <div className=''> */}
                <div className='row'>
                  <div style={{ fontWeight: 'bold', marginRight: '5px' }}>Branch: </div>
                  <div>{selectedRow?.record?.academic_year__branch__branch_name}</div>
                </div>
                <div className='row'>
                  <div style={{ fontWeight: 'bold', marginRight: '5px' }}>Module: </div>
                  <div>{selectedRow?.dataIndex}</div>
                </div>
                {/* </div> */}
              </div>
              <div className='p-2 mt-2'>
                <Table
                  className='th-table version-grade-table'
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
                  }
                  // loading={loading}
                  columns={gradeColumns}
                  rowKey={(record) => record?.id}
                  dataSource={gradeSubjectList}
                  pagination={false}
                  scroll={{
                    x: window.innerWidth > 400 ? '100%' : 'max-content',
                    y: 350,
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
        {/* <div>
        <Table
                      dataSource={refferList}
                      columns={columns}
                      className='custom-table'
                      pagination={false}
                      bordered
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                      }
                    />
        </div> */}
        {/* <Grid
          container
          spacing={2}
          style={{ width: '95%', overflow: 'hidden', margin: '20px auto' }}
        >
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl style={{ width: '100%' }} className={`select-form`}>
                <Autocomplete
                  style={{ width: '100%' }}
                  value={selectedYear}
                  id='tags-outlined'
                  className='dropdownIcon'
                  options={academicYear}
                  getOptionLabel={(option) => option?.session_year}
                  filterSelectedOptions
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Academic Year' />
                  )}
                  onChange={(e, value) => {
                    handleChangeYear(value);
                  }}
                  getOptionSelected={(option, value) => value && option.id == value.id}
                />
                <FormHelperText style={{ marginLeft: '20px', color: 'red' }}>
                  {error && error.errorMessage && error.errorMessage.branchError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl style={{ width: '100%' }} className={`select-form`}>
                <Autocomplete
                  style={{ width: '100%' }}
                  value={branchValue}
                  id='tags-outlined'
                  options={branch}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option?.branch?.branch_name}
                  filterSelectedOptions
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Branch' />
                  )}
                  onChange={(e, value) => {
                    handleChangeBranch(value);
                  }}
                  getOptionSelected={(option, value) => value && option.id == value.id}
                />
                <FormHelperText style={{ marginLeft: '20px', color: 'red' }}>
                  {error && error.errorMessage && error.errorMessage.branchError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl style={{ width: '100%' }} className={`subject-form`}>
                <Autocomplete
                  style={{ width: '100%' }}
                  required={true}
                  value={gradeValue}
                  id='tags-outlined'
                  options={gradeRes}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option.grade__grade_name}
                  filterSelectedOptions
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Grade' />
                  )}
                  onChange={(e, value) => {
                    handleGradeChange(value);
                  }}
                  getOptionSelected={(option, value) => value && option.id == value.id}
                />
                <FormHelperText style={{ marginLeft: '20px', color: 'red' }}>
                  {error && error.errorMessage && error.errorMessage.erp_gradeError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Autocomplete
                style={{ width: '100%' }}
                required={true}
                value={selectedModule}
                id='tags-outlined'
                options={moduleList}
                className='dropdownIcon'
                getOptionLabel={(option) => option.label}
                filterSelectedOptions
                size='small'
                renderInput={(params) => (
                  <TextField {...params} variant='outlined' label='Module' />
                )}
                onChange={(e, value) => {
                  setSelectedModule(value);
                }}
                getOptionSelected={(option, value) => value && option.id == value.id}
              />
            </Grid>
          </Grid>
          <div className='btn-list'>
            <Button
              variant='contained'
              className='cancelButton labelColor'
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button
              variant='contained'
              color='primary'
              className='filter-btn'
              style={{ color: 'white', marginLeft: 15 }}
              onClick={handleFilter}
            >
              Filter
            </Button>
          </div>
          <div className='button-container-map'>
            <StyledButton
              variant='outlined'
              color='primary'
              style={{ color: 'white', marginTop: '4px' }}
              onClick={navigateToCreatePage}
            >
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '12px', marginRight: '5px' }}
                    src={Addicon}
                    alt='given'
                  />
                )}
              />
              Assign Mapping
            </StyledButton>
          </div>
          <div className='button-container-map'>
            <StyledButton
              variant='outlined'
              color='primary'
              style={{ color: 'white', marginTop: '4px' }}
              onClick={navigateToCategoryPage}
            >
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '12px', marginRight: '5px' }}
                    src={Addicon}
                    alt='given'
                  />
                )}
              />
              Assign Category Mapping
            </StyledButton>
          </div>
        </Grid> */}
        {/* <Grid container spacing={2} className='mapping-sub-grade-container'>
          <Grid item md={12} xs={12} className='mapping-grade-subject-container'>
            <Subjectcard
              schoolGsMapping={schoolGsMapping}
              updateDeletData={updateDeletData}
              setFilters={filter}
            />
          </Grid>
        </Grid> */}
      </div>
    </Layout>
  );
};

export default withRouter(ListandFilter);
