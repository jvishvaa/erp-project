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
import { Column } from '@ant-design/plots';
import {
    CloseCircleOutlined, LeftOutlined, RightOutlined, EditOutlined,
    DownOutlined, CalendarOutlined, MoreOutlined
} from '@ant-design/icons';
import Atachment from 'assets/images/attachmenticon.svg'
import GroupedChart from './yearlyAnalytics';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
    const [moduleId, setModuleId] = useState();
    const [subject, setSubject] = useState()
    const [data, setData] = useState([])
    const [curMonth, setCurMonth] = useState()
    const [curMonthOverall, setCurMonthOverall] = useState()
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
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
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

    useEffect(() => {
        if (NavData && NavData.length) {
            NavData.forEach((item) => {
                if (
                    item.parent_modules === 'Homework' &&
                    item.child_module &&
                    item.child_module.length > 0
                ) {
                    item.child_module.forEach((item) => {
                        if (item.child_name === 'Student Homework') {
                            setModuleId(item?.child_id);
                        }
                    });
                }
            });
        }
    }, []);

    const monthOptions = monthData?.map((each) => {
        return (
            <Option key={each?.id} value={each?.id}>
                {each?.month}
            </Option>
        );
    });

    const subjectOptions = pending?.map((each) => {
        return (
            <Option key={each?.id} value={each?.id}>
                {each?.subject_name}
            </Option>
        );
    });

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
            getSubject({
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
                month: moment(curMonth, 'MM').format('MMM')
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
            .get(`${endpoints.homeworknew.subjectListStudent}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                }
            })
            .then((res) => {
                console.log(res);
                setPending(res.data.result)
                setSubject(res?.data?.result)
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

 

    const config = {
        data,
        yField: 'subject_wise_percentage',
        xField: 'subject__subject_name',
        seriesField: 'subject__subject_name',
        // isPercent: 'true',
        // isStack: 'true',
        width: 400,
        height: 150,

        legend: false,
        xAxis: {
            label: {
                autoRotate: true,
            },
        },
        barBackground: {
            style: {
                opacity: '0.9'
            }
        },
        label: {
            position: 'middle',
            content: (item) => {
                return `${item.subject_wise_percentage.toFixed(0)}%`;
            },
            style: {
                opacity: 100,
                fill: '#000000',
                fontSize: 12,
                fontWeight: 600,
            }
        },
    };

    const optionsOverallPie = {
        chart: {
            type: 'pie',
        },

        title: {
            verticalAlign: 'middle',
            floating: true,
            text:
                'Overall' +
                '<br />' +
                `${
                    today?.total_assigned == 0
                      ? 0
                      : (
                          (today?.total_submitted /
                          today?.total_assigned) *
                          100
                        ).toFixed(2)
                  }%`,
            y: 18,
            style: { fontWight: '800', color: '#32334a ', fontFamily: 'Inter, sans-serif' },
        },
        colors: ['#3AAC45', '#ff9922'],
        credits: {
            enabled: false,
        },

        plotOptions: {
            pie: {
                shadow: true,
            },
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
            },
        },
        series: [
            {
                data: [
                    ['Total Submitted', today?.total_submitted],
                    ['Total Pending', today?.total_pending],
                ],
                // size: '100%',
                innerSize: '85%',
                showInLegend: false,
                dataLabels: {
                    enabled: false,
                },
            },
        ],
    };

    const changeSubject = (e, value) => {
        setSubject(value?.value)
    }

    useEffect(() => {
        if (subject != null && curMonthOverall) {
            getYearly({
                acad_session_id: acad_session_id,
                month: curMonthOverall,
                subject_id: subject
            })
        }
    }, [subject, curMonthOverall])

    useEffect(() => {
        if (pending?.length > 0 && curMonthOverall) {
            getYearly({
                acad_session_id: acad_session_id,
                month: curMonthOverall,
                subject_id: pending[0]?.id
            })
            formRefOverall.current.setFieldsValue({
                monthOverall: moment(curMonthOverall, 'MM').format('MMM'),
                subject: pending[0]?.subject_name
            })
            setSubject(pending[0]?.id)
        }
    }, [pending])





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
                        <Breadcrumb.Item className='th-black-1 th-16 th-pointer' onClick={() => history.push('/homework/student')} >
                            Student Homework
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Divider />
                <div className='row'>
                    <div className='col-md-4' >
                        <div className='card w-100'>
                            <div className='th-13 th-fw-600 p-2'>Overall Homework Completion</div>
                            <div className='d-flex justify-content-between mb-4'>
                                <div className='col-md-6'>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={optionsOverallPie}
                                        containerProps={{
                                            style: { height: '200px', width: '190px' },
                                        }}
                                    />
                                </div>
                                <div className='col-md-6 d-flex justify-content-center flex-column'>
                                <div className='th-grey py-1 d-flex th-13  px-1'>
                                        <span>Total Assigned :</span>{' '}
                                        <span>{today?.total_assigned}</span>
                                    </div>
                                    <div className='th-green-2 py-1 d-flex  th-13  px-1 '>
                                        <span>Total Submitted :</span>{' '}
                                        <span>&nbsp;{today?.total_submitted}</span>
                                    </div>
                                    <div className='th-yellow py-1 d-flex th-13  px-1'>
                                        <span>Total Pending :</span>{' '}
                                        <span>{today?.total_pending}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div className='card w-100'>
                            <div className='row p-2 justify-content-between' >
                                <div className='th-13 th-fw-600 p-2'>Subjectwise Homework Completion</div>
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
                                    <Column {...config} /> : <div style={{ marginBottom: '20px' }} > <Empty /></div>}
                            </div>

                        </div>
                    </div>

                </div>
                <div className='col-md-12 mt-2'>
                    <div className='card w-100'>
                        <div className='row p-2 justify-content-between' >
                            <div className='th-13 th-fw-600 p-2'>Monthwise Homework Completion</div>
                            <div >
                                <Form ref={formRefOverall} className='d-flex justify-content-between' >

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
                        <div className='p-3' style={{ width: '70%' }} >
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