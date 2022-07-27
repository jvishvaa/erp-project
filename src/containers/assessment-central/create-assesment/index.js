/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  Button,
  SvgIcon,
  Switch,
} from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import cuid from 'cuid';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { fetchGrades, fetchSubjects } from '../../lesson-plan/create-lesson-plan/apis';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {
  setFilterForCreateAssesment,
  fetchQuestionPaperDetails,
  createAssesment,
  changeTestFormField,
  fetchAssesmentTypes,
  resetFormState,
} from '../../../redux/actions';
import Loader from './../../../components/loader/loader';
import './styles.scss';
import AssesmentTest from './assesment-test';

const testTypes = [
  { id: 1, name: 'Online' },
  { id: 2, name: 'Offline' },
];

const CreateAssesment = ({
  initSetFilter,
  selectedQuestionPaper,
  selectedTestType,
  initFetchQuestionPaperDetails,
  questionPaperDetails,
  fetchingQuestionPaperDetails,
  initCreateAssesment,
  initChangeTestFormFields,
  initialTestName,
  initialTestDate,
  initialTestDuration,
  initialTestId,
  initialTestInstructions,
  initialTotalMarks,
  initQuestionsLength,
  initResetFormState,
}) => {
  const [CentralFilter,setCentralFilter] = useState(false)
  const [flag,setFlag] = useState(false);
  const [branch,setBranch] = useState([])
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [branchId,setBranchId] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const clearForm = query.get('clear');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [expandFilter, setExpandFilter] = useState(true);
  const [marksAssignMode, setMarksAssignMode] = useState(false);
  const [testMarks, setTestMarks] = useState([]);
  const [testName, setTestName] = useState(initialTestName);
  const [testId, setTestId] = useState(initialTestId);
  const [testDate, setTestDate] = useState(initialTestDate);
  const [instructions, setInstructions] = useState(initialTestInstructions);
  const [testDuration, setTestDuration] = useState(initialTestDuration);
  const [totalMarks, setTotalmarks] = useState(initialTotalMarks);
  const [paperchecked, setChecked] = React.useState(true);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [assesmentTypes, setAssesmentTypes] = useState([]);
  const [sectionToggle, setSectionToggle] = useState(false);
  const [gradeId, setGradeId] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionMappingId, setSelectedSectionMappingId] = useState([]);
  const [selectedSectionData, setSelectedSectionData] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState({});
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [branchFromErp, setBranchFromErp] = useState([]);
  const [branchIdFromErp, setBranchIdFromErp] = useState([]);
  const [selectedBranchId,setSelectedBranchId] = useState([])
  const [groupList,setGroupList] = useState([])
  const [groupSectionMappingId,setGroupSectionMappingId] = useState([])
  const [loading, setLoading] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const formik = useFormik({
    initialValues: {
      test_mode: '',
      test_type: '',
    },
    onSubmit: (values) => { },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const resetForm = () => {
    setTestName('');
    setTestId('');
    setInstructions('');
    setTestDate('');
    setTestDuration('');
    setTotalmarks('');
    setTestMarks([]);
    initResetFormState();
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Question Paper') {
              setModuleId(item?.child_id);
            }
          });
        }
      });
    }
  }, []);
  const getAssesmentTypes = async () => {
    try {
      const data = await fetchAssesmentTypes();
      setAssesmentTypes(data);
      formik.setFieldValue('test_type', data);
    } catch (e) { }
  };
  // useEffect(() => {
  //   if (moduleId) {
  //     getAcademic();
  //   }
  //   getAssesmentTypes();
  // }, [moduleId]);

  useEffect(() => {
    if(selectedQuestionPaper?.is_central && moduleId){
      setCentralFilter(true)
      axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const selectAllObject = {
            session_year: {},
            id: 'all',
            branch: { id: 'all', branch_name: 'Select All' },
          };
          const data = [selectAllObject,...result?.data?.data?.results];
          setBranchDropdown(data);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
    }
  },[selectedQuestionPaper?.is_central, moduleId]);

  const getSection = (gradeID) => {
    let branchID = selectedQuestionPaper?.is_central ? branchId : branchIdFromErp
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.sectionsV2}?acad_session=${
          branchID}&grade=${gradeID}&is_central=${selectedQuestionPaper?.is_central}`
      )
      .then((res) => {
        if (res?.data?.status_code == 200) {
          const transformData = res?.data?.result.map((item) => ({
            section_name: item.section_name,
            id: item.id,
          }));
          transformData.unshift({
            section_name: 'Select All',
            id: 'all',
          });
          setSectionList(transformData);
        } else {
          setSectionList([]);
        }
        setLoading(false);
      })
      .finally((e) => setLoading(false));
  };

  useEffect(() => {
    if (selectedQuestionPaper && !selectedQuestionPaper?.is_central && moduleId && branchIdFromErp) {
      getSection(selectedQuestionPaper?.grade);
    }
  }, [branchIdFromErp]);

  useEffect(()=>{
    if(branch.length>0){
      getSection(selectedQuestionPaper?.grade)
    }
  },[branch])

  const handleSection = (e, value) => {
    if (value.length) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedSectionData(value);
      setSelectedSectionMappingId(value.map((i) => i.id));
    } else {
      setSelectedSectionData([]);
      setSelectedSectionMappingId([]);
    }
  };

  const getGroup = () => {
    let acadId = selectedQuestionPaper?.is_central ? branchId : selectedQuestionPaper?.academic_session
    axiosInstance.get(`${endpoints.assessmentErp.getGroups}?acad_session=${acadId}&grade=${selectedQuestionPaper?.grade}&is_active=${true}&group_type=${1}`).then((result)=>{
      if(result?.status === 200){
        setGroupList(result?.data)
      }
    })
  }

  useEffect(()=>{
    if(selectedQuestionPaper){
      getGroup()
    }
  },[selectedQuestionPaper,branchId])

  const handleGroup = (e, value) => {
    setSelectedGroupData({});
    setSelectedGroupId('');
    if (value) {
      const sections = value?.group_section_mapping.map((i)=>i?.section_mapping_id)
      setGroupSectionMappingId(sections)
      setSelectedGroupData(value);
      setSelectedGroupId(value?.id);
    }
  };

  useEffect(() => {
    if (clearForm) {
      resetForm();
    }
  }, [clearForm]);
  const handleCreateAssesmentTest = async () => {
    const qMap = new Map();

    if(CentralFilter === true && flag !== true){
      setAlert('warning', 'Please Select Branch');
      return;
    }
    if (totalMarks < 0 || totalMarks > 1000) {
      setAlert('warning', 'Please enter valid marks.');
      return;
    }

    if (testDuration < 0 || testDuration > 1441) {
      setAlert('warning', 'Please enter valid duration.');
      return;
    }
    if (!instructions.length) {
      return setAlert('warning', 'Please Enter Test Instruction ');
    }

    if (!selectedQuestionPaper?.id) {
      setAlert('warning', 'Please add a question paper.');
      return;
    }

    if (!formik.values.test_type?.id) {
      setAlert('error', 'Select Assessment Type');
      return;
    }
    if (!formik.values.test_mode?.id) {
      setAlert('error', 'Select Test Mode');
      return;
    }
    if (!sectionToggle && selectedSectionMappingId.length === 0) {
      setAlert('error', 'Please Select Section');
      return;
    }
    if (sectionToggle && groupSectionMappingId.length === 0) {
      setAlert('error', 'Please Select Group');
      return;
    }

    testMarks.forEach((obj) => {
      const { parentQuestionId } = obj;
      if (parentQuestionId) {
        if (qMap.has(parentQuestionId)) {
          qMap.set(parentQuestionId, [...qMap.get(parentQuestionId), obj]);
        } else {
          qMap.set(parentQuestionId, [obj]);
        }
      }
    });
    let testMarksArr = testMarks;
    qMap.forEach((value, key) => {
      const totalQuestionMarks = value.reduce(
        (acc, currValue) => {
          acc[0] += currValue.question_mark[0];
          acc[1] += currValue.question_mark[1];
          return acc;
        },
        [0, 0]
      );

      const totalAnswerMarks = [0, 0];

      value.forEach((obj) => {
        const childMarks = obj.child_mark.reduce(
          (acc, currValue) => {
            acc[0] += currValue[Object.keys(currValue)[0]][0];
            acc[1] += currValue[Object.keys(currValue)[0]][1];
            return acc;
          },
          [0, 0]
        );
        totalAnswerMarks[0] += childMarks[0];
        totalAnswerMarks[1] += childMarks[1];
      });

      const finalMarksForParentQuestion = !totalQuestionMarks[0]
        ? totalAnswerMarks
        : totalQuestionMarks;

      const parentQuestionObj = {
        question_id: key,
        question_mark: finalMarksForParentQuestion,
        mark_type: '1',
        child_mark: [],
        is_central: null,
      };

      const parentIndex = testMarksArr.findIndex((q) => q.question_id === key);

      if (parentIndex !== -1) {
        setTestMarks([
          ...testMarksArr.slice(0, parentIndex),
          parentQuestionObj,
          ...testMarksArr.slice(parentIndex + 1),
        ]);
        testMarksArr = [
          ...testMarksArr.slice(0, parentIndex),
          parentQuestionObj,
          ...testMarksArr.slice(parentIndex + 1),
        ];
      } else {
        setTestMarks([...testMarksArr, parentQuestionObj]);
        testMarksArr = [...testMarksArr, parentQuestionObj];
      }
    });

    if (!paperchecked) {
      if (testMarksArr.length < initQuestionsLength) {
        setAlert('error', 'Please enter marks for every question!');
        return;
      }
      if (testMarksArr?.length === initQuestionsLength) {
        for (let i = 0; i < testMarksArr.length; i++) {
          if (+testMarksArr[i]?.question_mark[0] < 1) {
            setAlert(
              'error',
              `Marks for a question should be more than 1 or equal to 1.`
            );
            return;
          }
          if (+testMarksArr[i]?.question_mark[1] < 0) {
            setAlert(
              'error',
              `Negative Marks for a question should be more than 0 or equal to 0.`
            );
            return;
          }
        }
      }
    }

    if (paperchecked) {
      if (totalMarks <= 0) {
        setAlert('error', 'Total marks should be greater than zero!');
        return;
      }
    }

    let reqObj = {
      question_paper: selectedQuestionPaper?.id,
      test_id: testId,
      test_name: testName,
      total_mark: totalMarks,
      test_date: testDate,
      test_mode: formik.values.test_mode?.id,
      test_type: formik.values.test_type?.id,
      test_duration: testDuration,
      instructions,
      descriptions: 'Assessment',
      is_question_wise: !paperchecked,
      grade: selectedQuestionPaper['grade'],
      subjects: selectedQuestionPaper['subjects'],
      acad_session: CentralFilter === true ? branchId : selectedQuestionPaper['academic_session'],
      is_central: selectedQuestionPaper['is_central'],
    };

    if (!paperchecked) {
      reqObj = { ...reqObj, test_mark: testMarksArr };
    }
    if(!sectionToggle && selectedSectionData?.length > 0){
      reqObj = {...reqObj,section_mapping : selectedSectionMappingId}
    }
    if(sectionToggle && groupSectionMappingId.length>0){
      reqObj = {...reqObj,
      "has_sub_groups" : true,
      'group_id' : selectedGroupId,
      'section_mapping' : groupSectionMappingId
      }
    }

    try {
      const { results = {} } = (await initCreateAssesment(reqObj)) || {};
      if (results?.status_code === 200) {
        setAlert('success', results?.message);
        resetForm();
        history.push('/assesment');
      } else {
        setAlert('error', results?.message);
      }
    } catch (e) {
      setAlert('error', 'Test creation failed');
    }
  };

  const handleChangeTestMarks = (
    questionId,
    isQuestion,
    field,
    value,
    // option,
    // parentQuestionId,
    isCentral
  ) => {
    const changedQuestionIndex = testMarks.findIndex((q) => {
      return q.question_id === questionId;
    });
    const changedQuestion = testMarks[changedQuestionIndex];
    if (isQuestion) {
      if (changedQuestionIndex == -1) {
        const obj = {
          question_id: questionId,
          question_mark: [0, 0],
          mark_type: '1',
          child_mark: [],
          is_central: isCentral,
        };
        // if (parentQuestionId) {
        //   obj.parentQuestionId = parentQuestionId;
        // }
        if (field === 'Assign marks') {
          obj.question_mark[0] = value;
        } else {
          obj.question_mark[1] = value;
        }
        setTestMarks((prev) => [...prev, obj]);
      } else {
        if (field === 'Assign marks') {
          changedQuestion.question_mark[0] = value;
          changedQuestion.question_mark[1] = 0;
        } else {
          if (+value > +changedQuestion.question_mark[0]) {
            setAlert('error', 'Enter less than Assign marks');
            return;
          }
          changedQuestion.question_mark[1] = value;
        }
        // if (parentQuestionId) {
        //   changedQuestion.parentQuestionId = parentQuestionId;
        // }
        setTestMarks((prev) => [
          ...prev.slice(0, changedQuestionIndex),
          changedQuestion,
          ...prev.slice(changedQuestionIndex + 1),
        ]);
      }
    }
    // else {
    //   if (changedQuestionIndex == -1) {
    //     const obj = {
    //       question_id: questionId,
    //       question_mark: [0, 0],
    //       mark_type: '1',
    //       child_mark: [],
    //       is_central:isCentral,
    //     };
    //     if (parentQuestionId) {
    //       obj.parentQuestionId = parentQuestionId;
    //     }
    //     if (field === 'Assign marks') {
    //       obj.child_mark[0] = { [option]: [value, 0] };
    //     } else {
    //       obj.child_mark[0] = { [option]: [0, value] };
    //     }
    //     setTestMarks((prev) => [...prev, obj]);
    //   } else {
    //     const optionIndex = changedQuestion.child_mark.findIndex((child) =>
    //       Object.keys(child).includes(option)
    //     );

    //     if (optionIndex === -1) {
    //       if (field === 'Assign marks') {
    //         changedQuestion.child_mark.push({ [option]: [value, 0] });
    //       } else {
    //         changedQuestion.child_mark.push({ [option]: [0, value] });
    //       }
    //     } else {
    //       if (field === 'Assign marks') {
    //         changedQuestion.child_mark[optionIndex][option][0] = value;
    //       } else {
    //         changedQuestion.child_mark[optionIndex][option][1] = value;
    //       }
    //     }
    //     if (parentQuestionId) {
    //       changedQuestion.parentQuestionId = parentQuestionId;
    //     }
    //     setTestMarks((prev) => [
    //       ...prev.slice(0, changedQuestionIndex),
    //       changedQuestion,
    //       ...prev.slice(changedQuestionIndex + 1),
    //     ]);
    //   }
    // }
  };

  const handleMarksAssignModeChange = (e) => {
    setMarksAssignMode(e.target.checked);
  };

  const handleBranch = (event,value) => {
    setFlag(false)
    setBranch([])
    if(value?.length > 0){
      value =
      value.filter(({ id }) => id === 'all').length === 1
        ? [...branchDropdown].filter(({ id }) => id !== 'all')
        : value;
      const branchIds = value.map((element) => element?.id) || [];
      const selectedbranch = value.map((element) => element?.branch?.id) || [];
      setBranchId(branchIds)
      setSelectedBranchId(selectedbranch)
      setBranch(value)
      setFlag(true)
      setSelectedSectionData([])
      setSelectedSectionMappingId([])
    }
  };
  const getBranch = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let data = result?.data?.data?.results;
          let filterBranch = data.filter(
            (item) => selectedQuestionPaper?.academic_session.indexOf(item?.id) !== -1
          );
          let ids = filterBranch.map((i) => i?.id);
          setBranchFromErp(filterBranch);
          setBranchIdFromErp(ids);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      })
      .finally((e) => setLoading(false));
  };
  useEffect(() => {
    if (selectedQuestionPaper && !selectedQuestionPaper?.is_central && moduleId) {
      getBranch();
    }
  }, [selectedQuestionPaper,moduleId]);
  useEffect(() => {
    if (selectedQuestionPaper) {
      // initFetchQuestionPaperDetails(3);
      initFetchQuestionPaperDetails(selectedQuestionPaper?.id, selectedQuestionPaper);
    }
    getAssesmentTypes();
    // initFetchQuestionPaperDetails(3);
  }, [selectedQuestionPaper]);

  const handleSectionToggle = (event) => {
    setSectionToggle(event.target.checked);
    setSelectedGroupData({})
    setGroupSectionMappingId([])
    setSelectedGroupId('')
    setSelectedSectionData([])
    setSelectedSectionMappingId([])
  };
  return (
    <Layout>
      {loading && <Loader />}
      <div className='create-assesment-container'>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Create Test'
          isAcademicYearVisible={true}
        />
        <div className='content-container'>
          <Accordion
            className='collapsible-section'
            square
            expanded={expandFilter}
            onChange={() => { }}
          >
            <AccordionSummary>
              <div className='header mv-20'>
                {!expandFilter ? (
                  <IconButton
                    onClick={() => {
                      setExpandFilter(true);
                    }}
                  >
                    {!isMobile && (
                      <Typography
                        component='h4'
                        color='secondary'
                        style={{ marginRight: '5px' }}
                      >
                        Expand Filter
                      </Typography>
                    )}
                    <FilterListIcon color='secondary' />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setExpandFilter(false);
                    }}
                  >
                    {!isMobile && (
                      <Typography
                        component='h4'
                        color='secondary'
                        style={{ marginRight: '5px' }}
                      >
                        Close Filter
                      </Typography>
                    )}
                    <FilterListIcon color='secondary' />
                  </IconButton>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className='form-grid-container'>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <FormControl variant='outlined' style={{ display: 'flex' }}>
                      <Grid container spacing={1} direction='row'>
                        <Grid item xs={12} md={4}>
                          <Autocomplete
                            id='branch'
                            name='branch'
                            onChange={(e, value) => {
                              formik.setFieldValue('test_mode', value);
                              initSetFilter('selectedTestType', value);
                            }}
                            value={formik.values.test_mode}
                            options={testTypes}
                            className='dropdownIcon'
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant='outlined'
                                label='Test Mode'
                                placeholder='Test Mode'
                                required
                              />
                            )}
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Autocomplete
                            id='assesment_type'
                            name='assesment_type'
                            className='dropdownIcon'
                            onChange={(e, value) => {
                              formik.setFieldValue('test_type', value);
                            }}
                            value={formik.values.test_type}
                            options={assesmentTypes}
                            getOptionLabel={(option) => option.exam_name || ''}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant='outlined'
                                label='Assessment Type'
                                placeholder='Assessment Type'
                                required
                              />
                            )}
                            size='small'
                          />
                        </Grid>
                        {CentralFilter === true ? (
                          <Grid item xs={12} md={4}>
                            <Autocomplete
                              id='branch_name'
                              name='branch_name'
                              multiple
                              limitTags={2}
                              className='dropdownIcon'
                              onChange={handleBranch}
                              value={branch || []}
                              options={branchDropdown || []}
                              getOptionLabel={(option) =>
                                option?.branch?.branch_name || ''
                              }
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Branch'
                                  placeholder='Branch'
                                  required
                                />
                              )}
                              size='small'
                            />
                          </Grid>
                        ) : (
                          ''
                        )}
                        {(selectedQuestionPaper && !selectedQuestionPaper.is_central) && (
                          <Grid item xs={12} md={4}>
                            <Autocomplete
                              id='branch_name'
                              name='branch_name'
                              multiple
                              limitTags={2}
                              className='dropdownIcon'
                              // onChange={handleBranch}
                              disabled
                              value={branchFromErp || []}
                              options={[]}
                              getOptionLabel={(option) =>
                                option?.branch?.branch_name || ''
                              }
                              // filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Branch'
                                  placeholder='Branch'
                                  required
                                />
                              )}
                              size='small'
                            />
                          </Grid>
                        )}
                      </Grid>
                      {selectedQuestionPaper &&(
                        <Grid container alignItems='center' style={{ marginTop: 15 }}>
                        <Grid
                          container
                          alignItems='center'
                          justifyContent='center'
                          xs={12}
                          md={4}
                        >
                          <Typography>Section</Typography>
                          <Switch
                            checked={sectionToggle}
                            onChange={handleSectionToggle}
                            color='default'
                            inputProps={{ 'aria-label': 'checkbox with default color' }}
                          />
                          <Typography>Group</Typography>
                        </Grid>
                        {sectionToggle ? (
                          <Grid item xs={12} md={4}>
                            <Autocomplete
                              id='Group'
                              name='group'
                              // multiple
                              // limitTags={2}
                              className='dropdownIcon'
                              onChange={handleGroup}
                              value={selectedGroupData || []}
                              options={groupList || []}
                              getOptionLabel={(option) => option?.group_name || ''}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Group'
                                  placeholder='Group'
                                  required
                                />
                              )}
                              size='small'
                            />
                          </Grid>
                        ) : (
                          <Grid item xs={12} md={4}>
                            <Autocomplete
                              id='section_name'
                              name='section_name'
                              multiple
                              limitTags={2}
                              className='dropdownIcon'
                              onChange={handleSection}
                              value={selectedSectionData || []}
                              options={sectionList || []}
                              getOptionLabel={(option) =>
                                option?.section_name || ''
                              }
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Section'
                                  placeholder='Section'
                                  required
                                />
                              )}
                              size='small'
                            />
                          </Grid>
                        )}
                      </Grid>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>

          <div className='divider-container'>
            <Divider />
          </div>
          <AssesmentTest
            questionPaper={questionPaperDetails}
            onMarksAssignModeChange={handleMarksAssignModeChange}
            marksAssignMode={marksAssignMode}
            onChangeTestMarks={handleChangeTestMarks}
            testMarks={testMarks}
            onCreate={handleCreateAssesmentTest}
            testName={testName}
            testId={testId}
            testDuration={testDuration}
            testDate={testDate}
            testInstructions={instructions}
            totalMarks={totalMarks}
            onTestNameChange={(value) => {
              setTestName(value);
              initChangeTestFormFields('testName', value);
            }}
            onTestIdChange={(value) => {
              setTestId(value);
              initChangeTestFormFields('testId', value);
            }}
            onInstructionsChange={(value) => {
              const WORDS = value.split(' ');

              const MAX_WORDS = WORDS.length;
              const MAX_LENGTH = 500;
              if (MAX_WORDS <= MAX_LENGTH) {
                setInstructions(value);
                initChangeTestFormFields('testInstructions', value);
              } else {
                // editor.setContent(value);
                setInstructions(instructions);
                setAlert('error', 'Maximum word limit reached!');
              }
              // setInstructions(value);
            }}
            onTestDateChange={(value) => {
              setTestDate(value);
              initChangeTestFormFields('testDate', value);
            }}
            onTestDurationChange={(value) => {
              setTestDuration(value);
              initChangeTestFormFields('testDuration', value);
            }}
            onTotalMarksChange={(value) => {
              setTotalmarks(value);
              initChangeTestFormFields('totalMarks', value);
            }}
            paperchecked={paperchecked}
            setChecked={setChecked}
          />
        </div>
      </div>
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  selectedBranch: state.createAssesment.selectedBranch,
  selectedGrade: state.createAssesment.selectedGrade,
  selectedSubject: state.createAssesment.selectedSubject,
  selectedTestType: state.createAssesment.selectedTestType,
  selectedQuestionPaper: state.createAssesment.selectedQuestionPaper,
  questionPaperDetails: state.createAssesment.questionPaperDetails,
  fetchingQuestionPaperDetails: state.createAssesment.fetchingQuestionPaperDetails,
  initialTestName: state.createAssesment.testName,
  initialTestId: state.createAssesment.testId,
  initialTestDuration: state.createAssesment.testDuration,
  initialTestDate: state.createAssesment.testDate,
  initialTestInstructions: state.createAssesment.testInstructions,
  initialTotalMarks: state.createAssesment.totalMarks,
  initQuestionsLength: state.createAssesment.questionsLength,
});
const mapDispatchToProps = (dispatch) => ({
  initSetFilter: (filter, data) => dispatch(setFilterForCreateAssesment(filter, data)),
  initFetchQuestionPaperDetails: (id, data) => dispatch(fetchQuestionPaperDetails(id, data)),
  initCreateAssesment: (data) => dispatch(createAssesment(data)),
  initChangeTestFormFields: (field, data) => dispatch(changeTestFormField(field, data)),
  initResetFormState: () => dispatch(resetFormState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAssesment);
