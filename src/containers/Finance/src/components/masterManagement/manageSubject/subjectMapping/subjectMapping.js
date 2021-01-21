/*
  branch_id and grade_id,

  get acad_branch_grade_mapping_id

  fetch subject_mapping by acad_branch_grade_mapping_id
*/
import React, { Component } from 'react'
import axios from 'axios'
import { Button } from '@material-ui/core/'

import { Grid } from 'semantic-ui-react'
import ReactTable from 'react-table'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { connect } from 'react-redux'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import '../../../css/staff.css'
import { OmsSelect, RouterButton, AlertMessage, Toolbar } from '../../../../ui'
// import { Grid } from '@material-ui/core/Grid'

const AddSubjectMapping = {
  label: 'Add Subject Mapping',
  color: 'blue',
  href: 'subject/addMapping',
  disabled: false,
  icon: 'add'
}

// const subjectMappingData = {
//   namespace: 'Role'
// }

const subjectTable = [
  {
    name: 'SubjectName',
    displayName: 'Subject Name'
  },
  {
    name: 'SubjectDescription',
    displayName: 'Subject Description'
  },
  {
    name: 'SubjectGivenId',
    displayName: 'Subject Given Id'
  },
  {
    name: 'SubjectCourseId',
    displayName: 'Subject Course Id'
  },
  {
    name: 'Optional',
    displayName: 'Optional'
  },
  {
    name: 'CreatedAt',
    displayName: 'Created At'
  },
  {
    name: 'UpdatedAt',
    displayName: 'Updated At'
  },
  {
    name: 'Edit',
    displayName: 'Edit'
  },
  {
    name: 'Delete',
    displayName: 'Delete'
  }
]

