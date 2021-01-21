import React, { Component } from 'react'
import { Form, Grid } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import axios from 'axios'
import '../css/staff.css'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
import { OmsSelect } from '../../ui'

class AddClassGroup extends Component {
  constructor () {
    super()
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.state = {
    }
  }

  handleClickClassGroupTypes = (e) => {
    this.setState({ classGroupType: e.value, ClassGroupTypeValue: e })
  }
  handleClickBranch = (e) => {
    this.setState({ classGroupBranchId: e.value, gradevalue: [], branchValue: e })
    this.props.gradeMapBranch(e.value)
  }

  handleGrade = (e) => {
    this.setState({ grade: e.value, gradevalue: e })
    console.log(e.value)
  }

  handleSave = () => {
    console.log(JSON.stringify(this.state))
    let { classGroupName, classGroupType, classGroupBranchId, grade } = this.state
    let payLoad = {
      name: classGroupName,
      type: classGroupType,
      branch_id: classGroupBranchId,
      grade_id: grade
    }
    axios
      .post(urls.ClassGroup, JSON.stringify(payLoad), {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 201) {
          console.log(res)
          this.props.alert.success(res.data)
          this.setState({ ClassGroupTypeValue: {}, branchValue: {}, gradevalue: {}, classGroupName: '' })
        }
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error(
          'Please enter required fields'
        )
      })
  }

  render () {
    console.log(this.props.grades, 'grade'
    )
    console.log(this.state.grade, 'gggg')

    console.log(this.state)
    console.log(this.props)
    return (
      <React.Fragment>
        <Grid>
          <Grid.Column
            computer={4}
            mobile={15}
            tablet={10}
            className='addSectionmapping-column'
          >
            <label>Class Group Type*</label>
            <OmsSelect
              options={
                this.props.classgrouptypes
                  ? this.props.classgrouptypes.map(classgrouptype => ({
                    value: classgrouptype,
                    label: classgrouptype
                  }))
                  : null
              }
              defaultValue={this.state.ClassGroupTypeValue}
              change={this.handleClickClassGroupTypes}
            />
          </Grid.Column>
          <Grid.Column
            computer={4}
            mobile={15}
            tablet={10}
            className='addSectionmapping-column'
          >
            <label>Branch*</label>
            <OmsSelect
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              defaultValue={this.state.branchValue}
              change={this.handleClickBranch}
            />
          </Grid.Column>

          <Grid.Column
            computer={4}
            mobile={15}
            tablet={10}
            className='addSectionmapping-column'
          >
            <label>Grade*</label>
            <OmsSelect
              name='grade'
              placeholder='Grade'
              options={this.props.grades
                ? this.props.grades.map(grade => ({
                  value: grade.id,
                  label: grade.grade.grade
                }))
                : []}
              defaultValue={this.state.gradevalue}
              change={this.handleGrade}
            />
          </Grid.Column>

          <Grid.Column
            computer={4}
            mobile={15}
            tablet={10}
            className='addSectionmapping-column'
          >
            <Form.Field width={5} >
              <label>Class Group Name*</label>
              <input name='Class Group Name' type='text' className='form-control' placeholder='Class Group Name' value={this.state.classGroupName}required onChange={e => this.setState({ classGroupName: e.target.value })} />
            </Form.Field>
          </Grid.Column>
          <Form.Group style={{ padding: '20px' }}>
            <Button type='submit' color='green'
              onClick={this.handleSave}
            >
              Save
            </Button>
            <Button
              primary
              // onClick={this.props.history.goBack}
              type='button'
            >
              Return
            </Button>
          </Form.Group>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  classgrouptypes: state.classgrouptypes.items

})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  listClassGroupType: dispatch(apiActions.listClassGroupType()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClassGroup)
