import React, { useContext, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  TablePagination,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Pagination from '@material-ui/lab/Pagination';
import Loader from '../../../../../components/loader/loader';

import ViewClassTableCell from './view-class-table-cell';
import { OnlineclassViewContext } from '../../../online-class-context/online-class-state';

const ViewClassManagementTable = () => {
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const {
    managementView: {
      managementOnlineClasses = [],
      totalPages,
      loadingManagementOnlineClasses,
      currentManagementTab,
      currentPage,
      count,
    },
    setManagementPage,
  } = useContext(OnlineclassViewContext);

  const handlePagination = (event, page) => {
    setManagementPage(page + 1);
    // if (page !== currentPage) {
    // }
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
        <h5 className='expand-management' onClick={toggleHide}>
          View less
        </h5>
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
              <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                Attended
              </TableCell>
              <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                Not attended
              </TableCell>
              <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                Zoom email
              </TableCell>
              <TableCell align='center'>Host</TableCell>
              {currentManagementTab === 0 ? (
                <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                  Cancel class
                </TableCell>
              ) : (
                ''
              )}
              <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
                Attendee list
              </TableCell>
            </TableRow>
          </TableHead>
          {loadingManagementOnlineClasses ? (
            <Loader />
          ) : (
            <TableBody className='viewclass__table-body'>
              {managementOnlineClasses.map((row, index) => (
                <ViewClassTableCell
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
          {!loadingManagementOnlineClasses ? (
            <TablePagination
              rowsPerPageOptions={[]}
              count={count}
              color='secondary'
              onChangePage={handlePagination}
              page={currentPage - 1}
              rowsPerPage={10}
              component='div'
              className='view-class-pagination'
            />
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementTable;
