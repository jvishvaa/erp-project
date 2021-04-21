import React, { Component } from 'react'
import axios from 'axios'
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// import * as actionTypes from '../../store/actions'
import '../../../css/staff.css'
import { urls } from '../../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    border: '1px solid black',
    borderRadius: 4
  }
})

class DueDateWise extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeStructureDetails: []
    }
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
    if (this.props.dueDateWiseList.length && this.props.dueDateWiseList) {
      tableData = this.props.dueDateWiseList.map((row, i) => {
        return (
          <div className={classes.tableWrapper}>
            {row.installments.map((data, j) => {
              return (
                <Table>
                  <TableHead>
                    <TableRow >
                      <TableCell style={{ fontSize: '16px' }} >Due Date: {data.due_date}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Installment</TableCell>
                      <TableCell>Installment Amount</TableCell>
                      <TableCell>Fee Name</TableCell>
                      <TableCell>Fee Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    <TableRow hover >
                      <TableCell>{data.installment_name}</TableCell>
                      <TableCell>{data.installment_amount}</TableCell>
                      <TableCell>{row.fee_type_name}</TableCell>
                      <TableCell>{row.fee_type_amount}</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              )
            })}
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
  // dueDateWiseList: state.finance.studentFeeStructure.feeStructurelist
})

const mapDispatchToProps = dispatch => ({
  // fetchListDefaultView: (alert, user) => dispatch(actionTypes.fetchStudentFeeStructureList({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(DueDateWise)))
