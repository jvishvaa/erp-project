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
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterListIcon from '@material-ui/icons/FilterList';
// import { connect } from 'react-redux';
import { useFormik } from 'formik';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import * as Yup from 'yup';
import cuid from 'cuid';
import { useLocation } from 'react-router-dom';
import Layout from '../../Layout';
import { connect, useSelector } from 'react-redux';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import {
  fetchBranches,
  fetchGrades,
  fetchSubjects,
} from '../../lesson-plan/create-lesson-plan/apis';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './styles.scss';
import QuestionPaper from './question-paper';
import {
  addSection,
  setIsFetched,
  createQuestionPaper,
  editQuestionPaper,
  setFilter,
  resetState,
  deleteSection,
  deleteQuestionSection,
  addQuestionToSection,
} from '../../../redux/actions';

const levels = [
  { id: 1, name: 'Easy' },
  { id: 2, name: 'Average' },
  { id: 3, name: 'Difficult' },
];
const CreateQuestionPaper = ({
  sections,
  isFetched,
  initAddSection,
  setIsFetched,
  initCreateQuestionPaper,
  initEditQuestionPaper,
  initSetFilter,
  selectedAcademic,
  selectedBranch,
  erpCategory,
  selectedGrade,
  selectedSubject,
  selectedLevel,
  questionPaperName,
  initResetState,
  initDeleteSection,
  initAddQuestionToSection,
  deleteQuestionSection,
}) => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showQuestionPaper, setShowQuestionPaper] = useState(
    query.get('show-question-paper') || true
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [expandFilter, setExpandFilter] = useState(true);
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [erpCategoryDropdown, setErpcategoryDropdown] = useState([]);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [ filterData ,setFilterData ] = useState()
  const { refresh = false , isEdit} = history.location?.state || {};
  const [isErpCategory , setIsErpCategory] = useState(false)
  let preselectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);


  useEffect(() => {
    if (refresh || isEdit) {
      setIsFetched(false);
    }
  }, [refresh,isEdit]);

  useEffect(() => {
    if (Number(location.pathname.slice(23)) && !isFetched) {
      handleFetch();
    }
  }, [isFetched]);
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
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId) {
      getAcademic();
      if (formik.values.academic && moduleId) {
        getBranch(formik.values.academic?.id);
        if (formik.values.branch) {
          const branchIds =
            formik.values.branch?.map((element) => element?.branch?.id) || [];
          getGrades(formik.values.academic?.id, branchIds);
          if (formik.values.grade) {
            const acadSessionIds =
              formik.values.branch.map((element) => element?.id) || [];
            getSubjects(acadSessionIds, formik.values.grade?.grade_id);
          } else {
            setSubjects([]);
          }
        } else {
          setGrades([]);
        }
      } else {
        setBranchDropdown([]);
      }
    }
  }, [moduleId]);

  useEffect(() => {
    getErpCategory()
  },[moduleId])
