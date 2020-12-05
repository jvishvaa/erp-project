/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import './header-section.css';

const HeaderSection = withRouter(({ history, ...props }) => {
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
            className={`send_message_header_circle ${
              firstStep ? 'send_message_header_border_circle' : null
            } ${currentStep > 1 ? 'step_completed' : null}`}
          >
            1
          </div>
          <div className='send_message_header_title'>Get recepients</div>
        </div>
        <div className='send_message_header_bar' />
        <div className='send_message_header_icon_wrapper'>
          <div
            className={`send_message_header_circle ${
              secondStep ? 'send_message_header_border_circle' : null
            } ${currentStep > 2 ? 'step_completed' : null}`}
          >
            2
          </div>
          <div className='send_message_header_title'>Select recepients</div>
        </div>
        <div className='send_message_header_bar' />
        <div className='send_message_header_icon_wrapper'>
          <div
            className={`send_message_header_circle ${
              thirdStep ? 'send_message_header_border_circle' : null
            } ${currentStep > 3 ? 'step_completed' : null}`}
          >
            3
          </div>
          <div className='send_message_header_title'>Send message</div>
        </div>
      </div>
    </div>
  );
});

export default HeaderSection;
