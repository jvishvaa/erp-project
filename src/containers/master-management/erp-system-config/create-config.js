import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme, useMediaQuery, Box } from '@material-ui/core';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { createErpSystemConfig } from './apis';

const isSuccess = (status) => status > 199 && status < 300;

const CreateConfig = ({ setLoading, setConfigUI, editDetails = '', setEditDetails }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [payload, setPayload] = useState({
    config_key: editDetails?.config_key || '',
    config_value: editDetails?.config_value || '',
  });
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleChange = (event = {}) => {
    const key = event?.target?.name;
    const value = event?.target?.value;
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let requestBody = {
        ...payload,
      };
      if (editDetails) {
        const modified_config_value = payload.config_value
          .split(',')
          .map((item) => item.trim())
          .join(',');
        requestBody = {
          ...requestBody,
          erpsysconfig_id: editDetails?.id,
          config_value: modified_config_value,
        };
      }
      const { status = 400, message = 'Error' } = await createErpSystemConfig(
        requestBody,
        editDetails
      );
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
      if (isSuccesful) {
        setConfigUI('list');
        setEditDetails();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Box style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='config_key'
              style={{ width: '100%' }}
              label='Config Key'
              variant='outlined'
              size='small'
              value={payload?.config_key}
              name='config_key'
              onChange={(e) => handleChange(e)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='config_value'
              label='Config Value'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              inputProps={{ maxLength: 100 }}
              InputProps={{
                startAdornment: (
                  <Box
                    style={{
                      marginRight: '10px',
                      fontWeight: 600,
                    }}
                  >{`{`}</Box>
                ),
                endAdornment: (
                  <Box style={{ marginLeft: '10px', fontWeight: 600 }}>{`}`}</Box>
                ),
              }}
              value={payload?.config_value}
              name='config_value'
              onChange={(e) => handleChange(e)}
              required
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={() => setConfigUI('list')}
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

export default CreateConfig;
