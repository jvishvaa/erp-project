import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  a: {
    fill: '#ff6b6b',
  },
});

const DotSeperator = () => {
  const classes = useStyles({});
  return (
    <SvgIcon width='12' height='12' viewBox='0 0 12 12'>
      <circle className={classes.a} cx='6' cy='6' r='6' />
    </SvgIcon>
  );
};
export default DotSeperator;
