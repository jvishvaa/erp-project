import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  Button,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

const ViewClassManagementTable = () => {
  const rows = [{}, {}, {}];
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
              <TableCell align='center'>Join class</TableCell>
              <TableCell align='center'>Attended</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='viewclass__table-body'>
            {rows.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell align='center'>{index + 1}</TableCell>
                <TableCell align='center'>Numeracy</TableCell>
                <TableCell align='center'>Numeracy</TableCell>
                <TableCell align='center'>2020 - 10 - 15 15 : 22</TableCell>
                <TableCell align='center'>222</TableCell>
                <TableCell align='center'>80</TableCell>
                <TableCell align='center'>zoom110@orchids .edu.in</TableCell>
                <TableCell align='center'>
                  <Button variant='contained' color='primary'>
                    Join
                  </Button>
                </TableCell>
                <TableCell align='center'>Attended</TableCell>
              </TableRow>
            ))}
          </TableBody>
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
          <Pagination count={10} color='primary' />
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementTable;
