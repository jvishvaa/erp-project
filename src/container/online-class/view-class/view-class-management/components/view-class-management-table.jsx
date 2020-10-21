import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

const ViewClassManagementTable = () => {
  const rows = [{ name: 'hemanth', calories: 100, fat: 100, carbs: 100, protein: 100 }];
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
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell align='center'>{row.name}</TableCell>
                <TableCell align='center'>{row.calories}</TableCell>
                <TableCell align='center'>{row.fat}</TableCell>
                <TableCell align='center'>{row.carbs}</TableCell>
                <TableCell align='center'>{row.protein}</TableCell>
                <TableCell align='center'>{row.calories}</TableCell>
                <TableCell align='center'>{row.fat}</TableCell>
                <TableCell align='center'>{row.carbs}</TableCell>
                <TableCell align='center'>{row.protein}</TableCell>
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
          <Pagination count={10} color='secondary' />
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementTable;
