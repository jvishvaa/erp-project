import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './index.css';

const ReportsCard = (props) => {
  const { data } = props;
  return (
    <div className='th-custom-col-padding'>
      <div className='px-2'>
        <div className='row justify-content-between'>
          <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
          <div className='col-4 th-grey th-fw-400 th-12'>Subjcet</div>
          <div className='col-4 th-grey th-fw-400 th-12'>Avg Score</div>
        </div>
        {data?.map((item, i) => (
          <Accordion className='th-accordion' style={{ boxShadow: 'none' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id='panel1bh-header'
              className='row justify-content-between th-bg-grey th-br-6 my-2'
            >
              <div className='col-md-4 th-black-1 th-14 th-fw-400'>{item?.grade}</div>
              <div className='col-md-4 th-black-1 th-14 th-fw-400'>{item?.subject}</div>
              <div className='col-md-4 text-right th-16 th-fw-600 th-green'>
                {item?.value}%
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className='row justify-content-between'>
                <div className='row justify-content-between th-green th-12 th-fw-400'>
                  <div className='col-7 text-right'>Submitted</div>
                  <div className='col-4 text-center'>23</div>
                </div>
                <div className='row justify-content-between th-red th-12 th-fw-400'>
                  <div className='col-7 text-right'>Pending</div>
                  <div className='col-4 text-center'>15</div>
                </div>
                <div className='row justify-content-between th-primary th-12 th-fw-400'>
                  <div className='col-7 text-right'>Evaluated</div>
                  <div className='col-4 text-center'>09</div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default ReportsCard;
