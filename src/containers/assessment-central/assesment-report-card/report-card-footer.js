import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
  },
  tr: {
    padding: '1px',
    border: '1px solid #dddddd',
  },
}));

const ReportCardFooter = ({ overallRemarkSemOne = '', overallRemarkSemTwo = '' }) => {
  const classes = useStyles();

  return (
    <>
      <table style={{ width: '100%', overflowX: 'auto' }}>
        <tr className={classes.tr} style={{ background: '#fff' }}>
          <td className={classes.tr} colspan='8'>
            CLASS TEACHER'S REMARK:-
          </td>
        </tr>
        <tr className={classes.tr} style={{ background: '#FDF29B' }}>
          <td className={classes.tr} colspan='1' style={{ padding: '10px' }}>
            SEMESTER 1
          </td>
          <td className={classes.tr} colspan='3' style={{ padding: '10px' }}>
            {overallRemarkSemOne}
          </td>
          <td className={classes.tr} colspan='1' style={{ padding: '10px' }}>
            SEMESTER 2
          </td>
          <td className={classes.tr} colspan='3' style={{ padding: '10px' }}>
            {overallRemarkSemTwo}
          </td>
        </tr>
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
