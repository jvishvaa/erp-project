import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AlertMessage, OmsSelect } from '../../../../ui'
import { urls } from '../../../../urls'
import '../../../css/staff.css'
import { apiActions } from '../../../../_actions'

class AddSectionMapping extends Component {
  constructor () {
    super()
    this.state = { alertMessage: '' }
    this.handleClickGrdae = this.handleClickGrdae.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.handleClickSection = this.handleClickSection.bind(this)
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
  }

  handleClickBranch = event => {
    this.props.gradeMapBranch(event.value)
    this.setState({ aBranchId: event.value, valueGrade: [], valueSection: [] })
  };

  handleClickGrdae = event => {
    let aMapIds = []
    event.forEach(function (grdae) {
      aMapIds.push(grdae.value)
    })
    this.setState({ gradeData: aMapIds, valueGrade: event, valueSection: [] })
  };

  handleClickSection = event => {
    let aSection = []
    event.forEach(function (section) {
      aSection.push(section.value)
    })
    this.setState({ sectionData: aSection, valueSection: event })
  };

  handleClick = event => {
    var data = []
    var that = this
    if (
      this.state.gradeData &&
      this.state.gradeData.length > 0 &&
      this.state.sectionData &&
      this.state.sectionData.length > 0
    ) {
      this.state.gradeData.forEach(function (mapping) {
        that.state.sectionData.forEach(function (section) {
          data.push({
            section: section,
            branch_grade_acad_session_mapping: mapping
          })
        })
      })

      axios
        .post(urls.SectionMapping, data, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res)
          if (res.status === 201) {
            // alert("Created Successfully");
            this.setState({
              alertMessage: {
                messageText: 'Created Successfully',
                variant: 'success',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
          }
        })
        .catch(error => {
          // required to be handled when their is a error response text

          if (error.response.status === 409) {
            this.setState({
              alertMessage: {
                messageText: 'Selected Mapping already existing in map',
                variant: 'warning',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
          } else {
            this.setState({
              alertMessage: {
                messageText: 'Error: Something went wrong, please try again.',
                variant: 'error',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
          }
        })
    }
  };
  render () {
    let { aBranchId, sectionData, gradeData } = this.state
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={16}
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
                        }))
                        : null
                    }
                    value={
                      this.role === 'Principal' &&
              this.state.currentPrincipalBranch
                    }
                    isDisabled={this.role === 'Principal'}
                    change={this.handleClickBranch}
                  />
                )}

            </Grid.Column>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={16}
              className='addSectionmapping-column'
            >
              <label>Grade*</label>
              <OmsSelect
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
                defaultValue={this.state.valueGrade}
                change={this.handleClickGrdae}
              />
            </Grid.Column>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={16}
              className='addSectionmapping-column'
            >
              <label>Section*</label>
              <OmsSelect
                placeholder='Select Section'
                isMulti
                options={
                  this.props.section
                    ? this.props.section.map(section => ({
                      value: section.id,
                      label: section.section_name
                    }))
                    : []
                }
                defaultValue={this.state.valueSection}
                change={this.handleClickSection}
              />
            </Grid.Column>

            <Grid.Column computer={8} mobile={15} tablet={10}>
              <Button
                onClick={this.handleClick}
                disabled={!aBranchId || !gradeData || !sectionData}
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
  section: state.sections.items,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSections: dispatch(apiActions.listSections()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddSectionMapping))
