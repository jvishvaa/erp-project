import React, {
//   useEffect,
  useState
} from 'react'
import { withStyles, Grid, Button
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
// import zipcelx from 'zipcelx'
import { connect } from 'react-redux'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import { urls } from '../../../../urls'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  headersSize: {
    fontSize: '14px',
    paddingRight: '5px'
  }
})

const ContactDetailsReport = ({ classes, session, dataLoading, branches, downloadReports, contactDetailsReport, fetchStudentDetailsReport, sectionData, fetchGradeList, fetchAllSections, externalshuffleDetail, internalshuffleDetail, fetchInternalShuffle, fetchExternalShuffle, gradeList, fetchBranches, alert, user }) => {
  const [sessionYear, setSession] = useState(null)
  const [grade, setGrade] = useState(null)
  const [section, setSection] = useState(null)
  const [status, setStatus] = useState('')

  const handleSession = (e) => {
    setSession(e)
    fetchGradeList(alert, user)
  }

  const handleGrade = (e) => {
    setGrade(e)
    fetchAllSections(sessionYear.value, e.value, alert, user)
  }
  const handleSection = (e) => {
    setSection(e)
  }
  const handleStatus = (e) => {
    setStatus(e)
  }
  const handleShuffleReport = (e) => {
    if (sessionYear && grade && section && status) {
      let url = `${urls.ContactDetails}?session_year=${sessionYear.value}&grade=${grade.value}&section=${section.value}&status=${status.value === 'Both' ? 'both' : status.value === 'Active' ? 'true' : 'false'}`
      downloadReports('StudentDetailsReport.xlsx', url, alert, user)
    } else if (sessionYear && grade && status) {
      let url = `${urls.ContactDetails}?session_year=${sessionYear.value}&grade=${grade.value}&status=${status.value === 'Both' ? 'both' : status.value === 'Active' ? 'true' : 'false'}`
      downloadReports('StudentDetailsReport.xlsx', url, alert, user)
    } else if (sessionYear && status) {
      let url = `${urls.ContactDetails}?session_year=${sessionYear.value}&status=${status.value === 'Both' ? 'both' : status.value === 'Active' ? 'true' : 'false'}`
      downloadReports('StudentDetailsReport.xlsx', url, alert, user)
    } else {
      alert.warning('Fill required Fields! ')
    }
  }
  return (
    <React.Fragment>
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
        <Grid item xs='3'>
          <label>Section*</label>
          <Select
            placeholder='Select Section'
            value={section}
            options={
              sectionData
                ? sectionData.map(sec => ({
                  value: sec.section && sec.section.id ? sec.section.id : '',
                  label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                }))
                : []
            }
            onChange={handleSection}
          />
        </Grid>
        <Grid item xs='3'>
          <label>Status*</label>
          <Select
            placeholder='Select Section'
            value={status}
            options={[
              {
                value: 'Active',
                label: 'Active'
              },
              {
                value: 'Inactive',
                label: 'Inactive'
              },
              {
                value: 'Both',
                label: 'Both'
              }
            ]}
            onChange={handleStatus}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 20 }}
            onClick={handleShuffleReport}
          >
              DOWNLOAD REPORT
          </Button>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  sectionData: state.finance.common.sectionsPerGrade,
  gradeList: state.finance.common.gradeList
})

const mapDispatchToProps = dispatch => ({
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, gradeId, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ContactDetailsReport)))
