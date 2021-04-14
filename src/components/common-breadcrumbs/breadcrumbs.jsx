/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './breadcrumbs.css';

const CommonBreadcrumbs = withRouter(({ history, ...props }) => {
  const { componentName, childComponentName, childComponentNameNext } = props || {};
  return (
    <div className='page_title'>
      {' '}
      <span style={{ cursor: 'pointer' }} onClick={() => history.push('/dashboard')}>
        Dashboard
      </span>
      <ArrowForwardIosIcon className='page_heading_arrow' />
      {componentName}
      {childComponentName ? (
        <>
          <ArrowForwardIosIcon className='page_heading_arrow' />
          {childComponentName}
        </>
      ) : null}
       {childComponentNameNext ? (
        <>
          <ArrowForwardIosIcon className='page_heading_arrow_mob' />
          {childComponentNameNext}
        </>
      ) : null}
    </div>
  );
});

export default CommonBreadcrumbs;
