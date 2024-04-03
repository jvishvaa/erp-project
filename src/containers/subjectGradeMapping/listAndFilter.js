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
import { Breadcrumb, Select, Form, Table, Button, Modal, Input } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { AllInboxOutlined } from '@material-ui/icons';

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
    // { id: 'assessment', label: 'Assessment', key: 'is_assessment', value: true },
    { id: 'ebook', label: 'Ebook', key: 'is_ebook', value: true },
    { id: 'ibook', label: 'Ibook', key: 'is_ibook', value: true },
  ];
  const schooldata = JSON.parse(localStorage.getItem('schoolDetails')) || {};
  const school_id = schooldata.id;
  const [lessonModel, setlessonModel] = useState('');
  const [ebookModel, setebookModel] = useState('');
  const [ibookModel, setibookModel] = useState('');

  const [lesson, setlesson] = useState('');
  const [ebook, setebook] = useState('');
  const [ibook, setibook] = useState('');

  const [defaultVersion, setdefaultVersion] = useState(null);

  const dataIndexToNameMap = {
    lesson_plan_version: 'is_lesson_plan',
    ebook_version: 'is_ebook',
    ibook_version: 'is_ibook',
  };

  const getVersionName = async (value, module, plan) => {
    if (plan == 'lesson') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];
        setlesson(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
    if (plan == 'ebook') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];

        setebook(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
    if (plan == 'ibook') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];

        setibook(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
  };

  const getVersionNameModel = async (value, module, plan) => {
    if (plan == 'lesson') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];
        setlessonModel(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
    if (plan == 'ebook') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];

        setebookModel(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
    if (plan == 'ibook') {
      try {
        const queryString = generateQueryParamSting({
          school: school_id,
          [module]: true,
        });
        const response = await axios.get(
          `${endpoints.masterManagement.versionData}?${queryString}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        );

        const versionList = response.data?.result?.result[0]?.school_versions;

        const versionMap = versionList.reduce((acc, cur) => {
          acc[cur.academic_year] = cur.version_name;
          return acc;
        }, {});

        const versionName = versionMap[value];

        setibookModel(versionName ? versionName : 'Default Version');
      } catch (error) {
        console.error('Error fetching version:', error);
        return '-';
      }
    }
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
      render: (value, record) => {
        return <span>{lesson}</span>;
      },
    },
    {
      title: 'Ebook',
      dataIndex: 'ebook_version',
      key: 'ebook_version',
      render: (value, record) => {
        return <span>{ebook}</span>;
      },
    },
    {
      title: 'Ibook',
      dataIndex: 'ibook_version',
      key: 'ibook_version',
      render: (value, record) => {
        return <span>{ibook}</span>;
      },
    },
  ];

  const gradeColumns = [
    {
      title: 'Grade',
      dataIndex: ['grade', 'grade_name'],
      key: 'grade',
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'subject_name'],
      key: 'subject',
    },
  ];

  const handleOpenModal = () => {
    setModalToggle(true);
  };

  const handleCloseModal = () => {
    setModalToggle(false);
    setVersionList([]);
    AssignMappingRef.current.resetFields();
    if (defaultVersion) {
      setdefaultVersion(null);
    }
  };

  const handleOpenCategoryModal = () => {
    setCategoryToggle(true);
  };

  const handleCloseCategoryModal = () => {
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
          getVersionName(
            res?.data?.result[0]?.lesson_plan_version,
            'is_lesson_plan',
            'lesson'
          );
          getVersionName(res?.data?.result[0]?.ebook_version, 'is_ebook', 'ebook');
          getVersionName(res?.data?.result[0]?.ibook_version, 'is_ibook', 'ibook');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchWiseTableData = async (branch) => {
    axiosInstance
      .get(`${endpoints.masterManagement.branchWiseVersion}?acad_session=${branch?.id}`)
      .then((res) => {
        if (res?.data?.result) {
          getVersionNameModel(
            res?.data?.result[0]?.lesson_plan_version,
            'is_lesson_plan',
            'lesson'
          );
          getVersionNameModel(res?.data?.result[0]?.ebook_version, 'is_ebook', 'ebook');
          getVersionNameModel(res?.data?.result[0]?.ibook_version, 'is_ibook', 'ibook');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
      .then((res) => {
        if (res.data.data) {
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
          getVersionName(
            res?.data?.result[0]?.lesson_plan_version,
            'is_lesson_plan',
            'lesson'
          );
          getVersionName(res?.data?.result[0]?.ebook_version, 'is_ebook', 'ebook');
          getVersionName(res?.data?.result[0]?.ibook_version, 'is_ibook', 'ibook');
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

  const handleConfirm = async () => {
    if (defaultVersion) {
      setAlert('error', 'Version already exists! Contact the admin team');
    } else {
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
    }
  };

  const categoryMappingSubmit = () => {
    if (selectedERPCategory && selectedCentralCategory) {
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
      setVersionId(null);
      getBranchWiseTableData(JSON.parse(value?.value));
      if (AssignMappingRef && AssignMappingRef.current) {
        const formInstance = AssignMappingRef.current;
        formInstance.setFieldsValue({
          Module: undefined,
          Version: undefined,
        });
      }
      if (defaultVersion) {
        setdefaultVersion(null);
      }
    } else {
      setBranchValue(null);
    }
  };

  const handleChangeModule = (e, value) => {
    if (value && school_id) {
      setSelectedModule(JSON.parse(value?.value));
      const module = JSON.parse(value?.value);
      setdefaultVersion(null);
      getVersion(module?.key, school_id, module);
      if (AssignMappingRef && AssignMappingRef.current) {
        const formInstance = AssignMappingRef.current;
        formInstance.setFieldsValue({
          Version: undefined,
        });
      }
    } else {
      setSelectedModule(null);
    }
  };

  const handleChangeVersion = (e, value) => {
    if (value) {
      setVersionId(JSON.parse(value?.value));
    }
  };

  const handleGradeChange = (value) => {
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

  const getVersion = async (module, school_id, value) => {
    let filterValue = '';
    if (value?.id == 'lesson-plan') {
      filterValue = lessonModel;
    } else if (value?.id == 'ebook') {
      filterValue = ebookModel;
    } else if (value?.id == 'ibook') {
      filterValue = ibookModel;
    }
    const queryString = generateQueryParamSting({ school: school_id, [module]: true });
    await axios
      .get(`${endpoints.masterManagement.versionData}?${queryString}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        setVersionList(result?.data?.result?.result[0]?.school_versions);

        const filterData = result?.data?.result?.result[0]?.school_versions?.filter(
          (ele) => ele?.version_name === filterValue
        );

        if (filterData) {
          setdefaultVersion(filterData[0]?.version_name);
        } else {
          setdefaultVersion(null);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const fetchDetails = async (selectedSchool, moduleKey, version_id) => {
    if (version_id) {
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
    } else {
      const queryString = generateQueryParamSting({
        school: selectedSchool,
        [moduleKey]: true,
      });
      const apiURL = `${endpoints.masterManagement.schoolList}?${queryString}`;
      await axios
        .get(apiURL, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        })
        .then((res) => {
          const filterResult = res?.data?.result?.filter(
            (item) => item?.is_school_wise === true
          );
          setGradeSubjectList(filterResult[0]?.grade_subject_mapping);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          getVersionName(
            res?.data?.result[0]?.lesson_plan_version,
            'is_lesson_plan',
            'lesson'
          );
          getVersionName(res?.data?.result[0]?.ebook_version, 'is_ebook', 'ebook');
          getVersionName(res?.data?.result[0]?.ibook_version, 'is_ibook', 'ibook');
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
    setGradeSubjectList([]);
    fetchDetails(record?.school_id, dataIndexToNameMap[dataIndex], record[dataIndex]);
    setSelectedRow({ record, dataIndex });
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
                                {defaultVersion ? (
                                  <Input
                                    defaultValue={defaultVersion}
                                    disabled={defaultVersion ? true : false}
                                    style={{ borderWidth: '0.1px', color: 'gray' }}
                                  />
                                ) : (
                                  <Form.Item name={'Version'}>
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
                                )}
                              </Form.Item>
                            </div>
                          )}
                        </Form>
                      </div>
                    </div>
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
                            <Form.Item name={'ERP_Category'} label='ERP Category'>
                              <Select
                                mode='single'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                allowClear={true}
                                // defaultValue={selectedERPCategory?.category_name}
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
                            <Form.Item name={'Central_Category'} label='Central Category'>
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
                  <div>
                    {selectedRow?.dataIndex === 'lesson_plan_version' && 'Lesson Plan'}
                    {selectedRow?.dataIndex === 'ebook_version' && 'Ebook'}
                    {selectedRow?.dataIndex === 'ibook_version' && 'Ibook'}
                  </div>
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
