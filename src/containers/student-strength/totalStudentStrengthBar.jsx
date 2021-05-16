import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import './style.scss';
import MediaQuery from 'react-responsive';

const TotalStudentBar = ({ fullData }) => {
  return (
    <>
      <MediaQuery minWidth={1598}>
        <Grid container spacing={2} className='totalStudentStrenghtMainDiv2'>
          <Grid item md={6} xs={12} className='totalStudentStrenghtSubDiv1'>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={1} xs={12} className='totalStudentStrenghtLabel'>
                <PeopleIcon style={{ paddingTop: '4px' }} />
              </Grid>

              <Grid item md={11} xs={12} className='totalStudentStrenghtLabel'>
                <span>Total Strength -&nbsp;</span>
                <span className='totalbold1'>
                  &nbsp;
                  {(fullData && fullData.total_strength) || '0'}
                  &nbsp;
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className='totalbold1'>
                  &nbsp;
                  {(fullData && fullData.total_active) || '0'}
                  &nbsp;
                </span>
                <span>&nbsp;Active&nbsp;</span>
                <span className='totalbold1'>
                  &nbsp;
                  {fullData?.new_admissions.split('-')[0] +
                    '-' +
                    fullData?.new_admissions.split('-')[1] +
                    '-'}
                  <span className='totalboldspace'>
                    {fullData?.new_admissions.split('-')[2]}
                  </span>
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
                <span className='totalbold2 '>
                  {(fullData && fullData.total_temporary_inactive) || '0'}
                </span>
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
                <span className='totalbold2'>
                  {(fullData && fullData.total_permanent_inactive) || '0'}
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MediaQuery>
      <MediaQuery minWidth={900} maxWidth={1597}>
        <Grid container spacing={2} className='totalStudentStrenghtMainDivcopy'>
          <Grid item md={6} xs={12} className='totalStudentStrenghtSubDiv1'>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={1} xs={12} className='totalStudentStrenghtLabel'>
                <PeopleIcon style={{ paddingTop: '4px' }} />
              </Grid>

              <Grid item md={11}>
                &nbsp;
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  Total Strength -&nbsp;
                </span>
                <span className='totalbold1'>
                  &nbsp;
                  {(fullData && fullData.total_strength) || '0'}
                  &nbsp;
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className='totalbold1'>
                  &nbsp;
                  {(fullData && fullData.total_active) || '0'}
                  &nbsp;
                </span>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  &nbsp;Active&nbsp;
                </span>
                <span className='totalboldspace'>
                  &nbsp;
                  {fullData?.new_admissions.split('-')[0] +
                    '-' +
                    fullData?.new_admissions.split('-')[1] +
                    '-'}
                  <span className='totalboldspace1'>
                    {fullData?.new_admissions.split('-')[2]}
                  </span>
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
                <span className='totalbold2 '>
                  {(fullData && fullData.total_temporary_inactive) || '0'}
                </span>
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
                <span className='totalbold2'>
                  {(fullData && fullData.total_permanent_inactive) || '0'}
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={899}>
        <Grid container spacing={2} className='totalStudentStrenghtMainDivcopy'>
          <Grid item md={6} xs={12} className='totalStudentStrenghtSubDiv1'>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={1} xs={12} className='totalStudentStrenghtLabel'>
                <PeopleIcon style={{ paddingTop: '4px' }} />
              </Grid>

              <Grid item md={6} xs={12} className='totalStudentStrenghtLabel'>
                <span>Total Strength -&nbsp;</span>
                <span className='totalbold'>
                  &nbsp;
                  {(fullData && fullData.total_strength) || '0'}
                  &nbsp;
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className='totalbold1'>
                  &nbsp;
                  {(fullData && fullData.total_active) || '0'}
                  &nbsp;
                </span>
                <span>&nbsp;Active&nbsp;</span>
                <span className='totalboldspace123'>
                  &nbsp;
                  {fullData?.new_admissions.split('-')[0] +
                    '-' +
                    fullData?.new_admissions.split('-')[1] +
                    '-'}
                  <span className='totalboldspace'>
                    {fullData?.new_admissions.split('-')[2]}
                  </span>
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
                <span className='totalbold2 '>
                  {(fullData && fullData.total_temporary_inactive) || '0'}
                </span>
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
                <span className='totalbold2'>
                  {(fullData && fullData.total_permanent_inactive) || '0'}
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MediaQuery>
    </>
  );
};
TotalStudentBar.prototype = {
  fullData: PropTypes.instanceOf(Object).isRequired,
};

export default TotalStudentBar;
