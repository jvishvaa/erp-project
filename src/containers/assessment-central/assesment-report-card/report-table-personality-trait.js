import React from 'react';
import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { generatePersonalityTraits } from './transform-report-card-data';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      // border: '1px solid rgba(224, 224, 224, 1)',
      padding: '0px',
    },
  },
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
    // backgroundColor: '#7abbbb',
  },
  tableCellCenter: {
    textAlign: 'center !important',
  },
  tableCellLeft: {
    textAlign: 'left !important',
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

const PersonalityTraitTable = ({ scholastic, coScholastic }) => {
  const classes = useStyles();

  const personalityTraits = generatePersonalityTraits(scholastic, coScholastic) || [];

  const totalColspan = personalityTraits[0].reduce(
    (total, { colspan = 1 }) => total + colspan,
    0
  );

  function rowType(index, value, colspan, subIndex) {
    return index === 0 ? (
      <StyledTableCell colSpan={colspan} className={classes.tableHead}>
        {value}
      </StyledTableCell>
    ) : (
      <StyledTableCell
        colSpan={colspan}
        className={
          [1, 3, 4].includes(subIndex)
            ? clsx(classes.tableCellCenter, classes.tableBodyCell)
            : clsx(classes.tableCellLeft, classes.tableBodyCell)
        }
      >
        {value}
      </StyledTableCell>
    );
  }

  return (
    <>
      <TableHead />
      <TableBody>
        {personalityTraits.map((traitArray, index) => (
          <TableRow style={{ backgroundColor: index === 0 ? '#FDBF8E' : '#fff' }}>
            {traitArray.map(({ value, colspan }, subIndex) =>
              rowType(index, value, colspan, subIndex)
            )}
          </TableRow>
        ))}
        <TableRow>
          <StyledTableCell colSpan={totalColspan} style={{ padding: '12px' }} />
        </TableRow>
      </TableBody>
    </>
  );
};

export default PersonalityTraitTable;