subjectTable.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class subjectMapping extends Component {
  constructor () {
    super()
    this.state = {}
    this.deleteHandler = this.deleteHandler.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickGetSubjectData = this.handleClickGetSubjectData.bind(this)
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
      }, () => { this.changehandlerbranch({ value: academicProfile.branch_id }) })
    }
  }

  changehandlerbranch = (e) => {
    this.setState({ branchlabel: e.label, gradelabel: null })
    this.props.gradeMapBranch(e.value)
  }

  handleClickGrade = (event) => {
    this.props.subjectMap(event.value)
    this.setState({ gradelabel: event, gradeValue: event.value })
  }

  handleClickGetSubjectData () {
    let subjectList = []
    this.props.subjects && this.props.subjects.forEach((val) => {
      console.log(val)
      subjectList.push(
        {
          SubjectName: val.subject.subject_name ? val.subject.subject_name : '',
          SubjectDescription: val.subject.subject_description ? val.subject.subject_description : '',
          SubjectGivenId: val.subject.subject_given_id ? val.subject.subject_given_id : '',
          SubjectCourseId: val.subject.course_given_id ? val.subject.course_given_id : '',
          CreatedAt: val.subject.createdAt ? val.subject.createdAt : '',
          UpdatedAt: val.subject.updatedAt ? val.subject.updatedAt : '',
          Edit: <RouterButton icon='edit' value={{ basic: 'basic', href: 'subject/editSubjectMapping?acadid=' + val.id + '&branch=' + val.branch_grade_acad_session_mapping.branch + '&grade=' + val.branch_grade_acad_session_mapping.grade }} />,
          Delete: <Button icon='delete' basic onClick={e => this.deleteHandler(val.id)} />
        }
      )
    })
    this.setState({ data: subjectList })
  }

  deleteHandler = (id) => {
    let { gradeValue } = this.state
    var updatedList = urls.SUBJECTMAPPING + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        this.setState({
          alertMessage: {
            messageText: 'Deleted Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          } })
        this.props.subjectMap(gradeValue)
        this.handleClickGetSubjectData()
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.SUBJECT, error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  }
  componentWillReceiveProps (props) {
    console.log('will receive', props)
    console.log(props.subjects)
    let subjectList = []
    props.subjects && props.subjects.forEach((val) => {
      subjectList.push(
        {
          SubjectName: val.subject.subject_name ? val.subject.subject_name : '',
          SubjectDescription: val.subject.subject_description ? val.subject.subject_description : '',
          SubjectGivenId: val.subject.subject_given_id ? val.subject.subject_given_id : '',
          SubjectCourseId: val.subject.course_given_id ? val.subject.course_given_id : '',
          CreatedAt: val.subject.createdAt ? val.subject.createdAt : '',
          UpdatedAt: val.subject.updatedAt ? val.subject.updatedAt : '',
          Edit: <RouterButton icon='edit' value={{ basic: 'basic', href: 'subject/editSubjectMapping?acadid=' + val.id + '&branch=' + this.state.branchlabel + '&grade=' + this.state.gradelabel }} />,
          Delete: <Button icon='delete' basic onClick={e => this.deleteHandler(val.id)} />
        }
      )
    })
    this.setState({ data: subjectList })
  }

  render () {
    console.log(this.state.subjects, 'subjectssss')
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <React.Fragment>
              <RouterButton value={AddSubjectMapping} />
            </React.Fragment>
          } >
          <AlertMessage alertMessage={this.state.alertMessage} />

          <Grid style={{ backgroundColor: 'transparent' }} >
            <Grid.Row >
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={4}
                className='student-section-inputField'
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
                      change={this.changehandlerbranch}
                    />
                  )}

              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={4}
                className='student-section-inputField'
              >
                <label>Grade*</label>
                <OmsSelect
                  defaultValue={this.state.gradelabel}
                  options={this.props.grades ? this.props.grades.map((grades) => ({ value: grades.id, label: grades.grade.grade })) : null}
                  change={this.handleClickGrade} />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={4}
                className='student-section-inputField-button'
              >
                <Button style={{ left: '500px', top: '-65px' }}
                  color='purple'
                  loading={this.props.subjectLoader}
                  onClick={this.handleClickGetSubjectData}
                >
                Show Mappings
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Toolbar>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={15} mobile={13} tablet={15} className='staff-table1'>
              {this.props.subjects ? <ReactTable
                data={this.props.subjects}
                showPageSizeOptions={false}
                defaultPageSize={5}

                columns={[
                  {
                    Header: 'Subject Name',
                    accessor: 'subject.subject_name',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {
                    Header: 'Subject Description',
                    accessor: 'subject.subject_description',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {
                    Header: 'Subject Given Id',
                    accessor: 'subject.subject_given_id',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {
                    Header: 'Subject Course Id',
                    accessor: 'subject.course_given_id',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {
                    Header: 'Optional',
                    accessor: 'subject.is_optional',
                    Cell: props => <span className='number'>{props.value ? 'True' : 'False'}</span>

                  },
                  {
                    Header: 'Created At',
                    accessor: 'subject.createdAt',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {
                    Header: 'Updated At',
                    accessor: 'subject.updatedAt',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

                  },
                  {

                    id: 'x',
                    Header: 'Actions',
                    accessor: val => {
                      return (
                        <div>
                          <RouterButton
                            key={val.id}
                            icon='edit'
                            value={{
                              basic: 'basic',
                              href: 'subject/editSubjectMapping?acadid=' + val.id + '&branch=' + this.state.branchlabel + '&grade=' + this.state.gradelabel
                            }}
                            id={val.id}
                          />

                          <IconButton
                            // key={val.id}
                            aria-label='Delete'

                            onClick={e => this.deleteHandler(val.id)}

                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>

                        </div>
                      )
                    }

                  }

                ]}
              /> : null}
              {/* <OmsFilterTable
                filterTableData={subjectMappingData}
                tableData={this.state.data}
                tableFields={subjectTable}
              /> */}
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
  grades: state.gradeMap.items,
  gradeLoader: state.gradeMap.loading,
  subjects: state.subjectMap.items,
  subjectLoader: state.subjectMap.loading
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: () => dispatch(apiActions.listSubjects()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  subjectMap: (acadMapId) => dispatch(apiActions.getSubjectMapping(acadMapId))
})

export default connect(mapStateToProps, mapDispatchToProps)(subjectMapping)
