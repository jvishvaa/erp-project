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
    backgroundColor: '#7abbbb',
  },
  tableCellCenter: {
    textAlign: 'center !important',
  },
  tableCellLeft: {
    textAlign: 'left !important',
  },
});

const TopDetailsHeader = (props) => {
  const { userInfo = {} } = props || {};
  const classes = useStyles();
  const userData = generateReportTopDescription(userInfo || {});

  return (
    <TableBody className='report-top-header-description'>
      {userData.map((responseRow) => (
        <TableRow>
          {Object.values(responseRow).map((value, index) => (
            <StyledTableCell
              colspan={5}
              className={clsx(
                { [classes.tableHead]: index % 2 === 0 },
                classes.tableCellLeft
              )}
            >
              {value}
            </StyledTableCell>
          ))}
        </TableRow>
      ))}
      {/* <div className='report-type-details'>
        <img
          onError={(e) => (e.target.src = placeholderImage)}
          src={profile_img ? profile_img : placeholderImage}
          alt=''
          // style={{ width: '100px', height: '100px', borderRadius: '0px' }}
        />
      </div> */}
    </TableBody>
  );
};

export default TopDetailsHeader;
