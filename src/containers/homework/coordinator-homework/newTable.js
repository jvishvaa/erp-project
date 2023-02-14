import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import { Avatar, Badge, Drawer , Input , Tooltip} from 'antd';
import moment from 'moment';
import { groupBy } from 'lodash';
import { PlusOutlined, CheckSquareOutlined, CheckOutlined, EditOutlined, CalendarOutlined, MoreOutlined } from '@ant-design/icons';
import HomeworkAssigned from 'v2/Assets/images/hwassign.png';
import HomeworkSubmit from 'v2/Assets/images/hwsubmit.png';
import HomeworkEvaluate from 'v2/Assets/images/task.png';
import './styles.scss';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchCoordinateTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
  setTeacherUserIDCoord,
  setSelectedCoFilters,
  resetSelectedCoFilters,
} from '../../../redux/actions';
import SubmissionData from './newHomework';

const { Search } = Input;

const WeeklyTable = withRouter(({
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
  onSearch,
  ...props }) => {
  const [eachSub, setEachSub] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false);
  const [submitData, setSubmitData] = useState()
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
);
const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
);
  let subData = []
  let temp = []
  let subjectWise = homeworkCols?.map((subject) => {
    let subjectDate = homeworkRows?.map((date) => {
      if (Object.keys(date).includes(subject?.subject_name)) {
        const sub_name = subject?.subject_name.replace(/['"]+/g, '')
        temp = {
          data: date[subject?.subject_name],
          branch: date?.branch,
          canUpload: date?.canUpload,
          date: date?.date,
          grade: date?.grade,
          subject_name: subject?.subject_name,
          subject_id: subject?.subject_id
        }
      }
      subData.push(temp)
    })
  })

  const segregated = groupBy(subData, 'subject_name')

  //drawer functions

  const showDrawer = (each, tab) => {
    console.log(each, tab, props, 'tab');
    setSubmitData({
      hw_data: each,
      tab: tab,
      props: props
    })
    setOpenDrawer(true);
    fetchStudentLists(each?.data?.hw_id, each?.subject_id, props?.sectionMapping, props?.teacherid, each?.date);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
    setSubmitData()
    getCoordinateTeacherHomeworkDetails(props?.moduleId, selectedAcademicYear?.id,
      selectedBranch?.branch?.id, props?.grade, props?.sectionMapping,
      props?.sectionId, props?.startDate, props?.endDate, props?.teacherid)
  };

  const handleAdd = (each) => {
    console.log(each, props);
    history.push({
      pathname: `/homework/addhomework/${each?.date}/${selectedAcademicYear?.id}/${props?.branch}/${props?.grade}/${each?.subject_name}/${each?.subject_id}/${props?.teacherid}`,
      state: {
        branch: props?.branch,
        endDate: props?.endDate,
        isTeacher: props?.isTeacher,
        moduleId: props?.moduleId,
        sectionId: props?.sectionId,
        sectionMapping: props?.sectionMapping,
        startDate: props?.startDate,
        teacherid: props?.teacherid,
        grade: props?.grade
      }
    }
    );
  }


  return (
    <>
      <div className='tablewrap' >
        <table style={{ minHeight: '50vh' }} className="tableCon" >
          <thead  >
            <tr className='tableR'>
              <th className='fixedcol tableH' style={{verticalAlign: 'middle'}} >
                  <Search
                    placeholder="Subject"
                    allowClear
                    size='small'
                    onSearch={onSearch}
                    />
              </th>
              {homeworkRows?.length > 0 && homeworkRows?.map((item) => (
                <th className='tableH'>
                  <div style={{ background: '#91A7CC', margin: '2px', borderRadius: '5px', color: 'white' }}>
                    <div className='d-flex justify-content-center' >
                      {moment(item?.date).format('ddd')}
                    </div>
                    <div className='d-flex justify-content-center'>
                      {moment(item?.date).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {homeworkCols?.map((item) => (
              <tr className='tableR'>
                {item?.subject_name ?
                  <>
                    <td className='fixedcol tableD' style={{textAlign: 'center' , verticalAlign: 'middle'}} >{item?.subject_name}</td>
                    {segregated[item?.subject_name]?.map((each) => (
                      <td className='tableD'>
                        <div className='card w-100 d-flex justify-content-center p-2' style={{ height: '100px' }}  >
                          {each?.data?.hw_evaluated == undefined && each?.canUpload == true ?
                            <div  >
                              <PlusOutlined style={{ fontSize: '25px', color: '#959595', background: '#e1e1e1', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleAdd(each)} />
                            </div> : each?.data?.hw_evaluated != undefined ? <div className='d-flex justify-content-between flex-wrap'>
                              <Tooltip title={`Submitted (${each?.data?.student_submitted})`} >
                              <div className='w-25' style={{ cursor: 'pointer' }} >
                                <Badge count={each?.data?.student_submitted} showZero color='#9DDEBA' style={{ cursor: 'pointer' }} size='small' >
                                  <img src={HomeworkAssigned} alt='hwAssign' style={{ width: '30px', height: '30px', background: '#E5FAF1', padding: '5px' }} onClick={() => showDrawer(each, 'submitted')} />
                                </Badge>
                              </div>
                              </Tooltip>
                              <Tooltip title={`Not-Submitted (${each?.data?.student_submitted})`} >
                              <div className='w-25' style={{ cursor: 'pointer' }}>
                                <Badge count={each?.data?.student_submitted} showZero color='#F1DA89' size='small'>
                                  <img src={HomeworkSubmit} alt='hwsubmit' style={{ width: '30px', height: '30px', background: '#FFF0C9', padding: '5px' }} onClick={() => showDrawer(each, 'not-submitted')} />
                                </Badge>
                              </div>
                              </Tooltip>
                              <Tooltip title={`Evaluated (${each?.data?.hw_evaluated})`} >
                              <div className='w-25' style={{ cursor: 'pointer' }}>
                                <Badge count={each?.data?.hw_evaluated} showZero color='#9DD6FF' size='small' >
                                  <img src={HomeworkEvaluate} alt='hwev' style={{ width: '30px', height: '30px', background: '#E8F2FD', padding: '5px' }} onClick={() => showDrawer(each, 'evaluated')} />
                                </Badge>
                              </div>
                              </Tooltip>
                            </div>
                              : ''}
                        </div>
                      </td>
                    ))}
                  </> : ''}
              </tr>
            ))}

          </tbody>


        </table>
      </div >
      <Drawer placement="right" onClose={onCloseDrawer} closable={false} visible={openDrawer} width={700} >
        <SubmissionData submitData={submitData} filterData={props} onCloseDrawer={onCloseDrawer} setViewHomework={props?.setViewHomework} setActiveView={props?.setActiveView} />
      </Drawer>
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
export default connect(mapStateToProps, mapDispatchToProps)(WeeklyTable);