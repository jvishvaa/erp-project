import React, { useContext, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  CircularProgress,
  Button,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import OnlineClassResourceCell from './online-class-resource-cell';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';

const OnlineClassResourceTable = () => {
  const {
    managementView: {
      managementOnlineClasses = [],
      totalPages,
      loadingManagementOnlineClasses,
      currentManagementTab,
    },
    listOnlineClassesManagementView,
  } = useContext(OnlineclassViewContext);

  useEffect(() => {
    const url = `page_number=1&page_size=10&branch_ids=5&is_completed=${false}&is_cancelled=${false}&start_date=2020-11-03&end_date=2020-11-03`;
    listOnlineClassesManagementView(url);
  }, []);

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
              <TableCell align='center'>Upload resource</TableCell>
            </TableRow>
          </TableHead>
          {loadingManagementOnlineClasses ? (
            <CircularProgress className='progress-center' />
          ) : (
            <TableBody className='viewclass__table-body'>
              {managementOnlineClasses.map((row, index) => (
                <OnlineClassResourceCell data={row} key={row.id} index={index} />
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

export default OnlineClassResourceTable;
