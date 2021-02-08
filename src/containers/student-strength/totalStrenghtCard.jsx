import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import './style.scss';

const TotalStudentStrengthCard = ({
  fullData,
  selectedId,
  handleSelectCard,
  handleScroll,
  reference,
}) => {
  return (
    <>
      <Grid
        container
        spacing={2}
        className={
          (fullData && fullData.grade) === (selectedId && selectedId.grade)
            ? 'studentStrengthCardMainDivActive'
            : 'studentStrengthCardMainDivInActive'
        }
      >
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
              <span style={{ color: 'lightgray', fontSize: '25px' }}>&nbsp;|&nbsp;</span>
              <span className='totalStudentStrenghtCardSubLabel1'>
                {(fullData && fullData.active) || '0'}
                &nbsp;Active
              </span>
            </Grid>
            <Grid item md={8} xs={12} style={{ padding: '0px' }}>
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
              <Grid item md={4} xs={12} style={{ padding: '0px' }}>
                <Button
                  size='small'
                  style={{ fontSize: '10px' }}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    handleSelectCard((fullData && fullData) || '');
                    handleScroll(reference);
                  }}
                >
                  View More
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
TotalStudentStrengthCard.prototype = {
  fullData: PropTypes.instanceOf(Object).isRequired,
  selectedId: PropTypes.number.isRequired,
  handleSelectCard: PropTypes.func.isRequired,
  handleScroll: PropTypes.func.isRequired,
  reference: PropTypes.instanceOf(Object).isRequired,
};

export default TotalStudentStrengthCard;
