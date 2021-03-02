import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
// import { Button } from 'semantic-ui-react'
import { Button, Table, TableRow, TableCell, TableBody, TableHead, TablePagination } from '@material-ui/core/'

// import 'react-table/react-table.css'

import * as actionTypes from '../../store/actions'
// import { apiActions } from '../../../../_actions'

// let studentIds = []
class UnassignedStudents extends Component {
  state = {
    isChecked: {},
    checkedAll: false,
    // due_date: '',
    rowChecked: [],
    amount: null,
    page: 0,
    rowsPerPage: 10
  }
  componentDidMount () {
    if (
      this.props.getState &&
      this.props.sessionId &&
      this.props.otherFeeId &&
      this.props.gradeId &&
      this.props.sectionId) {
      this.props.fetchStudentList(
        this.props.sessionId,
        this.props.otherFeeId,
        this.props.gradeId,
        this.props.sectionId,
        'unassigned',
        this.props.alert,
        this.props.user
      )
    } else {
      this.props.alert.warning('Please fill All madatory Filled')
    }
    const checked = {}
    this.props.studentLists.forEach(element => {
      checked[element.id] = false
    })
    this.setState({
      isChecked: checked
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log('-------nextProps----', nextProps)
    if (this.props.studentLists !== nextProps.studentLists) {
      const checked = {}
      nextProps.studentLists.forEach(element => {
        checked[element.id] = false
      })
      this.setState({
        isChecked: checked
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      sessionId,
      otherFeeId,
      gradeId,
      sectionId,
      alert,
      user
    } = this.props
    if (this.props.getState && (sessionId !== prevProps.sessionId ||
      otherFeeId !== prevProps.otherFeeId ||
      gradeId !== prevProps.gradeId || sectionId !== prevProps.sectionId)) {
      this.props.fetchStudentList(sessionId, otherFeeId, gradeId, sectionId, 'unassigned', alert, user)
    }
    console.log('---------Checked----------')
    console.log(this.state.isChecked)
    console.log(this.props.studentLists)
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  };


  // renderTable = () => {
  //   console.log('from render method!!!')
  //   let dataToShow = []
  //   dataToShow = this.props.studentLists.map((val, i) => {
  //     return {
  //       Sr: (
  //         <input
  //           type='checkbox'
  //           style={{ width: '20px', height: '20px' }}
  //           checked={this.state.isChecked[val.id]}
  //           onChange={(e) => this.handleCheckbox(e, val.id)}
  //         />
  //       ),
  //       erp: val.erp ? val.erp : '',
  //       name: val.name ? val.name : '',
  //       isPromoted: val.is_promoted ? val.is_promoted : '',
  //       reason: val.reason ? val.reason : ''
  //     }
  //   })
  //   return dataToShow
  // }

  // dueDateHandler = (e) => {
  //   this.setState({
  //     due_date: e.target.value
  //   })
  // }

  checkAllStudentsHandler = (e) => {
    let { isChecked } = this.state
    const checked = {}
    if (this.props.studentLists.length > 0) {
      this.props.studentLists.forEach(ele => {
        checked[ele.id] = e.target.checked
      })
      this.setState({
        isChecked: checked,
        checkedAll: !this.state.checkedAll
      }, () => {
        console.log(isChecked)
      })
    }
  }

  handleCheckbox = (event, id) => {
    let { isChecked } = this.state
    if (event.target.checked) {
      this.setState({ isChecked: { ...isChecked, [id]: true } })
    } else {
      this.setState({ isChecked: { ...isChecked, [id]: false }, checkedAll: false })
    }
  }

  amountHandler = (e) => {
    if (e.target.value > 0) {
      this.setState({
        amount: e.target.value
      })
    } else {
      this.props.alert.warning('Enter Greater than 0')
    }
  }

  handleSubmit = () => {
    let checkedRowId = []
    checkedRowId = Object.keys(this.state.isChecked).filter(ele => {
      return this.state.isChecked[ele]
    })
    let data = {
      // due_date: this.state.due_date,
      student: checkedRowId,
      other_fee: this.props.otherFeeId,
      amount: +this.state.amount,
      academic_year: this.props.sessionId,
      grade: this.props.gradeId,
      section: this.props.sectionId
    }
    console.log('-------------data--------------', data)
    this.setState({
      rowChecked: checkedRowId
    }, () => {
      if (this.state.rowChecked.length < 1) {
        this.props.alert.warning('Select the Required Fields')
        return false
      }
      if (this.props.isMisc && !this.state.amount) {
        this.props.alert.warning('Enter Amount!')
        return false
      }
      this.props.createOtherFees(data, this.props.alert, this.props.user)
      this.setState({
        due_date: ''
      })
    })
    // this.props.createOtherFees(data, this.props.alert, this.props.user)
    // this.setState({
    //   due_date: '',
    //   rowChecked: []
    // })
    // this.props.clearProps()
  }
  render () {
    console.log('------------------is misc--------', this.props.isMisc)
    // let viewTable = null
    // if (this.props.studentLists) {
    //   viewTable = (<ReactTable
    //     // pages={Math.ceil(this.props.viewBanksList.count / 20)}
    //     data={this.renderTable()}
    //     manual
    //     columns={[
    //       {
    //         Header: 'Sr',
    //         accessor: 'Sr',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'ERP Code',
    //         accessor: 'erp',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Student Name',
    //         accessor: 'name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'is Promoted',
    //         accessor: 'isPromoted',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Reason',
    //         accessor: 'reason',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={this.renderTable().length}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     // page={this.state.page}
    //     // Callbacks
    //     // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // } else {
    //   viewTable = 'No Records Found !!!'
    // }

    let amountToAssign = null
    if (this.props.isMisc) {
      amountToAssign = (
        <div style={{ width: '250px' }}>
          <label>Amount</label>
          <input
            type='number'
            name='amount'
            className='form-control'
            placeholder='Enter Amount'
            value={this.state.amount || ''}
            onChange={(e) => { this.amountHandler(e) }}
          />
        </div>
      )
    }
    return (
      <React.Fragment>
        <input
          type='checkbox'
          style={{ width: '20px', height: '20px', paddingBottom: '25px' }}
          checked={this.state.checkedAll ? this.state.checkedAll : false}
          onChange={this.checkAllStudentsHandler}
        /> &nbsp; <b>Select All Students</b>
        {/* {viewTable} */}
        <React.Fragment>
                          <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> ERP Code</TableCell>
                      <TableCell> Student Name</TableCell>
                      <TableCell> is Promoted</TableCell>
                      <TableCell> Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.studentLists && this.props.studentLists.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell>  <input
            type='checkbox'
            style={{ width: '20px', height: '20px' }}
            checked={this.state.isChecked[val.id]}
            onChange={(e) => this.handleCheckbox(e, val.id)}
          /></TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.erp ? val.erp : ''}</TableCell>
                      <TableCell>{val.name ? val.name : ''} </TableCell>
                      <TableCell>{ val.is_promoted ? val.is_promoted : ''} </TableCell>
                      <TableCell> { val.reason ? val.reason : ''} </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.studentLists && this.props.studentLists.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
                          </React.Fragment>
        {amountToAssign}
        <div
          style={{ margin: '0 auto', width: '200px', padding: '30px 0px' }}
        >
          <Button
            color='primary'
            variant='contained'
            onClick={this.handleSubmit}
            // disabled={!this.state.due_date || this.state.rowChecked.length}
          >Assign Other Fee</Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  studentLists: state.finance.accountantReducer.listOtherFee.unassignedStudentList
})

const mapDispatchToProps = (dispatch) => ({
  fetchStudentList: (session, otherFeeId, grade, section, type, alert, user) => dispatch(actionTypes.assignAccoutantOtherFees({ session, otherFeeId, grade, section, type, alert, user })),
  createOtherFees: (data, alert, user) => dispatch(actionTypes.createOtherFeeForUnassigned({ data, alert, user }))
  // clearProps: () => dispatch(actionTypes.clearingAllProps())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnassignedStudents)
