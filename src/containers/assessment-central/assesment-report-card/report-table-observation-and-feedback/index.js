import React, { useRef } from 'react';
import { makeStyles, Paper, IconButton, Box } from '@material-ui/core';
import ObservationReport from './oservation-feedback';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 11,
    '&.MuiPaper-rounded': {
      borderRadius: '0px',
    },
  },
  printButton: {
    position: 'absolute',
    top: '-24px',
    right: '-24px',
    background: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
}));

const ObservationAndFeedBackReport = ({ observationFeedback = [] }) => {
  const classes = useStyles();
  const componentRef = useRef();

  return (
    <Box style={{ position: 'relative' }}>
      <Paper component={'div'} elevation={2} className={classes.root} ref={componentRef}>
        <ObservationReport observationFeedback={observationFeedback} />
      </Paper>
      <ReactToPrint
        trigger={() => (
          <IconButton className={classes.printButton} variant='contained'>
            <PrintIcon />
          </IconButton>
        )}
        content={() => componentRef.current}
      />
    </Box>
  );
};

export default ObservationAndFeedBackReport;
