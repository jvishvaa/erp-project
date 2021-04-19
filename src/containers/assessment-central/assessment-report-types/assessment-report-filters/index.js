import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import {
  fetchAssessmentReportList,
  // setReportFilters,
  setClearFilters,
} from '../../../../redux/actions';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

const AssessmentReportFilters = ({
  widerWidth,
  isMobile,
  fetchAssessmentReportList,
  fetchAcademicYears,
  fetchBranches,
  // setReportFilters,
  setClearFilters,
  selectedReportType,
  // selectedYear,
  // selectedBranch,
  // selectedGrade,
  // selectedSection,
  // selectedSubject,
  // selectedTopic,
  // selectedTest,
}) => {
  const [dropdownData, setDropdownData] = useState({
    academic: [],
    branch: [],
    grade: [],
    section: [],
    subject: [],
    test: [],
    topic: [],
  });

  const [filterData, setFilterData] = useState({
    academic: {},
    branch: {},
    grade: {},
    section: {},
    subject: {},
    test: {},
    topic: {},
  });

  function getAcademicYear() {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData({ ...dropdownData, academic: result.data.data });
        }
      })
      .catch((error) => {});
  }

  function getBranch(acadId) {
    axiosInstance
      .get(`${endpoints.academics.branches}?session_year=${acadId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData({ ...dropdownData, branch: result.data.data.results });
        }
      })
      .catch((error) => {});
  }

  // function getGrade(acadId,branchId) {
  //   axiosInstance
  //     .get(`${endpoints.academics.branches}?session_year=${acadId}`)
  //     .then((result) => {
  //       if (result.data.status_code === 200) {
  //         setDropdownData({ ...dropdownData, branch: result.data.data.results });
  //       }
  //     })
  //     .catch((error) => {});
  // }

  // function getBranch(acadId) {
  //   axiosInstance
  //     .get(`${endpoints.academics.branches}?session_year=${acadId}`)
  //     .then((result) => {
  //       if (result.data.status_code === 200) {
  //         setDropdownData({ ...dropdownData, branch: result.data.data.results });
  //       }
  //     })
  //     .catch((error) => {});
  // }

  useEffect(() => {
    getAcademicYear();
  }, []);

  const handleAcademicYear = (event, value) => {
    // setReportFilters('selectedYear', {});
    setDropdownData({
      ...dropdownData,
      branch: [],
    });
    setFilterData({ ...filterData, academic: {}, branch: {} });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, academic: value });
      // setReportFilters('selectedYear', value);
    }
  };

  const handleBranch = (event, value) => {
    // setReportFilters('selectedBranch', {});
    setFilterData({ ...filterData, branch: {} });
    if (value) {
      // setReportFilters('selectedBranch', value);
      setFilterData({ ...filterData, branch: value });
    }
  };

  const handleGrade = (event, value) => {
    // setReportFilters('selectedGrade', {});
    if (value) {
      // setReportFilters('selectedGrade', value);
    }
  };

  const handleSubject = (event, value) => {
    // setReportFilters('selectedSubject', {});
    if (value) {
      // setReportFilters('selectedSubject', value);
    }
  };

  const handleSection = (event, value) => {
    // setReportFilters('selectedSection', {});
    if (value) {
      // setReportFilters('selectedSection', value);
    }
  };

  const handleTest = (event, value) => {
    // setReportFilters('selectedTest', {});
    if (value) {
      // setReportFilters('selectedTest', value);
    }
  };

  const handleTopic = (event, value) => {
    // setReportFilters('selectedTopic', {});
    if (value) {
      // setReportFilters('selectedTopic', value);
    }
  };

  const handleClear = () => {
    setClearFilters();
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{
        width: widerWidth,
        margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
      }}
    >
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleAcademicYear}
          id='academic-year'
          className='dropdownIcon'
          value={filterData.academic || {}}
          options={dropdownData.academic || []}
          getOptionLabel={(option) => option?.session_year || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Academic Year'
              placeholder='Academic Year'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='branch'
          className='dropdownIcon'
          value={filterData.branch || {}}
          options={dropdownData.branch || []}
          getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className='dropdownIcon'
          // value={selectedGrade || ''}
          // options={gradeDropdown || []}
          // getOptionLabel={(option) => option?.grade_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>
      {selectedReportType?.id === 3 && (
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleSection}
            id='section'
            className='dropdownIcon'
            // value={selectedGrade || ''}
            // options={gradeDropdown || []}
            // getOptionLabel={(option) => option?.grade_name || ''}
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
      )}
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSubject}
          id='subject'
          className='dropdownIcon'
          // value={selectedSubject || ''}
          // options={subjectDropdown || []}
          // getOptionLabel={(option) => option?.subject?.subject_name || ''}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleTest}
          id='test'
          className='dropdownIcon'
          // value={selectedTest || ''}
          // options={subjectDropdown || []}
          // getOptionLabel={(option) => option?.subject?.subject_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Test' placeholder='Test' />
          )}
        />
      </Grid>
      {selectedReportType?.id === 4 && (
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleTopic}
            id='topic'
            className='dropdownIcon'
            // value={selectedTest || ''}
            // options={subjectDropdown || []}
            // getOptionLabel={(option) => option?.subject?.subject_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Topic'
                placeholder='Topic'
              />
            )}
          />
        </Grid>
      )}
      {/* <Grid item xs={3} sm={9} /> */}
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          className='custom_button_master labelColor modifyDesign'
          size='medium'
          style={{ borderRadius: '10px' }}
          onClick={handleClear}
        >
          CLEAR ALL
        </Button>
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  // setReportFilters: (filter, value) => dispatch(setReportFilters(filter, value)),
  setClearFilters: () => dispatch(setClearFilters()),
  fetchAssessmentReportList: (reportType) =>
    dispatch(fetchAssessmentReportList(reportType)),
});

const mapStateToProps = (state) => ({
  // selectedYear: state.assessmentReportReducer.selectedYear,
  // selectedBranch: state.assessmentReportReducer.selectedBranch,
  // selectedGrade: state.assessmentReportReducer.selectedGrade,
  // selectedSubject: state.assessmentReportReducer.selectedSubject,
  // selectedSection: state.assessmentReportReducer.selectedSection,
  // selectedTest: state.assessmentReportReducer.selectedTest,
  // selectedTopic: state.assessmentReportReducer.selectedTopic,
  selectedReportType: state.assessmentReportReducer.selectedReportType,
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReportFilters);
