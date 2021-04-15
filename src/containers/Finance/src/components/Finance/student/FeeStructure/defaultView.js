import React, { Component } from 'react'
import axios from 'axios'
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import '../../../css/staff.css'
// import * as actionTypes from '../../store/actions'
import { urls } from '../../../../urls'
// import { apiActions } from '../../../../_actions'
// import FeeStructure from './FeeStructure'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  }
})

class DefaultView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeStructureDetails: []
    }
    this.defaultTable = this.defaultTable.bind(this)
  }

  componentDidMount () {
    if (!this.props.getList && !this.props.defaultViewList) {
      this.props.alert.warning('Unable To Load')
    }
  }

  // call to fetch data
  defaultTable = () => {
    axios
      .get(urls.FeeStructureDefault, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.data === 'wrong') {
          this.props.alert.warning('No Data')
        } else
        if (+res.status === 200) {
          this.setState({ feeStructureDetails: res.data })
        }
      })
      .catch((error) => {
        this.props.alert.error('Something Went Wrong')
        console.log("Error: Couldn't fetch data from " + urls.FeeStructureDefault + error)
      })
  }

  render () {
    let { classes } = this.props
    let tableData = null
    if (this.props.defaultViewList && this.props.defaultViewList.length) {
      tableData = this.props.defaultViewList.map((row, i) => {
        return (
          <div className={classes.tableWrapper}>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell style={{ fontSize: '16px' }} >Fee Name: {row.fee_type_name}</TableCell>
                  <TableCell style={{ fontSize: '16px' }} colSpan={2}>Fee Amount: {row.fee_type_amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Installment</TableCell>
                  <TableCell>Installment Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.installments.map((data, j) => {
                  return (
                    <TableRow hover >
                      <TableCell>{data.installment_name}</TableCell>
                      <TableCell>{data.installment_amount}</TableCell>
                      <TableCell>{data.due_date}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )
      })
    } else {
      tableData = 'No Data !!!'
    }
    return (
      <React.Fragment>
        {tableData}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
  // defaultViewList: state.finance.studentFeeStructure.feeStructurelist
  // session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  // loadSession: dispatch(apiActions.listAcademicSessions()),
  // fetchListDefaultView: (alert, user) => dispatch(actionTypes.fetchStudentFeeStructureList({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(DefaultView)))
