/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */

/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classWiseSms from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/classWiseSms';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import './header-section.css';
import { makeStyles } from '@material-ui/core';
import { theme } from 'highcharts';


const useStyles = makeStyles((theme) => ({
  headerTitle : {
    color : theme.palette.secondary.main,
  },
  headerCircle:{
    width: "40px",
    height: "40px",
    margin: "auto",
    borderRadius:" 50%",
    backgroundColor: "#ffffff",
    color: theme.palette.primary.main, 
    padding: "9% 1.5%",
    textAlign: "center",
  },
  borderCircle:{
    border : `1px solid ${theme.palette.primary.main}`
  }
}));

const HeaderSection = withRouter(({ history, ...props }) => {
  const classes = useStyles();

  const { firstStep, secondStep, thirdStep, currentStep } = props || {};
  return (
    <div className='send_message_heading_wrapper'>
      <div className='send_message_breadcrumb_wrapper'>
        <CommonBreadcrumbs
          componentName='Communication'
          childComponentName='Send sms/mail'
        />
      </div>
      <div className='send_message_header'>
        <div className='send_message_header_icon_wrapper'>
          <div
            className={`${classes.headerCircle} ${
              firstStep ? `${classes.borderCircle}` : null
            } ${currentStep > 1 ? 'step_completed' : null}`}
          >
            1
          </div>
          <div className={classes.headerTitle}>Get recepients</div>
        </div>
        <div className='send_message_header_bar' />
        <div className='send_message_header_icon_wrapper'>
          <div
            className={`${classes.headerCircle} ${
              secondStep ? `${classes.borderCircle}` : null
            } ${currentStep > 2 ? 'step_completed' : null}`}
          >
            2
          </div>
          <div className={classes.headerTitle}>Select recepients</div>
        </div>
        <div className='send_message_header_bar' />
        <div className='send_message_header_icon_wrapper'>
          <div
            className={`${classes.headerCircle} ${
              thirdStep ? `${classes.borderCircle}` : null
            } ${currentStep > 3 ? 'step_completed' : null}`}
          >
            3
          </div>
          <div className={classes.headerTitle}>Send message</div>
        </div>
      </div>
    </div>
  );
});

export default HeaderSection;
