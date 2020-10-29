/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { useStyles } from './useStyles';

const GuardianDetailsForm = () => {
  const classes = useStyles();
  return (
    <>
      <div className='details-container'>
        <Typography variant='h5' gutterBottom color='primary'>
          Father's Details
        </Typography>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth color='secondary'>
              <InputLabel htmlFor='component-outlined'>First name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Email ID</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Alternate mobile no.</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Address line 1.</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <Button startIcon={<AttachFileIcon />}>Attach Image</Button>
          </Grid>
        </Grid>
      </div>
      <Divider className={classes.divider} />
      <div className='details-container'>
        <Typography variant='h5' gutterBottom color='primary'>
          Mothers's Details
        </Typography>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>First name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Email ID</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Alternate mobile no.</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Address line 1</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
              <OutlinedInput
                id='component-outlined'
                value=''
                onChange={() => {}}
                label='Name'
              />
            </FormControl>
          </Grid>

          <Grid item md={4}>
            <Button startIcon={<AttachFileIcon />}>Attach Image</Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default GuardianDetailsForm;
