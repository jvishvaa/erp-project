import React , { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const EditSection = ({id,name}) => {

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [sectionName,setSectionName]=useState(name || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData=new FormData()
    
    if(sectionName!==name && sectionName!=="")
    formData.append('section_name',sectionName)
    formData.append('section_id',id)
    if(sectionName!==name && sectionName!=="")
    {
      axiosInstance.put(endpoints.masterManagement.updateSection,formData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(result=>{
        if (result.status === 200) {
          setAlert('success', result.data.message);
          setSectionName('')
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
              <h1>Edit Section</h1>
        </Grid>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='secname'
              label='Section Name'
              variant='outlined'
              size='medium'
              value={sectionName}
              name='secname'
              onChange={e=>setSectionName(e.target.value)}
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

export default EditSection;
