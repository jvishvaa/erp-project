import React from 'react';
import './style.scss';
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const StudentTableList = ({ tableData }) => {
  console.log('The data', tableData);
  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ overflow: 'auto', borderRadius: '10px 0px 10px 0px' }}
      >
        {tableData && tableData.length === 0 && (
          <Grid item md={12} xs={12} style={{ textAlign: 'center', margin: '10px 0px' }}>
            <Typography variant='h6'>Students Not Found</Typography>
          </Grid>
        )}
        {tableData && tableData.length !== 0 && (
          <Grid item md={12} xs={12} style={{ textAlign: 'center', margin: '10px 0px' }}>
            <Table
              style={{ overflow: 'auto', width: '100%' }}
              stickyHeader
              aria-label='sticky table'
            >
              <TableHead className='table-header-row'>
                <TableRow>
                  <TableCell float='center'>S.No</TableCell>
                  <TableCell float='center'>Name</TableCell>
                  <TableCell float='center'>ERP No</TableCell>
                  <TableCell float='center'>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData &&
                  tableData.length !== 0 &&
                  tableData.map((item, index) => (
                    <TableRow key={item.erp_id}>
                      <TableCell float='center'>{index + 1}</TableCell>
                      <TableCell float='center'>{item.name || ''}</TableCell>
                      <TableCell float='center'>{item.erp_id || ''}</TableCell>
                      <TableCell float='center'>
                        {item.is_active ? 'Active' : 'In Active'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
        )}
      </Grid>
    </>
  );
};

StudentTableList.prototype = {
  tableData: PropTypes.instanceOf(Array).isRequired,
};
export default StudentTableList;
