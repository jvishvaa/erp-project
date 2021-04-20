import React, { useState, useLayoutEffect, useEffect } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TextField
//   withStyles
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import zipcelx from 'zipcelx'
import Select from 'react-select'
import { connect } from 'react-redux'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { student } from '../../../masters'
import Layout from '../../../../../../Layout'

const StudentPromotion = ({ classes, session, branches, fetchBranches, sendStudentPromotionList, studentList, studentPromotionList, fetchGradesPerBranch, fetchAllSection, alert, user, dataLoading, gradesPerBranch, sections }) => {
  const [sessionData, setSessionData] = useState([])
  const [branchData, setBranchData] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [sectionId, setSectionId] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  //   const [gradeId, setGradeId] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [promotedStudent, setPromotedStudent] = useState({})
  const [allStuPromoted, setAllStuPromoted] = useState(false)
  const [promotedStu, setPromotedStu] = useState([])
  const [notPromotedStu, setNotPromotedStu] = useState([])
  const [erpSearchValue, setErpSearchValue] = useState('')
  const [notProErpValue, setNotProErpValue] = useState('')
  // const [notpromotedStudent, setNotPromotedStudent] = useState({})
  // const [allNotStuPromoted, setAllNotStuPromoted] = useState(false)
  const [studentListCanPromoted, setStudentListCanPromoted] = useState([])
  const [displayStudentList, setDisplayStudentList] = useState(false)
  // const [disablePromote, setDisablePromote] = useState(true)
  const [reasonSearchData, setReasonSearchData] = useState(null)
  const [reasonNotPromotedData, setReasonNotPromotedData] = useState(null)
  const [listOfAllPromoStudent, setListOfAllPromoStudent] = useState([])
  const [listOfAllNotPromoStudent, setListOfAllNotPromoStudent] = useState([])

  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    let promoted = []
    let notPromoted = []
    if (studentList.length) {
      for (let i = 0; i < studentList.length; i++) {
        if (studentList[i].is_promoted === true) {
          promoted.push(studentList[i])
        } else {
          notPromoted.push(studentList[i])
        }
      }
    }
 
    setPromotedStu(promoted)
    setNotPromotedStu(notPromoted)
    setAllStuPromoted(false)
    setPromotedStudent(false)
    // setDisablePromote(true)
    setListOfAllPromoStudent(promoted)
    setListOfAllNotPromoStudent(notPromoted)
  }, [studentList])

  useEffect(() => {
    let arr1 = []
    if (promotedStudent) {
      arr1 = ((Object.keys(promotedStudent).filter(key => promotedStudent[key] === true)))
      setStudentListCanPromoted(arr1)
      // setNotPromotedStudent(false)
      // setAllNotStuPromoted(false)
    }
 
    // let arr2 = []
    // if (notpromotedStudent) {
    //   arr2 = ((Object.keys(notpromotedStudent).filter(key => notpromotedStudent[key] === true)))
    //   setStudentListCanPromoted(arr2)
    // }
  }, [promotedStudent])

  const downloadCanBePromotedStu = () => {
    const headers = [
      {
        value: 'Enrollment code',
        type: 'string'
      },
      {
        value: 'Reason',
        type: 'string'
      },
      {
        value: 'Can be Promoted?',
        type: 'string'
      },
      {
        value: 'Fee Plan Name',
        type: 'string'
      }
    ]

    const body = promotedStu.map(stu => {
      return ([
        {
          value: stu.student,
          type: 'string'
        },
        {
          value: stu.Reason,
          type: 'string'
        },
        {
          value: stu.is_promoted ? 'YES' : 'NO',
          type: 'string'
        },
        {
          value: stu.fee_plan_name,
          type: 'string'
        }
      ])
    })
    // const body = [
    //   {
    //     value: promoted,
    //     type: 'string'
    //   }
    // ]
    const config = {
      filename: 'can_be_promoted',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }

  const canNotBePromotedStu = () => {
    const headers = [
      {
        value: 'Enrollment code',
        type: 'string'
      },
      {
        value: 'Reason',
        type: 'string'
      },
      {
        value: 'Can be Promoted?',
        type: 'string'
      },
      {
        value: 'Fee Plan Name',
        type: 'string'
      }
    ]

    const body = notPromotedStu.map(stu => {
      return ([
        {
          value: stu.student,
          type: 'string'
        },
        {
          value: stu.Reason,
          type: 'string'
        },
        {
          value: stu.is_promoted ? 'YES' : 'NO',
          type: 'string'
        },
        {
          value: stu.fee_plan_name,
          type: 'string'
        }
      ])
    })
    // const body = [
    //   {
    //     value: promoted,
    //     type: 'string'
    //   }
    // ]
    const config = {
      filename: 'cannot_be_promoted',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }
  const handleClickSessionYear = (e) => {
    setSessionData(e)
    fetchBranches(e.value, alert, user)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    fetchGradesPerBranch(alert, user, sessionData.value, e.value)
  }
  const gradeHandler = (e) => {
    setGradeData(e)
    // setGradeId(e.value)
    fetchAllSection(sessionData.value, alert, user, e.value, branchData.value)
  }

  const sectionHandler = (e) => {
    setSectionData(e)
    // setSectionId(sectionIds)
    setSectionId(e)
  }

  const studentPromotedList = () => {
    let myArr = promotedStu.map((student) => {
      return (
        <TableRow>
          <TableCell align='center'>
            <input
              type='checkbox'
              style={{ width: '15px', height: '15px' }}
              checked={promotedStudent[student.student]}
              onChange={(e) => singleStudentPromoted(e, student.student)}
              color='primary'
            /></TableCell>
          <TableCell style={{ fontSize: 14 }} align='center'><b>{student.student}</b></TableCell>
          <TableCell align='center'>{student.Reason}</TableCell>
          <TableCell align='center'>{student.fee_plan_name}</TableCell>
        </TableRow>
      )
    })
    return myArr
  }

  const studentNotPromotedList = () => {
    let notPromoted = notPromotedStu.map((student) => {
      return (
        <TableRow>
          <TableCell align='center'>
            {/* <input
              type='checkbox'
              style={{ width: '15px', height: '15px' }}
              checked={notpromotedStudent[student.student]}
              onChange={(e) => singleStudentNotPromoted(e, student.student)}
              color='primary'
            /> */}
          </TableCell>
          <TableCell style={{ fontSize: 14 }} align='center'><b>{student.student}</b></TableCell>
          <TableCell align='center'>{student.Reason}</TableCell>
          {/* <TableCell>{student.fee_plan_name}</TableCell> */}
          <TableCell align='center'>{}</TableCell>
        </TableRow>
      )
    })
    return notPromoted
  }
  const studentPromotionListHandler = () => {
    if (sessionData && branchData && gradeData) {
      const data = {
        academic_year: sessionData && sessionData.value,
        branch: branchData && branchData.value,
        grade: gradeData && gradeData.value,
        section: sectionData && sectionData.value
      }
      studentPromotionList(data, alert, user)
    }
    setDisplayStudentList(true)
  }

  const allStudentPromotedHandler = (e) => {
    const checked = {}
    if (studentList.length > 0 && promotedStu.length > 0) {
      promotedStu.forEach((ele) => {
        checked[ele.student] = e.target.checked
      })
      setPromotedStudent(checked)
      setAllStuPromoted(!allStuPromoted)
      // if (allStuPromoted) {
      //   setDisablePromote(true)
      // } else {
      //   setDisablePromote(false)
      // }
    }
  }

  // const allStudentNotPromotedHandler = (e) => {
  //   const checked = {}
  //   if (studentList.length > 0 && notPromotedStu.length > 0) {
  //     notPromotedStu.forEach((ele) => {
  //       checked[ele.student] = e.target.checked
  //     })
  //     setNotPromotedStudent(checked)
  //     setAllNotStuPromoted(!allNotStuPromoted)
  //   }
  // }

  const singleStudentPromoted = (e, erp) => {
    if (e.target.checked) {
      setPromotedStudent({ ...promotedStudent, [erp]: true })
      // setDisablePromote(false)
    } else {
      setPromotedStudent({ ...promotedStudent, [erp]: false })
      // setDisablePromote(true)
    }
  }

  // const singleStudentNotPromoted = (e, erp) => {
  //   if (e.target.checked) {
  //     setNotPromotedStudent({ ...notpromotedStudent, [erp]: true })
  //   } else {
  //     setNotPromotedStudent({ ...notpromotedStudent, [erp]: false })
  //   }
  // }
  const sendStudentPromotionListHandler = () => {
    const data = {
      academic_year: sessionData && sessionData.value,
      branch: branchData && branchData.value,
      grade: gradeData && gradeData.value,
      section: sectionId && sectionId,
      promoted_student_list: studentListCanPromoted
    }
    sendStudentPromotionList(data, alert, user)
    setStudentListCanPromoted(null)
    setPromotedStudent(false)
    setAllStuPromoted(false)
    setErpSearchValue('')
  }

  const erpSearchHandler = (e) => {
    const filteredArr = studentList.filter(stu => stu.is_promoted && +stu.student.includes(+e.target.value))
    setErpSearchValue(e.target.value)
    setReasonSearchData(null)
    setPromotedStu(filteredArr)
  }

  const searchNotPromotedHandler = (e) => {
    const filteredArr = studentList.filter(stu => !stu.is_promoted && +stu.student.includes(+e.target.value))
    setNotProErpValue(e.target.value)
    setReasonSearchData(null)
    setNotPromotedStu(filteredArr)
  }

  const reasonSearchHandler = (e) => {
    if (e.value) {
      const filteredArr = studentList.filter(stu => stu.is_promoted && stu.Reason.includes(e.value))
      setPromotedStu(filteredArr)
      setErpSearchValue(null)
      setNotProErpValue(null)
      setReasonSearchData(e)
    } else {
      const filteredArr = studentList.filter(stu => stu.is_promoted)
      setPromotedStu(filteredArr)
      setReasonSearchData(e)
      setErpSearchValue(null)
      setNotProErpValue(null)
    }
  }

  const reasonNotPromotedHandler = (e) => {
    if (e.value) {
      const filteredArr = studentList.filter(stu => !stu.is_promoted && stu.Reason.includes(e.value))
      setNotPromotedStu(filteredArr)
      setErpSearchValue(null)
      setNotProErpValue(null)
      setReasonNotPromotedData(e)
    } else {
      const filteredArr = studentList.filter(stu => !stu.is_promoted)
      setNotPromotedStu(filteredArr)
      setReasonNotPromotedData(e)
      setErpSearchValue(null)
      setNotProErpValue(null)
    }
  }

  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        { isAdmin
          ? <Grid item xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={branchData}
              options={
                branches.length
                  ? branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }
              onChange={changehandlerbranch}
            />
          </Grid>
          : [] }
        <Grid item xs={3}>
          <label>Grades*</label>
          <Select
            placeholder='Select Grade'
            value={gradeData}
            options={
              gradesPerBranch
                ? gradesPerBranch.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                : []
            }
            onChange={gradeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Section</label>
          <Select
            placeholder='Select Section'
            value={sectionData}
            options={
              sections
                ? sections.filter(ele => ele.section !== null).map(sec => ({
                  value: sec.section && sec.section.id ? sec.section.id : '',
                  label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                }))
                : []
            }
            onChange={sectionHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={studentPromotionListHandler}
          >Submit</Button>
        </Grid>
      </Grid>
      {displayStudentList
        ? <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={6}>
              <label style={{ fontSize: 18 }}><b> Student Can Be Promoted List   ({studentListCanPromoted ? studentListCanPromoted.length : 0}/{listOfAllPromoStudent && listOfAllPromoStudent.length})</b></label>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={downloadCanBePromotedStu}
                  style={{ marginTop: '20px', float: 'right', marginBottom: 10 }}
                >
                DOWNLOAD Excel</Button>
              </Grid>
              <Table style={{ border: 'solid 1px lightGrey' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 14 }} align='center'>
                      <input
                        type='checkbox'
                        style={{ width: '15px', height: '15px', marginLeft: '5px' }}
                        checked={allStuPromoted}
                        onChange={allStudentPromotedHandler}
                        color='primary'
                      /><label><b>SelectAll</b></label>
                    </TableCell>
                    <TableCell style={{ fontSize: 14, width: 150 }} align='center'><b>Student Erp</b></TableCell>
                    <TableCell style={{ fontSize: 14, width: 150 }} align='center'><b>Reason</b></TableCell>
                    <TableCell style={{ fontSize: 14, width: 150 }} align='center'><b>Fee Plan Applicable</b></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={1} align='center' />
                    <TableCell colSpan={1} align='center'>
                      <TextField
                        id='erp1'
                        label='Search ERP'
                        type='number'
                        variant='outlined'
                        value={erpSearchValue || ''}
                        style={{ zIndex: 0, float: 'left', marginTop: '10px', marginBottom: '5px' }}
                        onChange={erpSearchHandler}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          style: {
                            height: 42
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell colSpan={1} align='center'>
                      <Select
                        placeholder='Search Reason'
                        value={reasonSearchData}
                        style={{ height: 47 }}
                        options={[
                          {
                            label: '*Select*',
                            value: null
                          },
                          {
                            label: 'Student Paid All The Fee',
                            value: 'Student Paid All The Fee  '
                          },
                          {
                            label: 'Student Has Remaining Fee Amount',
                            value: 'Student Has Remaining Fee Amount'
                          }
                        ]}
                        onChange={reasonSearchHandler}
                      />
                    </TableCell>
                    <TableCell colSpan={1} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentPromotedList()}
                </TableBody>
              </Table>
              <Grid item xs='12'>
                <Button
                  variant='contained'
                  color='primary'
                  disabled={studentListCanPromoted ? !studentListCanPromoted.length : true}
                  style={{ marginTop: '20px', float: 'right', marginBottom: 10 }}
                  onClick={sendStudentPromotionListHandler}>
                PROMOTE</Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <label style={{ fontSize: 18 }}><b> Student Can Not Be Promoted List ({listOfAllNotPromoStudent ? listOfAllNotPromoStudent.length : 0 })</b></label>
              <Grid item xs={4}>
                {/* <TextField
                  id='erp2'
                  label='Search ERP'
                  type='number'
                  variant='outlined'
                  value={notProErpValue || ''}
                  style={{ zIndex: 0, float: 'left', marginTop: '10px', marginBottom: '5px' }}
                  onChange={searchNotPromotedHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    style: {
                      height: 42
                    }
                  }}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ marginTop: '20px', float: 'right', marginBottom: 10 }}
                  onClick={canNotBePromotedStu}
                  role='presentation'
                >
                DOWNLOAD Excel</Button>
              </Grid>
              <Table style={{ border: 'solid 1px lightGrey' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 14 }} align='center'>
                      {/* <label><b>Select All</b></label> */}
                      {/* <input
                    type='checkbox'
                    style={{ width: '15px', height: '15px' }}
                    checked={allNotStuPromoted}
                    onChange={allStudentNotPromotedHandler}
                    color='primary'
                  /> */}
                    </TableCell>
                    <TableCell align='center' style={{ fontSize: 14, width: 150 }}><b>Student Erp</b></TableCell>
                    <TableCell align='center' style={{ fontSize: 14, width: 150 }}><b>Reason</b></TableCell>
                    {/* <TableCell style={{ fontSize: 14 }}><b>Fee Plan Name</b></TableCell> */}
                    <TableCell align='center' style={{ fontSize: 14 }}><b>Description</b></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={1} align='center' />
                    <TableCell colSpan={1} align='center'>
                      <TextField
                        id='erp2'
                        label='Search ERP'
                        type='number'
                        variant='outlined'
                        value={notProErpValue || ''}
                        style={{ zIndex: 0, float: 'left', marginTop: '10px', marginBottom: '5px' }}
                        onChange={searchNotPromotedHandler}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          style: {
                            height: 42
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell colSpan={1} align='center'>
                      <Select
                        placeholder='Search Reason'
                        value={reasonNotPromotedData}
                        style={{ height: 50 }}
                        options={[
                          {
                            label: '*Select*',
                            value: null
                          },
                          {
                            label: 'Student Shuffle Request is Pending',
                            value: 'Student Shuffle Request is Pending'
                          },
                          {
                            label: 'Student Fee Unassign Request is Pending',
                            value: 'Student Fee Unassign Request is Pending'
                          },
                          {
                            label: 'Student InActive',
                            value: 'Student InActive'
                          },
                          {
                            label: 'Student Active/InActive Request is Pending',
                            value: 'Student Active/InActive Request is Pending'
                          },
                          {
                            label: 'I didnt find Previous Fee Plan and Due',
                            value: 'I didnt find Previous Fee Plan and Due'
                          },
                          {
                            label: 'Student Post Date Cheque is Not Clear',
                            value: 'Student Post Date Cheque is Not Clear'
                          }
                        ]}
                        onChange={reasonNotPromotedHandler}
                      />
                    </TableCell>
                    <TableCell colSpan={1} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentNotPromotedList()}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </React.Fragment>
        : [] }
      { dataLoading ? <CircularProgress open /> : null }
    </div>
    </Layout>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  // sections: state.finance.common.sectionsPerGradeAdmin,
  sections: state.finance.accountantReducer.studentPromotion.sectionsPerGrade,
  dataLoading: state.finance.common.dataLoader,
  studentList: state.finance.accountantReducer.studentPromotion.promotionStudentList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  sendStudentPromotionList: (data, alert, user) => dispatch(actionTypes.sendStudentPromotionList({ data, alert, user })),
  studentPromotionList: (data, alert, user) => dispatch(actionTypes.studentPromotionList({ data, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  // fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId }))
  fetchAllSection: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId }))
})

export default connect(mapStateToProps, mapDispatchToProps)((StudentPromotion))
