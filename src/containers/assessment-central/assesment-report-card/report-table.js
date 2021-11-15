import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Table, TableContainer } from '@material-ui/core';
import StudentDetails from './report-top-descriptions.js';
import ReportTableContent from './report-table-content';
import PersonalityTraitTable from './report-table-personality-trait';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid rgba(224, 224, 224, 1)',
      padding: '0px',
      whiteSpace: 'nowrap',
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
    <TableContainer style={{ marginTop: '20px' }}>
      <Table className={classes.table} aria-label='customized table'>
        <StudentDetails {...{ userInfo, scholastic, coScholastic }} />
        {tableData.map((data) => (
          <ReportTableContent {...data} />
        ))}
        <PersonalityTraitTable {...{ scholastic, coScholastic }} />
      </Table>
    </TableContainer>
  );
}
