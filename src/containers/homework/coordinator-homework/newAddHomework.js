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
  console.log(propData , 'props');


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

  const goback = () => {
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
  }

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
      <div className='card row' style={{ margin: '10px auto', width: '90%', padding: '15px', background: '#EEF2F8' , cursor: 'pointer' }} onClick={() => goback()} >
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
