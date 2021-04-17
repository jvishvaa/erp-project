import React, { useState, useEffect } from 'react';
import { Grid, TextField, Divider } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import { fetchAssessmentReportList } from '../../../../redux/actions';

const reportTypes = [
  { id: 1, type: 'Class Average marks Subject wise with Teacher name' },
  { id: 2, type: 'Topic wise Average for a Test' },
  { id: 3, type: 'Individual Student Marks Comparison with Class Average' },
  {
    id: 4,
    type: 'Individual Student Topic wise Marks Comparison with Class Topic Average',
  },
];

const ReportTypeFilter = ({
  widerWidth,
  isMobile,
  fetchAssessmentReportList,
  selectedReportType = {},
}) => {
  const handleReportType = (event, value) => {
    if (value) fetchAssessmentReportList(value);
    else fetchAssessmentReportList();
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{
        width: widerWidth,
        margin: isMobile ? '-20px 0px -10px 0px' : '-10px 0px 20px 8px',
      }}
    >
      <Grid item xs={12} sm={6} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleReportType}
          id='report-types'
          className='dropdownIcon'
          value={selectedReportType || {}}
          options={reportTypes || []}
          getOptionLabel={(option) => option?.type || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Report Types'
              placeholder='Report Types'
            />
          )}
        />
      </Grid>
      {selectedReportType?.id && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchAssessmentReportList: (reportType) =>
    dispatch(fetchAssessmentReportList(reportType)),
});

const mapStateToProps = (state) => ({
  assessmentReportListData: state.assessmentReportReducer.assessmentReportListData,
  selectedReportType: state.assessmentReportReducer.selectedReportType,
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportTypeFilter);
