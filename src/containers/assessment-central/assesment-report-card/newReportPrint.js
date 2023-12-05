import React, { useRef, useEffect } from 'react';
import ReportTableNew from './report-table-new';
import { Paper, makeStyles, Box, IconButton } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiPaper-rounded': {
      borderRadius: '0px',
    },
    fontFamily: '"Inter", sans-serif !important',
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

const AssesmentReportNew = React.forwardRef((props, ref) => {
  const classes = useStyles();

  const { reportCardDataNew } = props;

  return (
    <>
      {reportCardDataNew ? (
        <Box style={{ position: 'relative' }}>
          <Paper component={'div'} ref={ref} elevation={2} className={classes.root}>
            <ReportTableNew reportCardDataNew={reportCardDataNew} />
          </Paper>
        </Box>
      ) : (
        'REPORT CARD NOT AVAILABLE'
      )}
    </>
  );
});

export default AssesmentReportNew;
