import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { generateFooterData } from './transform-report-card-data';

const useStyles = makeStyles({
  tableFooter: {
    textAlign: 'left !important',
    padding: '5px 2px !important',
  },
  tableBodyCell: {
    padding: '5px 2px !important',
  },
  tableHead: {
    fontWeight: '600 !important',
    padding: '5px 2px !important',
  },
  tableCellCenter: {
    textAlign: 'center !important',
  },
  tableCellLeft: {
    textAlign: 'left !important',
  },
  tableTopCell: {
    textAlign: 'left !important',
    padding: '5px !important',
    fontWeight: '600 !important',
  },
  footerRowTwoCellOne: {
    fontWeight: '600 !important',
    padding: '5px 2px !important',
    height: '30px',
    textTransform: 'none !important',
  },
  footerRowTwoCellTwo: {
    textAlign: 'left !important',
    padding: '5px 2px !important',
    height: '30px',
  },
  footerRowThreeCell: {
    padding: '5px 2px !important',
    fontWeight: '600 !important',
    height: '30px',
  },
  footerRowThree: {
    padding: '5px 2px !important',
    fontWeight: '600 !important',
    textTransform: 'none !important',
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 11,
  },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const ReportCardFooter = ({ scholastic, coScholastic, schoolData }) => {
  const classes = useStyles();
  const [footerRowOne = [], footerRowTwo = [], footerRowThree = []] = generateFooterData(
    scholastic,
    coScholastic,
    schoolData
  );
  return (
    <>
      <TableHead />
      <TableBody>
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
          {footerRowOne.map(({ value = '', colspan = '' }, index) => (
            <StyledTableCell
              className={
                index % 2 === 0
                  ? classes.footerRowTwoCellOne
                  : classes.footerRowTwoCellTwo
              }
              colspan={colspan}
            >
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
        <TableRow style={{ backgroundColor: '#FDBF8E' }}>
          {footerRowTwo.map(({ value = '', colspan = '' }, index) => (
            <StyledTableCell
              className={
                index % 2 === 0
                  ? classes.footerRowTwoCellOne
                  : classes.footerRowTwoCellTwo
              }
              colspan={colspan}
            >
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
        <TableRow style={{ backgroundColor: '#FDD6B3' }}>
          {footerRowThree.map(({ value = '', colspan = '' }) => (
            <StyledTableCell className={classes.footerRowThree} colspan={colspan}>
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableBody>
    </>
  );
};

export default ReportCardFooter;
