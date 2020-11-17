import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const EditSubject = ({id,name,desc,handleGoBack,setLoading}) => {

  const subName=name.split("_").pop()
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState(subName || '')
  const [description,setDescription]=useState(desc || '')
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

 
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let request={}
    request['subject_id']=id
      if((subjectName!==subName && subjectName!=="")||(description!==desc && description!==""))
      {
        if(subjectName!==subName && subjectName!=="")
        request['subject_name']=subjectName
        if(description!==desc && description!=="")
        request['subject_description']=description

        axiosInstance.put(endpoints.masterManagement.updateSubject,request).then(result=>{
          if (result.status === 200) {
            handleGoBack()
            setSubjectName('')
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
      else
      {
        setAlert('error', 'No Fields to Update');
        setLoading(false);
      }
    };


  return (
     
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <div style={{color:'#014B7E'}} >
              <h2>Edit Subject</h2>
        </div>
        <div style={{margin:'40px auto'}}>
          <hr />
        </div>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <TextField
              id='subname'
              label='Subject Name'
              variant='outlined'
              style={{ width: '100%' }}
              size='small'
              value={subjectName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:10}}
              name='subname'
              onChange={e=>setSubjectName(e.target.value)}
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
            />
          </Grid>
        </Grid>
        </div>

        <Grid container spacing={isMobile?1:5} style={{ width: '95%', margin: '20px 7px'}} >
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

export default EditSubject;
