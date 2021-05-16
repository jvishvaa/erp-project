import React from 'react';
import './style.scss';
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

const StudentTableList = ({ tableData }) => {
  console.log('The data', tableData);
  console.log('The data active', tableData[0]?.is_delete);
  const value = true;
  const value2 = false;
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
        <MediaQuery minWidth={600}>
          {tableData && tableData.length !== 0 && (
            <Grid item xs={12} style={{ textAlign: 'center', margin: '10px 0px' }}>
              <TableContainer style={{ height: 300 }}>
                <Table
                  style={{ overflow: 'auto' }}
                  stickyHeader
                  aria-label='sticky table'
                >
                  <TableHead className='table-header-row'>
                    <TableRow>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        S.No
                      </TableCell>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        Name
                      </TableCell>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        ERP No
                      </TableCell>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData &&
                      tableData.length !== 0 &&
                      tableData.map((item, index) => (
                        <TableRow key={item.erp_id}>
                          <TableCell float='center' style={{ fontSize: '12px' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell float='center' style={{ fontSize: '12px' }}>
                            {item.name || ''}
                          </TableCell>
                          <TableCell float='center' style={{ fontSize: '12px' }}>
                            {item.erp_id || ''}
                          </TableCell>
                          <TableCell float='center' style={{ fontSize: '12px' }}>
                            {item.is_active === value && item.is_delete === value2 ? (
                              'Active'
                            ) : item.is_active === value ||
                              (item.is_active === value2 && item.is_delete === value) ? (
                              <span style={{ color: 'rgb(157, 157, 157)' }}>Deleted</span>
                            ) : (
                              'In Active'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
          {tableData && tableData.length !== 0 && (
            <Grid
              item
              md={12}
              xs={12}
              style={{ textAlign: 'center', margin: '10px 0px' }}
            >
              <TableContainer style={{ height: 300 }}>
                <Table
                  style={{ overflow: 'auto', width: '100%' }}
                  stickyHeader
                  aria-label='sticky table'
                >
                  <TableHead className='table-header-row'>
                    <TableRow>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        ERP No
                      </TableCell>
                      <TableCell float='center' style={{ fontSize: '13px' }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData &&
                      tableData.length !== 0 &&
                      tableData.map((item, index) => (
                        <TableRow key={item.erp_id}>
                          <TableCell float='center' style={{ fontSize: '10px' }}>
                            {item.erp_id || ''}
                          </TableCell>
                          <TableCell float='center' style={{ fontSize: '10px' }}>
                            {item.is_active === value && item.is_delete === value2 ? (
                              'Active'
                            ) : item.is_active === value ||
                              (item.is_active === value2 && item.is_delete === value) ? (
                              <span style={{ color: 'rgb(157, 157, 157)' }}>Deleted</span>
                            ) : (
                              'In Active'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </MediaQuery>
      </Grid>
    </>
  );
};

StudentTableList.prototype = {
  tableData: PropTypes.instanceOf(Array).isRequired,
};
export default StudentTableList;
