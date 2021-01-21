import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid, withStyles, Button } from '@material-ui/core'
import axios from 'axios'
import ReactTable from 'react-table'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import MaximizeIcon from '@material-ui/icons/Maximize'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from './gSelectorConfig'
import { OmsSelect } from '../../../ui'
import { apiActions } from '../../../_actions'

import { urls } from '../../../urls'

const styles = {

  root: {
    width: '100%'
    // marginTop: spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  }

}
class StudentReviews extends Component {
  constructor () {
    super()
    this.state = {
      selectorData: {},
      pageSize: 10,
      currentPage: 1,
      page: 1,
      teacherName: [],
      mappedGrades: [],
      principalView: [],
      sortedOption: [],
      StudentView: []

    }

    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.principalView = this.principalView.bind(this)
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') {
      this.principalView()
    }
  }
  fetchData = (state, e, instance) => {
    if (this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') {
      this.principalView(state)
    } else if (this.state.selectorData.branch_id) {
      this.StudentReviewView(state)
    }
  }

  principalView (state, pageSize) {
    let url = urls.StudentReview
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize,
          grade_id: this.state.selectorData.grade_id,
          subject_id: this.state.subjectId
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          // this.state.principalView.push(res.data.result)
          this.setState({
            principalView: res.data.result,
            pageIndex: 0,
            pages: res.data.total_pages,
            page: res.data.current_page
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  StudentReviewView (state, pageSize) {
    let url = urls.StudentReview
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          branch_id: this.state.selectorData.branch_id,
          grade_id: this.state.selectorData.grade_id,
          subject_id: this.state.selectorData.subject_id,
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          // this.state.principalView.push(res.data.result)
          this.setState({
            StudentView: res.data.result,
            pageIndex: 0,
            pages: res.data.total_pages,
            page: res.data.current_page
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  downloadExcel = () => {
    let url = urls.StudentReview
    axios
      .get(url, {
        params: {
          branch_id: this.state.selectorData.branch_id,
          excel: 'true'
        },
        responseType: 'arraybuffer',
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'WeeklyFeedbackRatings.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
      })
  }

  onChange = (data) => {
    let { selectorData } = this.state
    console.log(selectorData, 'sele')
    console.log((data, 'data'))

    this.setState({ selectorData: data })
  }
  handleClickSubject = event => {
    var aSubject = []
    // event.forEach(function (subject) {
    //   aSubject.push(subject.value)
    // })
    this.setState({ subjectData: aSubject, valueSubject: event, subjectId: event.value })
  };

  ratingComparison = props => {
    if (props.original && props.original.previous_weeks && props.original.previous_weeks.length) {
      if (props.value === props.original.previous_weeks[0].average_rating) {
        return (
          <span > {props.value} <MaximizeIcon style={{ marginBottom: '-14px', color: 'orange' }} /> </span>
        )
      } else if (props.value < props.original.previous_weeks[0].average_rating) {
        return (
          <span > {props.value} <ArrowDownwardIcon style={{ marginBottom: '-6px', color: 'red' }} /></span>
        )
      } else if (props.value > props.original.previous_weeks[0].average_rating) {
        return (
          <span> {props.value}   <ArrowUpwardIcon style={{ marginBottom: '-6px', color: 'green' }} /></span>

        )
      } else {
        return <spna>-</spna>
      }
    }
    return props.value
  }
  render () {
    console.log(this.state.principalView, 'prinicipalview')
    console.log(this.state.data, 'branch')
    console.log(this.state.teacherName, 'teacherName')
    console.log(this.state.mappedGrades, 'mappedGrades')
    console.log(this.state.subjectId, 'subject')
    console.log(this.state.sortedOption, 'sorted data')
    console.log(this.state.sortedOption.map(it => it.id), 'state id')

    return (
      <React.Fragment>
        <Grid container spacing={2} className='online__class--grid-container'>
          <Grid item>
            <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
          </Grid>

          <div style={{ marginTop: '8px' }}>
            {(this.role !== 'Subjecthead' && this.role !== 'Admin' && this.role !== 'Planner') && <OmsSelect
              label='Subject'
              placeholder='Select..'
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
            />}
          </div>
          {(this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') ? <Button variant='contained' style={{ marginTop: '34px', marginLeft: '18px' }} color='primary' onClick={() => this.principalView(this.state.page || 1)}>
            FILTER
          </Button>
            : <div>
              <Button variant='contained' color='primary' style={{ marginTop: '34px', marginLeft: '18px' }} onClick={() => this.StudentReviewView(this.state.page || 1)}>
          FILTER
              </Button>
            </div>}
          <Button variant='contained' color='primary' style={{ marginTop: '34px', marginLeft: '18px' }} disabled={(this.state.selectorData && !this.state.selectorData.branch_id) || (this.state.selectorData && this.state.selectorData.grade_id) || (this.state.subjectId) || (this.state.selectorData && this.state.selectorData.subject_id)} onClick={this.downloadExcel}>
                Download Excel Report
          </Button>
        </Grid>
        {(this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') ? <ReactTable
          columns={[
            {
              Header: 'Teacher  Name',
              accessor: 'teacher_info.name',
              sortable: true

            },
            {
              Header: 'Mapped Grades',
              accessor: 'teacher_info.grade_mappings',
              Cell: props => {
                return (
                  props.value.map(e => `${e}, `)
                )
              }
            },
            {
              Header: 'Current Week Overall Rating',
              accessor: 'this_week.this_weeks_average_rating',
              sortable: true,
              Cell: props => {
                console.log(props, 'propsss')
                return (<span>{props.value ? this.ratingComparison(props) : '-'}</span>)
              }
            },
            {
              Header: 'Last Week Overall Rating',
              accessor: 'previous_weeks[0].average_rating',
              Cell: props => <span className='number'>{props.value ? props.value : '-'}</span>,
              sortable: true

            }
          ]}
          manual
          onFetchData={this.fetchData}
          data={this.state.principalView}
          defaultPageSize={2}
          showPageSizeOptions={false}
          pages={this.state.pages}
          pageSize={this.state.pageSize}
          page={this.state.page - 1}

        />
          : <ReactTable
            columns={[
              {
                Header: 'Teacher  Name',
                accessor: 'teacher_info.name',
                sortable: true
              },
              {
                Header: 'Mapped Grades',
                accessor: 'teacher_info.grade_mappings',
                Cell: props => {
                  return (
                    props.value.map(e => `${e}, `)
                  )
                }
              },
              {
                Header: 'Current Week Overall Rating',
                accessor: 'this_week.this_weeks_average_rating',
                sortable: true,
                Cell: props => {
                  console.log(props, 'propsss')
                  return (<span>{ props.value ? this.ratingComparison(props) : '-'}</span>)
                }
              },
              {
                Header: 'Last Week Overall Rating',
                accessor: 'previous_weeks[0].average_rating',
                Cell: props => <span className='number'>{props.value ? props.value : '-'}</span>,
                sortable: true
              }
            ]}
            manual
            onFetchData={this.fetchData}
            data={this.state.StudentView}
            sorted={this.state.sortedOption}
            onSortedChange={(e) => this.setState({ sortedOption: e })}
            // defaultPageSize={2}
            showPageSizeOptions={false}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            page={this.state.page - 1}
          />}
      </React.Fragment>

    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  subject: state.subjects.items

})
const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withRouter(StudentReviews)))
