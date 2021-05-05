import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { set } from 'lodash';

const CreateSectionMapping = ({ moduleId, setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const [dropDown, setDropDown] = useState({
    sessionDrop: [],
    branchDrop: [],
    gradeDrop: [],
    sectionDrop: [],
  });

  const [filterData, setFilterData] = useState({
    session: [],
    branch: [],
    grade: [],
    section: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createSectionMapping, {
        session_year: filterData.session?.map(({ id }) => id),
        branch_id: filterData.branch?.map(({ id }) => id),
        grade_id: filterData.grade?.map(({ grade_id }) => grade_id),
        section_id: filterData.section?.map(({ id }) => id),
      })
      .then((result) => {
        if (result.data?.status_code > 199 && result.data?.status_code < 300) {
          setLoading(false);
          handleGoBack();
          setAlert('success', `Mapped Section ${result.data?.message || result.data?.msg}`);
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response?.data?.message || error.response?.data?.msg);
      });
  };

  useEffect(() => {
    if (moduleId) {
      let url = `${endpoints.masterManagement.academicYear}?module_id=${moduleId}`;
      axiosInstance
        .get(url)
        .then((result) => {
          if (result.data?.status_code > 199 && result.data?.status_code < 300) {
            setDropDown({
              sessionDrop: result.data?.result?.results,
              branchDrop: [],
              gradeDrop: [],
              sectionDrop: [],
            });
          } else {
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setAlert('error', error.response?.data?.message || error.response?.data?.msg);
        });
    }
  }, [moduleId]);

  const handleAcademicYear = (event, value) => {
    setFilterData({
      session: [],
      branch: [],
      grade: [],
      section: [],
    });
    setDropDown({
      ...dropDown,
      branchDrop: [],
      gradeDrop: [],
      sectionDrop: [],
    });
    if (value?.length > 0) {
      setFilterData({
        session: value,
        branch: [],
        grade: [],
        section: [],
      });
      let ids = value.map(({ id }) => id);
      axiosInstance
        .get(`${endpoints.academics.branches}?session_year=${ids}&module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code > 199 && result.data.status_code < 300) {
            setDropDown({
              ...dropDown,
              branchDrop: result.data?.data?.results.map((obj) => obj?.branch),
              gradeDrop: [],
              sectionDrop: [],
            });
          } else {
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setAlert('error', error.response?.data?.message || error.response?.data?.msg);
        });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({
      ...filterData,
      branch: [],
      grade: [],
      section: [],
    });
    setDropDown({
      ...dropDown,
      gradeDrop: [],
      sectionDrop: [],
    });
    if (value?.length > 0) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: [],
        section: [],
      });
      let ids = value.map(({ id }) => id);
      let sessionIds = filterData.session?.map(({ id }) => id);
      axiosInstance
        .get(
          `${endpoints.masterManagement.gradesDrop}?session_year=${sessionIds}&branch_id=${ids}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code > 199 && result.data.status_code < 300) {
            setDropDown({
              ...dropDown,
              gradeDrop: result.data?.data,
              sectionDrop: [],
            });
          } else {
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setAlert('error', error.response?.data?.message || error.response?.data?.msg);
        });
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({
      ...filterData,
      grade: [],
      section: [],
    });
    setDropDown({
      ...dropDown,
      sectionDrop: [],
    });
    if (value?.length > 0) {
      setFilterData({
        ...filterData,
        grade: value,
        section: [],
      });
      let ids = value.map(({ grade_id }) => grade_id);
      let sessionIds = filterData.session?.map(({ id }) => id);
      let branchIds = filterData.branch?.map(({ id }) => id);
      axiosInstance
        .get(
          `${endpoints.masterManagement.fetchSectionMap}?session_year=${sessionIds}&branch_id=${branchIds}&grade_id=${ids}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code > 199 && result.data.status_code < 300) {
            setDropDown({
              ...dropDown,
              sectionDrop: result.data?.data,
            });
          } else {
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setAlert('error', error.response?.data?.message || error.response?.data?.msg);
        });
    }
  };

  const handleSection = (event, value) => {
    setFilterData({
      ...filterData,
      section: [],
    });
    if (value?.length > 0) {
      setFilterData({
        ...filterData,
        section: value,
      });
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
              options={dropDown?.sessionDrop || []}
              value={filterData?.session || ''}
              getOptionLabel={(option) => option?.session_year || ''}
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
              multiple
              size='small'
              onChange={handleBranch}
              style={{ width: '100%' }}
              id='branch'
              name='branch'
              options={dropDown?.branchDrop || []}
              value={filterData?.branch || ''}
              getOptionLabel={(option) => option?.branch_name || ''}
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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <Autocomplete
              multiple
              size='small'
              onChange={handleGrade}
              style={{ width: '100%' }}
              id='grade'
              name='grade'
              options={dropDown?.gradeDrop || []}
              value={filterData?.grade || ''}
              getOptionLabel={(option) => option?.grade_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <Autocomplete
              multiple
              size='small'
              onChange={handleSection}
              style={{ width: '100%' }}
              id='section'
              name='section'
              options={dropDown?.sectionDrop || []}
              value={filterData?.section || ''}
              getOptionLabel={(option) => option?.section_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Section'
                  placeholder='Section'
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

export default CreateSectionMapping;
