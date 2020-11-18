import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateSubject = ({grades,setLoading,handleGoBack}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState('')
  const [description,setDescription]=useState('')
  const [selectedGrade,setSelectedGrade]=useState('')
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));


  const handleGrade = (event, value) => {
    if(value)
      setSelectedGrade(value)
    else
      setSelectedGrade('')
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    if(selectedGrade==="")
    { 
      setLoading(false);
      setAlert('error','Select grade from the list')
    }
    else
    {
      axiosInstance.post(endpoints.masterManagement.createSubject,{
        subject_name:subjectName,
        grade_name:selectedGrade.grade_name,
        grade_id:selectedGrade.id,
        branch_id:JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0],
        description:description
      }).then(result=>{
      if (result.data.status_code === 201) {
        setSubjectName('')
        setSelectedGrade('')
        setDescription('')
        setLoading(false);
        setAlert('success', result.data.message);
      } else {
        setLoading(false);
        setAlert('error', result.data.message);
      }
      }).catch((error)=>{
        setLoading(false);
        setAlert('error', error.message);
      })
    }
    };


  return (
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto'}}>
        <div style={{color:'#014B7E'}} >
              <h2>Add Subject</h2>
        </div>
        <div style={{margin:'40px auto'}}>
          <hr />
        </div>
        <Grid container spacing={5} >
          <Grid item xs={12} sm={4}>
            <TextField
              id='subname'
              style={{ width: '100%' }}
              label='Subject Name'
              variant='outlined'
              size='small'
              value={subjectName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:20}}
              name='subname'
              onChange={e=>setSubjectName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5} >
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size='small'
              onChange={handleGrade}
              style={{ width: '100%' }}
              id='grade'
              options={grades}
              value={selectedGrade}
              getOptionLabel={(option) => option.grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <TextField
              id='description'
              label='Description'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
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
        </div>
        <Grid container spacing={isMobile?1:5} style={{ width: '95%', margin: '20px 10px'}} >
          <Grid item xs={6} sm={2}>
            <Button variant='contained' style={{color:'white'}} color ="primary" className="custom_button_master" size='medium' type='submit'>
              Submit
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button variant='contained' className="custom_button_master" size='medium' onClick={handleGoBack}>
              Back
            </Button>
          </Grid>
        </Grid>
      </form>
  );
};

export default CreateSubject;
