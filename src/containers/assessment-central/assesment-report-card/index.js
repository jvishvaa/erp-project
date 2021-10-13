import React from 'react';
import ReportTable from './report-table.js';
import StudentDetails from './report-top-descriptions.js';
import { Paper, makeStyles } from '@material-ui/core';
import PersonalityTraitTable from './report-table-personality-trait';
import ReportCardFooter from './report-card-footer';
import ReportCardHeader from './report-card-header';
import { getOverallRemark } from './transform-report-card-data';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px auto',
    padding: '15px',
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
        <Paper component={'div'} elevation={2} className={classes.root}>
          <ReportCardHeader schoolData={schoolInfo} />
          <StudentDetails userInfo={userInfo} />
          <ReportTable TableType={'SCHOLASTIC'} Data={scholastic} />
          <ReportTable TableType={'CO-SCHOLASTIC'} Data={coScholastic} />
          {/* <PersonalityTraitTable /> */}
          {/* <TableTypeFooter gradeScale={CO_SCHOLASTIC_GRADE_SCALE} /> */}
          <ReportCardFooter {...getOverallRemark(termDetails)} />
        </Paper>
      ) : (
        'REPORT CARD NOT AVAILABLE'
      )}
    </>
  );
};

export default AssesmentReport;
