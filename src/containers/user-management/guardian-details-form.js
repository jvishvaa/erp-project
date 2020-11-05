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
import { useFormik } from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useStyles } from './useStyles';
import resolveValidationSchema from './schemas/guardian-details';
import ImageUpload from '../../components/image-upload';

const GuardianDetailsForm = ({
  details,
  onSubmit,
  handleBack,
  showParentForm,
  showGuardianForm,
  isSubmitting,
}) => {
  const classes = useStyles();
  const validationSchema = resolveValidationSchema(showParentForm, showGuardianForm);
  const formik = useFormik({
    initialValues: {
      father_first_name: details.father_first_name,
      father_middle_name: details.father_middle_name,
      father_last_name: details.father_last_name,
      mother_first_name: details.mother_first_name,
      mother_middle_name: details.mother_middle_name,
      mother_last_name: details.mother_last_name,
      father_email: details.father_email,
      mother_email: details.mother_email,
      father_mobile: details.father_mobile,
      mother_mobile: details.mother_mobile,
      mother_photo: details.mother_photo,
      father_photo: details.father_photo,
      address: details.address,
      guardian_first_name: details.guardian_first_name,
      guardian_middle_name: details.guardian_middle_name,
      guardian_last_name: details.guardian_last_name,
      guardian_email: details.guardian_email,
      guardian_mobile: details.guardian_mobile,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnBlur: false,
    validateOnChange: false,
  });
  return (
    <>
      {showParentForm && (
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
                    id='father_first_name'
                    name='father_first_name'
                    onChange={formik.handleChange}
                    value={formik.values.father_first_name}
                    label='First name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.father_first_name
                      ? formik.errors.father_first_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
                  <OutlinedInput
                    id='father_middle_name'
                    name='father_middle_name'
                    onChange={formik.handleChange}
                    value={formik.values.father_middle_name}
                    label='Middle name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.father_middle_name
                      ? formik.errors.father_middle_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
                  <OutlinedInput
                    id='father_last_name'
                    name='father_last_name'
                    onChange={formik.handleChange}
                    value={formik.values.father_last_name}
                    label='Last name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.father_last_name ? formik.errors.father_last_name : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Email ID</InputLabel>
                  <OutlinedInput
                    id='father_email'
                    name='father_email'
                    onChange={formik.handleChange}
                    value={formik.values.father_email}
                    label='Email ID'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.father_email ? formik.errors.father_email : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
                  <OutlinedInput
                    id='father_mobile'
                    name='father_mobile'
                    onChange={formik.handleChange}
                    value={formik.values.father_mobile}
                    label='Mobile no.'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.father_mobile ? formik.errors.father_mobile : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>
                    Alternate mobile no.
                  </InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl>
              </Grid> */}
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Address line 1.</InputLabel>
                  <OutlinedInput
                    id='address'
                    name='address'
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    label='Address line 1.'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.address ? formik.errors.address : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl> 
                    </Grid> */}
              <Grid item md={4}>
                <ImageUpload
                  value={formik.values.father_photo}
                  onChange={(value) => {
                    formik.setFieldValue('father_photo', value);
                  }}
                />
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
                    id='mother_first_name'
                    name='mother_first_name'
                    onChange={formik.handleChange}
                    value={formik.values.mother_first_name}
                    label='First name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.mother_first_name
                      ? formik.errors.mother_first_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
                  <OutlinedInput
                    id='mother_middle_name'
                    name='mother_middle_name'
                    onChange={formik.handleChange}
                    value={formik.values.mother_middle_name}
                    label='Middle name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.mother_middle_name
                      ? formik.errors.mother_middle_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
                  <OutlinedInput
                    id='mother_last_name'
                    name='mother_last_name'
                    onChange={formik.handleChange}
                    value={formik.values.mother_last_name}
                    label='Last name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.mother_last_name ? formik.errors.mother_last_name : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Email ID</InputLabel>
                  <OutlinedInput
                    id='mother_email'
                    name='mother_email'
                    onChange={formik.handleChange}
                    value={formik.values.mother_email}
                    label='Email ID'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.mother_email ? formik.errors.mother_email : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
                  <OutlinedInput
                    id='mother_mobile'
                    name='mother_mobile'
                    onChange={formik.handleChange}
                    value={formik.values.mother_mobile}
                    label='Mobile no.'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.mother_mobile ? formik.errors.mother_mobile : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>
                    Alternate mobile no.
                  </InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl>
              </Grid> */}
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
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
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl>
              </Grid> */}

              <Grid item md={4}>
                <ImageUpload
                  value={formik.values.mother_photo}
                  onChange={(value) => {
                    formik.setFieldValue('mother_photo', value);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </>
      )}

      {showGuardianForm && (
        <>
          <Divider className={classes.divider} />
          <div className='details-container'>
            <Typography variant='h5' gutterBottom color='primary'>
              Guardian's Details
            </Typography>
            <Grid container spacing={4}>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>First name</InputLabel>
                  <OutlinedInput
                    id='guardian_first_name'
                    name='guardian_first_name'
                    onChange={formik.handleChange}
                    value={formik.values.guardian_first_name}
                    label='First name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.guardian_first_name
                      ? formik.errors.guardian_first_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Middle name</InputLabel>
                  <OutlinedInput
                    id='guardian_middle_name'
                    name='guardian_middle_name'
                    onChange={formik.handleChange}
                    value={formik.values.guardian_middle_name}
                    label='Middle name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.guardian_middle_name
                      ? formik.errors.guardian_middle_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Last name</InputLabel>
                  <OutlinedInput
                    id='guardian_last_name'
                    name='guardian_last_name'
                    onChange={formik.handleChange}
                    value={formik.values.guardian_last_name}
                    label='Last name'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.guardian_last_name
                      ? formik.errors.guardian_last_name
                      : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Email ID</InputLabel>
                  <OutlinedInput
                    id='guardian_email'
                    name='guardian_email'
                    onChange={formik.handleChange}
                    value={formik.values.guardian_email}
                    label='Email ID'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.guardian_email ? formik.errors.guardian_email : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <FormControl variant='outlined' fullWidth>
                  <InputLabel htmlFor='component-outlined'>Mobile no.</InputLabel>
                  <OutlinedInput
                    id='guardian_mobile'
                    name='guardian_mobile'
                    onChange={formik.handleChange}
                    value={formik.values.guardian_mobile}
                    label='Mobile no.'
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {formik.errors.guardian_mobile ? formik.errors.guardian_mobile : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>
                    Alternate mobile no.
                  </InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl>
              </Grid> */}
              {/* <Grid item md={4}>
                <FormControl variant='outlined' fullWidth disabled>
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
                <FormControl variant='outlined' fullWidth disabled>
                  <InputLabel htmlFor='component-outlined'>Address line 2</InputLabel>
                  <OutlinedInput
                    id='component-outlined'
                    value=''
                    onChange={() => {}}
                    label='Name'
                  />
                </FormControl>
              </Grid> */}

              {/* <Grid item md={4}>
                <Button startIcon={<AttachFileIcon />}>Attach Image</Button>
              </Grid> */}
            </Grid>
          </div>
        </>
      )}

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
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default GuardianDetailsForm;
