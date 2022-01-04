import React, { useState, useEffect, useContext } from 'react';
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
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import DeleteIcon from '@material-ui/icons/Delete';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

const BackButton = withStyles({
  root: {
    color: 'rgb(140, 140, 140)',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const EditSchoolDetailsForm = ({
  details,
  onSubmit,
  isNext = false,
  index = 0,
  handleDelete,
  isAcadDisabled = false,
  handleAddMappingObject,
  isAddVisible = false,
  className,
}) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
    },
    // validationSchema,
    onSubmit: (values) => {
      onSubmit(values, index);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const fetchAcademicYears = () => {
    getAcademicYears(moduleId).then((data) => {
      let transformedData = '';
      transformedData = data?.map((obj = {}) => ({
        id: obj?.id || '',
        session_year: obj?.session_year || '',
        is_default: obj?.is_current_session || '',
      }));
      setAcademicYears(transformedData);
    });
  };

  const fetchBranches = (acadId) => {
    fetchBranchesForCreateUser(acadId, moduleId).then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
        branch_code: obj.branch_code,
      }));
      if (transformedData?.length > 1) {
        transformedData.unshift({
          id: 'all',
          branch_name: 'Select All',
          branch_code: 'all',
        });
      }
      setBranches(transformedData);
    });
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
      getSubjects(branch, grade, section, moduleId).then((data) => {
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

  const handleChangeAcademicYear = (value = {}) => {
    setBranches([]);
    setGrades([]);
    setSections([]);
    setSubjects([]);
    formik.setFieldValue('academic_year', []);
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('subjects', []);
    if (value) {
      formik.setFieldValue('academic_year', [value]);
      fetchBranches(value?.id);
    }
  };

  const handleChangeBranch = (values = [], acadId) => {
    setGrades([]);
    setSections([]);
    setSubjects([]);
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('subjects', []);
    if (values?.length > 0) {
      values =
        values.filter(({ id }) => id === 'all').length === 1
          ? [...branches].filter(({ id }) => id !== 'all')
          : values;
      formik.setFieldValue('branch', values);
      fetchGrades(acadId, values, moduleId).then((data) => {
        const transformedData = data
          ? data.map((grade) => ({
              item_id: grade?.id,
              id: grade?.grade_id,
              grade_name: grade?.grade__grade_name,
              branch_id: grade?.acad_session__branch_id,
            }))
          : [];
        if (transformedData?.length > 1) {
          transformedData.unshift({
            item_id: 'all',
            id: 'all',
            grade_name: 'Select All',
            branch_id: '',
          });
        }
        setGrades(transformedData);
      });
    }
  };

  const handleChangeGrade = (values = [], acadId, branch = []) => {
    setSections([]);
    setSubjects([]);
    formik.setFieldValue('grade', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('subjects', []);

    if (values?.length > 0) {
      values =
        values.filter(({ id }) => id === 'all').length === 1
          ? [...grades].filter(({ id }) => id !== 'all')
          : values;
      formik.setFieldValue('grade', values);
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch; // Added
      fetchSections(acadId, branchList, values, moduleId).then((data) => {
        const transformedData = data
          ? data.map((section) => ({
              item_id: section.id,
              id: section.section_id,
              section_name: `${section.section__section_name}`,
              branch_id: section?.branch_id,
              grade_id: section?.grade_id,
            }))
          : [];
        if (transformedData?.length > 1) {
          transformedData.unshift({
            id: 'all',
            item_id: 'all',
            section_name: 'Select All',
            branch_id: '',
            grade_id: '',
          });
        }
        setSections(transformedData);
      });
    }
  };

  const handleChangeSection = (values = [], acadId, branch = [], grade = []) => {
    setSubjects([]);
    formik.setFieldValue('subjects', []);
    formik.setFieldValue('section', []);

    if (values?.length > 0) {
      values =
        values.filter(({ id }) => id === 'all').length === 1
          ? [...sections].filter(({ id }) => id !== 'all')
          : values;
      formik.setFieldValue('section', values);
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch; // Added
      const gradeList = values.map((element) => ({ id: element?.grade_id })) || grade; // Added
      getSubjects(acadId, branchList, gradeList, values, moduleId).then((data) => {
        const transformedData =
          data &&
          data.map((obj) => ({
            id: obj.subject__id,
            item_id: obj.id,
            subject_name: obj.subject__subject_name,
          }));
        if (transformedData?.length > 1) {
          transformedData.unshift({
            id: 'all',
            item_id: 'all',
            subject_name: 'Select All',
          });
        }
        setSubjects(transformedData);
      });
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchAcademicYears();
      if (details?.selected_year?.length) {
        handleChangeAcademicYear(details.academic_year[0]);
        if (details.branch) {
          handleChangeBranch(details.branch, details.academic_year[0]?.id);
          if (details.grade && details.grade.length > 0) {
            handleChangeGrade(
              details.grade,
              details.academic_year[0]?.id,
              details.branch
            );
            if (details.section && details.section.length > 0) {
              handleChangeSection(
                details.section,
                details.academic_year[0]?.id,
                details.branch,
                details.grade
              );
              if (details.subjects && details.subjects.length > 0) {
                formik.setFieldValue('subjects', details.subjects);
              }
            }
          }
        }
      }
    }
  }, [moduleId]);

  useEffect(() => {
    if (isNext) handleSubmit();
  }, [isNext]);

  const handleSubmit = () => {
    if (formik.values.subjects.length === 0) {
      setAlert('error', 'Please select all fields');
    } else {
      formik.handleSubmit();
    }
  };

  const classes = useStyles();

  return (
    <Grid container spacing={4} className={`school-details-form-container-${className}`}>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='year'
            name='year'
            disabled={!isAcadDisabled}
            key={`acad_year_${index}`}
            onChange={(e, value) => {
              handleChangeAcademicYear(value);
            }}
            value={formik.values.academic_year?.[0] || []}
            options={academicYears || []}
            // filterSelectedOptions
            limitTags={2}
            className='dropdownIcon'
            getOptionLabel={(option) => option.session_year || ''}
            getOptionSelected={(option, value) => option.id == value.id}
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
            {formik.errors.branch ? formik.errors.branch : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='branch'
            name='branch'
            key={`branch_${index}`}
            onChange={(e, value) => {
              formik.setFieldValue('grade', []);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeBranch(value, formik.values.academic_year?.[0]?.id);
            }}
            multiple
            value={formik.values.branch || []}
            options={branches || []}
            // filterSelectedOptions
            limitTags={2}
            className='dropdownIcon'
            getOptionLabel={(option) => option.branch_name || ''}
            getOptionSelected={(option, value) => option.id == value.id}
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
            key={`grade_${index}`}
            onChange={(e, value) => {
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeGrade(value, selectedYear?.id, formik.values.branch);
            }}
            multiple
            value={formik.values.grade || []}
            options={grades}
            // filterSelectedOptions
            className='dropdownIcon'
            limitTags={2}
            getOptionLabel={(option) => option.grade_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
              />
            )}
            getOptionSelected={(option, value) => option.grade_name == value.grade_name}
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
            key={`section_${index}`}
            onChange={(e, value) => {
              handleChangeSection(
                value,
                formik.values.academic_year?.[0]?.id,
                formik.values.branch,
                formik.values.grade
              );
            }}
            value={formik.values.section || []}
            options={sections || []}
            multiple
            limitTags={2}
            // filterSelectedOptions
            className='dropdownIcon'
            getOptionLabel={(option) => option.section_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
            getOptionSelected={(option, value) =>
              option.section_name == value.section_name
            }
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
            key={`subjects_${index}`}
            onChange={(e, value) => {
              value =
                value.filter(({ id }) => id === 'all').length === 1
                  ? [...subjects].filter(({ id }) => id !== 'all')
                  : value;
              formik.setFieldValue('subjects', value);
            }}
            value={formik.values.subjects || []}
            limitTags={2}
            multiple
            options={subjects || []}
            // filterSelectedOptions
            className='dropdownIcon'
            getOptionLabel={(option) => option.subject_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subjects'
                placeholder='Subjects'
              />
            )}
            getOptionSelected={(option, value) => option.item_id == value.item_id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.subjects ? formik.errors.subjects : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      {!formik.values.academic_year?.[0]?.is_default && (
        <Grid item md={2} xs={12}>
          <Button
            variant='contained'
            color='secondary'
            // className={classes.button}
            onClick={() => handleDelete(index)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Grid>
      )}
      {isAddVisible && (
        <Grid item md={2} xs={12}>
          <Button
            startIcon={<AddOutlinedIcon />}
            variant='contained'
            color='primary'
            style={{ color: 'white' }}
            size='medium'
            title='Add Academic Year'
            onClick={() => handleAddMappingObject()}
          >
            Add
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default EditSchoolDetailsForm;
