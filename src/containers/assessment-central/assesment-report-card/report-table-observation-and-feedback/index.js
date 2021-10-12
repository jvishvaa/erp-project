import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ObservationReport from './oservation-feedback';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '37px',
    padding: '19px',
  },
  gap: {
    margin: '0px 24px',
  },
  table: {
    width: '100%',
  },
  tr: {
    padding: '2px',
    border: '1px solid #dddddd',
  },
}));
const ObservationAndFeedBackReport = () => {
  const classes = useStyles();

  return (
    <Paper component={'div'} elevation={2} className={classes.root}>
      <ObservationReport />
      <table className={classes.table}>
        <tr className={classes.tr} style={{ backgroundColor: '#F9D423' }}>
          <td className={classes.tr} style={{ width: '15%' }}>
            CLASS TEACHER'S REMARK
          </td>
          <td className={classes.tr}></td>
        </tr>
      </table>
      <table className={classes.table}>
        <tr className={classes.tr}>
          <td className={classes.tr} style={{ width: '15%' }}>
            SIGNATURE: CLASS TEACHER
          </td>
          <td className={classes.tr}></td>
          <td className={classes.tr} style={{ width: '15%' }}>
            SIGNATURE: COORDINATOR
          </td>
          <td className={classes.tr}></td>
          <td className={classes.tr} style={{ width: '15%' }}>
            SIGNATURE: PARENT
          </td>
          <td className={classes.tr}></td>
          <td className={classes.tr} style={{ width: '15%' }}>
            SIGNATURE: PRINCIPAL
          </td>
          <td className={classes.tr}></td>
        </tr>
      </table>
    </Paper>
  );
};

export default ObservationAndFeedBackReport;
