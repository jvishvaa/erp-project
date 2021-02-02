import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Typography, Grid, Button
// TextField, Table, TableHead, TableRow, TableCell, TableBody
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest'
// import Select from 'react-select'
// import { Info } from '@material-ui/icons'
// import Modal from '../../../../ui/Modal/modal'
// import { OmsSelect } from '../../../../ui'
// import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import classes from './pdc.module.css'
import Student from '../../Profiles/studentProfile'
import MakePayment from '../../MakePaymentAccountant/makePayment'
import FeeStructureAtAcc from '../FeeStructureAtAcc/feeStructureAcc'
import Payments from '../TransactionStatus/Payments/payments'
import ChequePayments from '../TransactionStatus/ChequePayments/chequePayment'
import Certificate from '../ITCertificate/certificate'
import ConcessionDetails from '../ConcessionDetails/concessionDetails'
// import FeeMangement from '../FeeManagement/feeManagement'
import CurrFeeTypeAcc from '../CurrFeeTypeAcc/currFeeTypeAcc'
import StoreAtAcc from '../../../Inventory/BranchAccountant/StoreAtAcc/storeAtAcc'
import ShippingAmount from '../../../Inventory/BranchAccountant/shippingAmount/ShippingAmount'
import StoreItemStatus from '../StoreItemStatus/storeItemStatus'
import Layout from '../../../../../../Layout'
// import { debounce } from '../../../../utils'
// import OtherFeesAccountant from '../OtherFees/otherFees'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%'
  },
  item: {
    margin: '10px'
  },
  formControl: {
    margin: theme.spacing * 1,
    minWidth: 120
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    marginTop: '72px',
    marginLeft: '40px',
    paddingTop: '20px',
    minHeight: '75vh'
  }
})

class StudentLedgerTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 'one',
      session: {
        label: '2020-21',
        value: '2020-21'
      },
      sessionData: null,
      getData: false,
      showTabs: false,
      erpNo: null,
      gradeId: 'all',
      gradeData: {
        label: 'All Grades',
        id: 'all'
      },
      sectionId: null,
      sectionData: null,
      studentTypeData: {
        label: 'Active',
        value: 1
      },
      // studentTypeId: null,
      searchTypeData: {
        label: 'Student Name',
        value: 2
      },
      searchTypeId: 2,
      student: '',
      selectedErpStatus: false,
      studentName: '',
      selectedNameStatus: false,
      studentErp: '',
      allSections: true
    }
  }

  componentDidMount () {
    if (this.state.session) {
      this.props.fetchGrades(this.state.session.value, this.props.alert, this.props.user)
    }
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  handleAcademicyear = (e) => {
    console.log('current session: ', e)
    this.setState({
      session: e,
      getData: false,
      student: null,
      showTabs: false
    }, () => {
      this.props.fetchGrades(this.state.session.value, this.props.alert, this.props.user)
    })
  }

  gradeHandler = (e) => {
    this.setState({ gradeId: e.value, gradeData: e, sectionData: [] }, () => {
      if (this.state.gradeId === 'all') {
        this.setState({
          allSections: true,
          sectionId: 'all',
          getData: false
        })
      } else {
        this.props.fetchAllSections(this.state.session.value, this.state.gradeId, this.props.alert, this.props.user)
        this.setState({
          allSections: false,
          getData: false
        })
      }
    })
  }

  sectionHandler = (e) => {
    let sectionIds = []
    e.forEach(section => {
      sectionIds.push(section.value)
    })
    this.setState({ sectionId: sectionIds, sectionData: e, getData: false })
  }

  allSectionHandler = (e) => {
    this.setState({ sectionId: e.target.value, sectionData: e, getData: false })
  }

  activeHandler = (e) => {
    this.setState({
      // studentTypeId: e.value,
      studentTypeData: e,
      getData: false
    })
  }

  searchTypeHandler = (e) => {
    this.setState({
      searchTypeData: e,
      searchTypeId: e.value,
      getData: false,
      showTabs: false,
      studentName: ''
    }, () => {
      this.props.clearAllProps()
    })
  }

  erpHandler = () => {
    // const erp = document.querySelectorAll('[name=searchBox]')
    if (this.state.searchTypeData.value === 1 && this.state.selectedErpStatus) {
      this.props.fetchAllPayment(this.state.session.value, this.state.studentLabel, this.props.user, this.props.alert)
    } else if (this.state.searchTypeData.value === 2 && this.state.selectedNameStatus) {
      this.props.fetchAllPayment(this.state.session.value, this.state.studentErp, this.props.user, this.props.alert)
    } else {
      this.props.alert.warning('Select Valid Erp')
    }
    // makePayState = this.state
  }

  myErpFunc = () => {
    this.props.studentErpSearch(
      'erp',
      this.state.session.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.student,
      this.props.alert,
      this.props.user
    )
  }

  studentErpChangeHandler = (e, selected) => {
    this.setState({ student: e.target.value, studentLabel: e.target.label, selectedErpStatus: selected, showTabs: false, getData: false }, () => {
      if (this.state.student.length >= 3) {
        this.myErpFunc()
      }
    })
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: false,
        getData: false
      })
    }
  }

  myStudentFun = () => {
    const { searchTypeId } = this.state
    this.props.studentErpSearch(
      searchTypeId === 2 ? 'student' : searchTypeId === 3 ? 'fatherName' : searchTypeId === 4 ? 'fatherNo' : searchTypeId === 5 ? 'motherName' : searchTypeId === 6 ? 'motherNo' : 'na',
      this.state.session.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.studentName,
      this.props.alert,
      this.props.user
    )
  }

  studentNameChangeHandler = (e, selected) => {
    this.setState({ studentName: e.target.value, selectedNameStatus: selected, showTabs: false, getData: false }, () => {
      const student = this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.filter(item => item.name === this.state.studentName)[0] : ''
      this.setState({
        studentErp: student && student.erp ? student.erp : null
      })
      if (this.state.studentName.length >= 3) {
        this.myStudentFun()
      }
    })
  }

  // erpChangeHander = (e) => {
  //   this.setState({
  //     erpNo: e.target.value,
  //     getData: false
  //   })
  // }

  showLedgerHandler = () => {
    if (!this.state.session && !this.state.studentErp) {
      this.props.alert.warning('Please Fill All The Fields')
      return
    }
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: true,
        getData: true
      })
    } else {
      this.props.alert.warning('Select Valid Student')
    }
  }
  callbackFunction = (childData) => {
    this.setState({
      session: {
        label: childData,
        value: childData
      }
      // getData: false,
      // showTabs: false
    }, () => {
      console.log('realsession', this.state.session)
    })
    console.log('Childdata', childData)
  }
  render () {
    const { showTabs, value } = this.state
    const { classes } = this.props
    let tabBar = null
    // let cond = true
    let erpValue = null
    if (this.state.searchTypeData.value === 1 && this.state.selectedErpStatus) {
      erpValue = this.state.studentLabel
    } else if (this.state.selectedNameStatus) {
      erpValue = this.state.studentErp
    }
    // console.log('the session state: ', this.state.session)
    if (showTabs) {
      tabBar = (
        <React.Fragment>
          <AppBar position='static' style={{ zIndex: 1 }}>
            <Tabs value={value} onChange={this.handleChange} variant='scrollable' scrollButtons='auto'>
              <Tab value='one' label='Fee Structure' />
              <Tab value='two' label='Make Payment' />
              <Tab value='three' label='Payments' />
              <Tab value='four' label='Cheque Payment' />
              <Tab value='five' label='IT Certificate' />
              <Tab value='six' label='Concession Details' />
              {/* <Tab value='seven' label='Fee Management' /> */}
              <Tab value='eight' label='Curr Fee Type' />
              <Tab value='nine' label='STORE' />
              <Tab value='ele' label='Shipping Amount' />
              <Tab value='ten' label='Order Status' />
            </Tabs>
          </AppBar>
          {value === 'one' && <TabContainer>
            <FeeStructureAtAcc alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user} />
          </TabContainer>}
          {value === 'two' && <TabContainer>
            <MakePayment alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user}
              parentCallback={this.callbackFunction} />
          </TabContainer>}
          {value === 'three' && <TabContainer>
            <Payments alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erpNo={erpValue}
              user={this.props.user} />
          </TabContainer>}
          {value === 'four' && <TabContainer>
            <ChequePayments alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erpNo={erpValue}
              user={this.props.user} />
          </TabContainer>}
          {value === 'five' && <TabContainer>
            <Certificate alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user} />
          </TabContainer>}
          {value === 'six' && <TabContainer>
            <ConcessionDetails alert={this.props.alert}
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user} />
          </TabContainer>}
          {/* {value === 'seven' && <TabContainer>
            <FeeMangement
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user}
              alert={this.props.alert}
            />
          </TabContainer>} */}
          {value === 'eight' && <TabContainer>
            <CurrFeeTypeAcc
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user}
              alert={this.props.alert}
            />
          </TabContainer>}
          {value === 'nine' && <TabContainer>
            <StoreAtAcc
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user}
              alert={this.props.alert}
            />
          </TabContainer>}
          {value === 'ele' && <TabContainer>
            <ShippingAmount
              session={this.state.session.value}
              getData={this.state.getData}
              erpValue={erpValue}
              user={this.props.user}
              alert={this.props.alert}
            />
          </TabContainer>}
          {value === 'ten' && <TabContainer>
            <StoreItemStatus
              session={this.state.session.value}
              getData={this.state.getData}
              erp={erpValue}
              user={this.props.user}
              alert={this.props.alert}
            />
          </TabContainer>}
        </React.Fragment>
      )
    }

    // section row
    let sectionRow = null
    if (this.state.allSections) {
      sectionRow = 'All Sections'
    } else {
      sectionRow = (
        <Select
          placeholder='Select Section'
          isMulti
          disabled={this.state.allSections}
          value={this.state.sectionData ? this.state.sectionData : ''}
          options={
            this.props.sectionData
              ? this.props.sectionData.map(sec => ({
                value: sec.section.id,
                label: sec.section.section_name
              }))
              : []
          }
          onChange={this.sectionHandler}
        />
      )
    }

    // auto suggestions dropdown
    const { searchTypeData, searchTypeId } = this.state
    let searchBox = null
    if (searchTypeData.value === 1) {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label='Search ERP'
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.student || ''}
            onChange={this.studentErpChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.map(item => ({ value: item.erp ? item.erp : '', label: item.erp ? item.erp : '' })) : []}
          />
        </div>
      )
    } else {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label={searchTypeId === 2 ? 'Search Student Name' : searchTypeId === 3 ? 'Search Father Name' : searchTypeId === 4 ? 'Search Father Number' : searchTypeId === 5 ? 'Search Mother Name' : searchTypeId === 6 ? 'Search Mother Number' : 'na'}
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.studentName || ''}
            onChange={this.studentNameChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.map(item => ({ value: item.name ? item.name : '', label: item.name ? item.name : '' })) : []}
          />
        </div>
      )
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs={3} className={classes.item} style={{ zIndex: '1103' }}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.session ? this.state.session : null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs={3} className={classes.item} style={{ zIndex: '1102' }}>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={this.state.gradeData ? this.state.gradeData : null}
              options={
                this.props.gradeData
                  ? this.props.gradeData.map(grades => ({
                    value: grades.grade.id,
                    label: grades.grade.grade
                  }))
                  : []
              }
              onChange={this.gradeHandler}
            />
          </Grid>
          <Grid item xs={3} className={classes.item} style={{ zIndex: '1101' }}>
            <label>Section*</label>
            {sectionRow}
          </Grid>
          <Grid item xs={3} className={classes.item} style={{ zIndex: '1100' }}>
            <label>Active/Inactive*</label>
            <Select
              placeholder='Select State'
              value={this.state.studentTypeData ? this.state.studentTypeData : ''}
              options={[
                {
                  label: 'Active',
                  value: 1
                },
                {
                  label: 'InActive',
                  value: 2
                },
                {
                  label: 'Both',
                  value: 3
                }
              ]}
              onChange={this.activeHandler}
            />
          </Grid>
          <Grid item xs={3} className={classes.item} style={{ zIndex: '1000' }}>
            <label>Search Type*</label>
            <Select
              placeholder='Select Type'
              value={this.state.searchTypeData ? this.state.searchTypeData : ''}
              options={[
                {
                  label: 'ERP',
                  value: 1
                },
                {
                  label: 'Student Name',
                  value: 2
                },
                {
                  label: 'Father Name',
                  value: 3
                },
                {
                  label: 'Father Number',
                  value: 4
                },
                {
                  label: 'Mother Name',
                  value: 5
                },
                {
                  label: 'Mother Number',
                  value: 6
                }
              ]}
              onChange={this.searchTypeHandler}
            />
          </Grid>
          <Grid item xs={3}>
            {searchBox}
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <Button
              style={{ marginLeft: '10px', marginTop: '20px' }}
              variant='contained'
              color='primary'
              disabled={!this.state.session}
              // onClick={this.erpHandler}
              onClick={this.showLedgerHandler}>
              GET
            </Button>
          </Grid>
        </Grid>
        {this.state.searchTypeData.value === 1
          ? <Student erp={this.state.studentLabel} session={this.state.session.value} user={this.props.user} alert={this.props.alert} />
          : <Student erp={this.state.studentErp} session={this.state.session.value} user={this.props.user} alert={this.props.alert} />}
        {tabBar}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}
// zdfsdf
// hi sandeep here
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  // ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  gradeData: state.finance.accountantReducer.pdc.gradeData,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  studentErp: state.finance.accountantReducer.studentErpSearch.studentErpList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  // fetchErpSuggestions: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.fetchErpSuggestions({ type, session, grade, section, status, erp, alert, user })),
  studentErpSearch: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.studentErpSearch({ type, session, grade, section, status, erp, alert, user })),
  clearAllProps: (alert, user) => dispatch(actionTypes.clearAllProps({ alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user }))
//   fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentLedgerTab)))
