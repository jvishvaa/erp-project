import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import { FormHelperText } from '@material-ui/core';

import { useStyles } from './useStyles';
import validationSchema from './schemas/school-details';
import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchAcademicYears as getAcademicYears,
  fetchSubjects as getSubjects,
} from '../../redux/actions';

const SchoolDetailsForm = ({ details, onSubmit }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const fetchAcademicYears = () => {
    getAcademicYears().then((data) => {
      const transformedData = data.map((obj) => ({
        id: obj.id,
        session_year: obj.session_year,
      }));
      setAcademicYears(transformedData);
    });
  };

  const fetchBranches = () => {
    fetchBranchesForCreateUser().then((data) => {
      const transformedData = data.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranches(transformedData);
    });
  };

  const fetchSubjects = () => {
    getSubjects().then((data) => {
      const transformedData = data.map((obj) => ({
        id: obj.id,
        subject_name: obj.subject_name,
      }));
      setSubjects(transformedData);
    });
  };

  const handleChangeBranch = (values) => {
    setGrades([]);
    setSections([]);
    fetchGrades(values).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const handleChangeGrade = (values, branch) => {
    setSections([]);
    fetchSections(branch, values).then((data) => {
      const transformedData = data
        ? data.map((section) => ({
            id: section.section_id,
            section_name: `${section.grade__grade_name}__${section.section__section_name}`,
          }))
        : [];
      setSections(transformedData);
    });
  };

  useEffect(() => {
    fetchAcademicYears();
    fetchBranches();
    fetchSubjects();
  }, []);

  const classes = useStyles();
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
      alert(JSON.stringify(values, null, 2));
      onSubmit(values);
    },
  });
  return (
    <Grid container spacing={4}>
      <Grid container item xs={12}>
        <Grid item md={4}>
          <FormControl fullWidth className={classes.margin} variant='outlined'>
            <Autocomplete
              id='academic_year'
              name='academic_year'
              onChange={(e, value) => {
                formik.setFieldValue('academic_year', value);
              }}
              value={formik.values.academic_year}
              options={academicYears}
              getOptionLabel={(option) => option.session_year || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
            <FormHelperText style={{ color: 'red' }}>
              {formik.errors.academic_year ? formik.errors.academic_year : ''}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='branch'
            name='branch'
            onChange={(e, value) => {
              formik.setFieldValue('branch', value);
              formik.setFieldValue('grade', '');
              formik.setFieldValue('section', '');
              handleChangeBranch(value ? [value] : null);
            }}
            value={formik.values.branch}
            options={branches}
            getOptionLabel={(option) => option.branch_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
              />
            )}
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.branch ? formik.errors.branch : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='grade'
            name='grade'
            onChange={(e, value) => {
              formik.setFieldValue('grade', value);
              formik.setFieldValue('section', '');
              handleChangeGrade(value ? [value] : null, [formik.values.branch]);
            }}
            value={formik.values.grade}
            options={grades}
            getOptionLabel={(option) => option.grade_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
              />
            )}
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.grade ? formik.errors.grade : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='section'
            name='section'
            onChange={(e, value) => {
              formik.setFieldValue('section', value);
            }}
            value={formik.values.section}
            options={sections}
            getOptionLabel={(option) => option.section_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.section ? formik.errors.section : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4}>
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
            limitTags={2}
            multiple
            options={subjects}
            getOptionLabel={(option) => option.subject_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subjects'
                placeholder='Subjects'
              />
            )}
            getOptionSelected={(option, value) => option.id == value.id}
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.subjects ? formik.errors.subjects : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid container item xs={12}>
        <Grid md='4'>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SchoolDetailsForm;
