import React, { Component } from 'react'
import Select from 'react-select'
// import axios from 'axios'
import {
  withStyles, Table, Grid, Divider, TableBody, TableCell,
  TableHead, TableRow, Button, Fab
} from '@material-ui/core/'
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import classess from './deleteModal.module.css'
// import classes from './createFeePlan.module.css'
import Modal from '../../../ui/Modal/modal'
import AddFeePlanType from './addFeePlanType'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import { urls } from '../../../urls'
// import '../../css/staff.css'
// import EditInstallment from './editFinanaceInstallment'
import FinanaceInstallment from './finanaceInstallment'
import Layout from '../../../../../Layout';

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

// let feePlanState = null

class ManageFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      FeeId: '',
      updatedFeeList: [],
      feeType: '',
      isCompulsory: false,
      feeplanTypeList: [],
      installmentList: [],
      installmentTable: false,
      numberOfRows: null,
      feeAccountData: [],
      installPercentage: [],
      installAmountValue: [],
      showDeleteModal: false,
      showAddFeeModal: false,
      feePlanId: null,
      feeTypeData: null,
      installmentId: null,
      showEditModal: false,
      acadId: null
    }
    this.installAmountHandler = this.installAmountHandler.bind(this)
    this.createRowsHandler = this.createRowsHandler.bind(this)
    this.tableRef = React.createRef()
  }

  showAddFeeModalHandler = () => {
    this.setState({
      showAddFeeModal: true,
      feePlanId: this.props.match.params.id
    })
  }

  showEditModalHandler = (id, academic) => {
    this.setState({
      showEditModal: true,
      installmentId: id,
      acadId: academic
    }, () => {
      console.log('shoeEditModal')
    })
  }

  hideModalHandler = () => {
    this.setState({
      showAddFeeModal: false,
      showEditModal: false
    })
  }

  componentWillUnmount () {
    this.props.clearProps()
  }

  componentDidMount () {
    // if (feePlanState) {
    //   this.setState(feePlanState)
    //   return
    // }
    // this.props.fetchFeeTypes(this.props.match.params.id, this.props.alert, this.props.user)
    console.log('component')
    this.props.fetchFeeTypeAndAccountList(this.props.match.params.id, this.props.alert, this.props.user)
    // this.feeAccountInfo()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.feeTypes !== this.props.feeTypes) {
      const feeplanTypeListNew = this.props.feeTypes.filter((type) => {
        return type.fee_type_name ? type.fee_type_name.id === this.state.FeeId : ''
      })

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        updatedFeeList: feeplanTypeListNew
      })
    }
  }

  // componentDidUpdate(){
  //   console.log('-----------fee accounts---------------',this.props.feeAccounts)
  // }

  scrollDownHandler = () => {
    const objDiv = this.tableRef.current
    objDiv.scrollTop = objDiv.scrollHeight
  }

  handleClickFeeType = e => {
    // console.log(e)
    // this.setState({ FeeId: e.value, feeTypeData: e, showTable: true }, () => {
    // feePlanState = this.state
    // console.log(this.state)
    // })
    const feeplanTypeListNew = this.props.feeTypes.filter((type) => {
      return type.fee_type_name ? type.fee_type_name.id === e.value : ''
    })
    // this.setState({ updatedFeeList: feeplanTypeListNew })

    // for populating the installment table
    this.props.feeInstallments(this.props.match.params.id, e.value, this.props.alert, this.props.user)
    this.setState({
      installmentTable: true,
      FeeId: e.value,
      feeTypeData: e,
      showTable: true,
      updatedFeeList: feeplanTypeListNew,
      feePlanId: this.props.match.params.id,
      installPercentage: [],
      installAmountValue: [],
      numberOfRows: null
    })
  }

  // validation of installment amounts
  installAmountHandler = (e) => {
    let amt = e.target.value
    let percentage = 0
    let totalAmt = this.state.updatedFeeList[0].amount
    if (amt <= totalAmt) {
      percentage = (amt / totalAmt) * 100
      percentage = +percentage.toFixed(2)
    } else {
      this.props.alert.warning('Entered Amount is greater than Total Amount!')
    }
    let cent = [...this.state.installPercentage]
    cent[e.target.id] = percentage

    let installmentAmt = [...this.state.installAmountValue]
    installmentAmt[e.target.id] = amt
    this.setState({ installAmountValue: installmentAmt, installPercentage: cent })
  }

  // validation of installment Percentage
  installCentHandler = (e) => {
    let percent = e.target.value
    let amt = 0
    let totalAmt = this.state.updatedFeeList[0].amount
    if (percent <= 100) {
      amt = (totalAmt / 100) * percent
      amt = +amt.toFixed(2)

      let installmentAmt = [...this.state.installAmountValue]
      installmentAmt[e.target.id] = amt

      let cent = [...this.state.installPercentage]
      cent[e.target.id] = percent
      this.setState({ installPercentage: cent, installAmountValue: installmentAmt })
    } else {
      this.props.alert.warning('Entered percent is greater than 100!')
    }
  }

  // generating rows to add installments
  handleRow = e => {
    this.setState({
      numberOfRows: e.value,
      installPercentage: [],
      installAmountValue: []
    })
  }

  createRowsHandler = (loop) => {
    let table = []
    for (let i = 0; i < loop; i++) {
      table.push(
        <TableRow hover>
          <TableCell>
            {i + 1}
          </TableCell>
          <TableCell>
            <input
              name='installment_name'
              style={{ width: '100px' }}
              type='text'
              className='form-control'
              placeholder='installment Name'
            />
          </TableCell>
          <TableCell>
            <input
              style={{ width: '100px' }}
              name='installment_amount'
              // min='1'
              type='number'
              className='form-control'
              placeholder='installment amount'
              id={i}
              value={this.state.installAmountValue[i]}
              onChange={this.installAmountHandler}
            />
          </TableCell>
          <TableCell>
            <input
              name='installment_percentage'
              style={{ width: '80px' }}
              type='number'
              className='form-control'
              placeholder='installment percentage'
              value={this.state.installPercentage[i]}
              id={i}
              // readOnly
              onChange={(e) => { this.installCentHandler(e) }}
            />
          </TableCell>
          <TableCell>
            {/* <div style={{ width: '200px' }}> */}
            <input
              name='start_date'
              type='date'
              className='form-control'
              placeholder='start date'
            />
            {/* </div> */}

          </TableCell>
          <TableCell>
            <input
              name='due_date'
              type='date'
              className='form-control'
              placeholder='due date'
            // style={{ width: '200px' }}
            />
          </TableCell>
          <TableCell>
            <input
              name='end_date'
              type='date'
              className='form-control'
              placeholder='end date'
            // style={{ width: '200px' }}
            />
          </TableCell>
          <TableCell>
            <div style={{ width: '200px' }} onClick={this.scrollDownHandler}>
              <Select
                name='feeAccountInfo'
                placeholder='Select Fee Account'
                options={
                  this.props.feeAccounts.length
                    ? this.props.feeAccounts.map(feeList => ({
                      value: feeList.id,
                      label: feeList.fee_account_name
                    }))
                    : []
                }
              />
            </div>
          </TableCell>
          <TableCell>
            <input
              name='fine_money'
              type='checkbox'
            />
          </TableCell>
        </TableRow>
      )
    }
    return table
  }

  // sending new installments to backend
  saveInstallments = () => {
    // query selecting all the fields
    let installData = []; let arrCheckbox = []; let isValid = false; let amount = 0
    const installName = document.querySelectorAll('[name=installment_name]')
    const installAmount = document.querySelectorAll('[name=installment_amount]')
    const installPerc = document.querySelectorAll('[name=installment_percentage]')
    const installDueDate = document.querySelectorAll('[name=due_date]')
    const installStartDate = document.querySelectorAll('[name=start_date]')
    const installEndDate = document.querySelectorAll('[name=end_date]')
    const installFeeAcc = document.querySelectorAll('[name=feeAccountInfo]')
    const installFine = document.querySelectorAll('input[type=checkbox]')

    console.log('installment name: ', installName)
    for (let i = 0; i < installName.length; i++) {
      if (!installName[i].value.length) {
        this.props.alert.warning('enter installment names.')
        return false
      }
    }
    // capturing fines in an array
    installFine.forEach((v) => {
      if (v.checked) {
        arrCheckbox.push(true)
      } else {
        arrCheckbox.push(false)
      }
    })

    // checking if it's 1 installment or more and date validation
    for (let i = 0; i < this.state.numberOfRows; i++) {
      if (installName && installName[i].value && installName[i].value.length > 0 && installAmount[i] && installAmount[i].value && installDueDate && installDueDate[i].value && installDueDate[i].value.length > 0 && installStartDate && installStartDate[i].value && installStartDate[i].value.length > 0 && installEndDate && installEndDate[i].value && installEndDate[i].value.length > 0 && installFeeAcc && installFeeAcc[i].value && installFeeAcc[i].value.length > 0) {
        if ((Date.parse(installStartDate[i].value) < Date.parse(installDueDate[i].value)) && (Date.parse(installDueDate[i].value) < Date.parse(installEndDate[i].value))) {
          installData.push({
            installment_name: installName[i].value,
            installment_amount: installAmount[i].value,
            installment_percentage: installPerc[i].value,
            due_date: installDueDate[i].value,
            installment_start_date: installStartDate[i].value,
            installment_end_date: installEndDate[i].value,
            fee_account: String(installFeeAcc[i].value),
            fine_amount: arrCheckbox[i]
          })
        } else {
          this.props.alert.warning('Start should be less then Due date and Due date should be less then End date!')
          return false
        }
        // checking for amount
        // for (let i in this.state.installAmountValue) { amount += +this.state.installAmountValue[i] }
        // const totalFeeAmt = this.state.updatedFeeList.filter(ele => ele.fee_type_name.id === this.state.FeeId)[0].amount
        // if (totalFeeAmt !== amount) {
        //   this.props.alert.warning('Total of all installment amount should be equal to Fee Type Amount!')
        //   return false
        // }
      } else {
        this.props.alert.warning('Fill all required Fields!')
      }
    }

    // checking if percentage is 100
    // for (let i in this.state.installPercentage) { total += +this.state.installPercentage[i] }
    // if (total > 100 || total < 100) {
    // this.props.alert.warning('Check the amounts entered!')
    // return false
    // }

    // checking for amount
    for (let i in this.state.installAmountValue) { amount += +this.state.installAmountValue[i] }
    const totalFeeAmt = this.state.updatedFeeList.filter(ele => ele.fee_type_name.id === this.state.FeeId)[0].amount
    if (totalFeeAmt !== amount) {
      this.props.alert.warning('Total of all installment amount should be equal to Fee Type Amount!')
      return false
    }

    // checking if fee account is selected from dropdown
    for (let i = 0; i < installFeeAcc.length; i++) {
      if (installFeeAcc[i].value === '') {
        isValid = false
        // this.props.alert.warning(' please Select Fee Account!')
        return false
      } else {
        isValid = true
      }
    }

    if (isValid) {
      let finaldata = {
        fee_type: String(this.state.FeeId),
        fee_plan: this.props.match.params.id,
        numberOfInstallments: parseInt(this.state.numberOfRows),
        installments: installData
      }
      this.props.createInstallments(finaldata, this.props.alert, this.props.user)
    }
  }

  deleteModalShowHandler = () => {
    this.setState({ showDeleteModal: true })
  }

  deleteModalCloseHandler = () => {
    this.setState({ showDeleteModal: false })
  }

  deleteInstallHandler = () => {
    // TODO: delete the installment
    this.props.deleteInstallments(this.state.feePlanId, this.state.FeeId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  render () {
    let { classes } = this.props
    let feeList = null; let install = null; let deleteModal = null

    // addfee modal
    let addFeeModal = null
    if (this.state.showAddFeeModal) {
      addFeeModal = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler}>
          <AddFeePlanType
            feeId={this.state.feePlanId}
            alert={this.props.alert}
            user={this.props.user}
            close={this.hideModalHandler}
          />
        </Modal>
      )
    }

    // editinstallment modal
    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideModalHandler}>
          {/* <EditInstallment
            id={this.state.installmentId}
            acadId={this.state.acadId}
            alert={this.props.alert}
            close={this.hideModalHandler}
          /> */}
          <FinanaceInstallment
            id={this.state.installmentId}
            acadId={this.state.acadId}
            alert={this.props.alert}
            user={this.props.user}
            close={this.hideModalHandler}
            feeTypeId={this.state.FeeId}
          />
        </Modal>
      )
    }
    // let editModal = null
    // if (this.state.showEditModal) {
    //   console.log('opening modal')
    //   editModal = (
    //     <Modal open={this.state.showEditModal} click={this.hideModalHandler}>
    //       <Typography variant='h3' style={{ textAlign: 'center', fontWeight: 'lighter' }}>Edit Installments</Typography>
    //       <hr />
    //       <FinanaceInstallment />
    //     </Modal>
    //   )
    // }
    // let drop = null;
    // drop = <Dropdown placeholder='Select Friend' fluid selection options={friendOptions} />

    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button
              onClick={this.deleteInstallHandler}
              color='secondary'
              variant='contained'
            >
              Delete
            </Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.deleteModalCloseHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }

    if (this.state.updatedFeeList) {
      feeList = this.state.updatedFeeList.map((row, index) => {
        return (
          <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              {row.fee_type_name.fee_type_name}
            </TableCell>
            <TableCell>{row.is_compulsory ? 'Yes' : 'No'}</TableCell>
            <TableCell>{row.amount}</TableCell>
          </TableRow>
        )
      })
    }
    // for populating the data
    if (this.props.installmentList) {
      install = this.props.installmentList.map((row, index) => {
        return (
          <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div style={{ width: '80px' }}>
                {row.installment_name ? row.installment_name : ''}
              </div>
            </TableCell>
            <TableCell>{row.installment_amount ? row.installment_amount : 'NA'}</TableCell>
            <TableCell>{row.installment_percentage ? parseFloat(row.installment_percentage).toFixed(2) : 'NA'}</TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.installment_start_date ? row.installment_start_date : 'NA'}</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.due_date ? row.due_date : 'NA'}</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.installment_end_date ? row.installment_end_date : 'NA'}</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.fee_account.fee_account_name ? row.fee_account.fee_account_name : 'NA'}</div></TableCell>
            <TableCell>{row.fine_amount ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <div style={{ cursor: 'pointer' }}>
                <Fab
                  color='primary'
                  size='small'
                  onClick={() => { this.showEditModalHandler(row.id, row.academic_year) }}
                >
                  <EditIcon />
                </Fab>
              </div>
            </TableCell>
          </TableRow>
        )
      })
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='8'>
            <label style={{ fontSize: 14 }} className='student-addStudent-segment1-heading'>
                      Manage Fee Type
            </label>
          </Grid>
          <Grid item xs='4'>
            <div style={{ cursor: 'pointer' }}>
              <Fab
                color='primary'
                size='small'
                onClick={this.showAddFeeModalHandler}
              >
                <AddIcon />
              </Fab>
            </div>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Fee Type</label>
            <Select
              placeholder='Select Fee Type'
              value={this.state.feeTypeData ? this.state.feeTypeData : null}
              options={
                this.props.feeTypes.length
                  ? this.props.feeTypes.map(feeList => ({
                    value: feeList.fee_type_name ? feeList.fee_type_name.id : '',
                    label: feeList.fee_type_name ? feeList.fee_type_name.fee_type_name : ''
                  }))
                  : []
              }
              onChange={this.handleClickFeeType}
            />
          </Grid>
          <Grid item direction='column' xs='4'>
            {this.state.showTable
              ? <React.Fragment>
                <div className={classes.tableWrapper}>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.</TableCell>
                        <TableCell>Fee Type Name</TableCell>
                        <TableCell>Is Compulsory</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feeList}
                    </TableBody>
                  </Table>
                </div>
              </React.Fragment> : null
            }
          </Grid>
          <Grid item xs='12'>
            {this.props.installmentList.length > 0
              ? <React.Fragment>
                <label style={{ fontSize: 14 }} >Installment Details</label>
                <div className='clearfix'>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<DeleteIcon />}
                    onClick={this.deleteModalShowHandler}
                    style={{ float: 'right', cursor: 'pointer' }}
                  >
                            Delete Installment Details
                  </Button>
                </div>
                {/* <DeleteOutlinedIcon  />
                        <label style={{ float: 'right' }}>Delete Installment Details </label> */}

                <div className={classes.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr</TableCell>
                        <TableCell width={{ width: '200px' }}>Installment Name</TableCell>
                        <TableCell>Installment Amount</TableCell>
                        <TableCell>Installment Percentage</TableCell>
                        <TableCell>Installment Start Date</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Installment End Date</TableCell>
                        <TableCell>Fee Account</TableCell>
                        <TableCell>Fine Amount</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {install}
                    </TableBody>
                  </Table>
                </div>
              </React.Fragment>
              : this.state.showTable
                ? <React.Fragment>
                  <div style={{ width: '400px' }}>
                    <label>Create Installment</label>
                    <Select
                      placeholder='Select Number of Installments'
                      options={
                        [
                          {
                            label: '1 Installment',
                            value: '1'
                          },
                          {
                            label: '2 Installments',
                            value: '2'
                          },
                          {
                            label: '3 Installments',
                            value: '3'
                          },
                          {
                            label: '4 Installments',
                            value: '4'
                          },
                          {
                            label: '5 Installments',
                            value: '5'
                          },
                          {
                            label: '6 Installments',
                            value: '6'
                          },
                          {
                            label: '7 Installments',
                            value: '7'
                          },
                          {
                            label: '8 Installments',
                            value: '8'
                          },
                          {
                            label: '9 Installments',
                            value: '9'
                          },
                          {
                            label: '10 Installments',
                            value: '10'
                          },
                          {
                            label: '11 Installments',
                            value: '11'
                          },
                          {
                            label: '12 Installments',
                            value: '12'
                          }
                        ]
                      }
                      onChange={this.handleRow}
                    />
                  </div>
                  <div className={classes.tableWrapper} ref={this.tableRef}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.</TableCell>
                          <TableCell>Installment Name</TableCell>
                          <TableCell>Installment Amount</TableCell>
                          <TableCell>Installment Percentage</TableCell>
                          <TableCell>Installment Start Date</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Installment End Date</TableCell>
                          <TableCell>Fee Account</TableCell>
                          <TableCell>Fine Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.numberOfRows
                          ? this.createRowsHandler(this.state.numberOfRows)
                          : null
                        }
                      </TableBody>
                    </Table>
                  </div>
                  <br />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.saveInstallments}
                  >
                            Save
                  </Button>
                </React.Fragment>
                : null

            }
          </Grid>
          {editModal}
          {addFeeModal}
          {deleteModal}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </Grid>
      </React.Fragment>
      </Layout>

    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  feeTypes: state.finance.feePlan.feeTypeList,
  feeAccounts: state.finance.feePlan.feeAccountList,
  installmentList: state.finance.feePlan.feeInstallments,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  // fetchFeeTypes: (feePlanId, alert, user) => dispatch(actionTypes.fetchFeeTypeList({ feePlanId, alert, user })),
  fetchFeeTypeAndAccountList: (feeplanId, alert, user) => dispatch(actionTypes.fetchFeeTypeAndAccountList({ feeplanId, alert, user })),
  feeInstallments: (feePlanId, feeTypeId, alert, user) => dispatch(actionTypes.feeDisplayInstallment({ feePlanId, feeTypeId, alert, user })),
  createInstallments: (data, alert, user) => dispatch(actionTypes.feeCreateInstallment({ data, alert, user })),
  deleteInstallments: (feePlanId, feeTypeId, alert, user) => dispatch(actionTypes.deleteFeePlanInstallments({ feePlanId, feeTypeId, alert, user })),
  clearProps: () => dispatch(actionTypes.clearManageFeeTypesProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ManageFeeType)))
