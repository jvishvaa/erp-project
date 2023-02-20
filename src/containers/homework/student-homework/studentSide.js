import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import {
    message, Tabs, Badge, Drawer, Form, DatePicker, Breadcrumb, Divider, Button,
    Empty,
    Tooltip
} from 'antd';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import {
    fetchCoordinateTeacherHomeworkDetails,
    setSelectedHomework,
    fetchStudentsListForTeacherHomework,
    setTeacherUserIDCoord,
    setSelectedCoFilters,
    resetSelectedCoFilters,
} from '../../../redux/actions';
import Layout from 'containers/Layout';
import axiosInstance from 'config/axios';
import './studentSide.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import {
    CloseCircleOutlined, LeftOutlined, RightOutlined, EditOutlined,
    DownOutlined, CalendarOutlined, MoreOutlined
} from '@ant-design/icons';
import Atachment from 'assets/images/attachmenticon.svg';
import HomeworkSubmissionNew from './studenthwsubmission';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const StudentHomeworkNew = withRouter(({
    getCoordinateTeacherHomeworkDetails,
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
    selectedTeacherByCoordinatorToCreateHw,
    setFirstTeacherUserIdOnloadCordinatorHomewok,
    absentList,
    ...props }) => {
    const [dates, setDates] = useState(null);
    const [value, setValue] = useState(null);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [segment, setSegment] = useState('1')

    const [pending, setPending] = useState([])
    const [pendingData, setPendingData] = useState([])
    const [today, setToday] = useState([])
    const [submit, setSubmit] = useState([])
    const [submitData, setSubmitData] = useState([])
    const [evaluated, setEvaluated] = useState([])
    const [evaluatedData, setEvaluatedData] = useState([])
    const history = useHistory();
    const [hwSelect, setHwSelect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [homeworkSubmission, setHomeworkSubmission] = useState({
        isOpen: false,
        subjectId: '',
        date: '',
        subjectName: '',
        status: 1,
        isEvaluated: false,
    });

    const [todaySubject, setTodaySubject] = useState([])
    const [pendingSubject, setPendingSubject] = useState([])
    const [submitSubject, setSubmitSubject] = useState([])
    const [evaluatedSubject, setEvaluatedSubject] = useState([])
    const [SubjectSelected, setSubjectSelected] = useState('all')
    const [dueDate, setDeuDate] = useState()

    const [subjectList, setSubjectList] = useState([])

    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
    const acad_session_id = selectedBranch?.id
    const formRef = createRef();

    const handleSegment = (e) => {
        setSegment(e)
    }
    useEffect(() => {
        console.log(dates);
        if (dates != null) {
            handleDate(dates)
        }
    }, [dates])

    const handleDate = (value) => {
        console.log(value);
        if (value[0] != null) {
            setStartDate(moment(value[0]).format('YYYY-MM-DD'))
            setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        }
    }


    console.log(acad_session_id, 'acadd');
    const dateToday = moment()
    const startDay = moment().subtract(1, "w")
    const dateFrom = moment().subtract(3, 'd')
    const dateTo = moment().add(3, 'd')

    console.log(startDay, 'start');
    useEffect(() => {
        setDates([moment(dateFrom), moment(dateTo)])
        formRef.current.setFieldsValue({
            date: [moment(dateFrom), moment(dateTo)]
        })
        setStartDate(moment(dateFrom).format('YYYY-MM-DD'))
        setEndDate(moment(dateTo).format('YYYY-MM-DD'))
        getSubject({
            acad_session_id: acad_session_id
        })
    }, [])

    useEffect(() => {
        if (acad_session_id && endDate != undefined && endDate != 'Invalid date') {
            console.log(acad_session_id, endDate, 'acadd');

            if (SubjectSelected == 'all') {

                console.log(acad_session_id, 'acadd');
                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate
                })
                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
            }
            if (SubjectSelected != 'all') {
                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate,
                    subject_id: SubjectSelected?.id
                })


                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
            }
        }
    }, [acad_session_id, endDate])

    useEffect(() => {
        if (acad_session_id && endDate != undefined && endDate != 'Invalid date' && hwSelect == false) {
            if (SubjectSelected == 'all') {

                console.log(acad_session_id, 'acadd');
                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate
                })
                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
            }
            if (SubjectSelected != 'all') {
                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate,
                    subject_id: SubjectSelected?.id
                })


                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: SubjectSelected?.id
                    })
                }
            }
        }
    }, [hwSelect, segment])

    const getSubject = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.subjectListStudent}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                }
            })
            .then((res) => {
                console.log(res);
                setSubjectList(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getTodayshw = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.todaysHomework}`, {
                params: { ...params },
                // headers: {
                //     'X-DTS-Host': X_DTS_HOST,
                // }
            })
            .then((res) => {
                console.log(res);
                setToday(res.data.result)
                setTodaySubject(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getPendingshw = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.pendingHomework}`, {
                params: { ...params },
                // headers: {
                //     'X-DTS-Host': X_DTS_HOST,
                // }
            })
            .then((res) => {
                console.log(res);
                setPending(res.data.result)
                setPendingSubject(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getSubmitshw = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.submittedHomework}`, {
                params: { ...params },
                // headers: {
                //     'X-DTS-Host': X_DTS_HOST,
                // }
            })
            .then((res) => {
                console.log(res);
                setSubmit(res.data.result)
                setSubmitSubject(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getEvaluatedshw = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.evaluatedHomework}`, {
                params: { ...params },
                // headers: {
                //     'X-DTS-Host': X_DTS_HOST,
                // }
            })
            .then((res) => {
                console.log(res);
                setEvaluated(res.data.result)
                setEvaluatedSubject(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

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
    let hwData = pending?.data
    let hwKeys = [];
    let allData = []
    useEffect(() => {
        console.log(hwData);
        if (hwData != undefined) {
            console.log(Object.keys(hwData), 'pen')
            hwKeys = Object.keys(hwData)
            let tempData = hwKeys?.map((item) => {
                let arr = hwData[item]?.map((each) => {
                    allData.push(each)
                })
            })
            console.log(allData, 'all');
            setPendingData(allData)
        }
    }, [hwData])

    //submit data

    let submitDataObj = submit?.data
    let submitKeys = [];
    let allSubmitData = []
    useEffect(() => {
        if (submitDataObj != undefined) {
            console.log(Object.keys(submitDataObj), 'pen')
            submitKeys = Object.keys(submitDataObj)
            let tempSubData = submitKeys?.map((item) => {
                let arr = submitDataObj[item]?.map((each) => {
                    allSubmitData.push(each)
                })
            })
            console.log(allSubmitData, 'all');
            setSubmitData(allSubmitData)
        }
    }, [submitDataObj])

    //evaluated on
    let evaDataObj = evaluated?.data
    let evaKeys = [];
    let allevaData = []
    useEffect(() => {
        if (evaDataObj != undefined) {
            console.log(Object.keys(evaDataObj), 'pen')
            evaKeys = Object.keys(evaDataObj)
            let tempSubData = evaKeys?.map((item) => {
                let arr = evaDataObj[item]?.map((each) => {
                    allevaData.push(each)
                })
            })
            console.log(allevaData, 'all');
            setEvaluatedData(allevaData)
        }
    }, [evaDataObj])

    const getTabName = (key) => {
        console.log(key, "key");
        return <div>
            {key == 1 ? <div className='row justify-content-between'>
                <div className='th-14'>Today's Assigned</div>
                <div className='th-13 th-br-30 mx-2 countC' style={{ color: 'white', background: '#7350ff', width: '25px', height: '25px', padding: '3px' }} >{today?.data?.length}</div>
            </div> : key == 2 ?
                < div className='row justify-content-between'>
                    <div className='th-14'>Pending</div>
                    <div className='th-13 th-br-30 mx-2 countC' style={{ color: 'white', background: '#DFB340', width: '25px', height: '25px', padding: '3px' }} >{today?.hw_status?.pending}</div>
                </div>
                : key == 3 ?
                    < div className='row justify-content-between'>
                        <div className='th-14'>Submitted</div>
                        <div className='th-13 th-br-30 mx-2 countC' style={{ color: 'white', background: '#5DBC7E', width: '25px', height: '25px', padding: '3px' }} >{today?.hw_status?.submitted}</div>
                    </div> : key == 4 ?
                        < div className='row justify-content-between'>
                            <div className='th-14'>Evaluated</div>
                            <div className='th-13 th-br-30 mx-2 countC' style={{ color: 'white', background: '#56ABFF', width: '25px', height: '25px', padding: '3px' }} >{today?.hw_status?.evaluated}</div>
                        </div> : ''
            }
        </div >
    }

    const viewanalytics = () => {
        history.push('/student-analytics')
    }

    const handleHw = (item, tab) => {
        console.log(item);
        setDeuDate(item?.last_submission_dt)
        setHwSelect(true)
        if (tab == 1 || tab == 2) {

            setHomeworkSubmission({
                isOpen: true,
                homeworkId: item?.id,
                date: moment(item?.uploaded_at).format('DD-MM-YYYY'),
                subjectName: item?.subject__subject_name,
                status: 1,
                isEvaluated: false,
            });
        } else {
            setHomeworkSubmission({
                isOpen: true,
                homeworkId: item?.homework_id,
                date: item?.uploaded_date,
                subjectName: item?.homework__subject__subject_name,
                status: tab == 4 ? 3 : 2,
                isEvaluated: tab == 4 ? true : false,
            });
        }
    }

    const goback = () => {
        history.push('/homework/student')
    }

    const handleSubjectFilter = (sub) => {
        setSubjectSelected(sub)

        console.log(sub, pendingData, submitData, evaluatedData);
        if (sub != 'all') {
            if (acad_session_id && endDate != undefined && hwSelect == false) {
                console.log(acad_session_id, 'acadd');
                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate,
                    subject_id: sub?.id
                })


                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: sub?.id
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: sub?.id
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate,
                        subject_id: sub?.id
                    })
                }
            }
        }
        if (sub == 'all') {
            if (acad_session_id && endDate != undefined && hwSelect == false) {
                console.log(acad_session_id, 'acadd');

                getTodayshw({
                    acad_session_id: acad_session_id,
                    start_date: startDate,
                    end_date: endDate
                })
                if (segment == 2) {

                    getPendingshw({
                        acad_session_id: acad_session_id,
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 3) {

                    getSubmitshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
                if (segment == 4) {

                    getEvaluatedshw({
                        start_date: startDate,
                        end_date: endDate
                    })
                }
            }
        }
    }

    return (
        <>
            <Layout>
                <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
                    <Breadcrumb separator='>'>
                        <Breadcrumb.Item
                            className='th-grey th-16 th-pointer'
                            onClick={() => goback()}
                        >
                            Homework
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className='th-black-1 th-16'>
                            Student Homework
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Divider />
                {hwSelect == false ?
                    <>
                        <Form ref={formRef} style={{ width: '90%', display: 'flex', margin: '0 auto' }} direction='row' >
                            <div className='col-md-3 p-0'>
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
                        </Form>
                        <div style={{ width: '90%', margin: '0 auto' }} className='d-flex justify-content-between' >
                            <div className='col-md-8 my-4 p-0' >
                                <Button onClick={() => handleSubjectFilter('all')} className={`${SubjectSelected == 'all' ? 'th-button-active' : 'th-button'
                                    }  th-pointer m-1 th-br-5`}>All Subject</Button>
                                    {subjectList?.map((sub) => (
                                        <Button
                                            className={`${sub?.id == SubjectSelected?.id ? 'th-button-active' : 'th-button'
                                                } th-pointer m-1 th-br-5`}

                                            onClick={() => handleSubjectFilter(sub)}>{sub?.subject_name}</Button>
                                    ))}
                            </div>
                            <div className='col-md-4 mt-4 justify-content-end d-flex'>
                                <Button onClick={viewanalytics} style={{ background: '#F19325', color: 'white' }} >View Analytics</Button>
                            </div>
                        </div>
                        <div className='card studentHome' style={{ width: '90%', margin: '0 auto', minHeight: '500px' }} >
                            <div>
                                <Tabs onChange={handleSegment} activeKey={segment} style={{ fontSize: '10px', fontWeight: '400' }} tabPosition='left'  >
                                    <TabPane tab={getTabName(1)} key={'1'} className='p-0' >
                                        <div>
                                            {today?.data?.length > 0 ?
                                                <div>
                                                    <div className='col-md-12 d-flex justify-content-end th-14 th-fw-500' style={{ color: '#4F4F4F', padding: '10px' }} >{today?.no_of_home_works} Homework Assigned</div>
                                                    <Divider className='my-2' />
                                                    <div className='d-flex flex-wrap p-3' style={{ height: '500px', overflow: 'hidden', overflowY: 'scroll' }}  >
                                                        {today?.data?.map((item) => (
                                                            <div className='col-md-4 p-1'>
                                                                <div className='card w-100' >
                                                                    <div className='row d-flex justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }}>
                                                                        <Tooltip title={item?.subject__subject_name}>
                                                                            <p className='th-14 th-fw-600 m-0 text-truncate' style={{ width: '40%' }} >{item?.subject__subject_name}</p>
                                                                        </Tooltip>
                                                                        <div className='th-11 th-fw-400 d-flex align-items-center' style={{ color: '#EE6065' }}>Due Date : {moment(item?.last_submission_dt).format('DD-MM-YYYY')}</div>
                                                                    </div>
                                                                    {item?.has_submitted == true ? <div className='p-1 row justify-content-between' style={{ background: '#F8FAFC', width: '90%', margin: '0 auto' }} >
                                                                        <div className='th-14 th-fw-600 col-md-2 px-0'>Title:</div>
                                                                        <Tooltip title={item?.homework_name}>
                                                                            <div className='th-14 w-50 text-truncate'>{item?.homework_name}</div>
                                                                        </Tooltip>
                                                                        <div style={{ color: '#5EBC7E' }} className='th-13' >Submitted</div>
                                                                    </div> :
                                                                        <div className='p-1 row justify-content-between' style={{ background: '#F8FAFC', width: '90%', margin: '0 auto', cursor: 'pointer' }} onClick={() => handleHw(item, segment)}>
                                                                            <div className='th-14 th-fw-600 col-md-2 px-0'>Title:</div>
                                                                            <Tooltip title={item?.homework_name}>
                                                                                <div className='th-14 w-50 text-truncate'>{item?.homework_name}</div>
                                                                            </Tooltip>
                                                                            <RightOutlined className='th-14 col-md-2' style={{ color: '#8D8D8D' }} />
                                                                        </div>
                                                                    }
                                                                    <Divider />
                                                                    <div className='row justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }} >
                                                                        <div >
                                                                            <div className='th-11'>Created By </div>
                                                                            <div className='th-11 th-fw-600'>{item?.created_by_staff__erpusers__name} {moment(item?.uploaded_at).format('DD-MM-YYYY hh:mm A')}</div>
                                                                        </div>
                                                                        {/* <div >
                                                                            <img src={Atachment} style={{ width: '25px', transform: 'rotate(25deg)' }} />
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                : <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Empty /> </div>}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={getTabName(2)} key={'2'} className='p-0'>
                                        <div>
                                            {pendingData?.length > 0 ?
                                                <div>
                                                    <div className='col-md-12 d-flex justify-content-end th-14 th-fw-500' style={{ color: '#4F4F4F', padding: '10px' }} >{pending?.no_of_home_works} Homework Pending</div>
                                                    <Divider className='my-2' />
                                                    <div className='d-flex flex-wrap p-3' style={{ height: '500px', overflow: 'hidden', overflowY: 'scroll' }} >
                                                        {pendingData?.map((item) => (
                                                            <div className='col-md-4 p-1'>
                                                                <div className='card w-100' >
                                                                    <div className='row d-flex justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }}>
                                                                        <Tooltip title={item?.subject__subject_name}>
                                                                            <p className='th-14 th-fw-600 m-0 text-truncate' style={{ width: '40%' }} >{item?.subject__subject_name}</p>
                                                                        </Tooltip>
                                                                        {moment(item?.last_submission_dt).isBefore(moment(), 'day') == true ?
                                                                            <div style={{ background: '#EE5651', color: 'white', borderRadius: '5px', padding: '3px', height: '40px', maxHeight: '40px' }}>
                                                                                <div className='th-10 th-fw-400 d-flex align-items-center'>Not Submitted</div>
                                                                                <div className='th-10 th-fw-400 d-flex align-items-center'>Due Date : {moment(item?.last_submission_dt).format('DD-MM-YYYY')}</div>
                                                                            </div> :
                                                                            <div className='th-11 th-fw-400 d-flex align-items-start' style={{ color: '#EE6065', height: '40px', maxHeight: '40px' }}>Due Date : {moment(item?.last_submission_dt).format('DD-MM-YYYY')}</div>
                                                                        }
                                                                    </div>
                                                                    <div className='p-1 row justify-content-between' style={{ background: '#F8FAFC', width: '90%', margin: '0 auto', cursor: 'pointer' }} onClick={() => handleHw(item, segment)} >
                                                                        <Tooltip title={item?.homework_name}>
                                                                            <div className='th-14 text-truncate w-75'>Title:{item?.homework_name}</div>
                                                                        </Tooltip>
                                                                        <RightOutlined className='th-14' style={{ color: '#8D8D8D' }} />
                                                                    </div>
                                                                    <Divider />
                                                                    <div className='row justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }} >
                                                                        <div >
                                                                            <div className='th-11'>Created By </div>
                                                                            <div className='th-11 th-fw-600'>{item?.created_by_staff__erpusers__name} {moment(item?.uploaded_at).format('DD-MM-YYYY hh:mm A')}</div>
                                                                        </div>
                                                                        {/* <div >
                                                                            <img src={Atachment} style={{ width: '25px', transform: 'rotate(25deg)' }} />
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                : <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Empty /> </div>}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={getTabName(3)} key={'3'} className='p-0'>
                                        <div>
                                            {submitData?.length > 0 ?
                                                <div>
                                                    <div className='col-md-12 d-flex justify-content-end th-14 th-fw-500' style={{ color: '#4F4F4F', padding: '10px' }} >{submit?.no_of_home_works} Homework Submitted</div>
                                                    <Divider className='my-2' />
                                                    <div className='d-flex flex-wrap p-3' style={{ height: '500px', overflow: 'hidden', overflowY: 'scroll' }}  >
                                                        {submitData?.map((item) => (
                                                            <div className='col-md-4 p-1'>
                                                                <div className='card w-100' >
                                                                    <div className='row d-flex justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }}>
                                                                        <Tooltip title={item?.homework__subject__subject_name} >
                                                                            <p className='th-14 th-fw-600 m-0 text-truncate' style={{ width: '40%' }} >{item?.homework__subject__subject_name}</p>
                                                                        </Tooltip>
                                                                        <div className='d-flex'>
                                                                            <div className='th-11 th-fw-400 d-flex align-items-center' style={{ color: '#5EBC7E' }}>Submitted On : </div>
                                                                            <div className='th-11 th-fw-400 d-flex align-items-center' style={{ color: '#626161' }}>{moment(item?.submitted_at).format('DD-MM-YYYY')}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='p-1 row justify-content-between' style={{ background: '#F8FAFC', width: '90%', margin: '0 auto', cursor: 'pointer' }} onClick={() => handleHw(item, segment)}>
                                                                        <Tooltip title={item?.homework__homework_name}>
                                                                            <div className='th-14 text-truncate w-75'>Title:{item?.homework__homework_name}</div>
                                                                        </Tooltip>
                                                                        <RightOutlined className='th-14' style={{ color: '#8D8D8D' }} />
                                                                    </div>
                                                                    <Divider />
                                                                    <div className='row justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }} >
                                                                        <div >
                                                                            <div className='th-11'>Created By </div>
                                                                            <div className='th-11 th-fw-600'>{item?.homework__created_by_staff__erpusers__name} {moment(item?.homework__uploaded_at).format('DD-MM-YYYY hh:mm A')}</div>
                                                                        </div>
                                                                        {/* <div >
                                                                            <img src={Atachment} style={{ width: '25px', transform: 'rotate(25deg)' }} />
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                : <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Empty /> </div>}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={getTabName(4)} key={'4'} className='p-0' >
                                        <div>
                                            {evaluatedData?.length > 0 ?
                                                <div>
                                                    <div className='col-md-12 d-flex justify-content-end th-14 th-fw-500' style={{ color: '#4F4F4F', padding: '10px' }} >{evaluated?.no_of_home_works} Homework Evaluated</div>
                                                    <Divider className='my-2' />
                                                    <div className='d-flex flex-wrap p-3' style={{ height: '500px', overflow: 'hidden', overflowY: 'scroll' }}  >
                                                        {evaluatedData?.map((item) => (
                                                            <div className='col-md-4 p-1'>
                                                                <div className='card w-100' >
                                                                    <div className='row d-flex justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }}>
                                                                        <Tooltip title={item?.homework__subject__subject_name} >
                                                                            <p className='th-14 th-fw-600 m-0 text-truncate' style={{ width: '40%' }} >{item?.homework__subject__subject_name}</p>
                                                                        </Tooltip>
                                                                        <div className='d-flex'>
                                                                            <div className='th-11 th-fw-400 d-flex align-items-center' style={{ color: '#56ABFF' }}>Evaluated On : </div>
                                                                            <div className='th-11 th-fw-400 d-flex align-items-center' style={{ color: '#626161' }}>{moment(item?.submitted_at).format('DD-MM-YYYY')}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='p-1 row justify-content-between' style={{ background: '#F8FAFC', width: '90%', margin: '0 auto', cursor: 'pointer' }} onClick={() => handleHw(item, segment)}>
                                                                        <Tooltip title={item?.homework__homework_name}>
                                                                            <div className='th-14 text-truncate w-75'>Title:{item?.homework__homework_name}</div>
                                                                        </Tooltip>
                                                                        <RightOutlined className='th-14' style={{ color: '#8D8D8D' }} />
                                                                    </div>
                                                                    <Divider />
                                                                    <div className='row justify-content-between p-1' style={{ width: '99%', margin: '0 auto' }} >
                                                                        <div >
                                                                            <div className='th-11'>Created By </div>
                                                                            <div className='th-11 th-fw-600'>{item?.homework__created_by_staff__erpusers__name} {moment(item?.homework__uploaded_at).format('DD-MM-YYYY hh:mm A')}</div>
                                                                        </div>
                                                                        {/* <div >
                                                                            <img src={Atachment} style={{ width: '25px', transform: 'rotate(25deg)' }} />
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                : <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Empty /> </div>}
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <HomeworkSubmissionNew
                            homeworkSubmission={homeworkSubmission} setHomeworkSubmission={setHomeworkSubmission} setHwSelect={setHwSelect} setLoading={setLoading} dueDate={dueDate} setDeuDate={setDeuDate}
                        />
                    </>}
            </Layout >

        </>
    )
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
});
export default connect(mapStateToProps, mapDispatchToProps)(StudentHomeworkNew);