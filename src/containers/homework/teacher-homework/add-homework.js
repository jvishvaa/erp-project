import React, { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  TextField,
  Typography,
  Grid,
  withStyles,
  useMediaQuery,
  makeStyles,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import cuid from 'cuid';
import { connect } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Layout from '../../Layout';
import QuestionCard from '../../../components/question-card';
import { addHomeWork, setSelectedHomework } from '../../../redux/actions';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const validateQuestions = (obj) => {
  let error = false;
  let errorObj = { question: '' };
  if (!obj.question.trim()) {
    error = true;
    errorObj = { ...errorObj, question: '*Question is required...' };
  }
  return { error, errorObj };
};

const useStyles = makeStyles((theme) => ({
  navCard: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  headerText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: '1rem',
    ['@media screen(min-width:768px)']: {
      fontSize: '0.85rem',
    },
  },
}));

const StyledOutlinedButton = withStyles((theme) => ({
  root: {
    height: '42px',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'transparent',
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
      fontSize: '20px',
    },
  },
}))(Button);

const AddHomework = ({ onAddHomework, onSetSelectedHomework }) => {
  const location = useLocation();
  const [hwId, sethwId] = useState(location?.state?.viewHomework?.homeworkId);
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [sectionDisplay, setSectionDisplay] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [teacherModuleId, setTeacherModuleId] = useState(null);
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [date, setDate] = useState(new Date());
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));
  const [isEdit, setisEdit] = useState(location?.state?.isEdit);
  const [questions, setQuestions] = useState([
    {
      id: cuid(),
      question: '',
      attachments: [],
      is_attachment_enable: false,
      max_attachment: 2,
      penTool: false,
    },
  ]);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const params = useParams();
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const themeContext = useTheme();
  const sessionYear = params.session_year;
  const branch = params.branch;
  const grade = params.grade;

  const handleDateChange = (event, value) => {
    setDateValue(value);
  };

  useEffect(() => {
    if (location?.state?.isEdit) {
      // setisEdit(location.state.isEdit)
      // sethwId(location.state.viewHomework.homeworkId)
      setName(location.state.selectedHomeworkDetails.homework_name);
      setSectionDisplay(
        Object.keys(location.state.viewHomework.sectiondata).length > 0
          ? [location.state.viewHomework.sectiondata]
          : []
      );
      setDescription(location.state.selectedHomeworkDetails.description);
      const que = location?.state?.selectedHomeworkDetails?.hw_questions?.map((data) => ({
        id: cuid(),
        is_attachment_enable: data.is_attachment_enable,
        max_attachment: data.max_attachment,
        penTool: data.is_pen_editor_enable,
        question: data.question,
        attachments: data.question_files,
      }));
      setQuestions(que);
    }
  }, []);

  const validateHomework = () => {
    let isFormValid = true;
    if (sectionDisplay.length === 0) {
      isFormValid = false;
      setAlert('warning', 'Please Select Section');
    }
    if (!name.trim()) {
      isFormValid = false;
      setErrors((prevState) => ({ ...prevState, name: '*Title is required...' }));
    } else {
      setErrors((prevState) => ({ ...prevState, name: '' }));
    }
    if (!description.trim()) {
      isFormValid = false;
      setErrors((prevState) => ({
        ...prevState,
        description: '*Description is required...',
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, description: '' }));
    }
    const questionsWithValidations = [...questions];
    questions.forEach((q, index) => {
      const { error, errorObj } = validateQuestions(q);
      questionsWithValidations[index] = { ...questions[index], errors: errorObj };
      if (error) {
        isFormValid = false;
      }
    });
    setQuestions(questionsWithValidations);

    return isFormValid;
  };

  const handleAddHomeWork = async () => {
    const isFormValid = validateHomework();
    if (isFormValid) {
      //const sectionId = params.section.split(',').map( n => parseInt(n, 10))
      const reqObj = {
        name,
        description,
        section_mapping: sectionDisplay.map((data) => parseInt(data.id, 10)),
        subject: params.id,
        date: params.date,
        last_submission_date: dateValue,
        questions: questions.map((q) => {
          const qObj = q;
          delete qObj.errors;
          delete qObj.id;
          return qObj;
        }),
      };
      try {
        const response = await onAddHomework(reqObj, isEdit, hwId);
        setAlert('success', 'Homework added');
        history.goBack();
      } catch (error) {
        setAlert('error', 'Failed to add homework');
      }
    }
  };

  const addNewQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      {
        id: cuid(),
        question: '',
        attachments: [],
        is_attachment_enable: false,
        max_attachment: 2,
        penTool: false,
      },
      ...prevState.slice(index),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  const handleChange = (index, field, value) => {
    const form = questions[index];
    const modifiedForm = { ...form, [field]: value };
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      modifiedForm,
      ...prevState.slice(index + 1),
    ]);
  };

  useEffect(() => {
    return () => {
      onSetSelectedHomework(null);
    };
  }, []);

  const handleBackButton = () => {
    history.push('/homework/teacher');
  };
  // const descriptionChange = (e) => {
  //   setDescription(e.target.value);
  // }
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Homework' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Homework') {
              setTeacherModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (teacherModuleId && sessionYear && branch && grade) {
      axiosInstance
        .get(
          `${endpoints.academics.sections}?session_year=${sessionYear}&branch_id=${branch}&grade_id=${grade}&module_id=${teacherModuleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSections(result.data?.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [teacherModuleId, sessionYear, branch, grade]);

  const handleSection = (event, value) => {
    //setSearchSection([]);
    setSectionDisplay([]);
    //let sec_id = [];
    if (value) {
      //let id = value.map(({ id }) => sec_id.push(id));
      //setSearchSection(sec_id);
      setSectionDisplay(value);
    }
  };

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Homework'
        childComponentName={location?.state?.isEdit ? 'Edit Homework' : 'Add Homework'}
        isAcademicYearVisible={true}
      />
      <div className='add-homework-container'>
        <Grid container className='add-homework-inner-container' spacing={2}>
          <Grid item xs={12} className='add-homework-title-container' md={3}>
            <div className='nav-cards-container'>
              <div
                className={` ${classes.navCard} nav-card`}
                onClick={() => {
                  history.push('/homework/teacher');
                }}
              >
                <div
                  className={` ${classes.headerText} text-center`}
                  style={{ cursor: 'pointer' }}
                >
                  All Homeworks
                </div>
              </div>
              <div className={` ${classes.navCard} nav-card`}>
                <div
                  className={` ${classes.headerText} text-center`}
                  style={{ cursor: 'pointer' }}
                >
                  {params.date}
                </div>
                <div
                  className={` ${classes.headerText} text-center`}
                  style={{ cursor: 'pointer' }}
                >
                  {params.subject}
                </div>
              </div>
            </div>
          </Grid>

          <Grid
            item
            className='homework-create-questions-container'
            container
            xs={12}
            md={9}
          >
            <Grid container style={{ width: '95%', margin: '0 auto' }}>
              <Grid item xs={12} sm={4} style={{ marginBottom: '20px' }}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSection}
                  id='section'
                  required
                  multiple
                  value={sectionDisplay || []}
                  options={sections || []}
                  getOptionLabel={(option) => option?.section__section_name || ''}
                  filterSelectedOptions
                  className='dropdownIcon'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Sections'
                      placeholder='Sections'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} style={{ margin: '0 20px' }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    size='small'
                    variant='dialog'
                    format='YYYY-MM-DD'
                    margin='none'
                    // className='button'
                    className='dropdownIcon'
                    id='date-picker'
                    label='Due Date'
                    inputVariant='outlined'
                    fullWidth
                    value={dateValue}
                    onChange={handleDateChange}
                    // className='dropdown'
                    style={{ width: '100%' }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} className='form-field'>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel htmlFor='component-outlined'>Title</InputLabel>
                  <OutlinedInput
                    id='title'
                    name='title'
                    // onChange={() => {}}
                    inputProps={{ maxLength: 100 }}
                    label='Title'
                    autoFocus
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    //error={errors.name ? true : false}
                    //helperText="Title is required"
                  />
                  <FormHelperText style={{ color: 'red' }}>{errors.name}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} className='form-field'>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel htmlFor='component-outlined'>Instruction</InputLabel>
                  <OutlinedInput
                    id='description'
                    name='Instruction'
                    // onChange = {descriptionChange}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    inputProps={{ maxLength: 250 }}
                    multiline
                    rows={4}
                    rowsMax={6}
                    label='Instruction'
                    value={description}
                    //error={true}
                    //helperText="Description required"
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.description}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {questions?.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  isEdit={location?.state?.isEdit}
                  index={index}
                  addNewQuestion={addNewQuestion}
                  handleChange={handleChange}
                  removeQuestion={removeQuestion}
                  sessionYear={sessionYear}
                  branch={branch}
                  grade={grade}
                  subject={params?.id}
                />
              ))}

              <Grid container item xs={12} spacing={1}>
                {/*
                <Grid item xs={12} md={2}>
                  <Button
                      variant='contained'
                      className='disabled-btn'
                      onClick={handleBackButton}
                      fullWidth
                  >
                    Back
                  </Button>
                </Grid>
                */}
                <Grid item xs={12} md={6} className='form-field'>
                  <div className='finish-btn-container'>
                    <StyledOutlinedButton
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        setQueIndexCounter(queIndexCounter + 1);
                        addNewQuestion(queIndexCounter + 1);
                      }}
                      title='Add Question'
                      fullWidth
                    >
                      Add Another Question
                    </StyledOutlinedButton>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className='form-field'>
                  <div className='finish-btn-container'>
                    <Button
                      variant='contained'
                      style={{ color: 'white', width: '100%' }}
                      color='primary'
                      onClick={handleAddHomeWork}
                    >
                      Finish
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  selectedHomework: state.teacherHomework.selectedHomework,
});

const mapDispatchToProps = (dispatch) => ({
  onAddHomework: (reqObj, isEdit, hwId) => {
    return dispatch(addHomeWork(reqObj, isEdit, hwId));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AddHomework);
