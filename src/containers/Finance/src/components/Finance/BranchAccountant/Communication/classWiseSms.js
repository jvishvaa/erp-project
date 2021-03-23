import React, {
  useState,
  useEffect
  // useMemo
} from 'react'
import { withStyles, Grid, TextField, Button, Table, TableHead, TableRow, TableBody, TableCell, Paper, TableFooter, TablePagination, IconButton
} from '@material-ui/core/'
import LastPageIcon from '@material-ui/icons/LastPage'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

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
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  approve: {
    backgroundColor: '#008000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  reject: {
    backgroundColor: '#FF0000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B0000'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  }
})

const ClassWiseSms = ({ classes,
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
  sendClassWiseSms,
  ...props }) => {
  const [message, setMessage] = useState(null)
  const [grade, setGrade] = useState(null)
  const [section, setSection] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(null)
  const [isChecked, setIsChecked] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [dontSend, setDontSend] = useState([])

  useEffect(() => {
    if (isAdmin) {
      fetchGradesPerBranch(alert, user, session, branch)
    } else {
      fetchAllGrades(session, alert, user)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('selectAll & isChecked: ', selectAll, Object.keys(isChecked).length)
  })

  useEffect(() => {
    if ((page || rowsPerPage) && section && section.length > 0) {
      const sec = section.map(item => item.value)
      fetchAllStuList(session, branch, grade.value, sec, rowsPerPage || 10, page + 1, alert, user)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])

  useEffect(() => {
    if (selectAll) {
      const checked = {}
      if (studentList && studentList.results.length) {
        studentList.results.forEach((ele) => {
          checked[ele.erp] = true
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
    setGrade(e)
    fetchAllSections(session, branch, e.value, alert, user)
  }

  const sectionHandler = (e) => {
    setSection(e)
  }

  const messageHandler = (e) => {
    setMessage(e.target.value)
  }

  const sendClassSmsHandler = () => {
    // send the msg
    if (section && grade) {
      const sec = section && section.map(item => item.value)
      fetchAllStuList(session, branch, grade.value, sec, rowsPerPage || 10, page + 1, alert, user)
    } else {
      alert.warning('Fill all the Fields!')
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

  const firstPageChange = () => {
    setPage(0)
  }

  const lastPageChange = (lastPage) => {
    setPage(lastPage)
  }

  const checkAllLeadsChangeHandler = (e) => {
    const checked = {}
    if (studentList && studentList.results.length) {
      studentList.results.forEach((ele) => {
        checked[ele.erp] = e.target.checked
      })
      setIsChecked(checked)
      setSelectAll(!selectAll)
      setDontSend([])
    }
  }

  const checkHandler = (e, erp) => {
    if (e.target.checked) {
      const newDontSend = dontSend.filter(item => item !== erp)
      setDontSend(newDontSend)
      setIsChecked({ ...isChecked, [erp]: true })
    } else {
      setIsChecked({ ...isChecked, [erp]: false })
      const newDontSend = [...dontSend, erp]
      setDontSend(newDontSend)
    }
  }

  const dontSendHandler = (e, erp) => {
    if (!e.target.checked) {
      const newDontSend = dontSend.filter(ele => ele !== erp)
      setDontSend(newDontSend)
      setIsChecked({ ...isChecked, [erp]: true })
      // remove from dont send
    }
  }

  const sendClassWiseHandler = () => {
    // send all your sms here.
    let selectedErp = []
    if (!selectAll) {
      for (const erp in isChecked) {
        if (isChecked[erp]) {
          selectedErp.push(erp)
        }
      }
    }
    console.log(`Selected All: ${selectAll}, isChecked: ${selectedErp}, dontSend: ${dontSend} `)
    const sec = section.map(item => item.value)
    const data = {
      students: selectAll ? 'all' : selectedErp,
      branch: branch,
      grade: grade.value,
      session_year: session,
      section: sec,
      excluded_students: dontSend,
      message: message
    }
    sendClassWiseSms(data, alert, user)
  }

  const getStudentTableHandler = () => {
    return (
      <Grid container spacing={8}>
        <Grid item className={classes.item} xs={6}>
          <Paper style={{ marginTop: 15 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <input
                      type='checkbox'
                      style={{ width: '15px', height: '15px' }}
                      checked={selectAll}
                      onChange={checkAllLeadsChangeHandler}
                    />
                  </TableCell>
                  <TableCell align='center'>ERP</TableCell>
                  <TableCell align='center'>Student Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList && studentList.results.length
                  ? studentList.results.map((row) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <input
                            type='checkbox'
                            style={{ width: '15px', height: '15px' }}
                            checked={isChecked[row.erp]}
                            onChange={(e) => { checkHandler(e, row.erp) }}
                          />
                        </TableCell>
                        <TableCell>{row.erp}</TableCell>
                        <TableCell>{row.name}</TableCell>
                      </TableRow>
                    )
                  })
                  : null}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+studentList.count / (+rowsPerPage || 10))}`}
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    // count={+applicantsList.count}
                    rowsPerPage={rowsPerPage || 10}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' }
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  <TableCell style={{ marginTop: '13px' }}>
                    <IconButton
                      onClick={firstPageChange}
                      disabled={page === 0 || page === 1}
                    >
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => lastPageChange(Math.ceil(studentList.count / (rowsPerPage || 10)) - 1)}
                      disabled={page === (Math.ceil(studentList.count / (rowsPerPage || 10)) - 1)}
                    >
                      <LastPageIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
        <Grid item className={classes.item} xs={5}>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dontSend && dontSend.length
                    ? dontSend.map((erp) => {
                      return (
                        <TableRow>
                          <TableCell>
                            <input
                              type='checkbox'
                              style={{ width: '15px', height: '15px' }}
                              checked={erp}
                              onChange={(e) => { dontSendHandler(e, erp) }}
                            />
                          </TableCell>
                          <TableCell>{erp}</TableCell>
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
      <Grid container spacing={3} style={{ margin: 5 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Grade*</label>
          <Select
            placeholder='Select'
            value={grade}
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
            onChange={(e) => { gradeHandler(e) }}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <label>Section*</label>
          <Select
            placeholder='Select Section'
            isMulti
            // value={section}
            options={
              sectionData
                ? sectionData.map(sec => ({
                  value: sec.section.id,
                  label: sec.section.section_name
                }))
                : []
            }
            onChange={(e) => { sectionHandler(e) }}
          />
        </Grid>
        <Grid item className={classes.item} xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={false} onClick={() => { sendClassSmsHandler() }} className={classes.btn}>GET</Button>
        </Grid>
        {studentList && studentList.results && studentList.results.length ? getStudentTableHandler() : null}
      </Grid>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Message*</label>
          <TextField
            id='message'
            type='text'
            // className={classes.textField}
            disabled={!Object.keys(isChecked).length}
            value={message || ''}
            onChange={(e) => { messageHandler(e) }}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          {selectAll && dontSend.length ? `Send ALL, except ${dontSend.length} students.` : null}
          <Button style={{ marginTop: 20 }} variant='contained' disabled={!Object.keys(isChecked).length} onClick={() => { sendClassWiseHandler() }} className={classes.btn}>Send Message</Button>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

ClassWiseSms.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  gradeData: state.finance.accountantReducer.changeFeePlan.gradeData,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  studentList: state.finance.accountantReducer.communicationSms.studentList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchAllStuList: (session, branch, grade, section, pageSize, page, alert, user) => dispatch(actionTypes.fetchAllStuList({ session, branch, grade, section, pageSize, page, alert, user })),
  fetchAllGrades: (session, alert, user) => dispatch(actionTypes.fetchAllGrades({ session, alert, user })),
  fetchAllSections: (session, branch, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, branch, gradeId, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  sendClassWiseSms: (data, alert, user) => dispatch(actionTypes.sendClassWiseSms({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ClassWiseSms)))
