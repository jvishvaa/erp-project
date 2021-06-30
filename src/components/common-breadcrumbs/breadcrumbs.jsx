/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {Breadcrumbs, Button, Typography,Link} from '@material-ui/core'
import {NavigateNext as NavigateNextIcon} from '@material-ui/icons'
import useStyles from './useStyles'
//import './breadcrumbs.css';


const CommonBreadcrumbs = withRouter(({ history, ...props }) => {
  const { componentName, childComponentName, childComponentNameNext } = props || {};
  const classes = useStyles();
  return (
   <div className={classes.root}>
    <Breadcrumbs separator={<NavigateNextIcon className={classes.navigationIcon} />} aria-label="breadcrumb">
        {/* <Button className={classes.button}  onClick={() => history.push('/dashboard')}>
          Dashboard
        </Button> */}
        <Button className={classes.button}>
        {componentName}
        </Button>
        {childComponentName && (<Typography className={classes.button} >
        {childComponentName}
        </Typography>)}
        {childComponentNameNext && (<Typography className={classes.button} >
        {childComponentNameNext}
        </Typography>)}
        {/* <Typography color="textPrimary">Breadcrumb</Typography> */}
      </Breadcrumbs>
    </div>
    // <div className='page_title'>
    //   {' '}
    //   <span style={{ cursor: 'pointer' }} onClick={() => history.push('/dashboard')}>
    //     Dashboard
    //   </span>
    //   <ArrowForwardIosIcon className='page_heading_arrow' />
    //   {componentName}
    //   {childComponentName ? (
    //     <>
    //       <ArrowForwardIosIcon className='page_heading_arrow' />
    //       {childComponentName}
    //     </>
    //   ) : null}
    //    {childComponentNameNext ? (
    //     <>
    //       <ArrowForwardIosIcon className='page_heading_arrow_mob' />
    //       {childComponentNameNext}
    //     </>
    //   ) : null}
    // </div>
  );
});

export default CommonBreadcrumbs;
