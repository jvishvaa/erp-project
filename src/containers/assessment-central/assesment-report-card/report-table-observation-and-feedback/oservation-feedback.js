import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { generateObservationTableHeaders } from '../transform-report-card-data';

const mappingList = ['CLASS TEACHER', 'SECTION COORDINATOR', 'PARENT', 'PRINCIPAL'];

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    '& .MuiTableCell-root': {
      padding: '0px 4px',
      whiteSpace: 'nowrap',
      border: '1px solid black',
      textAlign: 'left !important',
    },
  },
});

export default function AssesmentObservatioAndFeedbackReport({
  observationFeedback = [],
}) {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={7} style={{ backgroundColor: '#E46C07' }}>
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
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align='right'
                  style={{ backgroundColor: '#FABF90', width: '0%' }}
                  rowSpan={6}
                  colSpan={1}
                >
                  <Box style={{ transform: 'rotate(270deg)' }}>{subjectName}</Box>
                </StyledTableCell>
                <StyledTableCell
                  align='right'
                  colSpan={5}
                  style={{ backgroundColor: '#FABF90' }}
                >
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '90%',
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
                  style={{
                    backgroundColor: '#FABF90',
                    width: '0%',
                  }}
                  rowSpan={6}
                  colSpan={1}
                >
                  <Box style={{ transform: 'rotate(90deg)' }}>
                    Teacher's Name <br />
                    and Signature
                  </Box>
                </StyledTableCell>
              </TableRow>

              {[...generateObservationTableHeaders(traits)].map(
                ({ label = '', value = '' }) => (
                  <TableRow>
                    <StyledTableCell
                      colSpan={2}
                      style={{
                        width: '25%',
                        textTransform: 'capitalize',
                      }}
                    >
                      {label}
                    </StyledTableCell>
                    <StyledTableCell colSpan={3} style={{ width: '75%' }}>
                      {value}
                    </StyledTableCell>
                  </TableRow>
                )
              )}
              <TableRow>
                <StyledTableCell
                  scope='center'
                  style={{ backgroundColor: '#E46C07', padding: '5px' }}
                  colSpan={7}
                >
                  {' '}
                </StyledTableCell>
              </TableRow>
            </TableHead>
          )
        )}
        <TableRow>
          <StyledTableCell
            scope='center'
            style={{ backgroundColor: '#FABF90', padding: '5px', height: '20px' }}
            colSpan={7}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'flex-end',
                height: '80px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {mappingList.map((label) => (
                <Box>{label}</Box>
              ))}
            </Box>
          </StyledTableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}
