/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    TextField,
    // Button,
    SvgIcon,
    // Badge,
    IconButton,
    useMediaQuery,
    withStyles,
    List,
    ListItem,
    Typography
} from '@material-ui/core';
import {
    LocalizationProvider,
    DateRangePicker,
} from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluated from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';
import HomeWorkCard from '../homework-card';
import $ from 'jquery';
import './styles.scss';
import {
    fetchCoordinateTeacherHomeworkDetails,
    fetchTeacherHomeworkDetails,
    setSelectedHomework,
    fetchStudentsListForTeacherHomework,
    setTeacherUserIDCoord,
    setSelectedCoFilters,
    resetSelectedCoFilters,
    resetSelectedFilters
} from '../../../redux/actions';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeworkRow from './homework-row';
import ViewHomeworkNew from './evaluatehw';
import ViewHomeworkSubmission from './view-homework-submission';
import { Tabs, Tab } from '../../../components/custom-tabs';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Autocomplete } from '@material-ui/lab';
import { Breadcrumb, Tooltip, Select, Input, Button, message, Form, Empty, DatePicker, Card, Segmented, Badge, Popover, Divider } from 'antd';
import { DownOutlined, CheckOutlined, EditOutlined, CalendarOutlined, MoreOutlined } from '@ant-design/icons';
import HomeworkAssigned from 'v2/Assets/images/hwassign.png';
import HomeworkSubmit from 'v2/Assets/images/hwsubmit.png';
import HomeworkEvaluate from 'v2/Assets/images/task.png';
import WeeklyTable from './newTable';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.homeworkTableWrapper,
        '& > *': {
            marginTop: theme.spacing(2),
        },
        width: '100%',
        marginLeft: '5px',
        marginTop: '5px',
        [theme.breakpoints.down('xs')]: {
            width: '100',
            margin: 'auto',
        },
    },
    container: {
        maxHeight: 440,
    },
    vertical_divider: {
        height: "80px",
        width: "1px",
        margin: "5px 20px",
        backgroundColor: theme.palette.primary.main,
    },
    homeworkTableMobileView: {
        color: theme.palette.secondary.main
    }
    , horizontal_divider: {
        marginTop: '15px',
        marginBottom: '15px',
        backgroundColor: theme.palette.primary.main,
    },
    homeworkblock: {
        color: theme.palette.secondary.main,
        fontWeight: 600
    },
    dayicon: theme.dayIcon

}));

const StyledClearButton = withStyles({
    root: {
        backgroundColor: '#E2E2E2',
        color: '#8C8C8C',
        height: '35px',
        width: '90%',
        '@media (max-width: 600px)': {
            width: '100% !important',
        },
        borderRadius: '5px',
        marginRight: '15px',
        '&:hover': {
            backgroundColor: '#E2E2E2 !important',
        },
    },

})(Button);

