import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import './style.scss';

const TablePagination = (props) => {
  const { data: { dataPerPage, totalPages, currentPage, totalData } = {}, setData } =
    props;
  const [paginationData, setPaginationData] = useState({
    dataPerPage: dataPerPage,
    totalData: totalData,
    totalPages: totalPages,
    currentPage: currentPage,
  });

  useEffect(() => {
    setPaginationData({
      ...paginationData,
      dataPerPage: dataPerPage,
      totalData: totalData,
      totalPages: totalPages,
      currentPage: currentPage,
    });
  }, [dataPerPage, totalData, totalPages, currentPage]);
  useEffect(() => {
    setData({
      ...paginationData,
    });
  }, [paginationData]);

  const getPagination = () => {
    // currentPage
    // pageCount
    // totalData
    // dataPerPage
    let start;
    let end;
    if (paginationData.totalData < paginationData.dataPerPage + 1) {
      return `1-${paginationData.totalData}`;
    }
    if (paginationData.totalData > paginationData.dataPerPage + 1) {
      if (paginationData.currentPage === 1) {
        start = 1;
      } else {
        start = (paginationData.currentPage - 1) * paginationData.dataPerPage + 1;
      }
      if (paginationData.currentPage === 1) {
        end = paginationData.dataPerPage;
      } else {
        if (
          paginationData.totalData <=
          (paginationData.currentPage - 1) * paginationData.dataPerPage +
            paginationData.dataPerPage
        ) {
          end = paginationData.totalData;
        } else {
          end =
            (paginationData.currentPage - 1) * paginationData.dataPerPage +
            paginationData.dataPerPage;
        }
      }
    }

    return `${start} - ${end}`;
  };
  const handlePagination = (event, page) => {
    event.preventDefault();
    setPaginationData({
      ...paginationData,
      currentPage: page,
    });
  };
  return (
    <div className='table-pagination-container'>
      <Typography variant='body1'>Rows per page:</Typography>
      <FormControl margin='dense' variant='outlined' className='data-count-formcontrol'>
        <Select
          value={paginationData.dataPerPage || ''}
          name='data-per-page'
          onChange={(e) => {
            setPaginationData({
              ...paginationData,
              dataPerPage: e.target.value,
              currentPage: 1,
            });
          }}
          className='data-count-select'
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <div className='data-pagination'>
        <Typography variant='body2' className='total-meeting-count'>
          {getPagination()} of {totalData && totalData}
        </Typography>
        <Pagination
          style={{ textAlign: 'center', display: 'inline-flex' }}
          onChange={handlePagination}
          count={paginationData.totalPages}
          color='primary'
          page={paginationData.currentPage}
        />
      </div>
    </div>
  );
};

export default TablePagination;
