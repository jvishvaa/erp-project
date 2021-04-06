import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { withStyles, FormControlLabel, Radio } from '@material-ui/core/'
// import { OpenInNew, Assignment } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import Select from 'react-select'

import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import FeeDetails from './feeDetails'
import OtherFeeDetails from './otherFeeDetails'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  }
})

class FeeStructureAcc extends Component {
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
      alignment: 'one'
    }
  }

  componentDidMount () {
    this.props.fetchRefundValue(this.props.erp, this.props.session, this.props.alert, this.props.user, this.props.branchId, this.props.moduleId)
    this.props.fetchConcessionTypes(this.props.alert, this.props.user, this.props.branchId, this.props.moduleId)
    // if (this.props.getData && this.state.selectFeeWise.value === 1 && this.state.alignment === 'one') {
    //   this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    // }
    // else if (this.props.getData && this.state.selectFeeWise.value === 2) {
    //   this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
    // }
    this.props.fetchFeeStructureList(this.props.erp, this.props.session, this.props.alert, this.props.user, this.props.branchId, this.props.moduleId)
    this.props.fetchStudentDues(this.props.erp, this.props.session, this.props.alert, this.props.user, this.props.branchId, this.props.moduleId)
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

  // componentDidUpdate (prevProps, prevState) {
  //   const erpLength = (this.props.erp + '').length
  //   const {
  //     erp,
  //     session,
  //     alert,
  //     user
  //     // refresh
  //   } = this.props
  //   // if (refresh !== prevProps.refresh) {
  //   //   this.props.fetchAccountantTransaction(erp, session, user, alert)
  //   // }
  //   if (!this.props.erp || !this.props.session || !this.props.getData || erpLength !== 10) {
  //     return
  //   }
  //   if (this.props.erp === prevProps.erp && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
  //     return
  //   }
  //   if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWise.value === 1 && this.state.alignment === 'one') {
  //     this.props.fetchFeeStructureList(erp, alert, user)
  //   } else if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWise.value === 2 && this.state.alignment === 'one') {
  //     this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
  //   } else if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData) && this.state.selectFeeWise.value === 2 && this.state.alignment === 'two') {
  //     this.props.fetchOtherFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
  //   }
  // }

  // function to fetch data
  // erpHandler = () => {
  //   const erp = document.querySelectorAll('[name=searchBox]')
  //   // 1908010049
  //   this.setState({ erp: erp[0].value }, () => {
  //     this.props.fetchFeeStructureList(this.state.erp, this.props.alert, this.props.user)
  //   })
  // }

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

  concessionModalHandler = (id, instaId) => {
    this.setState({ conRequest: id, installmentId: instaId, showConcessionModal: true, concessionRequestAmount: 0 })
  }

  hideConcesionModalHandler = () => {
    // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    this.setState({ showConcessionModal: false }, () => {
      // this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
    })
  }

  concessionAmountHandler = (e, balance) => {
    if (e.target.value > balance) {
      this.props.alert.warning('Invalid Amount')
    } else {
      this.setState({ concessionRequestAmount: e.target.value })
    }
  }

  // selectFeeTypeWiseHandler = (e) => {
  //   this.setState({
  //     selectFeeWise: e
  //   }, () => {
  //     if (this.state.selectFeeWise.value === 1) {
  //       this.props.fetchFeeStructureList(this.props.erp, this.props.alert, this.props.user)
  //     } else {
  //       this.props.fetchFeetypeList(this.props.session, this.props.erp, this.props.alert, this.props.user)
  //     }
  //   })
  // }

  concessionTypeHandler = (e) => {
    this.setState({ concessionType: e.value })
  }

  changehandlerConcessionStatus = (e) => {
    this.setState({ currentConcessionStatus: e })
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
        concession_type: this.state.currentConcessionStatus.value
      }
      this.props.saveConcessionRequest(data, this.props.alert, this.props.user)
      this.hideConcesionModalHandler()
    }
  }

  handleChange = (e) => {
    this.setState({
      alignment: e.target.value
    })
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

  render () {
    // let { classes } = this.props
    // let feeStructureTable = null
    // let conModal = null
    // let unassignModal = null
    // const {
    //   showUnassignModal,
    //   currentFeeData
    // } = this.state

    let dataToShow = null

    if (this.state.alignment === 'one') {
      dataToShow = (
        <FeeDetails
          session={this.props.session}
          getData={this.props.getData}
          erp={this.props.erp}
          alert={this.props.alert}
          user={this.props.user}
          branchId={this.props.branchId}
          moduleId={this.props.moduleId}
          // refund={this.props.refund}
        />
      )
    } else if (this.state.alignment === 'two') {
      dataToShow = (
        <OtherFeeDetails
          session={this.props.session}
          getData={this.props.getData}
          erp={this.props.erp}
          alert={this.props.alert}
          user={this.props.user}
          branchId={this.props.branchId}
          moduleId={this.props.moduleId}
        />
      )
    }
    return (
      <React.Fragment>
        { (this.props.studentDues && this.props.studentDues.dues !== 0) && (this.props.studentDues && this.props.studentDues.is_academic_year_fee_paid === false)
          ? <div style={{ display: 'flex', justifyContent: 'center', fontSize: '18px' }} >
            <label style={{ color: 'red', fontSize: '18px' }}>Clear your dues to proceed. Dues are Pending! and Due Amount is : {this.props.studentDues && this.props.studentDues.dues}</label>
          </div>
          : [] }
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel
            control={
              <Radio
                checked={this.state.alignment === 'one'}
                onChange={this.handleChange}
                value='one'
                name='fee_details'
                inputProps={{ 'aria-label': 'A' }}
              />
            }
            label='Fee Concessions'
          />
          <FormControlLabel
            control={
              <Radio
                checked={this.state.alignment === 'two'}
                onChange={this.handleChange}
                value='two'
                name='other_fee_details'
                inputProps={{ 'aria-label': 'A' }}
              />
            }
            label='Other Fee Concessions'
          />
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={16}>
              {dataToShow}
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
  dataLoading: state.finance.common.dataLoader,
  studentDues: state.finance.feeStructure.studentDues,
  refund: state.finance.feeStructure.refund
})

const mapDispatchToProps = dispatch => ({
  fetchFeeStructureList: (erp, session, alert, user, branchId, moduleId) => dispatch(actionTypes.fetchFeeStructureList({ erp, session, alert, user, branchId, moduleId })),
  fetchConcessionTypes: (alert, user,  branchId, moduleId) => dispatch(actionTypes.fetchListConcessionsTypes({ alert, user, branchId, moduleId })),
  saveConcessionRequest: (data, alert, user, branchId, moduleId) => dispatch(actionTypes.saveConcessionRequest({ data, alert, user, branchId, moduleId })),
  fetchFeetypeList: (session, erp, alert, user, branchId, moduleId) => dispatch(actionTypes.fetchFeeTypeListFeeStru({ session, erp, alert, user, branchId, moduleId })),
  unassignFee: (id, data, alert, user, branchId, moduleId) => dispatch(actionTypes.unassignFeeStructure({ id, data, alert, user, branchId, moduleId })),
  fetchOtherFeetypeList: (session, erp, alert, user, branchId, moduleId) => dispatch(actionTypes.fetchOtherFeeTypeList({ session, erp, alert, user, branchId, moduleId })),
  fetchStudentDues: (erp, session, alert, user,  branchId, moduleId) => dispatch(actionTypes.fetchStudentDues({ erp, session, alert, user, branchId, moduleId })),
  fetchRefundValue: (erp, session, alert, user, branchId, moduleId) => dispatch(actionTypes.fetchRefundValue({ erp, session, alert, user, branchId, moduleId }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(FeeStructureAcc)))
