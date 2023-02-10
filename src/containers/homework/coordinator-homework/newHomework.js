import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import { Avatar, Divider, Table, Drawer, Tabs, Collapse, Button, message } from 'antd';
import moment from 'moment';
import { groupBy } from 'lodash';
import { CloseCircleOutlined, LeftOutlined, RightOutlined, EditOutlined, CalendarOutlined, MoreOutlined } from '@ant-design/icons';
import HomeworkAssigned from 'v2/Assets/images/hwassign.png';
import HomeworkSubmit from 'v2/Assets/images/hwsubmit.png';
import HomeworkEvaluate from 'v2/Assets/images/task.png';
import './styles.scss';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axiosInstance from 'config/axios';
import {
    fetchCoordinateTeacherHomeworkDetails,
    setSelectedHomework,
    fetchStudentsListForTeacherHomework,
    setTeacherUserIDCoord,
    setSelectedCoFilters,
    resetSelectedCoFilters,
    fetchTeacherHomeworkDetailsById
} from '../../../redux/actions';
import Attachment from './attachment';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import endpoints from 'config/endpoints';
import './attachment.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.scss';
const { TabPane } = Tabs;
const { Panel } = Collapse;





const SubmissionData = withRouter(({
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
    getHomeworkDetailsById,
    selectedHomeworkDetails,
    ...props }) => {

    const [segment, setSegment] = useState('1')
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [collapse, setCollapse] = useState()
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const selectedBranch = useSelector(
        (state) => state.commonFilterReducer?.selectedBranch
    );
    const scrollableContainer = createRef();
    const getTitle = () => {
        return <div>
            {segment == 1 ? `Select All (${unSubmittedStudents?.length})` : segment == 2 ? `Select All (${submittedStudents?.length})` : segment == 4 ? `Select All (${evaluatedStudents?.length})` : ''}
        </div>
    }

    console.log(props, 'prop');

    const columns = [
        {
            title: getTitle(),
            dataIndex: 'first_name',
            key: 'user_id'
        },
    ];

    useEffect(() => {
        if (props?.submitData?.hw_data?.data?.hw_id) {
            getHomeworkDetailsById(props?.submitData?.hw_data?.data?.hw_id)
        }
    }, [props?.submitData?.hw_data?.data?.hw_id])

    const handleSegment = (e) => {
        setSegment(e)
        console.log(e, props, selectedHomeworkDetails);
    }

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const openCollapse = (key) => {
        console.log(key);
        setCollapse(key)
    }

    const handleScroll = (dir, index) => {
        let cara = document.getElementsByClassName(`attachbox${index}`)
        let attachArr = cara?.length > 0 ? cara[0] : ''
        console.log(dir, index, cara, 'dir');

        if (dir === 'left') {
            attachArr.scrollLeft -= 150;
        } else {
            attachArr.scrollLeft += 150;
        }
    };

    const handleUnSubmittedStd = () => {
        if (selectedRowKeys.length > 0) {
            axiosInstance
                .put(`academic/${props?.submitData?.hw_data?.data?.hw_id}/homework-unsubmitted-submitted/`, selectedRowKeys)
                .then((result) => {
                    message.success(result.data.message);
                    setSelectedRowKeys([])
                    console.log(result.data.message);
               
                    fetchStudentLists(props?.submitData?.hw_data?.data?.hw_id, props?.submitData?.hw_data?.subject_id, props?.submitData?.props?.sectionMapping, props?.submitData?.props?.teacherid, props?.submitData?.hw_data?.date);
                })
                .catch((error) => {
                    message.error('something went wrong');
                    console.log(error);
                });
        } else {
            message.error('Please select Users')
        }
    }

    let getDataStudent = []
    let allData = []
    let temPayload = []
    const handleSubmittedStd = () => {
        if (selectedRowKeys.length > 0) {
            let studentData = selectedRowKeys?.map((item) => {
                getDataStudent = submittedStudents.filter((each) => item == each?.student_homework_id)
                allData.push(getDataStudent[0])
            })
            console.log(allData, getDataStudent, selectedRowKeys, 'stud');
            let functemp = allData?.map((item) => {
                temPayload.push({
                    student_homework_id: item?.student_homework_id,
                    hw_submission_mode: item?.hw_submission_mode
                })
            })
            axiosInstance
                .put(endpoints.homework.submitToUnsubmit, temPayload)
                .then((result) => {
                    message.success(result.data.message);
              
                    fetchStudentLists(props?.submitData?.hw_data?.data?.hw_id, props?.submitData?.hw_data?.subject_id, props?.submitData?.props?.sectionMapping, props?.submitData?.props?.teacherid, props?.submitData?.hw_data?.date);
                    getDataStudent = [];
                    allData = []
                    temPayload = []
                })
                .catch((error) => {
                    message.error('something went wrong');
                    getDataStudent = [];
                    allData = []
                    temPayload = []
                });
        } else {
            message.error('Please select Users')
        }
    }

    return (
        <div className='submissionDrawer' >
            <div className='card w-100 ' style={{ background: '#F0F2F5', borderRadius: '10px' }}>
                <div className='d-flex justify-content-between p-3' >
                    <span className='font-weight-bold th-14'>{props?.submitData?.hw_data?.subject_name}</span>
                    <CloseCircleOutlined className='th-20' style={{ cursor: 'pointer' }} onClick={props?.onCloseDrawer} />
                </div>
                <span className='th-13 th-fw-600' style={{ color: '#A0A0A1', width: '95%', margin: '0 auto' }} >Homework Details</span>
                <div className='card' style={{ width: '95%', margin: '0 auto', marginBottom: '15px' }} >
                    <Collapse ghost expandIconPosition='right'
                        activeKey={collapse}
                        onChange={openCollapse}
                        accordion={true}
                    >
                        <Panel header={collapse == 1 ?
                            <div>
                                <span className='th-12 th-fw-400' style={{ color: '#A0A0A1' }} >Instruction</span>
                                <p className='th-12 th-fw-400 ' style={{ color: '#556778', background: '#F4F9FF', padding: '5px' }} >{selectedHomeworkDetails?.description}</p>
                            </div>
                            : <div style={{ width: '300px' }} ><p className='th-12 th-fw-400 text-truncate m-0' style={{ color: '#556778' }} >{selectedHomeworkDetails?.description}</p></div>} key="1">
                            <div>
                                <span className='th-12 th-fw-400' style={{ color: '#A0A0A1' }} >title</span>
                                <p className='th-12 th-fw-400 ' style={{ color: '#556778', background: '#F4F9FF', padding: '5px' }} >{selectedHomeworkDetails?.homework_name}</p>
                            </div>
                            <div ref={scrollableContainer}>

                                <span className='th-12 th-fw-400' style={{ color: '#A0A0A1' }} >Question</span>

                                {/* question attachment */}
                                <div className='view-homework-container-coordinator'  >
                                    {selectedHomeworkDetails && selectedHomeworkDetails?.hw_questions?.map((question, index) => (
                                        <div
                                            className='homework-question-container-coordinator'
                                            key={`homework_student_question_${index}`}
                                        >
                                            <div className='homework-question' style={{ border: '0px' }} >
                                                <div className='th-12 th-fw-400 ' style={{ color: '#556778', background: '#F4F9FF', padding: '5px' }}>{question.question}</div>
                                            </div>
                                            <div className='attachments-container'>
                                                {question.question_files.length > 0 && (
                                                    <p style={{ color: '#A0A0A1' }} className='th-11 p-2 m-0'>
                                                        Attachments
                                                    </p>
                                                )}
                                                <div className='attachments-list-outer-container'  >
                                                    <div className='prev-btn'>
                                                        {question.question_files.length > 1 && (
                                                            <LeftOutlined onClick={() => handleScroll('left', index)} />
                                                        )}
                                                    </div>
                                                    <SimpleReactLightbox>
                                                        <div
                                                            className={`attachbox${index} attachments-list`}
                                                            key={index}
                                                            onScroll={(e) => {
                                                                e.preventDefault();
                                                            }}
                                                        >

                                                            {question.question_files.map((url, i) => (
                                                                <>
                                                                    <div className='attachment'>
                                                                        <Attachment
                                                                            key={`homework_student_question_attachment_${i}`}
                                                                            fileUrl={url}
                                                                            fileName={`Attachment-${i + 1}`}
                                                                            urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                                                                            index={i}
                                                                            actions={['preview', 'download']}
                                                                        />
                                                                    </div>
                                                                </>
                                                            ))}
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    width: '0',
                                                                    height: '0',
                                                                    visibility: 'hidden',
                                                                }}
                                                            >
                                                                <SRLWrapper>
                                                                    {question.question_files.map((url, i) => (
                                                                        <img
                                                                            src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                                                            onError={(e) => {
                                                                                e.target.src = placeholder;
                                                                            }}
                                                                            alt={`Attachment-${i + 1}`}
                                                                            style={{ width: '0', height: '0' }}
                                                                        />
                                                                    ))}
                                                                </SRLWrapper>
                                                            </div>
                                                        </div>
                                                    </SimpleReactLightbox>
                                                    <div className='next-btn'>
                                                        {question.question_files.length > 1 && (
                                                            <RightOutlined onClick={() => handleScroll('right', index)} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </div>
            <Tabs onChange={handleSegment} activeKey={segment} style={{ fontSize: '10px', fontWeight: '600' }} >
                <TabPane tab={`Not Submitted(${unSubmittedStudents?.length ? unSubmittedStudents?.length : "0"})`} key={'1'} style={{ color: '#F1DA89' }}  >
                    <div style={{ width: '100%' }}  >
                        <Table rowSelection={{ ...rowSelection }}
                            columns={columns} dataSource={unSubmittedStudents}
                            rowKey={(record) => record?.user_id}
                            className=' th-homework-table-head-bg '
                            pagination={false}
                            rowClassName='submitionTable '
                        />
                    </div>
                </TabPane>
                <TabPane tab={`Submitted(${submittedStudents?.length ? submittedStudents?.length : "0"})`} key={'2'} >
                    <div style={{ width: '100%' }} >
                        <Table rowSelection={{ ...rowSelection }}
                            columns={columns} dataSource={submittedStudents}
                            rowKey={(record) => record?.student_homework_id}
                            // className='th-table'
                            pagination={false}
                            rowClassName='submitionTable'
                            className=' th-homework-table-head-bg '
                        />
                    </div>
                </TabPane>
                <TabPane tab={`Absent(${absentList?.length ? absentList?.length : "0"})`} key={'3'}  >
                    <Table rowSelection={{ ...rowSelection }}
                        columns={columns} dataSource={absentList}
                        rowKey={(record) => record?.user_id}
                        // className='th-table'
                        pagination={false}
                        rowClassName='submitionTable'
                        className=' th-homework-table-head-bg '
                    />
                </TabPane>
                <TabPane tab={`Evaluated(${evaluatedStudents?.length ? evaluatedStudents?.length : "0"})`} key={'4'} >
                    <div style={{ width: '100%' }} >
                        <Table rowSelection={{ ...rowSelection }}
                            columns={columns} dataSource={evaluatedStudents}
                            rowKey={(record) => record?.user_id}
                            // className='th-table'
                            pagination={false}
                            rowClassName='submitionTable'
                            className=' th-homework-table-head-bg '
                        />
                    </div>
                </TabPane>

            </Tabs>
            {segment == 1 ?
                <div className='card th-br-4' style={{ position: 'absolute', bottom: '0', width: '90%' }} >
                    <Button onClick={handleUnSubmittedStd} style={{ color: '#50A167', borderColor: '#50A167' }} >Move To Submit</Button>
                </div>
                : segment == 2 ?
                    <div className='card th-br-4' style={{ position: 'absolute', bottom: '0', width: '90%' }} >
                        <Button onClick={handleSubmittedStd} style={{ color: '#50A167', borderColor: '#50A167' }} >Move To Unsubmit</Button>
                    </div> : ''}
        </div>
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
    selectedHomeworkDetails: state.teacherHomework.selectedHomeworkDetails,


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
    getHomeworkDetailsById: (id) => {
        dispatch(fetchTeacherHomeworkDetailsById(id));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(SubmissionData);