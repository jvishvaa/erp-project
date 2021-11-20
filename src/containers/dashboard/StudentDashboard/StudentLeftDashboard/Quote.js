import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  //   quotes: {
  //     position: 'absolute',
  //     top: '20px',
  //   },
}));

const Quote = () => {
  const classes = useStyles();

  return (
    <div className={classes.quotes}>
      <span style={{ color: '#014B7E', fontWeight: 800 }}>
        Live each day as if your life had just begun
      </span>
      <span style={{ color: '#014B7E' }}>- JOHAN WOLFGANG GON VOETHE</span>
    </div>
  );
};

export default Quote;
