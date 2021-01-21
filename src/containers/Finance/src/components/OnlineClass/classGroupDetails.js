import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid, Button } from '@material-ui/core'
import axios from 'axios'
import ReactTable from 'react-table'
import { apiActions } from '../../_actions'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './combination'
import { urls } from '../../urls'

class ClassGroupDetails extends Component {
  constructor () {
    super()
    this.state = {
      pageSize: 10,
      page: 1,
      selectorData: {},
      currentPage: 1,
      studentDetails: [],
      // pageIndex: null
      loading: false

    }
    this.fetchData = this.fetchData.bind(this)
  }
  componentDidMount () {
    this.setState({ loading: true }, () => {
      this.GuestStudentDetails()
    })
  }

  GuestStudentDetails (state, pageSize) {
    let url = urls.GuestStudentDetails
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          page_no: state && state.page ? state.page + 1 : 1,
          page_size: pageSize,
          is_download: 'False',
          grade_ids: this.state.selectorData.grade_id
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ studentDetails: res.data.data,
            pageIndex: 0,
            pages: res.data.total_pages,
            page: res.data.current_page,
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
  fetchData = (state, instance) => {
    this.setState({ loading: true })
    this.GuestStudentDetails(state)
  }

    onChange = (data) => {
      let { selectorData } = this.state
      console.log(selectorData, data)
      this.setState({ selectorData: data })
    }
    handletXlsReports = (id) => {
      let { selectorData, pageSize, currentPage } = this.state
      let path = ''
      path += `?page_size=${pageSize}`
      path += `&page_no=${currentPage}`
      path += `&is_download=${'True'}`
      path += selectorData.grade_id ? `&grade_ids=${selectorData.grade_id}` : ''
      path += `&Is_delete=${'True'}`

      this.downloadXlsReport(path)
    }
    downloadXlsReport = (path) => {
      axios.get(`${urls.GuestStudentDetails}${path}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res.data)
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'guest_classgrp_report.xlsx'
          link.click()
        })
        .catch(err => {
          console.log(err)
          // logError(err)
        })
    }

    render () {
      console.log(this.state.studentDetails, 'student')

      return (
        <React.Fragment>
          <Grid container spacing={2} className='online__class--grid-container'>
            <Grid item>
              <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
            </Grid>
          </Grid>
          <Grid item>
            <Button variant='contained' style={{ 'margin-left': '230px', 'margin-top': ' -121px' }} color='primary' onClick={() => this.setState({ loading: true }, () => {
              this.GuestStudentDetails(this.state.page || 1)
            })}>
         APPLY FILTER
            </Button>
            &nbsp; &nbsp;
            <Button
              style={{ 'margin-top': ' -121px' }}
              color='primary'
              onClick={this.handletXlsReports}
              target='_blank'>
                        Download Excel
            </Button>
          </Grid>
          <ReactTable
            columns={[
              {
                Header: 'Name',
                accessor: 'name'
              },
              {
                Header: <div>User Name</div>,
                accessor: 'user.username',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Date Of Join</div>,
                accessor: 'user.date_joined',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: 'Grade',
                accessor: 'grade.grade'
              },
              {
                Header: <div>Phone Number</div>,
                accessor: 'phone_number',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },

              {
                Header: <div>Email</div>,
                accessor: 'email_address',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Date Of Birth</div>,
                accessor: 'date_of_birth',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Gender</div>,
                accessor: 'gender',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Address</div>,
                accessor: 'address',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>City</div>,
                accessor: 'city',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>School</div>,
                accessor: 'school',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Pincode</div>,
                accessor: 'pincode',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              },
              {
                Header: <div>Status</div>,
                accessor: 'status',
                Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
              }

            ]}
            manual
            onFetchData={this.fetchData}
            loading={this.state.loading}
            data={this.state.studentDetails}
            defaultPageSize={5}
            // showPageSizeOptions={false}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            // page={this.state.page}
            page={this.state.page - 1}
          />
        </React.Fragment>

      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items

})

const mapDispatchToProps = dispatch => ({
  listGrades: dispatch(apiActions.listGrades())

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClassGroupDetails))
