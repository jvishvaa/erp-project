import React, { Component } from 'react'
import { Form, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import axios from 'axios'
import { withStyles, Button } from '@material-ui/core'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../../_components/globalselector'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { OmsSelect, Toolbar } from '../../../ui'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class AssignSubjectTeacher extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      data: [],
      defaultValue: {},
      sectionMappingIds: ''
    }
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.getGrades = this.getGrades.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickSave = this.handleClickSave.bind(this)
    this.handleClickTeacher = this.handleClickTeacher.bind(this)
    this.populateData = this.populateData.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    console.log(academicProfile)
    if (this.role === 'Principal') {
      this.setState({
        aBranchId: academicProfile.branch_id,
        valueBranch: { value: academicProfile.branch_id, label: academicProfile.branch }
      }, () => this.getGrades(academicProfile.branch_id))
    }
  }

  handleClickBranch = event => {
    this.setState({
      gradeData: [],
      valueBranch: event,
      aBranchId: event.value,
      valueGrade: [],
      valueAyear: [],
      valueSection: []
    }, () => this.getGrades(event.value))
  }

  getGrades = id => {
    // getting grademapping data based on branch
    axios
      .get(urls.GradeMapping + '?branch=' + id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ mappingData: res.data })
        var gradeData = []
        var aGradeId = []
        var that = this
        res.data.forEach(function (mapData) {
          if (
            mapData.branch &&
            that.state.aBranchId === mapData.branch.id &&
            mapData.grade
          ) {
            aGradeId.push(mapData.grade.id)
            gradeData.push({
              value: mapData.id,
              label: mapData.grade.grade
            })
          }
        })
        this.setState({ gradeData: gradeData, valueGrade: [], valueAyear: [], valueSection: [] })
      })
      .catch(error => {
        console.log(
          "Error: Couldn't fetch data from " + urls.GradeMapping + error
        )
      })

    // getting staff data based on branch id
    axios
      .get(urls.TeacherList + '?branch_id=' + id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.data !== 'Teacher Data not found') {
          this.setState({
            teacherData: res.data
              .filter(staff => staff.is_teacher)
              .map(staff => ({ value: staff.id, label: staff.user.first_name }))
          })
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't get data from " + urls.TeacherList + error
        )
      })
  }

  handleClickGrade = event => {
    this.setState({
      valueGrade: event,
      valueAyear: [],
      valueSection: []
    })

    // getting section mapping data based on mapping id
    axios
      .get(urls.SectionMapping + '?acad_branch_grade_mapping_id=' + event.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({
          sectionData: res.data.map(section => ({
            value: section.id,
            label: section.section.section_name
          }))
        })
      })

    // getting subject mapping data based on mapping id
    // axios
    //   .get(urls.SUBJECTMAPPING + '?acad_branch_grade_mapping_id=' + event.value, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     this.setState({
    //       subjectMappingData: res.data.map(subject => ({
    //         value: subject.id,
    //         label: subject.subject.subject_name
    //       }))
    //     })
    //   })
  }

  // handleClickSection = event => {
  //   this.setState({ sectionMappingId: event.value, valueSection: event })
  //   // getting teacher subject section mapping data based on section id
  //   console.log(this.state.sectionMappingId, 'yoo', event.value, this.state.valueSection)
  // }

  handleClickTeacher = (idSub, event, action) => {
    if (action.action === 'remove-value') {
      let id = this.state.assignedData.filter(mapping => {
        return (
          mapping.subjectmapping === idSub &&
          mapping.teacher === action.removedValue.value
        )
      })
      if (id.length > 0) {
        // deleting teacher subject section mapping
        axios
          .delete(urls.AssignSubjectTeacher + id[0].id + '/', {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            this.props.alert.success('Removed teacher subject mapping')
          })
          .catch(error => {
            console.log(
              "Error: Couldn't delete data from " +
              urls.AssignSubjectTeacher +
              error
            )
          })
      } else if (action.action === 'remove-value') {
        let indexToBeDeleted = this.state.data.findIndex(function (data) {
          return (
            data.subjectmapping === idSub &&
            data.teacher === action.removedValue.value
          )
        })
        this.state.data.splice(indexToBeDeleted, 1)
      }
    } else if (action.action === 'select-option') {
      this.state.data.push({
        sectionmapping: this.state.sectionMappingIds,
        subjectmapping: idSub,
        teacher: action.option.value
      })
      console.log(this.state.sectionMappingIds, this.state.data, 'valuee')
    }
    let defaultValue = this.state.defaultValue
    if (defaultValue[idSub]) {
      defaultValue[idSub] = event
    } else {
      defaultValue = Object.assign({ [idSub]: event }, defaultValue)
    }
    this.setState({ defaultValue })
  }

  handleClickSave = event => {
    console.log(this.state.data, event)

    axios
      .post(urls.AssignSubjectTeacher, this.state.data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 201) {
          this.props.alert.success('Successfully assigned subject to teacher')
          this.setState({ data: [] })
          let assignedData = this.state.assignedData
          res.data.forEach((data) => {
            assignedData.push(data)
          })
          this.setState({ assignedData: assignedData })
          this.populateData()
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't post data to " + urls.AssignSubjectTeacher + error
        )
      })
  }

  populateData () {
    let { assignedData } = this.state
    // filtering data from previous mapping
    let defaultValue = {}
    if (this.state.subjectMappingData) {
      this.state.subjectMappingData.forEach(subject => {
        assignedData.filter(mapping => {
          return mapping.subjectmapping === subject.value &&
            mapping.teacher
            ? defaultValue[subject.value]
              ? defaultValue[subject.value].push({
                value: mapping.teacher,
                label: mapping.first_name
              })
              : (defaultValue = Object.assign(
                {
                  [subject.value]: [
                    {
                      value: mapping.teacher,
                      label: mapping.first_name
                    }
                  ]
                },
                defaultValue
              ))
            : false
        })
        this.setState({ defaultValue })
      })
    }
    this.setState({ loaded: true })
  }
  onChange (data, event) {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data })
    this.setState({ sectionMappingIds: data.section_mapping_id })
    data.section_mapping_id && axios
      .get(urls.TeacherSubjectSectionMappingFilter + '?section_mapping_id=' + data.section_mapping_id, {
        headers: { Authorization: 'Bearer ' + this.props.user }
      })
      .then(res => {
        this.setState({ assignedData: res.data })
        this.populateData()
      })
      .catch(error => {
        console.log(
          "Error: Couldn't get data from " +
          urls.TeacherSubjectSectionMappingFilter +
          error
        )
      })
    data.acad_branch_grade_mapping_id && !data.section_mapping_id && axios
      .get(urls.SUBJECTMAPPING + '?acad_branch_grade_mapping_id=' + data.acad_branch_grade_mapping_id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({
          subjectMappingData: res.data.map(subject => ({
            value: subject.id,
            label: subject.subject.subject_name
          }))
        })
      })
    data.branch_id && !data.acad_branch_grade_mapping_id && !data.section_mapping_id && axios
      .get(urls.TeacherList + '?branch_id=' + data.branch_id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.data !== 'Teacher Data not found') {
          this.setState({
            teacherData: res.data
              .filter(staff => staff.is_teacher)
              .map(staff => ({ value: staff.id, label: staff.user.first_name }))
          })
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't get data from " + urls.TeacherList + error
        )
      })
  }
  render () {
    let {
      // gradeData,
      // sectionData,
      teacherData,
      defaultValue
      // valueBranch
    } = this.state
    console.log(teacherData)
    return (
      <React.Fragment>
        <Toolbar>
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          </Grid>
          <Form>
            <Form.Group>
              {/* <Form.Field width={4}>
                <OmsSelect
                  label={'Branch'}
                  defaultValue={valueBranch}
                  options={this.props.branches
                    ? this.props.branches.map(branch => ({ value: branch.id, label: branch.branch_name }))
                    : null}
                  change={this.handleClickBranch}
                  disabled={this.role === 'Principal'}
                />
              </Form.Field> */}
              {/* <Form.Field width={4}>
                <OmsSelect
                  label={'Grade'}
                  placeholder='Select...'
                  options={gradeData}
                  change={this.handleClickGrade}
                  defaultValue={this.state.valueGrade}
                />
              </Form.Field> */}
              {/* <Form.Field width={4}>
                <OmsSelect
                  label={'Section'}
                  placeholder='Select...'
                  options={sectionData}
                  change={this.handleClickSection}
                  defaultValue={this.state.valueSection}
                />
              </Form.Field> */}
            </Form.Group>
          </Form>
        </Toolbar>
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={15}
              tablet={15}
              className='staff-table1'
            >
              <ReactTable
                data={this.state.subjectMappingData ? this.state.subjectMappingData : []}
                showPageSizeOptions={false}
                defaultPageSize={5}
                columns={[
                  {
                    Header: 'Subject',
                    accessor: 'label'
                  },
                  {
                    Header: 'Teacher',
                    Cell: props => <OmsSelect
                      isMulti
                      placeholder='Select Teacher'
                      options={teacherData}
                      defaultValue={defaultValue[props.original.value]}
                      change={(e, a) => this.handleClickTeacher(props.original.value, e, a)}
                    />,
                    style: {
                      overflow: 'visible',
                      minHeight: '200px'
                    }
                  }
                ]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={15} mobile={15} tablet={15}>
              <Button onClick={this.handleClickSave} color='green'>
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AssignSubjectTeacher))
