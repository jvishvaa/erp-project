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
        passId={props.passId}
          teacherView={props.teacherView}
          callGetAPI={props.callGetAPI}
          handlePassData={props.handlePassData}
          tableData={props.tableData}
        />
      ) : (
        <Daily openToggleCalander={openToggleCalander} tableData={props.tableData} />
      )}
    </>
  );
};

export default DateAndCalander;
