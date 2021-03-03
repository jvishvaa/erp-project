import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import { FormHelperText, withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from './useStyles';
import validationSchema from './schemas/school-details';
import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchAcademicYears as getAcademicYears,
  fetchSubjects as getSubjects,
} from '../../redux/actions';
import { useHistory } from 'react-router-dom';

const BackButton = withStyles({
  root: {
    color: 'rgb(140, 140, 140)',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const SchoolDetailsForm = ({ details, onSubmit }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const fetchAcademicYears = () => {
    getAcademicYears().then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        session_year: obj.session_year,
      }));
      setAcademicYears(transformedData);
    });
  };

  const fetchBranches = (acadId) => {
    if (acadId) {
      fetchBranchesForCreateUser(acadId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
        }));
        setBranches(transformedData);
      });
    }
  };

  const fetchSubjects = (branch, grade, section, acadId) => {
    if (
      branch &&
      branch.length > 0 &&
      grade &&
      grade.length > 0 &&
      section &&
      section.length > 0
    ) {
      getSubjects(branch, grade, section).then((data) => {
        const transformedData = data.map((obj) => ({
          id: obj.subject__id,
          subject_name: obj.subject__subject_name,
        }));
        setSubjects(transformedData);
        const filteredSelectedSubjects = formik.values.subjects.filter(
          (sub) => transformedData.findIndex((data) => data.id === sub.id) > -1
        );
        formik.setFieldValue('subjects', filteredSelectedSubjects);
      });
    } else {
      setSubjects([]);
    }
  };

  const handleChangeBranch = (values, acadId) => {
    setGrades([]);
    setSections([]);
    setSubjects([]);
    if (values?.length > 0) {
      fetchGrades(acadId, values).then((data) => {
        const transformedData = data
          ? data.map((grade) => ({
              item_id: grade.id,
              id: grade.grade_id,
              grade_name: grade.grade__grade_name,
            }))
          : [];
        setGrades(transformedData);
      });
    }
  };

  const handleChangeGrade = (values, acadId, branch) => {
    setSections([]);
    setSubjects([]);
    if (values?.length > 0) {
      fetchSections(acadId, branch, values).then((data) => {
        const transformedData = data
          ? data.map((section) => ({
              item_id: section.id,
              id: section.section_id,
              section_name: `${section.section__section_name}`,
            }))
          : [];
        // const filteredSelectedSections = formik.values.section.filter(
        //   (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        // );
        setSections(transformedData);
        // formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    }
  };

  const handleChangeSection = (values, acadId, branch, grade) => {
    setSubjects([]);
    formik.setFieldValue('subjects', []);
    formik.setFieldValue('section', []);
    if (values?.length > 0) {
      formik.setFieldValue('section', values);
      getSubjects(acadId, branch, grade, values).then((data) => {
        const transformedData = data.map((obj) => ({
          id: obj.subject__id,
          subject_name: obj.subject__subject_name,
        }));
        setSubjects(transformedData);
        // const filteredSelectedSections = formik.values.section.filter(
        //   (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        // );
        // formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    }
  };

  // const handleSection = (e, value) => {
  //   formik.setFieldValue('section', value);
  //   if (!value.length) {
  //     formik.setFieldValue('subjects', []);
  //   }
  //   const {
  //     values: { branch = {}, grade = [] },
  //   } = formik;
  //   fetchSubjects([branch], grade, value);
  // };

  useEffect(() => {
    fetchAcademicYears();
    // fetchBranches();
    // console.log('branches ', details.branch, details.grade);
    if (details.branch) {
      handleChangeBranch([details.branch]);
      if (details.grade && details.grade.length > 0) {
        handleChangeGrade(details.grade, [details.branch]);
      }
    }
  }, []);

  const classes = useStyles();

  return (
    <Grid container spacing={4} className='school-details-form-container'>
      {/* <Grid container item xs={12}> */}
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='academic_year'
            name='academic_year'
            onChange={(e, value) => {
              formik.setFieldValue('academic_year', value);
              formik.setFieldValue('branch', []);
              formik.setFieldValue('grade', []);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              setBranches([]);
              fetchBranches(value?.id);
            }}
            value={formik.values.academic_year || []}
            options={academicYears}
            filterSelectedOptions
            getOptionLabel={(option) => option?.session_year || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
              />
            )}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.academic_year ? formik.errors.academic_year : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      {/* </Grid> */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='branch'
            name='branch'
            onChange={(e, value) => {
              formik.setFieldValue('branch', value);
              formik.setFieldValue('grade', []);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeBranch(value, formik.values.academic_year?.id);
              //   handleChangeBranch(value ? [value] : null);
            }}
            multiple
            value={formik.values.branch}
            options={branches}
            filterSelectedOptions
            getOptionLabel={(option) => option.branch_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
              />
            )}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.branch ? formik.errors.branch : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='grade'
            name='grade'
            onChange={(e, value) => {
              formik.setFieldValue('grade', value);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeGrade(
                value,
                formik.values.academic_year?.id,
                formik.values.branch
              );
            }}
            multiple
            value={formik.values.grade}
            options={grades}
            filterSelectedOptions
            getOptionLabel={(option) => option.grade_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
              />
            )}
            getOptionSelected={(option, value) => option.item_id == value.item_id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.grade ? formik.errors.grade : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='section'
            name='section'
            onChange={(e, value) => {
              handleChangeSection(
                value,
                formik.values.academic_year?.id,
                formik.values.branch,
                formik.values.grade
              );
            }}
            value={formik.values.section}
            options={sections}
            multiple
            filterSelectedOptions
            getOptionLabel={(option) => option.section_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
            // getOptionSelected={(option, value) => option.item_id == value.item_id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.section ? formik.errors.section : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl
          color='secondary'
          fullWidth
          className={classes.margin}
          variant='outlined'
        >
          <Autocomplete
            id='subjects'
            name='subjects'
            onChange={(e, value) => {
              formik.setFieldValue('subjects', value);
            }}
            value={formik.values.subjects}
            // limitTags={2}
            multiple
            options={subjects}
            filterSelectedOptions
            getOptionLabel={(option) => option.subject_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subjects'
                placeholder='Subjects'
              />
            )}
            // getOptionSelected={(option, value) => option.item_id == value.item_id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.subjects ? formik.errors.subjects : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <Box className={classes.formActionButtonContainer}>
          <BackButton
            className={classes.formActionButton}
            variant='contained'
            color='primary'
            onClick={() => {
              history.push('/user-management/view-users');
            }}
          >
            Back
          </BackButton>
          <Button
            className={classes.formActionButton}
            variant='contained'
            color='primary'
            onClick={() => {
              formik.handleSubmit();
            }}
            style={{ float: 'right' }}
          >
            Next
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SchoolDetailsForm;
