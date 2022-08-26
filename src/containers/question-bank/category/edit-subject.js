import React, { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditSubject = ({ subjectData, handleGoBack, setLoading }) => {
  const {
    id,
    category_name: subject_name,
    description: desc,
    is_subject_dependent: opt,
    addFlag,
  } = subjectData;
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName, setSubjectName] = useState(subject_name || '');
  const [description1, setDescription1] = useState(desc || '');
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
    request['id'] = id;
    if (
      (subjectName !== subject_name && subjectName !== '') ||
      (description1 !== desc && description1 !== '') ||
      (optional !== opt && optional !== '')
    ) {
      // if (subjectName !== subject_name && subjectName !== '')
      //   request['category_name'] = subjectName;
      // if (description1 !== desc && description1 !== '')
      //   request['description'] = description1;
      // if (optional !== opt && optional !== '') 
      //   request['is_subject_dependent'] = optional;

        request['category_name'] = subjectName;
        request['description'] = description1;
        request['is_subject_dependent'] = optional;

      if (addFlag) {
        axiosInstance
          .post(`${endpoints.questionBank.categoryQuestion}`, request)
          .then((result) => {
            if (result.data.status_code === 201) {
              handleGoBack();
              setSubjectName('');
              setDescription1('');
              setOptional(false);
              setLoading(false);
              setAlert('success', ` ${result.data.message || result.data.msg}`);
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
        axiosInstance
          .put(`${endpoints.questionBank.categoryQuestion}`, request)
          .then((result) => {
            debugger
            if (result?.status === 201) {
              handleGoBack();
              setSubjectName('');
              setDescription1('');
              setOptional(false);
              setLoading(false);
              setAlert('success', ` ${result.data[0] || result.data.msg || 'Success'}`);
            } else {
              setLoading(false);
              setAlert('error', result.data.message || result.data[0] || 'Failed');
            }
          })
          .catch((error) => {
            setLoading(false);
            setAlert('error', error.response.data.message || error.response.data.msg || 'Failed');
          });
      }
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
              label='Category Name'
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
              value={description1}
              name='description'
              onChange={(e) => setDescription1(e.target.value)}
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
                  {optional ? 'Subject Dependent' : 'Not Subject Dependent'}
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

export default EditSubject;
