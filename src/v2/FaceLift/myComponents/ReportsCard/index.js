import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Tooltip } from 'antd';
import './index.css';
import { useHistory } from 'react-router-dom';

const ReportsCard = (props) => {
  const history = useHistory();
  const type = props.type;
  const getUrl = (type) => {
    switch (type) {
      case 'classwork':
        return './erp-online-class-teacher-view';

      case 'homework':
        return './homework/teacher';
    }
  };

  let url = getUrl(type);
  const { data } = props;
  return (
    <div className='th-custom-col-padding'>
      <div className='px-2'>
        <div className='row justify-content-between mb-1'>
          <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
          <div className='col-4 th-grey th-fw-400 th-12 text-center'>Subject</div>
          <div className='col-4 th-grey th-fw-400 th-12 px-0 text-center'>
            {type === 'classwork-report' || type === 'homework-report'
              ? '% Submitted'
              : 'Avg. Completion %'}
          </div>
        </div>
        <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
          {data?.map((item, i) => (
            <Accordion className='th-accordion mb-2' style={{ boxShadow: 'none' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
                className='th-bg-grey th-br-6 th-accordion-summary'
              >
                <div
                  className='row justify-content-between py-3 th-br-6 align-items-center'
                  onClick={() => history.push(url)}
                >
                  <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 text-truncate'>
                    <Tooltip
                      placement='top'
                      title={
                        <span>
                          {item?.grade_name} {item?.section_name}
                        </span>
                      }
                    >
                      {item?.grade_name} {item?.section_name}
                    </Tooltip>
                  </div>
                  <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 text-center'>
                    {item?.subject_name}
                  </div>
                  <div className='col-4 text-center th-16 th-fw-600 th-green-1 pr-0'>
                    {item?.percentage_submitted}%
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='row justify-content-between'>
                  <div className='row justify-content-between th-green th-12 th-fw-400'>
                    <div className='col-4 text-right'></div>
                    <div className='col-4 pl-1'>Submitted</div>
                    <div className='col-4 text-center'>
                      {type == 'classwork'
                        ? item?.classwork_submitted
                        : item?.total_submitted}
                    </div>
                  </div>
                  <div className='row justify-content-between th-red th-12 th-fw-400'>
                    <div className='col-4 text-right'></div>
                    <div className='col-4 pl-1'>Pending</div>
                    <div className='col-4 text-center'>
                      {type == 'classwork'
                        ? item?.unsubmitted_classwork
                        : item?.unsubmitted_students}
                    </div>
                  </div>
                  {/* <div className='row justify-content-between th-primary th-12 th-fw-400'>
                    <div className='col-4 text-right'></div>
                    <div className='col-4 pl-1'>Evaluated</div>
                    <div className='col-4 text-center'>09</div>
                  </div> */}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsCard;
