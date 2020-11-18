import React, { useContext, useEffect, useState } from 'react';
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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Pagination from '@material-ui/lab/Pagination';

import OnlineClassResourceCell from './online-class-resource-cell';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';
import Loader from '../../../../components/loader/loader';

const OnlineClassResourceTable = () => {
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);

  const {
    resourceView: {
      resourceOnlineClasses = [],
      totalPages,
      loadingResourceOnlineClasses,
      currentPage,
    },
    setResourcePage,
  } = useContext(OnlineclassViewContext);

  const handlePagination = (event, page) => {
    if (page !== currentPage) {
      setResourcePage(page);
    }
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className='viewclass__management-table'>
      {isHidden ? (
        <h5 className='expand-management' onClick={toggleHide}>
          View more
        </h5>
      ) : (
        // <AddCircleOutlineIcon className='expand-management' onClick={toggleHide} />
        <h5 className='expand-management' onClick={toggleHide}>
          View less
        </h5>
        // <RemoveCircleIcon className='expand-management' onClick={toggleHide} />
      )}
      <TableContainer>
        <Table className='viewclass__table' aria-label='simple table'>
          <TableHead className='viewclass__table-head'>
            <TableRow>
              <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                SL_NO.
              </TableCell>
              <TableCell align='center'>Title</TableCell>
              <TableCell align='center'>Subject</TableCell>
              <TableCell align='center'>Start time</TableCell>
              <TableCell align='center'>Upload resource</TableCell>
            </TableRow>
          </TableHead>
          {loadingResourceOnlineClasses ? (
            <Loader />
          ) : (
            <TableBody className='viewclass__table-body'>
              {resourceOnlineClasses.map((row, index) => (
                <OnlineClassResourceCell
                  isHidden={isHidden}
                  data={row}
                  key={row.id}
                  index={index}
                  currentPage={currentPage}
                />
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
          {!loadingResourceOnlineClasses ? (
            <Pagination
              count={totalPages}
              color='primary'
              onChange={handlePagination}
              page={currentPage}
            />
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default OnlineClassResourceTable;
