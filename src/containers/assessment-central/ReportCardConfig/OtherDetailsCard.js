import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Box,
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useHistory } from 'react-router-dom';
import cuid from 'cuid';

function OtherDetailsCard() {
  const [summary, setSummary] = useState();
  const [weightAge, setWeightAge] = useState();
  const [logic, setLogic] = useState();
  const history = useHistory();

  const testselection = () => {
    console.log('treeclick')
    history.push('/assesment');
  }


  return (
    <>
      <Grid container spacing={2} style={{ margin: '0px' }}>
        <Grid item xs={12} sm={3} className={'filterPadding'}>
          <Button
            style={{ width: '100%' }}
            variant='contained'
            color='primary'
            title='Test Selection'
            onClick={testselection}
          >
            Test Selection
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} className={'filterPadding'}>
          <Button
            style={{ width: '100%' }}
            variant='contained'
            color='primary'
            title='Test Selection'
          >
            Summary
          </Button>
        </Grid>
        <Grid container spacing={2} style={{ margin: '0px' }}>
          <Grid item xs={12} sm={3} className={'filterPadding'}>
            <TextField
              style={{ width: '100%' }}
              id='subname'
              label='Weightage'
              variant='outlined'
              size='small'
              name='subname'
              type='number'
              autoComplete='off'
            //   onChange={(e) => {
            //     setPage(1);
            //     setSearchSubject(e.target.value);
            //   }}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={'filterPadding'}>
            <TextField
              style={{ width: '100%' }}
              id='subname'
              label='Logic'
              variant='outlined'
              size='small'
              name='subname'
              type='number'
              autoComplete='off'
            //   onChange={(e) => {
            //     setPage(1);
            //     setSearchSubject(e.target.value);
            //   }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default OtherDetailsCard;
