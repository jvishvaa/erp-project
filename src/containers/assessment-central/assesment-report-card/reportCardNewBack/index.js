import React, { useRef } from 'react';
import { makeStyles, Paper, IconButton, Box } from '@material-ui/core';
import ObservationReport from './assessmentBackNew';
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
    position: 'sticky',
    left: '93%',
    bottom: '4%',
    marginTop: '1%',
    background: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '&:hover': {
      background: '#1b4ccb',
    },
  },
}));

const ReportCardNewBack = React.forwardRef((props, ref) => {
  const classes = useStyles();
  return (
    <Box style={{ position: 'relative' }}>
      <Paper component={'div'} elevation={2} className={classes.root} ref={ref}>
        <ObservationReport reportCardDataNew={props.reportCardDataNew} />
      </Paper>
    </Box>
  );
});

export default ReportCardNewBack;
