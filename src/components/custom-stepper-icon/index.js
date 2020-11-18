import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#ffffff',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.primary.main}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: theme.palette.primary.main,
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completed: {
    color: '#ffffff',
    zIndex: 1,
    fontSize: 18,
  },
}));

const CustomStepperIcon = (props) => {
  const classes = useStyles();
  const { completed, icon } = props;

  return (
    <div className={clsx(classes.root)}>
      {completed ? (
        <div className={classes.circleCompleted}>
          <span className={classes.completed}>{icon}</span>
        </div>
      ) : (
        <div className={classes.circle}>{icon}</div>
      )}
    </div>
  );
};

export default CustomStepperIcon;
