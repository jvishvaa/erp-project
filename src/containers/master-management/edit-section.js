import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const EditSection = ({id,name,handleGoBack,setLoading}) => {

  const secName=name.split("_").pop()
  const { setAlert } = useContext(AlertNotificationContext);
  const [sectionName,setSectionName]=useState(secName || '')
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let request={}
    if(sectionName!==secName && sectionName!=="")
    {
      request['section_name']=sectionName
      request['section_id']=id
      axiosInstance.put(endpoints.masterManagement.updateSection,request)
      .then(result=>{
        if (result.status === 200) {
          handleGoBack()
          setSectionName('')
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
    else
    {
      setLoading(false);
      setAlert('error','No Fields to Update')
    }
    };


  return (
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <div style={{color:'#014B7E'}} >
              <h2>Edit Section</h2>
        </div>
        <div style={{margin:'40px auto'}}>
          <hr />
        </div>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='secname'
              label='Section Name'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={sectionName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:10}}
              name='secname'
              onChange={e=>setSectionName(e.target.value)}
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

export default EditSection;
