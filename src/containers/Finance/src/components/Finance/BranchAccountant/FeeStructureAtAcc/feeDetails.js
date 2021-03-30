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

class FeeDetailsAccountant extends Component {
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
      selectFeeWise: {
        value: 1,
        label: 'Installment Wise'
      },
      showUnassignModal: false,
      unassignId: '',
      currentFeeData: {},
      remarksData: '',
      conGivenBy: '',
      fee_amt: 0,
      instWiseId: '',
      fineAmt: 0,
      showFineAmtModal: false,
      fineRemarks: '',
      fineBal: 0
    }
  }

  componentDidMount () {
    if (this.props.getData && this.state.selectFeeWise.value === 1) {
      this.props.fetchFeeStructureList(this.props.erp, this.props.session, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
    }
    if (this.props.session) {
      this.props.fetchBackDatConcession(this.props.session, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
    }
    console.log('fee deetees', this.props.refund)
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
    if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWise.value === 1) {
      this.props.fetchFeeStructureList(erp, this.props.session, alert, user, this.props.moduleId, this.props.branchId)
    } else if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWise.value === 2) {
      this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.erpNo === this.props.erpNo &&
        nextProps.session === this.props.session &&
        nextProps.refund === this.props.refund &&
        nextProps.getData === this.props.getData &&
        this.props.transactions === nextProps.transactions &&
        this.props.dataLoading === nextProps.data) {
      return false
    }
    return nextProps.getData
  }

  unassignShowModalHanlder = (id, amount) => {
    this.setState({
      showUnassignModal: true,
      unassignId: id,
      fee_amt: amount
    }, () => {
      const currentData = this.props.feeTypwWise.filter(val => val.id === this.state.unassignId)[0]
      console.log(currentData)
      this.setState({
        currentFeeData: currentData
      })
    })
  }

  unassignHideModalHanlder = () => {
    const {
      erp,
      alert,
      user
      // refresh
    } = this.props
    this.setState({
      showUnassignModal: false
    }, () => {
      if (this.props.getData && this.state.selectFeeWise.value === 1 && this.props.unassignRes) {
        this.props.fetchFeeStructureList(erp, this.props.session, alert, user, this.props.moduleId, this.props.branchId)
      } else if (this.props.getData && this.state.selectFeeWise.value === 2 && this.props.unassignRes) {
        this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
      }
    })
  }

  concessionModalHandler = (id, instaId) => {
    this.setState({ conRequest: id, installmentId: instaId, showConcessionModal: true, concessionRequestAmount: 0 })
  }

  hideConcesionModalHandler = () => {
    // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    this.setState({ showConcessionModal: false, currentConcessionStatus: null, concessionRequestAmount: 0 }, () => {
      // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
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

  concessionAmountHandler = (e, balance, discount) => {
    const { currentConcessionStatus } = this.state
    if (currentConcessionStatus.value === 'add') {
      if (e.target.value <= balance) {
        this.setState({ concessionRequestAmount: e.target.value })
      } else {
        this.props.alert.warning('Invalid Add Amount')
      }
    } else if (currentConcessionStatus.value === 'replace') {
      if (e.target.value <= (balance + discount)) {
        this.setState({ concessionRequestAmount: e.target.value })
      } else {
        this.props.alert.warning('Invalid Replace Amount')
      }
    }
    // if (e.target.value > balance) {
    //   this.props.alert.warning('Invalid Amount')
    // } else {
    //   this.setState({ concessionRequestAmount: e.target.value })
    // }
  }

  selectFeeTypeWiseHandler = (e) => {
    this.setState({
      selectFeeWise: e
    }, () => {
      if (this.state.selectFeeWise.value === 1) {
        this.props.fetchFeeStructureList(this.props.erp, this.props.session, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
      } else {
        this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
      }
    })
  }

  concessionTypeHandler = (e) => {
    this.setState({ concessionType: e.value })
  }

  changehandlerConcessionStatus = (e) => {
    this.setState({ currentConcessionStatus: e, concessionRequestAmount: 0 })
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

  concessionGivenByHandler = (e) => {
    this.setState({
      conGivenBy: e.target.value
    })
  }

  handleAlignment = (e, newAlignment) => {
    console.log(newAlignment)
    this.setState({
      alignment: newAlignment
    })
  }

  changeFineAmtHandler = (e) => {
    this.setState({
      fineAmt: e.target.value || 0
    })
  }

  changeRemarksHandler = (e) => {
    this.setState({
      fineRemarks: e.target.value
    })
  }

  saveRequest = () => {
    if (!this.state.concessionType || !this.state.remarks || !this.state.currentConcessionStatus) {
      this.props.alert.warning('Select All Fields')
    } else {
      let data = {
        session_year: this.props.session,
        erp: this.state.erp,
        installment: this.state.installmentId,
        concession: this.state.concessionRequestAmount,
        remarks: this.state.remarks,
        concession_id: this.state.concessionType,
        concession_type: this.state.currentConcessionStatus.value,
        concession_given_by: this.state.conGivenBy,
        branch_id: this.props.branchId
      }
      this.props.saveConcessionRequest(data, this.props.alert, this.props.user)
      this.hideConcesionModalHandler()
    }
  }

  unassignSubmitHandler = () => {
    console.log(this.state.remarksData)
    if (this.state.remarksData) {
      const data = {
        academic_year: this.props.session,
        student: this.props.erp,
        fee_type: this.state.currentFeeData.fee_type,
        remarks: this.state.remarksData,
        fee_amount: this.state.fee_amt
      }
      this.props.unassignFee(this.state.currentFeeData.id, data, this.props.alert, this.props.user)
      this.unassignHideModalHanlder()
    } else {
      this.props.alert.warning('Enter Remarks')
    }
  }

  addFineSubmitHandler = () => {
    const {
      fineRemarks,
      instWiseId,
      fineAmt,
      fineBal
    } = this.state
    if (fineAmt >= 0 && fineAmt < fineBal) {
      const data = {
        fine_amount: fineAmt,
        id: instWiseId,
        reason: fineRemarks,
        academic_year: this.props.session,
        student: this.props.erp,
        branch_id: this.props.branchId
      }
      // console.log(data)
      this.props.updateFineAmt(data, this.props.alert, this.props.user)
      this.hideFineAmtModalHandler()
    } else {
      // this.props.alert.warning('Enter Valid Fine')
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
                      {this.props.feeStructure.map((row, i) => {
                        if (row.id === this.state.conRequest) {
                          return (
                            <TableRow>
                              <TableCell>{row.fee_type && row.fee_type.fee_type_name ? row.fee_type.fee_type_name : ''}</TableCell>
                              <TableCell>{row.installments && row.installments.installment_name ? row.installments.installment_name : ''}</TableCell>
                              <TableCell>{row.installments && row.installments.installment_amount ? parseInt(row.installments.installment_amount) : 0}</TableCell>
                              <TableCell>{row.discount ? row.discount : 0}</TableCell>
                              <TableCell>{row.amount_paid ? row.amount_paid : 0}</TableCell>
                              <TableCell>{row.balance ? row.balance : 0}</TableCell>
                              <TableCell>
                                <input
                                  name='concession'
                                  type='number'
                                  min='0'
                                  className='form-control'
                                  disabled={!this.state.currentConcessionStatus}
                                  value={this.state.concessionRequestAmount}
                                  onChange={(e) => { this.concessionAmountHandler(e, row.balance, row.discount) }} />
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
            <Button style={{ color: '#fff'}} onClick={this.saveRequest}>Save</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button style={{ color: '#fff'}} onClick={this.hideConcesionModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    // console.log('props fee type', this.props.feeTypwWise)

    if (this.props.feeStructure.length > 0 && this.state.selectFeeWise.value === 1) {
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
                            <TableCell>Refund</TableCell>
                            <TableCell>Paid Amount</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell> Add Fine </TableCell>
                            <TableCell>Request Concession</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.feeStructure && this.props.feeStructure.length > 0 ? this.props.feeStructure.map((row, i) => {
                            let reAmount = 0
                            if (this.props.refund.length) {
                              this.props.refund.map((refund) => {
                                if (row.installments && row.installments.id === refund.installment) {
                                  reAmount = refund.amount
                                }
                              })
                            }
                            return (
                              <TableRow key={row.id}>
                                <TableCell>{row.fee_type && row.fee_type.fee_type_name ? row.fee_type.fee_type_name : ''}</TableCell>
                                <TableCell>{row.installments && row.installments.installment_name ? row.installments.installment_name : ''}</TableCell>
                                <TableCell>{row.fine_amount ? row.fine_amount : 0}</TableCell>
                                <TableCell>{row.installments && row.installments.installment_amount ? parseInt(row.installments.installment_amount) : 0}</TableCell>
                                <TableCell>{row.discount ? row.discount : 0}</TableCell>
                                <TableCell>
                                  {reAmount}
                                </TableCell>
                                <TableCell>{row.amount_paid ? row.amount_paid : 0}</TableCell>
                                <TableCell>{row.balance ? row.balance : 0}</TableCell>
                                <TableCell>
                                  <AddCircleOutline id='addFine' onClick={() => { this.addFineAmtHandler(row.id, row.fine_amount || 0, row.balance || 0) }} style={{ cursor: 'pointer' }} />
                                </TableCell>
                                {/* {+row.balance !== 0 */}
                                {this.props.backDate && this.props.backDate.concession
                                  ? <TableCell><OpenInNew style={{ cursor: 'pointer' }} onClick={() => { this.concessionModalHandler(row.id, row.installments.id) }} /></TableCell>
                                  : <TableCell>{''}</TableCell>
                                }
                              </TableRow>
                            )
                          }) : 'No Records Found'}
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
    } else if (this.props.feeTypwWise && this.props.feeTypwWise.length > 0 && this.state.selectFeeWise.value === 2) {
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
                            <TableCell>Plan Name</TableCell>
                            <TableCell>Fee Amount</TableCell>
                            <TableCell>Concession</TableCell>
                            <TableCell>Paid Amount</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell> Assign/UnAssign </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.feeTypwWise && this.props.feeTypwWise.length > 0 ? this.props.feeTypwWise.map((row, i) => {
                            return (
                              <TableRow key={row.id}>
                                <TableCell>{row.fee_type_name ? row.fee_type_name : ''}</TableCell>
                                <TableCell>{row.fee_plan_name ? row.fee_plan_name : ''}</TableCell>
                                <TableCell>{row.fee_type_amount ? row.fee_type_amount : 0}</TableCell>
                                <TableCell>{row.concession ? row.concession : 0}</TableCell>
                                <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                                <TableCell>{row.balance ? row.balance : 0}</TableCell>
                                <TableCell>
                                  {row.assign ? <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                                    onClick={() => this.unassignShowModalHanlder(row.id, row.fee_type_amount)}
                                  >
                                      Unassign
                                  </span>
                                    : ''
                                  }
                                </TableCell>
                              </TableRow>
                            )
                          }) : 'No Records Found'}
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

    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={6} className='student-addStudent-StudentSection'>
              <Select
                placeholder='Select Fee Wise'
                value={this.state.selectFeeWise ? this.state.selectFeeWise : null}
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
  feeStructure: state.finance.feeStructure.feeStructureList,
  listConcessionTypes: state.finance.feeStructure.concessiontype,
  feeTypwWise: state.finance.feeStructure.feeTypeList,
  unassignRes: state.finance.feeStructure.unassignResponse,
  backDate: state.finance.feeStructure.backDate,
  dataLoading: state.finance.common.dataLoader,
  refund: state.finance.feeStructure.refund
})

const mapDispatchToProps = dispatch => ({
  fetchFeeStructureList: (erp, session, alert, user, moduleId, branch) => dispatch(actionTypes.fetchFeeStructureList({ erp, session, alert, user, moduleId, branch })),
  fetchConcessionTypes: (alert, user) => dispatch(actionTypes.ListConcessionTypes({ alert, user })),
  saveConcessionRequest: (data, alert, user) => dispatch(actionTypes.saveConcessionRequest({ data, alert, user })),
  fetchFeetypeList: (session, erp, alert, user, moduleId, branchId) => dispatch(actionTypes.fetchFeeTypeListFeeStru({ session, erp, alert, user, moduleId, branch })),
  unassignFee: (id, data, alert, user) => dispatch(actionTypes.unassignFeeStructure({ id, data, alert, user })),
  fetchOtherFeetypeList: (session, erp, alert, user, moduleId, branchId) => dispatch(actionTypes.fetchOtherFeeTypeList({ session, erp, alert, user, moduleId, branch })),
  updateFineAmt: (data, alert, user) => dispatch(actionTypes.updateInstFineAmount({ data, alert, user })),
  fetchBackDatConcession: (session, alert, user, moduleId, branch) => dispatch(actionTypes.fetchBackDatConcession({ session, alert, user, moduleId, branch }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FeeDetailsAccountant))
