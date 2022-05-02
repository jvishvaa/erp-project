import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateBranchAcad = ({ moduleId, setLoading, handleGoBack, academicYearList }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [branch, setBranch] = useState();
  const [branchList, setBranchList] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  useEffect(() => {
    if (moduleId && academicYear.length > 0) {
      let url = `${endpoints.masterManagement.branchList}?module_id=${moduleId}`;
      axiosInstance
        .get(url)
        .then((result) => {
          if (result.data.status_code === 200) {
            setBranchList(result.data?.data);
          } else {
            setBranchList([]);
            setAlert('error', result.data.msg || result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    }
  }, [moduleId, academicYear]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!academicYear.length > 0) {
      setAlert('error', "Please select Session Year");
      return;
    }
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.branchMapping, {
        session_year_id: academicYear.map((value) => value?.id),
        branch_id: branch?.id,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYear([]);
          setBranch('');
          setLoading(false);
          setAlert('success', result.data.msg || result.data.message);
          handleGoBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.data.err_msg || result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        if ((error.response.data.message || error.response.data.msg) == "non_field_errors: The fields session_year, branch must make a unique set.")
          setAlert('error', "Branch is Already Mapped");
      });
  };

  const handleAcademicYear = (event, value) => {
    setAcademicYear([]);
    if (value.length > 0) setAcademicYear(value);
  };

  const handleBranch = (event, value) => {
    setBranch('');
    if (academicYear.length > 0) {
      if (value)
        setBranch(value);
      else {
        setBranchList([])
      }
    }
    else {
      setBranchList([])
    }
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
              options={branchList || []}
              value={branch}
              getOptionLabel={(option) => option?.branch_name || {}}
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
            style={{ width: '100%', fontWeight: '700' }}
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

export default CreateBranchAcad;
