import React, { useEffect, useState, useContext, createRef } from 'react';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import { Breadcrumb, Tabs, Tooltip, Select, Input, Button, message, Form, Empty, DatePicker, Card, Segmented, Badge, Popover } from 'antd';
import HolidayIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/holidayNew.png'
import EventIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/eventNew.png'
import { IconButton } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './calender.scss';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import './AttendanceCalender.scss';
import { DownOutlined, CheckOutlined, EditOutlined, CalendarOutlined, MoreOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '1rem',
        borderRadius: '10px',
        width: '100%',

        margin: '1.5rem -0.1rem',
    },
    bord: {
        margin: theme.spacing(1),
        border: 'solid lightgrey',
        borderRadius: 10,
    },
    button: {
        display: 'flex',
        justifyContent: 'space-evenly',
        // width: '20%',
    },
}));


const CalendarV2 = () => {
    const [flag, setFlag] = useState(false);
    const [evnetcategoryType, setEventcategoryType] = useState([]);
    const [selectedSession, setSelectedSession] = useState([]);
    const [dateRangeTechPer, setDateRangeTechPer] = useState([
        moment().subtract(6, 'days'),
        moment(),
    ]);
    const formRef = createRef();

    const [holidayName, setHolidayName] = useState('');
    const [holidayDesc, setHolidayDesc] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [loading, setLoading] = useState(false);
    const { setAlert } = useContext(AlertNotificationContext);
    const history = useHistory();
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [moduleId, setModuleId] = useState('');
    const classes = useStyles();
    const [academicYear, setAcademicYear] = useState([]);
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const [branchList, setBranchList] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [segment, setSegment] = useState('1')
    const [dates, setDates] = useState(null);
    const user_level =
        JSON.parse(localStorage.getItem('userDetails'))?.user_level || '';

    const [holidays, setHolidays] = useState([])
    const [events, setEvents] = useState([])
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState()

    const handleCategory = (e) => {
        setSelectedCategory(e)
        console.log(e);
    }

    const handleGetEvents = () => {
        axiosInstance
            .get(
                `${endpoints.eventBat.getListCategories}?module_id=${moduleId}`
            )
            .then((res) => {
                console.log(res);
                setCategory(res?.data?.data)
            })
            .catch((error) => {
                message.error('Failed To Fetch Categories')
            });
    };

    const categoryOptions = category?.map((each) => {
        return (
            <Option key={each?.id} value={each?.id}>
                {each?.event_category_name}
            </Option>
        );
    });


    function callApi(api, key) {
        setLoading(true);
        axiosInstance
            .get(api)
            .then((result) => {
                if (result.status === 200) {
                    if (key === 'academicYearList') {
                        const defaultValue = result?.data?.data?.[0];
                        handleAcademicYear({}, defaultValue);
                        setAcademicYear(result?.data?.data || []);
                    }
                    if (key === 'branchList') {

                        setBranchList(result?.data?.data?.results)
                    }
                    if (key === 'gradeList') {

                        setGradeList(result?.data?.data);
                    }
                    if (key === 'section') {
                        setSectionList(result.data.data);
                    }
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
    useEffect(() => {
        if (window.location.pathname.includes('teacher') == true) {
            if (NavData && NavData.length) {
                NavData.forEach((item) => {
                    if (
                        item.parent_modules === 'Calendar' &&
                        item.child_module &&
                        item.child_module.length > 0
                    ) {
                        item.child_module.forEach((item) => {
                            if (item.child_name === 'Teacher Calendar') {
                                setModuleId(item.child_id);
                            }
                        });
                    }
                });
            }
        }
        if (window.location.pathname.includes('student') == true) {
            if (NavData && NavData.length) {
                NavData.forEach((item) => {
                    if (
                        item.parent_modules === 'Calendar' &&
                        item.child_module &&
                        item.child_module.length > 0
                    ) {
                        item.child_module.forEach((item) => {
                            if (item.child_name === 'Student Calendar') {
                                setModuleId(item.child_id);
                            }
                        });
                    }
                });
            }
        }
    }, [window.location.pathname]);

    useEffect(() => {
        callApi(
            `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
            'branchList'
        );

        handleGetEvents()
    }, [moduleId]);



    const isEdited = history?.location?.state?.isEdit;

    useEffect(() => {
        if (isEdited && selectedBranch) {
            // gradeEdit();
        }
    }, [isEdited, selectedBranch]);

    // const gradeEdit = () => {

    //   if (moduleId) {
    //     callApi(
    //       `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${}&module_id=${moduleId}`,
    //       'gradeList'
    //     );
    //   }
    //   const gradeId = history?.location?.state?.gradeId;
    //   let filterGrade = gradeList.filter((item) => gradeId.indexOf(item.id) !== -1);
    // };

    useEffect(() => {
        if (history?.location?.state?.data?.grade?.length) {
            const ids = history?.location?.state?.data?.grade.map((el, index) => el);
            let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
            setSelectedGrade(filterBranch);
            formRef.current.setFieldsValue({
                grade: ids
            });
            setSelectedGrade(ids)
        }
    }, [gradeList]);

    const onunHandleClearAll = (e) => {
        setSelectedBranch([]);
        setSelectedGrade([]);
        setHolidayName('');
        setHolidayDesc('');
        setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
        setStartDate()
        setEndDate()
        setDates()
        setSelectedCategory()
        formRef.current.setFieldsValue({
            branch: [],
            grade: [],
            date: [],
            category: ''
        })
        setHolidays([])
        setEvents([])
    };
    const handleAcademicYear = (event, value) => {
        if (value) {
            callApi(
                `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
                'branchList'
            );
        }
        setSelectedGrade([]);
        setSectionList([]);
        setSelectedSection([]);
        setSelectedBranch([]);
    };

    const handleSelectBranch = (value, arr, acad) => {
        console.log(value, arr, acad, formRef.current, 'value arr');
        if (value == 'all' && selectedBranch?.length == 0) {
            formRef.current.setFieldsValue({
                branch: arr,
            });
            setSelectedBranch(arr);
            setSelectedSession(acad)
            getGrades(arr)
        } else if (value == 'all' && selectedBranch?.length > 0) {
            formRef.current.setFieldsValue({
                branch: [],
            });
            setSelectedBranch([]);
            setSelectedSession([])
        }
        else {
            if (!selectedBranch.includes(value)) {
                setSelectedBranch([...selectedBranch, Number(value)]);
                getGrades([...selectedBranch, Number(value)])
            }
            if (selectedBranch.includes(value)) {
                let arrayy = selectedBranch.filter(item => item !== value)
                setSelectedBranch(arrayy);
                getGrades(arrayy)
            }

        }

    };

    const getGrades = (branch) => {
        console.log(branch, 'branchhhhgreade');
        if (branch && moduleId) {
            callApi(
                `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
                }&branch_id=${branch.toString()}&module_id=${moduleId}`,
                'gradeList'
            );
        }

    }
    const handleDeSelectBranch = (each) => {
        console.log(each);
        formRef.current.setFieldsValue({
            section: [],
            grade: []
        });
        const index = selectedBranch.indexOf(each?.value);
        const newBranchList = selectedBranch.slice();
        newBranchList.splice(index, 1);
        setSelectedBranch(newBranchList);
        console.log(newBranchList);
        if(newBranchList?.length > 0){
            getGrades(newBranchList)
        } else if(newBranchList?.length == 0){
            setGradeList([])
          }
    };



    const branchOptions = branchList?.map((each) => {
        return (
            <Option key={each?.id} value={each?.branch?.id}>
                {each?.branch?.branch_name}
            </Option>
        );
    });

    const gradeOptions = gradeList?.map((each) => {
        return (
            <Option key={each?.grade_id} value={each?.grade_id}>
                {each?.grade__grade_name}
            </Option>
        );
    });

    const handleDate = (value) => {
        console.log(value);
        if (value) {
            setStartDate(moment(value[0]).format('YYYY-MM-DD'))
            setEndDate(moment(value[1]).format('YYYY-MM-DD'))
            setDates([moment(value[0]), moment(value[1])])
        }
    }

    const handleDescription = (e) => {
        console.log(e.target.value);
        setHolidayDesc(e.target.value)
    }

    const handleGrade = (e) => {
        if (e) {
            setSelectedGrade(e);
        }
    };

    const handleClearGrade = () => {
        setSelectedGrade('');
    };

    const filterData = () => {
        let branches = branchList.filter(item => selectedBranch.includes(item?.branch?.id))
        let acad_session = branches?.map((item) => item?.id)
        console.log(acad_session);
        console.log(selectedBranch , selectedGrade , user_level, 'selected Branches');
        if (segment == 1) {
            if(startDate == undefined || endDate  == undefined || selectedBranch?.length == 0 || selectedGrade?.length == 0 ) {
                message.error('Please Select All Fields')
            } else {
                getHoliday({
                    session_year: acad_session.toString(),
                    grade: selectedGrade,
                    start_date: startDate,
                    end_date: endDate
                })
            }
        } else {
            if(startDate == undefined || endDate  == undefined || selectedBranch?.length == 0 || selectedGrade?.length == 0 ) {
                message.error('Please Select All Mandatory Fields')
            } else {
            getEvents({
                session_year_id: selectedAcademicYear?.id,
                acad_session: acad_session.toString(),
                grade: selectedGrade,
                start_date: startDate,
                end_date: endDate,
                level: user_level,
                event_category: selectedCategory
            })
        }
        }
    }

    const getHoliday = (params = {}) => {
        axiosInstance
            .get(
                `${endpoints.academics.getHoliday}`, {
                params: { ...params },
            }
            )
            .then((res) => {
                setLoading(false);
                console.log(res);
                setHolidays(res.data.holiday_detail)
            })
            .catch((error) => {
                setLoading(false);
            });
    }
    const getEvents = (params = {}) => {
        axiosInstance
            .get(
                `${endpoints.academics.getEvents}`, {
                params: { ...params },
            }
            )
            .then((res) => {
                setLoading(false);
                console.log(res);
                setEvents(res?.data?.Event_detail)
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const handleSegment = (e) => {
        setSegment(e)
        onunHandleClearAll()
        console.log(e);
    }

    useEffect(() => {
        console.log(history);
        if(history?.location?.state?.backButtonStatus == true){
            setSegment( history?.location?.state?.payload?.segment)
            history.replace()
        }
        console.log(segment);
    },[history])


    const handleDeleteHoliday = (item) => {
        console.log(item);
        axiosInstance
            .get(
                `${endpoints.academics.getHoliday}?holiday_id=${item?.id}&session_year=${selectedAcademicYear?.id}`
            )
            .then((res) => {
                message.success('Holiday Deleted')
                filterData()
            })
            .catch((error) => {
                message.error('Failed To Delete')
            });
    }

    const handleEditHoliday = (item) => {
        const payload = {
            academic_year_id: selectedAcademicYear,
            branch_id: selectedBranch,
            grade_id: selectedGrade,
            section_id: selectedSection,
            startDate: startDate,
            endDate: endDate,
            segment: segment,
        };

        history.push({
            pathname: '/holidaymarking',
            state: {
                data: item,
                payload: payload,
                acadId: item.acad_session,
                gradeId: item.grade,
                isEdit: true,
            },
        });
    };

    const handleEditEvent = (item) => {
        const payload = {
            academic_year_id: selectedAcademicYear,
            branch_id: selectedBranch,
            grade_id: selectedGrade,
            section_id: selectedSection,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            segment: segment,

        };

        history.push({
            pathname: '/eventmarking',
            state: {
                data: item,
                payload: payload,
                acadId: item?.acad_session,
                gradeId: item?.grades,
                isEdit: true,
                eventId: item.id,
            },
        });
    }

    const handleDeleteEvents = (item) => {
        axiosInstance
            .delete(
                `${endpoints.academics.getEvents}?id=${item?.id}`
            )
            .then((res) => {
                message.success('Event Deleted')
                filterData()
            })
            .catch((error) => {
                message.error('Failed To Delete')
            });
    };

    const handleAddEvent = () => {
        const payload = {
            academic_year_id: selectedAcademicYear,
            branch_id: selectedBranch,
            grade_id: selectedGrade,
            section_id: selectedSection,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            segment: segment,

        };

        history.push({
            pathname: '/eventmarking',
            state: {
                payload: payload,
                isEdit: false,
            },
        });
    };

    const handleMarkHoliday = () => {
        const payload = {
            academic_year_id: selectedAcademicYear,
            branch_id: selectedBranch,
            grade_id: selectedGrade,
            section_id: selectedSection,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            segment: segment,

        };

        history.push({
            pathname: '/holidaymarking',
            state: {
                payload: payload,
                isEdit: false,
            },
        });
    };


    const titleHeadHoliday = (item) => {
        return (<div style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Tooltip title={item?.title}>
                <div className='titleCardHoliday' >{item?.title}</div>
            </Tooltip>
            <Popover
                content={() => handleAction(item)}
                trigger='click'
            >
                <Button icon={<EditOutlined />} />
            </Popover>
        </div>
        )
    }
    const handleAction = (item) => {
        console.log(item);
        return (<div>
            <p style={{ cursor: 'pointer' }} onClick={() => handleEditHoliday(item)}>Edit</p>
            <Divider />
            <p style={{ cursor: 'pointer' }} onClick={() => handleDeleteHoliday(item)}>Delete</p>
        </div>)
    }

    const titleHeadEvent = (item) => {
        return (<div style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Tooltip title={item?.title}>
                <div className='titleCardHoliday' >{item?.event_name}</div>
            </Tooltip>
            <Popover
                content={() => handleActionEvent(item)}
                trigger='click'
            >
                <Button icon={<EditOutlined />} />
            </Popover>
        </div>
        )
    }
    const handleActionEvent = (item) => {
        console.log(item);
        return (<div>
            <p style={{ cursor: 'pointer' }} onClick={() => handleEditEvent(item)}>Edit</p>
            <Divider />
            <p style={{ cursor: 'pointer' }} onClick={() => handleDeleteEvents(item)}>Delete</p>
        </div>)
    }

    const historyData = history?.location?.state?.payload
    const handleTooltip = (item) => {
        return <div style={{maxHeight: '30vh' , overflowX: 'scroll' , overflowX: 'hidden'}} >
            {item}
        </div>
    }

    return (
        <>
            <Layout className='CalendarAttendanceV2' >
                <div className='row py-3 px-2'>

                    <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
                        <Breadcrumb separator='>'>
                            <Breadcrumb.Item className='th-grey'>
                                Calendar
                            </Breadcrumb.Item>
                            {user_level == 13 ?
                                <Breadcrumb.Item className='th-black-1'>
                                    Student Calendar
                                </Breadcrumb.Item>
                                :
                                <Breadcrumb.Item className='th-black-1'>
                                    Teacher Calendar
                                </Breadcrumb.Item>}
                        </Breadcrumb>
                    </div>


                    {loading && <Loader />}

                    <div className='row'>
                        <div className='col-12'>
                            <div className='th-tabs th-bg-white'>
                                <Tabs type='card' onChange={handleSegment} activeKey={segment} >
                                    <TabPane tab='Holiday' key={'1'}>
                                        <div className='cardsevents' >
                                            <Form ref={formRef} style={{ width: '100%' }} >
                                                <Grid container direction='row' spacing={2} className={classes.root}>

                                                    <div className='col-md-3'>
                                                        <span className=' th-14 font-weight-bold th-grey'>Branch*</span>
                                                        <Form.Item name='branch'>
                                                            <Select
                                                                mode='multiple'
                                                                getPopupContainer={(trigger) => trigger.parentNode}
                                                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                                                placement='bottomRight'
                                                                placeholder="Select Branch"
                                                                showArrow={true}
                                                                suffixIcon={<DownOutlined className='th-grey' />}
                                                                maxTagCount={2}
                                                                value={selectedBranch}
                                                                dropdownMatchSelectWidth={false}
                                                                onSelect={(e) => {
                                                                    handleSelectBranch(
                                                                        e,
                                                                        branchList?.map((item) => item.branch?.id),
                                                                        branchList?.map((item) => item?.id),
                                                                    );
                                                                }}
                                                                onDeselect={(e, value) => {
                                                                    handleDeSelectBranch(value);
                                                                }}
                                                                filterOption={(input, options) => {
                                                                    return (
                                                                        options.children
                                                                            .toLowerCase()
                                                                            .indexOf(input.toLowerCase()) >= 0
                                                                    );
                                                                }}
                                                            >
                                                                {branchList?.length > 0 && (
                                                                    <>
                                                                        <Option key={0} value={'all'}>
                                                                            All
                                                                        </Option>
                                                                    </>
                                                                )}
                                                                {branchOptions}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <span className='th-14 font-weight-bold th-grey'>Grades*</span>
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
                                                                    handleGrade(e);
                                                                }}
                                                                onClear={handleClearGrade}
                                                                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                                            >
                                                                {gradeOptions}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>

                                                    <div className='col-md-3'>
                                                        <span className='font-weight-bold th-14 th-grey'>Select Date Range*</span>
                                                        <Form.Item name='date'>
                                                            <RangePicker
                                                                value={dates}
                                                                onChange={handleDate}
                                                            />
                                                        </Form.Item>
                                                    </div>

                                                    <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={filterData} >
                                                        <Button 
                                                          type='primary'
                                                          className='th-br-6 th-bg-primary th-pointer th-white'>Filter</Button>
                                                    </div>
                                                    {user_level != 13 ?
                                                        <>
                                                            <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={handleMarkHoliday} >
                                                                <Button
                                                                    type='primary'
                                                                    className='th-br-6 th-bg-primary th-pointer th-white'
                                                                >Add Holiday</Button>
                                                            </div>
                                                            {/* <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={handleAddEvent} >
                                                                <Button>Add Event</Button>
                                                            </div> */}
                                                        </> : ''}
                                                </Grid>

                                            </Form>

                                            {
                                                holidays?.length > 0 ?
                                                    holidays?.map((item) => (
                                                        <>
                                                            <div className='col-lg-4 col-md-6 mt-2'>
                                                                <div
                                                                    className='th-br-20 th-bg-grey period-card'
                                                                    style={{ border: '1px solid #d9d9d9' }}
                                                                >
                                                                    <div
                                                                        className='row p-3 th-bg-pink align-items-center th-black-1'
                                                                        style={{ borderRadius: '20px 20px 0 0' }}
                                                                    >
                                                                        <div className='col-8 pl-0 text-truncate' style={{ display: 'flex', alignItems: 'center' }} >
                                                                            <img
                                                                                src={HolidayIcon}
                                                                                height='30'
                                                                                className='mb-1'
                                                                                alt='icon'
                                                                            />
                                                                            <Tooltip
                                                                                placement='topLeft'
                                                                                title={item?.title}
                                                                            >
                                                                                <span className='th-18 th-fw-700 ml-2 text-capitalize'>
                                                                                    {item?.title}
                                                                                </span>
                                                                            </Tooltip>
                                                                        </div>
                                                                        <div className='col-4 px-0 th-16 text-right th-fw-700 text-truncate'>
                                                                            <Popover
                                                                                content={() => handleAction(item)}
                                                                                trigger='click'
                                                                            >
                                                                                <Button icon={<MoreOutlined />} />
                                                                            </Popover>
                                                                        </div>
                                                                    </div>

                                                                    <div className='row pl-2 pt-4'>
                                                                        <div className='th-fw-600 col-2 px-0'>
                                                                            <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                                                                                Date :
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-8 text-truncate px-3'>
                                                                            {`${moment(item?.holiday_start_date).format('DD-MM-YYYY')} - ${moment(item?.holiday_end_date).format('DD-MM-YYYY')}`}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className='row pl-2 pt-1 d-flex justify-content-between'
                                                                        style={{
                                                                            height: 60,
                                                                        }}
                                                                    >
                                                                        <div className='th-fw-600 col-4 px-0'>
                                                                            <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                                                                                Description :
                                                                            </div>
                                                                        </div>
                                                                        <Tooltip
                                                                            placement='topLeft'
                                                                            // title={item?.description}
                                                                            title={handleTooltip(item?.description)}
                                                                        >
                                                                            {item?.description ? (
                                                                                <div className='col-8 pl-2 th-truncate'>
                                                                                    <div>
                                                                                        <div className='text-truncate text-capitalize mt-1 px-2 mx-3'>
                                                                                            {item?.description},
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                        </Tooltip>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </>
                                                    )) : <div style={{ width: '100%' }}> <Empty /></div>
                                            }
                                        </div>
                                    </TabPane>
                                    <TabPane tab='Events' key={'2'}>
                                        <div className='cardsevents' >
                                            <Form ref={formRef} style={{ width: '100%' }} >
                                                <Grid container direction='row' spacing={2} className={classes.root}>

                                                    <div className='col-md-3'>
                                                        <span className='font-weight-bold th-grey th-14'>Branch*</span>
                                                        <Form.Item name='branch'>
                                                            <Select
                                                                mode='multiple'
                                                                getPopupContainer={(trigger) => trigger.parentNode}
                                                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                                                placement='bottomRight'
                                                                placeholder="Select Branch"
                                                                showArrow={true}
                                                                suffixIcon={<DownOutlined className='th-grey' />}
                                                                maxTagCount={2}
                                                                value={selectedBranch}
                                                                dropdownMatchSelectWidth={false}
                                                                onSelect={(e) => {
                                                                    handleSelectBranch(
                                                                        e,
                                                                        branchList?.map((item) => item.branch?.id),
                                                                        branchList?.map((item) => item?.id),
                                                                    );
                                                                }}
                                                                onDeselect={(e, value) => {
                                                                    handleDeSelectBranch(value);
                                                                }}
                                                                filterOption={(input, options) => {
                                                                    return (
                                                                        options.children
                                                                            .toLowerCase()
                                                                            .indexOf(input.toLowerCase()) >= 0
                                                                    );
                                                                }}
                                                            >
                                                                {branchList?.length > 0 && (
                                                                    <>
                                                                        <Option key={0} value={'all'}>
                                                                            All
                                                                        </Option>
                                                                    </>
                                                                )}
                                                                {branchOptions}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <span className='font-weight-bold th-grey th-14'>Grades*</span>
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
                                                                    handleGrade(e);
                                                                }}
                                                                onClear={handleClearGrade}
                                                                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                                            >
                                                                {gradeOptions}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>

                                                    <div className='col-md-3'>
                                                        <span className='font-weight-bold th-grey th-14'>Select Date Range*</span>
                                                        <Form.Item name='date'>
                                                            <RangePicker
                                                                value={dates}
                                                                onChange={handleDate}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <span className='font-weight-bold th-grey th-14'>Category*</span>
                                                        <Form.Item name='category'>
                                                            <Select
                                                                allowClear
                                                                placeholder='Select Category'
                                                                showSearch
                                                                optionFilterProp='children'
                                                                filterOption={(input, options) => {
                                                                    return (
                                                                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    );
                                                                }}
                                                                onChange={(e) => {
                                                                    handleCategory(e);
                                                                }}
                                                                // onClear={handleClearGrade}
                                                                className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                                            >
                                                                {categoryOptions}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>

                                                    <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={filterData} >
                                                        <Button
                                                          type='primary'
                                                          className='th-br-6 th-bg-primary th-pointer th-white'>Filter</Button>
                                                    </div>
                                                    {user_level != 13 ?
                                                        <>
                                                            {/* <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={handleMarkHoliday} >
                                                                <Button>Add Holiday</Button>
                                                            </div> */}
                                                            <div className='col-md-1' style={{ display: 'flex', alignItems: 'center' }} onClick={handleAddEvent} >
                                                                <Button
                                                                type='primary'
                                                                className='th-br-6 th-bg-primary th-pointer th-white'
                                                                >Add Event</Button>
                                                            </div>
                                                        </> : ''}
                                                </Grid>
                                            </Form>
                                            {
                                                events?.length > 0 ?
                                                    events?.map((item) => (
                                                        <>
                                                            <div className='col-lg-4 col-md-6 pl-0 mt-2'>
                                                                <div
                                                                    className='th-br-20 th-bg-grey period-card'
                                                                    style={{ border: '1px solid #d9d9d9' }}
                                                                >
                                                                    <div
                                                                        className='row p-3 th-bg-pink align-items-center th-black-1'
                                                                        style={{ borderRadius: '20px 20px 0 0' }}
                                                                    >
                                                                        <div className='col-8 pl-0 text-truncate' style={{ display: 'flex', alignItems: 'center' }} >
                                                                            <img
                                                                                src={EventIcon}
                                                                                height='30'
                                                                                className='mb-1'
                                                                                alt='icon'
                                                                            />
                                                                            <Tooltip
                                                                                placement='topLeft'
                                                                                title={item?.event_name}
                                                                            >
                                                                                <span className='th-18 th-fw-700 ml-2 text-capitalize'>
                                                                                    {item?.event_name}
                                                                                </span>
                                                                            </Tooltip>
                                                                        </div>
                                                                        <div className='col-4 px-0 th-16 text-right th-fw-700 text-truncate'>
                                                                            {item?.event_category_name ? <Badge count={item?.event_category_name} style={{ marginRight: '8%' }} /> : ''}
                                                                            {item?.is_enabled ?
                                                                                <Popover
                                                                                    content={() => handleActionEvent(item)}
                                                                                    trigger='click'
                                                                                >
                                                                                    <Button icon={<MoreOutlined />} />
                                                                                </Popover>
                                                                                : ''}
                                                                        </div>
                                                                    </div>

                                                                    <div className='row pl-2 pt-4'>
                                                                        <div className='th-fw-600 col-2 px-0'>
                                                                            <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                                                                                Date :
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-8 text-truncate px-3'>
                                                                            {`${moment(item?.start_time).format('DD-MM-YYYY')} - ${moment(item?.end_time).format('DD-MM-YYYY')}`}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className='row pl-2 pt-1 d-flex justify-content-between'
                                                                        style={{
                                                                            height: 60,
                                                                        }}
                                                                    >
                                                                        <div className='th-fw-600 col-4 px-0'>
                                                                            <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                                                                                Description :
                                                                            </div>
                                                                        </div>
                                                                        <Tooltip
                                                                            placement='topLeft'
                                                                            title={handleTooltip(item?.description)}
                                                                        >
                                                                            {item?.description ? (
                                                                                <div className='col-8 pl-2 th-truncate'>
                                                                                    <div>
                                                                                        <div className='text-truncate px-2 text-capitalize'>
                                                                                            {item?.description},
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                        </Tooltip>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </>
                                                    )) : <div style={{ width: '100%' }}> <Empty /></div>
                                            }
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>


                </div>
            </Layout>
        </>
    );
};

export default CalendarV2;
