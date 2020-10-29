import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import './attendee-list.scss';

const AttendeeList = () => {
  return (
    <div className='attendee__management-table'>
      <TableContainer>
        <Table className='viewclass__table' aria-label='simple table'>
          <TableHead className='styled__table-head'>
            <TableRow>
              <TableCell align='center'>SL_NO.</TableCell>
              <TableCell align='center'>Student name</TableCell>
              <TableCell align='center'>Erp</TableCell>
              <TableCell align='center'>Grade</TableCell>
              <TableCell align='center'>Section</TableCell>
              <TableCell align='center'>Class</TableCell>
              <TableCell align='center'>Attended status</TableCell>
              <TableCell align='center'>Acceptance status</TableCell>
              <TableCell align='center'>Tutor email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='styled__table-body'>
            {/* <TableRow key={id}>

          </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AttendeeList;
