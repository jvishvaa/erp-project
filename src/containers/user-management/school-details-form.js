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
  const { setAlert } = useContext(AlertNotificationContext);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

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
      academic_year: selectedYear,
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



  // const fetchAcademicYears = () => {
  //   getAcademicYears(moduleId).then((data) => {
  //     let transformedData = '';
  //     transformedData = data?.map((obj) => ({
  //       id: obj.id,
  //       session_year: obj.session_year,
  //     }));
  //     setAcademicYears(transformedData);
  //     if (!details.academic_year) {
  //       const defaultYear = transformedData?.[0];
  //       formik.setFieldValue('academic_year', defaultYear);
  //       fetchBranches(defaultYear?.id);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   fetchBranches();
  // }, [selectedYear , moduleId]);

  const fetchBranches = () => {
    console.log(selectedYear , "selected year");
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id, moduleId).then((data) => {
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

  const handleChangeBranch = (values, acadId) => {
    setGrades([]);
    console.log(selectedYear?.id , "acad");
    setSections([]);
    setSubjects([]);
    values =
      values.filter(({ id }) => id === 'all').length === 1
        ? [...branches].filter(({ id }) => id !== 'all')
        : values;
    formik.setFieldValue('branch', values);
    if (values?.length > 0) {
      fetchGrades(selectedYear?.id, values, moduleId).then((data) => {
        console.log(selectedYear?.id , "acad id");
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

  const handleChangeGrade = (values, acadId, branch) => {
    setSections([]);
    setSubjects([]);
    values =
      values.filter(({ id }) => id === 'all').length === 1
        ? [...grades].filter(({ id }) => id !== 'all')
        : values;
    formik.setFieldValue('grade', values);
    if (values?.length > 0) {
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch; // Added
      fetchSections(selectedYear?.id, branchList, values, moduleId).then((data) => {
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
    console.log(formik , "formik");
    formik.setFieldValue('subjects', []);
    formik.setFieldValue('section', []);
    values =
      values.filter(({ id }) => id === 'all').length === 1
        ? [...sections].filter(({ id }) => id !== 'all')
        : values;
    formik.setFieldValue('section', values);
    if (values?.length > 0) {
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch; // Added
      const gradeList = values.map((element) => ({ id: element?.grade_id })) || grade; // Added
      getSubjects(selectedYear?.id, branchList, gradeList, values, moduleId).then((data) => {
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
    console.log(formik , "formik");
        // const filteredSelectedSections = formik.values.section.filter(
        //   (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        // );
        // formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    }
  };

  // const handleChangeSubject = (event, value) => {
  //   formik.setFieldValue('subjects', []);
  //   value =
  //     value.filter(({ id }) => id === 'all').length === 1
  //       ? [...subjects].filter(({ id }) => id !== 'all')
  //       : value;
  //   if (value.length > 0) {
  //     formik.setFieldValue('subjects', value);
  //   }
  // };

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
    if (moduleId && selectedYear) {
        fetchBranches(selectedYear?.id);
        if (details.branch) {
          handleChangeBranch(details.branch, selectedYear?.id);
          if (details.grade && details.grade.length > 0) {
            handleChangeGrade(details.grade, selectedYear?.id, details.branch);
            if (details.section && details.section.length > 0) {
              handleChangeSection(
                details.section,
                selectedYear?.id,
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
  }, [moduleId , selectedYear]);

  const handleSubmit = () => {

    if(formik.values.subjects.length === 0){
      console.log("no sub");
      setAlert('error','Please select all fields')
    }
    else {
      console.log("proceed");
      formik.handleSubmit()
    }
  }

  const classes = useStyles();

  return (
    <Grid container spacing={4} className='school-details-form-container'>
      {/* <Grid container item xs={12}> */}
      <Grid item md={4} xs={12}>
        {/* <FormControl fullWidth className={classes.margin} variant='outlined'>
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
            value={formik.values.academic_year || ''}
            options={academicYears || []}
            // filterSelectedOptions
            className='dropdownIcon'
            getOptionSelected={(option, value) => option.id == value.id}
            getOptionLabel={(option) => option?.session_year || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
                required
              />
            )}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.academic_year ? formik.errors.academic_year : ''}
          </FormHelperText>
        </FormControl> */}
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
              // formik.setFieldValue('branch', [value]);
              // formik.setFieldValue('branch', value);
              formik.setFieldValue('grade', []);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              // handleChangeBranch([value], formik.values.academic_year?.id);
              handleChangeBranch(value, formik.values.academic_year?.id);
              // handleChangeBranch(value ? [value] : null);
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
            onChange={(e, value) => {
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeGrade(
                value,
                selectedYear?.id,
                formik.values.branch
              );
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
            onChange={(e, value) => {
              handleChangeSection(
                value,
                formik.values.academic_year?.id,
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
              // formik.handleSubmit();
              // console.log(formik , "formik")
              handleSubmit()
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
