import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { OpenInNew, AddCircleOutline } from '@material-ui/icons/'
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField } from '@material-ui/core/'

import * as actionTypes from '../../store/actions'
import classess from './feeStructure.module.css'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  }
})

class OtherFeeDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeStructureDetails: [],
      erp: this.props.erp,
      showConcessionModal: false,
      conRequest: null,
      concessionRequestAmount: 0,
      remarks: null,
      installmentId: null,
      currentConcessionStatus: null,
      selectFeeWiseOther: {
        value: 1,
        label: 'Installment Wise'
      },
      showUnassignModal: false,
      unassignId: '',
      currentFeeData: {},
      remarksData: '',
      conGivenBy: '',
      instWiseId: null,
      fineAmt: 0,
      fineBal: 0,
      fineRemarks: '',
      showFineAmtModal: false,
      feeStructAmt: 0,
      feeStructBal: 0
    }
  }

  componentDidMount () {
    if (this.props.getData && this.state.selectFeeWiseOther.value === 1) {
      this.props.fetchOtherInstallmentTypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const erpLength = (this.props.erp + '').length
    const {
      erp,
      session,
      alert,
      user
      // refresh
    } = this.props
    // if (refresh !== prevProps.refresh) {
    //   this.props.fetchAccountantTransaction(erp, session, user, alert)
    // }
    if (!this.props.erp || !this.props.session || !this.props.getData || erpLength !== 10) {
      return
    }
    if (this.props.erp === prevProps.erp && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWiseOther.value === 1) {
      this.props.fetchOtherInstallmentTypeList(session, erp, alert, user)
    } else if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWiseOther.value === 2) {
      this.props.fetchOtherFeeTypeList(session, erp, alert, user)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.erpNo === this.props.erpNo &&
        nextProps.session === this.props.session &&
        nextProps.getData === this.props.getData &&
        this.props.transactions === nextProps.transactions &&
        this.props.dataLoading === nextProps.data) {
      return false
    }
    return nextProps.getData
  }

  unassignShowModalHanlder = (id) => {
    this.setState({
      showUnassignModal: true,
      unassignId: id
    }, () => {
      const currentData = this.props.feeTypwWise.filter(val => val.id === this.state.unassignId)[0]
      console.log(currentData)
      this.setState({
        currentFeeData: currentData
      })
    })
  }

  unassignHideModalHanlder = () => {
    this.setState({
      showUnassignModal: false
    })
  }

  addFineAmtHandler = (id, fine, balance) => {
    this.setState({
      instWiseId: id,
      fineAmt: fine,
      fineBal: balance,
      showFineAmtModal: true
    })
  }

  hideFineAmtModalHandler = () => {
    this.setState({
      instWiseId: null,
      fineAmt: 0,
      fineBal: 0,
      fineRemarks: '',
      showFineAmtModal: false
    })
  }

  concessionModalHandler = (id, instaId, balance, feeAmt) => {
    this.setState({
      conRequest: id,
      installmentId: instaId,
      showConcessionModal: true,
      concessionRequestAmount: 0,
      feeStructAmt: feeAmt,
      feeStructBal: balance
    })
  }

  hideConcesionModalHandler = () => {
    // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    this.setState({ showConcessionModal: false }, () => {
      // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    })
  }

  concessionAmountHandler = (e, balance) => {
    // if (e.target.value > balance) {
    //   this.props.alert.warning('Invalid Amount')
    // } else {
    this.setState({ concessionRequestAmount: e.target.value })
    // }
  }

  selectFeeTypeWiseHandler = (e) => {
    this.setState({
      selectFeeWiseOther: e
    }, () => {
      if (this.state.selectFeeWiseOther.value === 1) {
        this.props.fetchOtherInstallmentTypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
      } else {
        this.props.fetchOtherFeeTypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
      }
    })
  }

  concessionTypeHandler = (e) => {
    this.setState({ concessionType: e.value })
  }

  changehandlerConcessionStatus = (e) => {
    this.setState({ currentConcessionStatus: e })
  }

  concessionGivenByHandler = (e) => {
    this.setState({
      conGivenBy: e.target.value
    })
  }

  remarksHandler = (e) => {
    this.setState({ remarks: e.target.value })
  }

  changeremarksHandler = (e) => {
    console.log(e)
    console.log(e.target.value)
    this.setState({
      remarksData: e.target.value
    })
  }

  handleAlignment = (e, newAlignment) => {
    console.log(newAlignment)
    this.setState({
      alignment: newAlignment
    })
  }

  saveRequest = () => {
    console.log('amount', this.state.feeStructAmt)
    console.log('balance', this.state.feeStructBal)
    if (!this.state.concessionType || !this.state.remarks || !this.state.currentConcessionStatus) {
      this.props.alert.warning('Select All Fields')
      console.log('1st attempt')
      return
    } else if (this.state.currentConcessionStatus.value === 'replace' && this.state.concessionRequestAmount > this.state.feeStructAmt) {
      this.props.alert.warning('Replacing Concession Should be less than Fee Amount')
      console.log('2nd attempt')
      return
    } else if (this.state.currentConcessionStatus.value === 'add' && this.state.concessionRequestAmount > this.state.feeStructBal) {
      this.props.alert.warning('Adding Concession Should be less than balance')
      console.log('3rd attempt')
      return
    }
    let data = {
      session_year: this.props.session,
      erp: this.state.erp,
      installment: this.state.installmentId,
      concession: this.state.concessionRequestAmount,
      remarks: this.state.remarks,
      concession_id: this.state.concessionType,
      concession_type: this.state.currentConcessionStatus.value,
      concession_given_by: this.state.conGivenBy
    }
    // console.log('data', data)
    this.props.saveConcessionRequest(data, this.props.alert, this.props.user)
    this.hideConcesionModalHandler()
  }

  unassignSubmitHandler = () => {
    console.log(this.state.remarksData)
    if (this.state.remarksData) {
      const data = {
        academic_year: this.props.session,
        student: this.props.erp,
        fee_type: this.state.currentFeeData.fee_type,
        remarks: this.state.remarksData
      }
      this.props.unassignFee(this.state.currentFeeData.id, data, this.props.alert, this.props.user)
      this.unassignHideModalHanlder()
    } else {
      this.props.alert.warning('Enter Remarks')
    }
  }

  changeFineAmtHandler = (e) => {
    const amountValue = e.target.value
    if (amountValue < 0) {
      this.props.alert.warning('Value should be greater then 0!')
    }
    this.setState({
      fineAmt: amountValue || 0
    })
  }

  changeRemarksHandler = (e) => {
    this.setState({
      fineRemarks: e.target.value
    })
  }

  addFineSubmitHandler = () => {
    const {
      fineRemarks,
      instWiseId,
      fineAmt,
      fineBal
    } = this.state
    if (fineAmt >= 0 && fineAmt <= fineBal) {
      const data = {
        fine_amount: fineAmt,
        id: instWiseId,
        reason: fineRemarks,
        academic_year: this.props.session,
        student: this.props.erp
      }
      // console.log(data)
      this.props.updateFineAmt(data, this.props.alert, this.props.user)
      this.hideFineAmtModalHandler()
    } else {
      this.props.alert.warning('Enter Valid Fine')
    }
  }

  render () {
    let feeDetailsTable = null
    let { classes } = this.props
    let conModal = null
    let unassignModal = null
    let fineAmtModal = null
    const {
      showUnassignModal,
      currentFeeData,
      showFineAmtModal,
      fineAmt,
      fineRemarks
    } = this.state

    if (showUnassignModal && currentFeeData) {
      unassignModal = (
        <Modal open={showUnassignModal} large click={this.unassignHideModalHanlder}>
          <h3 className={classess.modal__heading}>Fee Unassign Request</h3>
          <hr />
          <div className={classess.modal__content}>
            <Grid style={{ padding: '10px' }}>
              <Grid.Row>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Student Name :</label>&nbsp;{currentFeeData.student_name ? currentFeeData.student_name : ''}
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Class :</label>&nbsp;{currentFeeData.grade_section ? currentFeeData.grade_section : ''}
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Joining Date :</label>&nbsp;{currentFeeData.admission_date ? currentFeeData.admission_date : ''}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Fee Plan :</label>&nbsp;{currentFeeData.fee_plan_name ? currentFeeData.fee_plan_name : ''}
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Fee Type :</label>&nbsp;{currentFeeData.fee_type_name ? currentFeeData.fee_type_name : ''}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Total Amount :</label>&nbsp;{currentFeeData.fee_type_amount ? currentFeeData.fee_type_amount : 0}
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Paid Amount :</label>&nbsp;{currentFeeData.paid_amount ? currentFeeData.paid_amount : 0}
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label style={{ fontSize: '15px', marginRight: '15px' }}>Concession :</label>&nbsp;{currentFeeData.concession ? currentFeeData.concession : 0}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  computer={10}>
                  <label style={{ fontSize: '15px' }}>Remarks :</label>
                  <div>
                    <textarea
                      style={{ width: '100%' }}
                      rows='5'
                      name='remarks'
                      type='text'
                      value={this.state.remarksData ? this.state.remarksData : null}
                      onChange={(e) => { this.changeremarksHandler(e) }}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          <div className={classess.modal__deletebutton}>
            <Button
              color='primary'
              size='small'
              variant='contained'
              onClick={this.unassignSubmitHandler}
            >
              Unassign
            </Button>
            {/* <Button primary onClick={this.saveRequest}>Unassign</Button> */}
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='secondary'
              size='small'
              variant='contained'
              onClick={this.unassignHideModalHanlder}
            >
              Go Back
            </Button>
            {/* <Button primary onClick={this.hideConcesionModalHandler}>Go Back</Button> */}
          </div>
        </Modal>
      )
    }

    if (this.state.showConcessionModal) {
      conModal = (
        <Modal open={this.state.showConcessionModal} large click={this.hideConcesionModalHandler}>
          <h3 className={classess.modal__heading}>Request Concession</h3>
          <hr />
          <div className={classess.modal__content}>
            <Grid>
              <Grid.Row>
                <Grid.Column
                  computer={5}>
                  <label>Concession Type.</label>
                  <Select
                    placeholder='Concession Type'
                    // value={this.state.sessionData ? this.state.sessionData : null}
                    options={
                      this.props.listConcessionTypes && this.props.listConcessionTypes.length > 0
                        ? this.props.listConcessionTypes.map(concession => ({
                          value: concession.id,
                          label: concession.type_name
                        }))
                        : []
                    }
                    onChange={(e) => this.concessionTypeHandler(e)}
                  />
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label>Remarks.</label>
                  <input
                    name='remarks'
                    placeholder='Remarks'
                    type='text'
                    className='form-control'
                    onChange={(e) => { this.remarksHandler(e) }} />
                </Grid.Column>
                <Grid.Column
                  computer={5}>
                  <label>Add/Replace Concession.</label>
                  <Select
                    placeholder='Add/Replace Concession'
                    value={this.state.currentConcessionStatus ? this.state.currentConcessionStatus : ''}
                    options={
                      [
                        {
                          value: 'add',
                          label: 'Add Concession'
                        },
                        {
                          value: 'replace',
                          label: 'Replace Concession'
                        }
                      ]
                    }

                    onChange={this.changehandlerConcessionStatus}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  computer={5}>
                  <label>Concession Given By</label>
                  <input
                    name='concessionGiven'
                    placeholder='Concession Given By'
                    type='text'
                    className='form-control'
                    onChange={(e) => { this.concessionGivenByHandler(e) }} />
                </Grid.Column>
              </Grid.Row>
              {this.state.conRequest
                ? <React.Fragment>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fee Type</TableCell>
                        <TableCell>Installment Name</TableCell>
                        <TableCell>Fee Amount</TableCell>
                        <TableCell>Concession</TableCell>
                        <TableCell>Paid Amount</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Concession</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.instTypeList.map((row, i) => {
                        if (row.id === this.state.conRequest) {
                          return (
                            <TableRow>
                              <TableCell>{row.other_fee && row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                              <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_name ? row.other_fee_installments.installment_name : ''}</TableCell>
                              <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_amount ? parseInt(row.other_fee_installments.installment_amount) : 0}</TableCell>
                              <TableCell>{row.discount ? row.discount : 0}</TableCell>
                              <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                              <TableCell>{row.balance ? row.balance : 0}</TableCell>
                              <TableCell>
                                <input
                                  name='concession'
                                  min='0'
                                  type='number'
                                  className='form-control'
                                  value={this.state.concessionRequestAmount}
                                  onChange={(e) => { this.concessionAmountHandler(e, row.balance) }} />
                              </TableCell>
                            </TableRow>
                          )
                        }
                      })}
                    </TableBody>
                  </Table>
                </React.Fragment>
                : null}
            </Grid>
          </div>
          <div className={classess.modal__deletebutton}>
            <Button primary onClick={this.saveRequest}>Save</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button primary onClick={this.hideConcesionModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    if (this.props.instTypeList && this.props.instTypeList.length > 0 && this.state.selectFeeWiseOther.value === 1) {
      feeDetailsTable = (
        <Grid >
          <Grid.Row>
            <Grid.Column computer={16} style={{ padding: '30px' }}>
              <Grid.Row>
                <Grid.Column
                  computer={12}
                  mobile={16}
                  tablet={12}
                  style={{ overflow: 'scroll', overflowY: 'hidden' }}
                  className='student-section-inputField'
                >
                  <React.Fragment>
                    <div className={classes.tableWrapper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Fee Type</TableCell>
                            <TableCell>Installment Name</TableCell>
                            <TableCell>Fine Amount</TableCell>
                            <TableCell>Fee Amount</TableCell>
                            <TableCell>Concession</TableCell>
                            <TableCell>Paid Amount</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell> Add Fine </TableCell>
                            {/* <TableCell> Assign/UnAssign </TableCell> */}
                            <TableCell>Request Concession</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.instTypeList.map((row, i) => {
                            return (
                              <TableRow key={row.id}>
                                <TableCell>{row.other_fee && row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                                <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_name ? row.other_fee_installments.installment_name : ''}</TableCell>
                                <TableCell>{row.fine ? row.fine : 0}</TableCell>
                                <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_amount ? parseInt(row.other_fee_installments.installment_amount) : 0}</TableCell>
                                <TableCell>{row.discount ? row.discount : 0}</TableCell>
                                <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                                <TableCell>{row.balance ? row.balance : 0}</TableCell>
                                <TableCell>
                                  <AddCircleOutline id='addFine' onClick={() => { this.addFineAmtHandler(row.id, row.fine || 0, row.balance || 0) }} style={{ cursor: 'pointer' }} />
                                </TableCell>
                                {/* <TableCell><Assignment style={{ cursor: 'pointer' }} /></TableCell> */}
                                {+row.balance !== 0
                                  ? <TableCell><OpenInNew style={{ cursor: 'pointer' }} onClick={() => { this.concessionModalHandler(row.id, row.other_fee_installments.id, row.balance, row.other_fee_installments && row.other_fee_installments.installment_amount ? parseInt(row.other_fee_installments.installment_amount) : 0) }} /></TableCell>
                                  : <TableCell>{}</TableCell>
                                }
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </React.Fragment>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    } else if (this.props.feeTypeStructure && this.props.feeTypeStructure.length > 0 && this.state.selectFeeWiseOther.value === 2) {
      feeDetailsTable = (
        <Grid >
          <Grid.Row>
            <Grid.Column computer={16} style={{ padding: '30px' }}>
              <Grid.Row>
                <Grid.Column
                  computer={12}
                  mobile={16}
                  tablet={12}
                  style={{ overflow: 'scroll', overflowY: 'hidden' }}
                  className='student-section-inputField'
                >
                  <React.Fragment>
                    <div className={classes.tableWrapper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Fee Type</TableCell>
                            <TableCell>Fee Account</TableCell>
                            <TableCell>Fine Amount</TableCell>
                            <TableCell>Fee Amount</TableCell>
                            <TableCell>Concession</TableCell>
                            <TableCell>Paid Amount</TableCell>
                            <TableCell>Balance</TableCell>
                            {/* <TableCell> Assign/UnAssign </TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.feeTypeStructure.map((row, i) => {
                            return (
                              <TableRow>
                                <TableCell>{row.fee_type_name ? row.fee_type_name : ''}</TableCell>
                                <TableCell>{row.fee_acount_info_name ? row.fee_acount_info_name : ''}</TableCell>
                                <TableCell>{row.fine ? row.fine : 0}</TableCell>
                                <TableCell>{row.total_fee_amount ? row.total_fee_amount : 0}</TableCell>
                                <TableCell>{row.discount ? row.discount : 0}</TableCell>
                                <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                                <TableCell>{row.balance ? row.balance : 0}</TableCell>
                                {/* <TableCell>
                                  {row.assign ? <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                                    onClick={() => this.unassignShowModalHanlder(row.id)}
                                  >
                                      Unassign
                                  </span>
                                    : ''
                                  }
                                </TableCell> */}
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </React.Fragment>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }

    if (showFineAmtModal) {
      fineAmtModal = (
        <Modal open={showFineAmtModal} medium click={this.hideFineAmtModalHandler}>
          <h3 className={classess.modal__heading}>Add Fine</h3>
          <hr />
          <div className={classess.modal__content}>
            <Grid style={{ padding: '10px' }}>
              <Grid.Row>
                <Grid.Column
                  computer={8}
                >
                  <TextField
                    id='fineAmt'
                    label='Fine Amount'
                    value={fineAmt || 0}
                    style={{ padding: '10px' }}
                    type='number'
                    // min='0'
                    margin='dense'
                    onChange={this.changeFineAmtHandler}
                    variant='outlined'
                  />
                </Grid.Column>
                <Grid.Column
                  computer={8}
                >
                  <TextField
                    id='remarks'
                    style={{ padding: '10px' }}
                    value={fineRemarks || ''}
                    label='Remarks'
                    type='text'
                    margin='dense'
                    onChange={this.changeRemarksHandler}
                    variant='outlined'
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          <div className={classess.modal__deletebutton}>
            <Button
              color='primary'
              size='small'
              variant='contained'
              onClick={this.addFineSubmitHandler}
            >
              Update Fine
            </Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='secondary'
              size='small'
              variant='contained'
              onClick={this.hideFineAmtModalHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }

    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={6} className='student-addStudent-StudentSection'>
              <Select
                placeholder='Select Fee Wise'
                value={this.state.selectFeeWiseOther ? this.state.selectFeeWiseOther : null}
                options={
                  [
                    {
                      value: 1,
                      label: 'Installment Wise'
                    },
                    {
                      value: 2,
                      label: 'Fee Type Wise'
                    }
                  ]
                }
                onChange={this.selectFeeTypeWiseHandler}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={16} className='student-addStudent-StudentSection'>
              {feeDetailsTable}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {conModal}
        {unassignModal}
        {fineAmtModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  feeTypeStructure: state.finance.feeStructure.otherFeeStrucList,
  instTypeList: state.finance.feeStructure.otherInstStrucList,
  listConcessionTypes: state.finance.feeStructure.concessiontype,
  feeTypwWise: state.finance.feeStructure.feeTypeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchOtherFeeTypeList: (session, erp, alert, user) => dispatch(actionTypes.fetchOtherFeeTypeList({ session, erp, alert, user })),
  fetchOtherInstallmentTypeList: (session, erp, alert, user) => dispatch(actionTypes.fetchOtherInstTypeList({ session, erp, alert, user })),
  // fetchFeeStructureList: (erp, alert, user) => dispatch(actionTypes.fetchFeeStructureList({ erp, alert, user })),
  // fetchConcessionTypes: (alert, user) => dispatch(actionTypes.ListConcessionTypes({ alert, user })),
  saveConcessionRequest: (data, alert, user) => dispatch(actionTypes.saveOtherConcessionRequest({ data, alert, user })),
  updateFineAmt: (data, alert, user) => dispatch(actionTypes.updateOthrInstFineAmount({ data, alert, user })),
  unassignFee: (id, data, alert, user) => dispatch(actionTypes.unassignFeeStructure({ id, data, alert, user }))
  // fetchOtherFeetypeList: (session, erp, alert, user) => dispatch(actionTypes.fetchOtherFeeTypeList({ session, erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OtherFeeDetails))
