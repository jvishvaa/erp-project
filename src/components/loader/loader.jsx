import React from 'react';
import './loader.css';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.secondary.main
  },
  dot: {
    '&:before': {
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const Loader = (props) => {
  const classes = useStyles();
  const { message = 'loading' } = props;
  return (
    <div className='erp_loader_wrapper'>
      <div className='erp_loader-container'>
        <div>
          <div className='erp_loader'>
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
            <div className={clsx(classes.dot, 'erp_loader-dot')} />
          </div>
          <p className={clsx(classes.title, 'erp_loader--title')}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
