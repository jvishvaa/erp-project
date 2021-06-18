import React from 'react';
import { Grid, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import './styles.scss';

const AssesmentDetails = ({ test, onClick, onClose }) => {
  const {
    test_id: id,
    testType,
    grade,
    subjects,
    test_name: testName,
    test_date: testDate,
    test_duration: testDuration,
    total_mark: totalMark,
    created_at: createdDate,
    updated_at: updatedDate,
  } = test;
  return (
    <div className='assesment-details-container'>
      <div className='header-container'>
        <div className='primary-header-container'>
          <div className='primary-header-text-container'>
            <span className='primary-text font-lg'>{testType}</span>
            <br />
            <span className='secondary-text'>{
              `${grade}`
              //  ${subjects.join(', ')}`
            }</span>
          </div>
          <div className='close-icon'>
            <IconButton onClick={onClose}>
              <CloseIcon color='primary' />
            </IconButton>
          </div>
        </div>
        <div className='secondary-header-container'>
          <div className='secondary-text font-lg'>{testName}</div>
          <div className='secondary-text font-sm sop'>
            <div>Scheduled on</div>
            {console.log(testDate?.slice(11, 16), 'dateteimeeeeee')}
            <div>
              {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}{' '}
              {testDate ? testDate?.slice(11, 16) : '--'}
            </div>
            {/* <p style={{marginRight:'90px'}}>Scheduled on {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}</p> */}
          </div>
        </div>
      </div>
      <div className='parameters-container'>
        <div className='parameters-header'>
          <span className='header-text font-lg'>Test Parameters</span>
          {/* <span className='primary-text font-sm'>Edit details</span> */}
        </div>
        <div className='parameters-content'>
          <Grid container>
            {/* {Array.from({ length: 25 }, () => (
              <Grid item md={4} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header'>Marks type</p>
                  <p className='cell-header right-align'>Text book answer</p>
                </div>
              </Grid>
            ))} */}
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Test type
                </p>
                <p className='cell-header left-align'>{testType}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Test ID
                </p>
                <p className='cell-header left-align'>{id}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Duration
                </p>
                {/* <p className='cell-header right-align'>{testDuration}</p> */}
                <p className='cell-header left-align'>{testDuration}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Total marks
                </p>
                <p className='cell-header left-align'>{totalMark}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Created
                </p>
                <p className='cell-header left-align'>
                  {createdDate ? moment(createdDate).format('DD-MM-YYYY') : ''}
                </p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Updated
                </p>
                <p className='cell-header left-align'>
                  {updatedDate ? moment(updatedDate).format('DD-MM-YYYY') : ''}
                </p>
              </div>
            </Grid>
          </Grid>
          <div style={{ margin: '1rem' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                {/* <Button variant='contained' color='primary' fullWidth>
                  Results
                </Button> */}
              </Grid>
              <Grid item xs={12} md={6}>
                {/* <Button variant='contained' color='primary' fullWidth>
                  Question Paper
                </Button> */}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssesmentDetails;
