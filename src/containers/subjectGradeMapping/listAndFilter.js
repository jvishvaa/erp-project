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
    const [branch, setBranchRes] = useState([])
    const [gradeRes, setGradeRes] = useState([]);
    const [branchValue, setBranchValue] = useState(null);
    const [gradeValue, setGradeValue] = useState(null);
    const [schoolGsMapping, setSchoolGsMapping] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(false);

    const navigateToCreatePage = () => {
        props.history.push('/master-mgmt/subject/grade/mapping')
    }

    const handleClearAll = () => {
        setFilter(false);
        setSchoolGsMapping([]);
        setGradeRes([]);
        setBranchValue(null);
        setGradeValue(null);
    }

    useEffect(() => {
        const getBranch = () => {
            axiosInstance.get(endpoints.mappingStudentGrade.branch).then(res => {
                if (res.data.data) {
                    setBranchRes(res.data.data)
                }
            }).catch(err => {
                console.log(err)
            })

        }
        getBranch()
    }, [schoolGsMapping]);

    const handleChangeBranch = (value) => {
        if (value) {
            setBranchValue(value);
            axiosInstance.get(`${endpoints.mappingStudentGrade.grade}?branch_id=${value.id}&module_id=8`).then(res => {
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
        if(branchValue === null && gradeValue === null){
            setAlert('warning', 'Select Grade');
            return false
        }else{
            let body = {
                branch: branchValue && branchValue.id,
                erp_grade: gradeValue && gradeValue.grade_id
            }
            const valid = Validation(body);
            if(valid.isValid === true){
                setFilter(true);
                axiosInstance.get(`${endpoints.mappingStudentGrade.schoolGsMapping}?branch=${body.branch}&erp_grade=${body.erp_grade}`).then(res => {
                    setSchoolGsMapping(res.data.data.results)
                }).catch(err => {
                    console.log(err)
                })
            }else{
                console.log(valid.errorMessage)
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
        <div className="list-and-filter">
            <Layout>
                <div className='mapping-message_log_breadcrumb_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
                    <CommonBreadcrumbs componentName='Master Management' childComponentName='Lesson Plan Mapping'/>
                </div>
                <div className="mapping-grade-subject-dropdown-container">
                    <Grid container spacing={2}>
                        <Grid item xs={10} style={{ display: 'flex', }}>
                            <div className="branch-dropdown">
                                <Grid item xs={4} sm={2}>
                                    <FormControl className={`select-form`}>
                                        <Autocomplete
                                            // {...defaultProps}
                                            style={{ width: 350 }}
                                            // multiple
                                            value={branchValue}
                                            id="tags-outlined"
                                            options={branch}
                                            getOptionLabel={(option) => option.branch_name}
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
                            </div>

                            <div className="subject-dropdown">
                                <Grid item xs={4} sm={2}>
                                    <FormControl className={`subject-form`}>
                                        <Autocomplete
                                            // {...defaultProps}
                                            style={{ width: 350, marginLeft: 20 }}
                                            // multiple
                                            required={true}
                                            value={gradeValue}
                                            id="tags-outlined"
                                            options={gradeRes}
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
                            </div>
                        </Grid>
                    </Grid>
                </div>
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
                    <StyledButton variant="outlined" color="primary" style={{ color: 'white' }} onClick={navigateToCreatePage}>
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
                <div className="mapping-sub-grade-container">
                    <div className="mapping-grade-subject-container">
                        <Subjectcard schoolGsMapping={schoolGsMapping} updateDeletData={updateDeletData} setFilters={filter}/>
                    </div>
                </div>
            </Layout>

        </div>
    );
}

export default withRouter(ListandFilter);