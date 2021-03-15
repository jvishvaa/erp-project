import React, {
  useState,
  useEffect
  // useMemo
} from 'react'
import { withStyles,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import TablePaginationActions from '../../TablePaginationAction'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  root: {
    // overflowX: 'auto'
  },
  paginationRoot: {
    paddingLeft: '0px',
    paddingRight: '0px'
  }
})

const MSG_TYPE = [
  { id: 1, label: 'Installment and Balance Wise' },
  { id: 2, label: 'Fee Type and Installment Wise' }
]

const DefaulterSms = ({ classes,
  session,
  branch,
  isAdmin,
  history,
  dataLoading,
  alert,
  user,
  fetchGradesPerBranch,
  fetchAllGrades,
  fetchAllSections,
  gradesPerBranch,
  gradeData,
  sectionData,
  fetchAllStuList,
  studentList,
  fetchFeePlanNames,
  fetchFeeTypes,
  fetchInstallments,
  feePlans,
  clearDefaultersList,
  feeTypes,
  ...props }) => {
  const [grade, setGrade] = useState([])
  const [selectedFeePlan, setSelectedFeePlan] = useState([])
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([])
  const [selectedInstallments, setSelectedInstallments] = useState([])
  const [gradeValue, setGradeValue] = useState([])
  const [planValue, setPlanValue] = useState([])
  const [typeValue, setTypeValue] = useState([])
  const [instValue, setInstValue] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(null)
  const [isChecked, setIsChecked] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [dontSend, setDontSend] = useState([])
  const [selectedMsgTyp, setSelectedMsgTyp] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      fetchGradesPerBranch(alert, user, session, branch)
    } else {
      fetchAllGrades(session, alert, user)
    }
    return () => {
      clearDefaultersList()
    }
  }, [
    fetchGradesPerBranch,
    clearDefaultersList,
    fetchAllGrades,
    alert,
    user,
    session,
    branch,
    isAdmin
  ])

  useEffect(() => {
    if (gradeValue.length) {
      fetchFeePlanNames(session, branch, gradeValue, alert, user)
    }
  }, [
    gradeValue,
    fetchFeePlanNames,
    session,
    branch,
    alert,
    user,
    isAdmin,
    gradesPerBranch,
    gradeData
  ])

  useEffect(() => {
    if (planValue.length) {
      fetchFeeTypes(session, branch, gradeValue, planValue, alert, user)
    }
  }, [
    planValue,
    fetchFeeTypes,
    user,
    alert,
    gradeValue,
    branch,
    session,
    feePlans
  ])

  useEffect(() => {
    if (typeValue.length) {
      let data = {}
      if (!isAdmin) {
        data = {
          academic_year: session,
          fee_types: typeValue,
          fee_plan: planValue,
          grades: gradeValue,
          branch: branch
        }
      } else {
        data = {
          branch: branch,
          academic_year: session,
          fee_types: typeValue,
          fee_plan: planValue,
          grades: gradeValue
        }
      }
      fetchInstallments(data, alert, user)
    }
  }
  , [
    fetchInstallments,
    alert,
    user,
    isAdmin,
    typeValue,
    planValue,
    gradeValue,
    session,
    branch
  ])

  useEffect(() => {
    if ((page || rowsPerPage) && instValue.length) {
      props.fetchFeeDefaultersList(session, branch, gradeValue, page + 1, rowsPerPage || 10, instValue, alert, user)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])

  useEffect(() => {
    if (selectAll) {
      const checked = {}
      if (studentList && studentList.results.length) {
        studentList.results.forEach((ele) => {
          checked[ele.id] = true
        })
        if (dontSend.length) {
          dontSend.map((number) => {
            checked[number] = false
          })
        }
        setIsChecked(checked)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentList])

  const gradeHandler = (e) => {
    setPlanValue([])
    setSelectedFeePlan([])
    setSelectedFeeTypes([])
    setSelectedInstallments([])

    const allLabel = e.filter(event => {
      return event.label === 'All Grades'
    })
    if (allLabel.length) {
      setGrade([{
        label: 'All Grades',
        value: 'all'
      }])
    } else {
      setGrade(e)
    }
    let gradeValueInit = []
    if (e.length && e[0].value === 'all') {
      if (isAdmin && gradesPerBranch) {
        const gradeToChange = [...gradesPerBranch]
        gradeValueInit = gradeToChange.splice(1).map(item => item.grade.id)
      } else {
        const gradeToChange = [...gradeData]
        gradeValueInit = gradeToChange.splice(1).map(item => item.grade.id)
      }
    } else if (e.length) {
      gradeValueInit = e.map(item => item.value)
    }
    setGradeValue(gradeValueInit)
    // fetchAllSections(session, branch, e.value, alert, user)
  }

  const feePlanChangeHandler = (e) => {
    setSelectedFeeTypes([])
    setSelectedInstallments([])
    setTypeValue([])

    const allLabel = e.filter(event => {
      return event.label === 'All Fee Plan'
    })
    if (allLabel.length) {
      setSelectedFeePlan([
        {
          label: 'All Fee Plan',
          value: 'all'
        }
      ])
    } else {
      setSelectedFeePlan(e)
    }

    let planValueInit = []
    if (e.length && e[0].value === 'all') {
      const planToChange = [...feePlans]
      planValueInit = planToChange.splice(1).map(item => item.id)
    } else if (e.length) {
      planValueInit = e.map(item => item.value)
    }
    setPlanValue(planValueInit)
  }

  const feeTypeChangehandler = (e) => {
    setSelectedInstallments([])
    setInstValue([])

    const allLabel = e.filter(event => {
      return event.value === 'all'
    })
    if (allLabel.length) {
      setSelectedFeeTypes([{
        label: 'All Fee Types',
        value: 'all'
      }])
    } else {
      setSelectedFeeTypes(e)
    }

    let typeValueInit = []
    if (e.length && e[0].value === 'all') {
      const typeToChange = [...feeTypes]
      typeValueInit = typeToChange.splice(1).map(item => item.id)
    } else if (e.length) {
      typeValueInit = e.map(item => item.value)
    }
    setTypeValue(typeValueInit)
  }

  const installmentsChangeHandler = (e) => {
    const allLabel = e.filter(event => {
      return event.label === 'All Grades'
    })
    if (allLabel.length) {
      setSelectedInstallments(allLabel)
    } else {
      setSelectedInstallments(e)
    }

    let instValueInit = []
    if (e.length && e[0].value === 'all') {
      const typeToChange = [...props.installments]
      instValueInit = typeToChange.splice(1).map(item => item.id)
    } else if (e.length) {
      instValueInit = e.map(item => item.value)
    }
    setInstValue(instValueInit)
  }

  const getStudentHandler = () => {
    if (instValue.length) {
      props.fetchFeeDefaultersList(session, branch, gradeValue, page + 1, rowsPerPage || 10, instValue, alert, user)
    } else {
      alert.warning('Select All Fields')
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  const checkAllLeadsChangeHandler = (e) => {
    const checked = {}
    if (studentList && studentList.results.length) {
      studentList.results.forEach((ele) => {
        checked[ele.id] = e.target.checked
      })
      setIsChecked(checked)
      setSelectAll(c => !c)
      setDontSend([])
    }
  }

  const checkHandler = (e, id) => {
    if (e.target.checked) {
      const newDontSend = dontSend.filter(item => item !== id)
      setDontSend(newDontSend)
      setIsChecked({ ...isChecked, [id]: true })
    } else {
      setIsChecked({ ...isChecked, [id]: false })
      const newDontSend = [...dontSend, id]
      setDontSend(newDontSend)
    }
  }

  const dontSendHandler = (e, id) => {
    if (!e.target.checked) {
      const newDontSend = dontSend.filter(ele => ele !== id)
      setDontSend(newDontSend)
      setIsChecked({ ...isChecked, [id]: true })
      // remove from dont send
    }
  }

  const sendMessageHandler = () => {
    let body = {}
    const students = selectAll ? 'all' : Object.keys(isChecked).filter(erp => isChecked[erp])
    if (isAdmin) {
      body = {
        students: students,
        'session_year': session,
        branch: branch,
        'message_type': selectedMsgTyp.value,
        grade: gradeValue,
        excluded_students: dontSend,
        installments: instValue
      }
    } else {
      body = {
        students: students,
        'session_year': session,
        'message_type': selectedMsgTyp.value,
        grade: gradeValue,
        excluded_students: dontSend,
        installments: instValue
      }
    }
    props.sendDefaulterSms(body, user, alert)
  }

  const getStudentTableHandler = () => {
    return (
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={3}>
          <Paper style={{ marginTop: 15, width: '100%' }}>
            <Table className={classes.root}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <input
                      type='checkbox'
                      style={{ width: '15px', height: '15px' }}
                      checked={selectAll}
                      onChange={checkAllLeadsChangeHandler}
                    />
                  </TableCell>
                  <TableCell align='center'>ERP</TableCell>
                  <TableCell align='center'>Student Name</TableCell>
                  <TableCell align='center'>Installment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList && studentList.results.length
                  ? (studentList.results.map((row) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <input
                            type='checkbox'
                            style={{ width: '15px', height: '15px' }}
                            checked={isChecked[row.id]}
                            onChange={(e) => { checkHandler(e, row.id) }}
                          />
                        </TableCell>
                        <TableCell>{row.student.erp}</TableCell>
                        <TableCell>{row.student.name}</TableCell>
                        <TableCell>{row.installments.installment_name}</TableCell>
                      </TableRow>
                    )
                  }))
                  : null}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+studentList.count / (+rowsPerPage || 10))}`}
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    rowsPerPage={rowsPerPage || 10}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' }
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          {selectAll && dontSend.length
            ? <Paper style={{ marginTop: 15 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>UnSelected Students</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align='center' />
                    <TableCell align='center'>ERP</TableCell>
                    <TableCell align='center'>Installment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dontSend && dontSend.length
                    ? dontSend.map((id) => {
                      const entry = studentList.results.filter(item => item.id === id)
                      return (
                        <TableRow>
                          <TableCell>
                            <input
                              type='checkbox'
                              style={{ width: '15px', height: '15px' }}
                              checked={id}
                              onChange={(e) => { dontSendHandler(e, id) }}
                            />
                          </TableCell>
                          <TableCell>{entry[0].student.erp}</TableCell>
                          <TableCell>{entry[0].installments.installment_name}</TableCell>
                        </TableRow>
                      )
                    })
                    : null}
                </TableBody>
              </Table>
            </Paper>
            : null}
        </Grid>
      </Grid>
    )
  }

  return (
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Grade*</label>
          <Select
            placeholder='Select'
            value={grade}
            isMulti
            options={isAdmin && gradesPerBranch ? gradesPerBranch.map(grades => ({
              value: grades.grade.id,
              label: grades.grade.grade
            }))
              : !isAdmin && gradeData ? gradeData.map(grades => ({
                value: grades.grade.id,
                label: grades.grade.grade
              })) : []
            }
            name='grade'
            onChange={gradeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Fee Plans*</label>
          <Select
            placeholder='Fee Plans'
            value={selectedFeePlan}
            id='feePlans'
            isMulti
            options={
              feePlans && feePlans.length > 0
                ? feePlans.map((feePlan) => (
                  {
                    label: feePlan.fee_plan_name ? feePlan.fee_plan_name : '',
                    value: feePlan.id ? feePlan.id : ''
                  }
                ))
                : []
            }
            onChange={feePlanChangeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Normal Fee Types*</label>
          <Select
            placeholder='Fee Types'
            isMulti
            id='fee_types'
            value={selectedFeeTypes}
            options={
              feeTypes && feeTypes.length
                ? feeTypes.map(feeTypes => ({
                  value: feeTypes.id ? feeTypes.id : '',
                  label: feeTypes.fee_type_name ? feeTypes.fee_type_name : ''
                }))
                : []
            }
            onChange={feeTypeChangehandler}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={3}>
          <label>Normal Fee Installments*</label>
          <Select
            placeholder='Installments'
            id='installments'
            isMulti
            value={selectedInstallments}
            options={
              props.installments && props.installments.length
                ? props.installments.map(installments => ({
                  value: installments.id ? installments.id : '',
                  label: installments.installment_name ? installments.installment_name : ''
                }))
                : []
            }
            onChange={installmentsChangeHandler}
          />
        </Grid>
        <Grid item className={classes.item} xs={2}>
          <Button
            style={{ marginTop: 20 }}
            variant='contained'
            disabled={false}
            onClick={getStudentHandler}
            className={classes.btn}
          >
              GET
          </Button>
        </Grid>
        {(studentList && studentList.results.length) ? getStudentTableHandler() : null}
      </Grid>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item className={classes.item} xs={3}>
          <label>Message Type*</label>
          <Select
            placeholder='Select'
            value={selectedMsgTyp}
            options={MSG_TYPE.map(item => ({
              label: item.label,
              value: item.id
            }))}
            name='message'
            onChange={(e) => setSelectedMsgTyp(e)}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <Button
            style={{ marginTop: 20 }}
            variant='contained'
            disabled={!Object.keys(isChecked).length || !instValue.length}
            onClick={sendMessageHandler}
            className={classes.btn}
          >
            Send Message
          </Button>
        </Grid>
        <Grid item xs={3}>
          {selectAll && dontSend.length ? `Send ALL, except ${dontSend.length} students.` : null}
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

DefaulterSms.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  gradesPerBranch: state.finance.common.multGradesPerBranch,
  gradeData: state.finance.accountantReducer.changeFeePlan.gradeData,
  feePlans: state.finance.totalPaidDueReports.multFeePlans,
  installments: state.finance.totalPaidDueReports.multInstallmentList,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  feeTypes: state.finance.totalPaidDueReports.multFeeTypes,
  studentList: state.finance.accountantReducer.communicationSms.defaultersStudentList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchAllStuList: (session, branch, grade, section, alert, user) => dispatch(actionTypes.fetchAllStuList({ session, branch, grade, section, alert, user })),
  fetchFeeTypes: (session, branch, grade, feePlanId, alert, user) => dispatch(actionTypes.fetchFeeTypesPaidReportsPerBranch({ session, branch, grade, feePlanId, alert, user })),
  fetchInstallments: (data, alert, user) => dispatch(actionTypes.fetchInstallmentListPerFeeType({ data, alert, user })),
  fetchAllGrades: (session, alert, user) => dispatch(actionTypes.fetchAllGrades({ session, alert, user })),
  fetchAllSections: (session, branch, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, branch, gradeId, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  fetchFeePlanNames: (session, branch, grades, alert, user) => dispatch(actionTypes.feePlanNamesWithoutOtherFee({ session, branch, grades, alert, user })),
  sendDefaulterSms: (body, user, alert) => dispatch(actionTypes.sendDefaulterSms({ body, user, alert })),
  clearDefaultersList: () => dispatch({ type: actionTypes.CLEAR_DEFAULTERS_LIST }),
  fetchFeeDefaultersList: (session, branch, grade, page, pageSize, installments, alert, user) => dispatch(actionTypes.fetchFeeDefaulters({ session, branch, grade, page, pageSize, installments, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(DefaulterSms)))