//
  const formik = useFormik({
    initialValues: {
      academic: selectedAcademic,
      branch: selectedBranch,
      category : erpCategory,
      grade: selectedGrade,
      subject: selectedSubject,
      question_paper_level: selectedLevel,
      questionPaperName : questionPaperName,
    },
    onSubmit: (values) => {
      setShowQuestionPaper(true);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const getAcademic = () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  const getErpCategory = () => {
    axiosInstance
        .get(`${endpoints.questionBank.erpCategory}`)
        .then((result) => {
          setErpcategoryDropdown(result?.data?.result)
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
  }

  const getBranch = async (acadId) => {
    try {
      let data = await fetchBranches(acadId, moduleId);
      data.unshift({
        session_year: {},
        id: 'all',
        branch: { id: 'all', branch_name: 'Select All' },
      });
      // let branch = data.filter((item) => item?.id === preselectedBranch?.id)
      // handleBranch('',branch)
      setBranchDropdown(data);
    } catch (e) {
      // setAlert('error', 'Failed to fetch branch');
    }
  };

  const getGrades = async (acadId, branchIds) => {
    try {
      const data = await fetchGrades(acadId, branchIds, moduleId);
      setGrades(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch grades');
    }
  };

  const getSubjects = async (acadSessionIds, gradeId) => {
    try {
      setSubjects([]);
      const data = await fetchSubjects(acadSessionIds, gradeId);
      setSubjects(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch subjects');
    }
  };

  const handleAddSection = () => {
    let len = sections?.length || 0;
    const sectionArray = [
      {
        id: cuid(),
        name: `${String.fromCharCode(65 + len)}`,
        questions: [],
      },
    ];
    const question = { id: cuid(), sections: sectionArray };
    initAddSection(question);
  };

  const handleClearAll = () => {
    initSetFilter('selectedBranch', []);
    initSetFilter('selectedGrade', '');
    initSetFilter('selectedSubject', []);
    initSetFilter('selectedLevel', '');
    initSetFilter('erpCategory', '');
    setFilterData()
  };
  const handleClearFilters = () => {
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', {});
    formik.setFieldValue('subject', []);
    formik.setFieldValue('category', '')
    formik.setFieldValue('question_paper_level', {});
    formik.handleReset();
  };

  const handleResetQuestionPaper = () => {
    handleClearFilters();
    initResetState();
  };

  const handleDeleteSection = (questionId, section) => {
    initDeleteSection(questionId, section);
  };
  const handleEditQuestionPaper = async (isDraft) => {
    console.log(isDraft);
    try {
      const questionData = [],
        centralQuestionData = [];
      const sectionData = [];
      sections.forEach((q) => {
        q.sections.forEach((sec) => {
          const sectionObj = { [sec.name]: [], discription: sec.name };
          sec.questions.forEach((question) => {
            sectionObj[sec.name].push(question?.identifier);
            if (question?.is_central) {
              if (!centralQuestionData.includes(question.id)) {
                centralQuestionData.push(question.id, question.child_id);
              }
            } else {
              if (!questionData.includes(question.id)) {
                questionData.push(question.id, question.child_id);
              }
            }
          });
          sectionData.push(sectionObj);
        });
      });

      let reqObj = {
        academic_year: formik.values.academic?.id,
        paper_name: questionPaperName,
        grade: formik.values.grade?.grade_id,
        // academic_session: formik.values.branch.id,
        academic_session: formik.values.branch?.map((branch) => branch?.id),
        // subjects: formik.values.subject?.map((obj) => obj?.subject_id),
        paper_level: formik.values.question_paper_level?.id,
        section: sectionData,
        sections: sectionData,
        is_review: isDraft ? 'False' : 'True',
        is_draft: isDraft ? 'True' : 'False',
        is_verified: 'False',
      };
      let filterdata = {
        branch : formik.values.branch,
        academic: formik.values.academic,
        grade: formik.values.grade,
        qpValue: {
          id : formik.values.question_paper_level?.id,
          level : formik.values.question_paper_level?.name
        },
        type: { id: 1, flag: false, name: 'ERP' }
      }

      if(formik.values.category && formik.values.subject.length === 0){
        reqObj['category'] = formik.values.category?.erp_category_id
        filterdata['category'] = formik.values.category

      }
      if(!formik.values.category && formik.values.subject.length > 0){
        reqObj['subjects'] = formik.values.subject?.map((obj) => obj?.subject_id)
        filterdata['subject'] = formik.values.subject[0]

      }


      if (questionData?.length) {
        reqObj = { ...reqObj, question: questionData.flat() };
      }

      if (centralQuestionData?.length) {
        reqObj = { ...reqObj, central_question: centralQuestionData.flat() };
      }

      // if (isDraft) {
      //   reqObj.is_draft = 'True';
      //   reqObj.is_review = 'False';
      // }

      let sectionFlag = true,
        sectionName = '';

      for (let k = 0; k < sectionData.length; k++) {
        const sectionObj = sectionData[k];
        if (sectionObj[String.fromCharCode(65 + k)].length === 0) {
          sectionName = String.fromCharCode(65 + k);
          sectionFlag = false;
          break;
        }
      }
      let submitArray = {
        Section: sectionFlag,
        'Question Paper Name': questionPaperName,
        'Question Level': formik.values.question_paper_level.id,
        // Subject: formik.values.subject.length,
        Grade: formik.values.grade.grade_id,
      };
      // debugger
      // if(formik.values.category){
      //   submitArray['Category'] = formik.values.category
      // }
      // if(formik.values.subject.length){
      //   submitArray['Subject'] = formik.values.subject.length
      // }
      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;
      if (finalSubmitFlag) {
        await initEditQuestionPaper(reqObj, location.pathname.slice(23));
        sessionStorage.setItem('filter', JSON.stringify(filterdata))
        // await initEditQuestionPaper(reqObj);
        // history.push('/assessment-question');
        history.push({
          pathname: '/assessment-question',
          state: {
            isSet : 'true'
          }
        })
        setAlert('success', 'Question Paper Updated successfully');
        handleResetQuestionPaper();
      } else {
        // const checkSectionLength = isDraft ? true : sectionData.length;
        const checkSectionLength = sectionData.length;
        if (checkSectionLength) {
          for (const [key, value] of Object.entries(submitArray)) {
            if (key === 'Section' && !Boolean(value))
              setAlert('error', `Please add questions for Section-${sectionName}`);
            else if (!Boolean(value)) setAlert('error', `${key} can't be empty!`);
          }
        } else {
          setAlert('error', 'At least one section is compulsory!');
        }
      }
    } catch (e) {
      setAlert('error', 'Please Select Filters First');
    }
  };
  const handleCreateQuestionPaper = async (isDraft) => {
    try {
      const questionData = [],
        centralQuestionData = [];

      const sectionData = [];
      sections.forEach((q) => {
        q.sections.forEach((sec) => {
          const sectionObj = { [sec.name]: [], discription: sec.name };
          sec.questions.forEach((question) => {
            sectionObj[sec.name].push(question?.identifier);
            if (question?.is_central) {
              if (!centralQuestionData.includes(question.id)) {
                centralQuestionData.push(question.id, question.child_id);
              }
            } else {
              if (!questionData.includes(question.id)) {
                questionData.push(question.id, question.child_id);
              }
            }
          });
          sectionData.push(sectionObj);
        });
      });

      let reqObj = {
        academic_year: formik.values.academic?.id || selectedAcademicYear?.id,
        paper_name: questionPaperName,
        grade: formik.values.grade?.grade_id,
        academic_session: formik.values.branch?.map((branch) => branch?.id),
        paper_level: formik.values.question_paper_level?.id,
        section: sectionData,
        sections: sectionData,
        is_review: isDraft ? 'False' : 'True',
        is_draft: isDraft ? 'True' : 'False',
      };
      let filterdata = {
        branch : formik.values.branch,
        academic: formik.values.academic,
        grade: formik.values.grade,
        qpValue: {
          id : formik.values.question_paper_level?.id,
          level : formik.values.question_paper_level?.name
        },
        type: { id: 1, flag: false, name: 'ERP' }
      }

      if(formik.values.category){
        reqObj['category'] = formik.values.category?.erp_category_id
        filterdata['category'] = formik.values.category
      }
      if(formik.values.subject.length > 0){
        reqObj['subjects'] = formik.values.subject?.map((obj) => obj?.subject_id)
        filterdata['subject'] = formik.values.subject[0]

      }

      if (questionData?.length) {
        reqObj = { ...reqObj, question: questionData.flat() };
      }

      if (centralQuestionData?.length) {
        reqObj = { ...reqObj, central_question: centralQuestionData.flat() };
      }

      if (isDraft) {
        reqObj.is_draft = 'True';
        reqObj.is_review = 'False';
      }

      let sectionFlag = true,
        sectionName = '';

      for (let k = 0; k < sectionData.length; k++) {
        const sectionObj = sectionData[k];
        if (sectionObj[String.fromCharCode(65 + k)].length === 0) {
          sectionName = String.fromCharCode(65 + k);
          sectionFlag = false;
          break;
        }
      }
      let submitArray = {
        Section: sectionFlag,
        'Question Paper Name': questionPaperName,
        'Question Level': formik.values.question_paper_level.id,
        // Subject: formik.values.subject.length,
        // Category : formik.values.category.length,
        Grade: formik.values.grade.grade_id,
      };
      // if(formik.values.category){
      //   submitArray['Category'] = formik.values.category
      // }
      // if(formik.values.subject.length){
      //   submitArray['Subject'] = formik.values.subject.length
      // }
      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;

      if (finalSubmitFlag) {
        await initCreateQuestionPaper(reqObj);
        // history.push('/assessment-question');
        // sessionStorage.removeItem('filter')
        sessionStorage.setItem('filter', JSON.stringify(filterdata))
        history.push({
          pathname: '/assessment-question',
          state: {
            isSet : 'true'
          }
        })
        setAlert('success', 'Question Paper created successfully');
        handleResetQuestionPaper();
      } else {
        // const checkSectionLength = isDraft ? true : sectionData.length;
        const checkSectionLength = sectionData.length;
        if (checkSectionLength) {
          for (const [key, value] of Object.entries(submitArray)) {
            if (key === 'Section' && !Boolean(value))
              setAlert('error', `Please add questions for Section-${sectionName}`);
            else if (!Boolean(value)) setAlert('error', `${key} can't be empty!`);
          }
        } else {
          setAlert('error', 'At least one section is compulsory!');
        }
      }
    } catch (e) {
      setAlert('error', 'Failed to create Question Paper');
    }
  };

  const handleAcademicYear = (event = {}, value = '') => {
    setBranchDropdown([]);
    setGrades([]);
    setSubjects([]);
    if (value) {
      getBranch(value?.id);
      formik.setFieldValue('academic', value);
      initSetFilter('selectedAcademic', value);
    }
  };

  const handleTransformResponse = (responseQuestions, responseSections) => {
    responseSections.forEach((section, index) => {
      const sectionId = cuid();
      const key = String.fromCharCode(65 + index);
      const questionList = [];
      section[key].forEach((sectionIdentifier) =>
        responseQuestions.forEach((question) => {
          if (sectionIdentifier === question?.identifier) questionList.push(question);
        })
      );
      const sectionArray = [
        {
          id: cuid(),
          name: key,
          questions: questionList,
        },
      ];
      const sectionObject = { id: sectionId, sections: sectionArray };
      initAddSection(sectionObject);
    });
  };

  const handleFetch = () => {
    setIsFetched(true);
    let data = Number(location.pathname.slice(23));
    const url = endpoints.assessmentErp?.questionPaperViewMore.replace(
      '<question-paper-id>',
      data
    );
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          initSetFilter('questionPaperName', result.data.result.paper_name);
          setFilterData(result.data.result)
          const { questions: responseQuestions = [], sections: responseSections = [] } =
            result.data.result || {};
          handleTransformResponse(responseQuestions, responseSections); //for edit question-paper
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };



  useEffect(() => {
    console.log(filterData);
    if(filterData?.academic_session){
     let branchVal =  [...branchDropdown].filter((i) => filterData?.academic_session.includes(i?.id))
     console.log(branchVal);
     handleBranch(filterData?.academic_session , branchVal)

    //  branchVal.map((item , index) => {
    //    handleBranch(filterData , item)
    //  })
    }
  },[branchDropdown , filterData])


  useEffect(() => {
    if(filterData?.grade && formik.values.branch){
      let gradeVal = [...grades].filter((i) => filterData?.grade == i?.grade_id)
      console.log(gradeVal);
      handleGrade(filterData , gradeVal[0])
    }

  },[grades , filterData])

  useEffect(()=>{
    if(filterData?.category ){
      let categoryVal = erpCategoryDropdown.filter((i) => filterData?.category == i?.erp_category_id)
      console.log(categoryVal,'categoryVal')
      handleerpCategory(filterData, categoryVal[0])
    }
  },[filterData, erpCategoryDropdown])

  useEffect(() => {
    if(filterData?.subject?.length ){
      let subjectVal = [...subjects].filter((i) => filterData?.subject.includes(i?.subject_id))
      console.log(subjectVal);
      handleSubject(filterData , subjectVal)
    }
    if(filterData?.paper_name){
      initSetFilter(
        'questionPaperName',
        filterData?.paper_name.replace(/\b(\w)/g, (s) => s.toUpperCase())
      )
      formik.setFieldValue('questionPaperName', filterData?.paper_name.replace(/\b(\w)/g, (s) => s.toUpperCase()))
    }
    if(filterData?.question_level){
    let levelVal = [...levels].filter((i) => filterData?.question_level == i?.id)
      console.log(levelVal);
      handleLevel(filterData , levelVal[0])
    }
  },[subjects , filterData])

  const handleBranch = (event, value) => {
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', {});
    formik.setFieldValue('subject', []);
    initSetFilter('selectedBranch', []);
    initSetFilter('selectedGrade', '');
    initSetFilter('selectedSubject', []);
    setGrades([]);
    setSubjects([]);
    if (value?.length > 0) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchDropdown].filter(({ id }) => id !== 'all')
          : value;
      const branchIds = value.map((element) => element?.branch?.id) || [];
      getGrades(formik.values.academic?.id, branchIds);
      formik.setFieldValue('branch', value);
      initSetFilter('selectedBranch', value);
    }
  };

  const handleerpCategory = (e,value) => {
    formik.setFieldValue('category', '');
    initSetFilter('erpCategory', '');
    formik.setFieldValue('subject', []);
    initSetFilter('selectedSubject', []);   
     setIsErpCategory(false)
    if (value) {
      setIsErpCategory(true) 
      formik.setFieldValue('category', value);
      initSetFilter('erpCategory', value);
      formik.setFieldValue('subject', []);
      initSetFilter('selectedSubject', []);
    }
}
  const handleSubmitPaper = (e ) => {
    console.log(e)
    if (Number(location.pathname.slice(23))) {
      handleEditQuestionPaper(e);
    } else handleCreateQuestionPaper(e);
  };
  const handleGrade = (event, value) => {
    formik.setFieldValue('grade', {});
    formik.setFieldValue('subject', []);
    initSetFilter('selectedGrade', '');
    initSetFilter('selectedSubject', []);
    setSubjects([]);
    if (value) {
      const acadSessionIds = formik.values.branch.map((element) => element?.id) || [];
      getSubjects(acadSessionIds, value?.grade_id);
      formik.setFieldValue('grade', value);
      initSetFilter('selectedGrade', value);
    }
  };

  const handleLevel = (event , value) => {
    formik.setFieldValue('question_paper_level', value);
    initSetFilter('selectedLevel', value);
  }

  const handleSubject = (event, value) => {
    formik.setFieldValue('subject', []);
    initSetFilter('selectedSubject', []);
    formik.setFieldValue('category', '');
    // initSetFilter('erpCategory', '');
    if (value.length > 0) {
      formik.setFieldValue('subject', value);
      initSetFilter('selectedSubject', value);
      formik.setFieldValue('category', '');
      // initSetFilter('erpCategory', '');
    }
  };

  const handleQuestionPaper = (e) => {
    initSetFilter(
      'questionPaperName',
      e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase())
    )
    formik.setFieldValue('questionPaperName', e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase()))
  }

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Assessment'
        childComponentName='Question Paper'
        childComponentNameNext='Create New'
        isAcademicYearVisible={true}
      />
      <div className='create-question-paper-container'>
        <div className='content-container'>
          <Accordion
            className='collapsible-section'
            square
            expanded={expandFilter}
            onChange={() => {}}
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='branch'
                      name='branch'
                      className='dropdownIcon'
                      multiple
                      limitTags={2}
                      onChange={handleBranch}
                      getOptionSelected={(option, value) => option?.id === value?.id}
                      value={selectedBranch || []}
                      options={branchDropdown || []}
                      getOptionLabel={(option) => option?.branch?.branch_name}
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
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.branch ? formik.errors.branch : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleerpCategory}
                      id='Category'
                      className='dropdownIcon'
                      value={erpCategory || {}}
                      options={erpCategoryDropdown || []}
                      getOptionLabel={(option) => option?.erp_category_name || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='ERP Category'
                          placeholder='ERP Category'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='grade'
                      name='grade'
                      className='dropdownIcon'
                      onChange={handleGrade}
                      value={selectedGrade || {}}
                      options={grades || []}
                      getOptionLabel={(option) => option?.grade__grade_name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Grade'
                          placeholder='Grade'
                          required
                        />
                      )}
                      size='small'
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.grade ? formik.errors.grade : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {(!erpCategory)  && <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='subject'
                      name='subject'
                      onChange={handleSubject}
                      multiple
                      limitTags={2}
                      getOptionSelected={(option, value) => option?.id === value?.id}
                      className='dropdownIcon'
                      value={selectedSubject || {}}
                      options={subjects || []}
                      getOptionLabel={(option) => option?.subject_name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Subject'
                          placeholder='Subject'
                          required
                        />
                      )}
                      size='small'
                    />
                    {/* <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.subject ? formik.errors.subject : ''}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>}

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='question_paper_level'
                      name='question_paper_level'
                      // onChange={(e, value) => {
                      //   formik.setFieldValue('question_paper_level', value);
                      //   initSetFilter('selectedLevel', value);
                      // }}
                      onChange={handleLevel}
                      value={selectedLevel}
                      options={levels || []}
                      className='dropdownIcon'
                      getOptionLabel={(option) => option.name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Question Paper Level'
                          placeholder='Question Paper Level'
                          required
                        />
                      )}
                      size='small'
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.question_paper_level
                        ? formik.errors.question_paper_level
                        : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              {/* </div> */}
            </AccordionDetails>
          </Accordion>
          <div className='divider-container'>
            <Divider />
          </div>
          <div className='form-actions-container mv-20'>
            <div className='btn-container' style={{ marginRight: '1%' }}>
              <Button
                variant='contained'
                className='cancelButton labelColor'
                style={{ width: '100%' }}
                onClick={() => {
                  setFilterData();
                  history.push({
                    pathname: '/assessment-question',
                    state: {
                      isSet: isEdit ? 'true' :  'false',
                    },
                  });
                }}
              >
                Back
              </Button>
            </div>
            <div className='btn-container'>
              <Button
                variant='contained'
                className='cancelButton labelColor'
                style={{ width: '100%' }}
                onClick={() => {
                  handleClearAll();
                  formik.handleReset();
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
          {showQuestionPaper && (
            <QuestionPaper
              grade={formik.values.grade?.grade__grade_name}
              subject={formik.values.subject
                .map(({ subject_name }) => subject_name)
                .join(', ')}
              level={formik.values.question_paper_level?.name}
              sections={sections}
              handleAddSection={handleAddSection}
              onCreateQuestionPaper={handleSubmitPaper}
              updateQuesionPaper={Number(location.pathname.slice(23))}
              onChangePaperName={
                (e) => handleQuestionPaper(e)

                // initSetFilter(
                //   'questionPaperName',
                //   e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase())
                // )
              }
              // questionPaperName={questionPaperName}
              questionPaperName={formik.values.questionPaperName}
              onDeleteSection={handleDeleteSection}
              onDeleteQuestion={deleteQuestionSection}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  sections: state.createQuestionPaper.questions,
  isFetched: state.createQuestionPaper.isFetched,
  selectedAcademic: state.createQuestionPaper.selectedAcademic,
  selectedBranch: state.createQuestionPaper.selectedBranch,
  erpCategory : state.createQuestionPaper.erpCategory,
  selectedGrade: state.createQuestionPaper.selectedGrade,
  selectedSubject: state.createQuestionPaper.selectedSubject,
  selectedLevel: state.createQuestionPaper.selectedLevel,
  questionPaperName: state.createQuestionPaper.questionPaperName,
});

const mapDispatchToProps = (dispatch) => ({
  initAddSection: (section) => {
    dispatch(addSection(section));
  },
  setIsFetched: (isFetched) => {
    dispatch(setIsFetched(isFetched));
  },
  initCreateQuestionPaper: (data) => dispatch(createQuestionPaper(data)),
  initEditQuestionPaper: (data, url) => dispatch(editQuestionPaper(data, url)),
  initSetFilter: (filter, data) => dispatch(setFilter(filter, data)),
  initResetState: () => dispatch(resetState()),
  initDeleteSection: (questionId, sectionId) =>
    dispatch(deleteSection(questionId, sectionId)),
  deleteQuestionSection: (questionId, sectionId) =>
    dispatch(deleteQuestionSection(questionId, sectionId)),
  initAddQuestionToSection: (question, questionId, section) => {
    dispatch(addQuestionToSection(question, questionId, section));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionPaper);
