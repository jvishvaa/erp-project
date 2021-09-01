import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateBranch = ({ setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [address, setAddress] = useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createBranch, {
        branch_name: branchName,
        branch_code: branchCode,
        address: address,
      })
      .then((result) => {
        if (result.data.status_code >= 200 && result.data.status_code <= 299) {
          setBranchName('');
          setBranchCode('');
          setAddress('');
          setLoading(false);
          setAlert('success', result.data.msg || result.data.message);
          handleGoBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.msg || result.data.message);
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
              label='Branch Name'
              variant='outlined'
              size='small'
              value={branchName}
              inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
              name='branchname'
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='branchcode'
              style={{ width: '100%' }}
              label='Branch Code'
              variant='outlined'
              size='small'
              value={branchCode}
              inputProps={{ pattern: '^[0-9]+$', maxLength: 3 }}
              name='branchcode'
              onChange={(e) => setBranchCode(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='address'
              label='Address'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              multiline
              rows={4}
              rowsMax={6}
              inputProps={{ maxLength: 100 }}
              value={address}
              name='address'
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            className='labelColor'
            style={{ width: '100%' }}
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

export default CreateBranch;
