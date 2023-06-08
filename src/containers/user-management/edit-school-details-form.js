import React, { useState, useEffect, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import { useStyles } from './useStyles';
import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchAcademicYears as getAcademicYears,
  fetchSubjects as getSubjects,
} from '../../redux/actions';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText,
  Grid,
  Divider,
  FormControl,
  TextField,
  Button,
} from '@material-ui/core';
import axios from 'axios';
import endpoints from 'config/endpoints';

const EditSchoolDetailsForm = ({
  details,
  onSubmit,
  isNext = false,
  index = 0,
  handleDelete,
  currentFormLength,
  isAcadDisabled = false,
  isEditable = false,
}) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { is_superuser: isSuperUser } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [roles, setRoles] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [designation, setDesignation] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const isOrchids =
  window.location.host.split('.')[0] === 'orchids' ||
  window.location.host.split('.')[0] === 'qa' || window.location.host.split('.')[0] === 'localhost:3000' || window.location.host.split('.')[0] === 'mcollege' || window.location.host.split('.')[0] === 'dps'
    ? true
    : false;
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
  console.log(details , 'details edit');
  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
      designation: details.designation,
      userLevel: details.user_level
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
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch;
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
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch;
      const gradeList = values.map((element) => ({ id: element?.grade_id })) || grade;
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
      getRoleApi()
      getDesignation(details.user_level)
      if (details?.academic_year?.length > 0) {
        handleChangeAcademicYear(details.academic_year[0]);
        if (details.branch) {
          handleChangeBranch(details.branch, details.academic_year[0]?.id);
          if (details?.grade?.length > 0) {
            handleChangeGrade(
              details.grade,
              details.academic_year[0]?.id,
              details.branch
            );
            if (details?.section?.length > 0) {
              handleChangeSection(
                details.section,
                details.academic_year[0]?.id,
                details.branch,
                details.grade
              );
              if (details?.subjects?.length > 0) {
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(true);
  };

  const validateEntries = () => {
    const validationObject = {
      'academic year': formik.values?.academic_year?.length,
      branch: formik.values?.branch?.length,
      grade: formik.values?.grade?.length,
      section: formik.values?.section?.length,
      subjects: formik.values?.subjects?.length,
    };
    const validationEntries = Object.entries(validationObject);
    for (let i = 0; i < validationEntries.length; i++) {
      const [key, value] = validationEntries[i];
      if (!value) {
        setAlert('error', `Please select ${key}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    // if (!validateEntries()) return;

    formik.handleSubmit();
  };

  const classes = useStyles();

  const getRoleApi = async () => {
    try {
      const result = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        setRoles(result?.data?.result)
        let filter = result?.data?.result.filter((e) => e?.id == details.user_level )
        console.log(filter , 'fil');
        if(filter?.length > 0){
          formik.setFieldValue('userLevel' , filter[0])
          setSelectedRole(filter[0])
        }
      } else {
        setAlert('error', result?.data?.message);
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  const getDesignation = async (id) => {
    try {
      const result = await axios.get(`${endpoints.lessonPlan.designation}?user_level=${id}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        console.log(result);
        setDesignation(result?.data?.result)
    
      } else {
        setAlert('error', result?.data?.message);
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  return (
    <>
      <Grid container spacing={4} className='school-details-form-container'>
      {isOrchids == true && index == 0 ? 
      <div className='w-100 d-flex' >
        <div className='col-md-4' >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={(event, value) => {
            setSelectedDesignation('');
            formik.setFieldValue('designation', '');
            setSelectedRole(value);
            formik.setFieldValue('userLevel', value);
            getDesignation(value?.id)
            formik.setFieldValue('designation', '');
            console.log(value);
          
          }}
          id='branch_id'
          className='dropdownIcon'
          value={formik.values.userLevel || ''}
          options={roles || []}
          getOptionLabel={(option) => option?.level_name || ''}
          disabled={details?.user_level == 13 ? true : false}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='User Level'
              placeholder='Select User Level'
            />
          )}
        />
        </div> 
        {selectedRole?.id == 13 ? '' : 
        <div className='col-md-4' >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={(event, value) => {
            console.log(value , 'designation');
            setSelectedDesignation(value);
            formik.setFieldValue('designation', value);
          }}
          id='branch_id'
          className='dropdownIcon'
          value={formik.values.designation || ''}
          options={designation  || []}
          getOptionLabel={(option) => option?.designation || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Designation'
              placeholder='Select Designation'
            />
          )}
        />
        </div>
        }
      </div> : '' }
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item md={4} xs={12}>
          <FormControl fullWidth className={classes.margin} variant='outlined'>
            <Autocomplete
              id='year'
              name='year'
              disabled={
                details?.user_level == 13 && index < currentFormLength && isOrchids
                  ? !isSuperUser
                  : !isAcadDisabled
              }
              // disabled={!isAcadDisabled}
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
              // disabled={isEditable}
              disabled={
                details?.user_level == 13 && index < currentFormLength && isOrchids
                  ? !isSuperUser
                  : index >= currentFormLength
                  ? false
                  : isEditable
              }
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
              // disabled={isEditable}
              disabled={
                details?.user_level == 13 && index < currentFormLength && isOrchids
                  ? !isSuperUser
                  : index >= currentFormLength
                  ? false
                  : isEditable
              }
              onChange={(e, value) => {
                formik.setFieldValue('section', []);
                formik.setFieldValue('subjects', []);
                handleChangeGrade(
                  value,
                  formik.values.academic_year?.[0]?.id,
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
        {details?.user_level == 13 && index < currentFormLength && isOrchids
          ? null
          : !formik.values.academic_year?.[0]?.is_default && details.mapping_bgs?.length > 1 && (
              <Grid item md={2} xs={12}>
                <Button
                  variant='contained'
                  color='secondary'
                  // className={classes.button}
                  // onClick={() => handleDelete(index)}
                  onClick={() => handleClick()}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Grid>
            )}
      </Grid>
      <Dialog id={id} open={open} onClose={handleClose}>
        <DialogTitle id='draggable-dialog-title'>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete... ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => handleClose()} className='labelColor cancelButton'>
            Cancel
          </Button>
          <Button
            color='primary'
            variant='contained'
            style={{ color: 'white' }}
            onClick={() => handleDelete(index)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditSchoolDetailsForm;
