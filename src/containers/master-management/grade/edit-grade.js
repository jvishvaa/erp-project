import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditGrade = ({ id, name, type, handleGoBack, setLoading }) => {
  console.log('idL', id);
  console.log('handlegoback:', handleGoBack);
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName, setGradeName] = useState(name || '');
  const [gradeType, setGradeType] = useState(type || '');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let request = {};
    if (gradeName !== '' && gradeName !== name) request['grade_name'] = gradeName;
    if (gradeType !== '' && gradeType !== type) request['grade_type'] = gradeType;
    request['grade_id'] = id;

    if (
      (gradeName !== '' && gradeName !== name) ||
      (gradeType !== '' && gradeType !== type)
    ) {
      axiosInstance
        .put(`${endpoints.masterManagement.updateGrade}${id}`, request)
        .then((result) => {
          if (result.data.status_code > 199 && result.data.status_code < 300) {
            handleGoBack();
            setGradeName('');
            setGradeType('');
            setLoading(false);
            setAlert('success', `Grade ${result.data?.message || result.data?.msg}`);
          } else {
            setLoading(false);
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    } else {
      setLoading(false);
      setAlert('error', 'No Fields to Update');
    }
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <abbr title={gradeName} style={{ textDecoration: 'none' }}>
              <TextField
                className='create__class-textfield'
                id='gradename'
                label='Grade Name'
                variant='outlined'
                style={{ width: '100%' }}
                size='small'
                inputProps={{ maxLength: 50 }}
                value={gradeName}
                name='gradename'
                onChange={(e) => setGradeName(e.target.value)}
              />
            </abbr>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <abbr title={gradeType} style={{ textDecoration: 'none' }}>
              <TextField
                className='create__class-textfield'
                id='gradetype'
                label='Grade Type'
                variant='outlined'
                size='small'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 50 }}
                value={gradeType}
                name='gradetype'
                onChange={(e) => setGradeType(e.target.value)}
              />
            </abbr>
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditGrade;
