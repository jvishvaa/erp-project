import React, { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Typography,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import cuid from 'cuid';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Layout from '../../Layout';
import QuestionCard from '../../../components/question-card';
import { addHomeWork, setSelectedHomework } from '../../../redux/actions';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const validateQuestions = (obj) => {
  let error = false;
  let errorObj = { question: '' };
  if (!obj.question.trim()) {
    error = true;
    errorObj = { ...errorObj, question: 'Required' };
  }
  return { error, errorObj };
};

const AddHomework = ({ onAddHomework, onSetSelectedHomework }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [questions, setQuestions] = useState([
    {
      id: cuid(),
      question: '',
      attachments: [],
      is_attachment_enable: false,
      max_attachment: 5,
      penTool: false,
    },
  ]);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const params = useParams();
  const themeContext = useTheme();

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
      console.log('submitting form');
      const reqObj = {
        name,
        description,
        subject: params.id,
        date: params.date,
        questions: questions.map((q) => {
          const qObj = q;
          delete qObj.errors;
          delete qObj.id;
          return qObj;
        }),
      };
      try {
        const response = await onAddHomework(reqObj);
        console.log('add response ', response);
        setAlert('success', 'Homework added');
        history.push('/homework/teacher');
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
        max_attachment: 5,
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

  return (
    <Layout>
      <div className='add-homework-container'>
        <div className='message_log_breadcrumb_wrapper'>
          <CommonBreadcrumbs componentName='Homework' childComponentName='Add' />
        </div>
        <Grid container className='add-homework-inner-container'>
          <Grid item xs={12} className='add-homework-title-container' md={4}>
            <div className='nav-cards-container'>
              <div
                className='nav-card'
                onClick={() => {
                  history.push('/homework/teacher');
                }}
              >
                <div className='header-text text-center'>All Homeworks</div>
              </div>
              <div className='nav-card'>
                <div className='header-text text-center'>{params.date}</div>
                <div className='header-text text-center'>{params.subject}</div>
              </div>
            </div>
          </Grid>

          <Grid item container xs={12} md={8}>
            <Grid item xs={12} className='form-field'>
              <FormControl variant='outlined' fullWidth size='small'>
                <InputLabel htmlFor='component-outlined'>Title</InputLabel>
                <OutlinedInput
                  id='title'
                  name='title'
                  onChange={() => {}}
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
              />
            ))}
            <Grid item xs={12}>
              <div className='finish-btn-container'>
                <Button className='btn' color='primary' onClick={handleAddHomeWork}>
                  Finish
                </Button>
              </div>
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
  onAddHomework: (reqObj) => {
    return dispatch(addHomeWork(reqObj));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AddHomework);
