import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
// import InputLabel from '@material-ui/core/InputLabel'
// import MenuItem from '@material-ui/core/MenuItem'
// import OutlinedInput from '@material-ui/core/OutlinedInput'
// import AutoSuggest from '@material-ui/core/'
import Select from 'react-select'
// import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Modal from '../../../../ui/Modal/modal'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Receipt from './receipt'
import Layout from '../../../../../../Layout'
// import { debounce } from '../../../../utils' // rajneesh
// import { TransferWithinAStationSharp } from '@material-ui/icons'

// const useStyles = theme => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap'
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1)
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2)
//   }
// })

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
        if (item.child_name === 'Registration Form') {
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
class NewRegistration extends Component {
  constructor (props) {
    super(props)
    this.state = {
      academicYearValue: {
        label: '2021-22',
        value: '2021-22'
      },
      searchByValue: {
        label: 'Application No',
        value: 'Application No'
      },
      searchedValue: '',
      searchedLabel: '',
      mobileNo: null,
      appNo: null,
      appAmount: null,
      receiptNo: null,
      showModal: false,
      selectedBranches: null
    }
  }

  componentDidMount() {
    if (this.state.academicYearValue) {
      this.props.fetchBranches(this.state.academicYearValue.value, this.props.alert, this.props.user, moduleId)
    }
  }

  onAcademicYearChange = (e) => {
    this.setState({
      academicYearValue: e
    }, () => {
      this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
    })
  }

  changehandlerbranch = (e) => {
    // this.props.fetchGrades(this.props.alert, this.props.user, moduleId, e.value)
    this.setState({ selectedBranches: e})
  }

  onSearchByChange = (e) => {
    this.setState({
      searchByValue: e,
      searchedValue: '',
      searchedLabel: ''
    })
  }

  // myErpFunc = debounce(() => {
  //   this.props.fetchRegistrationSugg(
  //     this.state.academicYearValue.value,
  //     this.state.searchByValue.value,
  //     this.state.searchedValue,
  //     this.props.user,
  //     this.props.alert
  //   )
  // }, 500) // rajneesh
  myErpFunc =() => {
    this.props.fetchRegistrationSugg(
      this.state.academicYearValue?.value,
      this.state.searchByValue.value,
      this.state.searchedValue,
      this.props.user,
      this.props.alert,
      this.state.selectedBranches.value,
      moduleId
    )
  }

  onSearchChange = (e, selected) => {
    this.setState({
      searchedValue: e.target.value, searchedLabel: e.target.label
    }, () => {
      if (this.state.searchedValue.length >= 3) {
        this.myErpFunc()
      }
    })
  }

  onSubmit = () => {
    const { searchedValue, academicYearValue } = this.state
    this.props.getStudentInfo(academicYearValue.value, searchedValue, this.props.user, this.props.alert, this.state.selectedBranches.value, moduleId)
    // if (this.props.registrationDetails.error && this.props.registrationDetails.error.length > 0) {
    //   this.setState({ showModal: true })
    // } else {
    //   this.setState({ showModal: false })
    // }
  }

  hideRegModalHanlder = () => {
    this.setState({ showModal: false })
  }

  goBackHandler = () => {
    this.setState({ showModal: false })
    this.props.clearProps()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.registrationDetails && nextProps.registrationDetails.error && nextProps.registrationDetails.error.length) {
      this.setState({
        showModal: false
      })
    }
  }

  // static getDerivedStateFromProps (nextProps, prevState) {
  //   console.log('++++ newCycle nextProps: ', nextProps)
  //   console.log('++++ newCycle prevState: ', prevState)
  //   if ((nextProps.registrationDetails && nextProps.registrationDetails.error) !== (this.props.registrationDetails.length && this.props.registrationDetails.error)) {
  //     // this.setState({
  //     //   showModal: true
  //     // })
  //     console.log('errrrr')
  //   }
  // }

  render () {
    const { registrationDetails, regNum } = this.props
    const { academicYearValue, searchByValue, selectedBranches } = this.state
    let regModal

    if (this.state.showModal) {
      regModal = (
        <Modal open={this.state.showModal} small click={this.hideRegModalHanlder}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
              <p>Message :{this.props.registrationDetails.error}</p>
            </Grid>
          </Grid>
          <Grid container justify='space-between' alignItems='flex-end' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12' />
            <Grid item xs='3'>
              <Button
                color='primary'
                size='small'
                variant='contained'
                onClick={this.goBackHandler}
              >
              Go Back
              </Button>
            </Grid>
            <Grid item xs='3'>
              <Button
                color='secondary'
                size='small'
                variant='contained'
                onClick={this.hideRegModalHanlder}
              >
              Proceed
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )
    }

    // let searchBox = null
    // if (this.state.searchByValue === 'Application No') {
    //   searchBox = (
    //     <div>
    //       {/* <label style={{ display: 'block' }}>Search By Registration Number</label> */}
    //       <AutoSuggest
    //         label={searchByValue}
    //         // style={{ display: 'absolute', top: '10px', width: '240px' }}
    //         // value={this.state.regNo || ''}
    //         onChange={this.searchByAppnoHandler}
    //         margin='dense'
    //         variant='outlined'
    //         data={this.props.regNoSuggestion && this.props.regNoSuggestion.length > 0 ? this.props.regNoSuggestion.map(item => ({ value: item.registration_number ? item.registration_number : '', label: item.registration_number ? item.registration_number : '' })) : []}
    //       />
    //     </div>
    //   )
    // } else if (this.state.searchByValue === 'Student Name') {
    //   searchBox = (
    //     <div>
    //       {/* <label style={{ display: 'block' }}>Search By Application Number</label> */}
    //       <AutoSuggest
    //         label={searchByValue}
    //         // style={{ display: 'absolute', top: '10px', width: '240px' }}
    //         // value={this.state.student || ''}
    //         onChange={this.searchByAppnoHandler}
    //         margin='dense'
    //         variant='outlined'
    //         // data={this.props.ErpSuggestions && this.props.ErpSuggestions.length > 0 ? this.props.ErpSuggestions.map(item => ({ value: item.erp ? item.erp : '', label: item.erp ? item.erp : '' })) : []}
    //       />
    //     </div>
    //   )
    // }
    return (
      <Layout>
      <Grid container spacing={3} style={{ flexGrow: 1, padding: '20px' }}>
        <Grid item xs={2}>
          <Select
            placeholder='Select Year'
            // style={{ height: '30px' }}
            value={academicYearValue || null}
            options={
              this.props.session
                ? this.props.session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={(e) => { this.onAcademicYearChange(e) }}
          />
          </Grid>
          <Grid item xs={2}>
            {/* <label>Branch*</label> */}
            <Select
              // isMulti
              placeholder='Select Branch'
              value={this.state.selectedBranches ? this.state.selectedBranches : ''}
              options={
                this.state.selectedbranchIds !== 'all' ? this.props.branches.length && this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : [] : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
        <Grid item xs={2}>
          {/* <FormControl className={useStyles.formControl} style={{ width: '100%' }}>
            <InputLabel htmlFor='search'>Search By</InputLabel>
            <Select
              variant='outlined'
              value={searchByValue}
              onChange={this.onSearchByChange}
              inputProps={{
                name: 'age',
                id: 'age-simple'
              }}
            >
              <MenuItem value='Application No'>Application No</MenuItem>
              <MenuItem value='Student Name'>Student Name</MenuItem>
              <MenuItem value='Mobile No'>Mobile No</MenuItem>
            </Select>
          </FormControl> */}
          <Select
            placeholder='Search By'
            // style={{ height: '30px' }}
            value={searchByValue || null}
            options={[
              {
                value: 'Application No',
                label: 'Application No'
              },
              {
                value: 'Student Name',
                label: 'Student Name'
              },
              {
                value: 'Mobile No',
                label: 'Mobile No'
              }
            ]}
            onChange={(e) => { this.onSearchByChange(e) }}
          />
        </Grid>
        <Grid item xs={3} style={{ padding: '5px' }}>
          {/* <TextField
            style={{ width: '100%' }}
            id='outlined-search'
            label={searchByValue}
            onChange={this.onSearchChange}
            type='search'
            className={useStyles.textField}
            margin='normal'
            variant='outlined'
          /> */}
          <AutoSuggest
            label={searchByValue.value}
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.searchedLabel && this.state.searchedLabel.length > 0 ? this.state.searchedLabel : this.state.searchedValue}
            onChange={this.onSearchChange}
            margin='dense'
            variant='outlined'
            data={
              this.props.appSugg && this.props.appSugg.length > 0 && searchByValue.value === 'Application No'
                ? this.props.appSugg.map(item => ({ value: item.application_number ? item.application_number : '', label: item.application_number ? item.application_number : '' }))
                : this.props.appSugg && this.props.appSugg.length > 0 && searchByValue.value === 'Student Name'
                  ? this.props.appSugg.map(item => ({ value: item.application_number ? item.application_number : '', label: item.student && item.student.student_name ? item.student.student_name : '' }))
                  : this.props.appSugg && this.props.appSugg.length > 0 && searchByValue.value === 'Mobile No'
                    ? this.props.appSugg.map(item => ({ value: item.application_number ? item.application_number : '', label: item.student && item.student.phone ? item.student.phone : '' }))
                    : []
            }
          />
        </Grid>
        <Grid item xs={2} style={{ padding: '15px' }}>
          <Button variant='contained' color='primary' disabled={!this.state.academicYearValue.value} onClick={this.onSubmit}>
              Get
          </Button>
        </Grid>
        {registrationDetails && registrationDetails.length !== 0
          ? (<Grid container spacing={3} style={{ flexGrow: 1, padding: '20px' }}>
            <Grid item xs={12}>
              <h3><u>Student Details</u></h3>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Student Name: </label>
                <label>{registrationDetails && registrationDetails.student_name ? registrationDetails.student_name : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Class: </label>
                <label>{registrationDetails.opting_class && registrationDetails.opting_class.grade ? registrationDetails.opting_class.grade : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Father Name: </label>
                <label>{registrationDetails.parent && registrationDetails.parent.father_name ? registrationDetails.parent.father_name : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Father Mobile No: </label>
                <label>{registrationDetails.parent && registrationDetails.parent.father_mobile_no ? registrationDetails.parent.father_mobile_no : ''}</label>
              </div>
            </Grid>
            <Grid item xs={12}>
              <h3><u>Application Details</u></h3>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Appp. No: </label>
                <label>{registrationDetails.application_number ? registrationDetails.application_number : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Branch: </label>
                <label>{registrationDetails.branch && registrationDetails.branch.branch_name ? registrationDetails.branch.branch_name : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Application Amount: </label>
                <label>{registrationDetails && registrationDetails.payment && registrationDetails.payment.total_amount ? registrationDetails && registrationDetails.payment && registrationDetails.payment.total_amount : ''}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Application Date: </label>
                <label>{registrationDetails && registrationDetails.application_date}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Receipt No: </label>
                <label>{registrationDetails && registrationDetails.payment && registrationDetails.payment.receipt_number_online ? registrationDetails && registrationDetails.payment && registrationDetails.payment.receipt_number_online : registrationDetails && registrationDetails.payment && registrationDetails.payment.receipt_number}</label>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Admission Type: </label>
                <label>{registrationDetails.admission_type ? registrationDetails.admission_type : ''}</label>
                {/* <label>{registrationDetails.application_type}</label> */}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div style={{ display: 'inline' }}>
                <label style={{ color: 'blue', marginRight: '5px' }}>Registration Amount: </label>
                <label>{regNum && regNum.registration_fee && regNum.registration_fee.amount ? regNum.registration_fee.amount : 'Assign Amount in Admin'}</label>
                {/* <label>{registrationDetails.application_type}</label> */}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Receipt
                  acadYear={academicYearValue.value}
                  branchId={selectedBranches.value}
                  alert={this.props.alert}
                  user={this.props.user}
                  moduleId={moduleId}
              />
            </Grid>
            <div><hr /></div>
          </Grid>
          )
          : ''
        }
        {regModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </Grid>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  registrationDetails: state.finance.accountantReducer.regForm.registrationDetails,
  appSugg: state.finance.accountantReducer.regForm.appSugg,
  regNum: state.finance.accountantReducer.regForm.regNum,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  getStudentInfo: (session, data, user, alert, branchId, moduleId) => dispatch(actionTypes.getStudentInfo({ session, data, user, alert, branchId, moduleId })),
  fetchRegistrationSugg: (session, type, value, user, alert, branchId, moduleId) => dispatch(actionTypes.fetchRegistrationSugg({ session, type, value, user, alert, branchId, moduleId })),
  clearProps: () => dispatch(actionTypes.clearNewRegFormProps()),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewRegistration))
