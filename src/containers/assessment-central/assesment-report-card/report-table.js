import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer } from '@material-ui/core';
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
    },
  },
});

export default function AssesmentReport({ scholastic, coScholastic, userInfo }) {
  const classes = useStyles();
  const tableData = [
    { Data: scholastic, TableType: 'SCHOLASTIC' },
    { Data: coScholastic, TableType: 'CO-SCHOLASTIC' },
  ];

  return (
    <TableContainer>
      <Table className={classes.table}>
        <StudentDetails {...{ userInfo, scholastic, coScholastic }} />
        {tableData.map((data) => (
          <ReportTableContent {...data} />
        ))}
        <PersonalityTraitTable {...{ scholastic, coScholastic }} />
        <ReportCardFooter {...{ scholastic, coScholastic }} />
      </Table>
    </TableContainer>
  );
}
