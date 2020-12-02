import React , { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme, Switch, FormControlLabel } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateSubject = ({grades,setLoading,handleGoBack}) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName,setSubjectName]=useState('')
  const [description,setDescription]=useState('')
  const [selectedGrade,setSelectedGrade]=useState([])
  const [selectedSection,setSelectedSection]=useState([])
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [sections,setSections]=useState([])
  const [optional,setOptional] = useState(false)

  const {role_details}=JSON.parse(localStorage.getItem('userDetails'))

  const handleChange = (event) => {
    setOptional(event.target.checked)
  }

  const handleGrade = (event, value) => {
    if(value)
      {
        setSelectedGrade(value)
        axiosInstance.get(`${endpoints.masterManagement.sections}?branch_id=${role_details.branch[0]}&grade_id=${value.id}`)
        .then(result=>{
          if(result.data.status_code===200)
          {
            setSections(result.data.data)
          }
          else
          {
            setAlert('error','Network Error!')
            setSections([])
            setSelectedSection([])
          }
        })
        .catch(error=>{
          setAlert('error', 'Sections Unavailable!');
          setSelectedSection([])
          setSections([])
        })
      }
    else
      {
        setSelectedGrade([])
        setSelectedSection([])
        setSections([])
      }
  };

  const handleSection = (event, value) => {
    if(value)
      setSelectedSection(value)
    else
      setSelectedSection([])
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
      axiosInstance.post(endpoints.masterManagement.createSubject,{
        subject_name:subjectName,
        grade_id:selectedGrade.id,
        section_name:selectedSection.section__section_name,
        section_id:selectedSection.section_id,
        branch_id:role_details.branch[0],
        description:description,
        is_optional:optional
      }).then(result=>{
      if (result.data.status_code === 201) {
        setSubjectName('')
        setSelectedGrade('')
        setSelectedSection('')
        setDescription('')
        setLoading(false)
        setOptional(false)
        setAlert('success', 'Subject added successfully!');
      } else {
        setLoading(false);
        setAlert('error','Network Error!')
      }
      }).catch((error)=>{
        setLoading(false);
        setAlert('error', "Subject couldn't be created!");
      })
    };

  return (
      <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto'}}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <Autocomplete
              size='small'
              onChange={handleGrade}
              style={{ width: '100%' }}
              id='grade'
              options={grades}
              value={selectedGrade}
              getOptionLabel={(option) => option?.grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <Autocomplete
              size='small'
              onChange={handleSection}
              style={{ width: '100%' }}
              id='section'
              options={sections}
              value={selectedSection}
              getOptionLabel={(option) => option?.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Section'
                  placeholder='Sections'
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              id='subname'
              style={{ width: '100%' }}
              label='Subject Name'
              variant='outlined'
              size='small'
              value={subjectName}
              inputProps={{pattern:'^[a-zA-Z0-9 ]+',maxLength:20}}
              name='subname'
              onChange={e=>setSubjectName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
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
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              className='switchLabel'
              control={
                <Switch 
                checked={optional} 
                onChange={handleChange} 
                name="optional" 
                color="primary"
                />}
                label={optional?'Optional':'Not-Optional'}
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

export default CreateSubject;
