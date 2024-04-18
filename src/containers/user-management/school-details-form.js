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
import axios from 'axios';
import endpoints from 'config/endpoints';
import endpointsV1 from 'config/endpoints';
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import { message } from 'antd';
import axiosInstance from 'v2/config/axios';
import { each } from 'highcharts';

const BackButton = withStyles({
  root: {
    color: 'rgb(140, 140, 140)',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const SchoolDetailsForm = ({ details, onSubmit, roleBasedUiConfig }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  // const [moduleId, setModuleId] = useState('');
  const [roles, setRoles] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [designation, setDesignation] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [rolesList, setRolesList] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);

  useEffect(() => {
    // if (NavData && NavData.length) {
    //   NavData.forEach((item) => {
    //     if (
    //       item.parent_modules === 'User Management' &&
    //       item.child_module &&
    //       item.child_module.length > 0
    //     ) {
    //       item.child_module.forEach((item) => {
    //         if (item.child_name === 'Create User') {
    //           setModuleId(item.child_id);
    //         }
    //       });
    //     }
    //   });
    // }
    getRoleApi();
    getRoles();
  }, []);

  const isOrchids = IsOrchidsChecker();
  let levelObj = {};
  const getRoles = () => {
    axiosInstance
      .get(`${endpointsV1.communication.roles}`)
      .then((response) => {
        if (response.data.status_code === 200) {
          setRolesList(response.data.result);
          console.log(response.data.result, 'response');
        } else {
          message.error('Something went wrong!');
        }
        // setUserLevelForEdit(response?.data?.level);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {});
  };

  const getRoleApi = async () => {
    try {
      const result = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        setRoles(result?.data?.result);
        // const activeRole = [];
        // const levels = result?.data?.result;
        // levels.forEach((item) => {
        //   if (!item?.is_delete) {
        //     activeRole.push(item)
        //   }
        // })
        // setRoles(activeRole);
        // levels.forEach(({ id = 3, level_name = 'Student' }) => levelObj[id] = level_name)
      } else {
        setAlert('error', result?.data?.message);
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  const getDesignation = async (id) => {
    try {
      const result = await axios.get(
        `${endpoints.lessonPlan.designation}?user_level=${id}`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'x-api-key': 'vikash@12345#1231',
          },
        }
      );
      if (result.status === 200) {
        console.log(result);
        setDesignation(result?.data?.result);
      } else {
        setAlert('error', result?.data?.message);
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      academic_year: selectedYear,
      branch: details.branch,
      acadId: details.acadId,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
      userLevel: details.userLevel,
      designation: details.designation,
      roles: details.roles,
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

  const fetchBranches = () => {
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
          acadId: obj.acadId,
        }));
        if (transformedData?.length > 1) {
          transformedData.unshift({
            id: 'all',
            branch_name: 'Select All',
            branch_code: 'all',
            acadId: 'all',
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
      // getSubjects(branch, grade, section, moduleId).then((data) => {
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
    values =
      values.filter(({ id }) => id === 'all').length === 1
        ? [...branches].filter(({ id }) => id !== 'all')
        : values;
    formik.setFieldValue('branch', values);
    // formik.setFieldValue('acadId', values);
    if (values?.length > 0) {
      // fetchGrades(selectedYear?.id, values, moduleId).then((data) => {
      if (roleBasedUiConfig.includes(formik.values.userLevel.id.toString())) {
        // setLoading(true);
        axiosInstance
          .get(`${endpointsV1.userManagement.gradeList}`, {
            params: { acad_session: values.map((each) => each?.acadId).join(',') },
          })
          .then((response) => {
            if (response.data.status_code === 200) {
              const transformedData = response.data.result?.map((obj) => ({
                // item_id: grade?.id,
                id: obj?.grade_id,
                grade_name: obj?.grade__grade_name,
                // branch_id: grade?.acad_session__branch_id,
              }));
              if (transformedData?.length > 1) {
                transformedData.unshift({
                  // item_id: 'all',
                  id: 'all',
                  grade_name: 'Select All',
                  // branch_id: '',
                });
              }
              setGrades([...transformedData]);
            }
          })
          .catch((error) => {
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
          })
          .finally(() => {
            // setLoading(false);
          });
        return;
      }
      fetchGrades(selectedYear?.id, values).then((data) => {
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
      if (roleBasedUiConfig.includes(formik.values.userLevel.id.toString())) {
        axiosInstance
          .get(`${endpointsV1.userManagement.subjectList}`, {
            params: {
              acad_session: formik?.values?.branch
                ?.map((each) => each?.acadId)
                ?.join(','),
              grades: values?.map((each) => each?.id)?.join(','),
            },
          })
          .then((response) => {
            if (response.data.status_code === 200) {
              const transformedData = response?.data?.result
                ? response?.data?.result.map((obj) => ({
                    id: obj.subject_id,
                    item_id: obj.subject_id,
                    subject_name: obj.subject__subject_name,
                  }))
                : [];
              if (transformedData?.length > 1) {
                transformedData.unshift({
                  id: 'all',
                  item_id: 'all',
                  subject_name: 'Select All',
                });
              }
              if (transformedData?.length > 0) {
                setSubjects([...transformedData]);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      }
      const branchList = values.map((element) => ({ id: element?.branch_id })) || branch; // Added
      // fetchSections(selectedYear?.id, branchList, values, moduleId).then((data) => {
      fetchSections(selectedYear?.id, branchList, values).then((data) => {
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
      // getSubjects(selectedYear?.id, branchList, gradeList, values, moduleId).then(
      getSubjects(selectedYear?.id, branchList, gradeList, values).then((data) => {
        const transformedData =
          data &&
          data.map((obj) => ({
            id: obj.subject__id,
            item_id: obj.id,
            subject_name: obj.subject__subject_name,
          }));
        // if (transformedData?.length > 1) {
        //   transformedData.unshift({
        //     id: 'all',
        //     item_id: 'all',
        //     subject_name: 'Select All',
        //   });
        // }
        setSubjects(transformedData);
        // const filteredSelectedSections = formik.values.section.filter(
        //   (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        // );
        // formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    }
  };

  // useEffect(() => {
  //   if (moduleId && selectedYear) {
  //     fetchBranches(selectedYear?.id);
  //     if (details.branch) {
  //       handleChangeBranch(details.branch, selectedYear?.id);
  //       if (details.grade && details.grade.length > 0) {
  //         handleChangeGrade(details.grade, selectedYear?.id, details.branch);
  //         if (details.section && details.section.length > 0) {
  //           handleChangeSection(
  //             details.section,
  //             selectedYear?.id,
  //             details.branch,
  //             details.grade
  //           );
  //           if (details.subjects && details.subjects.length > 0) {
  //             formik.setFieldValue('subjects', details.subjects);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [moduleId, selectedYear]);

  useEffect(() => {
    if (selectedYear) {
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
  }, [selectedYear]);

  const handleSubmit = () => {
    console.log(formik.values,"formikkk");
    if (formik.values.subjects.length === 0) {
      setAlert('error', 'Please select all fields');
    } else if (
      (formik.values.userLevel == '' && isOrchids == true) ||
      (formik.values.userLevel == null && isOrchids == true)
    ) {
      setAlert('error', 'Please select User Level');
    } else if (!formik?.values?.roles) {
      setAlert('error', 'Please select Role');
    } else {
      if (
        (formik.values.userLevel?.id != 13 &&
          isOrchids == true &&
          formik.values.designation == '') ||
        (formik.values.userLevel?.id != 13 &&
          isOrchids == true &&
          formik.values.designation == null)
      ) {
        setAlert('error', 'Please select Designation');
      } else {
        formik.handleSubmit();
        console.log(formik.values.designation);
      }
    }
  };

  const classes = useStyles();
  return (
    <Grid container spacing={4} className='school-details-form-container'>
      {isOrchids == true ? (
        <div className='w-100 d-flex'>
          <div className='col-md-4'>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedRole(value);
                formik.setFieldValue('userLevel', value);
                if (value?.id == 13) {
                  setSelectedDesignation('');
                  formik.setFieldValue('designation', '');
                }
                if (value?.id) {
                  getDesignation(value?.id);
                }
              }}
              id='branch_id'
              className='dropdownIcon'
              value={formik.values.userLevel || ''}
              options={roles}
              getOptionLabel={(option) => option?.level_name}
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
          {formik.values.userLevel?.id == 13 ||
          formik.values.userLevel == '' ||
          formik.values.userLevel == null ? (
            ''
          ) : (
            <div className='col-md-4'>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedDesignation(value);
                  formik.setFieldValue('designation', value);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={formik.values.designation || ''}
                options={designation || []}
                getOptionLabel={(option) => option?.designation}
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
          )}
          <div className='col-md-4'>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedRole(value);
                formik.setFieldValue('roles', value);
              }}
              id='roles'
              className='dropdownIcon'
              value={formik.values.roles || ''}
              options={rolesList || []}
              getOptionLabel={(option) => option?.role_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Role'
                  placeholder='Select Role'
                />
              )}
            />
          </div>
        </div>
      ) : (
        ''
      )}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          id='outlined-required'
          label='Academic Year'
          style={{ width: '100%', padding: '0px !important', height: '7px !important' }}
          defaultValue={
            details?.erp_id
              ? details?.academic_year?.session_year
              : selectedYear?.session_year
          }
          variant='outlined'
          disabled
          size='small'
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='branch'
            name='branch'
            onChange={(e, value) => {
              if (!formik.values.userLevel) {
                message.error('Please select user level for branch selection!');
                formik.setFieldValue('branch', []);
                return;
              }
              // formik.values.userLevel
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
            getOptionSelected={(option, value) => option?.id == value?.id}
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
            {formik?.errors?.grade ? formik?.errors?.grade : ''}
          </FormHelperText>
        </FormControl>
      </Grid>
      {!roleBasedUiConfig.includes(formik?.values?.userLevel?.id?.toString()) ? (
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
      ) : null}
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
              handleSubmit();
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
