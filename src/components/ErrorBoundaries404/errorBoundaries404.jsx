import React, { useContext, useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Error404Image from '../../assets/images/Group 51742@2x.png';
import Error404Mobile from '../../assets/images/Group 51743@2x.png';
import { Redirect } from 'react-router-dom';
import './style.scss';
import Button from '@material-ui/core/Button';
import { LaptopWindowsOutlined } from '@material-ui/icons';

const ErrorBounderies404 = (props) => {
  const setMobileView = useMediaQuery('(min-width:750px)');

  const handleOpenHomePage = () => {
    window.location.pathname = '/';
  };
  return (
    <>
      <div className='outer-container-404-error'>
        {setMobileView ? (
          <>
            <div className='inner-container-dextop'>
              <img className='error-404-dextop-image' src={Error404Image} />
              <div className='text-and-button-container'>
                <Typography variant='h6' color='secondary' gutterBottom>
                  I guess you have landed on a missing page redirect <br />
                  yourself to the dashboard
                </Typography>
                {/* <Link to='/'> */}
                <div
                  className='add-new-period-button'
                  onClick={() => handleOpenHomePage()}
                >
                  Go Back
                </div>
              </div>
              {/* </Link> */}
            </div>
          </>
        ) : (
          <>
            <div className='inner-container-mobile'>
              <img className='error-404-dextop-image-mobile' src={Error404Mobile} />
              <div className='text-and-button-container'>
                <Typography variant='subtitle2' color='secondary' gutterBottom>
                  I guess you have landed on a missing page redirect yourself to the
                  dashboard
                </Typography>
                <div
                  className='add-new-period-button'
                  onClick={() => handleOpenHomePage()}
                >
                  Go Back
                </div>
              </div>
            </div>
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
