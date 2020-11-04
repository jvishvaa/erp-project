import React , { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const EditGrade = ({id,name,type}) => {

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName,setGradeName]=useState(name||'')
  const [gradeType,setGradeType]=useState(type||'')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData=new FormData()
    if(gradeName!=="" && gradeName!==name)
    formData.append('grade_name',gradeName)
    if(gradeType!=="" && gradeType!==type)
    formData.append('grade_type',gradeType)
    formData.append('grade_id',id)
    if((gradeName!=="" && gradeName!==name)||(gradeType!=="" && gradeType!==type))
    {
      axiosInstance.put(endpoints.masterManagement.updateGrade,formData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(result=>{
      if (result.status === 200) {
        {
          setAlert('success', result.data.message);
          setGradeName('')
          setGradeType('')
        }
      } else {
        setAlert('error', result.data.message);
      }
      }).catch((error)=>{
        setAlert('error', error.message);
      })
    }
    else
    {
      setAlert('error','No Fields to Update')
    }
    };


  return (
      <div className='create__class'>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Grid item style={{marginLeft:'14px'}} >
              <h1>Edit Grade</h1>
        </Grid>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='gradename'
              label='Grade Name'
              variant='outlined'
              size='medium'
              value={gradeName}
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
              name='gradetype'
              onChange={e=>setGradeType(e.target.value)}
              required
            />
          </Grid>
        </Grid>
       
        <Grid container className='create-class-container'>
          <Button variant='contained' color='primary' size='large' type='submit'>
          SUBMIT
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default EditGrade;
