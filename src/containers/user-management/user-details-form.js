/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { useFormik } from 'formik';
// import { FormHelperText } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
// import validationSchema from './schemas/user-details';

const UserDetailsForm = ({ details, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      first_name: details.first_name,
      middle_name: details.middle_name,
      last_name: details.last_name,
      gender: details.gender,
      profile: details.profile,
      contact: details.contact,
      email: details.email,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      onSubmit(values);
    },
  });
  return (
    <Grid container spacing={4}>
      <Grid container item xs={12}>
        <Grid item md={4}>
          <Button startIcon={<AttachFileIcon />}>Attach Image</Button>
        </Grid>
      </Grid>
      <Grid item md={4}>
        <FormControl variant='outlined' fullWidth>
          <InputLabel htmlFor='component-outlined'>First name</InputLabel>
          <OutlinedInput
            id='first_name'
            name='first_name'
            onChange={formik.handleChange}
            value={formik.values.first_name}
            label='First name'
            autoFocus
          />
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <FormControl variant='outlined' fullWidth>
          <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
          <OutlinedInput
            id='middle_name'
            name='middle_name'
            onChange={formik.handleChange}
            value={formik.values.middle_name}
            label='Middle name'
          />
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <FormControl variant='outlined' fullWidth>
          <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
          <OutlinedInput
            id='last_name'
            name='last_name'
            onChange={formik.handleChange}
            value={formik.values.last_name}
            label='Last name'
          />
        </FormControl>
      </Grid>
      <Grid container item xs={12} spacing={8}>
        <Grid item md={4}>
          <FormControl component='fieldset' fullWidth>
            <FormLabel component='legend'>Gender</FormLabel>
            {/* <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox checked={formik.values.gender == 1} onChange={() => {}} name='gilad' color='primary' />
                }
                label='Male'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.gender == 2}
                    onChange={() => {}}
                    name='jason'
                    color='primary'
                  />
                }
                label='Female'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={false}
                    onChange={() => {}}
                    name='antoine'
                    color='primary'
                  />
                }
                label='Other'
              />
            </FormGroup> */}
            <RadioGroup
              id='gender'
              name='gender'
              value={formik.values.gender}
              onChange={formik.handleChange}
              row
            >
              <FormControlLabel
                value='1'
                control={<Radio color='primary' />}
                label='Male'
              />
              <FormControlLabel
                value='2'
                control={<Radio color='primary' />}
                label='Female'
              />
              <FormControlLabel
                value='3'
                control={<Radio color='primary' />}
                label='Other'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={new Date()}
              onChange={() => {}}
              inputVariant='outlined'
              fullWidth
              label='Date of birth'
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item md={4}>
          <FormControl variant='outlined' fullWidth>
            <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
            <OutlinedInput
              id='contact'
              name='contact'
              onChange={formik.handleChange}
              value={formik.values.contact}
              label='Mobile no.'
            />
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl variant='outlined' fullWidth>
            <InputLabel htmlFor='component-outlined'>Email</InputLabel>
            <OutlinedInput
              id='email'
              name='email'
              onChange={formik.handleChange}
              value={formik.values.email}
              label='Email'
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item md={4}>
          <FormControl variant='outlined' fullWidth disabled>
            <InputLabel htmlFor='component-outlined'>Address line 1</InputLabel>
            <OutlinedInput
              id='component-outlined'
              value=''
              onChange={() => {}}
              label='Address line 1'
              disabled
            />
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl variant='outlined' fullWidth disabled>
            <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
            <OutlinedInput
              id='component-outlined'
              value=''
              onChange={() => {}}
              label='Address line 2'
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item md={4}>
        <FormControl component='fieldset' fullWidth>
          <FormLabel component='legend'>Parent/Guardian</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox checked onChange={() => {}} name='gilad' color='primary' />
              }
              label='Parent'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={false}
                  onChange={() => {}}
                  name='jason'
                  color='primary'
                />
              }
              label='Guardian'
            />
          </FormGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default UserDetailsForm;
