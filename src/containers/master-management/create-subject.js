import React , { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const CreateSubject = ({grades}) => {

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState('')
  const [gradeId,setGradeId]=useState('')
  const [gradeName,setGradeName]=useState('')
  const [description,setDescription]=useState('')

  const handleGrade = (event, value) => {
    if(value)
    {
      setGradeId(value.id)
      setGradeName(value.grade_name)
    }
    else
    {
      setGradeId('')
      setGradeName('')
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if(gradeName==="" && gradeId==="")
    setAlert('error','Select grade from the list')
    else
    {
      axiosInstance.post(endpoints.masterManagement.createSubject,{
        subject_name:subjectName,
        grade_name:gradeName,
        grade_id:gradeId,
        branch_id:JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0],
        description:description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(result=>{
      if (result.data.status_code === 201) {
        setAlert('success', result.data.message);
        setSubjectName('')
        setGradeName('')
        setGradeId('')
        setDescription('')
      } else {
        setAlert('error', result.data.message);
      }
      }).catch((error)=>{
        setAlert('error', error.message);
      })
    }
    };


  return (
      <div className='create__class'>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Grid item style={{marginLeft:'14px',color:'#014B7E'}} >
              <h1>Add Subject</h1>
        </Grid>
        <hr/>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='subname'
              label='Subject Name'
              variant='outlined'
              size='medium'
              value={subjectName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+'}}
              name='subname'
              onChange={e=>setSubjectName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container className='create-class-container' >
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size='medium'
              onChange={handleGrade}
              id='grade'
              options={grades}
              getOptionLabel={(option) => option?.grade_name}
              filterSelectedOptions
              required
              renderInput={(params) => (
                <TextField
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Grades'
                  placeholder='Grades'
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='description'
              label='Description'
              variant='outlined'
              size='medium'
              multiline
              rows={4}
              rowsMax={6}
              inputProps={{maxLength:100}}
              value={description}
              name='description'
              onChange={e=>setDescription(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container className='create-class-container' >
          <Button variant='contained' color='primary' size='large' type='submit'>
            SUBMIT
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateSubject;
