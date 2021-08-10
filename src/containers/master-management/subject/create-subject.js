import React, { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateSubject = ({ setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [optional, setOptional] = useState(false);

  const handleChange = (event) => {
    setOptional(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createSubject, {
        subject_name: subjectName,
        description: description,
        is_optional: optional,
      })
      .then((result) => {
        if (result.data.status_code === 201) {
          setSubjectName('');
          setDescription('');
          setLoading(false);
          setOptional(false);
          handleGoBack();
          setAlert('success', ` ${result.data?.message || result.data?.msg}`);
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='subname'
              style={{ width: '100%' }}
              label='Subject Name'
              variant='outlined'
              size='small'
              value={subjectName}
              // inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
              inputProps={{ maxLength: 20 }}
              name='subname'
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='description'
              label='Description'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              multiline
              rows={4}
              rowsMax={6}
              inputProps={{ maxLength: 100 }}
              value={description}
              name='description'
              onChange={(e) => setDescription(e.target.value)}
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
                  name='optional'
                  color='primary'
                />
              }
              label={
                <Typography color='secondary'>
                  {optional ? 'Optional' : 'Not-Optional'}
                </Typography>
              }
            />
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
            style={{color:'white', width: '100%' }}
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

export default CreateSubject;
