import React from 'react'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { qBUrls } from '../../../urls'
import InsightCard from './insight'
import PoBudgetCard from './poBudgetCard'
import ExpenseTracker from './expenseTracker'
import BranchExpenseTracker from './branchExpenseTracker'
import '../styles/dashbord.css'

const poBudget = ['30', '40', '30']
export default class ManagementDashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

      piechartGraphProperties: {
        data: [],
        labels: ['Maintenance', 'Furniture', 'Subscription']
      },
      plottedLineGraph: {
        data: [],
        labels: [],
        plottedColors: [],
        fill: '#27ae60'

      },
      barGraphBranch: {
        data: [],

        labels: [],
        plottedColors: []

      },
      token: JSON.parse(localStorage.getItem('user_profile')).personal_info.token,
      poAmount: 0,
      invoiceAmount: 0,
      paidAmount: 0,
      balancePayment: 0,
      expenseTrackerDropdown: [{ value: 0, label: 'Weekly' }, { value: 1, label: 'Monthly' }],
      expenseTrackerData: [],
      expenseType: 'monthly',
      expenseTypeBranch: 'monthly',
      totalInvoice: 0,
      branchId: 0,
      key: new Date().getTime()

    }
  }

  componentDidMount () {
    this.setState({
      piechartGraphProperties: { ...this.state.piechartGraphProperties,
        data: poBudget }
    })
    this.getInsights()
    this.getTotlaExpenses()
    this.getTotlaExpensesBranch()
  }
  getTotlaExpenses () {
    const { expenseType } = this.state
    let path = qBUrls.ManagementDashboardTotalExpense + `?date_type=${expenseType.toLocaleLowerCase()}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.state.token
      }
    })
      .then(res => {
        this.setState({
          totalInvoice: res.data.data.pop(),

          plottedLineGraph: { ...this.state.plottedLineGraph,
            labels: res.data.data && res.data.data.map(val => Object.keys(val)),
            data: res.data.data && res.data.data.map(val => Object.values(val)).flat(),
            plottedColors: [ '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22',
              '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22', '#e67e22']
          }

        })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Something went wrong')
      })
  }

  getTotlaExpensesBranch (branchId) {
    const { expenseTypeBranch } = this.state
    if (branchId === undefined) {
      let path = qBUrls.ManagementDashboardTotalExpense
      axios.get(path, {
        headers: {
          Authorization: 'Bearer ' + this.state.token
        }
      })
        .then(res => {
          this.setState({
            loading: false,
            barGraphBranch: { ...this.state.barGraphBranch,
              labels: ['Branch PO', 'Branch Invoice Amount', 'Branch PaidAmount', 'Branch BalancePayment'],
              data: [res.data.data.po_amount, res.data.data.invoice_amount, res.data.data.paid_amount, res.data.data.balance_payment]
            }
          })
        })
        .catch(err => {
          console.log(err)
          this.props.alert.error('Something went wrong')
        })
    } else {
      let path = qBUrls.ManagementDashboardTotalExpense + `?date_type=${expenseTypeBranch.toLocaleLowerCase()}` + `&branch_id=${branchId}`
      axios.get(path, {
        headers: {
          Authorization: 'Bearer ' + this.state.token
        }
      })
        .then(res => {
          this.setState({
            loading: false,
            barGraphBranch: { ...this.state.barGraphBranch,
              labels: ['Branch PO', 'Branch Invoice Amount', 'Branch PaidAmount', 'Branch BalancePayment'],
              data: [res.data.data.po_amount, res.data.data.invoice_amount, res.data.data.paid_amount, res.data.data.balance_payment]
            }
          })
        })
        .catch(err => {
          console.log(err)
          this.props.alert.error('Something went wrong')
        })
    }
  }
  getInsights=() => {
    let path = qBUrls.ManagementDashboardTotalExpense + `?from_date=${''}&to_date=${''}&date_type=${''}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.state.token
      }
    })
      .then(res => {
        this.setState({
          poAmount: res.data.data.po_amount,
          invoiceAmount: res.data.data.invoice_amount,
          paidAmount: res.data.data.paid_amount,
          balancePayment: res.data.data.balance_payment

        })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Something went wrong')
      })
  }

  handleExpenseType=(e) => {
    this.setState({
      expenseType: e.label
    }, () => {
      this.getTotlaExpenses()
    })
  }
  handleBranchExpenseType=(e) => {
    const { branchId } = this.state
    this.setState({
      expenseTypeBranch: e.label
    })
    if (e.label && !branchId === false) {
      this.setState({
        key: new Date().getTime()
      })
    }
  }
  handleSelectorData=(data) => {
    if (data && data.branch_id) {
      this.setState({
        branchId: data.branch_id
      }, () => this.getTotlaExpensesBranch(data.branch_id))
    }
  }
  render () {
    const { poAmount, invoiceAmount, paidAmount, balancePayment, expenseTrackerDropdown, totalInvoice, key } = this.state
    return (
      <React.Fragment>

        <div className='dashboard__header__mgmt' />
        <Grid container spacing={2} style={{ marginTop: '-30px', marginLeft: '10px', width: '98%', marginBottom: '10px' }}>

          <InsightCard poAmount={poAmount} invoiceAmount={invoiceAmount} paidAmount={paidAmount} balancePayment={balancePayment} />

          <PoBudgetCard pieChartvalues={{ ...this.state.piechartGraphProperties }} />

          <ExpenseTracker plottedValues={{ ...this.state.plottedLineGraph }} dataTypeValues={expenseTrackerDropdown} toggleValues={this.handleExpenseType} totalInvoiceAmount={totalInvoice.invoice_amount} />

          <BranchExpenseTracker plottedValues={{ ...this.state.barGraphBranch }} dataTypeValues={expenseTrackerDropdown} toggleValues={this.handleBranchExpenseType} handleSelectorData={this.handleSelectorData} gKey={key} />
        </Grid>

      </React.Fragment>)
  }
}
