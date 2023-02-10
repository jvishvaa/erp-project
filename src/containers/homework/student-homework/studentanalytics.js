import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import {
    message, Tabs, Badge, Drawer, Form, DatePicker, Breadcrumb, Divider, Button, Progress, Select,
    Empty
} from 'antd';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import endpoints from 'config/endpoints';
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
import { Bar } from '@ant-design/plots';
import {
    CloseCircleOutlined, LeftOutlined, RightOutlined, EditOutlined,
    DownOutlined, CalendarOutlined, MoreOutlined
} from '@ant-design/icons';
import Atachment from 'assets/images/attachmenticon.svg'
import GroupedChart from './yearlyAnalytics';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const StudentAnalytics = withRouter(({
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
    history,
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

    const [ subject , setSubject ] = useState()
    const [data, setData] = useState([])
    const [curMonth, setCurMonth] = useState()
    const [curMonthOverall , setCurMonthOverall ] = useState()
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthData = []
    let tempData = month?.map((each, index) => {
        let obj = {
            month: each,
            id: index + 1
        }
        monthData.push(obj)
    })
    console.log(monthData);

    const monthOptions = monthData?.map((each) => {
        return (
            <Option key={each?.id} value={each?.id}>
                {each?.month}
            </Option>
        );
    });

    const subjectOptions = pending?.map((each) => {
        return (
            <Option key={each?.subject_id} value={each?.subject_id}>
                {each?.subject__subject_name}
            </Option>
        );
    });


    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
    const acad_session_id = selectedBranch?.id
    const formRef = createRef();
    const formRefOverall = createRef();


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
    console.log(startDay, 'start');
    console.log("Current month is:", moment().month())
    const currentMonth = moment().month() + 1

    useEffect(() => {
        if (acad_session_id) {
            console.log(acad_session_id, 'acadd');
            getOverallReport({
                acad_session_id: acad_session_id
            })
     
        }
    }, [acad_session_id])

    useEffect(() => {
        if (currentMonth != undefined) {
            setCurMonth(currentMonth)
            setCurMonthOverall(currentMonth)
        }
    }, [currentMonth])

    useEffect(() => {
        if (acad_session_id && curMonth != undefined) {
            getSubjectWise({
                acad_session_id: acad_session_id,
                month: curMonth
            })
          formRef.current.setFieldsValue({
            month: moment(curMonth , 'MM').format('MMM')
          })
        }
    }, [curMonth])



    const changeMonth = (e, value) => {
        setCurMonth(value.value)
    }

    const changeMonthOverall = (e, value) => {
        setCurMonthOverall(value.value)
    }

    const getOverallReport = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.overallReport}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                }
            })
            .then((res) => {
                console.log(res);
                setToday(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getSubjectWise = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.studentSubjectWise}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                }
            })
            .then((res) => {
                console.log(res);
                setPending(res.data.result)
                setData(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getYearly = (params = {}) => {
        axiosInstance
            .get(`${endpoints.homeworknew.overallHwCompletion}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                }
            })
            .then((res) => {
                console.log(res);
                setSubmit(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const getSubject = (params = {}) => {
        axiosInstance
            .get(`${endpoints.academics.subjects}`, {
                params: { ...params },
                // headers: {
                //     'X-DTS-Host': X_DTS_HOST,
                // }
            })
            .then((res) => {
                console.log(res);
                // setEvaluated(res.data.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

 

    const getpercent = (percent) => {
        return <div>
            <div className='th-13' style={{ color: '#B7B7B7' }}>Overall</div>
            <div>{`${percent}%`}</div>
        </div>
    }

    const config = {
        data,
        xField: 'subject_wise_percentage',
        yField: 'subject__subject_name',
        seriesField: 'subject__subject_name',
        // isPercent: 'true',
        // isStack: 'true',
        width: 400,
        height: 150,
        minColumnWidth: 30,
        maxColumnWidth: 30,
        legend: false,
        label: {
            position: 'middle',
            content: (item) => {
                return `${item.subject_wise_percentage.toFixed(2)}%`;
            },
            layout: [

            ],
        },
    };

    const changeSubject = (e , value) => {
        setSubject(value?.value)
    }

    useEffect(() => {
        if(subject != null && curMonthOverall){
            getYearly({
                acad_session_id: acad_session_id,
                month: curMonthOverall,
                subject_id: subject
            })
        }
    },[subject , curMonthOverall])

    useEffect(() => {
        if(pending?.length > 0 && curMonthOverall){
            getYearly({
                acad_session_id: acad_session_id,
                month: curMonthOverall,
                subject_id: pending[0]?.subject_id
            })
            formRefOverall.current.setFieldsValue({
                monthOverall : moment(curMonthOverall , 'MM').format('MMM'),
                subject: pending[0]?.subject__subject_name
            })
            setSubject(pending[0]?.subject_id)
        }
    },[pending])

    useEffect(() => {

    },[])



    return (
        <>
            <Layout>
                <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
                    <Breadcrumb separator='>'>
                        <Breadcrumb.Item
                            className='th-grey th-16 th-pointer'
                        >
                            Homework
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className='th-black-1 th-16'>
                            Student Homework
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Divider />
                <div className='row'>
                    <div className='col-md-4' >
                        <div className='card w-100'>
                            <div className='th-13 th-fw-600 p-2'>Overall Homework Completion</div>
                            <div className='col-md-12 row justify-content-center my-5 pb-2'>
                                <div className='cl-md-6'>
                                    <Progress type="circle" percent={today?.overall_persentage} format={(percent) => getpercent(percent)} strokeColor={{
                                        '0%': '#5BAD45',
                                        '100%': '#5BAD45',
                                    }} />
                                </div>
                                <div className='col-md-6 d-flex justify-content-center align-items-center flex-column' >
                                    <div className='th-15' style={{ color: '#A8A8A8' }}>Total Assigned : {today?.total_assigned}</div>
                                    <div className='th-15' style={{ color: '#597CD6' }}>Total Submitted : {today?.total_submitted}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div className='card w-100'>
                            <div className='row p-2 justify-content-between' >
                                <div className='th-13 th-fw-600 p-2'>Overall Homework Completion</div>
                                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                                    <Form ref={formRef}>
                                        <Form.Item name='month'>
                                            <Select
                                                placeholder='Month'
                                                optionFilterProp='children'
                                                filterOption={(input, options) => {
                                                    return (
                                                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    );
                                                }}
                                                onChange={changeMonth}
                                                className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                                                bordered={false}
                                            >
                                                {monthOptions}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                            <div className='p-4' >
                                {console.log(pending, 'pend')}
                                {pending?.length > 0 ?
                                    <Bar {...config} /> : <div style={{marginBottom: '20px'}} > <Empty /></div>}
                            </div>

                        </div>
                    </div>

                </div>
                <div className='col-md-12 mt-2'>
                    <div className='card w-100'>
                        <div className='row p-2 justify-content-between' >
                            <div className='th-13 th-fw-600 p-2'>Overall Homework Completion</div>
                            <div >
                                <Form ref={formRefOverall} className='d-flex justify-content-between' >
                                    <Form.Item name='monthOverall' className='px-2'>
                                        <Select
                                            placeholder='Month'
                                            optionFilterProp='children'
                                            filterOption={(input, options) => {
                                                return (
                                                    options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                );
                                            }}
                                            onChange={changeMonthOverall}
                                            className='w-100 text-left th-black-1 th-bg-grey th-br-4 mx-2'
                                            bordered={false}
                                        >
                                            {monthOptions}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name='subject'>
                                        <Select
                                            placeholder='Subject'
                                            optionFilterProp='children'
                                            filterOption={(input, options) => {
                                                return (
                                                    options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                );
                                            }}
                                            onChange={changeSubject}
                                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                                            bordered={false}
                                        >
                                            {subjectOptions}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <div className='p-3' style={{width: '70%'}} >
                        <GroupedChart data={submit} />
                        </div>
                    </div>
                </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(StudentAnalytics);