import React, { useRef } from 'react';
import ReportTable from './report-table.js';
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
  },
}));

const AssesmentReport = ({ reportCardData }) => {
  const classes = useStyles();
  const componentRef = useRef();
  const {
    scholastic = {},
    co_scholastic: coScholastic = {},
    school_info: schoolInfo = {},
    user_info: userInfo = {},
  } = reportCardData || {};

  return (
    <>
      {reportCardData ? (
        <Box style={{ position: 'relative' }}>
          <Paper
            component={'div'}
            ref={componentRef}
            elevation={2}
            className={classes.root}
          >
            <ReportTable
              scholastic={scholastic}
              coScholastic={coScholastic}
              userInfo={userInfo}
              schoolData={schoolInfo}
            />
          </Paper>
          <ReactToPrint
            trigger={() => (
              <IconButton
                className={classes.printButton}
                title='Print front side of the report card'
              >
                <PrintIcon />
              </IconButton>
            )}
            content={() => componentRef.current}
          />
        </Box>
      ) : (
        'REPORT CARD NOT AVAILABLE'
      )}
    </>
  );
};

export default AssesmentReport;
