import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import './style.scss';

const TotalStudentBar = ({ fullData }) => {
  return (
    <>
      <Grid container spacing={2} className='totalStudentStrenghtMainDiv'>
        <Grid item md={6} xs={12} className='totalStudentStrenghtSubDiv1'>
          <Grid container spacing={1} direction='row' alignItems='center'>
            <Grid item md={1} xs={12} className='totalStudentStrenghtLabel'>
              <PeopleIcon style={{ paddingTop: '4px' }} />
            </Grid>
            <Grid item md={11} xs={12} className='totalStudentStrenghtLabel'>
              <span>Total Strength -&nbsp;</span>
              <span>
                &nbsp;
                {(fullData && fullData.total_strength) || '0'}
                &nbsp;
              </span>
              <span>&nbsp;/&nbsp;</span>
              <span>
                &nbsp;
                {(fullData && fullData.total_active) || '0'}
                &nbsp;
              </span>
              <span>&nbsp;Active&nbsp;</span>
              <span>
                &nbsp;
                {(fullData && fullData.new_admissions) || ''}
                &nbsp;
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid md={6} xs={12} className='totalStudentStrenghtSubDiv2'>
          <Grid container spacing={1} direction='row' alignItems='center'>
            <Grid item md={1} xs={0} />
            <Grid item md={1} xs={2} className='totalStudentStrenghtLabel'>
              <PeopleIcon style={{ color: 'gray', paddingTop: '4px' }} />
            </Grid>
            <Grid item md={4} xs={8} className='totalStudentStrenghtLabel1'>
              <span>Temporary Inactive - </span>
              <span>{(fullData && fullData.total_temporary_inactive) || '0'}</span>
            </Grid>
            <Grid
              item
              md={1}
              xs={0}
              style={{ borderLeft: '1px solid lightgray', height: '30px' }}
            />
            <Grid item md={1} xs={2} className='totalStudentStrenghtLabel'>
              <PeopleIcon style={{ color: 'black', paddingTop: '4px' }} />
            </Grid>
            <Grid item md={4} xs={10} className='totalStudentStrenghtLabel2'>
              <span>Permanent Inactive - </span>
              <span>{(fullData && fullData.total_permanent_inactive) || '0'}</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
TotalStudentBar.prototype = {
  fullData: PropTypes.instanceOf(Object).isRequired,
};

export default TotalStudentBar;
