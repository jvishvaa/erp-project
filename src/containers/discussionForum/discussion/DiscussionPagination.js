import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles({
  pageNumberDive: {
    height: '53px',
    textAlign: 'center',
    marginTop: '150px',
  },
  pageNumberSpan: {
    display: 'inline-block',
    textAlign: 'center',
    width: '30px',
    height: '30px',
    fontSize: '20px',
    borderRadius: '50%',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  activePageNumber: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
  },
  pageNumber: {
    color: '#FF6B6B',
  },
});

const DiscussionPagination = ({ showPerPage, onPaginationChange, totalCategory }) => {
  const classes = useStyles({});
  const [page, setPage] = React.useState(1);
  const [numberOfPage, setNumberOfPage] = React.useState(
    Math.ceil(totalCategory / showPerPage)
  );

  React.useEffect(() => {
    const value = showPerPage * page;
    onPaginationChange(value - showPerPage, value);
  }, [page]);

  const onButtonClick = (type) => {
    if (type === 'prev') {
      if (page === 1) {
        setPage(1);
      } else {
        setPage(page - 1);
      }
    } else if (type === 'next') {
      setPage(page + 1);
      if (numberOfPage === page) {
        setPage(page);
      } else {
        setPage(page + 1);
      }
    }
  };

  return (
    <div className={classes.pageNumberDive}>
      <Button
        variant='text'
        color='primary'
        startIcon={<ArrowBackIosIcon />}
        onClick={() => onButtonClick('prev')}
        style={{backgroundColor: 'transparent'}}
      >
        Previous
      </Button>
      {new Array(numberOfPage).fill('').map((ele, index) => (
        <span
          className={`${classes.pageNumberSpan} ${
            index + 1 === page ? classes.activePageNumber : classes.pageNumber
          }`}
          onClick={() => setPage(index + 1)}
          key={index}
        >
          {index + 1}
        </span>
      ))}
      <Button
        variant='text'
        color='primary'
        endIcon={<ArrowForwardIosIcon />}
        onClick={() => onButtonClick('next')}
        style={{backgroundColor: 'transparent'}}
      >
        Next
      </Button>
    </div>
  );
};

export default DiscussionPagination;
