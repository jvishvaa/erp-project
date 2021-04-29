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
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import cuid from 'cuid';
import { useLocation } from 'react-router-dom';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import {
  fetchAcademicYears,
  fetchBranches,
  fetchGrades,
  fetchSubjects,
} from '../../lesson-plan/create-lesson-plan/apis';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import productIcon from '../../../assets/images/product-icons.svg';
import infoicon from '../../../assets/images/infoicon.svg';
import minimize from '../../../assets/images/minimize.svg';
import maximize from '../../../assets/images/maximize.svg';

import './styles.scss';
import QuestionPaper from './question-paper';
import {
  addQuestion,
  createQuestionPaper,
  setFilter,
  resetState,
  deleteSection,
  deleteQuestionSection,
} from '../../../redux/actions';

const levels = [
  { id: 1, name: 'Easy' },
  { id: 2, name: 'Average' },
  { id: 3, name: 'Difficult' },
];
const CreateQuestionPaper = ({
  questions,
  initAddQuestion,
  initCreateQuestionPaper,
  initSetFilter,
  selectedAcademic,
  selectedBranch,
  selectedGrade,
  selectedSubject,
  selectedLevel,
  questionPaperName,
  initResetState,
  initDeleteSection,
  deleteQuestionSection,
}) => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showQuestionPaper, setShowQuestionPaper] = useState(
    query.get('show-question-paper') || true
  );
  const [expandFilter, setExpandFilter] = useState(true);
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

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
    if (formik.values.academic) {
      getBranch(formik.values.academic?.id);
      if (formik.values.branch) {
        getGrades(formik.values.branch?.branch?.id);
        if (formik.values.grade) {
          getSubjects(formik.values.grade?.grade_id);
        } else {
          setSubjects([]);
        }
      } else {
        setGrades([]);
      }
    } else {
      setBranchDropdown([]);
    }
  }, []);

  useEffect(() => {
    if (moduleId) {
      getAcademic();
    }
  }, [moduleId]);

  const validationSchema = Yup.object({
    academic: Yup.object('').required('Required').nullable(),
    branch: Yup.object('').required('Required').nullable(),
    grade: Yup.object('').required('Required').nullable(),
    subject: Yup.object('').required('Required').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      academic: selectedAcademic,
      branch: selectedBranch,
      grade: selectedGrade,
      subject: selectedSubject,
      question_paper_level: selectedLevel,
    },
    onSubmit: (values) => {
      setShowQuestionPaper(true);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const getAcademic = async () => {
    try {
      const data = await fetchAcademicYears(moduleId);
      setAcademicDropdown(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch academic');
    }
  };

  const getBranch = async (acadId) => {
    try {
      const data = await fetchBranches(acadId, moduleId);
      setBranchDropdown(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch branch');
    }
  };

  const getGrades = async (acadId, branchId) => {
    try {
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch grades');
    }
  };

  const getSubjects = async (gradeId) => {
    try {
      setSubjects([]);
      const data = await fetchSubjects(gradeId);
      setSubjects(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch subjects');
    }
  };

  // const handleAddQuestion = (noOfSections) => {
  //   const sections = Array.from({ length: noOfSections }, (_, index) => ({
  //     id: cuid(),
  //     // name: `Section-${String.fromCharCode(65 + index)}`,
  //     name: `${String.fromCharCode(65 + index)}`,
  //     questions: [],
  //   }));
  //   const question = { id: cuid(), sections };
  //   initAddQuestion(question);
  // };

  const handleAddQuestion = (noOfSections) => {
    let len = questions?.length || 0;
    const sections = [
      {
        id: cuid(),
        name: `${String.fromCharCode(65 + len)}`,
        questions: [],
      },
    ];
    const question = { id: cuid(), sections };
    initAddQuestion(question);
  };

  const handleClearFilters = () => {
    formik.handleReset();
  };

  const handleResetQuestionPaper = () => {
    handleClearFilters();
    initResetState();
  };

  const handleDeleteSection = (questionId, section) => {
    initDeleteSection(questionId, section);
  };

  const handleCreateQuestionPaper = async (isDraft) => {
    try {
      const questionData = [];

      const sectionData = [];
      questions.forEach((q) => {
        q.sections.forEach((sec) => {
          const sectionObj = { [sec.name]: [], discription: sec.name };
          sec.questions.forEach((question) => {
            sectionObj[sec.name].push(question.id);
            if (!questionData.includes(question.id)) {
              questionData.push(question.id, question.child_id);
            }
          });
          sectionData.push(sectionObj);
        });
      });

      const reqObj = {
        academic_year: formik.values.academic.id,
        paper_name: questionPaperName,
        grade: formik.values.grade.grade_id,
        academic_session: formik.values.branch.id,
        subjects: formik.values.subject.map((obj) => obj?.subject_id),
        paper_level: formik.values.question_paper_level.id,
        question: questionData.flat(),
        section: sectionData,
        sections: sectionData,
        is_review: 'True',
        is_draft: 'False',
      };

      if (isDraft) {
        reqObj.is_draft = 'True';
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
        Subject: formik.values.subject.length,
        Grade: formik.values.grade.grade_id,
      };

      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;

      if (finalSubmitFlag) {
        await initCreateQuestionPaper(reqObj);
        history.push('/assessment-question');
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

  const handleAcademicYear = (event, value) => {
    if (value) {
      getBranch(value.id);
      formik.setFieldValue('academic', value);
      initSetFilter('selectedAcademic', value);
    }
  };

  const handleBranch = (event, value) => {
    if (value) {
      getGrades(formik.values.academic?.id, value.branch.id);
      formik.setFieldValue('branch', value);
      initSetFilter('selectedBranch', value);
    }
  };

  const handleGrade = (event, value) => {
    if (value) {
      getSubjects(value?.grade_id);
      formik.setFieldValue('grade', value);
      initSetFilter('selectedGrade', value);
    }
  };

  const handleSubject = (event, value) => {
    if (value.length > 0) {
      formik.setFieldValue('subject', value);
      initSetFilter('selectedSubject', value);
    }
  };

  return (
    <Layout>
      <div className='create-question-paper-container'>
        <div>
          <CommonBreadcrumbs
            componentName='Assesment'
            childComponentName='Question paper'
            childComponentNameNext='Create new'
          />
        </div>
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
              {/* <div className='form-grid-container mv-20'> */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='academic'
                      name='academic'
                      className='dropdownIcon'
                      onChange={handleAcademicYear}
                      // onChange={(e, value) => {
                      //   formik.setFieldValue('academic', value);
                      //   initSetFilter('selectedAcademic', value);
                      // }}
                      value={formik.values.academic}
                      options={academicDropdown}
                      getOptionLabel={(option) => option.session_year || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Academic Year'
                          placeholder='Academic Year'
                        />
                      )}
                      size='small'
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.academic ? formik.errors.academic : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='branch'
                      name='branch'
                      className='dropdownIcon'
                      onChange={handleBranch}
                      value={formik.values.branch || ''}
                      options={branchDropdown || []}
                      getOptionLabel={(option) => option?.branch?.branch_name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Branch'
                          placeholder='Branch'
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
                      id='grade'
                      name='grade'
                      className='dropdownIcon'
                      onChange={handleGrade}
                      value={formik.values.grade}
                      options={grades}
                      getOptionLabel={(option) => option?.grade__grade_name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Grade'
                          placeholder='Grade'
                        />
                      )}
                      size='small'
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.grade ? formik.errors.grade : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='subject'
                      name='subject'
                      onChange={handleSubject}
                      multiple
                      className='dropdownIcon'
                      value={formik.values.subject}
                      options={subjects}
                      getOptionLabel={(option) => option?.subject_name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Subject'
                          placeholder='Subject'
                        />
                      )}
                      size='small'
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {formik.errors.subject ? formik.errors.subject : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant='outlined'>
                    <Autocomplete
                      id='question_paper_level'
                      name='question_paper_level'
                      onChange={(e, value) => {
                        formik.setFieldValue('question_paper_level', value);
                        initSetFilter('selectedLevel', value);
                      }}
                      value={formik.values.question_paper_level}
                      options={levels}
                      className='dropdownIcon'
                      getOptionLabel={(option) => option.name || ''}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Question Paper Level'
                          placeholder='Question Paper Level'
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
            <div className='btn-container'>
              <Button
                variant='contained'
                className='disabled-btn'
                style={{ borderRadius: '10px' }}
                onClick={() => {
                  formik.handleReset();
                }}
              >
                CLEAR ALL
              </Button>
            </div>

            {/* <div className='btn-container '>
              <Button
                variant='contained'
                className=''
                color='primary'
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                FILTER
              </Button>
            </div> */}
          </div>
          {showQuestionPaper && (
            <QuestionPaper
              grade={formik.values.grade?.grade__grade_name}
              subject={formik.values.subject
                .map(({ subject_name }) => subject_name)
                .join(', ')}
              level={formik.values.question_paper_level?.name}
              questions={questions}
              handleAddQuestion={handleAddQuestion}
              onCreateQuestionPaper={handleCreateQuestionPaper}
              onChangePaperName={(e) =>
                initSetFilter('questionPaperName', e.target.value)
              }
              questionPaperName={questionPaperName}
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
  questions: state.createQuestionPaper.questions,
  selectedAcademic: state.createQuestionPaper.selectedAcademic,
  selectedBranch: state.createQuestionPaper.selectedBranch,
  selectedGrade: state.createQuestionPaper.selectedGrade,
  selectedSubject: state.createQuestionPaper.selectedSubject,
  selectedLevel: state.createQuestionPaper.selectedLevel,
  questionPaperName: state.createQuestionPaper.questionPaperName,
});

const mapDispatchToProps = (dispatch) => ({
  initAddQuestion: (question) => {
    dispatch(addQuestion(question));
  },
  initCreateQuestionPaper: (data) => dispatch(createQuestionPaper(data)),
  initSetFilter: (filter, data) => dispatch(setFilter(filter, data)),
  initResetState: () => dispatch(resetState()),
  initDeleteSection: (questionId, sectionId) =>
    dispatch(deleteSection(questionId, sectionId)),
  deleteQuestionSection: (questionId, sectionId) =>
    dispatch(deleteQuestionSection(questionId, sectionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionPaper);
