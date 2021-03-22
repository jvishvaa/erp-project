import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import {
  withStyles,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
// import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  outlined: {
    zIndex: 0
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Admission Form') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}
class NonRTEFeeDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      feePlan: null,
      isChecked: {},
      selectedTotal: 0,
      partialAmount: ''
    }
  }

  componentDidMount () {
    // this.props.fetchGradeList(this.props.alert, this.props.user)
    console.log('session and grade', this.props.session, this.props.stuGrade)
    if (this.props.session && this.props.stuGrade) {
      this.props.fetchFeePlan(this.props.alert, this.props.user, this.props.session, this.props.stuGrade.value)
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.addressDetails)
    if (this.state.selectedTotal > 0) {
      const partialPayAmt = document.querySelectorAll('[name=partialAmount]')
      console.log('mpa Partial amount: ', partialPayAmt)
      let bal = []
      let payed = []
      let checkedRowId = []
      checkedRowId = Object.keys(this.state.isChecked).filter(ele => {
        return this.state.isChecked[ele]
      })
      let payInstall = []
      checkedRowId.map((row, i) => {
        payInstall.push(this.props.installmentsPlans.filter(list => (+list.id === +row)))
      })
      console.log('mpa payInstall 1st----', payInstall)
      // to calculate the paying amount and balance after that.
      payInstall.map((row, i) => {
        row.map((r) => {
          if (+checkedRowId[i] === +r.id) {
            for (let k = 0; k < partialPayAmt.length; k++) {
              if (+partialPayAmt[k].id === +r.id) {
                if (+r.installment_amount === +partialPayAmt[k].value) {
                  bal.push(0)
                  payed.push(r.installment_amount)
                } else if (r.installment_amount > partialPayAmt[k].value) {
                  payed.push(parseInt(partialPayAmt[k].value))
                  bal.push(r.installment_amount - partialPayAmt[k].value)
                }
              }
            }
          }
        })
      })
      // console.log(payed)
      // console.log(bal)

      const newPayInstall = payInstall.map((ele, i) => {
        ele.payment = payed[i]
        ele.balance = bal[i]
        return ele
      })
      console.log('checked installments: ', newPayInstall)
      let insta = []
      newPayInstall.map(row => {
        row.map(r => {
          insta.push({
            id: r.id,
            fee_type: r.fee_type.id,
            installment_id: r.id,
            amount: row.payment,
            balance: row.balance
          })
        })
      })
      let data = {
        total: this.state.selectedTotal,
        checkedInstallments: insta,
        feePlanId: this.state.feePlan.value
      }
      this.props.getFeeDetails(data)
    } else {
      let data = {
        total: this.state.selectedTotal
      }
      this.props.getFeeDetails(data)
    }
  }

  studentDetailsDropdonHandler= (event) => {
    this.setState({
      feePlan: event,
      isChecked: {},
      selectedTotal: 0,
      partialAmount: ''
    }, () => {
      // fetchInstallment: (alert, user, feePlanId) => dispatch(actionTypes.fetchInstallment({ alert, user, feePlanId }))
      this.props.fetchInstallment(this.props.alert, this.props.user, this.state.feePlan.value)
    })
  }

  // adding the balance amount based on checkbox
  addBalance = (id) => e => {
    console.log('Add balance: ', id, e.target.checked)
    let { isChecked } = this.state
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [id]: true } })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [id]: false } })
    }

    let pay = this.state.selectedTotal
    const data = this.props.installmentsPlans.filter(list => (list.id === id))

    let partialAmt = 0
    // adding and removing the total amount to be paid
    data.map(amt => {
      partialAmt = parseInt(this.state.partialAmount[id]) ? parseInt(this.state.partialAmount[id]) : amt.installment_amount
      if (e.target.checked) {
        // pay += amt.balance
        pay += partialAmt
      } else {
        // pay -= partialAmt
        pay -= partialAmt
      }
    })
    if (pay === 0) {
      // removed disableNext
      this.setState({ selectedTotal: pay })
    } else if (pay > 0) {
      this.setState({ selectedTotal: pay })
    }
  }

  partialAmountHandler = (id) => e => {
    let ppValid = true
    let { partialAmount } = this.state

    const rowData = this.props.installmentsPlans.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.installment_amount < e.target.value) && (e.target.value > 0)) {
        this.props.alert.warning('Amount cant be greater than balance!')
        ppValid = false
        return false
      }
    })

    if (ppValid) {
      this.setState({ partialAmount: { ...partialAmount, [id]: e.target.value } })
    } // 1908010049
  }

  showaInstallment = () => {
    if (this.state.feePlan && this.props.installmentsPlans && this.props.installmentsPlans.length) {
      return (
        <React.Fragment>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Check</TableCell>
                <TableCell align='center'>Installment Name</TableCell>
                <TableCell align='center'>Amount</TableCell>
                <TableCell align='center'>Due Date</TableCell>
                <TableCell align='center'>Enter Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.installmentsPlans.map((item, i) => (
                <TableRow key={item.installment_name}>
                  {/* <TableCell align='center'>{i + 1}</TableCell> */}
                  <TableCell align='center'>
                    <input
                      type='checkbox'
                      name='checking'
                      value={i + 1}
                      checked={this.state.isChecked[item.id]}
                      onChange={
                        this.addBalance(item.id)
                      } />
                  </TableCell>
                  <TableCell align='center'>{item.installment_name}</TableCell>
                  <TableCell align='center'>{item.installment_amount}</TableCell>
                  <TableCell align='center'>{item.due_date}</TableCell>
                  <TableCell>
                    <TextField
                      label='Amount'
                      type='Number'
                      margin='dense'
                      fullWidth
                      name='partialAmount'
                      id={item.id}
                      variant='outlined'
                      disabled={this.state.isChecked[item.id]}
                      onChange={this.partialAmountHandler(item.id)}
                      value={this.state.partialAmount[item.id] ? this.state.partialAmount[item.id] : item.installment_amount}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell style={{ fontSize: '18px' }}>
                  Total: {this.state.selectedTotal}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </React.Fragment>
      )
    } else {
      return <div>
        <p>Select Fee Plan</p>
      </div>
    }
  }

  render () {
    console.log('from nonRTE: ', this.props.studentDetailsForAdmission)
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={3} className={classes.spacing}>
            <label>Fee Plan*</label>
            <Select
              placeholder='Select'
              // defaultValue={{ value: this.state.studentDetails.class.id, label: this.state.studentDetails.class.grade }}
              // value={{ value: this.state.feePlan && this.state.feePlan.value ? this.state.feePlan.value : null, label: this.state.feePlan && this.state.studentDetails.label ? this.state.studentDetails.label : null }}
              value={this.state.feePlan ? this.state.feePlan : null}
              options={this.props.feePlans ? this.props.feePlans.map(fees => ({
                value: fees.id,
                label: fees.fee_plan_name
              }))
                : []
              }
              name='feePlan'
              onChange={(e) => { this.studentDetailsDropdonHandler(e) }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={1} className={classes.spacing} />
          <Grid item xs={8} className={classes.spacing}>
            {this.showaInstallment()}
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  // session: state.academicSession.items,
  gradeList: state.finance.common.gradeList,
  sectionList: state.finance.common.sectionsPerGrade,
  classGroupList: state.finance.common.groups,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion,
  feePlans: state.finance.accountantReducer.admissionForm.feePlans,
  installmentsPlans: state.finance.accountantReducer.admissionForm.installmentsPlans
})
const mapDispatchToProps = dispatch => ({
  // loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user, moduleId) => dispatch(actionTypes.fetchGradeList({ alert, user, moduleId })),
  fetchClassGroup: (alert, user) => dispatch(actionTypes.fetchClassGroup({ alert, user })),
  fetchAllSectionsPerGrade: (session, alert, user, gradeId, moduleId) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, alert, user, gradeId, moduleId })),
  fetchFeePlan: (alert, user, session, gradeValue) => dispatch(actionTypes.fetchFeePlan({ alert, user, session, gradeValue })),
  fetchInstallment: (alert, user, feePlanId) => dispatch(actionTypes.fetchInstallment({ alert, user, feePlanId }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NonRTEFeeDetailsFormAcc)))
