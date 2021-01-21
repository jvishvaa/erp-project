import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid, Button, FormControlLabel } from '@material-ui/core'
import axios from 'axios'
import moment from 'moment'
import ReactTable from 'react-table'
import ClearIcon from '@material-ui/icons/Clear'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import { COMBINATIONS } from './interestStatsCombinations'
import { apiActions } from '../../_actions'
import GSelect from '../../_components/globalselector'
// import { OmsSelect } from '../../ui'
import { urls } from '../../urls'

class ClassInterestStats extends Component {
  constructor () {
    super()
    this.state = {
      pageSize: 10,
      page: 1,
      selectorData: {},
      studentDetails: [],
      loading: false,
      subjectId: null,
      startDate: null,
      endDate: null,
      pageNumber: 0,
      gSelectKey: new Date().getTime()
    }
    this.fetchData = this.fetchData.bind(this)
  }
  componentDidMount () {
    let today = new Date()
    let datediff = moment(today).format('YYYY-MM-DD')
    let dateupdate = moment(today).add(-7, 'day').format('YYYY-MM-DD')
    // this.setState({ startDate: dateupdate, endDate: da })
    console.log(today, dateupdate, datediff)
    axios
      .get(urls.classinterestStats, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.data.data)
        console.log(res.data.total_pages)
        this.setState({ data: res.data.data, pages: res.data.total_pages })
      }).catch(err => {
        console.log(err)
        this.props.alert.error('No Guest Student')
      })
  }
  getClassInterestStats (pageNUm) {
    let url = urls.classinterestStats
    axios
      .get(url, {
        params: {
          page_number: (Number(pageNUm || 0) + 1),
          page_size: this.state.pageSize,
          is_download: 'False',
          grade_id: this.state.selectorData.grade_id,
          subject_id: this.state.selectorData.subject_id ? this.state.selectorData.subject_id : null,
          branch_id: this.state.selectorData.branch_id ? this.state.selectorData.branch_id : null,
          start_date: this.state.startDate ? this.state.startDate : null,
          end_date: this.state.endDate ? this.state.endDate : null,
          is_optional: this.state.is_optional === true ? 'True' : null,
          is_assigned_to_parent: this.state.is_assigned_to_parent === true ? 'True' : null,
          guest_students_attendee_count: this.state.guest_students_attendee_count === true ? 'True' : null
        },
        headers: {
          Authorization: 'Bearer ' + this.props.user }
      }).then(res => {
        console.log(res.data.data)
        this.setState({ data: res.data.data, pages: res.data.total_pages, pageSize: res.data.page_size, pageNumber: pageNUm })
      }).catch(err => {
        console.log(err)
        this.props.alert.error('Group has already been Assigned')
      })
  }
  clearData=() => {
    this.setState({ gSelectKey: new Date().getTime(), startDate: '', endDate: '', selectorData: {}, data: [], pages: 1, pageNumber: 0 })
  }
  GuestStudentDetails (state, pageSize) {
    let url = urls.classinterestStats
    pageSize = pageSize || this.state.pageSize
    this.setState({ pageNumber: 0 })
    console.log(state)
    axios
      .get(url, {
        params: {
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize,
          is_download: 'False',
          grade_id: this.state.selectorData.grade_id,
          subject_id: this.state.selectorData.subject_id ? this.state.selectorData.subject_id : null,
          branch_id: this.state.selectorData.branch_id ? this.state.selectorData.branch_id : null,
          start_date: this.state.startDate ? this.state.startDate : null,
          end_date: this.state.endDate ? this.state.endDate : null,
          is_optional: this.state.is_optional === true ? 'True' : null,
          is_assigned_to_parent: this.state.is_assigned_to_parent === true ? 'True' : null,
          guest_students_attendee_count: this.state.guest_students_attendee_count === true ? 'True' : null

        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ data: res.data.data,
            pages: res.data.total_pages,
            page: res.data.current_page,
            pageNumber: res.data.current_page - 1,
            loading: false
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  handleChangeDate= (value, type) => {
    if (type === 'start') {
      this.setState({ startDate: value })
    } else {
      this.setState({ endDate: value })
    }
  }
    fetchData = (state, instance) => {
      this.setState({ loading: true })
    }
      onChange = (data) => {
        let { selectorData } = this.state
        console.log(selectorData, data)
        this.setState({ selectorData: data })
      }
      onChangeSubject = (e) => {
        let subjectIds = []
        if (e && e.value) {
          e.forEach(function (subject) {
            subjectIds.push(subject.value)
            this.setState({ subjectId: e.value })
          })
          console.log(subjectIds)
        }
      }
      changedHandler = (name, event) => {
        this.setState({ [name]: event.target.checked }, () => {
        })
        if (this.state.optional === true) {

        }
      }
      handletXlsReports = (id) => {
        let { selectorData } = this.state
        let path = ''
        path += `?is_download=${'True'}`
        path += selectorData.grade_id ? `&grade_id=${selectorData.grade_id}` : ''
        path += selectorData.branch_id ? `&branch_id=${selectorData.branch_id}` : ''
        path += selectorData.subject_id ? `&subject_id=${selectorData.subject_id}` : ''
        path += this.state.startDate ? `&start_date=${this.state.startDate}` : ''
        path += this.state.endDate ? `&end_date=${this.state.endDate}` : ''
        path += this.state.is_optional === true ? `&is_optional=${'True'}` : ''
        path += this.state.is_assigned_to_parent === true ? `&is_assigned_to_parent=${'True'}` : ''
        path += this.state.guest_students_attendee_count === true ? `&guest_students_attendee_count=${'True'}` : ''
        this.downloadXlsReport(path)
      }
      downloadXlsReport = (path) => {
        axios.get(`${urls.classinterestStats}${path}`, {
          responseType: 'arraybuffer',
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'ClassInterestStatistics.xls'
            link.click()
          })
          .catch(err => {
            console.log(err)
          })
      }

      render () {
        console.log(this.state.studentDetails, 'student')

        return (
          <div position='static' color='default' style={{ marginBottom: 20, padding: '10px 10px 0px 10px', backgroundColor: '#f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', margin: '0px 10px' }} />
            <GSelect key={this.state.gSelectKey} variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
            <div style={{ margin: '10px 10px' }}>
              <TextField
                value={this.state.startDate}
                id='start-date'
                label='From date'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(event) => { this.handleChangeDate(event.target.value, 'start') }}
              />
            </div>
            <div style={{ margin: '10px 10px' }}>
              <TextField
                value={this.state.endDate}
                id='end-date'
                label='To date'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(event) => {
                  this.handleChangeDate(event.target.value, 'end')
                }}
              />
            </div>
            <div style={{ margin: '10px 10px' }}>
              <Button
                style={{ margin: 5 }}
                onClick={this.clearData}
                variant='outlined'
                color='primary'
                size='small'
              >
                <ClearIcon />
            Clear
              </Button>
            </div>
            <Grid item>
              <Button variant='contained' style={{ 'margin-left': '230px', 'margin-top': ' -121px' }} color='primary' onClick={() => this.setState({ loading: true }, () => {
                this.GuestStudentDetails(this.state.page || 1)
              })}>
           APPLY FILTER
              </Button>
              &nbsp; &nbsp;
              <Button variant='contained'
                style={{ 'margin-top': ' -121px' }}
                color='primary'
                onClick={this.handletXlsReports}
                target='_blank'>
                          Download Excel
              </Button>
            </Grid>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.optional}
                    onChange={(e) => this.changedHandler('is_optional', e)}
                    color='primary'
                  />
                }
                label='Show Optional Classes'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.parent}
                    onChange={(e) => this.changedHandler('is_assigned_to_parent', e)}
                    color='primary'
                  />
                }
                label='Show Classes for Parents'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.guestStudents}
                    onChange={(e) => this.changedHandler('guest_students_attendee_count', e)}
                    color='primary'
                  />
                }
                label='GuestStudent Classes Only'
              />
            </div>
            <ReactTable
              columns={[
                {
                  Header: 'Title',
                  accessor: 'online_class.title'
                },
                {
                  Header: <div>Date</div>,
                  accessor: 'online_class.join_time'
                //   Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                },
                {
                  Header: <div>Tutor Name</div>,
                  accessor: 'online_class.tutor_list',
                  Cell: props => <span className='number'>{props.value ? (JSON.parse(props.value).join()) : 'NIL'}</span>
                },
                {
                  Header: 'Subject',
                  accessor: 'online_class.subject.subject_name'
                },
                {
                  Header: <div>Limit</div>,
                  accessor: 'online_class.join_limit'
                //   Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                },

                {
                  Header: <div>Assigned to</div>,
                  accessor: 'roles'
                //   Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                },
                {
                  Header: <div>Restricted Count</div>,
                  accessor: 'restricted_data'
                //   Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                },
                {
                  Header: <div>Interested Count</div>,
                  accessor: 'interested_data'
                //   Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                }

              ]}
              manual
              data={this.state.data}
              defaultPageSize={this.state.pageSize}
              showPageSizeOptions={false}
              pages={this.state.pages}
              pageSize={this.state.pageSize}
              onPageChange={(pNo) => { this.getClassInterestStats(pNo) }}
              style={{ maxWidth: '100%' }}
              showPagination
              page={this.state.pageNumber}
            />
            {/* </React.Fragment> */}
          </div>
        )
      }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items,
  subject: state.subjects.items

})

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects()),
  listGrades: dispatch(apiActions.listGrades())

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClassInterestStats))
