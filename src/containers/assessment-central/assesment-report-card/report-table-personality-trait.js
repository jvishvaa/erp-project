import React from 'react';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { generatePersonalityTraits } from './transform-report-card-data';
import './style.scss';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid rgba(224, 224, 224, 1)',
      padding: '0px',
      whiteSpace: 'nowrap',
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
    backgroundColor: '#7abbbb',
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
    fontSize: 12,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const PersonalityTraitTable = ({ scholastic, coScholastic }) => {
  const classes = useStyles();

  const personalityTraits = generatePersonalityTraits(scholastic, coScholastic) || [];

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
    <TableBody className='report-Personality-traits'>
      {personalityTraits.map((traitArray, index) => (
        <TableRow>
          {traitArray.map(({ value, colspan }, subIndex) =>
            rowType(index, value, colspan, subIndex)
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PersonalityTraitTable;
