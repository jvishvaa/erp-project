import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import '../../../css/staff.css'
import { AlertMessage, OmsSelect } from '../../../../ui'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'

class EditSubjectMapping extends Component {
  constructor () {
    super()
    this.aGradeId = []
    this.aSessionId = []
    this.state = {
      aBranchId: [],
      gradeData: [],
      sessionData: [],
      mappingData: []
    }
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.handleClickGrdae = this.handleClickGrdae.bind(this)
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleClickSession = this.handleClickSession.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleClickBranch({ value: academicProfile.branch_id }) })
    }

    var url = window.location.href
    var spl = url.split('?')
    var value = spl[1].split('&')
    console.log(value)
    var acadid1 = value[0].split('=')
    var id = acadid1[1]
    var gr = value[2].split('=')
    var gradeName = gr[1]
    var br = value[1].split('=')
    var branchName = br[1]
    this.setState({ BranchName: branchName })
    this.setState({ GradeName: gradeName })
    var UpdateSubjectMapping = urls.SUBJECTMAPPING + id + '/'
    axios
      .get(UpdateSubjectMapping, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var arr = res.data
        console.log(arr)
        this.setState({ subjectName: arr.subject.subject_name })
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + urls.SUBJECTMAPPING)
      })
  }

  handleClickBranch = event => {
    this.setState({ gradeData: [] })
    this.setState({ sessionDat: [] })

    this.setState({ aBranchId: event.value })
    var gradeData = []
    axios
      .get(urls.GradeMapping + '?branch=' + event.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ mappingData: res.data })
        res.data.forEach(function (mapData) {
          gradeData.push({
            value: mapData.grade.id,
            label: mapData.grade.grade
          })
        })
        this.setState({ gradeData: gradeData })
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + urls.SectionMapping)
      })
  };

  handleClickGrdae = (event, { value }) => {
    this.aGradeId = []
    this.setState({ aGradeId: event.value })
    var aSession = []
    var aSessionId = []
    this.state.mappingData.forEach(function (mapData) {
      console.log(mapData.acad_session.id)
      if (
        mapData.grade &&
        event.value === mapData.grade.id &&
        mapData.acad_session
      ) {
        if (!aSessionId.includes(mapData.acad_session.id)) {
          aSessionId.push(mapData.acad_session.id)
          aSession.push({
            value: mapData.id,
            label: mapData.acad_session.session_year
          })
        }
      }
    })
    this.setState({ sessionData: aSession })
  };

  handleClickSubject = event => {
    this.setState({ subjectId: event.value })
  };

  handleClickSession = event => {
    this.setState({ mappingId: event.value })
  };

  handleClick = event => {
    var data = []

    data.push({
      subject: this.state.subjectId,
      branch_grade_acad_session_mapping: this.state.mappingId
    })
    console.log(data)

    axios
      .post(urls.SUBJECTMAPPING, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        // alert(res.data)
        this.setState({
          alertMessage: {
            messageText: 'Updated successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.setState({
            alertMessage: {
              messageText: 'Error: Subject already existing.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })

          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
        console.log("Error: Couldn't fetch data from " + urls.SUBJECTMAPPING)
      })
  };

  render () {
    let { gradeData, sessionData } = this.state

    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={10}
              mobile={15}
              tablet={10}
              className='addSectionmapping-column'
            >
              <label>
                Editing Branch " {this.state.BranchName} " , Grade "{' '}
                {this.state.GradeName} " , Subject "{' '}
                {this.state.subjectName} "
              </label>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column
              computer={4}
              mobile={15}
              tablet={10}
              className='addSectionmapping-column'
            >
              <label>Branch*</label>
              {this.role === 'Principal'
                ? <input
                  type='text'
                  value={this.state.branch_name}
                  disabled
                  className='form-control'
                  placeholder='Branch'
                /> : (
                  <OmsSelect
                    defaultValue={this.state.id}
                    options={
                      this.props.branches
                        ? this.props.branches.map(branch => ({

                          value: branch.id,
                          label: branch.branch_name
                        })) : null
                    }
                    value={
                      this.role === 'Principal' &&
                    this.state.currentPrincipalBranch
                    }
                    isDisabled={this.role === 'Principal'}
                    onChange={this.handleClickBranch}
                  />
                )}

            </Grid.Column>
            <Grid.Column
              computer={4}
              mobile={15}
              tablet={10}
              className='addSectionmapping-column'
            >
              <label>Grade*</label>
              <Select
                placeholder='Select Grade'
                value={this.state.grade}
                options={gradeData}
                onChange={this.handleClickGrdae}
              />
            </Grid.Column>
            <Grid.Column
              computer={4}
              mobile={15}
              tablet={10}
              className='addSectionmapping-column'
            >
              <label>Subject*</label>
              <Select
                placeholder='Select Subject'
                value={this.state.subject}
                options={
                  this.props.subject
                    ? this.props.subject.map(subject => ({
                      value: subject.id,
                      label: subject.subject_name
                    }))
                    : []
                }
                onChange={this.handleClickSubject}
              />
            </Grid.Column>
            <Grid.Column
              computer={4}
              mobile={15}
              tablet={10}
              className='addSectionmapping-column'
            >
              <label>Select Academic Year*</label>
              <Select
                placeholder='Select Academic Year'
                options={sessionData}
                onChange={this.handleClickSession}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={8} mobile={15} tablet={10}>
              <Button
                onClick={this.handleClick}
                disabled={
                  !this.state.aBranchId ||
                  !this.state.aGradeId ||
                  !this.state.mappingId ||
                  !this.state.subjectId
                }
                color='green'
              >
                Save
              </Button>
              <Button
                primary
                onClick={this.props.history.goBack}
                type='button'
              >
                Return
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  subject: state.subjects.items,
  session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listAcademicSessions: dispatch(apiActions.listAcademicSessions())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditSubjectMapping))
