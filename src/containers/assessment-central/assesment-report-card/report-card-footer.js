import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    marginTop: '20px',
  },
  tr: {
    padding: '2px',
    border: '1px solid #dddddd',
  },
}));

const ReportCardFooter = () => {
  // const { Data } = JSON.parse(data);
  const classes = useStyles();

  return (
    <>
      <table className={classes.table}>
        <tr className={classes.tr} style={{ backgroundColor: '#F9D423' }}>
          <td className={classes.tr} style={{ width: '15%' }}>
            CLASS TEACHER'S REMARK
          </td>
          <td className={classes.tr}></td>
        </tr>
      </table>
      <table style={{ width: '100%', overflowX: 'auto' }}>
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
    </>
  );
};

export default ReportCardFooter;
