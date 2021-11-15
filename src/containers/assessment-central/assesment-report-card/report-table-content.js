import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateTermDetailsSummaryRow,
  generateGradeScale,
} from './transform-report-card-data';
import clsx from 'clsx';

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 11,
  },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const useStyles = makeStyles({
  tableFooter: {
    textAlign: 'left !important',
    padding: '5px 2px !important',
    fontStyle: 'italic',
  },
  tableBodyCell: {
    padding: '5px 2px !important',
  },
  tableBoldCell: {
    fontWeight: '600 !important',
  },
});

const ReportTableContent = (props) => {
  const classes = useStyles();

  const { Data = {}, TableType = '' } = props || {};

  const {
    category_map: categoryMap = {},
    term_details: termDetails = {},
    grade_scale: gradeScale = {},
  } = Data || {};

  const {
    categoryKeys,
    categoryRow,
    constantHeaders,
    weightRow,
    categoryAssessmentType,
  } = generateCategoryMap(categoryMap) || {};

  const semesterMarks = generateTermDetails(termDetails, categoryKeys) || [];

  const termDetailsSummary =
    generateTermDetailsSummaryRow(termDetails, categoryRow?.length) || [];

  const tableHeaderRow = getTableHeaderRow(TableType, categoryRow?.length);
  const totalColspan = tableHeaderRow.reduce(
    (total, { colspan = 1 }) => total + colspan,
    0
  );
  const gradeScaleRow = generateGradeScale(gradeScale);

  return (
    <>
      <TableHead>
        <TableRow>
          {tableHeaderRow.map(({ backgroundColor, value, colspan }) => (
            <StyledTableCell style={{ backgroundColor }} colSpan={colspan}>
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
        <TableRow>
          {['Subject', ...categoryRow].map((subject, index) => (
            <StyledTableCell
              align='right'
              style={{ width: index === 0 ? '156px' : '46px', height: '46px' }}
            >
              {subject}
            </StyledTableCell>
          ))}
          <StyledTableCell
            align='right'
            style={{
              // backgroundColor: 'rgb(251 222 198)',
              width: '46px',
            }}
          >
            Tot.
          </StyledTableCell>

          {constantHeaders.map((item) => (
            <StyledTableCell align='right' rowSpan={2} style={{ width: '46px' }}>
              {item}
            </StyledTableCell>
          ))}
          {categoryRow.map((subject) => (
            <StyledTableCell align='right' style={{ width: '46px' }}>
              {subject}
            </StyledTableCell>
          ))}
          <StyledTableCell
            align='right'
            style={{
              // backgroundColor: 'rgb(251 222 198)',
              width: '46px',
            }}
          >
            Tot.
          </StyledTableCell>
          {[...constantHeaders, '(T1 + T2)/2', ...constantHeaders].map((item, index) => (
            <StyledTableCell
              align='right'
              rowSpan={2}
              style={{ width: index === 3 ? '74px' : '46px' }}
            >
              {item}
            </StyledTableCell>
          ))}
        </TableRow>
        <TableRow>
          {['WEIGHTAGE(%) / MAX.MARKS', ...weightRow, ...weightRow].map((weight) => (
            <StyledTableCell
              align='right'
              // style={{ backgroundColor: 'rgb(247 199 160)' }}
            >
              {weight}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {semesterMarks.map((subjectRow) => (
          <TableRow>
            {subjectRow.map((marks, index) => (
              <StyledTableCell
                className={clsx(classes.tableBodyCell, {
                  [classes.tableBoldCell]: index === 0,
                })}
                scope='center'
              >
                {marks}
              </StyledTableCell>
            ))}
          </TableRow>
        ))}
        {/* <TableRow>
          <StyledTableCell
            colSpan={totalColspan}
            style={{ padding: '12px' }}
          ></StyledTableCell>
        </TableRow> */}
        <TableRow
        // style={{ backgroundColor: 'rgb(247 199 160)' }}
        >
          {termDetailsSummary.map(({ value = '', colSpan = 1 }, index) => (
            <StyledTableCell
              className={clsx(classes.tableBodyCell, classes.tableBoldCell)}
              scope='center'
              colSpan={colSpan}
            >
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
        {[gradeScaleRow, categoryAssessmentType].filter(Boolean).map((element) => (
          <TableRow>
            <StyledTableCell className={classes.tableFooter} colSpan={totalColspan}>
              {element}
            </StyledTableCell>
          </TableRow>
        ))}
        <TableRow>
          <StyledTableCell
            colSpan={totalColspan}
            style={{ padding: '12px' }}
          ></StyledTableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default ReportTableContent;
