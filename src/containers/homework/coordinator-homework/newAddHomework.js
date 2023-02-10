import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography,
  TextField,
  Grid,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import cuid from 'cuid';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Layout from '../../Layout';
import QuestionCard from '../../../components/question-card';
import { addHomeWorkCoord, setSelectedHomework } from '../../../redux/actions';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { message, Tabs, Input, Select, Drawer, Form, DatePicker, Button, Breadcrumb } from 'antd';
import { CloseCircleOutlined, LeftOutlined, RightOutlined, EditOutlined, DownOutlined, CalendarOutlined, MoreOutlined } from '@ant-design/icons';
import QuestionCardNew from './questioncardnew'


const validateQuestions = (obj) => {
  let error = false;
  let errorObj = { question: '' };
  if (!obj.question.trim()) {
    error = true;
    errorObj = { ...errorObj, question: 'Required' };
  }
  return { error, errorObj };
};

const useStyles = makeStyles((theme) => ({
  headerText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: '1rem',
    ['@media screen(min-width:780px)']: {
      fontSize: '0.85rem',
    },
  },
  navCard: {
    border: `1px solid ${theme.palette.primary.main}`,
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
    '@media (min-width: 600px)': {
      marginRight: '10px',
    },
  },
}))(Button);

const { Option } = Select;


