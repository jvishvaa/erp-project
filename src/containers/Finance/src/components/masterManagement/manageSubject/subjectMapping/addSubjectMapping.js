import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Select from 'react-select'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../../css/staff.css'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'
import { OmsSelect } from '../../../../ui'

class AddSubjectMapping extends Component {
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
      })
    }
  }

  handleClickBranch = event => {
    this.props.gradeMapBranch(event.value)
    this.setState({ aBranchId: event.value, valueGrade: [], valueSubject: [] })
  };

  handleClickGrdae = event => {
    let aGradeIds = []
    event.forEach(function (grdae) {
      aGradeIds.push(grdae.value)
    })
    this.setState({ aGradeId: aGradeIds, valueGrade: event, valueSubject: [] })
  };

  handleClickSubject = event => {
    var aSubject = []
    event.forEach(function (subject) {
      aSubject.push(subject.value)
    })
    this.setState({ subjectData: aSubject, valueSubject: event })
  };

  handleClick = event => {
    var data = []

    var that = this

    // if values are selected and deselected
    if (!this.state.aGradeId.length) {
      this.setState({ aGradeId: null })
      this.props.alert.warning('Select atleast one grade')
      return
    } else if (!this.state.subjectData.length) {
      this.setState({ subjectData: null })
      this.props.alert.warning('Select atleast one subject')
      return
    }

    this.state.aGradeId.forEach(function (mapping) {
      that.state.subjectData.forEach(function (subject) {
        data.push({
          subject: subject,
          branch_grade_acad_session_mapping: mapping
        })
      })
    })
    axios
      .post(urls.SUBJECTMAPPING, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success('Successfully added subject mapping')
      })
      .catch(error => {
        if (error.response.status === 400) {
          console.log(error.response.data)
        }
        this.props.alert.error('Error: Mapping Already Exists')
      })
  };

  render () {
    return (
      <React.Fragment>
        <Grid>
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
                    options={
                      this.props.branches
                        ? this.props.branches.map(branch => ({
                          value: branch.id,
                          label: branch.branch_name
                        }))
                        : null
                    }
                    change={this.handleClickBranch}
                    isDisabled={this.role === 'Principal'}
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
                isMulti
                options={
                  this.props.grades
                    ? this.props.grades.map(grades => ({
                      value: grades.id,
                      label: grades.grade.grade
                    }))
                    : []
                }
                value={this.state.valueGrade}
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
              <OmsSelect
                placeholder='Select Subject'
                isMulti
                options={
                  this.props.subject
                    ? this.props.subject.map(subject => ({
                      value: subject.id,
                      label: subject.subject_name
                    }))
                    : []
                }
                defaultValue={this.state.valueSubject}
                change={this.handleClickSubject}
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
                  !this.state.aBranchId &&
                  !this.state.aGradeId &&
                  !this.state.subjectData
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
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddSubjectMapping))