function getDaysAfter(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const CoordinatorTeacherHomeworkv2 = withRouter(
    ({
        getCoordinateTeacherHomeworkDetails,
        getTeacherHomeworkDetails,
        onSetSelectedFilters,
        onResetSelectedFilters,
        selectedFilters,
        homeworkCols,
        homeworkRows,
        fetchingTeacherHomework,
        onSetSelectedHomework,
        evaluatedStudents,
        unevaluatedStudents,
        submittedStudents,
        unSubmittedStudents,
        fetchingStudentLists,
        fetchStudentLists,
        history,
        selectedTeacherByCoordinatorToCreateHw,
        setFirstTeacherUserIdOnloadCordinatorHomewok,
        absentList,
        onResetSelectedData,
        ...props
    }) => {
        //const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
        const [dateRange, setDateRange] = useState([
            moment().startOf('isoWeek'),
            moment().endOf('week'),
        ]);
        const [dateRangeTechPer, setDateRangeTechPer] = useState([
            moment().subtract(6, 'days'),
            moment(),
        ]);

        const formRef = createRef();

        const [activeView, setActiveView] = useState(false);
        const classes = useStyles();
        const { setAlert } = useContext(AlertNotificationContext);
        const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
        const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
        const [selectedCol, setSelectedCol] = useState({});
        // const [branchList, setBranchList] = useState([]);
        const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
        // const [isEmail, setIsEmail] = useState(false);
        const [loading, setLoading] = useState(false);
        // const [moduleId, setModuleId] = useState();
        // const [modulePermision, setModulePermision] = useState(true);
        const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
        const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));

        const [startDateTechPer, setStartDateTechPer] = useState(
            moment().format('YYYY-MM-DD')
        );
        const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 6));

        const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
        const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);
        const [selectedTeacherUser_id, setSelectedTeacherUser_id] = useState();
        // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState(selectedFilters.year);
        const selectedAcademicYear = useSelector(
            (state) => state.commonFilterReducer?.selectedYear
        );
        const selectedBranch = useSelector(
            (state) => state.commonFilterReducer?.selectedBranch
        );
        const [branchList, setBranchList] = useState([]);
        // const [selectedBranch, setSelectedBranch] = useState(selectedFilters.branch);
        const [grades, setGrades] = useState([]);
        const [sections, setSections] = useState([]);
        const [sectionDisplay, setSectionDisplay] = useState();
        const [sectionMap, setSectionMap] = useState()
        const [gradeDisplay, setGradeDisplay] = useState();
        const [dates, setDates] = useState(null);
        const [value, setValue] = useState(null);
        const [viewHomework, setViewHomework] = useState({
            studentHomeworkId: '',
            date: '',
            subjectName: '',
        });


        const [receivedHomework, setReceivedHomework] = useState({
            studentHomeworkId: '',
            date: '',
            subjectName: '',
        });

        const [datePopperOpen, setDatePopperOpen] = useState(false);

        const [teacherModuleId, setTeacherModuleId] = useState("");

        const [hwFlag, setHwFlag] = useState(false);
        const [selectSub, setSelectSub] = useState(false)
        const themeContext = useTheme();
        const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));
        const [isTeacher, setIsTeacher] = useState(false)

        useEffect(() => {
            onResetSelectedData()
            // if (history != undefined && history?.location?.state?.moduleId) {
            //     const historyData = history?.location?.state
            //     if (history?.location?.state?.isTeacher == true) {
            //         setGradeDisplay(historyData?.grade)
            //         setSectionDisplay(historyData?.sectionId)
            //         setSectionMap(historyData?.sectionMapping)
            //         setselectedCoTeacherOptValue(historyData?.teacherid)
            //         getTeacherHomeworkDetails(
            //             historyData?.moduleId,
            //             selectedAcademicYear?.id,
            //             selectedBranch?.branch?.id,
            //             historyData?.grade,
            //             historyData?.sectionMapping,
            //             historyData?.sectionId,
            //             startDate,
            //             endDate,
            //         )
            //     } else {
            //         if (selectedCoTeacherOptValue != undefined) {
            //             setGradeDisplay(historyData?.grade)
            //             setSectionDisplay(historyData?.sectionId)
            //             setSectionMap(historyData?.sectionMapping)
            //             setselectedCoTeacherOptValue(historyData?.teacherid)
            //             getCoordinateTeacherHomeworkDetails(
            //                 historyData?.moduleId,
            //                 selectedAcademicYear?.id,
            //                 selectedBranch?.branch?.id,
            //                 historyData?.grade,
            //                 historyData?.sectionMapping,
            //                 historyData?.sectionId,
            //                 startDate,
            //                 endDate,
            //                 historyData?.teacherid
            //             );
            //         }
            //     }
            // }
        }, [history])


        useEffect(() => {
            if (NavData && NavData.length) {
                NavData.forEach((item) => {
                    if (
                        item.parent_modules === 'Homework' &&
                        item.child_module &&
                        item.child_module.length > 0
                    ) {
                        item.child_module.forEach((item) => {
                            if (item.child_name === 'Management View') {
                                setTeacherModuleId(item?.child_id);
                                onResetSelectedData()
                            }
                            if (item.child_name === 'Teacher Homework') {
                                setTeacherModuleId(item?.child_id);
                                setIsTeacher(true)
                                setselectedCoTeacherOptValue(userDetails?.user_id)
                                onResetSelectedData()
                            }
                        });
                    }
                });
            }
        }, []);


        useEffect(() => {
            formRef.current.setFieldsValue({
                date: [moment(startDate), moment(endDate)]
            })
        }, [endDate])

      useEffect(() => {
        if(activeView == false){
            onResetSelectedData()
        }
      },[activeView])


          
        useEffect(() => {
            const [startDate, endDate] = dateRange;
            if (teacherModuleId) {
                if (activeView === 'list-homework') {
                    if (startDate && endDate && sectionDisplay?.id) {
                        getTeacherListApi();
                    }
                }
            }
        }, [getCoordinateTeacherHomeworkDetails, dateRange, activeView, teacherModuleId, sectionDisplay, hwFlag]);

        const getTeacherListApi = async () => {
            const [startDate, endDate] = dateRange;
            setselectedCoTeacherOptValue([])

            try {
                setLoading(true);
                const result = await axiosInstance.get(`${endpoints.coordinatorTeacherHomeworkApi.getAllTeacherList}?section_mapping=${sectionMap}&module_id=${teacherModuleId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (result.status === 200) {
                    setSelectedCoTeacherOpt(result.data.result);
                    let newCoorTechID = result?.data?.result[0]?.user_id;
                    setSelectedTeacherUser_id(result.data.result[0]?.user_id);
                    setFirstTeacherUserIdOnloadCordinatorHomewok(result.data.result[0]);

                    // if (selectedTeacherByCoordinatorToCreateHw !== false) {
                    //     let myResult = result.data.result.filter(
                    //         (item) => item?.user_id == selectedTeacherByCoordinatorToCreateHw
                    //     );

                    //     newCoorTechID = myResult[0]?.user_id;
                    //     setselectedCoTeacherOptValue(myResult[0]);
                    //     setSelectedTeacherUser_id(newCoorTechID);
                    //     setFirstTeacherUserIdOnloadCordinatorHomewok(myResult[0]);
                    // }

                    if (activeView === 'list-homework') {
                        if (startDate && endDate && selectedAcademicYear?.id && selectedBranch?.id && gradeDisplay?.id, sectionDisplay?.id) {
                            getCoordinateTeacherHomeworkDetails(
                                teacherModuleId,
                                selectedAcademicYear.id,
                                selectedBranch.branch.id,
                                gradeDisplay.grade_id,
                                sectionDisplay.id,
                                sectionDisplay.section_id,
                                startDate.format('YYYY-MM-DD'),
                                endDate.format('YYYY-MM-DD'),
                                newCoorTechID
                            );
                        }
                    }
                    setLoading(false);
                } else {
                    setAlert('error', result.data.message);
                    setLoading(false);
                }
            } catch (error) {
                setAlert('error', error.message);
                setLoading(false);
            }

        };

        const getTeacherListApiFilter = async (sectionmap) => {
            const [startDate, endDate] = dateRange;
            if(isTeacher == false ){
                setselectedCoTeacherOptValue([])
            }

            try {
                setLoading(true);
                // alert(2, startDate, endDate);
                const result = await axiosInstance.get(`${endpoints.coordinatorTeacherHomeworkApi.getAllTeacherList}?section_mapping=${sectionmap}&module_id=${teacherModuleId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // const resultOptions = [];
                if (result.status === 200) {
                    setSelectedCoTeacherOpt(result.data.result);
                    // setselectedCoTeacherOptValue(result.data.result[0]);
                    let newCoorTechID = result?.data?.result[0]?.user_id;
                    setSelectedTeacherUser_id(result.data.result[0]?.user_id);
                    setFirstTeacherUserIdOnloadCordinatorHomewok(result.data.result[0]);

                  
                    setLoading(false);
                } else {
                    setAlert('error', result.data.message);
                    setLoading(false);
                }
            } catch (error) {
                setAlert('error', error.message);
                setLoading(false);
            }

        };


        const renderRef = useRef(0);

        renderRef.current += 1;

        const tableContainer = useRef(null);


        useEffect(() => {
            if (selectedAcademicYear && teacherModuleId) {
                setLoading(true);

                onSetSelectedFilters({
                    year: selectedAcademicYear,
                    branch: '',
                    grade: '',
                    section: '',
                });
                axiosInstance
                    .get(
                        `${endpoints.mappingStudentGrade.branch}?session_year=${selectedAcademicYear?.id}&module_id=${teacherModuleId}`
                    )
                    .then((result) => {
                        if (result.status === 200) {
                            // handleGrade();
                            setBranchList(result?.data?.data?.results || []);
                            setLoading(false);
                        } else {
                            setAlert('error', 'Something Wrong');
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        setAlert('error', 'Something Wrong');
                        setLoading(false);
                    });
            }
        }, [selectedAcademicYear, teacherModuleId]);




        useEffect(() => {
            if (selectedBranch && teacherModuleId) {
                getGrade()
            }
        }, [teacherModuleId])

        const getGrade = () => {
            axiosInstance.get(`${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${teacherModuleId}`)
                .then((result) => {
                    if (result.status === 200) {
                        setGrades(result.data.data || []);
                        setLoading(false);
                    } else {
                        setAlert('error', 'Something Wrong');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setAlert('error', 'Something wrong');
                    setLoading(false);
                })
        }

   

        const handleGradeant = (e) => {
            if (e) {
                setGradeDisplay(e)
                formRef.current.setFieldsValue({
                    section: ''
                })
                getSection(e)
            }
        }

        const getSection = (value) => {
            axiosInstance
                .get(
                    `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${value}&module_id=${teacherModuleId}`
                )
                .then((result) => {
                    if (result.data.status_code === 200) {
                        setSections(result.data?.data);
                        setLoading(false);
                    } else {
                        setAlert('error', result.data.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setAlert('error', error.message);
                    setLoading(false);
                });
        }

        const handleSection = (e, value) => {
            console.log(e, value);
            if (value) {
                setSectionDisplay(e)
                setSectionMap(value?.key)
                getTeacherListApiFilter(value?.key)
            }
        };



        const handleTeacher = (e, value) => {
            console.log(e, value);
            if (value) {
                setselectedCoTeacherOptValue(e)
            }
        };

        const setData = (teacher) => {
            localStorage.setItem('managementTeacher', JSON.stringify({
                // selectedYear: selectedYear,
                selectedBranch: selectedBranch,
                selectedGrade: gradeDisplay,
                selectedSection: sectionDisplay,
                selectedTeacher: teacher,
                selectedDate: dateRange,
                teacherModuleId: teacherModuleId,
            }))

        };









        const gradeOptions = grades?.map((each) => {
            return (
                <Option key={each?.grade_id} value={each?.grade_id}>
                    {each?.grade__grade_name}
                </Option>
            );
        });

        let sectionOptions = sections?.map((each) => {
            return (
                <Option key={each?.id} value={each?.section_id}>
                    {each?.section__section_name}
                </Option>
            );
        });

        const teacherOptions =isTeacher == false && selectedCoTeacherOpt?.map((each) => {
            return (
                <Option key={each?.id} value={each?.user_id}>
                    {each?.name}
                </Option>
            );
        });

        const handleDate = (value) => {
            console.log(value);
            if (value[0] != null) {
                setStartDate(moment(value[0]).format('YYYY-MM-DD'))
                setEndDate(moment(value[1]).format('YYYY-MM-DD'))
            }
        }

        useEffect(() => {
            if (gradeDisplay && sectionMap && endDate != null) {
                console.log(startDate , endDate , "hitt");
                if (isTeacher == true) {
                    getTeacherHomeworkDetails(
                        teacherModuleId,
                        selectedAcademicYear?.id,
                        selectedBranch?.branch?.id,
                        gradeDisplay,
                        sectionMap,
                        sectionDisplay,
                        startDate,
                        endDate,
                    )
                } else {
                    if (selectedCoTeacherOptValue != undefined) {
                        getCoordinateTeacherHomeworkDetails(
                            teacherModuleId,
                            selectedAcademicYear?.id,
                            selectedBranch?.branch?.id,
                            gradeDisplay,
                            sectionMap,
                            sectionDisplay,
                            startDate,
                            endDate,
                            selectedCoTeacherOptValue
                        );
                    }
                }
            }
        }, [selectedCoTeacherOptValue, endDate, sectionMap , sectionDisplay])

        useEffect(() => {
            console.log(dates);
            if (dates != null) {
                handleDate(dates)
            }
        }, [dates])

        const getData = () => {
            if (isTeacher == true) {
                getTeacherHomeworkDetails(
                    teacherModuleId,
                    selectedAcademicYear?.id,
                    selectedBranch?.branch?.id,
                    gradeDisplay,
                    sectionMap,
                    sectionDisplay,
                    startDate,
                    endDate,
                )
            } else {
                if (selectedCoTeacherOptValue != undefined) {
                    getCoordinateTeacherHomeworkDetails(
                        teacherModuleId,
                        selectedAcademicYear?.id,
                        selectedBranch?.branch?.id,
                        gradeDisplay,
                        sectionMap,
                        sectionDisplay,
                        startDate,
                        endDate,
                        selectedCoTeacherOptValue
                    );
                }
            }
        }



        const disabledDate = (current) => {
            if (!dates) {
                return false;
            }
            const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
            const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;

            return !!tooEarly || !!tooLate;
        };
        const onOpenChange = (open) => {
            if (open) {
                setDates([null, null]);
                formRef.current.setFieldsValue({
                    date: [null, null]
                })
            } else {
                setDates(null);
            }
        };

        const handleDoneEvaluate = () => {
            setActiveView(false)
            onResetSelectedData()
            setViewHomework({
                studentHomeworkId: '',
                date: '',
                subjectName: '',
            })
            getData()
        }

        const onSearch = (value) => console.log(value);

        const handleClearGrade = () => {
            setSectionDisplay()
            setSectionMap()
            onResetSelectedData()
            formRef.current.setFieldsValue({
                section: ''
            })
            setSections([])
        }

        return (
            <>
                {loading ? <Loading message='Loading...' /> : null}
                <Layout>
                    {activeView == false ?
                    <div className=' teacher-homework-coordinator message_log_wrapper-coordinator'>
                        <CommonBreadcrumbs componentName='Homework' isAcademicYearVisible={true} />
                        <div className='message_log_white_wrapper'>
                            <Grid container className='date-container'>
                                <Form ref={formRef} style={{ width: '100%', display: 'flex' }} direction='row' >
                                    <div className='col-md-3'>
                                        <span className='th-grey th-14'>Grades*</span>
                                        <Form.Item name='grade'>
                                            <Select
                                                allowClear
                                                placeholder='Select Grade'
                                                showSearch
                                                optionFilterProp='children'
                                                filterOption={(input, options) => {
                                                    return (
                                                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    );
                                                }}
                                                onChange={(e) => {
                                                    handleGradeant(e);
                                                }}
                                                onClear={handleClearGrade}
                                                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                            >
                                                {gradeOptions}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className='col-md-3'>
                                        <span className='th-grey th-14'>Section*</span>
                                        <Form.Item name='section'>
                                            <Select
                                                allowClear
                                                placeholder='Select Section'
                                                showSearch
                                                optionFilterProp='children'
                                                filterOption={(input, options) => {
                                                    return (
                                                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    );
                                                }}
                                                onChange={(e, value) => {
                                                    handleSection(e, value);
                                                }}
                                                // onClear={handleClearGrade}
                                                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                            >
                                                {sectionOptions}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className='col-md-3'>
                                        <span className='th-grey th-14'>Date*</span>
                                        <Form.Item name='date'>
                                            <RangePicker
                                                value={dates || value}
                                                disabledDate={disabledDate}
                                                onCalendarChange={(val) => setDates(val)}
                                                onChange={(val) => setValue(val)}
                                                onOpenChange={onOpenChange}
                                            />
                                        </Form.Item>
                                    </div>
                                    {isTeacher == true ? '' :
                                        <div className='col-md-3'>
                                            <span className='th-grey th-14'>Teacher*</span>
                                            <Form.Item name='teacher'>
                                                <Select
                                                    allowClear
                                                    placeholder='Select Teacher'
                                                    showSearch
                                                    optionFilterProp='children'
                                                    filterOption={(input, options) => {
                                                        return (
                                                            options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        );
                                                    }}
                                                    onChange={(e, value) => {
                                                        handleTeacher(e, value);
                                                    }}
                                                    // onClear={handleClearGrade}
                                                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                                >
                                                    {teacherOptions}
                                                </Select>
                                            </Form.Item>
                                        </div>}
                                </Form>
                            </Grid>



                            <div className='create_group_filter_container'>
                                <Divider style={{ margin: '10px 0' }} />
                                <div className='d-flex justify-content-between' style={{ marginBottom: '10px' }} >
                                    <div className='d-flex col-md-6'  >
                                        <div className='row mx-1 '>
                                            <img src={HomeworkAssigned} style={{ width: '30px', height: '30px', background: '#E5FAF1', padding: '5px' }} alt='homeworkAssigned' />
                                            <div className='mx-2 d-flex align-items-center' >Submitted</div>
                                        </div>
                                        <div className='row mx-1'>
                                            <img src={HomeworkSubmit} alt='homeworkAssigned' style={{ width: '30px', height: '30px', background: '#FFF0C9', padding: '5px' }} />
                                            <div className='mx-2 d-flex align-items-center'>Pending</div>
                                        </div>
                                        <div className='row mx-1'>
                                            <img src={HomeworkEvaluate} alt='homeworkAssigned' style={{ width: '30px', height: '30px', background: '#E8F2FD', padding: '5px' }} />
                                            <div className='mx-2 d-flex align-items-center'>Evaluated</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }} >
                                        {endDate != undefined ? <div>{`Date Range Selected : ${startDate} TO ${endDate}`}</div> : ''}
                                    </div>
                                </div>
                                <div  >
                                    <>

                                        {fetchingTeacherHomework ? (
                                            <div
                                                style={{
                                                    height: '60vh',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <CircularProgress color='primary' />
                                            </div>
                                        ) : (
                                            <Grid
                                                xs={12}
                                                item
                                                className='home-work-grid'
                                            >

                                                {homeworkCols?.length > 0 ?
                                                    <WeeklyTable homeworkCols={homeworkCols} homeworkRows={homeworkRows} branch={selectedBranch?.branch?.id} grade={gradeDisplay} sectionMapping={sectionMap} sectionId={sectionDisplay}
                                                        teacherid={selectedCoTeacherOptValue} moduleId={teacherModuleId} startDate={startDate} endDate={endDate} 
                                                        isTeacher={isTeacher} setViewHomework={setViewHomework} setActiveView={setActiveView} onSearch={onSearch} />
                                                    : homeworkCols?.length == 0 ? <div style={{ minHeight: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                        <Empty />
                                                    </div> : ''}
                                            </Grid>
                                        )}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <div>
                    {activeView === true && (
                <ViewHomeworkNew
                  homework={viewHomework}
                  onClose={handleDoneEvaluate}
                />
              )}
                    </div> }
                </Layout>
            </>
        );
    }
);

const mapStateToProps = (state) => ({
    selectedFilters: state.teacherHomework.selectedCoFilters,
    homeworkCols: state.teacherHomework.homeworkCols,
    homeworkRows: state.teacherHomework.homeworkRows,
    fetchingTeacherHomework: state.teacherHomework.fetchingTeacherHomework,
    evaluatedStudents: state.teacherHomework.evaluatedStudents,
    submittedStudents: state.teacherHomework.submittedStudents,
    unSubmittedStudents: state.teacherHomework.unSubmittedStudents,
    unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
    fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
    selectedTeacherByCoordinatorToCreateHw:
        state.teacherHomework.selectedTeacherByCoordinatorToCreateHw,
    absentList: state.teacherHomework.absentList,

});

const mapDispatchToProps = (dispatch) => ({
    getCoordinateTeacherHomeworkDetails: (
        teacherModuleId,
        acadYear,
        branch,
        grade,
        sectionId,
        section,
        startDate,
        endDate,
        selectedTeacherUser_id
    ) => {
        dispatch(
            fetchCoordinateTeacherHomeworkDetails(
                teacherModuleId,
                acadYear,
                branch,
                grade,
                sectionId,
                section,
                startDate,
                endDate,
                selectedTeacherUser_id
            )
        );
    },
    getTeacherHomeworkDetails: (
        teacherModuleId,
        acadYear,
        branch,
        grade,
        sectionId,
        section,
        startDate,
        endDate,
    ) => {
        dispatch(
            fetchTeacherHomeworkDetails(
                teacherModuleId,
                acadYear,
                branch,
                grade,
                sectionId,
                section,
                startDate,
                endDate,
            )
        );
    },
    onSetSelectedHomework: (data) => {
        dispatch(setSelectedHomework(data));
    },
    fetchStudentLists: (id, subjectId, sectionId, selectedTeacherUser_id, date) => {
        dispatch(fetchStudentsListForTeacherHomework(id, subjectId, sectionId, selectedTeacherUser_id, date));
    },
    setFirstTeacherUserIdOnloadCordinatorHomewok: (selectedTeacherUser_id) => {
        return dispatch(setTeacherUserIDCoord(selectedTeacherUser_id));
    },
    onSetSelectedFilters: (data) => { dispatch(setSelectedCoFilters(data)) },
    onResetSelectedFilters: () => { dispatch(resetSelectedCoFilters()) },
    onResetSelectedData: () => { dispatch(resetSelectedFilters()) },

});

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorTeacherHomeworkv2);
