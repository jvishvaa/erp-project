import { number } from 'prop-types';
import React from 'react';

import Pagination from '@material-ui/lab/Pagination';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Paginations = ({ postsPerPage, totalPosts, paginate }) => {
  const classes = useStyles();
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers);
  return (
    <div>
      <ul className={classes.root}>
        {/* <span> next </span> */}
        {pageNumbers.map((number) => (
          <span key={number}>
            <Button onClick={() => paginate(number)}> {number}</Button>
            {/* <Pagination count={number} color='primary' onClick={() => paginate(number)} /> */}
          </span>
        ))}
      </ul>
      {/* <span> previous</span> */}
    </div>
  );
};

export default Paginations;
