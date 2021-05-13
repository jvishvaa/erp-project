import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import './style.scss';
import MediaQuery from 'react-responsive';

const TotalStudentStrengthCard = ({ fullData, selectedId, handleSelectCard }) => {
  return (
    <>
      <Grid
        container
        className={
          (fullData && fullData.grade) === (selectedId && selectedId.grade)
            ? 'studentStrengthCardMainDivActive'
            : 'studentStrengthCardMainDivInActive'
        }
      >
        <MediaQuery minWidth={1598}>
          <Grid item md={6} xs={6} style={{ textAlign: 'left', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel'>
              {(fullData && fullData.grade_name) || ''}
            </span>
          </Grid>
          <Grid item md={6} xs={6} style={{ textAlign: 'right', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel1'>
              {(fullData && fullData.new_admissions) || ''}
            </span>
          </Grid>
          <Grid item md={12} xs={12} style={{ textAlign: 'left', padding: '0px' }}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={12} xs={1}>
                <span className='totalStudentStrenghtCardSubLabel'>
                  {(fullData && fullData.student_count) || '0'}
                </span>
                <span style={{ color: 'lightgray', fontSize: '25px' }}>
                  &nbsp;|&nbsp;
                </span>
                <span className='totalStudentStrenghtCardSubLabel1'>
                  {(fullData && fullData.active) || '0'}
                  &nbsp;Active
                </span>
              </Grid>
              <Grid item md={6} xs={12} style={{ padding: '0px' }}>
                <span style={{ color: '#009CE1', fontSize: '13px' }}>
                  Temporary Inactive -&nbsp;
                  {(fullData && fullData.temporary_inactive) || '0'}
                </span>
                <br />
                <span style={{ color: '#9D9D9D', fontSize: '13px' }}>
                  Permanent Inactive -&nbsp;
                  {(fullData && fullData.permanent_inactive) || '0'}
                </span>
              </Grid>

              <Grid item md={1}></Grid>
              {(fullData && fullData.grade) !== (selectedId && selectedId.grade) && (
                <Grid item md={5} xs={12} style={{ padding: '0px' }}>
                  <Button
                    size='small'
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={() => {
                      handleSelectCard((fullData && fullData) || '');
                    }}
                  >
                    View More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </MediaQuery>

        <MediaQuery minWidth={1101} maxWidth={1597}>
          <Grid item md={4} style={{ textAlign: 'left', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel'>
              {(fullData && fullData.grade_name) || ''}
            </span>
          </Grid>
          <Grid item md={8} style={{ textAlign: 'right', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel1'>
              {(fullData && fullData.new_admissions) || ''}
            </span>
          </Grid>
          <Grid item style={{ textAlign: 'left', padding: '0px' }}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={12} xs={1}>
                <span className='totalStudentStrenghtCardSubLabel'>
                  {(fullData && fullData.student_count) || '0'}
                </span>
                <span style={{ color: 'lightgray', fontSize: '25px' }}>
                  &nbsp;|&nbsp;
                </span>
                <span className='totalStudentStrenghtCardSubLabel1'>
                  {(fullData && fullData.active) || '0'}
                  &nbsp;Active
                </span>
              </Grid>

              <Grid item md={7} style={{ padding: '0px' }}>
                <span style={{ color: '#009CE1', fontSize: '13px' }}>
                  Temporary Inactive -&nbsp;
                  {(fullData && fullData.temporary_inactive) || '0'}
                </span>
                <br />

                <span style={{ color: '#9D9D9D', fontSize: '13px' }}>
                  Permanent Inactive -&nbsp;
                  {(fullData && fullData.permanent_inactive) || '0'}
                </span>
              </Grid>
              <Grid item md={1} />
              {(fullData && fullData.grade) !== (selectedId && selectedId.grade) && (
                <Grid item style={{ padding: '0px' }}>
                  <Button
                    size='small'
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleSelectCard((fullData && fullData) || '');
                    }}
                  >
                    View More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>{' '}
        </MediaQuery>
        <MediaQuery minWidth={600} maxWidth={1100}>
          <Grid item md={6} xs={6} style={{ textAlign: 'left', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel'>
              {(fullData && fullData.grade_name) || ''}
            </span>
          </Grid>
          <Grid item md={6} xs={6} style={{ textAlign: 'right', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel1'>
              {(fullData && fullData.new_admissions) || ''}
            </span>
          </Grid>
          <Grid item md={12} xs={12} style={{ textAlign: 'left', padding: '0px' }}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={12} xs={1}>
                <span className='totalStudentStrenghtCardSubLabel'>
                  {(fullData && fullData.student_count) || '0'}
                </span>
                <span style={{ color: 'lightgray', fontSize: '25px' }}>
                  &nbsp;|&nbsp;
                </span>
                <span className='totalStudentStrenghtCardSubLabel1'>
                  {(fullData && fullData.active) || '0'}
                  &nbsp;Active
                </span>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: '0px' }}>
                <span style={{ color: '#009CE1', fontSize: '13px' }}>
                  Temporary Inactive -&nbsp;
                  {(fullData && fullData.temporary_inactive) || '0'}
                </span>
                <br />
                <span style={{ color: '#9D9D9D', fontSize: '13px' }}>
                  Permanent Inactive -&nbsp;
                  {(fullData && fullData.permanent_inactive) || '0'}
                </span>
              </Grid>

              {(fullData && fullData.grade) !== (selectedId && selectedId.grade) && (
                <Grid item xs={12} style={{ padding: '0px' }}>
                  <Button
                    size='small'
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={() => {
                      handleSelectCard((fullData && fullData) || '');
                    }}
                  >
                    View More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>{' '}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
          <Grid item md={6} xs={6} style={{ textAlign: 'left', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel'>
              {(fullData && fullData.grade_name) || ''}
            </span>
          </Grid>
          <Grid item md={6} xs={6} style={{ textAlign: 'right', padding: '0px' }}>
            <span className='totalStudentStrenghtCardLabel1'>
              {(fullData && fullData.new_admissions) || ''}
            </span>
          </Grid>
          <Grid item md={12} xs={12} style={{ textAlign: 'left', padding: '0px' }}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              <Grid item md={12} xs={1}>
                <span className='totalStudentStrenghtCardSubLabel'>
                  {(fullData && fullData.student_count) || '0'}
                </span>
                <span style={{ color: 'lightgray', fontSize: '25px' }}>
                  &nbsp;|&nbsp;
                </span>
                <span className='totalStudentStrenghtCardSubLabel1'>
                  {(fullData && fullData.active) || '0'}
                  &nbsp;Active
                </span>
              </Grid>
              <Grid item md={6} xs={12} style={{ padding: '0px' }}>
                <span style={{ color: '#009CE1', fontSize: '13px' }}>
                  Temporary Inactive -&nbsp;
                  {(fullData && fullData.temporary_inactive) || '0'}
                </span>
                <br />
                <span style={{ color: '#9D9D9D', fontSize: '13px' }}>
                  Permanent Inactive -&nbsp;
                  {(fullData && fullData.permanent_inactive) || '0'}
                </span>
              </Grid>

              {(fullData && fullData.grade) !== (selectedId && selectedId.grade) && (
                <Grid item xs={12} style={{ padding: '0px' }}>
                  <Button
                    size='small'
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={() => {
                      handleSelectCard((fullData && fullData) || '');
                    }}
                  >
                    View More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </MediaQuery>
      </Grid>
    </>
  );
};
TotalStudentStrengthCard.prototype = {
  fullData: PropTypes.instanceOf(Object).isRequired,
  selectedId: PropTypes.number.isRequired,
  handleSelectCard: PropTypes.func.isRequired,
};

export default TotalStudentStrengthCard;
