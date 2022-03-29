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
import CirclePercentage from './CirclePercentage';
import TextField from '@material-ui/core/TextField';
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

function CurriculumCompletionNewTwo() {
  const classes = useStyles();
  const history = useHistory();

  // const CurriculumCompletionDetailsHandler = () => {
  //   history.push('./curriculum_Completion_Details');
  // };

  // const CurriculumCompletionDetailsHandler = () => {
  //   history.push('./curriculum_Completion_Details');
  // };

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

          <Grid
            item
            container
            direction='column'
            style={{ border: '2px solid whitesmoke' }}
          >
            {/* <Card>
              <CardContent> */}

            <Grid style={{ display: 'flex', paddingLeft: '15px' }}>
              <Grid style={{ marginTop: '5px', marginRight: '60px' }}>
                <Typography
                  style={{
                    fontSize: '12px',
                    marginRight: '20px',
                    position: 'relative',
                    left: '20px',
                    fontWeight: '700',
                  }}
                >
                  Overall
                </Typography>
                <CirclePercentage
                  height='80px'
                  width='80px'
                  percent='86'
                  pathcolor='#4DC41B'
                />
                <Typography style={{ fontSize: '12px', fontWeight: '700' }}>
                  104 LPs <span> 96LPs</span>
                </Typography>
              </Grid>
              <Grid style={{ margin: '20px' }}>
                <Typography style={{ fontSize: '12px', color: '#E51A1A' }}>
                  Lowest
                </Typography>
                <Typography
                  style={{
                    fontSize: '12px',
                    marginBottom: '15px',
                    border: '1px solid #E0DFDF',
                    borderRadius: '5px',
                    padding: '3px',
                  }}
                >
                  <span style={{ color: '#E51A1A', fontWeight: 700 }}>30%</span>
                  <span> Grade 1A (Math)</span>
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#4DC41B' }}>
                  Highest
                </Typography>
                <Typography
                  style={{
                    fontSize: '12px',
                    color: 'black',
                    border: '1px solid #E0DFDF',
                    borderRadius: '5px',
                    padding: '3px',
                  }}
                >
                  <span style={{ color: '#4DC41B', fontWeight: 700 }}>70%</span>
                  <span> Grade 3A (Math)</span>
                </Typography>
              </Grid>
            </Grid>
            {/* </CardContent>
            </Card> */}
          </Grid>
          <Typography
            // onClick={CurriculumCompletionDetailsHandler}
            style={{
              fontSize: '12px',
              fontWeight: '800',
              marginRight: '50px',
              position: 'relative',
              left: '344px',
              cursor: 'pointer',
              top: '8px',
            }}
          >
            {`View details >`}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default CurriculumCompletionNewTwo;
