import React, { useRef } from 'react';
import ReportTable from './report-table.js';
import StudentDetails from './report-top-descriptions.js';
import { Paper, makeStyles } from '@material-ui/core';
import ReportCardFooter from './report-card-footer';
import ReportCardHeader from './report-card-header';
import { getOverallRemark } from './transform-report-card-data';
import ReactToPrint from 'react-to-print';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px auto',
    padding: '5px',
    width: '95%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tr: {
    padding: '2px',
    border: '1px solid #dddddd',
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

  const { term_details: termDetails = {} } = scholastic || {};

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
            {/* <ReportCardHeader schoolData={schoolInfo} /> */}
            {/* <StudentDetails userInfo={userInfo} /> */}
            <ReportTable scholastic={scholastic} coScholastic={coScholastic} userInfo={userInfo} />
            <ReportCardFooter
              scholastic={scholastic}
              coScholastic={coScholastic}
              {...getOverallRemark(termDetails)}
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
