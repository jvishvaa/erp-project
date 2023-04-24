/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
    Grid,

} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Layout from '../../../Layout';
import { Button, Form, Select, message } from 'antd';
import axios from 'axios';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { connect, useSelector } from 'react-redux';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Table, Breadcrumb } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';

const { Option } = Select;

const useStyles = makeStyles((theme) => ({
    gradeBoxContainer: {
    },
    gradeDiv: {
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '8px',
        padding: '10px 15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

    },
    gradeBox: {
        border: '1px solid black',
        padding: '3px',
    },
    gradeOverviewContainer: {
        border: '1px solid black',
        borderRadius: '10px',
        padding: '15px 8px',
        maxHeight: '55vh',
        overflowY: 'scroll',
        backgroundColor: 'white',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
            borderRadius: '10px',
        },

        '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
        },

    },
    eachGradeOverviewContainer: {
        border: '1px solid black',
        borderRadius: '10px',
        padding: '10px 8px',
        margin: '8px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eachGradeName: {
        backgroundColor: 'gray',
        color: 'white',
        padding: '4px',
        borderRadius: '5px',
    },
    textAlignEnd: {
        textAlign: 'end',
    },
    textBold: {
        fontWeight: '800',
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
    },
    TableTextLeft: {
        textAlign: 'center !important',
        fontSize: '13px',
    },
    TableTextRight: {
        textAlign: 'right !important',
        fontSize: '14px'
    },
    TableTextRightContainer: {
        textAlign: 'right !important',
        paddingRight: '48px',
    },
    TableHeaderColor: {
        backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
        color: 'black',
    },
    tableStateMent: {
        color: `${theme.palette.v2Color1.primaryV2} !important`,
        fontWeight: 'bolder'
    },
    viewButton: {
        backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
    },
}));



