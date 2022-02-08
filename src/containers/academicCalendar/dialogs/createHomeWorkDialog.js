import React, { useState, useEffect } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import { Button, TextField, Divider, Checkbox } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import NewQuestionCard from './NewQuestionCard';
const CreateHomeWorkDialog = (props) => {
  const [reset, setReset] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [periodId, setPeriodId] = useState();
  const [pentool, setPentool] = useState(false);
  const inputArr = {
    question: "",
    attachments: [],
    is_attachment_enable: true,
    max_attachment: 5,
    penTool: false,
  };
  const [questions, setQuestions] = useState([inputArr]);
  const handleClose = () => {
    setQuestions([{
      question: "",
      attachments: [],
      is_attachment_enable: true,
      max_attachment: 5,
      penTool: false,
    }])
    setTitle('');
    setDescription('');
    setPentool(false)
    setReset(!reset)
  };
  const removeFormFields = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };
  const addInput = () => {
    setQuestions((s) => {
      return [
        ...s,
        {
          question: '',
          attachments: [],
          is_attachment_enable: true,
          max_attachment: 2,
          penTool: false,
        },
      ];
    });
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
  const handleCreateHW = () => {
    let reqObj = {
      name: title,
      description: description,
      questions: questions,
      period_id: periodId,
    };
    props.handleCreate(reqObj);
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '80px',
          marginBottom: '5px',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            fontSize: '18px',
          }}
        >
          <b>Create Home Work</b>
        </div>
        <div style={{ cursor: 'pointer' }} onClick={props.onClose}>
          <CloseIcon />
        </div>
      </div>
      <Divider />
      <div
        container
        style={{
          background: 'white',
          marginTop: '3%',
          marginLeft: '3%',
          fontSize: '18px',
          marginBottom: '5%',
        }}
      >
        Create
        <div>
          <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '3%' }}>
            <TextField
              id='title'
              style={{ background: 'white' }}
              label='Title'
              type='text'
              fullWidth
              variant='outlined'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
            <TextField
              multiline={true}
              rows={2}
              id='description'
              style={{ background: 'white' }}
              label='Description'
              type='text'
              fullWidth
              variant='outlined'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: '5px', marginLeft: '20px', marginRight: '20px' }}>
          {questions.length && questions.map((item, i) => (
            <NewQuestionCard
              key={item.id}
              question={item}
              index={i}
              addNewQuestion={addInput}
              handleChange={handleChange}
              // removeQuestion={(index)=>removeFormFields(index)}
              pentool={pentool}
              reset = {reset}
            />
          ))}
        </div>
        <Button
          variant='contained'
          color='primary'
          style={{
            float: 'right',
            marginRight: '20px',
            marginTop: '10px',
            width: '250px',
          }}
          onClick={addInput}
        >
          <AddIcon /> Add Question
        </Button>
        {questions.length > 1 &&
        <Button
          variant='contained'
          color='primary'
          style={{
            float: 'right',
            marginRight: '20px',
            marginTop: '10px',
            width: '250px',
          }}
          onClick={()=>removeFormFields(questions.length-1)}
        >
          <RemoveIcon /> Remove Question
        </Button> }
      </div>
      <div
        style={{
          marginTop: '15px',
          display: 'flex',
          background: '#D4D4D4',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '2% 10%',
          flexDirection: window.innerWidth < 500 ? 'column' : 'row',
        }}
      >
        <h4>Allow Students to</h4>
        <div
          style={{
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '20px',
            background: 'white',
            padding: '0 15px 0 8px',
            borderRadius: '2px',
          }}
        >
          <Checkbox value='checkedA' />
          <CloudUploadIcon />
          Upload File
        </div>
        <div
          style={{
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            padding: '0 15px 0 8px',
            borderRadius: '2px',
          }}
        >
          <Checkbox value={pentool} checked={pentool} onChange={(e) => setPentool(e.target.checked)} />
          <CreateIcon />
          Use Pen Tool
        </div>
      </div>
      <div></div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row-reverse wrap',
          marginTop: '3%',
          marginRight: '20px',
        }}
      >
        <div>
          <Button
            variant='contained'
            color='primary'
            style={{ padding: '5px', width: '250px' }}
            onClick={handleCreateHW}
          >
            Create HomeWork
          </Button>
        </div>
        <div>
          <Button
            variant='contained'
            color='#9E9E9E'
            style={{ padding: '5px', width: '250px', marginLeft: '-5%' }}
            onClick={handleClose}
          >
            Clear
          </Button>
        </div>
      </div>
    </>
  );
};
export default CreateHomeWorkDialog;
