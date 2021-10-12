import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateTermDetailsSummaryRow,
} from './transform-report-card-data';

const StyledTableCell = withStyles((theme) => ({
  head: {
    // color: theme.palette.common.white,
    fontSize: 15,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },

    padding: '0px 16px',
    whiteSpace: 'nowrap',
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      padding: '0px 16px',
      whiteSpace: 'nowrap',
    },
  },
});

export default function AssesmentReport(props) {
  const classes = useStyles();

  const { Data = {}, TableType } = props || {};
  const { category_map: categoryMap = {}, term_details: termDetails = {} } = Data || {};
  const { categoryRow, constantHeaders, weightRow, categoryAssessmentType } =
    generateCategoryMap(categoryMap) || {};
  const semesterMarks = generateTermDetails(termDetails, categoryRow?.length) || [];
  const termDetailsSummary = generateTermDetailsSummaryRow(termDetails) || [];
  const tableHeaderRow = getTableHeaderRow(TableType);

  return (
    <>
      {Object.entries(categoryMap).length > 0 && (
        <TableContainer style={{ marginTop: '20px' }}>
          <Table className={classes.table} aria-label='customized table'>
            <TableHead>
              <TableRow>
                {tableHeaderRow.map(({ backgroundColor, value, colspan }) => (
                  <StyledTableCell style={{ backgroundColor }} colSpan={colspan}>
                    {value}
                  </StyledTableCell>
                ))}
              </TableRow>
              <TableRow>
                {['Subject', ...categoryRow].map((subject) => (
                  <StyledTableCell align='right'>{subject}</StyledTableCell>
                ))}
                <StyledTableCell
                  align='right'
                  style={{ backgroundColor: 'rgb(251 222 198)' }}
                >
                  Tot.
                </StyledTableCell>

                {constantHeaders.map((item) => (
                  <StyledTableCell align='right' rowSpan={2}>
                    {item}
                  </StyledTableCell>
                ))}
                {categoryRow.map((subject) => (
                  <StyledTableCell align='right'>{subject}</StyledTableCell>
                ))}
                <StyledTableCell
                  align='right'
                  style={{ backgroundColor: 'rgb(251 222 198)' }}
                >
                  Tot.
                </StyledTableCell>
                {[...constantHeaders, '(T1 + T2)/2', ...constantHeaders].map((item) => (
                  <StyledTableCell align='right' rowSpan={2}>
                    {item}
                  </StyledTableCell>
                ))}
              </TableRow>
              <TableRow>
                {['WEIGHTAGE(%)/MAX.MARKS', ...weightRow, ...weightRow].map((weight) => (
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(247 199 160)' }}
                  >
                    {weight}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {semesterMarks.map((subjectRow) => (
                <StyledTableRow>
                  {subjectRow.map((marks) => (
                    <StyledTableCell scope='center'>{marks}</StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
              <StyledTableRow>
                <StyledTableCell
                  colSpan={25}
                  style={{ padding: '10px' }}
                ></StyledTableCell>
              </StyledTableRow>
              <StyledTableRow style={{ backgroundColor: 'rgb(247 199 160)' }}>
                {termDetailsSummary.map(({ value = '', colSpan = 1 }) => (
                  <StyledTableCell scope='center' colSpan={colSpan}>
                    {value}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
