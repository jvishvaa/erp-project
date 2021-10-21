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

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const { refresh = false } = history.location?.state || {};

  useEffect(() => {
    console.log(sections, '=========');
    if (refresh) {
      handleResetQuestionPaper();
      setIsFetched(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (Number(location.pathname.slice(23)) && !isFetched) {
      handleFetch();
    }
  }, []);

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

  const getAcademic = () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  const getBranch = async (acadId) => {
    try {
      let data = await fetchBranches(acadId, moduleId);
      data.unshift({
        session_year: {},
        id: 'all',
        branch: { id: 'all', branch_name: 'Select All' },
      });
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
  };
  const handleClearFilters = () => {
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', {});
    formik.setFieldValue('subject', []);
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
        subjects: formik.values.subject?.map((obj) => obj?.subject_id),
        paper_level: formik.values.question_paper_level?.id,
        section: sectionData,
        sections: sectionData,
        is_review: 'False',
        is_draft: 'False',
      };

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
        Subject: formik.values.subject.length,
        Grade: formik.values.grade.grade_id,
      };
      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;
      if (finalSubmitFlag) {
        await initEditQuestionPaper(reqObj, location.pathname.slice(23));
        // await initEditQuestionPaper(reqObj);
        history.push('/assessment-question');
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
      setAlert('error', 'Failed to create Question Paper');
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
        academic_year: formik.values.academic?.id,
        paper_name: questionPaperName,
        grade: formik.values.grade?.grade_id,
        // academic_session: formik.values.branch.id,
        academic_session: formik.values.branch?.map((branch) => branch?.id),
        subjects: formik.values.subject?.map((obj) => obj?.subject_id),
        paper_level: formik.values.question_paper_level?.id,
        section: sectionData,
        sections: sectionData,
        is_review: 'True',
        is_draft: 'False',
      };

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
          const { questions: responseQuestions = [], sections: responseSections = [] } =
            result.data.result || {};
          handleTransformResponse(responseQuestions, responseSections); //for edit question-paper
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

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
  const handleSubmitPaper = () => {
    if (Number(location.pathname.slice(23))) {
      handleEditQuestionPaper();
    } else handleCreateQuestionPaper();
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

  const handleSubject = (event, value) => {
    formik.setFieldValue('subject', []);
    initSetFilter('selectedSubject', []);
    if (value.length > 0) {
      formik.setFieldValue('subject', value);
      initSetFilter('selectedSubject', value);
    }
  };

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
                      value={selectedGrade || {}}
                      options={grades || []}
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
              onChangePaperName={(e) =>
                initSetFilter(
                  'questionPaperName',
                  e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase())
                )
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
  sections: state.createQuestionPaper.questions,
  isFetched: state.createQuestionPaper.isFetched,
  selectedAcademic: state.createQuestionPaper.selectedAcademic,
  selectedBranch: state.createQuestionPaper.selectedBranch,
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
