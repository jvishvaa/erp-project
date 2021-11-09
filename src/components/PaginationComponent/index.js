import React from 'react';
import { Pagination } from '@material-ui/lab';
import { makeStyles, Box } from '@material-ui/core';
import classWiseSms from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/classWiseSms';

const useStyles = makeStyles({
  pagination: {
    '& .MuiPagination-root': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
    },
  },
});

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
  const classes = useStyles();
  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box className={classes.pagination}>
      <Pagination
        onChange={handlePagination}
        count={totalPages}
        color='primary'
        page={currentPage}
      />
    </Box>
  );
};

export default PaginationComponent;
