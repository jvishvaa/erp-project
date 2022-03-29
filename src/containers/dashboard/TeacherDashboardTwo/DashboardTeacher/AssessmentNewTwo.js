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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';

const top100Films = [{ title: 'The Shawshank Redemption', year: 1994 }];

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

function AssessmentNew() {
  const classes = useStyles();
  const history = useHistory();
  //   const [value, setValue] = React.useState(options[0]);
  //   const [inputValue, setInputValue] = React.useState('');
  const assessmentDetailsHandler = () => {
    history.push('./assessment-details');
  };

  return (
    <div>
      <Card
        style={{
          minWidth: '100%',
          border: '2px solid whitesmoke',
          marginBottom: '10px',
        }}
      >
        <CardContent>
          <Typography
            style={{
              marginBottom: '10px',
              fontWeight: '1000',
              fontSize: '12px',
            }}
          >
            Assessment
          </Typography>

          <Grid
            item
            container
            direction='column'
            style={{ border: '2px solid whitesmoke', paddingLeft: '5px' }}
          >
            {/* <Card>
              <CardContent> */}
            <Grid style={{ width: '200px' }}>
              <Autocomplete
                id='free-solo-demo'
                freeSolo
                options={top100Films.map((option) => option.title)}
                renderInput={(params) => (
                  <TextField
                    style={{ fontSize: '12px' }}
                    {...params}
                    label='All Grade and Sections'
                    margin='normal'
                    variant='filled'
                  />
                )}
              />
            </Grid>
            <Grid style={{ display: 'flex' }}>
              <Grid style={{ marginRight: '60px' }}>
                <Typography style={{ fontSize: '12px', marginBottom: '15px' }}>
                  Total Students:<span> 200</span>
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#E51A1A' }}>
                  Students Below Threshold<span> 15</span>
                </Typography>
              </Grid>
              <Grid
                style={{
                  marginTop: '5px',
                  position: 'relative',
                  top: '-31px',
                  left: '37px',
                }}
              >
                <CirclePercentage
                  height='80px'
                  width='80px'
                  percent='56'
                  pathcolor='#4DC41B'
                />
              </Grid>
            </Grid>
            {/* </CardContent>
            </Card> */}
          </Grid>
          <Typography
            onClick={assessmentDetailsHandler}
            style={{
              fontSize: '12px',
              fontWeight: '800',
              marginRight: '50px',
              position: 'relative',
              left: '364px',
              cursor: 'pointer',
              top: '8px',
            }}
          >
            {`View all >`}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentNew;
