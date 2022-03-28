import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// function createData(name, a, b, c) {
//   return { name, a, b, c };
// }
// const rows = [
//   createData('Branch1', '200', ' 200', '210'),
//   createData('Branch2', '200', '200', '200'),
// ];

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

function CurriculumCompletionNew({ curriculumDetail }) {
  const history = useHistory();
  const curriculumDetailsHandler = (branchId, acadId) => {
    history.push({
      pathname: `./teacherdashboards/curriculum`,
      state: {
        branchIdMain: branchId,
        acadIdMain: acadId,
      },
    });
    // const curriculumDetailsHandler = (id) => {
    //   history.push(`/teacherdashboards/curriculum/${id}`);
  };

  // const rows = curriculumDetail;
  const classes = useStyles();
  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Curriculum Completion
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
                      Overall
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
                      Lowest
                    </TableCell>
                    <TableCell
                      style={{
                        lineHeight: '0.7rem',
                        fontSize: '12px',
                        padding: '7px',
                        color: '#4DC41B',
                      }}
                      align='right'
                    >
                      Highest
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {curriculumDetail?.map((row) => (
                    <>
                      <TableRow
                        onClick={() =>
                          curriculumDetailsHandler(row?.branch_id, row?.acad_session_id)
                        }
                        key={row?.branch_name}
                        style={{
                          backgroundColor: '#F6F7F8',
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
                          {row.branch_name}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          {row?.overall_branch_completion_percentage}
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          <Grid
                            style={{ fontSize: '9px', position: 'relative', top: '-4px' }}
                          >
                            {row?.min_completion_grade}({row?.min_completion_subject})
                          </Grid>
                          <Grid style={{ color: '#E51A1A', fontWeight: '1000' }}>
                            {row?.min_completion_subject_percentage}%
                          </Grid>
                        </TableCell>
                        <TableCell
                          style={{
                            lineHeight: '0.7rem',
                            fontSize: '12px',
                            padding: '7px',
                          }}
                          align='right'
                        >
                          <Grid
                            style={{ fontSize: '9px', position: 'relative', top: '-4px' }}
                          >
                            {row?.max_completion_grade}({row?.max_completion_subject})
                          </Grid>
                          <Grid style={{ color: '#4DC41B', fontWeight: '1000' }}>
                            {row?.max_completion_subject_percentage}%
                          </Grid>
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
            style={{
              position: 'relative',
              left: '320px',
              fontSize: '12px',
              fontWeight: '800',
              top: '14px',
              cursor: 'pointer',
            }}
          >
            {/* <ArrowForwardIosIcon
              size='small'
              style={{
                height: '12px',
                width: '12 px',
                color: 'black',
                marginLeft: '-5px',
                marginTop: '5px',
              }}
            /> */}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default CurriculumCompletionNew;
