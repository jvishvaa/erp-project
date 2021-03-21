import React, {
  useEffect
} from 'react'
import {
  Typography, withStyles, Table, TableHead, TableRow, TableBody, TableCell
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { apiActions } from '../../../../../_actions'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
// import { makeStyles } from '@material-ui/core/styles'

const styles = theme => ({
  cardWrapper: {
    maxWidth: 275,
    margin: 10
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

const PostDateCount = ({
  classes,
  fetchRecentDated,
  postDatedList,
  history,
  dataLoading,
  alert,
  user
}) => {
  useEffect(() => {
    // console.log('count', countPostDate)
    fetchRecentDated(alert, user)
  }, [fetchRecentDated, alert, user])

  const postdateTable = () => {
    let table = null
    table = (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Transaction Id.
            </TableCell>
            <TableCell>
              Cheque No.
            </TableCell>
            <TableCell>
              Date Of Cheque
            </TableCell>
            <TableCell>
              Ifsc
            </TableCell>
            <TableCell>
              Micr
            </TableCell>
            <TableCell>
              Bank Name
            </TableCell>
            <TableCell>
              Bank Branch
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postDatedList && postDatedList.length
            ? postDatedList.map((row) => {
              return (
                <TableRow>
                  <TableCell>
                    {row.transaction_id}
                  </TableCell>
                  <TableCell>
                    {row.cheque_number}
                  </TableCell>
                  <TableCell>
                    {row.date_of_cheque}
                  </TableCell>
                  <TableCell>
                    {row.ifsc_code}
                  </TableCell>
                  <TableCell>
                    {row.micr_code}
                  </TableCell>
                  <TableCell>
                    {row.bank_name}
                  </TableCell>
                  <TableCell>
                    {row.bank_branch}
                  </TableCell>
                </TableRow>
              )
            })
            : null}
        </TableBody>
      </Table>
    )
    return table
  }
  return (
    <React.Fragment>
      <Typography variant='h5' align='center'>Upcoming Post Dated Cheques</Typography>
      <div>
        {postdateTable()}
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

PostDateCount.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  postDatedList: state.finance.accountantReducer.financeAccDashboard.postDatedList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchRecentDated: (alert, user) => dispatch(actionTypes.fetchRecentDated({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(PostDateCount)))