const AddHomeworkCordNew = ({ onAddHomework, onSetSelectedHomework }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [sections, setSections] = useState([]);
  const [sectionDisplay, setSectionDisplay] = useState([]);
  const [teacherModuleId, setTeacherModuleId] = useState(null);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
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
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const params = useParams();
  const themeContext = useTheme();
  const sessionYear = params.session_year;
  const branch = params.branch;
  const grade = params.grade;
  const [date, setDate] = useState(new Date());
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));

  const handleDateChange = (event, value) => {
    setDateValue(value);
  };
  const formRef = createRef();

  const propData = history?.location?.state



  const validateHomework = () => {
    let isFormValid = true;
    if (!name.trim()) {
      isFormValid = false;
      setErrors((prevState) => ({ ...prevState, name: 'Required' }));
    } else {
      setErrors((prevState) => ({ ...prevState, name: '' }));
    }
    if (!description.trim()) {
      isFormValid = false;
      setErrors((prevState) => ({ ...prevState, description: 'Required' }));
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
      const reqObj = {
        name,
        description,
        section_mapping: sectionDisplay.map((data) => parseInt(data.key, 10)),
        subject: params.id,
        date: params.date,
        last_submission_date: dateValue,
        questions: questions.map((q) => {
          const qObj = q;
          delete qObj.errors;
          delete qObj.id;
          return qObj;
        }),
        user_id: params.coord_selected_teacher_id,
      };
      try {
        const response = await onAddHomework(reqObj);
        setAlert('success', 'Homework added');
        if(propData?.isTeacher == true){
          history.push({
            pathname: '/homework/teacher/',
            state: propData
          });  
        } else {
          history.push({
            pathname: '/homework/coordinator/',
            state: propData
          });
        }
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

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Homework' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Management View') {
              setTeacherModuleId(item.child_id);
            }
            if (item.child_name === 'Teacher Homework') {
              setTeacherModuleId(item.child_id);
            }
            // if (item.child_name === 'Management View') {
            //   setTeacherModuleId(item.child_id);
            // }
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
    console.log(value);
    setSectionDisplay([]);
    if (value) {
      setSectionDisplay(value);
    }
  };
  console.log('ppp2', sessionYear, grade, branch);

  const sectionOptions = sections?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  return (
    <Layout>
      <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item
            className='th-grey th-16 th-pointer'
          >
            Homework
          </Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1 th-16'>
            Add Homework
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='card row' style={{ margin: '10px auto', width: '90%', padding: '15px', background: '#EEF2F8' }}>
        <LeftOutlined style={{ display: 'flex', alignItems: 'center', color: '#535BA0' }} />
        <p style={{ display: 'flex', alignItems: 'center', color: '#535BA0', fontWeight: '600' }} className='th-14 mx-1 my-0' >Back to Homework</p>
      </div>
      <div className='card row' style={{ margin: '10px auto', width: '80%', padding: '15px', background: '#EEF2F8' }}>
        <p style={{ color: '#535BA0' }} className='th-14 col-md-6' >Subject : {params.subject}</p>
        <p style={{ color: '#535BA0', display: 'flex', justifyContent: 'flex-end' }} className='th-14 col-md-6' >Creation Date : {params.date}</p>

      </div>
      <div className='card row' style={{ margin: '10px auto', width: '80%', padding: '15px' }}>
        <Form ref={formRef} style={{ width: '100%' }} >
          <Form.Item name='title'>
            <div>
              <p className='th-14 m-0 th-fw-600' >Title</p>
              <Input placeholder="Enter Title" className='th-br-5' onChange={(e) => {
                setName(e.target.value);
              }} style={{ background: '#EEF2F8' }} />
            </div>
          </Form.Item>
          <Form.Item name='instruction'>
            <div>
              <p className='th-14 m-0 th-fw-600' >Instruction</p>
              <Input placeholder="Enter Instruction" className='th-br-5' onChange={(e) => {
                setDescription(e.target.value);
              }} style={{ background: '#EEF2F8' }} />
            </div>
          </Form.Item>
          <div className='row' >
            <div className='p-0'>
              <div className='m-0 text-left th-fw-600 th-14'>Due Date</div>
              <Form.Item name='date'>
                <DatePicker value={dateValue}
                  onChange={handleDateChange} defaultValue={moment()}  />
              </Form.Item>
            </div>
            <div className='p-0 mx-1 w-25'>
              <div className='m-0 text-left th-fw-600 th-14'>Section</div>
              <Form.Item name='section'>
                <Select
                  allowClear
                  placeholder='Select Section'
                  mode='multiple'
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp='children'
                  maxTagCount={2}
                  showArrow={true}
                  suffixIcon={<DownOutlined className='th-grey' />}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={sectionDisplay || []}
                  onChange={handleSection}
                  // onClear={handleClearBoard}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {sectionOptions}
                </Select>
              </Form.Item>
            </div>
          </div>
          <Form.Item name='question'>
            <div>
              {questions.map((question, index) => (
                <QuestionCardNew
                  key={question.id}
                  question={question}
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
            </div>
          </Form.Item>
          <div className='row'>
            <Button onClick={() => {
              setQueIndexCounter(queIndexCounter + 1);
              addNewQuestion(queIndexCounter + 1);
            }} >
              Add Another Question
            </Button>
            <Button className='mx-1' onClick={handleAddHomeWork}>
              Submit
            </Button>
          </div>

        </Form>

      </div>
      {/* <div className={`${classes.ahcc} add-homework-container-coordinator`}>
        <Grid container spacing={2} className='add-homework-inner-container'>
          <Grid item xs={12} className='add-homework-title-container' md={3}>
            <div className='nav-cards-container'>
              <div
                className={` ${classes.navCard} nav-card`}
                onClick={() => {
                  history.push('/homework/coordinator/');
                }}
              >
                <div
                  className={` ${classes.headerText} text-center non_selected_homework_type_item`}
                >
                  All Homeworks
                </div>
              </div>
              <div className={` ${classes.navCard} nav-card`}>
                <div className={`${classes.headerText} text-center`}>{params.date}</div>
                <div className={`${classes.headerText} text-center`}>
                  {params.subject}
                </div>
              </div>
            </div>
          </Grid>

          <Grid item container xs={12} md={9}>
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
                    inputProps={{ maxLength: 20 }}
                    label='Title'
                    autoFocus
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <FormHelperText style={{ color: 'red' }}>{errors.name}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} className='form-field'>
                <FormControl variant='outlined' fullWidth size='small'>
                  <InputLabel htmlFor='component-outlined'>Description</InputLabel>
                  <OutlinedInput
                    id='description'
                    name='description'
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    inputProps={{ maxLength: 150 }}
                    multiline
                    rows={4}
                    rowsMax={6}
                    label='Description'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.description}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
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

              <Grid container item xs={12}>
                <Grid item xs={12} md={6} className='form-field'>
                  <div className='finish-btn-container'>
                    <StyledOutlinedButton
                      startIcon={<AddCircleOutlineIcon color='primary' />}
                      onClick={() => {
                        setQueIndexCounter(queIndexCounter + 1);
                        addNewQuestion(queIndexCounter + 1);
                      }}
                      fullWidth
                    >
                      Add Another Question
                    </StyledOutlinedButton>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className='finish-btn-container'>
                    <Button
                      style={{ color: 'white', width: '100%' }}
                      color='primary'
                      variant='contained'
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
      </div> */}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  selectedHomework: state.teacherHomework.selectedHomework,
});

const mapDispatchToProps = (dispatch) => ({
  onAddHomework: (reqObj) => {
    return dispatch(addHomeWorkCoord(reqObj));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AddHomeworkCordNew);
