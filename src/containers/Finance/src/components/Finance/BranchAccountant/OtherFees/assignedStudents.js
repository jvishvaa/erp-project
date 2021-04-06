import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
// import { Button } from 'semantic-ui-react'
import {Button, Table, TableRow, TableCell, TableBody, TableHead, TablePagination  } from '@material-ui/core/'

// import 'react-table/react-table.css'

import * as actionTypes from '../../store/actions'
// import { apiActions } from '../../../../_actions'

// let studentIds = []
class UnassignedStudents extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isChecked: {},
      due_date: props.dueDate ? props.dueDate : '',
      rowUnchecked: [],
      selectAll: false,
      page: 0,
    rowsPerPage: 10
    }
    console.log(this.state)
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
        'assigned',
        this.props.alert,
        this.props.user,
        this.props.moduleId,
        this.props.branchId
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
    console.log('------nextprops----------', nextProps)
    if (this.props.studentLists !== nextProps.studentLists) {
      console.log('Yaaaa1')
      const checked = {}
      nextProps.studentLists.forEach(element => {
        checked[element.id] = false
      })
      this.setState({
        isChecked: checked,
        due_date: nextProps.dueDate
      }, () => {
        console.log('---state--------', this.state.due_date)
        console.log('-----props', this.props.dueDate)
      })
    }
    // if (this.props.dueDate !== nextProps.dueDate) {
    //   console.log('yaaaa2')
    //   this.setState({ due_date: this.props.dueDate })
    // }
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
      this.props.fetchStudentList(sessionId, otherFeeId, gradeId, sectionId, 'assigned', alert, user, this.props.moduleId, this.props.branchId)
    }
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

  dueDateHandler = (e) => {
    this.setState({
      due_date: e.target.value
    })
  }

  handleCheckbox = (event, id) => {
    let { isChecked } = this.state
    if (event.target.checked) {
      this.setState({
        isChecked: { ...isChecked, [id]: true }
      })
    } else {
      this.setState({
        isChecked: { ...isChecked, [id]: false },
        selectAll: false
      })
    }
  }

  checkAllHandler = (e) => {
    let { isChecked } = this.state
    const checked = {}
    this.props.studentLists.forEach(ele => {
      checked[ele.id] = e.target.checked
    })
    this.setState({
      isChecked: checked,
      selectAll: !this.state.selectAll
    }, () => {
      console.log('handler fuction', isChecked)
    })
  }

  handleSubmit = () => {
    let uncheckedRowId = []
    uncheckedRowId = Object.keys(this.state.isChecked).filter(ele => {
      return this.state.isChecked[ele] === true
    })
    let data = {
      student: uncheckedRowId,
      other_fee: this.props.otherFeeId,
      academic_year: this.props.sessionId,
      grade: this.props.gradeId,
      section: this.props.sectionId,
      branch_id: this.props.branchId
    }
    console.log('-------------data--------------', data)
    this.setState({
      rowUnchecked: uncheckedRowId
    }, () => {
      console.log('-checked-------------', this.state.rowUnchecked)
      console.log('-row-------------', uncheckedRowId)
      if (this.state.rowUnchecked.length < 1) {
        this.props.alert.warning('Unassign Students')
        return false
      }
      this.props.deleteOtherFees(data, this.props.alert, this.props.user)
    })
    // this.props.deleteOtherFees(data, this.props.alert, this.props.user)
    // this.setState({
    //   rowUnchecked: []
    // })
  }
  render () {
    // console.log('------------------is misc--------', this.props.isMisc)
    // console.log(this.state)
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
    return (
      <React.Fragment>
        { this.props.studentLists
          ? <div>
            <input
              type='checkbox'
              style={{ width: '20px', height: '20px' }}
              checked={this.state.selectAll}
              onChange={(e) => this.checkAllHandler(e)}
            />
            <label style={{ marginLeft: '15px' }}>Select all Students</label>
          </div>
          : null}
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
        <div style={{ width: '250px' }}>
          <label>Due Date</label>
          <input
            type='date'
            name='due_date'
            className='form-control'
            placeholder='Due Date'
            value={this.state.due_date}
            // onChange={this.dueDateHandler}
            readOnly
          />
        </div>
        <div
          style={{ margin: '0 auto', width: '200px', padding: '30px 0px' }}
        >
          <Button
            color='primary'
            variant='contained'
            onClick={this.handleSubmit}
            // disabled={!this.state.due_date
            //   // || !this.state.rowUnchecked
            // }
          >Unassign Other Fee</Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  studentLists: state.finance.accountantReducer.listOtherFee.assignedStudentList,
  dueDate: state.finance.accountantReducer.listOtherFee.dueDate
})

const mapDispatchToProps = (dispatch) => ({
  fetchStudentList: (session, otherFeeId, grade, section, type, alert, user, moduleId, branchId) => dispatch(actionTypes.assignAccoutantOtherFees({ session, otherFeeId, grade, section, type, alert, user, moduleId, branchId })),
  deleteOtherFees: (data, alert, user) => dispatch(actionTypes.deleteOtherFeeForAssigned({ data, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnassignedStudents)
