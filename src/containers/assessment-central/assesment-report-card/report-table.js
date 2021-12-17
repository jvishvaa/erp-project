import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer } from '@material-ui/core';
import ReportCardHeader from './report-card-header';
import StudentDetails from './report-top-descriptions';
import ReportTableContent from './report-table-content';
import PersonalityTraitTable from './report-table-personality-trait';
import ReportCardFooter from './report-card-footer';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid black',
      padding: '0px',
      textTransform: 'capitalize',
      fontFamily: '"Inter", sans-serif',
    },
    '&.MuiTable-root': {
      width: '99.5%',
      margin: '0.25% auto',
    },
  },
});

export default function AssesmentReport({ reportCardData }) {
  const classes = useStyles();

  const {
    scholastic = {},
    co_scholastic: coScholastic = {},
    school_info: schoolData = {},
    user_info: userInfo = {},
    trait_grade_scale: traitGradeScale = {},
  } = reportCardData || {};

  const tableData = [
    { Data: scholastic, TableType: 'SCHOLASTIC' },
    { Data: coScholastic, TableType: 'CO-SCHOLASTIC' },
  ];
  const {
    // is_orchids: isAirVisible = true,
    attendance_view: isAttendanceVisible = true,
    air_view: isAirVisible = true,
    trait_view: isTraitVisible = true,
  } = schoolData;
  
  return (
    <TableContainer>
      <Table className={classes.table}>
        <ReportCardHeader {...{ schoolData, scholastic, coScholastic, isAirVisible }} />
        <StudentDetails {...{ userInfo, scholastic, coScholastic, isAirVisible, isAttendanceVisible }} />
        {tableData.map((data) => (
          <ReportTableContent {...data} isAirVisible={isAirVisible} />
        ))}
        {isTraitVisible && (
          <PersonalityTraitTable {...{ scholastic, coScholastic, traitGradeScale }} />
        )}
        <ReportCardFooter {...{ scholastic, coScholastic, schoolData, isAirVisible }} />
      </Table>
    </TableContainer>
  );
}
