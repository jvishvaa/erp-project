import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { generateObservationTableHeaders } from '../transform-report-card-data';

const mappingList = ['CLASS TEACHER', 'SECTION COORDINATOR', 'PARENT', 'PRINCIPAL'];

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 11,
  },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid black',
      textAlign: 'left !important',
      fontFamily: '"Inter", sans-serif',
      padding: '5px',
    },
    '&.MuiTable-root': {
      width: '99.5%',
      margin: '0.25% auto',
    },
  },
  subjectName: {
    padding: '10px',
    fontWeight: 'bold !important',
    backgroundColor: '#FDD6B3',
  },
  label: {
    fontWeight: 'bold !important',
    padding: '5px !important',
    whiteSpace: 'nowrap',
  },
  value: {
    padding: '8px 5px !important',
  },
  footerRowThree: {
    padding: '5px 2px !important',
    fontWeight: '600 !important',
    textTransform: 'none !important',
    fontSize: '11px !important',
  },
});

export default function AssesmentObservatioAndFeedbackReport({
  observationFeedback = [],
}) {
  const classes = useStyles();
  const footerDetails = [
    {
      value:
        '**This is an electronically generated report card, hence does not require a signature or school seal / stamp.**',
      colspan: 7,
    },
  ];

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell
              colSpan={7}
              // style={{ backgroundColor: '#E46C07' }}
              style={{ backgroundColor: '#FDBF8E' }}
            >
              <Box style={{ fontWeight: 'bolder', textAlign: 'center' }}>
                OBSERVATION, FEEDBACK AND ADVISE
              </Box>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        {observationFeedback.map(
          ({
            subject_name: subjectName = '',
            traits = {},
            marks = '',
            grade = '',
            osr = '',
            air = '',
          }) => (
            <TableBody>
              <TableRow>
                <StyledTableCell
                  align='right'
                  className={classes.subjectName}
                  rowSpan={6}
                  colSpan={1}
                >
                  <Box style={{ padding: '10px', transform: 'rotate(270deg)' }}>
                    {subjectName}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  align='right'
                  colSpan={5}
                  style={{ backgroundColor: '#FDD6B3' }}
                >
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'bold',
                      width: '95%',
                    }}
                  >
                    <Box>MARKS - {marks}</Box>
                    <Box>Grade - {grade}</Box>
                    <Box>O.S.R - {osr}</Box>
                    <Box>A.I.R - {air}</Box>
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  align='right'
                  style={{ backgroundColor: '#FDD6B3', padding: '20px' }}
                  rowSpan={6}
                  colSpan={1}
                >
                  <Box style={{ transform: 'rotate(90deg)' }}></Box>
                </StyledTableCell>
              </TableRow>

              {[...generateObservationTableHeaders(traits)].map(
                ({ label = '', value = '' }) => (
                  <TableRow>
                    <StyledTableCell
                      colSpan={2}
                      style={{
                        textTransform: 'capitalize',
                      }}
                      className={classes.label}
                    >
                      {label}
                    </StyledTableCell>
                    <StyledTableCell className={classes.value} colSpan={3}>
                      {value}
                    </StyledTableCell>
                  </TableRow>
                )
              )}
              <TableRow>
                <StyledTableCell
                  scope='center'
                  style={{ backgroundColor: '#FDBF8E', padding: '5px' }}
                  colSpan={7}
                />
              </TableRow>
            </TableBody>
          )
        )}
        <TableRow>
          <StyledTableCell
            scope='center'
            style={{
              backgroundColor: '#FABF90',
              padding: '5px',
              height: '20px',
            }}
            colSpan={7}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'flex-end',
                height: '80px',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            >
              {mappingList.map((label) => (
                <Box>{label}</Box>
              ))}
            </Box>
          </StyledTableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
          {footerDetails.map(({ value = '', colspan = '' }) => (
            <StyledTableCell className={classes.footerRowThree} colspan={colspan}>
              <Box style={{ textAlign: 'center' }}>{value}</Box>
            </StyledTableCell>
          ))}
        </TableRow>
      </Table>
    </TableContainer>
  );
}
