import React, { useState, useEffect } from 'react';
import { Grid, TextField, Divider } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import { setReportType } from '../../../../redux/actions';

const reportTypes = [
  {
    id: 6,
    type: 'Individual Test Report',
  },

  {
    id: 9,
    type: 'Gradewise Assessment Summary',
  },
  {
    id: 10,
    type: 'Gradewise Assessment Completion',
  },
  {
    id: 13,
    type: 'Consolidated Assessment Report',
  },
];
const orchidsReportTypes = [
  { id: 3, type: 'Student Comparison' },
  {
    id: 5,
    type: 'Report Card',
  },
  {
    id: 6,
    type: 'Individual Test Report',
  },

  {
    id: 9,
    type: 'Gradewise Assessment Summary',
  },
  {
    id: 10,
    type: 'Gradewise Assessment Completion',
  },
  {
    id: 13,
    type: 'Consolidated Assessment Report',
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
    if (value) {
      setReportType(value);
    } else setReportType({});
  };

  const query = new URLSearchParams(window.location.search);
  const isReportView = Boolean(query.get('report-card'));
  useEffect(() => {
    if (isReportView) {
      handleReportType({}, { ...reportTypes[4] });
    }
  }, [isReportView]);

  let domain = window.location.href.split('/');
  let isAolOrchids = domain[2].includes('aolschool') || domain[2].includes('orchids');
  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{
        width: widerWidth,
        margin: isMobile ? '0px 0px -10px 0px' : '-10px 0px 20px 8px',
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
          options={isAolOrchids ? orchidsReportTypes : reportTypes || []}
          getOptionLabel={(option) => option?.type || ''}
          getOptionSelected={(option, value) => option?.id === value?.id}
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
