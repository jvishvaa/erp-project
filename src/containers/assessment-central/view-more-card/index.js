import React from 'react';
import Paper from '@material-ui/core/Paper';
import { IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  rootViewMore: theme.rootViewMore,
}));

const ViewMoreCard = ({}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.rootViewMore}>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          <div className='headerTitle'></div>
          <div className='headerContent'></div>
        </div>
        <div className='rightHeader'>
          <div className='headerTitle closeIcon'>
            <IconButton>
              <CloseIcon color='primary' />
            </IconButton>
          </div>
          <div className='headerContent'></div>
        </div>
      </div>
    </Paper>
  );
};

export default ViewMoreCard;
