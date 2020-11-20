import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateSection = ({grades,setLoading,handleGoBack}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [sectionName,setSectionName]=useState('')
  const [selectedGrade,setSelectedGrade]=useState('')
  const themeContext = useTheme()
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));


  const handleGrade = (event, value) => {
    if(value)
      setSelectedGrade(value)
    else
      setSelectedGrade([])
  };
  

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
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
      setAlert('success', "Section created successfully!");
    } else {        
      setLoading(false);
      setAlert('error', "Network Error!");
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', "Section couldn't be created!");
    })
    };


  return (
    
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto'}}> 
        {/* <div style={{color:'#014B7E'}} >
              <h2>Add Section</h2>
        </div>
        <div style={{margin:'20px auto'}}>
          <hr />
        </div> */}
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              className='create__class-textfield'
              id='secname'
              label='Section Name'
              variant='outlined'
              size='small'
              value={sectionName}
              style={{ width: '100%' }}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:10}}
              name='secname'
              onChange={e=>setSectionName(e.target.value)}
              required
            />
          </Grid>
          </Grid>
          <Grid container spacing={5} >
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <Autocomplete
              size='small'
              onChange={handleGrade}
              id='grade'
              value={selectedGrade}
              style={{ width: '100%' }}
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

export default CreateSection;
