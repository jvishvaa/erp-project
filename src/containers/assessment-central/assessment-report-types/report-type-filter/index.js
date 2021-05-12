import React, { useState, useEffect } from 'react';
import { Grid, TextField, Divider } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import { fetchAssessmentReportList, setReportType } from '../../../../redux/actions';

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
  setReportType,
  selectedReportType,
  setIsFilter,
}) => {
  const handleReportType = (event, value) => {
    setIsFilter(false);
    if (value) setReportType(value);
    else setReportType({});
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
  setReportType: (selectedReport) => dispatch(setReportType(selectedReport)),
});

export default connect(null, mapDispatchToProps)(ReportTypeFilter);
