import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FilterDetailsContext from '../store/filter-data';
// import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  table: {
    padding: '0px',
  },
}));

const TodayClass = withRouter(({ history, branchdetail }) => {
  const classes = useStyles();
  const ctx = useContext(FilterDetailsContext);

  const rows = branchdetail;
  // const history = useHistory();
  const dashboardtwoHandler = (row) => {
    history.push('./acad-calendar');
    //set branch id here row.branch_id
    ctx.branchIdVal = row.branch_id;
  };
  return (
    <>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Today's Classes<span>{rows.total_classes}</span>
          </Typography>

          <Grid
            item
            container
            direction='column'
            style={{ border: '2px solid whitesmoke' }}
          >
            <TableContainer component={Paper} style={{ fontSize: '12px' }}>
              <Table className={classes.table} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      Branch Details
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      T.Grades
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      T.Subject
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      Student Avg %
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      T.Present
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      T.Absent
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <>
                      <TableRow
                        onClick={() => dashboardtwoHandler(row)}
                        key={row?.name}
                        style={{
                          backgroundColor: '#F5F9FF',
                          marginBottom: '30px !important',
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          component='th'
                          scope='row'
                        >
                          {row?.branch_name}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row?.total_grades}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row?.total_subjects}
                        </TableCell>

                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          component='th'
                          scope='row'
                        >
                          {row?.avg_attendance_percentage}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row?.total_present}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row?.total_strength}
                        </TableCell>
                      </TableRow>
                      {/* //empty row for margin and gapping */}
                      <TableRow
                        key={row?.name}
                        style={{
                          backgroundColor: 'white',
                          marginBottom: '30px !important',
                        }}
                      >
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          component='th'
                          scope='row'
                        >
                          {''}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {''}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {''}
                        </TableCell>

                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          component='th'
                          scope='row'
                        >
                          {''}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {''}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {''}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
});

export default TodayClass;
