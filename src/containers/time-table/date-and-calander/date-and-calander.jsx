import React, { useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Calander from './calander.jsx';
import Daily from './daily.jsx';
import '../timetable.scss';
const DateAndCalander = (props) => {
  const [openToggleCalander, setToggleCalander] = useState(true);

  return (
    <>
      <div className='table-header'>
        <h3
          className={openToggleCalander ? 'daily' : 'select-daily'}
          onClick={() => setToggleCalander(false)}
        >
          Daily
          <div className='underline-slected' />
        </h3>
        <h3
          className={openToggleCalander ? 'select-weekly' : 'weekly'}
          onClick={() => setToggleCalander(true)}
        >
          Weekly
          <div className='underline-slected' />
        </h3>
      </div>
      <Divider variant='middle' className='date-week-underline' />
      {openToggleCalander ? (
        <Calander
          handlePassCloseNewPeriod={props.handlePassCloseNewPeriod}
          openNewPeriod={props.openNewPeriod}
          passId={props.passId}
          loopMax={props.loopMax}
          section_ID={props.section_ID}
          grade_ID={props.grade_ID}
          branch_ID={props.branch_ID}
          acadamicYear_ID={props.acadamicYear_ID}
          teacherView={props.teacherView}
          callGetAPI={props.callGetAPI}
          handlePassData={props.handlePassData}
          tableData={props.tableData}
        />
      ) : (
        <Daily
          openToggleCalander={openToggleCalander}
          teacherView={props.teacherView}
          tableData={props.tableData}
        />
      )}
    </>
  );
};

export default DateAndCalander;
