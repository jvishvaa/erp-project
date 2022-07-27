import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateGrade = ({ setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName, setGradeName] = useState('');
  const [gradeType, setGradeType] = useState('');

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createGrade, {
        grade_name: gradeName,
        grade_type: gradeType,
      })
      .then((result) => {
        if (result.data.status_code === 201) {
          {
            setGradeName('');
            setGradeType('');
            setLoading(false);
            setAlert('success', `Grade ${result.data?.message || result.data?.msg}`);
          }
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error?.response?.data?.message || error?.response?.data?.msg);
      });
  };

  function capitalize(str) {
    return str.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <abbr title={gradeName} style={{ textDecoration: 'none' }}>
              <TextField
                id='gradename'
                label='Grade Name'
                style={{ width: '100%' }}
                variant='outlined'
                size='small'
                value={gradeName}
                inputProps={{ pattern: '^[a-zA-Z0-9 +_-]+', maxLength: 50 }}
                name='gradename'
                onChange={(e) => setGradeName(capitalize(e.target.value))}
                required
              />
            </abbr>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <abbr title={gradeType} style={{ textDecoration: 'none' }}>
              <TextField
                id='gradetype'
                label='Grade Type'
                variant='outlined'
                size='small'
                style={{ width: '100%' }}
                value={gradeType}
                inputProps={{ maxLength: 50 }}
                name='gradetype'
                onChange={(e) => setGradeType(e.target.value)}
                required
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

export default CreateGrade;
