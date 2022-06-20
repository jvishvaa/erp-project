import React, { useContext, useRef, useState, useEffect } from 'react';
import {
    Button,
    Grid,
    makeStyles,
    Paper,
    withStyles,
    useTheme,
    Box,
    Input,
    Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { Divider, TextField } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { connect, useSelector } from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { sum } from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: theme.commonTableRoot,
    paperStyled: {
        minHeight: '80vh',
        height: '100%',
        padding: '50px',
        marginTop: '15px',
    },
    guidelinesText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: theme.palette.secondary.main
    },
    errorText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fe6b6b',
        marginBottom: '30px',
        display: 'inline-block',
    },
    table: {
        minWidth: 650,
    },
    downloadExcel: {
        float: 'right',
        fontSize: '16px',
        // textDecoration: 'none',
        // backgroundColor: '#fe6b6b',
        // color: '#ffffff',
    },
    columnHeader: {
        color: `${theme.palette.secondary.main} !important`,
        fontWeight: 600,
        fontSize: '1rem',
        backgroundColor: `#ffffff !important`,
    },
    tableCell: {
        color: theme.palette.secondary.main,
    },
    tablePaginationSpacer: {
        flex: 0,
    },
    tablePaginationToolbar: {
        justifyContent: 'center',
    },
    cardsContainer: {
        width: '95%',
        margin: '0 auto',
    },
    tablePaginationCaption: {
        fontWeight: '600 !important',
    },
    tablePaginationSpacer: {
        flex: 0,
    },
    tablePaginationToolbar: {
        justifyContent: 'center',
    },
    guidelineval: {
        color: theme.palette.primary.main,
        fontWeight: '600'
    },
    guideline: {
        color: theme.palette.secondary.main,
        fontSize: '16px',
        padding: '10px'
    }
}));

const guidelines = [
    {
        name: '',
        field: "Please Don't Erase or Edit any header in the file format",
    },
    { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
    { name: 'Is_lesson_plan', field: ' is a mandatory field' },
    { name: 'Is_online_class', field: ' is a mandatory field' },
    { name: 'Is_ebook', field: ' is a mandatory field' },
    { name: 'Is_ibook', field: ' is a mandatory field' },
    { field: 'To Allow Access to the user, Input value as " 0 ".' },
    { field: 'To Block Access to the user, Input value as " 1 ".' },
];

const StyledButton = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
        padding: '8px 15px',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
}))(Button);

const StyledButtonUnblock = withStyles({
    root: {
        backgroundColor: '#228B22',
        color: '#FFFFFF',
        padding: '2px 8px',
        fontSize: '10px',
        '&:hover': {
            backgroundColor: '#228B22 !important',
        },
    },
})(Button);

const StyledButtonBlock = withStyles({
    root: {
        backgroundColor: '#FF2E2E',
        color: '#FFFFFF',
        padding: '2px 8px',
        fontSize: '10px',
        '&:hover': {
            backgroundColor: '#FF2E2E !important',
        },
    },
})(Button);

const StyledClearButton = withStyles((theme) => ({
    root: {
        backgroundColor: '#E2E2E2',
        color: '#8C8C8C',
        padding: '8px 15px',
        marginLeft: '30px',
        '&:hover': {
            backgroundColor: '#E2E2E2 !important',
        },
    },
}))(Button);

