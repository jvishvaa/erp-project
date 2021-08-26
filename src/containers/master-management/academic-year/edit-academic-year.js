import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditAcademicYear = ({ id, year, handleGoBack, setLoading }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [sessionYear, setSessionYear] = useState(year || '');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    let request = {};
    request['academic_year_id'] = id;
    if (sessionYear !== '' && sessionYear !== year) {
      request['session_year'] = sessionYear;
      axiosInstance
        .put(`${endpoints.masterManagement.updateAcademicYear}${id}`, request)
        .then((result) => {
          if (result.data.status_code === 200) {
            handleGoBack();
            setSessionYear('');
            setLoading(false);
            setAlert(
              'success',
              ` Academic Year ${result.data.message || result.data.msg}`
            );
          } else {
            setLoading(false);
            setAlert('error', result.data.message || result.data.msg);
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
            <TextField
              id='sessionyear'
              label='Academic Year'
              variant='outlined'
              style={{ width: '100%' }}
              size='small'
              inputProps={{ maxLength: 7, pattern: '^[0-9]{4}-[0-9]{2}' }}
              value={sessionYear}
              name='sessionyear'
              onChange={(e) => setSessionYear(e.target.value)}
            />
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
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

export default EditAcademicYear;
