import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateTermDetailsSummaryRow,
  generateGradeScale,
  generateCategoryListMap,
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
  textAlign: {
    textAlign: 'left !important',
  },
});

const ReportTableContent = (props) => {
  const classes = useStyles();

  const { Data = {}, TableType = '', isAirVisible = true } = props || {};

  const {
    category_map_list: categoryMapList = [],
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
  } = generateCategoryMap(categoryMap, isAirVisible) || {};

  const semesterMarks =
    generateTermDetails(termDetails, categoryKeys, isAirVisible) || [];

  const termDetailsSummary =
    generateTermDetailsSummaryRow(termDetails, categoryRow?.length, isAirVisible) || [];

  const tableHeaderRow = getTableHeaderRow(TableType, categoryRow?.length, isAirVisible);
  const totalColspan = tableHeaderRow.reduce(
    (total, { colspan = 1 }) => total + colspan,
    0
  );
  const gradeScaleRow = generateGradeScale(gradeScale);

  const coScholasticCategoryAssessmentType = generateCategoryListMap(categoryMapList);
  const tableTypeFooter =
    TableType === 'CO-SCHOLASTIC'
      ? [gradeScaleRow, ...coScholasticCategoryAssessmentType]
      : [gradeScaleRow, categoryAssessmentType];

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
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
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
              style={{ width: index === (isAirVisible ? 3 : 2) ? '74px' : '46px' }}
            >
              {item}
            </StyledTableCell>
          ))}
        </TableRow>
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
          {['WEIGHTAGE(%) / MAX.MARKS', ...weightRow, ...weightRow].map(
            (weight, index) => (
              <StyledTableCell
                align='right'
                style={{
                  whiteSpace: index === 0 ? 'nowrap' : 'normal',
                  padding: index === 0 ? '0px 2px' : '0px',
                }}
              >
                {weight}
              </StyledTableCell>
            )
          )}
        </TableRow>
      </TableHead>

      <TableBody>
        {semesterMarks.map((subjectRow) => (
          <TableRow>
            {subjectRow.map((marks, index) => (
              <StyledTableCell
                className={clsx(classes.tableBodyCell, {
                  [classes.tableBoldCell]: index === 0,
                  [classes.textAlign]: index === 0,
                })}
                scope='center'
              >
                {marks}
              </StyledTableCell>
            ))}
          </TableRow>
        ))}
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
          {termDetailsSummary.map(({ value = '', colSpan = 1 }, index) => (
            <StyledTableCell
              className={clsx(classes.tableBodyCell, classes.tableBoldCell, {
                [classes.textAlign]: index === 0,
              })}
              scope='center'
              colSpan={colSpan}
            >
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
        {tableTypeFooter.filter(Boolean).map((element) => (
          <TableRow>
            <StyledTableCell className={classes.tableFooter} colSpan={totalColspan}>
              {element}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ReportTableContent;
