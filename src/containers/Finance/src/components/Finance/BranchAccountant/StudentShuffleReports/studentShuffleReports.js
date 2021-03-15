import React, {
  useEffect,
  useState
} from 'react'
import { withStyles, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core/'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import zipcelx from 'zipcelx'
import { connect } from 'react-redux'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  headersSize: {
    fontSize: '14px',
    paddingRight: '5px'
  }
})

const ShuffleReports = ({ classes, session, dataLoading, branches, fetchGradeList, externalshuffleDetail, internalshuffleDetail, fetchInternalShuffle, fetchExternalShuffle, gradeList, fetchBranches, alert, user }) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' })
  const [reportType, setReportType] = useState(null)
  const [internalSubType, setInernalSubType] = useState(null)
  const [grade, setGrade] = useState(null)
  const [externalShuffleType, setExternalShuffleType] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [disableBut, setDisableBut] = useState(true)
  useEffect(() => {
    console.log('external', externalshuffleDetail)
  })
  const downloadReport = () => {
    const headers = [
      {
        value: 'S.No',
        type: 'string'
      },
      {
        value: 'Erp',
        type: 'string'
      },
      {
        value: 'Student Name',
        type: 'string'
      },
      {
        value: 'From class',
        type: 'string'
      },
      {
        value: 'To class',
        type: 'string'
      },
      {
        value: 'From Section',
        type: 'string'
      },
      {
        value: 'To Section',
        type: 'string'
      },
      {
        value: 'From Branch',
        type: 'string'
      },
      {
        value: 'To Branch',
        type: 'string'
      },
      {
        value: 'Request By',
        type: 'string'
      },
      {
        value: 'Request Date',
        type: 'string'
      },
      {
        value: 'Remark',
        type: 'string'
      },
      {
        value: 'Status',
        type: 'string'
      },
      {
        value: 'Approved By',
        type: 'string'
      },
      {
        value: 'Approved Remarks',
        type: 'string'
      },
      {
        value: 'Approved Date',
        type: 'string'
      }
    ]
    const body = (reportType && reportType.value === 2 ? externalshuffleDetail && externalshuffleDetail : internalshuffleDetail && internalshuffleDetail).map((val, i) => {
      return ([
        {
          value: i + 1,
          type: 'string'
        },
        {
          value: val.student && val.student.erp,
          type: 'string'
        },
        {
          value: val.student && val.student.name,
          type: 'string'
        },
        {
          value: val.grade_from && val.grade_from.grade,
          type: 'string'
        },
        {
          value: val.grade_to && val.grade_to.grade,
          type: 'string'
        },
        {
          value: val.section_from && val.section_from.section_name,
          type: 'string'
        },
        {
          value: val.section_to && val.section_to.section_name,
          type: 'string'
        },
        {
          value: val.branch_from && val.branch_from.branch_name,
          type: 'string'
        },
        {
          value: val.branch_to && val.branch_to.branch_name,
          type: 'string'
        },
        {
          value: val.shuffle_initiated_by && val.shuffle_initiated_by.first_name,
          type: 'string'
        },
        {
          value: val.shuffle_initiation_date,
          type: 'string'
        },
        {
          value: val.reason,
          type: 'string'
        },
        {
          value: val.admin_approve_status,
          type: 'string'
        },
        {
          value: val.to_approve_status_updated_by && val.to_approve_status_updated_by.first_name,
          type: 'string'
        },
        {
          value: val.to_approve_status_remarks,
          type: 'string'
        },
        {
          value: val.to_approve_status_date,
          label: 'string'
        }
      ])
    })
    console.log('body: ', body)
    // const body = [
    //   {
    //     value: promoted,
    //     type: 'string'
    //   }
    // ]
    const config = {
      filename: reportType && reportType.value === 2 ? 'External_Shuffle_Report' : 'Internal_Shuffle_Report',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }

  const handleSession = (e) => {
    setSession(e)
    // fetchStudentShuffle(alert, user)
  }

  const handleShuffleReportType = (e) => {
    setReportType(e)
    if (e.value === 2) {
      fetchBranches(sessionYear.value, alert, user)
    }
    setInernalSubType(null)
    setDisableBut(true)
  }
  const handleInternalShuffleSubType = (e) => {
    setInernalSubType(e)
    if (e.value === 2) {
      fetchGradeList(alert, user)
    }
    setDisableBut(true)
  }
  const handleGrade = (e) => {
    setGrade(e)
    setDisableBut(true)
  }
  const handleExternalShuffleFrom = (e) => {
    setExternalShuffleType(e)
    setDisableBut(true)
  }

  const handleShuffleReport = (e) => {
    if (sessionYear && reportType && reportType.value === 1) {
      if (internalSubType) {
        if (internalSubType && internalSubType.value === 2 && grade) {
          let session = sessionYear && sessionYear.value
          // report_type: reportType && reportType.value
          let type = internalSubType && internalSubType.value
          let gradeId = grade && grade.value
          fetchInternalShuffle(session, type, gradeId, alert, user)
          setShowTable(true)
          setDisableBut(false)
        } else if (internalSubType && internalSubType.value === 1) {
          let session = sessionYear && sessionYear.value
          // let type = reportType && reportType.value,
          let type = internalSubType && internalSubType.value
          fetchInternalShuffle(session, type, grade && grade.value, alert, user)
          setShowTable(true)
          setDisableBut(false)
        } else {
          alert.warning('Fill all the Required Fields!')
        }
      } else {
        alert.warning('Fill all the Required Fields!')
      }
    } else {
      if (sessionYear && reportType && externalShuffleType) {
        let session = sessionYear && sessionYear.value
        //   report_type: reportType && reportType.value,
        let type = externalShuffleType && externalShuffleType.value
        fetchExternalShuffle(session, type, alert, user)
        setShowTable(true)
        setDisableBut(false)
      } else {
        alert.warning('Fill all the Required Fields!')
      }
    }
  }
  const externalShuffleReport = () => {
    let externalReport = (
      <div style={{ overflowX: 'scroll' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headersSize}>S.No</TableCell>
              <TableCell className={classes.headersSize}>Erp</TableCell>
              <TableCell className={classes.headersSize}>Student Name  </TableCell>
              <TableCell className={classes.headersSize}>Class From </TableCell>
              <TableCell className={classes.headersSize}>Class To </TableCell>
              <TableCell className={classes.headersSize}>Section From</TableCell>
              <TableCell className={classes.headersSize}>Section To</TableCell>
              <TableCell className={classes.headersSize}>From Branch </TableCell>
              <TableCell className={classes.headersSize}>To Branch </TableCell>
              <TableCell className={classes.headersSize}>Request By </TableCell>
              <TableCell className={classes.headersSize}>Request Date </TableCell>
              <TableCell className={classes.headersSize}>Remarks </TableCell>
              <TableCell className={classes.headersSize}>Status </TableCell>
              <TableCell className={classes.headersSize}>Approved By</TableCell>
              <TableCell className={classes.headersSize}>Approved Remarks </TableCell>
              <TableCell className={classes.headersSize}>Approved Date</TableCell>
            </TableRow>
          </TableHead>

          {(reportType && reportType.value === 2 ? externalshuffleDetail && externalshuffleDetail : internalshuffleDetail && internalshuffleDetail).map((val, i) => {
            return (
              <TableBody>
                <TableRow>
                  <TableCell>{i + 1} </TableCell>
                  <TableCell>{val.student && val.student.erp} </TableCell>
                  <TableCell>{val.student && val.student.name} </TableCell>
                  <TableCell>{val.grade_from && val.grade_from.grade} </TableCell>
                  <TableCell>{val.grade_to && val.grade_to.grade} </TableCell>
                  <TableCell>{val.section_from && val.section_from.section_name} </TableCell>
                  <TableCell>{val.section_to && val.section_to.section_name} </TableCell>
                  <TableCell>{val.branch_from && val.branch_from.branch_name} </TableCell>
                  <TableCell>{val.branch_to && val.branch_to.branch_name} </TableCell>
                  <TableCell>{val.shuffle_initiated_by && val.shuffle_initiated_by.first_name} </TableCell>
                  <TableCell> {val.shuffle_initiation_date}</TableCell>
                  <TableCell> { val.reason}</TableCell>
                  <TableCell>{val.admin_approve_status} </TableCell>
                  <TableCell> {val.to_approve_status_updated_by && val.to_approve_status_updated_by.first_name}</TableCell>
                  <TableCell> {val.to_approve_status_remarks}</TableCell>
                  <TableCell> {val.to_approve_status_date}</TableCell>
                </TableRow>
              </TableBody>
            )
          })
          }
        </Table>
      </div>

    )
    return externalReport
  }
  return (
    <React.Fragment>
      <Grid container direction='row' justify='flex-end' spacing={3} style={{ padding: 15 }}>
        <Grid item xs={3}>
          <Button variant='contained' color='primary' disabled={disableBut} onClick={downloadReport}>DOWNLOAD REPORT</Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ padding: 15, marginBottom: 60 }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
            value={sessionYear || ''}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={(e) => handleSession(e)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Shuffle Report Type*</label>
          <Select
            placeholder='Report Type'
            value={reportType || ''}
            options={[
              {
                label: 'Internal Shuffle',
                value: 1
              },
              {
                label: 'External shuffle',
                value: 2
              }
            ]}
            onChange={(e) => handleShuffleReportType(e)}
          />
        </Grid>{reportType && reportType.value === 1
          ? <Grid item xs={3}>
            <label>Shuffle Sub Type*</label>
            <Select
              placeholder='Select shuffle Subtype'
              value={internalSubType || ''}
              options={[
                {
                  label: 'Class Shuffle',
                  value: 1
                },
                {
                  label: 'Section Shuffle',
                  value: 2
                }
              ]}
              onChange={(e) => handleInternalShuffleSubType(e)}
            />
          </Grid>
          : []}
        {reportType && reportType.value === 2
          ? <Grid item xs={3}>
            <label>Type*</label>
            <Select
              placeholder='Select shuffle Subtype'
              value={externalShuffleType || ''}
              options={[
                {
                  label: 'Shuffle From',
                  value: 1
                },
                {
                  label: 'Shuffle To',
                  value: 2
                }
              ]}
              onChange={(e) => handleExternalShuffleFrom(e)}
            />
          </Grid>
          : [] }
        {internalSubType && internalSubType.value === 2
          ? <Grid item xs={3}>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={grade || ''}
              options={gradeList
                ? gradeList.map(grades => ({
                  value: grades.id,
                  label: grades.grade
                })) : []}
              onChange={(e) => handleGrade(e)}
            />
          </Grid>
          : []}
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 20 }}
            onClick={handleShuffleReport}
          >
            GET
          </Button>
        </Grid>
      </Grid>
      <div>
        {showTable
          ? <div>
            <hr />
            {externalShuffleReport()}
          </div>
          : [] }
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}
ShuffleReports.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  gradeList: state.finance.common.gradeList,
  // studentShuffle: state.finance.accountantReducer.studentShuffle.shuffleDetails,
  internalshuffleDetail: state.finance.accountantReducer.shuffleReports.internalshuffleDetails,
  externalshuffleDetail: state.finance.accountantReducer.shuffleReports.externalshuffleDetails
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchInternalShuffle: (session, type, grade, alert, user) => dispatch(actionTypes.fetchInternalShuffle({ session, type, grade, alert, user })),
  fetchExternalShuffle: (session, type, alert, user) => dispatch(actionTypes.fetchExternalShuffle({ session, type, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ShuffleReports)))
