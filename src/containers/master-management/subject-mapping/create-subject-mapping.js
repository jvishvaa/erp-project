import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { set } from 'lodash';

const CreateSubjectMapping = ({ setLoading, handleGoBack }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const [dropDown, setDropDown] = useState({
    sessionDrop: [],
    branchDrop: [],
    gradeDrop: [],
    sectionDrop: [],
    subjectDrop: [],
  });

  const [filterData, setFilterData] = useState({
    session: [],
    branch: [],
    grade: [],
    section: [],
    subject: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createSubjectMapping, {
        session_year: 1,
        branch_id: 1,
        grade_id: 1,
        section_id: 1,
        subject_id: 2,
      })
      .then((result) => {
        if (result.data?.status_code === 201) {
          setLoading(false);
          handleGoBack();
          setAlert('success', result.data?.message || result.data?.msg);
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
    let url = `${endpoints.masterManagement.academicYear}`;
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropDown({
            sessionDrop: result.data?.result?.results,
            branchDrop: [],
            gradeDrop: [],
            sectionDrop: [],
            subjectDrop: [],
          });
        } else {
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.response?.data?.message || error.response?.data?.msg);
      });
  }, []);

  const handleAcademicYear = (event, value) => {
    setFilterData({
      session: [],
      branch: [],
      grade: [],
      section: [],
      subject: [],
    });
    if (value?.length > 0) {
      setFilterData({
        session: value,
        branch: [],
        grade: [],
        section: [],
        subject: [],
      });
    }
  };

  // const handleAcademicYear = (event, value) => {
  //   setFilterData({
  //     session: [],
  //     branch: [],
  //     grade: [],
  //     section: [],
  //     subject: [],
  //   });
  //   if (value?.length > 0) {
  //     // const ids
  //     axiosInstance
  //       .get(`${endpoints.masterManagement.branchMappingTable}`)
  //       .then((result) => {
  //         if (result.data.status_code === 200) {
  //           // setBranchDrop(result.data.result.results);
  //           // console.log(result.data.result.results,"==========");
  //         } else {
  //           setAlert('error', result.data?.message || result.data?.msg);
  //         }
  //       })
  //       .catch((error) => {
  //         setAlert('error', error.response?.data?.message || error.response?.data?.msg);
  //       });
  //   }
  // };

  // const handleBranch = (event, value) => {
  //   setFilterData({
  //     ...filterData,
  //     branch: [],
  //     grade: [],
  //     section: [],
  //     subject: [],
  //   });
  //   if (value.length > 0) {
  //     setFilterData({
  //       ...filterData,
  //       branch: value,
  //       grade: [],
  //       section: [],
  //       subject: [],
  //     });
  //   }
  // };

  // const handleGrade = (event, value) => {
  //   setFilterData({
  //     ...filterData,
  //     grade: [],
  //     section: [],
  //     subject: [],
  //   });
  //   if (value.length > 0) {
  //     setFilterData({
  //       ...filterData,
  //       grade: value,
  //       section: [],
  //       subject: [],
  //     });
  //   }
  // };

  // const handleSection = (event, value) => {
  //   setFilterData({
  //     ...filterData,
  //     section: [],
  //     subject: [],
  //   });
  //   if (value.length > 0) {
  //     setFilterData({
  //       ...filterData,
  //       section: value,
  //       subject: [],
  //     });
  //   }
  // };

  // const handleSubject = (event, value) => {
  //   setFilterData({
  //     ...filterData,
  //     subject: [],
  //   });
  //   if (value.length > 0) {
  //     setFilterData({
  //       ...filterData,
  //       subject: value,
  //     });
  //   }
  // };

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
              options={dropDown?.sessionDrop}
              value={filterData?.session}
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
              multiple
              size='small'
              // onChange={handleBranch}
              style={{ width: '100%' }}
              id='branch'
              name='branch'
              options={dropDown?.branchDrop}
              value={filterData?.branch}
              // getOptionLabel={(option) => option?.session_year}
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
              // onChange={handleGrade}
              style={{ width: '100%' }}
              id='grade'
              name='grade'
              options={dropDown?.gradeDrop}
              value={filterData?.grade}
              // getOptionLabel={(option) => option?.session_year}
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
              // onChange={handleSection}
              style={{ width: '100%' }}
              id='section'
              name='section'
              options={dropDown?.sectionDrop}
              value={filterData?.section}
              // getOptionLabel={(option) => option?.session_year}
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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <Autocomplete
              multiple
              size='small'
              // onChange={handleSubject}
              style={{ width: '100%' }}
              id='subject'
              name='subject'
              options={dropDown?.subjectDrop}
              value={filterData?.subject}
              // getOptionLabel={(option) => option?.session_year}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
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

export default CreateSubjectMapping;