const StudentMark = () => {
    const history = useHistory();
    const classes = useStyles({});
    const fileRef = useRef();
    const { setAlert } = useContext(AlertNotificationContext);
    const [file, setFile] = useState(null);
    const [uploadFlag, setUploadFlag] = useState(false);
    const [data, setData] = useState([]);
    const [failed, setFailed] = useState(false);
    const [excelData] = useState([]);
    const [academicYear, setAcademicYear] = useState();
    const [moduleId, setModuleId] = useState('');
    // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const [studentList, setStudentList] = useState(history?.location?.state?.student);
    const [selectedBranch, setSelectedBranch] = useState(history?.location?.state?.data?.branch);
    const [selectedBranchId, setSelectedBranchIds] = useState([])
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(history?.location?.state?.data?.grade);
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState([]);
    const [bulkUpload, setBulkUpload] = useState(true);
    const [isLesson, setIsLesson] = useState('');
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [isNewSeach, setIsNewSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [limit, setLimit] = useState('10');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState('1');
    const [checkFilter, setCheckFilter] = useState(false);
    const [selectedUser, setSelectedUser] = useState(history?.location?.state?.user)
    const [selectedUserData, setSelectedUserData] = useState(history?.location?.state?.studentData)
    const [dummyArr, setDummyArr] = useState(Array.from(Array(history?.location?.state?.studentData?.total_question).keys()))
    const [values, setValues] = useState({ val: [] });
    const [studentmarks, setStudentMarks] = useState();
    const [nextFlag, setNextFlag] = useState(false);


    useEffect(() => {
        if (NavData && NavData.length) {
            NavData.forEach((item) => {
                if (
                    item.parent_modules === 'Assessment' &&
                    item.child_module &&
                    item.child_module.length > 0
                ) {
                    item.child_module.forEach((item) => {
                        if (item.child_name === 'Create Test') {
                            setModuleId(item.child_id);
                        }
                    });
                }
            });
        }
        console.log(history?.location?.state?.studentData);
    }, []);
    let marksArr = [];
    let sum = [];
    useEffect(() => {
        console.log(history?.location?.state);
        axiosInstance
            .get(`${endpoints.assessment.studentMarks}?test_id=${history?.location?.state?.test_id}&user=${history?.location?.state?.user}`)
            .then((result) => {
                console.log(result);
                setStudentMarks(result?.data?.result)
                if (result?.data?.result?.total_marks === undefined) {
                    setNextFlag(true)
                } else {
                    setNextFlag(false)
                }
                marksArr = [result?.data?.result?.user_response]
                console.log(marksArr);
                marksArr.map((ele, i) => sum.push({
                    i: ele
                }))
                // setValues( {val : sum[0]?.i})
                if (marksArr[0] !== undefined) {
                    setValues({ val: sum[0]?.i })
                }
                console.log(marksArr?.length);
            })
            .catch((error) => {
                console.log('');
            });

    }, [history])

    const nextUser = () => {
        console.log(values.val);
        if (nextFlag === false) {
            if (values?.val?.length > 0) {
                studentList.map((ele, i) => {
                    if ( studentList?.length > i+1) {
                        if (ele?.user_id === selectedUser) {
                            setValues({ val: [] })
                            console.log(i);
                            setSelectedUser(history?.location?.state?.student[i + 1]?.user_id)
                            setSelectedUserData(history?.location?.state?.student[i + 1])
                            setDummyArr(Array.from(Array(history?.location?.state?.student[i + 1]?.total_question).keys()))
                            axiosInstance
                                .get(`${endpoints.assessment.studentMarks}?test_id=${history?.location?.state?.test_id}&user=${history?.location?.state?.student[i + 1]?.user_id}`)
                                .then((result) => {
                                    console.log(result);
                                    setStudentMarks(result?.data?.result)
                                    if (result?.data?.result?.total_marks === undefined) {
                                        setNextFlag(true)
                                        console.log("true");
                                    }else {
                                        setNextFlag(false)
                                    }
                                    marksArr = [result?.data?.result?.user_response]
                                    console.log(marksArr);
                                    marksArr.map((ele, i) => sum.push({
                                        i: ele
                                    }))
                                    if (marksArr[0] !== undefined) {
                                        setValues({ val: sum[0]?.i })
                                    }
                                    console.log(sum);
                                })
                                .catch((error) => {
                                    console.log('');
                                });
                        }
                    }
                })
            } else {
                setAlert('warning', 'Please Upload Marks First')
            }
        } else {
            setAlert('warning', 'Please Upload Marks First')
        }
    }

    const lastUser = () => {
        console.log(studentmarks);
        if (nextFlag === false) {
            if (values?.val?.length > 0) {
                studentList.map((ele, i) => {
                    if (ele?.user_id === selectedUser) {
                        if (i > 0) {
                            console.log(i);
                            setSelectedUser(history?.location?.state?.student[i - 1]?.user_id)
                            setSelectedUserData(history?.location?.state?.student[i - 1])
                            setDummyArr(Array.from(Array(history?.location?.state?.student[i - 1]?.total_question).keys()))
                            console.log(history?.location?.state?.student[i - 1]?.total_question);
                            axiosInstance
                                .get(`${endpoints.assessment.studentMarks}?test_id=${history?.location?.state?.test_id}&user=${history?.location?.state?.student[i - 1]?.user_id}`)
                                .then((result) => {
                                    console.log(result);
                                    setStudentMarks(result?.data?.result)
                                    if (result?.data?.result?.total_marks === undefined) {
                                        setNextFlag(true)
                                        console.log("true");
                                    }else {
                                        setNextFlag(false)
                                    }
                                    marksArr = [result?.data?.result?.user_response]
                                    console.log(marksArr);
                                    marksArr.map((ele, i) => sum.push({
                                        i: ele
                                    }))
                                    if (marksArr[0] !== undefined) {
                                        setValues({ val: sum[0]?.i })
                                    }
                                    console.log(sum);
                                })
                                .catch((error) => {
                                    console.log('');
                                });
                        }
                    }
                })
            } else {
                setAlert('warning', 'Please Upload Marks First')
            }
        } else {
            setAlert('warning', 'Please Upload Marks First')
        }
    }

    const handleMarksEnter = (event, i) => {
        console.log(i);
        let vals = [...values.val];
        vals[i] = event.target.value;
        setValues({ val: vals });
    }



    const handleBack = () => {
        history.goBack({
            pathname: '/offline-student',
            state: {
                section: history?.location?.state?.selectedSection,
                branch: history?.location?.state?.branch,
                grade: history?.location?.state?.grade
            }
        })
        // history.goBack()
    }

    const handleSave = () => {
        let value = 0;
        var sum = values.val.reduce((a, v) => a = parseFloat(a) + parseFloat(v), 0);

        if (values?.val?.length === history?.location?.state?.studentData?.total_question) {
            if (selectedUserData?.total_marks >= sum && sum >= -(selectedUserData?.total_marks)) {
                const payload = {
                    test: history?.location?.state?.test_id,
                    submitted_by: selectedUser,
                    user_response: values.val,
                    total_mark: sum
                }
                console.log(payload);
                axiosInstance
                    .put(`${endpoints.assessment.studentMarks}`, payload)
                    .then((result) => {
                        console.log(result);
                        setAlert('success', 'Marks Uploaded')
                        setNextFlag(false)
                    })
                    .catch((error) => {
                        console.log('');
                    });
            } else {
                setAlert('warning', `Marks cannot exceed total marks :- ${selectedUserData?.total_marks} `)
            }
        } else {
            setAlert('warning', ' All Fields are required')
        }
    }

    const handleSkip = () => {
        studentList.map((ele, i) => {
            if (ele?.user_id === selectedUser) {
                setValues({ val: [] })
                console.log(i);
                setSelectedUser(history?.location?.state?.student[i + 1]?.user_id)
                setSelectedUserData(history?.location?.state?.student[i + 1])
                setDummyArr(Array.from(Array(history?.location?.state?.student[i + 1]?.total_question).keys()))
                axiosInstance
                    .get(`${endpoints.assessment.studentMarks}?test_id=${history?.location?.state?.test_id}&user=${history?.location?.state?.student[i + 1]?.user_id}`)
                    .then((result) => {
                        console.log(result);
                        setStudentMarks(result?.data?.result)
                        if (result?.data?.result?.total_marks === undefined) {
                            setNextFlag(true)
                        }else {
                            setNextFlag(false)
                        }
                        marksArr = [result?.data?.result?.user_response]
                        console.log(marksArr);
                        marksArr.map((ele, i) => sum.push({
                            i: ele
                        }))
                        if (marksArr[0] !== undefined) {
                            setValues({ val: sum[0]?.i })
                        }
                        console.log(sum);
                    })
                    .catch((error) => {
                        console.log('');
                    });
            }
        })
    }

    const handleStudent = (e, val) => {
        if (nextFlag === false) {
            if (values?.val[0] !== undefined) {
                setValues({ val: [] })
                setSelectedUser(val?.user_id)
                setSelectedUserData(val)
                setDummyArr(Array.from(Array(val?.total_question).keys()))
                axiosInstance
                    .get(`${endpoints.assessment.studentMarks}?test_id=${history?.location?.state?.test_id}&user=${val?.user_id}`)
                    .then((result) => {
                        console.log(result);
                        setStudentMarks(result?.data?.result)
                        if (result?.data?.result?.total_marks === undefined) {
                            setNextFlag(true)
                        }else {
                            setNextFlag(false)
                        }
                        marksArr = [result?.data?.result?.user_response]
                        console.log(marksArr);
                        marksArr.map((ele, i) => sum.push({
                            i: ele
                        }))
                        if (marksArr[0] !== undefined) {
                            setValues({ val: sum[0]?.i })
                        }
                        console.log(sum);
                    })
                    .catch((error) => {
                        console.log('');
                    });
            } else {
                setAlert('warning', 'Please Upload Marks First')
            }
        } else {
            setAlert('warning', 'Please Upload Marks First')
        }
    }

    return (
        <Layout className='accessBlockerContainer'>
            <div className={classes.parentDiv}>
                <CommonBreadcrumbs
                    componentName='Assessment'
                    childComponentName='Offline Marks Upload'
                    isAcademicYearVisible={true}
                />

                <div className="listcontainer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%', margin: '0 auto' }} >
                        <div className='filterStudent' style={{ width: '55%' }} >
                            <div>
                                <StyledButton onClick={lastUser} startIcon={<NavigateBeforeIcon style={{ fontSize: '30px' }} />} style={{ fontWeight: '600' }} >Previous Student</StyledButton>
                            </div>
                            <div style={{ margin: '0 20px', width: '50%' }}>
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    onChange={handleStudent}
                                    id='branch_id'
                                    className='dropdownIcon'
                                    value={selectedUserData || []}
                                    options={studentList || []}
                                    getOptionLabel={(option) => option?.name || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant='outlined'
                                            label='Students'
                                            placeholder='Students'
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <StyledClearButton onClick={handleBack} style={{ fontWeight: '600' }} >All Students</StyledClearButton>
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '40%' }}>
                            <div style={{ width: '30%' }}>
                                <StyledButton onClick={handleSave} style={{ fontWeight: '600', width: '100%' }} >Save</StyledButton>
                            </div>
                            <div style={{ width: '30%' }}>
                                <StyledClearButton onClick={handleSkip} style={{ fontWeight: '600', width: '100%', margin: '0' }} >Skip</StyledClearButton>
                            </div>
                            {/* <div>
                                <StyledButton onClick={lastUser} startIcon={<NavigateBeforeIcon style={{ fontSize: '30px' }} />} style={{ fontWeight: '600' }} />
                            </div> */}
                            <div>
                                <StyledButton onClick={nextUser} endIcon={<NavigateNextIcon style={{ fontSize: '30px' }} />} style={{ fontWeight: '600' }} >Next Student</StyledButton>
                            </div>
                        </div>
                    </div>

                    <Paper className={`${classes.root} common-table`} id='singleStudent'>
                        <TableContainer
                            className={`table table-shadow view_users_table ${classes.container}`}
                        >
                            <Table stickyHeader aria-label='sticky table'>
                                <TableHead className={`${classes.columnHeader} table-header-row`}>
                                    <TableRow>
                                        <TableCell className={classes.tableCell}>Number</TableCell>
                                        {/* <TableCell className={classes.tableCell}>Question</TableCell> */}
                                        <TableCell className={classes.tableCell}>Marks</TableCell>
                                        {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dummyArr.map((items, i) => (
                                        <TableRow key={items.id}>
                                            <TableCell className={classes.tableCell}>
                                                Question - {i + 1}
                                            </TableCell>
                                            {/* <TableCell className={classes.tableCell}>{items?.erp_user?.name}</TableCell> */}
                                            <TableCell className={classes.tableCell} id="blockArea" >
                                                <TextField required variant='outlined' value={values?.val?.length > 0 ? values?.val[i] : ''} placeholder='Enter Mark' type='number' onChange={(e) => handleMarksEnter(e, i)} />
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <TablePagination
                            component='div'
                            count={totalCount}
                            rowsPerPage={limit}
                            page={Number(currentPage) - 1}
                            onChangePage={(e, page) => {
                                handlePagination(e, page + 1);
                            }}
                            rowsPerPageOptions={false}
                            className='table-pagination'
                            classes={{
                                spacer: classes.tablePaginationSpacer,
                                toolbar: classes.tablePaginationToolbar,
                            }}
                        /> */}
                    </Paper>
                </div>
            </div>
        </Layout>
    );
};

export default StudentMark;
