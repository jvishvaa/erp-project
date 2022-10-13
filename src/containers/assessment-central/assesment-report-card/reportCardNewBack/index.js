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

const ReportCardNewBack = (props) => {
  const classes = useStyles();
  const componentRef = useRef();
  return (
    <Box style={{ position: 'relative' }}>
      <Paper component={'div'} elevation={2} className={classes.root} ref={componentRef}>
        <ObservationReport reportCardDataNew={props.reportCardDataNew} />
      </Paper>
      <ReactToPrint
        trigger={() => (
          <IconButton
            className={classes.printButton}
            title='Print back side of the report card'
          >
            <PrintIcon />
          </IconButton>
        )}
        content={() => componentRef.current}
        documentTitle={`Eduvate Back - ${props?.reportCardDataNew?.user_info?.name}`}
      />
    </Box>
  );
};

export default ReportCardNewBack;
