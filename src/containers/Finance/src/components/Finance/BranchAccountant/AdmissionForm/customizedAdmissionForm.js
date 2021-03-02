import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, Button, CircularProgress } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest'
import NewAdmissionFormAcc from './newAdmissionForm'
import NonRTEFormAcc from './nonRTEAdmissionForm'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions'
// import { debounce } from '../../../../utils' // rajeesh due to import issue
import Layout from '../../../../../../Layout'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center'
  }
})

class CustomizedAdmissionFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: {
        label: '2020-21',
        value: '2020-21'
      },
      searchByDropdown: 'Registration Number',
      regNo: null,
      appNo: null,
      regStatus: false,
      appStatus: false,
      otherKey: null,
      otherStatus: false
    }
  }
  buttonHandler = (e) => {
    this.props.history.push({
      pathname: '/finance/newAdmissionForm'
    })
  }
  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({
      session: e
    })
  }
  componentDidUpdate () {
    // console.log('DID UPDATED', this.state.regNo)
  }
  rteButtonHandler = (e) => {
    if (this.state.appStatus || this.state.regStatus || this.state.otherStatus) {
      // this.props.getStudentdetailsbyregNumber(this.state.regNo, this.props.user, this.props.alert)
      if (this.props.studentDetailsForAdmission && this.props.studentDetailsForAdmission.admission_status === true) {
        // this.props.alert.warning('Admission Already Completed With # ' + this.props.studentDetailsForAdmission.admission_number)
      } else if (this.props.studentDetailsForAdmission && this.props.studentDetailsForAdmission.admission_status === false) {
        this.props.history.push({
          pathname: '/finance/accountant/NonRTEFormAcc',
          regNo: this.state.regNo || this.state.regId
        })
      }
    }
  }
  handleSearchby = event => {
    console.log(event.value)
    this.setState({
      searchByDropdown: event.value,
      regNo: null,
      otherKey: null
    })
  }

  // myRegFunc = debounce(() => {
  //   this.props.fetchErpSuggestions(
  //     'erp',
  //     this.state.session.value,
  //     this.state.gradeId,
  //     this.state.sectionId,
  //     this.state.studentTypeData.value,
  //     this.state.student,
  //     this.props.alert,
  //     this.props.user
  //   )
  // }, 500)
  myRegFunc = () => {
    this.props.fetchErpSuggestions(
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

  // myFunc = debounce(() => { this.props.searchAdmissionByOthers(this.state.searchByDropdown, this.state.session.value, this.state.otherKey, this.props.user, this.props.alert) }, 500)
  myFunc = () => { this.props.searchAdmissionByOthers(this.state.searchByDropdown, this.state.session.value, this.state.otherKey, this.props.user, this.props.alert) }

  searchByOthers = (event, selected, id) => {
    let regNo = null
    if (selected && (id === 'fatherName')) {
      regNo = this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.filter(item => item.student.parent.father_name === event.target.value)[0] : ''
    } else if (selected && (id === 'fatherNumber')) {
      regNo = this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.filter(item => item.student.parent.father_mobile_no === event.target.value)[0] : ''
    } else if (selected && (id === 'motherName')) {
      regNo = this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.filter(item => item.student.parent.mother_name === event.target.value)[0] : ''
    } else if (selected && (id === 'motherNumber')) {
      regNo = this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.filter(item => item.student.parent.mother_mobile_no === event.target.value)[0] : ''
    }
    this.setState({ otherKey: event.target.value, regNo: regNo && regNo.registration_number ? regNo.registration_number : '', appStatus: false, regStatus: false, otherStatus: selected }, () => {
      if (this.state.otherKey.length >= 3) {
        this.myFunc()
      }
      if (this.state.otherStatus) {
        this.props.getStudentdetailsbyregNumber(this.state.session.value, this.state.regNo, this.props.user, this.props.alert)
      }
    })
  }

  searchByRegnoHandler = (e, selected) => {
    this.setState({ regNo: e.target.value, regStatus: selected, appNo: null, appStatus: false, otherStatus: false, regId: null }, () => {
      if (this.state.regNo.length >= 3) {
        this.props.searchStudentdetailsbyregNumber(this.state.session.value, this.state.regNo, this.props.user, this.props.alert)
      }
      if (this.state.regStatus) {
        this.props.getStudentdetailsbyregNumber(this.state.session.value, this.state.regNo, this.props.user, this.props.alert)
      }
    })
  }

  searchByAppnoHandler = (e, selected) => {
    this.setState({ appNo: e.target.value, appStatus: selected, regNo: null, regStatus: false, otherStatus: false }, () => {
      const regNo = this.props.appNoSuggestion && this.props.appNoSuggestion.length > 0 ? this.props.appNoSuggestion.filter(item => item.application_number === this.state.appNo)[0] : ''
      this.setState({
        regId: regNo && regNo.registration_number ? regNo.registration_number : null
      })
      if (this.state.appNo.length > 2) {
        this.props.searchStudentdetailsbyAppNumber(this.state.session.value, this.state.appNo, this.props.user, this.props.alert)
      }
      if (this.state.appStatus) {
        console.log('inside app status')
        this.props.getStudentdetailsbyregNumber(this.state.session.value, regNo.registration_number || '', this.props.user, this.props.alert)
      }
    })
  }

  render () {
    const classes = styles
    // let searchByIndicator = null
    let searchBox = null
    if (this.state.searchByDropdown === 'Registration Number') {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Registration Number</label>
          <AutoSuggest
            label='Search'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.regNo || ''}
            onChange={this.searchByRegnoHandler}
            margin='dense'
            variant='outlined'
            data={this.props.regNoSuggestion && this.props.regNoSuggestion.length > 0 ? this.props.regNoSuggestion.map(item => ({ value: item.registration_number ? item.registration_number : '', label: item.registration_number ? item.registration_number : '' })) : []}
          />
        </div>
      )
    } else if (this.state.searchByDropdown === 'Father Name') {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Father Name</label>
          <AutoSuggest
            label='Search'
            id='fatherName'
            type='text'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.otherKey || ''}
            onChange={(event, selected) => this.searchByOthers(event, selected, 'fatherName')}
            margin='dense'
            variant='outlined'
            data={this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.map(item => ({ value: item.student && item.student.parent && item.student.parent.father_name ? item.student.parent.father_name : '', label: item.student && item.student.parent && item.student.parent.father_name ? item.student.parent.father_name : '' })) : []}
          />
        </div>
      )
    } else if (this.state.searchByDropdown === 'Father Number') {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Father Number</label>
          <AutoSuggest
            label='Search'
            id='fatherNumber'
            type='number'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.otherKey || ''}
            onChange={(event, selected) => this.searchByOthers(event, selected, 'fatherNumber')}
            margin='dense'
            variant='outlined'
            data={this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.map(item => ({ value: item.student && item.student.parent && item.student.parent.father_mobile_no ? item.student.parent.father_mobile_no : '', label: item.student && item.student.parent && item.student.parent.father_mobile_no ? item.student.parent.father_mobile_no : '' })) : []}
          />
        </div>
      )
    } else if (this.state.searchByDropdown === 'Mother Name') {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Mother Name</label>
          <AutoSuggest
            label='Search'
            id='motherName'
            type='text'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.otherKey || ''}
            onChange={(event, selected) => this.searchByOthers(event, selected, 'motherName')}
            margin='dense'
            variant='outlined'
            data={this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.map(item => ({ value: item.student && item.student.parent && item.student.parent.mother_name ? item.student.parent.mother_name : '', label: item.student && item.student.parent && item.student.parent.mother_name ? item.student.parent.mother_name : '' })) : []}
          />
        </div>
      )
    } else if (this.state.searchByDropdown === 'Mother Number') {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Mother Number</label>
          <AutoSuggest
            label='Search'
            type='number'
            id='motherNumber'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.otherKey || ''}
            onChange={(event, selected) => this.searchByOthers(event, selected, 'motherNumber')}
            margin='dense'
            variant='outlined'
            data={this.props.otherSugg && this.props.otherSugg.length > 0 ? this.props.otherSugg.map(item => ({ value: item.student && item.student.parent && item.student.parent.mother_mobile_no ? item.student.parent.mother_mobile_no : '', label: item.student && item.student.parent && item.student.parent.mother_mobile_no ? item.student.parent.mother_mobile_no : '' })) : []}
          />
        </div>
      )
    } else {
      searchBox = (
        <div>
          <label style={{ display: 'block' }}>Search By Application Number</label>
          <AutoSuggest
            label='Search'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.appNo || ''}
            onChange={this.searchByAppnoHandler}
            margin='dense'
            variant='outlined'
            data={this.props.appNoSuggestion && this.props.appNoSuggestion.length > 0 ? this.props.appNoSuggestion.map(item => ({ value: item.application_number ? item.application_number : '', label: item.application_number ? item.application_number : '' })) : []}
          />
        </div>
      )
    }

    return (
      <Layout>
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid container spacing={3} >
              <Grid item xs={9} />
              <Grid item xs={3}>
                <div style={{ marginTop: '25px', marginLeft: '30px' }}>
                  <Button variant='contained' color='primary' open={<NewAdmissionFormAcc />} onClick={this.buttonHandler}>RTE-EWS AdmissionForm
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} style={{ marginLeft: '20px', marginRight: '10px' }}>
                <label>Academic Year*</label>
                <div style={{ marginTop: '15px' }} >
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
                    onChange={(e) => { this.handleAcademicyear(e) }}
                  />
                </div>
              </Grid>
              <Grid item xs={2} style={{ marginRight: '10px' }}>
                <label>From:</label>
                <div style={{ marginTop: '15px' }} >
                  <Select
                    placeholder='Select'
                    defaultValue={{ value: 'Registration Number', label: 'From Registration' }}
                    options={[
                      { value: 'Registration Number', label: 'From Registration' },
                      { value: 'Application Number', label: 'From Application' },
                      { value: 'Father Name', label: 'Father Name' },
                      { value: 'Father Number', label: 'Father Number' },
                      { value: 'Mother Name', label: 'Mother Name' },
                      { value: 'Mother Number', label: 'Mother Number' }
                    ]}
                    onChange={this.handleSearchby}
                  />
                </div>
              </Grid>
              <Grid item xs={3}>
                { searchBox }
              </Grid>
              <Grid item xs={4}>
                <div style={{ marginTop: '39px', marginLeft: '15px' }}>
                  <Button variant='contained' color='primary' open={<NonRTEFormAcc regNo={this.state.regNo} />} onClick={this.rteButtonHandler}>GET
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </div>
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion,
  regNoSuggestion: state.finance.accountantReducer.admissionForm.regNoSuggestion,
  appNoSuggestion: state.finance.accountantReducer.admissionForm.appNoSuggestion,
  otherSugg: state.finance.accountantReducer.admissionForm.otherSugg,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getStudentdetailsbyregNumber: (session, regno, user, alert) => dispatch(actionTypes.getStudentdetailsbyregNumber({ session, regno, user, alert })),
  getStudentdetailsbyappNumber: (session, appno, user, alert) => dispatch(actionTypes.getStudentdetailsbyappNumber({ session, appno, user, alert })),
  searchStudentdetailsbyregNumber: (session, regno, user, alert) => dispatch(actionTypes.searchStudentdetailsbyregNumber({ session, regno, user, alert })),
  searchStudentdetailsbyAppNumber: (session, appNo, user, alert) => dispatch(actionTypes.searchStudentdetailsbyappNumber({ session, appNo, user, alert })),
  searchAdmissionByOthers: (searchBy, session, key, user, alert) => dispatch(actionTypes.searchAdmissionByOthers({ searchBy, session, key, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CustomizedAdmissionFormAcc)))
