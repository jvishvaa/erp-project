import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import ObservationReport from './oservation-feedback';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 11,
  },
}));

const ObservationAndFeedBackReport = ({ observationFeedback = [] }) => {
  const classes = useStyles();

  return (
    <Paper component={'div'} elevation={2} className={classes.root}>
      <ObservationReport observationFeedback={observationFeedback} />
    </Paper>
  );
};

export default ObservationAndFeedBackReport;
