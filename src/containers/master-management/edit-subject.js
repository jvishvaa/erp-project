import React , { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';


const EditSubject = ({id,name,desc,handleGoBack}) => {

  const subName=name.split("__").pop()
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState(subName || '')
  const [description,setDescription]=useState(desc || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    let request={}

    request['subject_id']=id
      if((subjectName!==subName && subjectName!=="")||(description!==desc && description!==""))
      {
        if(subjectName!==subName && subjectName!=="")
        request['subject_name']=subjectName
        if(description!==desc && description!=="")
        request['subject_description']=description

        axiosInstance.put(endpoints.masterManagement.updateSubject,request, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(result=>{
          if (result.status === 200) {
            setAlert('success', result.data.message);
            handleGoBack()
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
        <Grid item style={{marginLeft:'14px',color:'#014B7E'}} >
              <h1>Edit Subject</h1>
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
              inputProps={{pattern:'^[a-zA-Z0-9 ]+'}}
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
              multiline
              rows={4}
              rowsMax={6}
              inputProps={{maxLength:100}}
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
