import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../Layout/index';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import FormHelperText from '@material-ui/core/FormHelperText';
import endpoints from '../../config/endpoints';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import moment from 'moment';
import './subjectgrademapping.scss';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

// const modulesArray = [
//   { id: 'lesson-plan', label: 'Lesson plan', key: 'is_lesson_plan', value: true },
//   { id: 'assessment', label: 'Assessment', key: 'is_assessment', value: true },
//   { id: 'ebook', label: 'Ebook', key: 'is_ebook', value: true },
//   { id: 'ibook', label: 'Ibook', key: 'is_ibook', value: true },
// ];

const CategoryMapping = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = React.useState();
  //   const [modules] = React.useState(modulesArray);
  const [centralCategory, setCentralCategory] = useState([]);
  const [erpCategory, setErpCategory] = useState([]);
  const [selectedERPCategory, setSelectedERPCategory] = useState(null);
  const [selectedCentralCategory, setSelectedCentralCategory] = useState(null);

  React.useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Content Mapping') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getERPCategory = () => {
    axiosInstance
      .get(`${endpoints.questionBank.categoryQuestion}`)
      .then((res) => {
        if (res?.data) {
          setErpCategory(res?.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCentralCategory = () => {
    axios
      .get(`${endpoints.questionBank.categoryList}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((res) => {
        if (res?.data) {
          setCentralCategory(res?.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getERPCategory();
    getCentralCategory();
    //   if (selectedYear?.id && moduleId) {
    //     getBranch();
    // centralGradeSubjects();
    //   }
  }, []);

  const Validation = (formData) => {
    let input = formData;
    let error = {};
    let errors = false;
    let isValid = true;
    if (!input['branch']) {
      isValid = false;
      errors = true;
      error['branchError'] = 'Please select valid branch';
    }
    if (!input['erp_grade']) {
      isValid = false;
      errors = true;
      error['erp_gradeError'] = 'Please select valid Grade';
    }
    if (!input['erp_gs_mapping']) {
      isValid = false;
      errors = true;
      error['erp_gs_mappingError'] = 'Please select valid Subject';
    }
    if (!input['central_subject']) {
      isValid = false;
      errors = true;
      error['central_subjectError'] = 'Please select valid Central Subject';
    }
    if (!input['central_grade']) {
      isValid = false;
      errors = true;
      error['central_gradeError'] = 'Please select valid Central Grade';
    }
    if (!input['module']) {
      isValid = false;
      errors = true;
      error['moduleError'] = 'Please select valid module';
    }

    const validInfo = {
      errorMessage: error,
      isValid,
      errors,
    };
    return validInfo;
  };

  const submit = () => {
    console.log(selectedERPCategory,selectedCentralCategory)
    if (selectedERPCategory && selectedCentralCategory) {
      //   const { key: moduleKey, value } = selectedModule;
      let body = {
        central_category_name: selectedCentralCategory && selectedCentralCategory?.category_name,
        category_id: selectedERPCategory && selectedERPCategory?.id,
        central_category_id: selectedCentralCategory && selectedCentralCategory?.id,
      };
      // const valid = Validation(body);
      axiosInstance
        .post(endpoints.questionBank.categoryMapping, body)
        .then((res) => {
          if (res?.status === 200) {
            setAlert('success', res.data[0]);
            history.push('/subject/grade');
          } else {
            setAlert('warning', res.data[0]);
          }
        })
        .catch((err) => {
          setAlert('error', err.message);
          console.log(err);
        });
    } else {
    //   setErrorMessage('Please select all the fields');
      setAlert('error', 'Please select all the fields');
      return;
    }
    //
    //   } else {
    //     let body = {
    //       branch: branchValue.id,
    //       erp_grade: gradeValue.id,
    //       erp_gs_mapping:
    //         subjectUpdateValue.map((ele) => ele.id) || subjectValue.map((ele) => ele.id),
    //       central_grade: centralGradeValue.grade,
    //       central_grade_name: centralGradeValue.grade_name,
    //       central_subject: centralSubValue.id,
    //       // central_gs_mapping: gradeValue.id,
    //       central_gs_mapping: centralGrade[0] && centralGrade[0].id,
    //       central_subject_name: centralSubValue.subject_name,
    //     };
    //     axiosInstance
    //       .put(
    //         `${endpoints.mappingStudentGrade.updateAssign}/${updateId}/update-school-gs-mapping/`,
    //         body
    //       )
    //       .then((res) => {
    //         if (res.data.status_code === 200) {
    //           setAlert('success', res.data.message);
    //           props.history.push('/subject/grade');
    //         } else {
    //           setAlert('warning', res.data.message);
    //         }
    //       })
    //       .catch((err) => {
    //         setAlert('error', err.message);
    //         console.log(err);
    //       });
    //   }
  };

  const clearAll = () => {
    history.push('/subject/grade');
    setSelectedERPCategory({});
    setSelectedCentralCategory({});
    //   setcentralSubValue(null);
    //   setcentralGradeValue(null);
    //   setGradeValue(null);
    //   setBranchValue(null);
    //   setSubjectValue([]);
    //   setSubjectId([]);
    //   props.history.push('/subject/grade');
  };

  useEffect(() => {
    //   setLocalStorageData();
  }, []);

  return (
    <div className='mapping-grade-subject-layout'>
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Content Mapping'
          childComponentNameNext='Assign Mapping'
        />
        <div className='cen-dropdown'>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl className={`select-form`}>
                <Autocomplete
                  // {...defaultProps}
                  style={{ width: 350 }}
                  // multiple
                  value={selectedERPCategory}
                  id='tags-outlined'
                  options={erpCategory}
                  getOptionLabel={(option) => option.category_name}
                  filterSelectedOptions
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='ERP Category' />
                  )}
                  onChange={(e, value) => {
                    setSelectedERPCategory(value);
                  }}
                  getOptionSelected={(option, value) => value && option.id == value.id}
                />
                <FormHelperText style={{ marginLeft: '20px', color: 'red' }}>
                  {error && error.errorMessage && error.errorMessage.moduleError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl className={`select-form`}>
                <Autocomplete
                  // {...defaultProps}
                  style={{ width: 350 }}
                  // multiple
                  value={selectedCentralCategory}
                  id='tags-outlined'
                  options={centralCategory}
                  getOptionLabel={(option) => option.category_name}
                  filterSelectedOptions
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Central-Category' />
                  )}
                  onChange={(e, value) => {
                    setSelectedCentralCategory(value);
                  }}
                  getOptionSelected={(option, value) => value && option.id == value.id}
                />
                <FormHelperText style={{ marginLeft: '20px', color: 'red' }}>
                  {error && error.errorMessage && error.errorMessage.central_gradeError}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <div className='btn-container'>
            <div className='btn'>
              <Button variant='contained' className='clear-all' onClick={clearAll}>
                Cancel
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ color: 'white' }}
                className='filter-btn'
                onClick={submit}
              >
                {/* {props.location.edit === true ? 'Update Assign' : 'Assign'}{' '} */}
                Assign
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default CategoryMapping;
