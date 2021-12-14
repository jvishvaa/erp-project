import React from 'react';
import { TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { generateReportTopDescription } from './transform-report-card-data';

const placeholderImage =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 11,
  },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const useStyles = makeStyles({
  tableBodyCell: {
    padding: '5px 4px !important',
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
});

const TopDetailsHeader = ({
  userInfo = {},
  scholastic = {},
  coScholastic = {},
  isOrchids = true,
}) => {
  const { profile_img = placeholderImage } = userInfo || {};
  const classes = useStyles();
  const userData = generateReportTopDescription(
    userInfo || {},
    scholastic,
    coScholastic,
    isOrchids
  );

  return (
    <>
      <TableHead />
      <TableBody>
        {userData.map((responseRow, index) => (
          <TableRow>
            {Object.values(responseRow).map(({ value, colspan }, subIndex) => (
              <StyledTableCell
                colspan={colspan}
                className={clsx(
                  subIndex % 2 === 0 ? classes.tableHead : classes.tableBodyCell,
                  classes.tableCellLeft
                )}
                style={{
                  background: '#FDD6B3',
                  whiteSpace: index === 3 && subIndex === 2 ? 'nowrap' : 'normal',
                }}
              >
                {value}
              </StyledTableCell>
            ))}
            {index === 0 && (
              <StyledTableCell colspan={2} rowSpan={4}>
                <img
                  onError={(e) => (e.target.src = placeholderImage)}
                  src={profile_img ? profile_img : placeholderImage}
                  alt=''
                  style={{ width: '100px', height: '100px', borderRadius: '0px' }}
                />
              </StyledTableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default TopDetailsHeader;
