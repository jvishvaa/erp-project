import React , { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateSubject = ({grades,setLoading}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState('')
  const [description,setDescription]=useState('')
  const [selectedGrade,setSelectedGrade]=useState('')

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
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:20}}
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
              value={selectedGrade}
              getOptionLabel={(option) => option.grade_name}
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
          <Button variant='contained' color ="primary" className="custom_button" size='large' type='submit'>
            SUBMIT
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateSubject;
