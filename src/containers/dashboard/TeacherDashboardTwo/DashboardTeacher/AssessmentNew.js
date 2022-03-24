import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';

function createData(name, a, b) {
  return { name, a, b };
}
const rows = [createData('Branch1', 'a', ' b'), createData('Branch2', 'a', 'b')];

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

function AssessmentNew(props) {
  const { gradesectionDetail } = props;
  console.log('cccc', gradesectionDetail);

  const classes = useStyles();
  const gradeSection = [
    { gradeSection: '1' },
    { gradeSection: '2' },
    { gradeSection: '3' },
    { gradeSection: '4' },
  ];

  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Assessment
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  style={{ transform: 'scaleY(0.8)' }}
                  id='combo-box-demo'
                  options={gradesectionDetail}
                  className='grade-section'
                  getOptionLabel={(option) => option?.section_name}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      {...params}
                      required
                      label='All Grades and Sections'
                      variant='outlined'
                      style={{ width: '250px', height: '54px' }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Typography>
          {/* <Card style={{ minWidth: '100%', border: '2px solid whitesmoke' }}>
            <CardContent> */}
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
                      Total Students
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                        color: '#E51A1A',
                      }}
                      align='right'
                    >
                      Students below Threshold
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <>
                      <TableRow
                        key={row.section_name}
                        style={{
                          backgroundColor: '#F6F7F8',
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
                          {row.section_name}
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
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* </CardContent>
          </Card> */}
          <Typography
            // onClick={viewAttendanceHandler}
            style={{
              position: 'relative',
              left: '360px',
              fontSize: '12px',
              fontWeight: '800',
              top: '14px',
              cursor: 'pointer',
            }}
          >
            view all
            <ArrowForwardIosIcon
              size='small'
              style={{
                height: '12px',
                width: '12 px',
                color: 'black',
                marginLeft: '-5px',
                marginTop: '5px',
              }}
            />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentNew;
