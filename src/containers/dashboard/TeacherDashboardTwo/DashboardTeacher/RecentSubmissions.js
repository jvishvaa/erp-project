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
import TextField from '@material-ui/core/TextField';
import CirclePercentage from './CirclePercentage';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useHistory } from 'react-router-dom';

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

function RecentSubmissions() {
  const classes = useStyles();
  const history = useHistory();

  const HomeworkHandler = () => {
    history.push('./slide3');
  };
  const ClassworkHandler = () => {
    history.push('./slide3');
  };
  const homeworkAndClassworkHandler = () => {
    history.push('./homework_Classwork');
  };
  const homeworkAndClassworkHandlerTwo = () => {
    history.push('./homework_Classwork_two');
  };
  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Recent Submissions
          </Typography>

          <Grid item container spacing={2}>
            <Grid
              item
              container
              spacing={2}
              display='flex'
              style={{ marginBottom: '10px' }}
            >
              <Grid
                item
                container
                xs={6}
                spacing={0}
                style={{
                  border: '1px solid #D7E0E7',
                  borderRadius: '5px',
                }}
              >
                <Typography
                  onClick={HomeworkHandler}
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    marginBottom: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Home Work
                </Typography>
                <Grid item container display='flex'>
                  <Grid>
                    <CirclePercentage height='60px' width='60px' percent='86' />
                  </Grid>
                  <Grid style={{ marginLeft: '30px' }}>
                    <Typography style={{ color: '#4DC41B', fontSize: '12px' }}>
                      Submitted: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Typography style={{ color: '#F2A127', fontSize: '12px' }}>
                      Pending: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Typography style={{ color: '#3A90E6', fontSize: '12px' }}>
                      Evaluated: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Grid
                      style={{
                        marginLeft: '70px',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: '100',
                      }}
                    >
                      <ArrowRightAltIcon onClick={homeworkAndClassworkHandlerTwo} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                spacing={0}
                style={{ border: '1px solid #D7E0E7', borderRadius: '5px' }}
              >
                <Typography
                  onClick={ClassworkHandler}
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    marginBottom: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Class Work
                </Typography>
                <Grid item container display='flex'>
                  <Grid>
                    <CirclePercentage height='60px' width='60px' percent='86' />
                  </Grid>
                  <Grid style={{ marginLeft: '30px' }}>
                    <Typography style={{ color: '#4DC41B', fontSize: '12px' }}>
                      Submitted: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Typography style={{ color: '#F2A127', fontSize: '12px' }}>
                      Pending: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Typography style={{ color: '#3A90E6', fontSize: '12px' }}>
                      Evaluated: <span style={{ color: 'black' }}>250</span>
                    </Typography>
                    <Grid style={{ marginLeft: '70px', cursor: 'pointer' }}>
                      <ArrowRightAltIcon onClick={homeworkAndClassworkHandlerTwo} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={12}
              spacing={0}
              style={{
                border: '1px solid #D7E0E7',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <Typography
                style={{ fontSize: '12px', fontWeight: '800' }}
                onClick={homeworkAndClassworkHandler}
              >
                View All Home work and Class work
                <span
                  style={{
                    position: 'relative',
                    left: '195px',
                    top: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowForwardIosIcon fontSize='small' />
                </span>
              </Typography>
            </Grid>{' '}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecentSubmissions;
