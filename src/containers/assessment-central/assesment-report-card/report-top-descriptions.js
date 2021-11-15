import React from 'react';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { generateReportTopDescription } from './transform-report-card-data';
import './style.scss';

const placeholderImage =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 12,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const useStyles = makeStyles({
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
});

const TopDetailsHeader = (props) => {
  const { userInfo = {}, scholastic = {}, coScholastic = {} } = props || {};
  const { profile_img = placeholderImage } = userInfo || {};
  const classes = useStyles();
  const userData = generateReportTopDescription(userInfo || {}, scholastic, coScholastic);

  return (
    <TableBody className='report-top-header-description'>
      {userData.map((responseRow, index) => (
        <TableRow>
          {Object.values(responseRow).map(({ value, colspan }, index) => (
            <StyledTableCell
              colspan={colspan}
              className={clsx(
                { [classes.tableHead]: index % 2 === 0 },
                classes.tableCellLeft
              )}
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
  );
};

export default TopDetailsHeader;
