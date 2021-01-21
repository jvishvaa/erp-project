import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import '../../../css/staff.css'
import { OmsSelect } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'

class AddGradeMapping extends Component {
  constructor () {
    super()
    this.state = {
      optionData: [],
      branch: []
    }
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.handleClickGrade.bind(this)
  }

  componentDidMount () {
    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.changehandlerbranch({ value: `${academicProfile.branch_id}`, label: academicProfile.branch }) })
    }

    axios
      .get(urls.ACADEMICSESSION, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log('for branch', res)
        this.setState({ branch: res.data })
      })
  }

  changehandlerbranch = e => {
    // eslint-disable-next-line
    this.setState({ branchid: e.value })
    this.setState({ acad_session: e.value, valueGrade: [] })
  };

  handleClickGrade = event => {
    var list = event.map(val => ({ grade: val.value }))
    this.setState({ grade: list, valueGrade: event })
  }

  handlevalue = e => {
    e.preventDefault()
    if (!this.state.branch) {
      this.props.alert.warning('select branch')
      return
    }

    if (!this.state.grade.length) {
      this.props.alert.warning('select atleast one grade')
      return
    }

    var branchGrade = []
    this.state.grade.forEach(val => {
      branchGrade.push({
        branch: this.state.branchid,
        grade: val.grade
        // acad_session: this.state.acad_session
      })
    })
    var ResponseList = urls.GradeMapping
    axios
      .post(ResponseList, branchGrade, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.props.alert.success('Created Successfully')
        } else {
          // alert("Unknown status code" + res.status + " " + res.data);
          this.props.alert.error('Error: Something went wrong, please try again.')
        }
      })
      .catch(error => {
        console.log(error.response)
        if (error.response.status === 400) {
          this.props.alert.warning('Selected Grade already existing in map')
        } else {
          this.props.alert.error('Error: Something went wrong, please try again.')
        }
      })
  };

  render () {
    return (
      <React.Fragment>
        <Form onSubmit={this.handlevalue} style={{ padding: '20px' }}>
          <Form.Group>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }}>Branch*</label>
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
                    change={this.changehandlerbranch}
                  />
                )}
            </Form.Field>

            <Form.Field width={5}>
              <label style={{ display: 'inline-block' }}>Grade*</label>
              <OmsSelect
                options={this.props.grades ? this.props.grades.map((grades) => ({ value: grades.id, label: grades.grade })) : []}
                isMulti
                value={this.state.valueGrade}
                change={this.handleClickGrade}
                defaultValue={this.state.valueGrade}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group className='formargin1' width={12}>
            <Button type='submit'
              disabled={!this.state.branch || !this.state.grade}
              color='green'>Save</Button>
            <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items,
  branches: state.branches.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  listGrades: dispatch(apiActions.listGrades())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddGradeMapping))
