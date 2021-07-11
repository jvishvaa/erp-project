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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
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
  const { setAlert } = useContext(AlertNotificationContext);
  const [assesmentTypes, setAssesmentTypes] = useState([]);
  const formik = useFormik({
    initialValues: {
      test_mode: selectedTestType || testTypes[0],
      test_type: '',
    },
    onSubmit: (values) => {},
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
  const getAssesmentTypes = async () => {
    try {
      const data = await fetchAssesmentTypes();
      setAssesmentTypes(data);
      formik.setFieldValue('test_type', data[0]);
    } catch (e) {}
  };
  // useEffect(() => {
  //   if (moduleId) {
  //     getAcademic();
  //   }
  //   getAssesmentTypes();
  // }, [moduleId]);

  useEffect(() => {
    if (clearForm) {
      resetForm();
    }
  }, [clearForm]);
  const handleCreateAssesmentTest = async () => {
    const qMap = new Map();

    if (totalMarks < 0 || totalMarks > 1000) {
      setAlert('warning', 'Please enter valid marks.');
      return;
    }

    if (testDuration < 0 || testDuration > 1440) {
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
    };

    if (!paperchecked) {
      reqObj = { ...reqObj, test_mark: testMarksArr };
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

  useEffect(() => {
    if (selectedQuestionPaper) {
      // initFetchQuestionPaperDetails(3);
      initFetchQuestionPaperDetails(selectedQuestionPaper?.id);
    }
    getAssesmentTypes();
    // initFetchQuestionPaperDetails(3);
  }, [selectedQuestionPaper]);
  return (
    <Layout>
      <div className='create-assesment-container'>
        <div>
          <CommonBreadcrumbs
            componentName='Assessment'
            childComponentName='Create Test'
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
                              />
                            )}
                            size='small'
                          />
                        </Grid>
                      </Grid>
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.branch ? formik.errors.branch : ''}
                      </FormHelperText>
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
              setInstructions(value);
              initChangeTestFormFields('testInstructions', value);
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
  initFetchQuestionPaperDetails: (id) => dispatch(fetchQuestionPaperDetails(id)),
  initCreateAssesment: (data) => dispatch(createAssesment(data)),
  initChangeTestFormFields: (field, data) => dispatch(changeTestFormField(field, data)),
  initResetFormState: () => dispatch(resetFormState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAssesment);
