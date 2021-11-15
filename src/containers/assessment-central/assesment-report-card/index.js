import React, { useRef } from 'react';
import ReportTable from './report-table.js';
import { Paper, makeStyles } from '@material-ui/core';
import ReportCardHeader from './report-card-header';
import ReactToPrint from 'react-to-print';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
}));

const AssesmentReport = ({ reportCardData }) => {
  const classes = useStyles();
  const componentRef = useRef();
  const {
    scholastic = {},
    co_scholastic: coScholastic = {},
    school_info: schoolInfo = {},
    user_info: userInfo = {},
  } = reportCardData || {};

  return (
    <>
      {reportCardData ? (
        <>
          <ReactToPrint
            trigger={() => <button>Print this out!</button>}
            content={() => componentRef.current}
          />
          <Paper
            component={'div'}
            ref={componentRef}
            elevation={2}
            className={classes.root}
          >
            <ReportCardHeader schoolData={schoolInfo} />
            <ReportTable
              scholastic={scholastic}
              coScholastic={coScholastic}
              userInfo={userInfo}
            />
          </Paper>
        </>
      ) : (
        'REPORT CARD NOT AVAILABLE'
      )}
    </>
  );
};

export default AssesmentReport;
