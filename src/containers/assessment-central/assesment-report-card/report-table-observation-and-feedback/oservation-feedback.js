import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const StyledTableCell = withStyles((theme) => ({
  head: {
    // color: theme.palette.common.white,
    fontSize: 15,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },

    padding: '0px 16px',
    whiteSpace: 'nowrap',
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 700,
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      padding: '0px 16px',
      whiteSpace: 'nowrap',
    },
    tr: {
      padding: '2px',
      border: '1px solid #dddddd',
    },
  },
});
const FeedbackSignature = () => {
  const classes = useStyles();

  return (
    <table className={classes.table}>
      <tr className={classes.tr}>
        <td className={classes.tr} style={{ width: '15%' }}>
          TEACHER NAME:
        </td>
        <td className={classes.tr}></td>
        <td className={classes.tr} style={{ width: '15%' }}>
          SIGNATURE:
        </td>
        <td className={classes.tr}></td>
        <td className={classes.tr} style={{ width: '15%' }}>
          STUDENT/PARENT SIGNATURE:
        </td>
        <td className={classes.tr}></td>
      </tr>
    </table>
  );
};
export default function AssesmentObservatioAndFeedbackReport(props) {
  const classes = useStyles();
  // const [tableData, setTableData] = useState([1, 2, 3, 4]);props.Data?.subject_marks

  return (
    <>
      <TableContainer style={{ margin: '1% 0%' }}>
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={6} style={{ backgroundColor: '#7abbbb' }}>
                OBSERVATION, FEEDBACK AND ADISE
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {[1, 2, 3, 4, 5].map(() => (
            <>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(251 222 198)' }}
                  >
                    ENGLISH Marks
                  </StyledTableCell>
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(251 222 198)' }}
                  >
                    98
                  </StyledTableCell>
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(251 222 198)' }}
                  >
                    Grade
                  </StyledTableCell>
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(251 222 198)' }}
                  >
                    A1
                  </StyledTableCell>
                  <StyledTableCell
                    align='right'
                    style={{ backgroundColor: 'rgb(251 222 198)' }}
                  >
                    Rank
                  </StyledTableCell>
                  <StyledTableCell align='right' rowSpan={2}>
                    2
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {[1, 2, 3, 4].map(() => (
                  <>
                    <TableRow>
                      <StyledTableCell scope='center'>data data</StyledTableCell>
                    </TableRow>
                  </>
                ))}

                {/* <TableRow>
                </TableRow> */}
              </TableBody>
            </>
          ))}
        </Table>
      </TableContainer>
      <FeedbackSignature />
    </>
  );
}
