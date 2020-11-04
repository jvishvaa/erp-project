import React , { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


const EditSubject = ({id,name,desc}) => {

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState(name || '')
  const [description,setDescription]=useState(desc || '')

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData=new FormData()
    if(subjectName!==name && subjectName!=="")
      formData.append('subject_name',subjectName)
    
    if(description!==desc && description!=="")
      formData.append('subject_description',description)

    formData.append('subject_id',id)
    if((subjectName!==name && subjectName!=="")||(description!==desc && description!==""))
    {
      axiosInstance.put(endpoints.masterManagement.updateSubject,formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(result=>{
        if (result.status === 200) {
          setAlert('success', result.data.message);
          setSubjectName('')
          setDescription('')
        } else {
          setAlert('error', result.data.message);
        }
      }).catch((error)=>{
        setAlert('error', error.message);
      })
    }
    else
    {
      setAlert('error', 'No Fields to Update');
    }
    };


  return (
      <div className='create__class'>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Grid item style={{marginLeft:'14px'}} >
              <h1>Edit Subject</h1>
        </Grid>
        <Grid container className='create-class-container'>
          <Grid item xs={12} sm={4}>
            <TextField
              className='create__class-textfield'
              id='subname'
              label='Subject Name'
              variant='outlined'
              size='medium'
              value={subjectName}
              name='subname'
              onChange={e=>setSubjectName(e.target.value)}
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
              value={description}
              name='description'
              onChange={e=>setDescription(e.target.value)}
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

export default EditSubject;
