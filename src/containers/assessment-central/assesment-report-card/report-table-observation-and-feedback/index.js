import React from 'react';
import { makeStyles, Box, Paper } from '@material-ui/core';
import ObservationReport from './oservation-feedback';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '37px',
    // padding: '19px',
    fontSize: 14,
  },
  gap: {
    margin: '0px 24px',
  },
  table: {
    width: '100%',
    background: '#FABF90',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid black',
    fontWeight: 600,
    padding: '0px 4px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  tr: {
    border: '1px solid black',
    padding: '0px 4px',
  },
  comment: {
    width: '100%',
    height: '89px',
    border: '1px solid black',
    background: '#FCE9D9',
    fontWeight: 600,
    padding: '0px 4px',
  },
}));
const mappingList = ["CLASS TEACHER'S SIGNATURE", 'SECTION COORDINATOR', 'PRINCIPAL'];
const ObservationAndFeedBackReport = ({ observationFeedback = [] }) => {
  const classes = useStyles();

  return (
    <Paper component={'div'} elevation={2} className={classes.root}>
      <ObservationReport observationFeedback={observationFeedback} />
      <Box className={classes.comment}>SECTION COORDINATORS'S COMMENTS-</Box>
      <table className={classes.table}>
        <tr className={classes.tr}>
          <td className={classes.th} colSpan={6}>
            <Box
              style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}
            >
              {mappingList.map((label) => (
                <Box>{label}</Box>
              ))}
            </Box>
          </td>
        </tr>
      </table>
    </Paper>
  );
};

export default ObservationAndFeedBackReport;
