import React, { useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import {
  fetchAssessmentReportList,
  setReportFilters,
  setClearFilters,
} from '../../../../redux/actions';

const AssessmentReportFilters = ({
  widerWidth,
  isMobile,
  fetchAssessmentReportList,
  setReportFilters,
  setClearFilters,
  selectedYear,
  selectedBranch,
  selectedGrade,
  selectedSubject,
  selectedTest,
}) => {
  const handleAcademicYear = (event, value) => {
    setReportFilters('selectedYear', {});
    if (value) setReportFilters('selectedYear', value);
  };

  const handleBranch = (event, value) => {
    setReportFilters('selectedBranch', {});
    if (value) setReportFilters('selectedBranch', value);
  };

  const handleGrade = (event, value) => {
    setReportFilters('selectedGrade', {});
    if (value) setReportFilters('selectedGrade', value);
  };

  const handleSubject = (event, value) => {
    setReportFilters('selectedSubject', {});
    if (value) setReportFilters('selectedSubject', value);
  };

  const handleTest = (event, value) => {
    setReportFilters('selectedTest', {});
    if (value) setReportFilters('selectedTest', value);
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
          // value={selectedYear || ''}
          // options={academicDropdown || []}
          // getOptionLabel={(option) => option?.session_year || ''}
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
          // value={selectedBranch || ''}
          // options={branchDropdown || []}
          // getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
      <Grid item xs={3} sm={9} />
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
  setReportFilters: (filter, value) => dispatch(setReportFilters(filter, value)),
  setClearFilters: () => dispatch(setClearFilters()),
  fetchAssessmentReportList: (reportType) =>
    dispatch(fetchAssessmentReportList(reportType)),
});

const mapStateToProps = (state) => ({
  selectedYear: state.assessmentReportReducer.selectedYear,
  selectedBranch: state.assessmentReportReducer.selectedBranch,
  selectedGrade: state.assessmentReportReducer.selectedGrade,
  selectedSubject: state.assessmentReportReducer.selectedSubject,
  selectedTest: state.assessmentReportReducer.selectedTest,
  selectedReportType: state.assessmentReportReducer.selectedReportType,
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReportFilters);
