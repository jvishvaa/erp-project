import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditChapterType = ({id,category,handleGoBack,setLoading}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [categoryName,setCategoryName]=useState(category||'')
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    let request={}
    if(categoryName!=="" && categoryName!==category)
    {
      request['category_name']=categoryName
      axiosInstance.put(`${endpoints.masterManagement.updateMessageType}${id}/communicate-type/`,request)
      .then(result=>{
      if (result.data.status_code === 200) {
          handleGoBack()
          setCategoryName('')
          setLoading(false);
          setAlert('success', result.data.message);
      }
      else
      {
        setLoading(false);
        setAlert('warning', result.data.message);
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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              id='categoryname'
              label='Category Name'
              style={{ width: '100%'}}
              variant='outlined'
              size='small'
              value={categoryName}
              inputProps={{maxLength:40}}
              name='categoryname'
              onChange={e=>setCategoryName(e.target.value)}
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

export default EditChapterType;
