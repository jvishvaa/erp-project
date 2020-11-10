import React , { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateSection = ({grades,setLoading}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [sectionName,setSectionName]=useState('')
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
      setLoading(false)
      setAlert('error','Select grade from the list')
    }
    else 
    {
      axiosInstance.post(endpoints.masterManagement.createSection,{
        section_name:sectionName,
        grade_name:selectedGrade.grade_name,
        grade_id:selectedGrade.id,
        branch_id:JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0]
      }).then(result=>{
      if (result.data.status_code === 201) {
        setSectionName('')
        setSelectedGrade('')
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
              <h1>Add Section</h1>
        </Grid>
        <hr/>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='secname'
              label='Section Name'
              variant='outlined'
              size='medium'
              value={sectionName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:10}}
              name='secname'
              onChange={e=>setSectionName(e.target.value)}
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
              value={selectedGrade}
              options={grades}
              getOptionLabel={(option) => option?.grade_name}
              filterSelectedOptions
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
       
        <Grid container className='create-class-container' >
          <Button variant='contained' className='custom_button' color='primary' size='large' type='submit'>
            SUBMIT
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateSection;
