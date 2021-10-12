import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tr: {
    padding: '2px',
    border: '1px solid #dddddd',
  },
}));

const TableTypeFooter = ({ gradeScale = '', categoryAssessment = '' }) => {
  const classes = useStyles();
  return (
    <table className={classes.table}>
      {[gradeScale, categoryAssessment].filter(Boolean).map((element) => (
        <tr className={classes.tr}>
          <td className={classes.tr}>{element}</td>
        </tr>
      ))}
    </table>
  );
};

export default TableTypeFooter;