const CurriculumCompletionSubjectStudent = (props) => {
    const classes = useStyles();
    const [volume, setVolume] = React.useState('');
    const history = useHistory();
    const [tableData, setTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [moduleId, setModuleId] = React.useState('');
    const [acadeId, setAcadeId] = React.useState('');
    const [gradeApiData, setGradeApiData] = React.useState([]);
    const [branchName, setBranchName] = React.useState([]);
    const [teacherView, setTeacherView] = useState(false)
    const [dateToday, setDateToday] = useState();
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );

    const branchId = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
    );
    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
    const [volumeListData, setVolumeListData] = useState([]);
    const [volumeId, setVolumeId] = useState([]);
    const [volumeName, setVolumeName] = useState('');
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
    const grade_id = userDetails?.role_details?.grades?.length > 0 ? userDetails?.role_details?.grades[0]?.grade_id : null
    useEffect(() => {
        if (NavData && NavData.length) {
            NavData.forEach((item) => {
                if (
                    item.parent_modules === 'Lesson Plan' &&
                    item.child_module &&
                    item.child_module.length > 0
                ) {
                    item.child_module.forEach((item) => {
                        if (item.child_name === 'Student View') {
                            setModuleId(item.child_id);
                        }
                    });
                }
            });
        }
    }, []);


    console.log(props);

    useEffect(() => {
        setAcadeId(selectedBranch?.id);
        setBranchName(userDetails?.role_details?.branch?.length > 0 ? userDetails?.role_details?.branch[0]?.branch_name : null)
        setDateToday(history?.location?.state?.selectedDate)
        if (history?.location?.state?.volume != null) {
            setVolumeId(history?.location?.state?.volume)
        }
        fetchVolumeListData()
    }, [history]);

    const acad_session_id = selectedAcademicYear?.id
    const acad_sess_id = selectedBranch?.id




    useEffect(() => {
        console.log(dateToday);
        if (volumeId != null) {
            gradeListTable({
                grade_id: grade_id,
                session_year: selectedAcademicYear?.id,
                acad_session: acad_sess_id,
                volume: volumeId
            });
        } else {
            gradeListTable({
                grade_id: grade_id,
                session_year: selectedAcademicYear?.id,
                acad_session: acad_sess_id
            });
        }
    }, [volumeId]);

    const gradeListTable = (params = {}) => {
        setLoading(true);
        axiosInstance
            .get(`${endpoints.ownerDashboard.subjectWise}`, {
                params: { ...params },
                headers: {
                    'X-DTS-Host': X_DTS_HOST,
                },
            })
            .then((res) => {
                console.log(res);
                setTableData(res?.data?.result);
                setLoading(false);

                // setStudentData(res.data.result);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };


    const fetchVolumeListData = () => {
        axios
            .get(`${endpoints.lessonPlan.volumeList}`, {
                headers: {
                    'x-api-key': 'vikash@12345#1231',
                },
            })
            .then((result) => {
                if (result?.data?.status_code === 200) {
                    setVolumeListData(result?.data?.result?.results);
                }
            })
            .catch((error) => {
                message.error(error.message);
            });
    };
    const volumeOptions = volumeListData?.map((each) => {
        return (
            <Option key={each?.id} value={each.id}>
                {each?.volume_name}
            </Option>
        );
    });

    const handlevolume = (e) => {
        setVolumeId(e.value);
        setVolumeName(e.children);
    };
    const handleClearVolume = () => {
        setVolumeId('');
        setVolumeName('');
    };


    const handleBack = () => {
        history.goBack();
    }

    const columns = [
        {
            title: <span className='th-white pl-4 th-fw-700 '>Subject</span>,
            dataIndex: 'subject_name',
            width: '20%',
            align: 'left',
            render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
        },
        {
            title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
            width: '15%',
            align: 'center',
            dataIndex: 'total_periods_sum',
            render: (data) => <span className='th-black-1 th-16'>{data}</span>,
        },
        {
            title: <span className='th-white th-fw-700'>AVG PERIODS CONDUCTED</span>,
            dataIndex: 'completed_periods_sum',
            width: '15%',
            align: 'center',
            render: (data) => <span className='th-green th-16'>{data.toFixed(1)}</span>,
        },
        {
            title: <span className='th-white th-fw-700'>AVG PERIODS PENDING</span>,
            dataIndex: 'pending_periods_sum',
            width: '15%',
            align: 'center',
            render: (data) => <span className='th-green th-16'>{data.toFixed(1)}</span>,
        },
        {
            title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
            dataIndex: 'avg',
            width: '15%',
            align: 'center',
            render: (data) => <span className='th-green th-16'>{data} %</span>,
        },
        {
            title: '',
            align: 'center',
            width: '5%',
            key: 'icon',
            render: (text, row) => (
                <span
                    onClick={(e) =>
                        history.push({
                            pathname: `/curriculum-completion-chapter/${branchId}/${grade_id}`,
                            state: {
                                grade: grade_id,
                                gradeName: row?.grade_name,
                                subject_id: row?.subject_id_id,
                                acad_session_id: acad_session_id,
                                acad_sess_id: acad_sess_id,
                                module_id: moduleId,
                                branchName: branchName,
                                selectedDate: dateToday,
                                teacherView: teacherView,
                                central_gs: row?.central_gs
                            },
                        })
                    }
                >
                    <RightOutlined className='th-grey th-pointer' />
                </span>
            )
        },
    ];


    return (
        <Layout>
            <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Breadcrumb separator='>'>
                            <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className='th-grey '
                            >
                                Curriculum Completion
                            </Breadcrumb.Item>
                            <Breadcrumb.Item className='th-black-1'>Subject Wise</Breadcrumb.Item>
                        </Breadcrumb>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        {/* <Button onClick={handleBack} icon={<LeftOutlined />} className={clsx(classes.backButton)} >Back</Button> */}
                        <div className='col-md-3 col-6 pl-md-1'>
                            <div className='text-left pl-md-1'>Volume</div>
                            <Form.Item name='volume'>
                                <Select
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder='Select Volume'
                                    showSearch
                                    defaultValue='All'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                        return (
                                            options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        );
                                    }}
                                    onChange={(e, value) => {
                                        handlevolume(value);
                                    }}
                                    onClear={handleClearVolume}
                                    allowClear
                                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                    bordered={false}
                                >
                                    {volumeOptions}
                                </Select>
                            </Form.Item>
                        </div>
                    </Grid>

                    <div className='row '>
                        <div className='col-12'>
                            <Table
                                className='th-table'
                                rowClassName={(record, index) =>
                                    index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                                }
                                loading={loading}
                                columns={columns}
                                rowKey={(record) => record?.subject_id_id}
                                dataSource={tableData}
                                expandRowByClick={true}
                                pagination={false}
                                expandIconColumnIndex={6}
                                scroll={{ x: 'max-content' }}
                                onRow={(row, rowindex) => {
                                    return {

                                        onClick: (e) =>
                                            history.push({
                                                pathname: `/curriculum-completion-chapter/${branchId}/${grade_id}`,
                                                state: {
                                                    grade: grade_id,
                                                    gradeName: row?.grade_name,
                                                    subject_id: row?.subject_id_id,
                                                    acad_session_id: acad_session_id,
                                                    acad_sess_id: acad_sess_id,
                                                    module_id: moduleId,
                                                    branchName: branchName,
                                                    selectedDate: dateToday,
                                                    teacherView: teacherView,
                                                    central_gs: row?.central_gs
                                                },
                                            })
                                    }
                                }}
                            />
                        </div>

                    </div>
                </Grid>
            </div>
        </Layout>
    );
};

export default withRouter(CurriculumCompletionSubjectStudent);
