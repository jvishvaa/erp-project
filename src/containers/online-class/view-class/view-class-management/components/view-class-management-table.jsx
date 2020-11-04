import React, { useContext } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import ViewClassTableCell from './view-class-table-cell';
import { OnlineclassViewContext } from '../../../online-class-context/online-class-state';

const ViewClassManagementTable = () => {
  const {
    managementView: {
      managementOnlineClasses = [],
      totalPages,
      loadingManagementOnlineClasses,
      currentManagementTab,
    },
  } = useContext(OnlineclassViewContext);

  return (
    <div className='viewclass__management-table'>
      <TableContainer>
        <Table className='viewclass__table' aria-label='simple table'>
          <TableHead className='viewclass__table-head'>
            <TableRow>
              <TableCell align='center'>SL_NO.</TableCell>
              <TableCell align='center'>Title</TableCell>
              <TableCell align='center'>Subject</TableCell>
              <TableCell align='center'>Start time</TableCell>
              <TableCell align='center'>Attended</TableCell>
              <TableCell align='center'>Not attended</TableCell>
              <TableCell align='center'>Zoom email</TableCell>
              <TableCell align='center'>Host/ Audit class</TableCell>
              {currentManagementTab === 0 ? (
                <TableCell align='center'>Cancel class</TableCell>
              ) : (
                ''
              )}
              <TableCell align='center'>Attendee list</TableCell>
              <TableCell align='center'>Tutor email</TableCell>
            </TableRow>
          </TableHead>
          {loadingManagementOnlineClasses ? (
            <CircularProgress className='progress-center' />
          ) : (
            <TableBody className='viewclass__table-body'>
              {managementOnlineClasses.map((row, index) => (
                <ViewClassTableCell data={row} key={row.id} index={index} />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Grid
        className='pagination__container'
        container
        direction='column'
        alignItems='center'
        justify='center'
      >
        <Grid item xs={12}>
          {!loadingManagementOnlineClasses ? (
            <Pagination count={totalPages} color='primary' />
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementTable;
