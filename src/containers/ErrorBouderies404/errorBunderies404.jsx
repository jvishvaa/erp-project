import React, { useContext, useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Error404Image from '../../assets/images/Group 51742@2x.png';
import Error404Mobile from '../../assets/images/Group 51743@2x.png';
import './style.scss';
import Button from '@material-ui/core/Button';

const ErrorBounderies404 = (props) => {
  const setMobileView = useMediaQuery('(min-width:750px)');

  const handleOpenHomePage = () => {
    props.history.push('/profile');
  };
  return (
    <>
      <div className='outer-container-404-error'>
        {setMobileView ? (
          <>
            <img className='error-404-dextop-image' src={Error404Image} />
          </>
        ) : (
          <>
            <img className='error-404-dextop-image-mobile' src={Error404Mobile} />
          </>
        )}
      </div>

      {/* <div className='outer-container-404-error'>
        <div className='inner-container-404'>
          <Typography variant='h3' gutterBottom>
            404
          </Typography>
          <Typography variant='h6' gutterBottom>
            Component not found
          </Typography>
          <Typography variant='subtitle2' gutterBottom>
            Please try the following page
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenHomePage}
            color='primary'
          >
            Home
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default ErrorBounderies404;
