import React from 'react';
import {
  Table,
  Paper,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from '@material-ui/core';

import './test-comparision-report-table.scss';

const useStyles = makeStyles(() => ({
  root: {
    padding: 5,
  },
  container: {
    borderRadius: '0.5rem',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  },
  largeText: {
    fontSize: '2rem',
    // padding: '0.2rem',
  },
  green: {
    color: '#5aad29',
  },
  red: {
    color: 'red',
  },
}));

const columns = [
  {
    id: 'test_id',
    label: 'Test Id',
    // minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'total_marks',
    label: 'Total Marks',
    // minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },

  {
    id: 'obtained_marks',
    label: 'Obtained Marks',
    // minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'development',
    label: 'Development',
    // minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
];

const calcDevelopmentAndDiff = (dataRows) => {
  const [itemOne, itemTwo] = dataRows || [];
  const { obtained_marks: obtainedMarksONe = 0 } = itemOne || {};
  const { obtained_marks: obtainedMarksTwo = 0 } = itemTwo || {};
  return obtainedMarksTwo - obtainedMarksONe;
};
const TestComparisionReportTable = ({ dataRows = [] }) => {
  const classes = useStyles();
  const diff = calcDevelopmentAndDiff(dataRows);
  return (
    <>
      <Paper elevation={0} className={classes.root}>
        <TableContainer className={classes.container} boxShadow={3}>
          <Table hover stickyHeader className='test-comparision-table'>
            <TableHead className='table-header-row'>
              <TableRow hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className='table-body-row'>
              {dataRows.map((data, index) => {
                return (
                  <TableRow hover key={`test_table_tow_${data.test_id}`}>
                    <TableCell className={classes.tableCell}>
                      {data.test__test_name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {data.test__total_mark}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {data.obtained_marks}
                    </TableCell>
                    {index === 0 ? (
                      <TableCell className={classes.tableCell} rowSpan={2}>
                        {[NaN, undefined, null, 0].includes(diff) ? null : (
                          <span
                            className={[
                              classes.largeText,
                              diff > 0 ? classes.green : classes.red,
                            ].join(' ')}
                          >
                            {diff > 0 ? '+' : '-'}
                          </span>
                        )}
                        <span className={classes.largeText}>{Math.abs(diff) || 0}</span>
                      </TableCell>
                    ) : (
                      <td style={{ margin: 0, padding: 0 }} />
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
export default TestComparisionReportTable;
