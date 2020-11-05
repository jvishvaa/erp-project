/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext, useState } from 'react';
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
import moment from 'moment';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import validationSchema from './schemas/user-details';
import { Label } from '@material-ui/icons';
import { useStyles } from './useStyles';
import ImageUpload from '../../components/image-upload';
import { createMuiTheme, ThemeProvider, useTheme } from '@material-ui/core/styles';

const UserDetailsForm = ({
  details,
  onSubmit,
  handleBack,
  toggleParentForm,
  toggleGuardianForm,
  showParentForm,
  showGuardianForm,
  isSubmitting,
}) => {
  const themeContext = useTheme();
  const formik = useFormik({
    initialValues: {
      first_name: details.first_name,
      last_name: details.last_name,
      gender: details.gender,
      profile: details.profile,
      contact: details.contact,
      email: details.email,
      date_of_birth: details.date_of_birth,
      address: details.address,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });
  const classes = useStyles();
  const theme = createMuiTheme({
    ...themeContext,
    flatButton: {
      primaryTextColor: '#ffffff',
    },
    overrides: {
      MuiButton: {
        // Name of the rule
        root: {
          // Some CSS
          color: '#ffffff',
        },
      },
    },
  });
  return (
    <Grid container spacing={4}>
      <Grid container item xs={12}>
        <Grid item md={4}>
          <ImageUpload
            value={formik.values.profile}
            onChange={(value) => {
              console.log(value instanceof File);
              formik.setFieldValue('profile', value);
            }}
          />
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
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.first_name ? formik.errors.first_name : ''}
          </FormHelperText>
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
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.last_name ? formik.errors.last_name : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid container item xs={12} spacing={8}>
        <Grid item md={4}>
          <FormControl component='fieldset' fullWidth>
            <FormLabel component='legend'>Gender</FormLabel>
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
            <FormHelperText style={{ color: 'red' }}>
              {formik.errors.gender ? formik.errors.gender : ''}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={theme}>
              <DatePicker
                value={formik.values.date_of_birth || null}
                defaultValue={formik.values.date_of_birth || null}
                onChange={(value) => {
                  console.log('date ', value);
                  console.log(moment(value).format('YYYY-MM-DD'));
                  formik.setFieldValue(
                    'date_of_birth',
                    moment(value).format('YYYY-MM-DD')
                  );
                }}
                inputVariant='outlined'
                fullWidth
                label='Date of birth'
                disabled={false}
                format='YYYY-MM-DD'
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.date_of_birth ? formik.errors.date_of_birth : ''}
          </FormHelperText>
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
            <FormHelperText style={{ color: 'red' }}>
              {formik.errors.contact ? formik.errors.contact : ''}
            </FormHelperText>
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
            <FormHelperText style={{ color: 'red' }}>
              {formik.errors.email ? formik.errors.email : ''}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item md={4}>
          <FormControl variant='outlined' fullWidth>
            <InputLabel htmlFor='component-outlined'>Address</InputLabel>
            <OutlinedInput
              id='address'
              name='address'
              onChange={formik.handleChange}
              value={formik.values.address}
              label='Address'
            />
            <FormHelperText style={{ color: 'red' }}>
              {formik.errors.address ? formik.errors.address : ''}
            </FormHelperText>
          </FormControl>
        </Grid>{' '}
        {/* <Grid item md={4}>
          <FormControl variant='outlined' fullWidth disabled>
            <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
            <OutlinedInput
              id='component-outlined'
              value=''
              onChange={() => {}}
              label='Address line 2'
            />
          </FormControl>
        </Grid> */}
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
                <Checkbox
                  checked={showParentForm}
                  onChange={toggleParentForm}
                  name='gilad'
                  color='primary'
                />
              }
              label='Parent'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGuardianForm}
                  onChange={toggleGuardianForm}
                  name='jason'
                  color='primary'
                />
              }
              label='Guardian'
            />
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid container item xs={12} style={{ marginTop: '20px' }}>
        <Grid item md='1'>
          <Button
            className={classes.formActionButton}
            variant='contained'
            color='primary'
            onClick={handleBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item md='1'>
          <Button
            className={classes.formActionButton}
            variant='contained'
            color='primary'
            onClick={() => {
              formik.handleSubmit();
            }}
            disabled={isSubmitting}
          >
            {showParentForm || showGuardianForm ? 'Next' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserDetailsForm;
