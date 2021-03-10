import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import './style.scss';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const StudentBatchView = ({ history }) => {
  const [batchList, setBatchList] = useState('');

  return (
    <>
      <Grid container spacing={2} className='studentBatchViewMaindiv'>
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justify='middle' className='signatureNavDiv'>
            <Grid item md={12} xs={12} style={{ display: 'flex' }}>
              <button
                type='button'
                className='SignatureNavigationLinks'
                onClick={() => history.push('/dashboard')}
              >
                Dashboard
              </button>
              <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
              <span className='SignatureNavigationLinks'>Online Class</span>
              <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
              <span className='SignatureNavigationLinks'>Aol Class View</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default withRouter(StudentBatchView);
