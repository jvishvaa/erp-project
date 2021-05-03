import React, { useEffect, useState, useContext } from 'react';
import Layout from '../Layout/index';
import FormHelperText from '@material-ui/core/FormHelperText';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { withRouter } from 'react-router-dom';
import { SvgIcon, Button, Grid, FormControl, TextField, withStyles } from '@material-ui/core';
import Addicon from '../../assets/images/Add.svg'
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Subjectcard from './subjectCard';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './subjectgrademapping.scss';
import { generateQueryParamSting } from '../../utility-functions';

const StyledButton = withStyles({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#FF6B6B',
      '&:hover': {
        backgroundColor: '#FF6B6B',
      },
    },
    startIcon: {},
  })(Button);

const ListandFilter = (props) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const [academicYear, setAcademicYear] = useState([]);
    const [branch, setBranchRes] = useState([])
    const [gradeRes, setGradeRes] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [branchValue, setBranchValue] = useState(null);
    const [gradeValue, setGradeValue] = useState(null);
    const [schoolGsMapping, setSchoolGsMapping] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(false);
    const [selectedModule, setSelectedModule] = useState('');
    const moduleList = [
        { id: 'lesson-plan', label: 'Lesson plan', key: 'is_lesson_plan', value: true },
        { id: 'assessment', label: 'Assessment', key: 'is_assessment', value: true },
        { id: 'ebook', label: 'Ebook', key: 'is_ebook', value: true },
    ];

    const navigateToCreatePage = () => {
        props.history.push('/master-management/subject/grade/mapping')
    }

    const handleClearAll = () => {
        setFilter(false);
        setSchoolGsMapping([]);
        setGradeRes([]);
        setBranchValue(null);
        setGradeValue(null);
    }

    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [moduleId, setModuleId] = useState('');

    useEffect(() => {
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

    useEffect(() => {
        axiosInstance.get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`).then(res => {
            if (res.data.data) {
                console.log(res.data.data);
                setAcademicYear(res.data.data);
            }
        }).catch(err => {
            console.log(err)
        })
    }, []);

    useEffect(() => {
        const getBranch = () => {
            //axiosInstance.get(endpoints.masterManagement.branchList).then(res => {
            axiosInstance.get(endpoints.mappingStudentGrade.branch).then(res => {
                if (res.data.data) {
                    setBranchRes(res.data.data.results)
                }
            }).catch(err => {
                console.log(err)
            })

        }
        if(selectedYear?.id){
            getBranch();
        }
    }, [selectedYear]);

    const handleChangeYear = (vaule) => {
        if(vaule) {
            setSelectedYear(vaule);
        }
    }

    const handleChangeBranch = (value) => {
        if (value) {
            setBranchValue(value);
            axiosInstance.get(`${endpoints.mappingStudentGrade.grade}?session_year=${selectedYear?.id}&branch_id=${value?.branch.id}&module_id=${moduleId}`).then(res => {
                if (res.data.data) {
                    setGradeRes(res.data.data)
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            setBranchValue(null)
        }
    }

    const handleGradeChange = (value) => {
        //setGradeValue(value);
        if (value) {
            setGradeValue(value);
        } else {
            setGradeValue(null);
        }
    }

    const handleFilter = () => {
        if(!selectedModule) {
            setAlert('warning', 'Select Module');
            return false
        }
        if(branchValue === null && gradeValue === null){
            setAlert('warning', 'Select Grade');
            return false
        } else{
            const { key, value } = selectedModule || {};
            let body = {
                branch: branchValue && branchValue.branch.id,
                erp_grade: gradeValue && gradeValue.grade_id,
            }
            const queryString = generateQueryParamSting({ [key]: value });
            const valid = Validation(body);
            if(valid.isValid === true){
                setFilter(true);
                axiosInstance.get(`${endpoints.mappingStudentGrade.schoolGsMapping}?branch=${body.branch}&erp_grade=${body.erp_grade}&${queryString}`).then(res => {
                    setSchoolGsMapping(res.data.data.results)
                }).catch(err => {
                    console.log(err)
                })
            } else{
                setError(valid)
            }
            
        }
      
    }

    const updateDeletData = (value, index) => {
        const newData = value;
        value.splice(index,1);;
        setSchoolGsMapping(newData)
    }

    const Validation = (formData) => {
        let input = formData;
        let error = {}
        let errors = false
        let isValid = true;
        if (!input['branch']) {
            isValid = false
            errors = true
            error['branchError'] = 'Please select valid branch'
        }
        if (!input['erp_grade']) {
            isValid = false
            errors = true
            error['erp_gradeError'] = 'Please select valid Grade';

        }
        const validInfo = {
            errorMessage: error,
            isValid,
            errors
        }
        return validInfo;
    }

   
    return (
            <Layout>
                <Grid container spacing={2} style={{ width: '100%', overflow: 'hidden', padding: '10px 20px' }}>
                <Grid item md={12} xs={12} style={{ backgroundColor: '#F9F9F9' }}>
                    <CommonBreadcrumbs componentName='Master Management' childComponentName='Content Mapping'/>
                </Grid>
                    <Grid container spacing={2}  style={{ marginTop: '10px' }}>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl style={{ width: '100%' }} className={`select-form`}> 
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    value={selectedYear}
                                    id="tags-outlined"
                                    className='dropdownIcon'
                                    options={academicYear}
                                    getOptionLabel={(option) => option?.session_year}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Academic Year"

                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleChangeYear(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.branchError}</FormHelperText>
                            </FormControl>
                        </Grid> 
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl style={{ width: '100%' }} className={`select-form`}>
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    value={branchValue}
                                    id="tags-outlined"
                                    options={branch}
                                    className='dropdownIcon'
                                    getOptionLabel={(option) => option?.branch.branch_name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Branch"

                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleChangeBranch(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.branchError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl style={{ width: '100%' }} className={`subject-form`}>
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    required={true}
                                    value={gradeValue}
                                    id="tags-outlined"
                                    options={gradeRes}
                                    className='dropdownIcon'
                                    getOptionLabel={(option) => option.grade__grade_name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Grade"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleGradeChange(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.erp_gradeError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    required={true}
                                    value={selectedModule}
                                    id="tags-outlined"
                                    options={moduleList}
                                    className='dropdownIcon'
                                    getOptionLabel={(option) => option.label}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Module"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        setSelectedModule(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                        </Grid>
                    </Grid>
                <div className="btn-list">
                    <Button variant="contained" className="clear-all" onClick={handleClearAll}>Clear All</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className="filter-btn"
                        style={{ background: '#FF6B6B', marginLeft: 15 }}
                        onClick={handleFilter}
                    >
                        Filter
                    </Button>
                </div>
                <div className="button-container-map">
                    <StyledButton variant="outlined" color="primary" style={{ color: 'white', marginTop: '4px' }} onClick={navigateToCreatePage}>
                        <SvgIcon
                            component={() => (
                                <img
                                    style={{ width: '12px', marginRight: '5px' }}
                                    src={Addicon}
                                    alt='given'
                                />
                            )}
                        />
                        Assign Mapping
                    </StyledButton>
                </div>
                <Grid container spacing={2} className="mapping-sub-grade-container">
                    <Grid item md={12} xs={12} className="mapping-grade-subject-container">
                        <Subjectcard schoolGsMapping={schoolGsMapping} updateDeletData={updateDeletData} setFilters={filter}/>
                    </Grid>
                </Grid>
        </Grid>
     </Layout>
    );
}

export default withRouter(ListandFilter);