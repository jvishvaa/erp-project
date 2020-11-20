import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateGrade = ({setLoading,handleGoBack}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName,setGradeName]=useState('')
  const [gradeType,setGradeType]=useState('')
  
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

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
        setAlert('success', "Grade created successfully!");
      }
    } else {
      setLoading(false);
      setAlert('error', "Network Error!");
    }
    }).catch((error)=>{
      setLoading(false);
      setAlert('error', "Grade couldn't be created!");
    })
    };


  return (
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto'}}>
        {/* <div style={{color:'#014B7E'}} >
              <h2>Add Grade</h2>
        </div>
        <div style={{margin:'20px auto'}}>
          <hr />
        </div> */}
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              id='gradename'
              label='Grade Name'
              style={{ width: '100%' }}
              variant='outlined'
              size='small'
              value={gradeName}
              inputProps={{maxLength:10}}
              name='gradename'
              onChange={e=>setGradeName(e.target.value)}
              required
            />
          </Grid>
          </Grid>
          <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              id='gradetype'
              label='Grade Type'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={gradeType}
              inputProps={{maxLength:10}}
              name='gradetype'
              onChange={e=>setGradeType(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        </div>
        <Grid container spacing={isMobile?1:5} style={{ width: '95%', margin: '10px'}} >
        <Grid item xs={6} sm={2} className={isMobile?'':'addEditButtonsPadding'}>
            <Button variant='contained' className="custom_button_master labelColor" size='medium' onClick={handleGoBack}>
              Back
            </Button>
          </Grid>
          <Grid item xs={6} sm={2} className={isMobile?'':'addEditButtonsPadding'}>
            <Button variant='contained' style={{color:'white'}} color ="primary" className="custom_button_master" size='medium' type='submit'>
              Submit
            </Button>
          </Grid>
        </Grid>        
      </form>
  );
};

export default CreateGrade;
