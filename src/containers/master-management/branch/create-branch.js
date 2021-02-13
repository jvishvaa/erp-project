import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateBranch = ({ setLoading, handleGoBack, academicYearList }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchEnrCode, setBranchEnrCode] = useState('');
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
        branch_enrollment_code: branchEnrCode,
        address: address,
      })
      .then((result) => {
        if (result.data.status_code >= 200 && result.data.status_code <= 299) {
          setBranchName('');
          setBranchCode('');
          setBranchEnrCode('');
          setAddress('');
          setLoading(false);
          setAlert('success', result.data.msg);
          handleGoBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
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
              inputProps={{ pattern: '^[0-9]+$', maxLength: 5 }}
              name='branchcode'
              onChange={(e) => setBranchCode(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='branchenrollmentcode'
              style={{ width: '100%' }}
              label='Branch Enrollment Code'
              variant='outlined'
              size='small'
              value={branchEnrCode}
              inputProps={{ pattern: '^[0-9]+$', maxLength: 5 }}
              name='branchcode'
              onChange={(e) => setBranchEnrCode(e.target.value)}
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

export default CreateBranch;
