import './TodayClass.css';
import React, { useEffect, useState } from 'react';
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
// import StudentRightDashboard from '../StudentDashboard/StudentRightDashboard/StudentRightDashboard';
import { useHistory } from 'react-router-dom';

function createData(name, a, b, c, d, e) {
  return { name, a, b, c, d, e };
}
const rows = [
  createData('Branch1', 'a', ' b', 'c', 'd', 'completed'),
  createData('Branch2', 'a', 'b', 'c', 'd', 'ongoing'),
];

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

function TodayClassTwo() {
  const classes = useStyles();
  return (
    <>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Today's Classes<span>(6)</span>
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
                      Periods
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      Grades
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      Subject
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
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                      }}
                      align='right'
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <>
                      <TableRow
                        key={row.name}
                        style={{
                          backgroundColor: '#F5F9FF',
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
                          {row.name}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row.a}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row.b}
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
                          {row.c}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row.d}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row.e}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row.e}
                        </TableCell>
                      </TableRow>
                      {/* //empty row for margin and gapping */}
                      <TableRow
                        key={row.name}
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
}

export default TodayClassTwo;
