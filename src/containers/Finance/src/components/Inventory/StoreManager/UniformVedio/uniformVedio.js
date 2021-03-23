import React, { useEffect } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import {
  Grid
} from '@material-ui/core/'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const UniformVedio = ({ fetchUniformVedioUrl, user, alert }) => {
//   const [vedio, setVedio] = useState(null)

  useEffect(() => {
    // fetchUniformVedioUrl(alert, user)
  })

  return (
    <div>
      <Grid container spacing='3' style={{ padding: 15 }}>
        <Grid item xs={12}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe width='70%' height='475px' src='https://letseduvate.s3.ap-south-1.amazonaws.com/finance/media/bulk_uniform_upload_video.mp4?playlist=tgbNymZ7vqY?controls=1' />
          </Grid>
        </Grid>
      </Grid>
    </div>

  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.accountantReducer.pdc.gradeData,
  sectionList: state.finance.accountantReducer.changeFeePlan.sectionData,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  fetchUniformVedioUrl: (alert, user) => dispatch(actionTypes.fetchUniformVedioUrl({ alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((UniformVedio))
