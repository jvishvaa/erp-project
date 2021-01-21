import React, { Component } from 'react'
import { Grid, Form } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core/'

import ReactTable from 'react-table'

import { withRouter } from 'react-router-dom'

import '../../components/css/staff.css'
import { qBUrls } from '../../urls'
import { OmsSelect } from '../../../src/ui'
import { apiActions } from '../../_actions'

const columns = [
  {
    Header: 'Sr',
    accessor: 'sr',
    Cell: (row) => {
      return <div>{row.index + 1}</div>
    },
    maxWidth: 60

  },
  {
    Header: 'User Name',
    accessor: 'user_username',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Email',
    accessor: 'user_email',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Subject',
    accessor: 'subject_name',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Grade',
    accessor: 'grade_name',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'MCQ Published',
    accessor: 'mcq_publish',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'MCQ Drafted',
    accessor: 'mcq_draft',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'MCQ Total',
    accessor: 'mcq_total',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Comp Published',
    accessor: 'comp_publish',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Comp Drafted',
    accessor: 'comp_draft',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  },
  {
    Header: 'Comp Total',
    accessor: 'comp_total',
    Cell: props => <span >{props.value ? props.value : 'NIL'}</span>

  }
]

class dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      grade: '',
      subject: '',
      startDate: '',
      endDate: '',
      disabledRight: false,
      disabledLeft: true,
      loading: false,
      datas: [],
      totalPages: 0,
      page: 0
    }
  }

  componentDidMount () {
    this.props.listGrades()
    this.props.listSubjects()
  }

  reactData=() => {
    console.log('react data')

    this.setState({ loading: true })

    let { grade, subject, startDate, endDate } = this.state
    axios
      .get(
        qBUrls.Dashboard +
        '?grade=' +
        grade +
        '&subject=' +
        subject +
        '&date_from=' +
        startDate +

        '&date_to=' +
        endDate +
        '&page_no=' +
          1,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        this.setState({
          datas: res.data.count_details,
          totalPages: res.data.total_page_count

        })
        if (res.data.count_details.length === 0) {
          this.props.alert.warning('No Data')
        }
        console.log(res.data.count_details, res.data.total_page_count)
      })
  }
  tableViewChange=(pageNo) => {
    console.log('page no', pageNo)
    let { grade, subject, startDate, endDate } = this.state
    axios
      .get(
        qBUrls.Dashboard +
        '?grade=' +
        grade +
        '&subject=' +
        subject +
        '&date_from=' +
        startDate +
        '&date_to=' +
        endDate +
        '&page_no=' +
        pageNo,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        this.setState({
          datas: res.data.count_details,
          totalPages: res.data.total_page_count
        })
      })
  }

  render () {
    console.log(this.state.data && this.state.data.count_details, 'khhjd')

    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column
              floated='left'
              computer={4}
              mobile={4}
              tablet={4}
            >
              <label className='student-addStudent-segment1-heading'>
                          Dashboard
              </label>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form onChange={this.handleFormChange}>
          <Grid>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <label>Subject*</label>
                <OmsSelect
                  options={
                    this.props.subjects
                      ? this.props.subjects.map(subject => ({
                        value: subject.id,
                        label: subject.subject_name
                      }))
                      : null
                  }
                  change={state =>
                    this.setState({ subject: state.value, valueGrade: [] })
                  }
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <label>Grade*</label>
                <OmsSelect
                  defaultValue={this.state.valueGrade}
                  options={
                    this.props.grades
                      ? this.props.grades.map(grade => ({
                        value: grade.id,
                        label: grade.grade
                      }))
                      : null
                  }
                  change={state =>
                    this.setState({ grade: state.value, valueGrade: state }
                    )
                  }
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  className='form-control'
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  className='form-control'
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Button
                  color='purple'
                  content='Get Data'
                  onClick={this.reactData}
                >Get data</Button>

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>

        {this.state.datas && (
          <React.Fragment>
            <ReactTable

              showPageSizeOptions={false}
              defaultPageSize={6}
              data={this.state.datas}
              style={{ maxWidth: '100%' }}
              columns={columns}
              page={this.state.page}
              pages={this.state.totalPages}
              onPageChange={(a) => {
                this.setState({
                  page: a,
                  loading: true }, () => { this.tableViewChange(a + 1) })
              }}

            />

          </React.Fragment>
        )}

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listGrades: () => dispatch(apiActions.listGrades()),
  listSubjects: () => dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(dashboard))
