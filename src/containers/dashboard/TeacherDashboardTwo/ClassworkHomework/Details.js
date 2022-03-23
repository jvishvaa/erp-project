import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Submitted from './Submitted';
import Pending from './Pending';
import Remarks from './Remarks';

const volume = [{ title: 'The Shawshank Redemption', year: 1994 }];
const useStyles = makeStyles((theme) => ({
  pending: {
    backgroundColor: 'white',
    border: '0.5px solid whitesmoke',
    cursor: 'pointer',
    width: '150px',
    textAlign: 'center',
    color: '#4093D4',
    '&:active': {
      backgroundColor: '#4093D4 !important',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#4093D4 !important',
      color: 'white',
    },
  },
  pendingColor: {
    backgroundColor: 'blue',
    border: '0.5px solid whitesmoke',
    cursor: 'pointer',
    width: '150px',
    textAlign: 'center',
    color: '#4093D4',
    '&:active': {
      backgroundColor: '#4093D4 !important',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#4093D4 !important',
      color: 'white',
    },
  },
}));

function Details({ section, subject, date }) {
  const classes = useStyles();
  const [status, setStatus] = useState({
    pending: false,
    submitted: true,
    remarks: false,
  });
  const pendingClick = () => {
    setStatus({ pending: true, submitted: false, remarks: false });
  };
  const submittedClick = () => {
    setStatus({ pending: false, submitted: true, remarks: false });
  };
  const remarksClick = () => {
    setStatus({ pending: false, submitted: false, remarks: true });
  };

  return (
    <>
      <Grid
        container
        style={{
          marginLeft: '22px',
          paddingRight: '46px',
        }}
        alignItems='center'
      >
        <Grid
          container
          style={{
            backgroundColor: '#EBF2FE',
            paddingRight: '10px',
          }}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item style={{ paddingLeft: 15 }}>
            <TextField
              id='input-with-icon-textfield'
              placeholder='Search'
              variant='outlined'
              margin='dense'
              size='small'
              style={{
                width: 250,
                backgroundColor: 'white',
                borderRadius: 5,
                transform: 'scaleY(0.8)',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' style={{ pointerEvents: 'none' }}>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Grid container justifyContent='center' alignItems='center'>
              <Grid item>
                <Typography style={{ fontSize: '12px', paddingRight: '15px' }}>
                  Actions:{' '}
                </Typography>
              </Grid>
              <Grid item className={classes.pending} onClick={pendingClick}>
                <span style={{ fontSize: '12px' }}>Pending</span>
              </Grid>
              <Grid item className={classes.pending} onClick={submittedClick}>
                <span style={{ fontSize: '12px' }}>Submitted</span>
              </Grid>
              <Grid item className={classes.pending} onClick={remarksClick}>
                <span style={{ fontSize: '12px' }}> Remark and Score</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className='student Details' style={{ width: '100%' }}>
          {status.submitted && !status.pending && !status.remarks && (
            <Submitted section={section} subject={subject} date={date} />
          )}
          {status.pending && !status.submitted && !status.remarks && (
            <Pending section={section} subject={subject} date={date} />
          )}
          {status.remarks && !status.submitted && !status.pending && <Remarks />}
        </Grid>
      </Grid>
    </>
  );
}

export default Details;
