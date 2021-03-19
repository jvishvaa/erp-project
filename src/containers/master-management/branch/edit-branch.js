import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme, Switch, FormControlLabel } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const EditBranch = ({ branchData, handleGoBack, setLoading }) => {

  const { setAlert } = useContext(AlertNotificationContext);
  const {id,branch_name,branch_code,address} = branchData;

  const [branchName, setBranchName] = useState(branch_name||'');
  const [branchCode, setBranchCode] = useState(branch_code||'');
  const [branchAddress, setBranchAddress] = useState(address||'');

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let request = {}
    request['branch_id'] = id;
    if ((branchName !== branch_name && branchName !== "") || (branchAddress !== address && branchAddress !== "") || (branchCode !== branch_code && branchCode !== "")) {
      if (branchName !== branch_name && branchName !== "")
        request['branch_name'] = branchName;
      if (branchAddress !== address && branchAddress !== "")
        request['address'] = branchAddress;
      if (branchCode !== branch_code && branchCode !== "")
        request['branch_code'] = branchCode;

      axiosInstance.put(`${endpoints.masterManagement.updateBranch}${id}`, request)
      .then(result => {
        if (result.data.status_code === 200) {
          handleGoBack();
          setLoading(false);
          setAlert('success', result.data.message||result.data.msg);
        } else {
          setLoading(false);
          setAlert('error', result.data.message||result.data.msg);
        }
      }).catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message||error.response.data.msg);
      })
    }
    else {
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
              style={{ width: '100%' }}
              label='Branch Name'
              variant='outlined'
              size='small'
              value={branchName}
              inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
              name='branchname'
              onChange={(e) => setBranchName(e.target.value)}
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
              value={branchAddress}
              name='address'
              onChange={(e) => setBranchAddress(e.target.value)}
            />
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }} >
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button variant='contained' className="custom_button_master labelColor" size='medium' onClick={handleGoBack}>
            Back
            </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button variant='contained' style={{ color: 'white' }} color="primary" className="custom_button_master" size='medium' type='submit'>
            Submit
            </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditBranch;
