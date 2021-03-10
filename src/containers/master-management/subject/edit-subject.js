import React, { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditSubject = ({ subjectData, handleGoBack, setLoading }) => {
  const { id, subject_name, subject_description: desc, is_optional: opt } = subjectData;
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName, setSubjectName] = useState(subject_name || '');
  const [description, setDescription] = useState(desc || '');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [optional, setOptional] = useState(opt || false);

  const handleChange = (event) => {
    setOptional(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let request = {};
    // request['subject_id'] = id;
    if (
      (subjectName !== subject_name && subjectName !== '') ||
      (description !== desc && description !== '') ||
      (optional !== opt && optional !== '')
    ) {
      if (subjectName !== subject_name && subjectName !== '')
        request['subject_name'] = subjectName;
      if (description !== desc && description !== '')
        request['subject_description'] = description;
      if (optional !== opt && optional !== '') request['is_optional'] = optional;

      axiosInstance
        .put(`${endpoints.masterManagement.updateSubject}${id}`, request)
        .then((result) => {
          if (result.data.status_code === 201) {
            handleGoBack();
            setSubjectName('');
            setDescription('');
            setOptional(false);
            setLoading(false);
            setAlert('success', result.data.message || result.data.msg);
          } else {
            setLoading(false);
            setAlert('error', result.data.message || result.data.msg);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message||error.response.data.msg);
        });
    } else {
      setAlert('error', 'No Fields to Update');
      setLoading(false);
    }
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='subname'
              label='Subject Name'
              variant='outlined'
              style={{ width: '100%' }}
              size='small'
              value={subjectName}
              inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
              name='subname'
              onChange={(e) => setSubjectName(e.target.value)}
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
              label={optional ? 'Optional' : 'Not-Optional'}
            />
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            className='custom_button_master labelColor'
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master'
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

export default EditSubject;
