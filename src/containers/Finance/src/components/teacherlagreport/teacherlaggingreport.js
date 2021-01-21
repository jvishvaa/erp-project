import React, { Component } from 'react'
import { Grid, Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { connect } from 'react-redux'
import axios from 'axios'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import { OmsSelect } from '../../ui'

class TeacherLaggingReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: 'view',
      updated: false,
      added: false,
      valueSection: null,
      data: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.changehandlergrade = this.changehandlergrade.bind(this)
    this.changehandlersection = this.changehandlersection.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.mappindDetails = this.userProfile.academic_profile
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Admin') {
      this.props.loadBranches()
    } else if (this.role === 'Principal') {
      this.setState({
        branchData: [{ value: this.mappindDetails.branch_id, label: this.mappindDetails.branch }]
      })
      this.changehandlerbranch({ value: this.mappindDetails.branch_id, label: this.mappindDetails.branch })
    } else if (this.role === 'Teacher') {
      let branchData = []
      let map = new Map()
      if (Array.isArray(this.mappindDetails)) {
        for (const item of this.mappindDetails) {
          if (!map.has(item.branch_id)) {
            map.set(item.branch_id, true) // set any value to Map
            branchData.push({ value: item.branch_id, label: item.branch_name })
          }
        }
        this.setState({ branchArr: branchData })
      }
    }
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, branchValue: e })
    this.props.gradeMapBranch(e.value)
  }

  changehandlergrade = (e) => {
    this.props.grades.map(grade => {
      if (grade.grade.id === e.value) {
        this.props.sectionMap(grade.id)
        this.props.subjectMap(grade.id)
      }
    })
    this.setState({ grade: e.value })
  }

  changehandlersection = (e) => {
    this.setState({ section: e.value })
  }

  returnSection =(id) => {
    let x
    this.state.sectionData.forEach((v) => {
      if (v.section.id === id) {
        x = v.section.section_name
      }
    })
    return x
  }

  returnSubject =(id) => {
    let x
    this.props.subjects.forEach(v => {
      if (v.subject.id === id) {
        x = v.subject.subject_name
        console.log(x)
      }
    })
    return x
  }

  handleClick () {
    let url = ''
    url = urls.TeacherLagReport + '?branch_id=' + this.state.branch + '&grade_id=' + this.state.grade + '&section_id=' + this.state.section
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ data: res.data })
        } else if (res.status === 204) {
          this.props.alert.error('No data found')
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
        this.props.alert.error('Error: Teacher Lagging Report Does Not Exists')
      })
  }

  render () {
    let { branchData, branchValue } = this.state
    return (
      <React.Fragment>
        <Form style={{ padding: '50px' }}>
          <Form.Group>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }}>Branch*</label>
              <OmsSelect
                placeholder='Branch'
                options={this.role === 'Admin'
                  ? this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : []
                  : branchData
                }
                defaultValue={branchValue}
                change={this.changehandlerbranch}
                disabled={this.role !== 'Admin'}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }}>Grade*</label>
              <OmsSelect
                placeholder='Grade'
                options={this.props.grades
                  ? this.props.grades.map(grade => ({
                    value: grade.grade.id,
                    label: grade.grade.grade
                  }))
                  : []}
                defaultValue={this.state.gradevalue}
                change={this.changehandlergrade}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }}>Section*</label>
              <OmsSelect
                placeholder='Section'
                options={this.props.sections
                  ? this.props.sections.map(section => ({
                    value: section.id,
                    label: section.section_name
                  }))
                  : []}
                defaultvalue={this.state.sectionvalue}
                error={this.state.sectionError}
                change={this.changehandlersection}
              />

            </Form.Field>
            <Form.Field
              width={3}
              className='student-section-viewCalendar-Button'
            >
              <Grid.Row>
                <Grid.Column
                  computer={4}
                  mobile={16}
                  tablet={5}
                >
                  <div>
                    <Button
                      onClick={this.handleClick}
                      color='purple'
                    >
                        GET Teacher Lagging Report
                    </Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Form.Field>
          </Form.Group>
        </Form>
        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'Lagging Classes',
              accessor: 'lagging_classes'
            },
            {
              Header: 'Reports Submitted Till Date',
              accessor: 'reports_submitted_till_date'
            },
            {
              Header: 'Section Mapping',
              id: 'sectionmapping',
              accessor: props => props.sectionmapping
            },
            {
              Header: 'Subject Mapping',
              id: 'subjectmapping',
              accessor: props => props.subjectmapping
            },
            {
              Header: 'Title',
              id: 'title',
              accessor: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: 'Total Classes Till Date',
              accessor: 'total_classes_till_date'
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  sections: state.sections.items,
  section: state.sectionMap.items,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  subjects: state.subjectMap.items
})

const mapDispatchToProps = dispatch => ({
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  loadBranches: () => dispatch(apiActions.listBranches()),
  listSection: dispatch(apiActions.listSections()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  subjectMap: (acadMapId) => dispatch(apiActions.getSubjectMapping(acadMapId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TeacherLaggingReport))
