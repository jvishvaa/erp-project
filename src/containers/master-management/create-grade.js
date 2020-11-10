import React , { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateGrade = ({setLoading}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName,setGradeName]=useState('')
  const [gradeType,setGradeType]=useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    axiosInstance.post(endpoints.masterManagement.createGrade,{
      grade_name:gradeName,
      grade_type:gradeType,
    }).then(result=>{
    if (result.data.status_code === 201) {
      {
        setGradeName('')
        setGradeType('')
        setLoading(false);
        setAlert('success', result.data.message);
      }
    } else {
      setLoading(false);
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setLoading(false);
      setAlert('error', error.message);
    })
    };


  return (
      <div className='create__class'>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Grid item style={{marginLeft:'14px',color:'#014B7E'}} >
              <h1>Add Grade</h1>
        </Grid>
        <hr/>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='gradename'
              label='Grade Name'
              variant='outlined'
              size='medium'
              value={gradeName}
              inputProps={{maxLength:10}}
              name='gradename'
              onChange={e=>setGradeName(e.target.value)}
              required
            />
          </Grid>
          </Grid>
          <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='gradetype'
              label='Grade Type'
              variant='outlined'
              size='medium'
              value={gradeType}
              inputProps={{maxLength:10}}
              name='gradetype'
              onChange={e=>setGradeType(e.target.value)}
              required
            />
          </Grid>
        </Grid>
       
        <Grid container className='create-class-container'>
          <Button variant='contained' className='custom_button' color='primary' size='large' type='submit'>
              SUBMIT
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateGrade;
