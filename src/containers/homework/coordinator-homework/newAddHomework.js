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
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Layout from '../../Layout';
import QuestionCard from '../../../components/question-card';
import {
  addHomeWorkCoord,
  setSelectedHomework,
  addHomeWork,
  fetchTeacherHomeworkDetailsById,
} from '../../../redux/actions';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  message,
  Tabs,
  Input,
  Select,
  Drawer,
  Form,
  DatePicker,
  Button,
  Breadcrumb,
  Modal,
  Progress,
} from 'antd';
import {
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DownOutlined,
  CalendarOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import QuestionCardNew from './questioncardnew';
import Loader from 'components/loader/loader';

const { confirm } = Modal;

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

const AddHomeworkCordNew = ({
  onAddHomework,
  onAddHomeworkedit,
  onSetSelectedHomework,
  selectedHomeworkDetails,
  getHomeworkDetailsById,
}) => {
  const location = useLocation();
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
      max_attachment: 10,
      penTool: false,
    },
  ]);
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const params = useParams();
  const themeContext = useTheme();
  const propData = history?.location?.state;
  const sessionYear = params.session_year;
  const branch = params.branch;
  const grade = params.grade;
  const [date, setDate] = useState(new Date());
  const [isAutoAssignDiary, setIsAutoAssignDiary] = useState(false);
  const [dateValue, setDateValue] = useState(moment(params.date).format('YYYY-MM-DD'));
  const [hwId, sethwId] = useState(propData?.viewHomework?.hw_data?.data?.hw_id);
  const [loading, setLoading] = useState(false);
  const [hwSubTime, setHwSubTime] = useState(null);
  const handleDateChange = (event, value) => {
    setDateValue(value);
  };
  const formRef = createRef();
  const [percentValue, setPercentValue] = useState(10);
  const [uploadStart, setUploadStart] = useState(false);

  let idInterval = null;
  useEffect(() => {
    if (uploadStart == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [uploadStart]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };

  useEffect(() => {
    if (propData.isEdit) {
      formRef.current.setFieldsValue({
        title: selectedHomeworkDetails?.homework_name,
        instruction: selectedHomeworkDetails?.description,
        date: moment(selectedHomeworkDetails?.last_submission_dt),
      });

      setQueIndexCounter(selectedHomeworkDetails?.hw_questions?.length - 1);
      setName(selectedHomeworkDetails?.homework_name);
      setDateValue(selectedHomeworkDetails?.last_submission_dt);
      setDescription(selectedHomeworkDetails?.description);
      if (selectedHomeworkDetails?.description == '' && propData.isEdit) {
        setIsAutoAssignDiary(true);
      }

      const que = selectedHomeworkDetails?.hw_questions?.map((data) => ({
        id: cuid(),
        is_attachment_enable: data.is_attachment_enable,
        max_attachment: data.max_attachment,
        penTool: data.is_pen_editor_enable,
        question: data.question,
        attachments: data.question_files,
        is_online: data.is_online,
      }));
      setQuestions(que);
    }
  }, [selectedHomeworkDetails, propData]);
  useEffect(() => {
    if (propData?.viewHomework?.hw_data?.data?.hw_id && propData?.isFromLessonPlan) {
      getHomeworkDetailsById(propData?.viewHomework?.hw_data?.data?.hw_id);
    }
  }, [propData?.viewHomework?.hw_data?.data?.hw_id]);
  const validateHomework = () => {
    let isFormValid = true;
    if (!name.trim()) {
      isFormValid = false;
      setErrors((prevState) => ({ ...prevState, name: 'Required' }));
    } else {
      setErrors((prevState) => ({ ...prevState, name: '' }));
    }
    if (!isAutoAssignDiary) {
      if (!description.trim()) {
        isFormValid = false;
        setErrors((prevState) => ({ ...prevState, description: 'Required' }));
      } else {
        setErrors((prevState) => ({ ...prevState, description: '' }));
      }
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

  const homeworkCreateConfirmation = (type) => {
    confirm({
      content:
        type == 'online' ? (
          <div>
            <strong>Online Submission</strong> has been enabled for students, they will be
            submitting the Homework online. Are you sure do you want to submit the
            Homework?
          </div>
        ) : type == 'offline' ? (
          <div>
            <strong>Offline Submission</strong> has been enabled for students, they will
            be submitting the Homework directly to you in school. Are you sure do you want
            to submit the Homework?
          </div>
        ) : (
          <div>
            <strong> Online & Offline submission</strong> has been enabled for students.
            Are you sure do you want to submit the Homework?
          </div>
        ),
      onOk() {
        createHomework();
      },
      onCancel() {
        return;
      },
    });
  };

  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa' ||
    window.location.host.split('.')[0] === 'localhost:3000'
      ? // window.location.host.split('.')[0] === 'test'
        true
      : false;

  useEffect(() => {
    fetchHwTimeConfig();
  }, []);

  const fetchHwTimeConfig = () => {
    setLoading(true);
    axiosInstance
      .get(`/assessment/check-sys-config/?config_key=hw_creation_time`)
      .then((response) => {
        setHwSubTime(response?.data?.result[0] || null);
        setLoading(false);
      })
      .catch((error) => {
        // message.error(error?.response?.data?.message ?? 'Something went wrong!');
        setLoading(false);
      });
  };

  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? ' AM' : ' PM';
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  const handleAddHomeWork = async () => {
    if (isOrchids) {
      let breakTime = hwSubTime && hwSubTime.split(':');
      let closeHR = (breakTime && breakTime[0]) || null;
      let closeMin = (breakTime && breakTime[1]) || null;
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // since month starts from 0 here
      let dd = today.getDate();
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      const formattedToday = `${yyyy}-${mm}-${dd}`;
      let newDateval = moment(dateValue).format('YYYY-MM-DD');
      console.log(hour, closeHR, minute, closeMin, newDateval, formattedToday, 'hr min');
      if (
        closeHR != null &&
        hour == closeHR &&
        minute >= closeMin &&
        formattedToday == newDateval
      ) {
        return message.error(
          `Homework creation/updation is locked after ${tConv24(
            hwSubTime
          )} for the same day due date`
        );
      }
      if (closeHR != null && hour > closeHR && formattedToday == newDateval) {
        return message.error(
          `Homework creation/updation is locked after ${tConv24(
            hwSubTime
          )} for the same day due date`
        );
      }
    }

    if (name == undefined || name == '') {
      return message.error('Please Add Title');
    }
    if (dateValue == undefined || dateValue == '') {
      return message.error('Please Add Due Date');
    }
    if (!isAutoAssignDiary) {
      if (description == undefined || description == '') {
        return message.error('Please Add Description');
      }
    }
    if (sectionDisplay?.length == 0) {
      return message.error('Please Select Section');
    }
    if (questions.filter((item) => item?.question == '')?.length > 0) {
      return message.error('Please Add Questions');
    }
    let NewQuestionList = questions?.map((item, index) => {
      if (item?.is_attachment_enable == false) {
        questions[index]['max_attachment'] = 0;
      } else if (
        item?.is_attachment_enable == true &&
        questions[index]['max_attachment'] == 0
      ) {
        questions[index]['max_attachment'] = 10;
      }
    });

    let hasOnlineQuestion = questions?.every((item) => item['is_online'] === true);
    let hasOfflineQuestion = questions?.every((item) => item['is_online'] === false);
    let hasBothQuestions =
      questions?.some((item) => item['is_online'] === false) &&
      questions?.some((item) => item['is_online'] === true);
    if (hasOnlineQuestion) {
      homeworkCreateConfirmation('online');
      return;
    }
    if (hasOfflineQuestion) {
      homeworkCreateConfirmation('offline');
      return;
    }
    if (hasBothQuestions) {
      homeworkCreateConfirmation('both');
      return;
    }
  };

  const createHomework = async () => {
    const isFormValid = validateHomework();
    if (isFormValid) {
      setLoading(true);
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
        if (propData?.isEdit == true) {
          const response = await onAddHomeworkedit(reqObj, propData?.isEdit, hwId);
          setAlert('success', 'Homework Updated');
          setLoading(false);
        } else {
          const response = await onAddHomework(reqObj);
          setAlert('success', 'Homework Added');
          setLoading(false);
        }
        // setAlert('success', 'Homework added');
        if (propData?.isTeacher == true) {
          history.push({
            pathname: '/homework/teacher/',
            state: propData,
          });
        } else {
          history.push({
            pathname: '/homework/coordinator/',
            state: propData,
          });
        }
      } catch (error) {
        setAlert('error', 'Failed to add homework');
        setLoading(false);
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
        max_attachment: 10,
        penTool: false,
        is_online: false,
      },
      ...prevState.slice(index),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
    message.info('Question removed successfully');
  };

  const handleChange = (index, field, value) => {
    console.log('handleChange', index, field, value);
    const form = questions[index];
    let modifiedForm = {};
    if (field == 'is_online') {
      if (value) {
        form['is_attachment_enable'] = true;
        form['penTool'] = true;
        form['is_online'] = true;
      } else {
        form['is_attachment_enable'] = false;
        form['penTool'] = false;
        form['is_online'] = false;
      }
      modifiedForm = { ...form };
    } else {
      modifiedForm = { ...form, [field]: value };
    }
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
    setSectionDisplay([]);
    if (value) {
      setSectionDisplay(value);
    }
  };

  const goback = () => {
    if (propData?.isTeacher == true) {
      history.push({
        pathname: '/homework/teacher/',
        state: propData,
      });
    } else {
      history.push({
        pathname: '/homework/coordinator/',
        state: propData,
      });
    }
  };

  const sectionOptions = sections?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  let sectionsEdit = sectionOptions.filter(
    (item) => item?.props?.value == propData?.viewHomework?.filterData?.sectionId
  );
  useEffect(() => {
    if (propData?.isEdit) {
      handleSection(null, sectionsEdit);
    }
    formRef.current.setFieldsValue({
      section: sectionsEdit?.map((item) => item?.props?.children),
    });
  }, [sections]);
  return (
    <Layout>
      <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item className='th-grey th-16 th-pointer'>Homework</Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1 th-16'>
            {propData?.isEdit ? 'Edit Homework' : 'Add Homework'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {loading == true ? <Loader /> : ''}
      <div
        className='card row'
        style={{
          margin: '10px auto',
          width: '90%',
          padding: '15px',
          background: '#EEF2F8',
          cursor: 'pointer',
        }}
        onClick={() => goback()}
      >
        <LeftOutlined
          style={{ display: 'flex', alignItems: 'center', color: '#535BA0' }}
        />
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#535BA0',
            fontWeight: '600',
          }}
          className='th-14 mx-1 my-0'
        >
          Back to Homework
        </p>
      </div>
      <div
        className='card row'
        style={{
          margin: '10px auto',
          width: '80%',
          padding: '15px',
          background: '#EEF2F8',
        }}
      >
        <p style={{ color: '#535BA0' }} className='th-14 col-md-6 th-fw-600'>
          Subject : {params.subject}
        </p>
        <p
          style={{ color: '#535BA0', display: 'flex', justifyContent: 'flex-end' }}
          className='th-14 col-md-6 th-fw-600'
        >
          Creation Date : {moment(params.date).format('DD-MM-YYYY')}
        </p>
      </div>
      <div
        className='card row'
        style={{ margin: '10px auto', width: '80%', padding: '15px' }}
      >
        <Form ref={formRef} style={{ width: '100%' }}>
          <p className='th-14 m-0 th-fw-600'>Title</p>
          <Form.Item name='title'>
            <Input
              placeholder='Enter Title'
              className='th-br-5'
              onChange={(e) => {
                setName(e.target.value);
              }}
              style={{ background: '#EEF2F8' }}
              maxLength={30}
            />
          </Form.Item>
          <div>
            {!isAutoAssignDiary && (
              <>
                <p className='th-14 m-0 th-fw-600'>Instruction</p>
                <Form.Item name='instruction'>
                  <Input
                    placeholder='Enter Instruction'
                    className='th-br-5'
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    style={{ background: '#EEF2F8' }}
                    maxLength={100}
                  />
                </Form.Item>
              </>
            )}
          </div>
          <div className='row'>
            <div className='p-0'>
              <div className='m-0 text-left th-fw-600 th-14'>Due Date</div>
              <Form.Item name='date'>
                <DatePicker
                  value={dateValue}
                  onChange={handleDateChange}
                  defaultValue={moment(params.date)}
                  style={{ textAlign: 'left' }}
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, 'day'))
                  }
                  className='dueDateaddHw'
                />
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
              {questions?.map((question, index) => (
                <QuestionCardNew
                  key={question.id}
                  question={question}
                  isEdit={propData.isEdit}
                  index={index}
                  addNewQuestion={addNewQuestion}
                  handleChange={handleChange}
                  removeQuestion={removeQuestion}
                  sessionYear={sessionYear}
                  branch={branch}
                  grade={grade}
                  subject={params?.id}
                  queIndexCounter={queIndexCounter}
                  setLoading={setLoading}
                  setUploadStart={setUploadStart}
                  setPercentValue={setPercentValue}
                />
              ))}
            </div>
          </Form.Item>
          <div className='row'>
            <Button
              onClick={() => {
                setQueIndexCounter(queIndexCounter + 1);
                addNewQuestion(queIndexCounter + 1);
              }}
            >
              Add Another Question
            </Button>
            <Button className='mx-2' onClick={handleAddHomeWork} type='primary'>
              {propData?.isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Form>
      </div>
      <Modal
        maskClosable={false}
        closable={false}
        footer={null}
        visible={uploadStart}
        width={1000}
        centered
      >
        <Progress
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={percentValue}
          status='active'
          className='p-4'
        />
      </Modal>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  selectedHomework: state.teacherHomework.selectedHomework,
  selectedHomeworkDetails: state.teacherHomework.selectedHomeworkDetails,
});

const mapDispatchToProps = (dispatch) => ({
  onAddHomeworkedit: (reqObj, isEdit, hwId) => {
    return dispatch(addHomeWork(reqObj, isEdit, hwId));
  },
  onAddHomework: (reqObj) => {
    return dispatch(addHomeWorkCoord(reqObj));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  getHomeworkDetailsById: (id) => {
    dispatch(fetchTeacherHomeworkDetailsById(id));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AddHomeworkCordNew);
