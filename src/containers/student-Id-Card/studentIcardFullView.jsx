/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import './style.scss';
import PropTypes from 'prop-types';
import { Grid, IconButton, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import StudentIdCardTemplate from './studentIDCardTemplete';
import ParentIdCardTemplate from './parentIdCardTemplate';
import TeacherIdCardTemplate from './teacherIdCardTemplate';

const StudentIDCardFullView = ({
  handleClose,
  selectedDetails,
  history,
  selectedRole,
}) => {
  const [step, setStep] = useState(1);
  function handleEdit() {
    history.push(
      `/user-management/edit-user/${
        selectedDetails && selectedDetails.id && selectedDetails.id
      }`
    );
  }
  useEffect(() => {
    if (selectedRole === 'Student') {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [selectedDetails]);

  function handleLables() {
    if (step === 1) {
      return <span>Student ID Card</span>;
    }
    if (step === 2) {
      return <span>Father ID Card</span>;
    }
    if (step === 3) {
      return <span>Mother ID Card</span>;
    }
    if (step === 4) {
      return <span>Guardian ID Card</span>;
    }
    return <span>Teacher ID Card</span>;
  }

  return (
    <>
      <Grid container spacing={2} className='studentIdCardFullViewCard'>
        <Grid item md={12} xs={12} className='studentIdCardFullViewTopHead'>
          <IconButton size='small' onClick={() => handleClose('', 'selectedId')}>
            <CloseIcon className='studentIdCardCloseButton' />
          </IconButton>
        </Grid>
        <Grid item md={12} xs={12}>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='center'
            alignItems='center'
          >
            <Grid item md={2} xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                size='small'
                className='idCardBackNextButton'
                disabled={step === 1 || step === 0}
                onClick={() => setStep((prev) => prev - 1)}
              >
                <ArrowBackIosIcon />
              </IconButton>
            </Grid>
            <Grid item md={8} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} className='idCardFullViewMainHedding'>
                  {handleLables()}
                </Grid>
                <Grid item md={12} xs={12}>
                  {step === 0 && <TeacherIdCardTemplate fullData={selectedDetails} />}
                  {step === 1 && <StudentIdCardTemplate fullData={selectedDetails} />}
                  {step === 2 && (
                    <ParentIdCardTemplate fullData={selectedDetails} type='father' />
                  )}
                  {step === 3 && (
                    <ParentIdCardTemplate fullData={selectedDetails} type='mother' />
                  )}
                  {step === 4 && (
                    <ParentIdCardTemplate fullData={selectedDetails} type='guardian' />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={2} xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                size='small'
                className='idCardBackNextButton'
                disabled={step === 4 || step === 0}
                onClick={() => setStep((prev) => prev + 1)}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
            <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
              <Button
                size='small'
                variant='contained'
                color='primary'
                className='studentIdcardViewMoreButton'
                onClick={() => handleEdit()}
              >
                Edit Card
              </Button>
              &nbsp;&nbsp;
              <Button
                size='small'
                variant='contained'
                color='primary'
                className='studentIdcardViewMoreButton'
              >
                Download Card
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
StudentIDCardFullView.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectedRole: PropTypes.string.isRequired,
  selectedDetails: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(StudentIDCardFullView);
