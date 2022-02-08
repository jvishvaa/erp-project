import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function createData(question, optionA, optionB, optionC, optionD) {
  return { question, optionA, optionB, optionC, optionD };
}

const rows = [
  createData('What is the value of Pi?', 2.22, 3.14, 4.22, 2.14),
  createData(
    'What is the Capital of India',
    'Delhi',
    'Karnataka',
    'Rajasthan',
    'Maharashtra'
  ),
  createData(
    'What is the National Animal of India',
    'Deer',
    'Elephant',
    'Peacock',
    'Tiger'
  ),
  createData(
    'What is the Capital of Maharasthra',
    'Mumbai',
    'Pune',
    'Bangalore',
    'Kolkata'
  ),
];

function SubmitClassWork() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedF: false,
    checkedG: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <>
      <div style={{ fontWeight: 'bold', marginLeft: '80px', marginTop: '10px' }}>
        <ArrowBackIosIcon fontSize='17px' /> Class Work
      </div>
      <div
        style={{
          fontWeight: 'bold',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '65px',
          marginTop: '5px',
          marginRight: '65px',
          paddingLeft: '20px',
          background: '#DCDCDC',
        }}
      >
        <p>Quiz</p>
        <p style={{ fontWeight: 'bold', position: 'relative', left: '990px' }}>
          Time Left
        </p>
        <p
          style={{
            fontWeight: 'bold',
            position: 'relative',
            left: '1000px',
            color: 'red',
          }}
        >
          09:24
        </p>
      </div>

      <div>
        <div className={classes.root}>
          {rows.map((row, i) => (
            <Grid
              container xs={12}
              spacing={3}
              style={{ padding: '20px 80px', marginTop: '-35px'}}
            >
              <Grid container xs ={12} item >
                <Grid item xs={12} sm={3}>
                  <div>
                    <Typography style={{ fontSize: '15px' }}>
                      Q{i + 1}. {row.question}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                style={{
                  width: '50%',
                  paddingLeft: '50px',
                  fontSize: '15px',
                  marginTop: '-30px',
                }}
              >
                <Grid container item>
                  <Grid item xs={3} sm={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.checkedA}
                          onChange={handleChange}
                          name='checkedA'
                          color='primary'
                        />
                      }
                      label={row.optionA}
                    />
                  </Grid>
                  <Grid item xs={9} sm={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.checkedB}
                          onChange={handleChange}
                          name='checkedB'
                          color='primary'
                        />
                      }
                      label={row.optionB}
                    />
                  </Grid>
                </Grid>
                <Grid container item style={{ marginTop: '-22px' }}>
                  <Grid item xs={3} sm={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.checkedC}
                          onChange={handleChange}
                          name='checkedC'
                          color='primary'
                        />
                      }
                      label={row.optionC}
                    />
                  </Grid>
                  <Grid item xs={9} sm={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.checkedD}
                          onChange={handleChange}
                          name='checkedD'
                          color='primary'
                        />
                      }
                      label={row.optionD}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </div>
      </div>
      <Grid
        item
        xs={12}
        sm={12}
        style={{     
          bottom: '20px',
          width: '90%',
          justifyContent: 'center',
        }}
      >
        <div
          className={classes.paper}
          style={{ height: '70px', display: 'flex', justifyContent: 'end' }}
        >
          <Button variant='contained' color='secondary'>
            Submit ClassWork
          </Button>
        </div>
      </Grid>
    </>
  );
}
export default SubmitClassWork;
