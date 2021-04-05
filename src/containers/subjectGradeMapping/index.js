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
import './subjectgrademapping.scss';


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

const Subjectgrade = (props) => {
    const classes = useStyles();
    const [academicYear, setAcademicYear] = useState([]);
    const [branchRes, setBranchRes] = useState([]);
    const [gradeRes, setGradeRes] = useState([]);
    const [subjectRes, setSubjectRes] = useState([]);
    const [centralSubject, setCentralSubject] = useState([]);
    const [centralGrade, setCentralGrade] = useState([]);
    const [subjectValue, setSubjectValue] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [branchValue, setBranchValue] = useState(null);
    const [gradeValue, setGradeValue] = useState(null);
    const [centralSubValue, setcentralSubValue] = useState(null);
    const [centralGradeValue, setcentralGradeValue] = useState(null);
    const [subjectUpdateValue, setUpdateSubjectValue] = useState(null);
    const [updateId, setUpdateID] = useState(null);
    const [error, setError] = useState(null);
    const [defaultValueGrade, setdefaultValueGrade] = useState(null);
    const { setAlert } = useContext(AlertNotificationContext);


    useEffect(() => {
        axiosInstance.get(`${endpoints.userManagement.academicYear}?module_id=8`).then(res => {
            if (res.data.data) {
                console.log(res.data.data);
                setAcademicYear(res.data.data);
            }
        }).catch(err => {
            console.log(err)
        })
    }, []);

    useEffect(() => {
        //axiosInstance.get(endpoints.mappingStudentGrade.branch).then(res => {
        const getBranch = () => {
            axiosInstance.get(`${endpoints.masterManagement.branchList}?session_year=${selectedYear?.id}`).then(res => {
                if (res.data.data) {
                    setBranchRes(res.data.data)
                }
            }).catch(err => {
                console.log(err)
            })

        }
        if(selectedYear?.id){
            getBranch();
            centralGradeSubjects();
        }
    }, [selectedYear]);

    const handleChangeBranch = (value) => {
        if (value) {
            setBranchValue(value);
            axiosInstance.get(`${endpoints.mappingStudentGrade.grade}?session_year=${selectedYear?.id}&branch_id=${value.id}&module_id=8`).then(res => {
                if (res.data.data) {
                    console.log(res.data.data)
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
        setGradeValue(value);
        if (value) {
            axiosInstance.get(`${endpoints.mappingStudentGrade.subjects}?session_year=${selectedYear?.id}&branch=${branchValue.id}&grade=${value.grade_id}`).then(res => {
                if (res.data.result) {
                    setSubjectRes(res.data.result)
                }
            }).catch(err => {
                console.log(err)
            })

        } else {
            setGradeValue(null);
        }

    }

    const handleChangeYear = (vaule) => {
        if(vaule) {
            setSelectedYear(vaule);
        }
    }

    const handleSubjectChange = (e, value) => {
        let values = Array.from(value, (option) => option.id);
        setUpdateSubjectValue(value)
        setSubjectValue(values);


    }

    const centralGradeSubjects = () => {
        let centralSub = [];
        let centralGrade = []
        // axiosInstance.get(`${endpoints.mappingStudentGrade.central}`).then(res => {
        //     // console.log(res.data.result)
        //     for (let filteCentral of res.data.result) {
        //         centralGrade.push({
        //             id: filteCentral.id,
        //             grade_name: filteCentral.grade_name,
        //             grade: filteCentral.grade,
        //             subject: filteCentral.subject,
        //         })
        //         for (let filterSub of filteCentral.subject) {
        //             centralSub.push({
        //                 grade_subject_id: filterSub.grade_subject_id, 
        //                 subject_id: filterSub.subject_id,
        //                 subject_name: filterSub.subject_name
        //             })
        //         }
        //     }
        //     setCentralSubject(centralSub)
        //     setCentralGrade(centralGrade)
        // }).catch(err => {
        //     // console.log(err)
        // })
        const {host}= new URL(axiosInstance.defaults.baseURL) // "dev.olvorchidnaigaon.letseduvate.com"
        const hostSplitArray = host.split('.')
        const subDomainLevels = hostSplitArray.length - 2
        let domain = ''
        let subDomain = ''
        let subSubDomain = ''
        if(hostSplitArray.length > 2){
            // domain = hostSplitArray.slice(0, hostSplitArray.length-2)
            domain = hostSplitArray.slice(hostSplitArray.length-2).join('')
        }
        if(subDomainLevels===2){
            subSubDomain = hostSplitArray[0]
            subDomain = hostSplitArray[1]
        }else if(subDomainLevels===1){
            subDomain = hostSplitArray[0]
        }
        const domainTobeSent =subDomain 
        const apiURL = `${endpoints.mappingStudentGrade.centralGradeSubjects}?domain_name=${domainTobeSent}`
        const headers = { headers: { 'x-api-key': 'vikash@12345#1231' }, }
        axios.get(apiURL, headers).then(res => {
            // console.log(res.data.result)
            for (let filteCentral of res.data.result) {
                centralGrade.push({
                    id: filteCentral.id,
                    grade_name: filteCentral.grade_name,
                    grade: filteCentral.grade,
                    subject: filteCentral.subject,
                })
                for (let filterSub of filteCentral.subject) {
                    centralSub.push({
                        grade_subject_id: filterSub.grade_subject_id, 
                        subject_id: filterSub.subject_id,
                        subject_name: filterSub.subject_name
                    })
                }
            }
            setCentralSubject(centralSub)
            setCentralGrade(centralGrade)
        }).catch(err => {
            // console.log(err)
        })
    }
    const handleChangeCentralSubject = (value) => {
        if (value) {
            setcentralSubValue(value)
        } else {
            setcentralSubValue(null)
        }
    }

    const handleChangeCentralGrade = (value) => {
        setcentralSubValue(null)
        if (value) {
            setcentralGradeValue(value)
        } else {
            setcentralGradeValue(null)
        }

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
        if (!input['erp_gs_mapping']) {
            isValid = false
            errors = true
            error['erp_gs_mappingError'] = 'Please select valid Subject';

        }
        if (!input['central_subject']) {
            isValid = false
            errors = true
            error['central_subjectError'] = 'Please select valid Central Subject';

        }
        if (!input['central_grade']) {
            isValid = false
            errors = true
            error['central_gradeError'] = 'Please select valid Central Grade';

        }

        const validInfo = {
            errorMessage: error,
            isValid,
            errors
        }
        return validInfo;
    }


    const submit = () => {
        let body = {
            branch: branchValue && branchValue.id,
            erp_grade: gradeValue && gradeValue.grade_id,
            erp_gs_mapping: subjectValue && subjectValue,
            central_grade: centralGradeValue && centralGradeValue.grade,
            central_grade_name: centralGradeValue && centralGradeValue.grade_name,
            central_subject: centralSubValue && centralSubValue.subject_id,
            // central_gs_mapping: gradeValue && gradeValue.id,
            // central_gs_mapping: centralGrade[0] && centralGrade[0].id,
            central_gs_mapping: centralSubValue && centralSubValue.grade_subject_id,
            central_subject_name: centralSubValue && centralSubValue.subject_name
        }
        if (!props.location.edit) {
            const valid = Validation(body)
            if(valid.isValid === true){
                axiosInstance.post(endpoints.mappingStudentGrade.assign, body).then(res => {
                    setAlert('success', res.data.message);
                    props.history.push('/subject/grade');
                }).catch(err => {
                    setAlert('error', err.message);
                    console.log(err)
                })

            }else{
                setError(valid && valid.error)
                console.log(valid,"valid")
            }

        } else {
            let body = {
                branch: branchValue.id,
                erp_grade: gradeValue.id,
                erp_gs_mapping: subjectUpdateValue.map((ele) => ele.id) || subjectValue.map((ele) => ele.id),
                central_grade: centralGradeValue.grade,
                central_grade_name: centralGradeValue.grade_name,
                central_subject: centralSubValue.id,
                // central_gs_mapping: gradeValue.id,
                central_gs_mapping: centralGrade[0] && centralGrade[0].id,
                central_subject_name: centralSubValue.subject_name
            }
            axiosInstance.put(`${endpoints.mappingStudentGrade.updateAssign}/${updateId}/update-school-gs-mapping/`, body).then(res => {
                // console.log(res, "res")
                setAlert('success', res.data.message);
                props.history.push('/subject/grade');
            }).catch(err => {
                setAlert('error', err.message);
                console.log(err)
            })
        }

    }

    const clearAll = () => {
        setcentralSubValue(null);
        setcentralGradeValue(null);
        setGradeValue(null);
        setBranchValue(null);
        setSubjectValue([])
        props.history.push('/subject/grade');
    }

    const defaultProps = {
        options: subjectRes,
        getOptionLabel: option => option.subject_name

    };

    useEffect(() => {
        setLocalStorageData()

    }, [])


    const setLocalStorageData = () => {
        localStorage.setItem("assignRoleData", JSON.stringify(props.location.query && props.location.query.list));
        const updateValue = props.location.query && props.location.query.list;
        if (updateValue && props.location.edit === true) {
            const local = [JSON.parse(localStorage.getItem("assignRoleData"))];
            if (local && local.length > 0) {
                const updateValue = props.location.query && props.location.query.list;
                setUpdateID(updateValue.id)
                setBranchValue(updateValue.branch);
                let gradeVale = {
                    id: updateValue && updateValue.erp_grade.id,
                    grade__grade_name: updateValue.erp_grade.grade_name,

                }
             
                setdefaultValueGrade(gradeVale);
                setGradeValue(gradeVale);
                setSubjectValue(updateValue.erp_gs_mapping)
                const centralSubject = {
                    id: updateValue.central_subject,
                    subject_name: updateValue.central_subject_name
                }
                setcentralSubValue(centralSubject);
                const centralGrade = {
                    id: updateValue.id,
                    grade_name: updateValue.central_grade_name,
                    grade: updateValue.central_grade

                }
                setcentralGradeValue(centralGrade);
                setSubjectRes(updateValue.erp_gs_mapping)
                setUpdateSubjectValue(updateValue.erp_gs_mapping)

            }
            
            // console.log(window.performance.navigation.type, "window.performance.navigation.type")
            // if (window.performance.navigation.type === 1 || local.length < 0) {
            //     props.history.push('/subject/grade')

            // }
        }

    }
  
    return (
        <div className="mapping-grade-subject-layout">
            <Layout>
                <div className="mapping-grade-subject-breadcrum">
                    <div className='mapping-message_log_breadcrumb_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
                        <CommonBreadcrumbs componentName='Master Management' childComponentName='Lesson Plan Mapping' childComponentNameNext='Assign Mapping'/>
                    </div>
                </div>
                <div className="mapping-grade-subject-dropdown-container">
                    <Grid container className={classes.root} spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`select-form`}>
                                <Autocomplete
                                    // {...defaultProps}
                                    style={{ width: 350 }}
                                    // multiple
                                    value={selectedYear}
                                    id="tags-outlined"
                                    options={academicYear}
                                    getOptionLabel={(option) => option.session_year}
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
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`select-form`}>
                                <Autocomplete
                                    // {...defaultProps}
                                    style={{ width: 350 }}
                                    // multiple
                                    value={branchValue}
                                    id="tags-outlined"
                                    options={branchRes}
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
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`grade-form`}>
                                <Autocomplete
                                    // {...defaultProps}
                                    style={{ width: 350 }}
                                    // multiple
                                    // defaultvalue={Options.find(v => v.label[0])} 
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
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`subject-form`}>
                                <Autocomplete
                                    {...defaultProps}
                                    style={{ width: 350 }}
                                    multiple
                                    required={true}
                                    value={subjectUpdateValue || []}
                                    // defaultValue={subjectRes.find(v =>  v)} 
                                    id="tags-outlined"
                                    options={subjectRes}
                                    getOptionLabel={(option) => option.subject_name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Subject"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleSubjectChange(e, value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.erp_gs_mappingError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div className="branch-dropdown">
                                
                            </div>
                            <div className="grade-dropdown">
                                
                            </div>
                            <div className="subject-dropdown">
                                
                            </div>
                        </Grid> */}
                    </Grid>

                </div>
                <div className="cen-dropdown">
                    <Grid container className={classes.root} spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`select-form`}>
                                <Autocomplete
                                    // {...defaultProps}
                                    style={{ width: 350 }}
                                    // multiple
                                    value={centralGradeValue}
                                    id="tags-outlined"
                                    options={centralGrade}
                                    getOptionLabel={(option) => option.grade_name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Central-Grade"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleChangeCentralGrade(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.central_gradeError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl className={`select-form`}>
                                <Autocomplete
                                    // {...defaultProps}
                                    style={{ width: 350 }}
                                    // multiple
                                    value={centralSubValue}
                                    id="tags-outlined"
                                    // options={centralSubject}
                                    options={(centralGradeValue&&centralGradeValue.subject)||[]}
                                    getOptionLabel={(option) => option?.subject_name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Central-Subject"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        handleChangeCentralSubject(value);
                                    }}
                                    getOptionSelected={(option, value) => value && option.id == value.id}
                                />
                                <FormHelperText style={{marginLeft: '20px', color: 'red'}}>{error && error.errorMessage && error.errorMessage.central_subjectError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} style={{ display: 'flex', }}>

                            <div className="central-grade-dropdown">
                                
                            </div>
                            <div className="central-subject-dropdown">
                                
                            </div>
                        </Grid> */}

                    </Grid>
                    <div className="btn-container">
                        <div className="btn">
                            <Button variant="contained" className="clear-all" onClick={clearAll}>Cancel</Button>
                            <Button variant="contained" color="secondary" className="filter-btn" onClick={submit}>
                                {props.location.edit === true ? "Update Assign" : 'Assign'}  </Button>
                        </div>
                    </div>

                </div>
            </Layout>

        </div>
    )
}
export default withRouter(Subjectgrade);
