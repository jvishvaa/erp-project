import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';


const EditSectionMapping = ({sectionData,handleGoBack,setLoading}) => {

  const {id, section_name} =sectionData;
  const { setAlert } = useContext(AlertNotificationContext);
  const [sectionName,setSectionName]=useState(section_name || '')
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let request={}
    if(sectionName!==section_name && sectionName!=="")
    {
      request['section_name']=sectionName;
      axiosInstance.put(`${endpoints.masterManagement.updateSection}${id}`,request)
      .then(result=>{
        if (result.data.status_code === 201) {
          handleGoBack();
          setSectionName('')
          setLoading(false);
          setAlert('success', `Mapped Section ${result.data?.msg||result.data?.message}`);
        } else {
          setLoading(false);
          setAlert('error', result.data?.msg||result.data?.message);
        }
      }).catch((error)=>{
        setLoading(false);
        setAlert('error', error.response.data.msg);
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
              id='secname'
              label='Section Name'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={sectionName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:20}}
              name='secname'
              onChange={e=>setSectionName(e.target.value)}
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

export default EditSectionMapping;
