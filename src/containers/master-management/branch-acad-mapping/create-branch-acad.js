import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateBranchAcad = ({ setLoading, handleGoBack, academicYearList }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [branch, setBranch] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  useEffect(() => {
    axiosInstance
      .get(endpoints.masterManagement.branchList)
      .then((result) => {
        setBranchList(result?.data);
      })
      .catch((error) => setAlert('error', error.message));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.branchMapping, {
        session_year_id: academicYear.map((value) => value?.id),
        branch_id: branch?.id,
      })
      .then((result) => {
        if (result.data.status_code >= 200 && result.data.status_code <= 299) {
          setAcademicYear([]);
          setBranch('');
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
        setAlert('error', error.msg);
      });
  };

  const handleAcademicYear = (event, value) => {
    setAcademicYear([]);
    if (value.length > 0) setAcademicYear(value);
  };

  const handleBranch = (event, value) => {
    setBranch('');
    if (value) setBranch(value);
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <Autocomplete
              multiple
              size='small'
              onChange={handleAcademicYear}
              style={{ width: '100%' }}
              id='session-year'
              name='session-year'
              options={academicYearList}
              value={academicYear}
              getOptionLabel={(option) => option?.session_year}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Session Year'
                  placeholder='Session Year'
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <Autocomplete
              size='small'
              onChange={handleBranch}
              style={{ width: '100%' }}
              id='branch'
              name='branch'
              options={branchList}
              value={branch}
              getOptionLabel={(option) => option?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
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

export default CreateBranchAcad;
