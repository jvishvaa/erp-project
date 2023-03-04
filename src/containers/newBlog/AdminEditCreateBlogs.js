import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  Divider,
  TextField,
  // Button,
  makeStyles,
  // Typography,
  Grid,
  // Breadcrumb,
  // Checkbox,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Carousel from 'react-elastic-carousel';
import Loader from '../../components/loader/loader';
import axios from 'axios';
import {
  fetchAcademicYears,
  fetchBranches as fetchBranchRedux,
  fetchGrades,
  fetchSection,
} from '../lesson-plan/create-lesson-plan/apis';
import {
  Breadcrumb,
  Button,
  Form,
  Select,
  Space,
  Typography,
  DatePicker,
  Input,
  message,
  Checkbox,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { element } from 'prop-types';
import moment from 'moment';

const drawerWidth = 350;
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  customFileUpload: {
    border: '1px solid black',
    padding: '6px 12px',

    cursor: 'pointer',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: `${theme.palette.secondary.main} !important`,
    backgroundColor: 'white',
  },
  buttonColor1: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
}));

const AdminEditCreateBlogs = () => {
  const classes = useStyles();
  const { Option } = Select;
  const formRef = useRef();
  const { TextArea } = Input;
  const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const history = useHistory();
  const [branchList, setBranchList] = useState([]);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [assigned, setAssigned] = useState(false);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [checked, setChecked] = React.useState('');
  const [activityName, setActivityName] = useState([]);
  const [templateId, setTemplatesId] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [flag,setFlag] = useState(false)
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];
  const [changeText, setChangeText] = useState('');
  const handleChangeActivity = (e, value) => {
    setActivityName(value);
  };
  const handleChangeText = (e, value) => {
    setChangeText(value);
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Blog Activity') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getBranch = async (acadId) => {
    setLoading(true);

    try {
      setBranchList([]);
      setGrades([]);
      // setSubjects([]);
      if (moduleId) {
        const data = await fetchBranchRedux(acadId, moduleId);
        setBranchList(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Branch');
    }

    // if (branch_update_user) {

    //   var branchIds = branch_update_user?.branches?.map((item) => item?.id);
    //   axiosInstance
    //     .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`, {
    //       headers: {
    //         'X-DTS-HOST': X_DTS_HOST,
    //       },
    //     })
    //     .then((res) => {
    //       if (res?.data) {
    //         const transformedData = res.data.result?.map((obj) => ({
    //           id: obj.id,
    //           name: obj.name,
    //         }));
    //         // transformedData.unshift({
    //         //   name: 'Select All',
    //         //   id: 'all',
    //         // });
    //         setBranchList(transformedData);
    //         if (selectedBranch && selectedBranch.length > 0) {
    //           const selectedSectionArray = transformedData.filter(
    //             (obj) => selectedBranch.findIndex((sec) => obj.id == sec.id) > -1
    //           );
    //           setSelectedBranch(selectedSectionArray);
    //         }
    //       }
    //       setLoading(false);
    //     });
    // }
  };

  let allGradeIds = [];

  const getGrades = async (acadId, branchId) => {
    // const ids = value.map((el) => el.id) || [];
    setLoading(true);
    try {
      setGrades([]);
      // setSubjects([]);
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
      setGradeList(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      message.error('Failed to Fetch Grade');
    }

    // axiosInstance
    //   .get(`${endpoints.newBlog.activityGrade}?branch_ids=${ids}`, {
    //     headers: {
    //       'X-DTS-HOST': X_DTS_HOST,
    //     },
    //   })
    //   .then((res) => {
    //     if (res) {
    //       const gradeData = res?.data?.result || [];
    //       for (let i = 0; i < gradeData?.length; i++) {
    //         allGradeIds.push(gradeData[i].id);
    //       }
    //       gradeData.unshift({
    //         name: 'Select All',
    //         id: allGradeIds,
    //       });
    //       setGradeList(gradeData);
    //     }
    //     setLoading(false);
    //   });
  };

  const handleChange = (event, value) => {
    setChecked(value);
    setTemplatesId(value);
  };

  const fetchSections = (sessionId, branchIds, gradeIds, moduleId) => {
    if (gradeIds) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.newBlog.erpSectionmappping}?session_year=${sessionId}&branch_id=${branchIds}&module_id=${moduleId}&grade_id=${gradeIds}`,
        )
        .then((result) => {
          setLoading(false);
          if (result.data) {
            setSectionList(result.data?.data);
            const gradeData = result?.data?.result || [];
            // gradeData.unshift({
            //   name: 'Select All',
            //   id: 'all',
            // });
            setSectionDropdown(gradeData);
          }
        });
    }
  };

  useEffect(() => {
    getBranch(academicYear?.id);
  }, [editFlag]);

  const handleBranch = (e, value) => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    if (value?.length > 0) {
      const branchIds = value?.map((element) => parseInt(element?.key)) || [];
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedBranch(value);
      getGrades(selectedAcademicYear?.id, branchIds);
    }
  };

  const handleGrade = (e, value) => {
    setSelectedSection([]);
    if (value) {
      const branchIds = selectedBranch.map((element) => parseInt(element?.key));
      const gradeId = value?.map((element) => parseInt(element?.key));
      // value =
      //   value.filter(({ name }) => name === 'Select All').length === 1
      //     ? [...gradeList].filter(({ name }) => name !== 'Select All')
      //     : value;
      setSelectedGrade(value);
      fetchSections(selectedAcademicYear?.id, branchIds, gradeId, moduleId);
      
    }
  };
  const handleSection = (e, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionDropdown].filter(({ id }) => id !== 'all')
          : value;
      setSelectedSection(value);
    }
  };

  const blogsContent = [
    {
      label: 'Public Speaking',
      value: '1',
    },
    {
      label: 'Post Card Writting',
      value: '2',
    },
    {
      label: 'Blog Card Writting',
      value: '3',
    },
  ];
  const handleStartDateChange = (val) => {
    setStartDate(moment(val).format('YYYY-MM-DD'));
    setFlag(true)
  };
  const PreviewBlog = () => {
    setAssigned(true);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileUrl(URL.createObjectURL(event.target.files[0]));
  };
  const deleteSelectedImage = () => {
    setFileUrl(null);
    setSelectedFile(null);
  };
  const handleClear = () => {
    setSelectedGrade([]);
    setSelectedBranch([]);
    setSelectedSection([]);
    setActivityName([]);
    setDescription('');
    setTitle('');
    setStartDate('');
    formRef.current.setFieldsValue({
      activity_categories:[],
      branch:[],
      grade:[],
      section:[],
      })
  };
  const formatdate = new Date();
  const hoursAndMinutes =
    'T' +
    formatdate.getHours() +
    ':' +
    formatdate.getMinutes() +
    ':' +
    formatdate.getSeconds();
  const dataPost = () => {
    setLoading(true);
    const branchIds = selectedBranch.map((obj) => obj?.branch_id);
    const gradeIds = selectedGrade.map((obj) => obj?.grade_id);
    const sectionIds = selectedSection.map((obj) => obj?.section_id);

    if (activityName.length === 0) {
      message.error('Please Add Activity Name');
      setLoading(false);
      return;
    }
    if (branchIds?.length === 0) {
      message.error('Please Select Branch');
      setLoading(false);
      return;
    }
    if (gradeIds?.length === 0) {
      message.error('Please Select Grade');
      setLoading(false);
      return;
    }
    if (sectionIds?.length === 0) {
      message.error('Please Select Section');
      setLoading(false);
      return;
    }
    if (!startDate) {
      message.error('Please Select Date');
      setLoading(false);
      return;
    }
    if (title.length === 0) {
      message.error('Please Add Title');
      setLoading(false);
      return;
    }
    if (!description) {
      message.error('Please Add Description');
      setLoading(false);
      return;
    } else {
      let body = {
        title: title,
        description: description,
        issue_date: null,
        submission_date: flag ? startDate + hoursAndMinutes : startDate,
        activity_type_id: activityName.id,
        session_year: selectedAcademicYear.session_year,
        created_at: flag ? startDate + hoursAndMinutes: startDate,
        created_by: user_id.id,
        branch_ids: branchIds,
        grade_ids: gradeIds,
        section_ids: sectionIds,
        is_draft: true,
        template_type: changeText.name,
        template_id: templateId,
      };
      // setLoading(true);
      axios
        .put(`${endpoints.newBlog.confirmAssign}${id}/`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          message.success('Activity Updated Successfully');
          setSelectedGrade([]);
          setSelectedBranch([]);
          setSelectedSection([]);
          setActivityName([]);
          setDescription('');
          setTitle('');
          setStartDate('');
          setEditFlag(false);
          history.push('/blog/blogview');
          setLoading(false);
        });
    }
  };
  const [id, setId] = useState('');
  const [previewData, setPreviewData] = useState();

  useEffect(() => {
    if (history?.location?.pathname === '/blog/admineditcreateblogs' && moduleId) {
      handlePreview(history?.location?.state?.data?.id);

      setDescription(history?.location?.state?.data?.description);
      setTitle(history?.location?.state?.data?.title);
      setId(history?.location?.state?.data?.id);
    }
  }, [history, moduleId]);

  const handlePreview = (data) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.previewDetails}${data}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setTemplatesId(response?.data?.result?.template?.id);
          setPreviewData(response?.data?.result);
          setActivityName(response?.data?.result?.activity_type);
          setSelectedBranch(response?.data?.result?.branches.map((obj) => obj));
          setSelectedGrade(response?.data?.result?.grades?.map((obj) => obj));
          setSelectedSection(response?.data?.result?.sections?.map((obj) => obj));
          setFileUrl(response?.data?.result?.template_path);
          setStartDate(response?.data?.result?.submission_date);
          setEditFlag(true);
          if (history.location.state.data) {
            const branchIds = response?.data?.result?.branches.map((obj) => obj?.branch_id) || [];
            const gradeId = response?.data?.result?.grades?.map((obj) => obj?.grade_id) || [];

            getGrades(selectedAcademicYear?.id, branchIds);
            fetchSections(selectedAcademicYear?.id, branchIds, gradeId, moduleId);

            formRef.current.setFieldsValue({
              activity_categories: response?.data?.result?.activity_type?.name,
              branch: response?.data?.result?.branches.map((obj) => obj?.branch_id),
              grade:response?.data?.result?.grades?.map((obj) => obj?.grade_id), 
              section: response?.data?.result?.sections?.map((obj) => obj?.section_id),
              date: moment(response?.data?.result?.submission_date).format('YYYY-MM-DD')
            
            });
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const [typeText, setTypeText] = useState([{ name: 'text' }, { name: 'template' }]);

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        setLoading(false);
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const [activityStorage, setActivityStorage] = useState([]);
  const getActivitySession = () => {
    setLoading(true);
    axios
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        setActivityStorage(response.data.result);

        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };

  const closePreview = () => {
    setAssigned(false);
  };
  const [title, setTitle] = useState('');
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const [description, setDescription] = useState('');
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  const getTemplate = (data) => {
    if (data) {
      setLoading(true);
      axios
        .get(`${endpoints.newBlog.getTemplates}${data}/`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          setTemplates(response?.data?.result);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (activityName) {
      getTemplate(activityName.id);
    }
  }, [selectedBranch, selectedGrade, activityName]);

  const isSelected = (id) => {
    if (templateId === id) {
      return true;
    } else {
      return false;
    }
  };

  const actionTypeOption = activityCategory.map((each) => {
    return (
      <Option key={each?.id} value={each?.name} id={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id} id={each?.branch?.id} branch_id={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = grades?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id} id={each?.grade_id} grade_id={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.section_id} id={each?.section_id} section_id={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  // const roundOptions = roundDropdown.map((each) => {
  //   return (
  //     <Option key={each?.id} value={each?.name} id={each?.id}>
  //       {each?.name}
  //     </Option>
  //   );
  // });

  // const subActionTypeOption = subActivityListData.map((each) => {
  //   return (
  //     <Option key={each?.id} value={each?.sub_type} id={each?.id}>
  //       {each?.sub_type}
  //     </Option>
  //   );
  // });

  const handleAcademicYear = (event = {}, value = '') => {
    // formik.setFieldValue('academic', '');
    setAcademicYear('');
    if (value) {
      getBranch(value?.id);
      setAcademicYear(value);
      // formik.setFieldValue('academic', value);
    }
  };
  const getAcademic = async () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      getAcademic();
    }
  }, [moduleId, selectedAcademicYear]);

  const handleClearGrade = () => {
    setSelectedGrade([]);
  };

  const goBack = () => {
    history.push('/blog/blogview');
  };

  return (
    <div>
      {loading && <Loader />}
      <Layout>
        <div className='row py-3 px-2 th-bg-grey'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey-1 th-18 th-pointer'
                href='/blog/wall/central/redirect'
              >
                Activity Management
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className='th-grey-1 th-18 th-pointer'
                href='/blog/blogview'
              >
                Blog Activity
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18 th-pointer'>
                Edit Activity
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='th-bg-white py-0 mx-3'>
            <div className='row'>
              <div className='col-12 py-3'>
                <Form id='filterForm' layout={'horizontal'} ref={formRef}>
                  <div className='row align-items-center'>
                    {/* <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Sub-Activity Categories</div>
                      <Form.Item name='sub_activity'>
                        <Select
                          allowClear
                          placeholder={'Select Sub-Activity'}
                          showSearch
                          optionFilterProp='children'
                          value={subActivityName || []}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={handleSubActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {subActionTypeOption}
                        </Select>
                      </Form.Item>
                    </div> */}
                    {console.log(activityName, 'kl')}
                    <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Activity Categories</div>
                      <Form.Item name='activity_categories'>
                        <Select
                          allowClear
                          placeholder={'Select Activity'}
                          showSearch
                          optionFilterProp='children'
                          value={activityName || []}
                          defaultValue={activityName}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={handleChangeActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {actionTypeOption}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Branch</div>
                      <Form.Item name='branch'>
                        <Select
                          allowClear
                          placeholder='Select Branch'
                          mode='multiple'
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          optionFilterProp='children'
                          maxTagCount={2}
                          showArrow={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          value={selectedBranch || []}
                          onChange={(e, value) => {
                            handleBranch(e, value);
                          }}
                          // onClear={handleClearBoard}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {/* {branchDropdown.length > 1 && (
                          <>
                            <Option key={0} value={'all'}>
                              All
                            </Option>
                          </>
                        )} */}
                          {branchOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Grade</div>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder={'Select Grade'}
                          mode='multiple'
                          maxTagCount={2}
                          showArrow={2}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          showSearch
                          optionFilterProp='children'
                          value={selectedGrade || []}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleGrade(e, value);
                          }}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {gradeOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                      <div className='mb-2 text-left'>Section</div>
                      <Form.Item name='section'>
                        <Select
                          allowClear
                          mode='multiple'
                          suffixIcon={<DownOutlined className='th-grey' />}
                          maxTagCount={2}
                          showArrow={2}
                          placeholder={'Select Section'}
                          value={selectedSection || []}
                          showSearch
                          optionFilterProp='children'
                          // defaultValue={subjectName}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleSection(e, value);
                          }}
                          // onClear={handleClearSubject}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {sectionOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    {/* {physicalId ? ( */}
                    {/* <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                          <div className='mb-2 text-left'>Round</div>
                          <Form.Item name='round'>
                            <Select
                              allowClear
                              suffixIcon={<DownOutlined className='th-grey' />}
                              placeholder={'Select Round'}
                              value={selectedRound || []}
                              showSearch
                              optionFilterProp='children'
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              onChange={(event, value) => {
                                handleRound(event, value);
                              }}
                              className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                              bordered={true}
                            >
                            </Select>
                          </Form.Item>
                        </div> */}
                    {/* ) : (
                        ''
                      )} */}

                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Submission End Date</div>
                      <Form.Item name='date'>
                        <Space direction='vertical' className='w-100' size={12}>
                          <DatePicker
                            className='text-left th-date-picker th-br-4 th-bg-grey w-100 th-black-1'
                            bordered={true}
                            format={'YYYY/MM/DD'}
                            value={startDate && moment(startDate)}
                            allowClear={false}
                            onChange={(value) => handleStartDateChange(value)}
                          />
                          {/* <RangePicker
                          allowClear={false}
                          style={{ width: '105%', border: 'none' }}
                          bordered={true}
                          placement='bottomRight'
                          showToday={false}
                          suffixIcon={<DownOutlined />}
                          // defaultValue={[moment(), moment()]}
                          // value={formik?.values.date}
                          // onChange={(value) => handleDateChange(value)}
                          className='th-range-picker th-br-4 th-bg-grey'
                          separator={'-'}
                          format={'DD/MM/YYYY'}
                          getPopupContainer={(trigger) => trigger.parentNode}
                        /> */}
                        </Space>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
              <div className='col-12 py-3 px-0'>
                <div className='col-md-6 py-3 py-md-0'>
                  <span className='th-grey th-14'>Title*</span>
                  <Input
                    className='th-br-4 mt-1 th-16'
                    showCount
                    maxLength='30'
                    value={title}
                    onChange={handleTitle}
                  />
                  <div className='text-right'>
                    <span className='th-red th-12 text-right'>Max. 30 Characters</span>
                  </div>
                </div>
                <div className='col-md-6'>
                  <span className='th-grey th-14'>Description*</span>
                  <div className='th-editor py-2'>
                    <TextArea rows={5} value={description} onChange={handleDescription} />
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-1'>
              {selectedBranch?.length !== 0 && activityName?.length !== 0 ? (
                <Carousel
                  breakPoints={breakPoints}
                  showThumbs={false}
                  infiniteLoop={true}
                >
                  {templates?.map((obj, index) => {
                    const isItemSelected = isSelected(obj?.id);
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <img
                          src={obj?.template_path}
                          alt='images'
                          style={{ maxWidth: '34%' }}
                        />
                        <Checkbox
                          onChange={() => handleChange(obj?.id, obj?.id)}
                          className={classes.tickSize}
                          checked={isItemSelected}
                          color='primary'
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div>{obj?.title}</div>
                      </div>
                    );
                  })}
                </Carousel>
              ) : (
                ''
              )}
            </div>
            <div className='row mt-2'>
              <div className='col-12 px-0 py-3 d-flex'>
                <div className='col-md-2'>
                  <Button type='primary' className='w-100 th-14' onClick={goBack}>
                    Back
                  </Button>
                </div>
                <div className='col-md-2'>
                  <Button type='primary' className='w-100 th-14' onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                <div className='col-md-2'>
                  <Button
                    type='primary'
                    className='w-100 th-14'
                    disabled={user_level == 11}
                    onClick={dataPost}
                  >
                    Update Activity
                  </Button>
                </div>
              </div>
            </div>
            {/* <Dialog open={assigned} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
            <div style={{ width: '642px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                }}
              >
                <DialogTitle id='confirm-dialog'>Preview</DialogTitle>
                <div style={{ marginTop: '21px', marginRight: '34px' }}>
                  <CloseIcon style={{ cursor: 'pointer' }} onClick={closePreview} />
                </div>
              </div>

              <div
                style={{
                  border: '1px solid lightgray',
                  height: ' auto',
                  marginLeft: '16px',
                  marginRight: '32px',
                  borderRadius: '10px',
                  marginBottom: '9px',
                }}
              >
                <div style={{ marginLeft: '23px', marginTop: '28px' }}>
                  <div style={{ fontSize: '15px', color: '#7F92A3' }}>
                    Title -{activityName.name}
                  </div>
                  <div style={{ fontSize: '21px' }}>{title}</div>
                  <div style={{ fontSize: '10px', color: '#7F92A3' }}>
                    Submission on -{startDate}
                  </div>
                  <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                    Branch -&nbsp;
                    <span style={{ color: 'black' }}>
                      {selectedBranch.map((each) => (
                        <b style={{ padding: '4px', fontWeight: '500' }}>
                          {each?.children}
                        </b>
                      ))}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'gray' }}>
                    Grade -&nbsp;
                    <span style={{ color: 'black' }}>
                      {selectedGrade.map((each) => (
                        <b style={{ padding: '4px', fontWeight: '500' }}>
                          {each?.children}
                        </b>
                      ))}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'gray' }}>
                    Section -&nbsp;
                    <span style={{ color: 'black' }}>
                      {selectedSection.map((each) => (
                        <b style={{ padding: '4px', fontWeight: '500' }}>
                          {each?.children}
                        </b>
                      ))}
                    </span>
                  </div>

                  <div
                    style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}
                  ></div>
                  <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                    Instructions
                  </div>
                  <div style={{ paddingTop: '8px', fontSize: '16px' }}>{description}</div>
                  <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                    <img src={fileUrl} width='50%' />
                  </div>
                </div>
              </div>
            </div>
          </Dialog> */}
          </div>
        </div>
      </Layout>

      {/* <Layout>
        <Grid
          container
          direction='row'
          style={{ paddingLeft: '22px', paddingRight: '10px' }}
        >
          <Grid item xs={12} md={6} style={{ marginBottom: 15 }}>
            <Breadcrumb
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'
            >
              <Typography color='textPrimary' variant='h6'>
                <strong>Activity Management</strong>
              </Typography>
              <Typography color='textPrimary'>Activity</Typography>
              <Typography color='Primary'>Edit Activity</Typography>
            </Breadcrumb>
          </Grid>
        </Grid>
        <div style={{ paddingLeft: '22px', paddingRight: '10px' }}>
          <Button
            variant='primary'
            style={{ borderRadius: '1px', color: 'white' }}
            disabled
          >
            Edit Activity
          </Button>

          <Divider className={classes.dividerColor} />
        </div>
        <div
          style={{
            paddingLeft: '22px',
            paddingRight: '10px',
            paddingTop: '50px',
            fontSize: '15px',
          }}
        >
          <div
            style={{
              marginLeft: '9px',
              display: 'flex',
              justifyContent: 'space-between',
              marginRight: '6px',
            }}
          >
            <div style={{ display: 'flex' }}>
              Activity Category *:
              <Autocomplete
                style={{ marginTop: '-7px', width: '222px', marginLeft: '18px' }}
                size='small'
                onChange={handleChangeActivity}
                options={activityCategory || []}
                value={activityName || []}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} variant='outlined' />}
              />
            </div>
            <div>
              {' '}
              Submission End Date *: &nbsp;&nbsp;&nbsp;
              <TextField
                required
                size='small'
                style={{ marginTop: '-6px' }}
                onChange={(e) => handleStartDateChange(e.target.value)}
                type='date'
                value={startDate || ' '}
                variant='outlined'
              />
            </div>
          </div>
          <Grid container spacing={2} style={{ marginTop: '23px' }}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                size='small'
                limitTags={1}
                options={branchList || []}
                select
                value={selectedBranch || []}
                className='dropdownIcon'
                SelectProps={{ multiple: true }}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                onChange={(event, value) => {
                  handleBranch(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Branch'
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                limitTags={1}
                size='small'
                className='filter-student meeting-form-input'
                options={gradeList || []}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                value={selectedGrade || []}
                onChange={(event, value) => {
                  handleGrade(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Grade'
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                limitTags={1}
                size='small'
                className='filter-student meeting-form-input'
                options={sectionDropdown || []}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                value={selectedSection || []}
                onChange={(event, value) => {
                  handleSection(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Section'
                  />
                )}
              />
            </Grid>
          </Grid>
          <div
            style={{
              border: '1px solid lightgrey',
              borderRadius: '5px',
              height: 'auto',
              marginTop: '20px',
            }}
          >
            <div style={{ marginTop: '23px', marginLeft: '73px', display: 'flex' }}>
              Activity Details *: &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                id='outlined-basic'
                size='small'
                fullWidth
                value={title}
                onChange={handleTitle}
                style={{ maxWidth: '80%' }}
                label='Title'
                variant='outlined'
              />
            </div>
            <br />
            <div
              style={{
                marginLeft: '17%',
                marginRight: '8%',
                marginBottom: '23px',
              }}
            >
              <TextField
                label='Description/Instructions *'
                placeholder='Description/Instructions *'
                multiline
                value={description}
                onChange={handleDescription}
                fullWidth
                style={{ maxWidth: '100%' }}
                rows='8'
                variant='outlined'
              />
            </div>
          </div>
          <div
            style={{
              border: '1px solid lightgrey',
              borderRadius: '5px',
              height: 'auto',
              marginTop: '20px',
            }}
          >
            {selectedBranch?.length !== 0 && activityName?.length !== 0 ? (
              <Carousel breakPoints={breakPoints} showThumbs={false} infiniteLoop={true}>
                {templates?.map((obj, index) => {
                  const isItemSelected = isSelected(obj?.id);
                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <img
                        src={obj?.template_path}
                        alt='images'
                        style={{ maxWidth: '34%' }}
                      />
                      <Checkbox
                        onChange={() => handleChange(obj?.id, obj?.id)}
                        className={classes.tickSize}
                        checked={isItemSelected}
                        color='primary'
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <div>{obj?.title}</div>
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              ''
            )}
          </div>
          <div
            style={{
              marginTop: '60px',
              marginLeft: '50px',

              display: 'flex',
            }}
          >
            <Button
              variant='outlined'
              className={classes.buttonColor}
              size='medium'
              onClick={handleGoBack}
            >
              Back
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              variant='outlined'
              onClick={handleClear}
              className={classes.buttonColor1}
              size='medium'
            >
              Clear
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              variant='contained'
              color='primary'
              disabled={user_level == 11}
              onClick={dataPost}
            >
              Update Activity
            </Button>
          </div>
        </div>
      </Layout> */}
    </div>
  );
};
export default AdminEditCreateBlogs;
