import React , { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const EditGrade = ({id,name,type,handleGoBack,setLoading}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName,setGradeName]=useState(name||'')
  const [gradeType,setGradeType]=useState(type||'')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let request={}
    if(gradeName!=="" && gradeName!==name)
    request['grade_name']=gradeName
    if(gradeType!=="" && gradeType!==type)
    request['grade_type']=gradeType
    request['grade_id']=id

    if((gradeName!=="" && gradeName!==name)||(gradeType!=="" && gradeType!==type))
    {
      axiosInstance.put(endpoints.masterManagement.updateGrade,request)
      .then(result=>{
      if (result.status === 200) {
        {
          handleGoBack()
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
    }
    else
    {
      setLoading(false);
      setAlert('error','No Fields to Update')
    }
    };


  return (
    <div className='create__class'>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Grid item style={{marginLeft:'14px',color:'#014B7E'}} >
              <h1>Edit Grade</h1>
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
              inputProps={{maxLength:10}}
              value={gradeName}
              name='gradename'
              onChange={e=>setGradeName(e.target.value)}
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
              inputProps={{maxLength:10}}
              value={gradeType}
              name='gradetype'
              onChange={e=>setGradeType(e.target.value)}
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

export default EditGrade;
